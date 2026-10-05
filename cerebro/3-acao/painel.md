---
titulo: Painel
camada: acao
area: sistema
atualizado: 2026-10-04
---

# Painel

A aba **Painel** é o "painel de controle" do vídeo do Vittor: em vez de só um grafo bonito, mostra o que importa hoje.

## O que tem

- **Métricas:** números do negócio com meta, histórico e gráfico. Clique em *Atualizar* e informe o número do dia.
- **Tarefas:** criar, concluir, editar, adiar (1 dia ou 1 semana) e excluir. Filtro por área.
- **Briefing da manhã:** resumo do dia gerado a partir de tarefas, métricas e [[prioridades]].
- **Perguntar ao cérebro:** o Claude consulta os arquivos certos (pelo roteador) antes de responder.
- **Memória recente:** diários, decisões e notas registradas pelas conversas e pelo painel.
- **Conectar a uma conversa:** ver [[conectar-conversa]].

## Onde ficam os dados

Tarefas, métricas, memória e briefing ficam no **banco do artefato** (coleções `tarefas`, `metricas`, `memoria` e o documento `briefing/hoje`). Por isso o painel edita e qualquer conversa do Claude com o link lê e escreve nos mesmos dados.

Os arquivos de contexto continuam no repositório VERTICE (`cerebro/`) e entram no painel quando ele é regenerado.
