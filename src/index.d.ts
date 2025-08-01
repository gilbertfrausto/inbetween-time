
export interface InbetweenTimeSpec {
  timer: number;
  count: number;
  method: () => void;
  onComplete?: () => void;
}

export interface InbetweenTime {
  iterator: () => void;
  wait: (yieldTime: number) => void;
  getCount: () => number;
  getInterations: () => number;
  setCount: (changed: number) => void;
  completed: () => boolean;
  pause: () => void;
  resume: () => void;
}

export default function inBetweenTime(spec: InbetweenTimeSpec): InbetweenTime;
