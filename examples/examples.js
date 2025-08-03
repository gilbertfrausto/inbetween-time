import {
  createIteratorState,
  createRunner,
  lerp,
  pause,
  resume,
  wait,
} from '../src/inbetween-time-immutable.js';

// --- Simple Animation ---

const simpleBox = document.getElementById('simple-animation-box');

const simpleAnimationState = createIteratorState({
  timer: 16, // ~60fps
  count: 200,
  method: () => {
    const currentLeft = parseInt(simpleBox.style.left || '0', 10);
    simpleBox.style.left = `${currentLeft + 2}px`;
  },
});

createRunner(simpleAnimationState);

// --- Complex Animation ---

const complexContainer = document.getElementById('complex-animation-container');
const NUM_BOXES = 10;

for (let i = 0; i < NUM_BOXES; i++) {
  const box = document.createElement('div');
  box.className = 'complex-box';
  box.style.left = `${i * 40}px`;
  complexContainer.appendChild(box);

  const animationState = createIteratorState({
    timer: 10 + (i * 5), // Each box has a slightly different speed
    count: 150,
    method: () => {
      const currentTop = Math.sin(Date.now() / (200 + i * 20)) * 40 + 40;
      box.style.top = `${currentTop}px`;
    },
    onComplete: () => {
        // Restart the animation when it completes
        createRunner(animationState);
    }
  });

  createRunner(animationState);
}

// --- Lerp Example ---

const lerpContainer = document.getElementById('lerp-animation-container');

const lerpBox = document.createElement('div');
lerpBox.className = 'complex-box'; // Re-using the complex-box style
lerpBox.style.backgroundColor = 'purple';
lerpBox.style.left = '0px';
lerpBox.style.top = '0px';
lerpContainer.appendChild(lerpBox);

let startX = 0;
let endX = 500;
const lerpDuration = 3000; // milliseconds
let lerpStartTime = 0;

const lerpAnimationState = createIteratorState({
  timer: 16, // ~60fps
  count: Infinity, // Run indefinitely
  method: () => {
    if (lerpStartTime === 0) {
      lerpStartTime = Date.now();
    }

    const elapsed = Date.now() - lerpStartTime;
    let t = elapsed / lerpDuration;

    if (t > 1) {
      t = 1; // Clamp t to 1
      lerpStartTime = Date.now(); // Reset for continuous loop
    }

    const currentX = lerp(startX, endX, t);
    lerpBox.style.left = `${currentX}px`;

    if (t === 1) {
        // Swap start and end for ping-pong effect
        [startX, endX] = [endX, startX];
    }
  },
});

const runner = createRunner(lerpAnimationState);
setTimeout(() => {
  wait(runner, 3000);
  console.log('test');
}, 1000);

lerpContainer.addEventListener('mouseenter', () => {
  runner.dispatch((state) => pause(state))
});

lerpContainer.addEventListener('mouseleave', () => {
  runner.dispatch((state) => resume(state))
});