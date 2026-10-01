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
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CEREBRO = RAIZ / "cerebro"
MODELO = Path(__file__).resolve().parent / "modelo.html"
SAIDA = Path(__file__).resolve().parent / "cerebro.html"

WIKI = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]")
NOTION = re.compile(r"\[([^\]]+)\]\((https://(?:app\.notion\.com|www\.notion\.so|notion\.so)/[^)\s]+)\)")
CODIGO = re.compile(r"```.*?```|`[^`\n]*`", re.S)
CAMADA_POR_PASTA = {"1-contexto": "contexto", "2-memoria": "memoria", "3-acao": "acao"}
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
    trecho = url.split("?")[0].rstrip("/").split("/")[-1]
    return "notion:" + trecho.split("-")[-1]


def montar():
    nos, ligacoes, quebrados, avisos = {}, [], [], []

    arquivos = sorted(CEREBRO.rglob("*.md"))
    for caminho in arquivos:
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
            "camada": meta.get("camada", CAMADA_POR_PASTA.get(pasta, "contexto")),
            "area": meta.get("area", "sistema"),
            "tipo": meta.get("tipo", ""),
            "atualizado": meta.get("atualizado", ""),
            "fonte": meta.get("fonte", ""),
            "caminho": str(caminho.relative_to(RAIZ)).replace("\\", "/"),
            "texto": corpo,
        }

    pares = set()

    def ligar(a, b, tipo):
        if a == b:
            return
        chave = tuple(sorted((a, b)))
        if chave in pares:
            return
        pares.add(chave)
        ligacoes.append({"source": a, "target": b, "tipo": tipo})

    areas = {n["area"]: n["id"] for n in nos.values() if n["tipo"] == "area"}
    centro = next((n["id"] for n in nos.values() if n["camada"] == "centro"), None)

    for no in list(nos.values()):
        if no["camada"] == "notion":
            continue
        texto = CODIGO.sub("", no["texto"])  # exemplos dentro de código não são links
        for alvo, _ in WIKI.findall(texto):
            alvo = alvo.strip()
            if alvo in nos:
                ligar(no["id"], alvo, "wiki")
            else:
                quebrados.append(f"{no['caminho']} → [[{alvo}]]")
        for titulo, url in NOTION.findall(texto):
            nid = id_notion(url)
            if nid not in nos:
                nos[nid] = {
                    "id": nid, "titulo": titulo.strip(), "camada": "notion", "area": no["area"],
                    "tipo": "notion", "atualizado": "", "fonte": "", "caminho": "", "texto": "", "url": url,
                }
            ligar(no["id"], nid, "notion")
        # todo arquivo fica preso à sua área (ou ao centro, se for do sistema)
        hub = areas.get(no["area"]) if no["area"] != "sistema" else centro
        if hub and no["tipo"] != "area":
            ligar(no["id"], hub, "area")
        if no["tipo"] == "area" and centro:
            ligar(no["id"], centro, "area")

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
    print(f"Painel gerado: {SAIDA.relative_to(RAIZ)}")
    print(f"  {arquivos} arquivos · {notion} páginas do Notion · {len(dados['ligacoes'])} ligações")
    for aviso in avisos:
        print(f"  aviso: {aviso}")
    for q in quebrados:
        print(f"  link quebrado: {q}")
    return 1 if quebrados else 0


if __name__ == "__main__":
    sys.exit(main())
