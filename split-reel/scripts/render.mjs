// Junta palavras + cenas em props.json e renderiza o reel.
// Uso: node scripts/render.mjs <projeto> [--still=SEG]
//   public/projects/<projeto>/words.json    (ou captions.json com blocos {t,s,e})
//   public/projects/<projeto>/scenes.json   (capítulos + elementos)
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {toWords} from './chunks-to-words.mjs';

const name = process.argv[2];
if (!name) throw new Error('uso: node scripts/render.mjs <projeto> [--still=SEG]');
const dir = path.join('public/projects', name);
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const words = fs.existsSync(path.join(dir, 'words.json')) ? read('words.json') : toWords(read('captions.json'));
const props = {...read('scenes.json'), words};
fs.writeFileSync(path.join(dir, 'props.json'), JSON.stringify(props, null, 1));

const browser = process.env.REMOTION_BROWSER ?? (fs.existsSync('/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell') ? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' : null);
const still = process.argv.find((a) => a.startsWith('--still='));
const common = ['remotion/index.ts', 'SplitReel', `--props=${path.join(dir, 'props.json')}`, ...(browser ? [`--browser-executable=${browser}`] : [])];
fs.mkdirSync('out', {recursive: true});
if (still) {
  const sec = parseFloat(still.split('=')[1]);
  execFileSync('npx', ['remotion', 'still', ...common, `out/${name}-${sec}s.png`, `--frame=${Math.round(sec * 30)}`], {stdio: 'inherit'});
} else {
  execFileSync('npx', ['remotion', 'render', ...common, `out/${name}.mp4`, '--codec=h264', '--crf=18'], {stdio: 'inherit'});
}
