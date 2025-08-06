import { createIteratorState, createRunner, wait, pause, resume } from '../src/inbetween-time-immutable.js';

const Perlin = {
  noise: (function() {
    const p = new Array(512);
    const permutation = [ 151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    12,243,172,167,195,129,246,112,242,192,184, 93,181,49,156,176,248,155,215,110,
    24,241,199,101,154,106,107,114,153,218,221,104,127,236,193,205, 9,14,141,113,
    144,214,222,183,179,121,115,223,228,70,22,254,249,239,232,213,224,185,138,162,
    145,43,66,79,108,191,170,51,39,251, 97,235,210,98,45,81,163,44,90,15,131,13,
    201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,
    148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,
    149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,77,146,
    158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,
    54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,135,130,
    116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,5,202,38,
    147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,12,243,172,
    167,195,129,246,112,242,192,184, 93,181,49,156,176,248,155,215,110,24,241,199,
    101,154,106,107,114,153,218,221,104,127,236,193,205, 9,14,141,113,144,214,222,
    183,179,121,115,223,228,70,22,254,249,239,232,213,224,185,138,162,145,43,66,
    79,108,191,170,51,39,251, 97,235,210,98,45,81,163,44 ];
    for (let i = 0; i < 256 ; i++) p[256+i] = p[i] = permutation[i];

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp( t, a, b ) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
      const h = hash & 15;
      const u = h < 8 ? x : y,
        v = (h < 4) 
          ? y 
          : (h == 12) || (h == 14) 
            ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    }

    return function (x, y, z) {
      const X = Math.floor(x) & 255,
          Y = Math.floor(y) & 255,
          Z = Math.floor(z) & 255;
      x -= Math.floor(x);
      y -= Math.floor(y);
      z -= Math.floor(z);
      const u = fade(x),
          v = fade(y),
          w = fade(z);
      const A = p[X] + Y,
        AA = p[A] + Z,
        AB = p[A+1] + Z,
        B = p[X+1] + Y,
        BA = p[B] + Z,
        BB = p[B+1] + Z;

      return lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),
                                     grad(p[BA  ], x-1, y  , z   )),
                             lerp(u, grad(p[AB  ], x  , y-1, z   ),
                                     grad(p[BB  ], x-1, y-1, z   ))),
                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),
                                     grad(p[BA+1], x-1, y  , z-1 )),
                             lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                     grad(p[BB+1], x-1, y-1, z-1 ))));
    }
  })()
};

const canvas = document.getElementById('perlin-canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let zoff = 0;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mapToBlue(value) {
  const lightBlue = { r: 222, g: 555, b: 555 };
  const darkBlue = { r: 0, g: 0, b: 0 };

  const r = lerp(darkBlue.r, lightBlue.r, value);
  const g = lerp(darkBlue.g, lightBlue.g, value);
  const b = lerp(darkBlue.b, lightBlue.b, value);

  return { r, g, b };
}

const noiseState = createIteratorState({
  timer: 16, // ~60fps
  count: Infinity,
  method: () => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    let xoff = 0;
    for (let x = 0; x < width; x++) {
      let yoff = 0;
      for (let y = 0; y < height; y++) {
        const noise = Perlin.noise(xoff, yoff, zoff);
        const color = mapToBlue(noise);
        const index = (x + y * width) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
        yoff += 0.01;
      }
      xoff += 0.01;
    }
    zoff += 0.01;
    ctx.putImageData(imageData, 0, 0);
  },
});

const runner = createRunner(noiseState);

const waitButton = document.getElementById('wait-button');
waitButton.addEventListener('click', () => {
  wait(runner, 2000);
});

canvas.addEventListener('mouseenter', () => {
  runner.dispatch(pause);
});

canvas.addEventListener('mouseleave', () => {
  runner.dispatch(resume);
});
