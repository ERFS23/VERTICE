import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {T, W, SPLIT} from './theme';
import {ReelProps} from './types';
import {Backdrop, ChapterTitle, Divider, Header} from './elements/Chrome';
import {Captions} from './elements/Captions';
import {Element} from './elements/Library';

export const SplitReel: React.FC<ReelProps> = (props) => {
  const {fps} = useVideoConfig();
  const brandTag = props.brandTag ?? 'Vértice';
  return (
    <AbsoluteFill style={{background: T.bg}}>
      {/* METADE DE BAIXO: vídeo cru, sem edição (o áudio vem dele) */}
      <div style={{position: 'absolute', top: SPLIT, left: 0, width: W, height: SPLIT, overflow: 'hidden'}}>
        <OffthreadVideo
          src={staticFile(props.video)}
          startFrom={Math.round((props.videoStart ?? 0) * fps)}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: props.objectPosition ?? '50% 35%'}}
        />
      </div>

      {/* METADE DE CIMA: motion graphics */}
      <div style={{position: 'absolute', top: 0, left: 0, width: W, height: SPLIT, overflow: 'hidden'}}>
        <Backdrop />
        {props.chapters.map((c, i) => (
          <ChapterTitleLayer key={i} chapter={c} />
        ))}
        {/* elementos podem atravessar capítulos (out > fim do capítulo): ficam na tela e só se movem */}
        {props.chapters
          .flatMap((c) => c.elements.map((el) => ({el, end: c.end})))
          .sort((a, b) => (a.el.type === 'cursor' ? 1 : 0) - (b.el.type === 'cursor' ? 1 : 0))
          .map(({el, end}, i) => (
            <Element key={i} el={el} chapterEnd={end} brandTag={brandTag} />
          ))}
        <Header chapters={props.chapters} />
      </div>

      <Divider />
      <Captions words={props.words} maxWords={props.captions?.maxWords} maxChars={props.captions?.maxChars} />
    </AbsoluteFill>
  );
};

const ChapterTitleLayer: React.FC<{chapter: ReelProps['chapters'][number]}> = ({chapter}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const t = frame / fps;
  if (t < chapter.start - 0.05 || t >= chapter.end) return null;
  const o = interpolate(t, [chapter.end - 0.2, chapter.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <ChapterTitle chapter={chapter} />
    </AbsoluteFill>
  );
};
