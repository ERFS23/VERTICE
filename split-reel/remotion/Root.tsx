import React from 'react';
import {Composition, CalculateMetadataFunction} from 'remotion';
import {SplitReel} from './SplitReel';
import {ReelProps} from './types';
import {W, H} from './theme';
import demo from '../public/projects/demo/props.json';

const FPS = 30;

const calc: CalculateMetadataFunction<ReelProps> = ({props}) => {
  const lastWord = props.words[props.words.length - 1]?.e ?? 0;
  const lastChapter = props.chapters[props.chapters.length - 1]?.end ?? 0;
  const sec = props.durationSec ?? Math.max(lastWord + 0.6, lastChapter);
  return {durationInFrames: Math.max(1, Math.ceil(sec * FPS))};
};

export const Root: React.FC = () => (
  <Composition
    id="SplitReel"
    component={SplitReel as unknown as React.FC<Record<string, unknown>>}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={300}
    defaultProps={demo as unknown as Record<string, unknown>}
    calculateMetadata={calc as unknown as CalculateMetadataFunction<Record<string, unknown>>}
  />
);
