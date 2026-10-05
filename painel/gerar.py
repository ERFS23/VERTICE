"""Gera o painel visual do segundo cérebro.

Lê todos os .md de cerebro/, monta o grafo (arquivos, links [[...]] e páginas do
Notion citadas) e grava painel/cerebro.html. Só usa a biblioteca padrão do Python.

Uso:
    python painel/gerar.py
    python painel/gerar.py --fragmento caminho.html   (versão sem <html>/<head>, para publicar como Artifact)
"""

import argparse
import json
import re
import sys
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CEREBRO = RAIZ / "cerebro"
MODELO = Path(__file__).resolve().parent / "modelo.html"
SAIDA = Path(__file__).resolve().parent / "cerebro.html"

WIKI = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]")
NOTION = re.compile(r"\[([^\]]+)\]\((https://(?:app\.notion\.com|www\.notion\.so|notion\.so)/[^)\s]+)\)")
CODIGO = re.compile(r"```.*?```|`[^`\n]*`", re.S)
CAMADA_POR_PASTA = {"1-contexto": "contexto", "2-memoria": "memoria", "3-acao": "acao", "4-biblioteca": "biblioteca"}
BRASILIA = timezone(timedelta(hours=-3))


def ler_cabecalho(texto):
    """Separa o cabeçalho (--- chave: valor ---) do corpo."""
    if not texto.startswith("---"):
        return {}, texto
    fim = texto.find("\n---", 3)
    if fim == -1:
        return {}, texto
    meta = {}
    for linha in texto[3:fim].strip().splitlines():
        if ":" in linha:
            chave, valor = linha.split(":", 1)
            meta[chave.strip()] = valor.strip()
    return meta, texto[fim + 4:].lstrip("\n")


def id_notion(url):
    achado = re.search(r"([0-9a-f]{32})", url.split("?")[0])
    if achado:
        return "notion:" + achado.group(1)
    return "notion:" + url.split("?")[0].rstrip("/").split("/")[-1].split("-")[-1]


def chave(texto):
    """Forma de comparar títulos: sem acento, minúsculo, espaços simples."""
    sem = "".join(c for c in unicodedata.normalize("NFD", texto or "") if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", sem.lower()).strip()


def montar():
    nos, ligacoes, quebrados, avisos = {}, [], [], []

    for caminho in sorted(CEREBRO.rglob("*.md")):
        meta, corpo = ler_cabecalho(caminho.read_text(encoding="utf-8"))
        pasta = caminho.relative_to(CEREBRO).parts[0]
        no_id = caminho.stem
        if no_id in nos:
            avisos.append(f"nome repetido: {caminho.relative_to(RAIZ)}")
            continue
        for campo in ("titulo", "camada", "area", "atualizado"):
            if campo not in meta:
                avisos.append(f"{caminho.relative_to(RAIZ)} sem '{campo}' no cabeçalho")
        nos[no_id] = {
            "id": no_id,
            "titulo": meta.get("titulo", no_id),
            "apelidos": [a.strip() for a in meta.get("apelidos", "").split(";") if a.strip()],
            "camada": meta.get("camada", CAMADA_POR_PASTA.get(pasta, "contexto")),
            "area": meta.get("area", "sistema"),
            "tipo": meta.get("tipo", ""),
            "genero": meta.get("genero", ""),
            "tags": [t.strip() for t in meta.get("tags", "").split(",") if t.strip()],
            "atualizado": meta.get("atualizado", ""),
            "fonte": meta.get("fonte", ""),
            "caminho": str(caminho.relative_to(RAIZ)).replace("\\", "/"),
            "texto": corpo,
            "_notion": [id_notion(t) for t in (meta.get("fonte", ""), meta.get("vertice_id", "")) if re.search(r"[0-9a-f]{32}", t)],
        }

    # [[alvo]] vale pelo nome do arquivo, pelo título ou por um apelido
    por_chave = {}
    for n in nos.values():
        for nome in [n["titulo"], *n["apelidos"]]:
            por_chave.setdefault(chave(nome), n["id"])
    # página do Notion que já virou arquivo no cérebro aponta para o arquivo
    por_notion = {nid: n["id"] for n in nos.values() for nid in n.pop("_notion")}

    def resolver(alvo):
        if alvo in nos:
            return alvo
        return por_chave.get(chave(alvo))

    pares, vizinhos = set(), {i: set() for i in nos}

    def ligar(a, b, tipo):
        if a == b:
            return
        par = tuple(sorted((a, b)))
        if par in pares:
            return
        pares.add(par)
        vizinhos.setdefault(a, set()).add(b)
        vizinhos.setdefault(b, set()).add(a)
        ligacoes.append({"source": a, "target": b, "tipo": tipo})

    areas = {n["area"]: n["id"] for n in nos.values() if n["tipo"] == "area"}
    centro = next((n["id"] for n in nos.values() if n["camada"] == "centro"), None)
    nucleo = {"centro", "contexto", "memoria", "acao"}

    for no in list(nos.values()):
        if no["camada"] == "notion":
            continue
        texto = CODIGO.sub("", no["texto"])  # exemplos dentro de código não são links
        for alvo, _ in WIKI.findall(texto):
            achado = resolver(alvo.strip())
            if achado:
                ligar(no["id"], achado, "wiki")
            else:
                quebrados.append(f"{no['caminho']} → [[{alvo.strip()}]]")
        for titulo, url in NOTION.findall(texto):
            nid = id_notion(url)
            if nid in por_notion:
                ligar(no["id"], por_notion[nid], "wiki")
                continue
            if nid not in nos:
                nos[nid] = {
                    "id": nid, "titulo": titulo.strip(), "apelidos": [], "camada": "notion", "area": no["area"],
                    "tipo": "notion", "genero": "", "tags": [], "atualizado": "", "fonte": "", "caminho": "",
                    "texto": "", "url": url,
                }
            ligar(no["id"], nid, "notion")
        # os arquivos do núcleo ficam presos à sua área (ou ao centro, se forem do sistema)
        if no["camada"] in nucleo:
            hub = areas.get(no["area"]) if no["area"] != "sistema" else centro
            if hub and no["tipo"] != "area":
                ligar(no["id"], hub, "area")
            if no["tipo"] == "area" and centro:
                ligar(no["id"], centro, "area")

    # grupos de notas soltos do resto: a nota mais ligada do grupo se prende à área
    visto = set()
    for inicio in list(nos):
        if inicio in visto:
            continue
        grupo, pilha = [], [inicio]
        while pilha:
            atual = pilha.pop()
            if atual in visto:
                continue
            visto.add(atual)
            grupo.append(atual)
            pilha.extend(vizinhos.get(atual, ()))
        if centro in grupo:
            continue
        principal = max(grupo, key=lambda i: (len(vizinhos.get(i, ())), nos[i]["genero"] == "mapa"))
        area = nos[principal]["area"]
        ligar(principal, areas.get(area) if area != "sistema" and area in areas else centro, "area")

    for n in nos.values():
        n.pop("apelidos") if not n["apelidos"] else None

    return {
        "gerado_em": datetime.now(BRASILIA).strftime("%Y-%m-%dT%H:%M"),
        "nos": list(nos.values()),
        "ligacoes": ligacoes,
    }, quebrados, avisos


def main():
    parser = argparse.ArgumentParser(description="Gera o painel do segundo cérebro.")
    parser.add_argument("--fragmento", help="também grava uma versão sem <html>/<head> neste caminho")
    args = parser.parse_args()

    dados, quebrados, avisos = montar()
    json_dados = json.dumps(dados, ensure_ascii=False).replace("</", "<\\/")
    fragmento = MODELO.read_text(encoding="utf-8").replace("__DADOS_DO_CEREBRO__", json_dados)

    pagina = (
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        "</head>\n<body>\n" + fragmento + "\n</body>\n</html>\n"
    )
    SAIDA.write_text(pagina, encoding="utf-8")
    if args.fragmento:
        Path(args.fragmento).write_text(fragmento, encoding="utf-8")

    arquivos = sum(1 for n in dados["nos"] if n["camada"] != "notion")
    notion = len(dados["nos"]) - arquivos
    biblioteca = sum(1 for n in dados["nos"] if n["camada"] == "biblioteca")
    print(f"Painel gerado: {SAIDA.relative_to(RAIZ)}")
    print(f"  {arquivos} arquivos ({biblioteca} na biblioteca) · {notion} páginas do Notion · {len(dados['ligacoes'])} ligações")
    for aviso in avisos:
        print(f"  aviso: {aviso}")
    for q in quebrados:
        print(f"  link quebrado: {q}")
    return 1 if quebrados else 0


if __name__ == "__main__":
    sys.exit(main())
