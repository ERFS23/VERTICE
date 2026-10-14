#!/usr/bin/env python3
"""Monta o kit de exportação: export/CONHECIMENTO-COMPLETO.md (arquivo único para colar em outro agente)
e export/vertice-edicao-kit.zip (código + documentação, sem node_modules, vídeos ou out/).
Uso (na raiz de split-reel): python3 scripts/make-kit.py"""
import zipfile
from pathlib import Path

root = Path('.').resolve(); out = Path('export'); out.mkdir(exist_ok=True)
skill = root.parent / '.claude/skills/reel-tela-dividida/SKILL.md'
docs = [('LEIA-ME-AGENTE.md', root / 'LEIA-ME-AGENTE.md'), ('DOSSIE.md', root / 'DOSSIE.md'),
        ('ESTILO.md', root / 'ESTILO.md'), ('ESTILO-2.md', root / 'ESTILO-2.md'), ('SKILL.md (skill reel-tela-dividida)', skill)]
parts = ['# CONHECIMENTO COMPLETO — edição de vídeo, motion design e SFX (Vértice)\n\n'
         'Arquivo único para colar/anexar em outro agente. Contém, em ordem: ' + '; '.join(n for n, _ in docs) + '.\n']
for name, path in docs:
    parts.append(f'\n\n{"=" * 78}\n# ARQUIVO: {name}\n{"=" * 78}\n\n' + path.read_text())
code = ['scripts/sfx.py', 'scripts/render.mjs']
parts.append(f'\n\n{"=" * 78}\n# CÓDIGO-CHAVE (referência rápida; o kit .zip tem tudo)\n{"=" * 78}\n')
for c in code:
    parts.append(f'\n## {c}\n```{"python" if c.endswith(".py") else "js"}\n{(root / c).read_text()}\n```\n')
(out / 'CONHECIMENTO-COMPLETO.md').write_text(''.join(parts))

skip = {'node_modules', 'out', 'export', '.git'}
with zipfile.ZipFile(out / 'vertice-edicao-kit.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(root.rglob('*')):
        rel = f.relative_to(root)
        if f.is_dir() or skip & set(rel.parts) or f.suffix == '.mp4':
            continue
        z.write(f, f'split-reel/{rel}')
    z.write(skill, 'SKILL.md')
    z.write(root / 'LEIA-ME-AGENTE.md', 'LEIA-ME-PRIMEIRO.md')
print('kit:', [(p.name, p.stat().st_size // 1024, 'KB') for p in out.iterdir()])
