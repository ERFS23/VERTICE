#!/usr/bin/env python3
"""Monta o Segundo Cérebro: lê um arquivo de notas (JSON) e gera um único .html
que abre direto no navegador, com o grafo interativo e as notas embutidas.

Uso:
    python build_brain.py notas.json -o segundo-cerebro.html --nome "Ana"

Formato de notas.json (lista, ou {"notes": [...]}):
    {"title": "...", "body": "markdown com [[links]]", "pasta": "Área / Subárea",
     "tags": ["conceito", ...], "type": "nota|mapa|conceito|projeto|fonte|pessoa|diario"}

Só usa a biblioteca padrão do Python.
"""
import argparse
import hashlib
import json
import re
import sys
import time
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
TEMPLATE = HERE.parent / "assets" / "cerebro-template.html"
TYPES = {"nota", "mapa", "conceito", "projeto", "fonte", "pessoa", "diario"}

# Segredos e telefones nunca entram no cérebro: o arquivo pode ser compartilhado.
SECRETS = [
    (re.compile(r"sk-(?:ant-|proj-)?[\w-]{20,}"), "[chave omitida]"),
    (re.compile(r"eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}"), "[token omitido]"),
    (re.compile(r"\b(?:re|ghp|gho|xox[abp]|AKIA)[_-]?[A-Za-z0-9_]{16,}"), "[chave omitida]"),
    (re.compile(r"((?:senha|password|api[ _-]?key|token)[^\n:=]{0,20}[:=\-–]\s*)\S+", re.I), r"\1[omitido]"),
    (re.compile(r"(?:\+?55\s?)?\(?\b\d{2}\)?\s?9?\d{4}[-\s]?\d{4}\b"), "[telefone omitido]"),
]


def redact(text):
    for rx, rep in SECRETS:
        text = rx.sub(rep, text)
    return text


def norm(s):
    s = unicodedata.normalize("NFD", str(s).lower())
    return re.sub(r"\s+", " ", "".join(c for c in s if unicodedata.category(c) != "Mn")).strip()


def clean_tag(t):
    t = str(t).strip().lstrip("#").lower()
    return re.sub(r"\s+", "-", t)[:40]


def load(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    notes = data.get("notes", []) if isinstance(data, dict) else data
    if not isinstance(notes, list):
        sys.exit("O arquivo precisa ser uma lista de notas ou {\"notes\": [...]}.")
    return notes


def build(notes, nome):
    out, seen, now = [], set(), int(time.time() * 1000)
    for i, n in enumerate(notes):
        if not isinstance(n, dict):
            continue
        title = re.sub(r"\s+", " ", str(n.get("title", "")).strip()).replace("[", "(").replace("]", ")")[:200]
        if not title:
            continue
        base, k = title, 2
        while norm(title) in seen:  # títulos únicos: os [[links]] dependem deles
            title = f"{base} ({k})"
            k += 1
        seen.add(norm(title))
        body = redact(str(n.get("body", "")))[:150000]
        typ = n.get("type") if n.get("type") in TYPES else "nota"
        tags = []
        for t in n.get("tags", []) or []:
            t = clean_tag(t)
            if t and t not in tags:
                tags.append(t)
        pasta = " / ".join(p.strip().replace("/", "-") for p in str(n.get("pasta", "")).split("/") if p.strip())[:200]
        ts = n.get("created") or n.get("updated") or now
        out.append({"id": f"seed-{i}", "title": title, "body": body, "type": typ, "tags": tags[:24],
                    "fav": bool(n.get("fav")), "pasta": pasta, "src": str(n.get("src", ""))[:400],
                    "created": ts, "updated": n.get("updated") or ts})
    if not out:
        sys.exit("Nenhuma nota válida (cada nota precisa de pelo menos um título).")
    html = TEMPLATE.read_text(encoding="utf-8")
    seed = json.dumps(out, ensure_ascii=False).replace("</", "<\\/")  # não fechar o <script> por acidente
    seed_id = hashlib.sha1(seed.encode()).hexdigest()[:12]
    title = f"Segundo Cérebro de {nome}" if nome else "Segundo Cérebro"
    html = html.replace('window.CEREBRO_SEED_ID = "vazio"', f'window.CEREBRO_SEED_ID = "{seed_id}"', 1)
    html = html.replace("<title>Segundo Cérebro</title>", f"<title>{title.replace('<', '')}</title>", 1)
    a, b = html.index("/*SEED*/"), html.index("/*FIM*/")
    html = html[:a] + seed + html[b + len("/*FIM*/"):]
    return html, out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("notas")
    ap.add_argument("-o", "--saida", default="segundo-cerebro.html")
    ap.add_argument("--nome", default="")
    a = ap.parse_args()
    html, notes = build(load(a.notas), a.nome)
    Path(a.saida).write_text(html, encoding="utf-8")
    pastas = {n["pasta"].split(" / ")[0] for n in notes if n["pasta"]}
    links = sum(len(re.findall(r"\[\[[^\]]+\]\]", n["body"])) for n in notes)
    print(f"OK: {a.saida} — {len(notes)} notas, {len(pastas)} pastas, {links} links [[...]].")


if __name__ == "__main__":
    main()
