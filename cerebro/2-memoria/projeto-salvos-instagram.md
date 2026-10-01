---
titulo: Projeto — Salvos do Instagram → Notion
camada: memoria
area: conteudo
atualizado: 2026-09-25
fonte: https://app.notion.com/p/3eb30eaeef22810db346ea2bc00a8461
---

# Projeto — Salvos do Instagram → Notion

Sistema que transforma os salvos do Instagram em biblioteca no Notion (baseado nos PDFs da @amandamoita_). Criado em 25/09/2026. Área: [[area-conteudo]].

## Onde está

- Código: `C:\Users\Elias Rfs\salvos-notion` (venv próprio, Python 3.13; transcrição com faster-whisper small na CPU).
- Página raiz no Notion: [Biblioteca de Referências IG](https://app.notion.com/p/3e630eaeef2281e59baaecb389823ec5).

## Decisões

- UM banco "Vídeos analisados" para as duas contas, com campo "Conta IG".
- Hierarquia: Coleção → Tópico (detectado pela IA e reaproveitado) → página do vídeo (Resumo, Insights, gancho, estrutura, legenda, transcrição).
- @elias.serrano.rfs: extração única (não é diária). Coleções: reflexão, vendas, direito, advogado, inteligência artificial.
- @serranoconteudo: sincronização diária de Viral + Publi.
- Coleções no Notion: Reflexão, Direito, Inteligência Artificial, Advogado, Viral, Vendas, Publi.

## Fatos técnicos (Instagram web, 09/2026)

- Não funcionam mais: `/collections/list/`, `/feed/collection/{id}/`; `/users/{id}/info/` dá erro 429.
- Funcionam: `/feed/saved/posts/` (filtrar por `saved_collection_ids`) e `/accounts/edit/web_form_data/`.
- O id da coleção vem da URL do navegador `/saved/<slug>/<id>/`.

## Como roda

- A análise usa a assinatura (não a API paga), via o `claude.exe` do app desktop. Precisa do token gerado por `claude setup-token` (o Elias configura sozinho em `configurar.py` / `importar-sessao.py`).
- A tarefa agendada do Windows o próprio Elias cria.
- Próximos passos (em [[tarefas]]): `salvos.py status` → `colecoes` → `importar --limite 1` → conferir Notion → lotes de 20.
