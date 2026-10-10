"""Transcreve o vídeo cru com tempo por palavra -> words.json (rode na SUA máquina).

  pip install faster-whisper
  python scripts/transcribe.py public/projects/<projeto>/raw.mp4 public/projects/<projeto>/words.json

Sem Whisper? Exporte a legenda automática do CapCut como .srt e use scripts/srt-to-captions.mjs.
"""
import json
import sys

from faster_whisper import WhisperModel

src, dst = sys.argv[1], sys.argv[2]
model = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else "small", device="cpu", compute_type="int8")
segments, _ = model.transcribe(src, language="pt", word_timestamps=True, vad_filter=True)
words = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for seg in segments for w in seg.words]
json.dump(words, open(dst, "w"), ensure_ascii=False)
print(" ".join(w["w"] for w in words))
