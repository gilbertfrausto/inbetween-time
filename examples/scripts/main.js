import {inBetweenTime, wait, createIteratorState, createRunner} from '../../src/index.js';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

//
// Simple Animation
//
const simpleBox = document.getElementById('simple-box');
let simplePosition = 0;
const simpleAnimation = inBetweenTime({
  timer: 16, // ~60fps
  count: 200,
  method: () => {
    simplePosition++;
    simpleBox.style.left = simplePosition + 'px';
  }
});
simpleAnimation.iterator();

//
// Complex Animation
//
const complexBox = document.getElementById('complex-box');
let complexPosition = 0;
let scale = 1;

const moveRight = inBetweenTime({
  timer: 16,
  count: 100,
  method: () => {
    complexPosition++;
    complexBox.style.left = complexPosition + 'px';
  },
  onComplete: () => {
    grow.iterator();
  }
});

const grow = inBetweenTime({
  timer: 16,
  count: 50,
  method: () => {
    scale += 0.01;
    complexBox.style.transform = `scale(${scale})`;
  },
  onComplete: () => {
    changeColor.iterator();
  }
});

const changeColor = inBetweenTime({
  timer: 16,
  count: 1,
  method: () => {
    complexBox.style.backgroundColor = 'red';
  },
  onComplete: () => {
    shrink.iterator();
  }
});

const shrink = inBetweenTime({
  timer: 16,
  count: 50,
  method: () => {
    scale -= 0.01;
    complexBox.style.transform = `scale(${scale})`;
  },
  onComplete: () => {
    moveLeft.iterator();
  }
});

const moveLeft = inBetweenTime({
  timer: 16,
  count: 100,
  method: () => {
    complexPosition--;
    complexBox.style.left = complexPosition + 'px';
  },
  onComplete: () => {
    // Animation complete
    console.log('Complex animation finished!');
  }
});

moveRight.iterator();

//
//  Complex Ball Animation, using new API
//
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

//
// WOLF SPRITE ANIMAITONS, using legacy API
//
let frame = 1;
let movePos = 0;
let left = false;
const wolfEntity = document.querySelector('#wolf');
const WOLF = {
  name: 'walk',
  frames: 20
};

//
// WOLF INSTANCE
//
const wolfWalk = inBetweenTime({
  timer: 18,
  count: Infinity,
  method: () => {
    // Getting the current frame, so we know what to remove. next frame so we can implement the next frame.
    // newFrame is going to be used to updated the current frame
    const { currentFrame, nextFrame, newFrame } = getFrame(frame, WOLF.frames, WOLF.name);
    frame = newFrame;
    wolfEntity.classList.remove(currentFrame);
    wolfEntity.classList.add(nextFrame);
    
    if (movePos > 300) {
      left = true;
    } else if (movePos <= -150) {
      left = false;
    }

    if (left) {
      movePos--;
      wolfEntity.style.transform = 'scaleX(1)';
    } else {
      movePos++;
      wolfEntity.style.transform = 'scaleX(-1)';
    }
    wolfEntity.style.left = movePos + 'px';
  }
});

//
// TAIL INSTANCE
//
let tailFrame = 1;
const tailEntity = document.querySelector('#tail');
const TAIL = {
  name: 'tail',
  frames: 40
};

const tailSwinging = inBetweenTime({
  timer: 18,
  count: Infinity,
  method: () => {
    const { currentFrame, nextFrame, newFrame } = getFrame(tailFrame, TAIL.frames, TAIL.name);
    tailFrame = newFrame;
    tailEntity.classList.remove(currentFrame);
    tailEntity.classList.add(nextFrame);
  }
});

//
// START BOTH ITERATORS
//
wolfWalk.iterator();
tailSwinging.iterator();

//
// ADD HOVER EVENTS
//
wolfEntity.addEventListener('mouseenter', () => {
  wolfWalk.pause();
  console.log('stop');
});

wolfEntity.addEventListener('mouseleave', () => {
  wolfWalk.resume();
  console.log('start');
});

function getFrame(thisFrame, maxFrame, animName) {
  const currentFrame = `${animName}-${thisFrame}`;
  const newFrame = (thisFrame === maxFrame) ? 1 : thisFrame += 1;
  const nextFrame = `${animName}-${newFrame}`;
  
  return Object.freeze({
    currentFrame,
    nextFrame,
    newFrame
  });
}
