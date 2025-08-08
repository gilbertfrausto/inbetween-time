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
  getIterations: () => number;
  setCount: (changed: number) => void;
  completed: () => boolean;
  pause: () => void;
  resume: () => void;
}

export function inBetweenTime(spec: InbetweenTimeSpec): InbetweenTime;

// Immutable Data-Oriented Version

export interface IteratorSpec {
  timer: number;
  count: number;
  method: () => void;
  onComplete?: () => void;
}

export interface IteratorState extends IteratorSpec {
  current: number;
  paused: boolean;
  isCompleted: boolean;
  lastTime: number;
}

export type StateTransformer = (state: IteratorState) => IteratorState;

export interface Runner {
  dispatch: (transformer: StateTransformer) => void;
  getState: () => IteratorState;
}

export function createIteratorState(spec: IteratorSpec): Readonly<IteratorState>;
export function pause(state: IteratorState): Readonly<IteratorState>;
export function resume(state: IteratorState): Readonly<IteratorState>;
export function setCount(state: IteratorState, newCount: number): Readonly<IteratorState>;
export function setTimer(state: IteratorState, newTimer: number): Readonly<IteratorState>;
export function tick(state: IteratorState, timestamp: number): Readonly<IteratorState>;
export function createRunner(initialState: IteratorState, onStateChange?: (newState: IteratorState) => void): Readonly<Runner>;
export function wait(runner: Runner, yieldTime: number): void;

declare const _default: {
  inBetweenTime: typeof inBetweenTime,
  createIteratorState: typeof createIteratorState,
  pause: typeof pause,
  resume: typeof resume,
  setCount: typeof setCount,
  setTimer: typeof setTimer,
  tick: typeof tick,
  createRunner: typeof createRunner,
  wait: typeof wait
};

export default _default;