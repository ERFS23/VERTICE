#!/usr/bin/env python3
"""Transforma a exportação de conversas do ChatGPT ou do Claude em notas para o Segundo Cérebro.

Uso:
    python chat_export_to_notes.py conversations.json -o conversas.json

- ChatGPT: Configurações → Controles de dados → Exportar dados → conversations.json (dentro do .zip)
- Claude:  Configurações → Privacidade → Exportar dados → conversations.json (dentro do .zip)

Cada conversa vira uma nota (pasta "Conversas com IA / <ano-mês>"), com o começo do que você
perguntou e um trecho das respostas. As palavras mais marcantes de cada conversa viram tags,
para o grafo ligar conversas sobre o mesmo assunto. Depois, a IA pode ler este arquivo e
criar notas de conceito (Mapas) que resumem e ligam os temas.

Só usa a biblioteca padrão do Python.
"""
import argparse
import json
import math
import re
import sys
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

STOP = set("""
a o os as um uma uns umas de do da dos das em no na nos nas por pelo pela pelos pelas para pra pro com sem
que se nao não sim mais menos muito muita muitos muitas pouco como quando onde quem qual quais porque porquê
isso isto esse essa esses essas este esta estes estas aquele aquela aquilo ele ela eles elas eu voce você voces
vocês meu minha meus minhas seu sua seus suas nosso nossa ser estar ter haver fazer pode podem posso quero
queria preciso tambem também ainda ja já so só bem bom boa sobre entre depois antes aqui ali agora entao então
cada todo toda todos todas tudo nada algo alguma algum outro outra outros outras mesmo mesma vai vou foi era
sao são tem temos esta está estao estão seria pode poderia exemplo forma parte coisa coisas vez vezes ate até
the and for you your with this that are was have from what how can will would should could about into there
their them they then than just like also more some any not but all one two use using get make need want
claude chatgpt gpt resposta pergunta texto ajuda obrigado obrigada ok sim claro
""".split())


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def words(text):
    return [w for w in re.findall(r"[a-zà-ú0-9]{4,}", text.lower()) if norm(w) not in STOP and not w.isdigit()]


def ts(v):
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return datetime.fromtimestamp(v, tz=timezone.utc)
    try:
        return datetime.fromisoformat(str(v).replace("Z", "+00:00"))
    except ValueError:
        return None


def chatgpt_messages(conv):
    mapping = conv.get("mapping") or {}
    node, out, guard = conv.get("current_node"), [], 0
    while node and node in mapping and guard < 10000:
        guard += 1
        m = mapping[node].get("message")
        if m and m.get("author", {}).get("role") in ("user", "assistant"):
            parts = (m.get("content") or {}).get("parts") or []
            text = "\n".join(p for p in parts if isinstance(p, str)).strip()
            if text:
                out.append((m["author"]["role"], text))
        node = mapping[node].get("parent")
    return list(reversed(out))


def claude_messages(conv):
    out = []
    for m in conv.get("chat_messages") or []:
        role = "user" if m.get("sender") == "human" else "assistant"
        text = m.get("text") or "\n".join(c.get("text", "") for c in m.get("content") or [] if isinstance(c, dict))
        if text.strip():
            out.append((role, text.strip()))
    return out


def convert(convs, max_body):
    raw = []
    for c in convs:
        if not isinstance(c, dict):
            continue
        msgs = chatgpt_messages(c) if "mapping" in c else claude_messages(c)
        if not msgs:
            continue
        title = (c.get("title") or c.get("name") or msgs[0][1][:60]).strip() or "Conversa sem título"
        when = ts(c.get("create_time") or c.get("created_at"))
        raw.append((title, when, msgs))
    if not raw:
        sys.exit("Não encontrei conversas. Envie o conversations.json de dentro do .zip da exportação.")
    # tags: termos mais característicos de cada conversa (tf-idf simples)
    docs = [Counter(words(t + " " + t + " " + " ".join(x for _, x in m))) for t, _, m in raw]
    df = Counter(w for d in docs for w in d)
    n = len(docs)
    notes = []
    for (title, when, msgs), d in zip(raw, docs):
        score = {w: c * math.log(n / df[w]) for w, c in d.items() if 2 <= df[w] <= max(2, n * 0.3)}
        tags = [w for w, _ in sorted(score.items(), key=lambda x: -x[1])[:4]]
        lines, size = [], 0
        for role, text in msgs:
            chunk = text if role == "user" else text[:600]
            line = f"**{'Eu' if role == 'user' else 'IA'}:** {chunk}"
            if size + len(line) > max_body:
                lines.append("…")
                break
            lines.append(line)
            size += len(line)
        month = when.strftime("%Y-%m") if when else "sem data"
        notes.append({"title": title[:180], "pasta": f"Conversas com IA / {month}", "type": "fonte", "tags": tags,
                      "body": "\n\n".join(lines),
                      "created": int(when.timestamp() * 1000) if when else None})
    return notes


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("export")
    ap.add_argument("-o", "--saida", default="conversas.json")
    ap.add_argument("--max", type=int, default=6000, help="tamanho máximo do texto de cada nota")
    a = ap.parse_args()
    data = json.loads(Path(a.export).read_text(encoding="utf-8"))
    convs = data if isinstance(data, list) else data.get("conversations", [])
    notes = convert(convs, a.max)
    Path(a.saida).write_text(json.dumps(notes, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"OK: {a.saida} — {len(notes)} conversas viraram notas.")


if __name__ == "__main__":
    main()
