"""Importa as notas do cérebro Vértice (artifact) para dentro do cérebro do Elias.

Recebe uma pasta com um .json por nota (formato do banco do Vértice:
title, body, type, tags, pasta, src, fav, created, updated) e grava um .md por nota:

- O catálogo de Skills vai para cerebro/3-acao/catalogo-skills/.
- O resto vai para cerebro/4-biblioteca/<pasta da nota no Vértice>/.
- Notas que já existem no cérebro (título igual ao `apelidos:` de um arquivo
  que não veio do Vértice) não são duplicadas: os links [[Título]] do Vértice
  passam a apontar para o arquivo que já existe.

Rodar de novo é seguro: cada nota guarda o `vertice_id` e é regravada no mesmo arquivo.

Uso:
    python painel/importar_vertice.py <pasta-com-os-json>
"""

import json
import re
import sys
import unicodedata
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CEREBRO = RAIZ / "cerebro"
BIBLIOTECA = CEREBRO / "4-biblioteca"
CATALOGO_SKILLS = CEREBRO / "3-acao" / "catalogo-skills"
BRASILIA = timezone(timedelta(hours=-3))
NOTION_ID = re.compile(r"(?:app\.notion\.com|notion\.so)/(?:[^)\s]*?)([0-9a-f]{32})")


def chave(texto):
    """Forma de comparar títulos: sem acento, minúsculo, espaços simples."""
    sem = "".join(c for c in unicodedata.normalize("NFD", texto or "") if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", sem.lower()).strip()


def slug(texto, limite=60):
    s = re.sub(r"[^a-z0-9]+", "-", chave(texto).encode("ascii", "ignore").decode()).strip("-")
    return (s[:limite].rstrip("-") or "nota")


def ler_cabecalho(caminho):
    texto = caminho.read_text(encoding="utf-8")
    if not texto.startswith("---"):
        return {}
    fim = texto.find("\n---", 3)
    meta = {}
    for linha in texto[3:fim].strip().splitlines():
        if ":" in linha:
            k, v = linha.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta


def area_da_skill(titulo):
    t = chave(titulo)
    for palavra, area in (("juridico", "juridico"), ("negocios", "vendas"), ("marketing", "vendas"),
                          ("conteudo", "conteudo"), ("video", "conteudo"), ("design", "sites"),
                          ("vercel", "sites"), ("estudo", "pessoal")):
        if palavra in t:
            return area
    return "sistema"


def area_pela_pasta(pasta, titulo):
    p = chave(pasta)
    if "biblioteca de referencias ig" in p:
        if "/ direito" in p or "/ advogado" in p:
            return "juridico"
        if "/ vendas" in p:
            return "vendas"
        return "conteudo"
    regras = (("exemplos", "sistema"), ("videos", "conteudo"), ("planejamento de conteudo", "conteudo"),
              ("direito", "juridico"), ("planejamento para estudantes", "pessoal"),
              ("treinamento de indicacao", "vendas"))
    for trecho, area in regras:
        if p.startswith(trecho) or f"/ {trecho}" in p:
            return area
    if "memoria / skills" in p or chave(titulo) == "skills":
        return area_da_skill(titulo)
    if "memoria" in p:
        return "conteudo"  # Ideias ainda não executadas, Reels postados, Roteiros de Reels
    return None


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    origem = Path(sys.argv[1])
    notas = []
    for f in sorted(origem.glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        d = d.get("data", d)
        if (d.get("title") or "").strip():
            notas.append((f.stem, d))

    # O que já existe no cérebro: títulos, apelidos, ids, área de cada página do Notion citada
    existentes, ids_usados, por_vertice_id, area_notion = {}, set(), {}, {}
    for caminho in CEREBRO.rglob("*.md"):
        meta = ler_cabecalho(caminho)
        ids_usados.add(caminho.stem)
        if meta.get("vertice_id"):
            por_vertice_id[meta["vertice_id"]] = caminho
            continue
        # só o apelido declara "esta nota do Vértice é este arquivo"; título igual pode ser outra coisa
        for t in meta.get("apelidos", "").split(";"):
            if t.strip():
                existentes[chave(t)] = caminho.stem
        for nid in NOTION_ID.findall(caminho.read_text(encoding="utf-8")):
            area_notion.setdefault(nid, meta.get("area", "sistema"))

    gravados, pulados, contagem = [], [], Counter()
    for vid, d in notas:
        titulo = re.sub(r"\s+", " ", d["title"]).strip()
        if chave(titulo) in existentes:
            pulados.append(f"{titulo} → {existentes[chave(titulo)]}.md")
            continue
        pasta = d.get("pasta", "")
        eh_skill = pasta.startswith("Notion / Memória") and (chave(titulo) == "skills" or "skills" in chave(pasta))
        nid = (NOTION_ID.findall(d.get("src", "")) or [None])[0]
        area = area_notion.get(nid) or area_pela_pasta(pasta, titulo) or "sistema"
        if eh_skill:
            area = area_da_skill(titulo)

        destino = por_vertice_id.get(vid)
        if not destino:
            if eh_skill:
                base = CATALOGO_SKILLS
            else:
                partes = [p for p in pasta.split(" / ") if p and p != "Notion"] or ["outras"]
                base = BIBLIOTECA.joinpath(*[slug(p, 40) for p in partes])
            raiz_nome = "catalogo-skills" if eh_skill and chave(titulo) == "skills" else slug(titulo)
            nome, n = raiz_nome, 2
            while nome in ids_usados:
                nome = f"{raiz_nome}-{n}"
                n += 1
            ids_usados.add(nome)
            destino = base / f"{nome}.md"

        atualizado = datetime.fromtimestamp((d.get("updated") or d.get("created") or 0) / 1000, BRASILIA)
        linhas = [
            "---",
            f"titulo: {titulo}",
            f"camada: {'acao' if eh_skill else 'biblioteca'}",
            f"area: {area}",
            f"genero: {d.get('type') or 'nota'}",
            f"atualizado: {atualizado:%Y-%m-%d}",
        ]
        if d.get("tags"):
            linhas.append("tags: " + ", ".join(d["tags"]))
        if d.get("src"):
            linhas.append(f"fonte: {d['src']}")
        if pasta:
            linhas.append(f"pasta_vertice: {pasta}")
        if d.get("fav"):
            linhas.append("favorito: sim")
        linhas += ["origem: vertice", f"vertice_id: {vid}", "---", ""]
        corpo = d.get("body", "").rstrip() + "\n"
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text("\n".join(linhas) + corpo, encoding="utf-8")
        gravados.append(destino)
        contagem[(area, "acao" if eh_skill else "biblioteca")] += 1

    print(f"{len(gravados)} notas gravadas, {len(pulados)} já existiam no cérebro (viraram apelido):")
    for p in pulados:
        print(f"  = {p}")
    for (area, camada), n in sorted(contagem.items()):
        print(f"  {camada:10} {area:11} {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
