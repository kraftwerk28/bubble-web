'use strict';

const buttonWaveColor = 'rgba(255, 255, 255, 0.5)'

window.onresize = () => {
  Array.prototype.forEach.call(document.getElementsByClassName('button-canvas'),
    el => {
      el.offset = el.parentElement.getBoundingClientRect();
    });
};

const fillcanvas = (el) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  canvas.className = 'button-canvas';
  canvas.top = el.offsetTop;
  canvas.left = el.offsetLeft;
  canvas.width = el.clientWidth;
  canvas.height = el.clientHeight;
  el.appendChild(canvas);
  return [canvas, ctx];
};

const waveSpeed = 1000 / 50;

const checkboxes = document.getElementsByClassName('checkbox');

Array.prototype.forEach.call(checkboxes, el => {
  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  div1.appendChild(div2);
  el.appendChild(div1);
  el.onclick = () => {
    el.checked = !el.checked;
    if (el.checked) {
      div2.className = 'checked';
    } else {
      div2.className = '';
    }
  }
});


const inputText = document.getElementsByClassName('input-text');

Array.prototype.forEach.call(inputText, el => {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', el.getAttribute('placeholder'));
  el.appendChild(input);
  const [canvas, ctx] = fillcanvas(el);

  canvas.offset = el.getBoundingClientRect();
  const max = Math.max(canvas.width, canvas.height);
  ctx.fillStyle = window.getComputedStyle(input).borderColor;
  canvas.style.zIndex = '-1';
  let r = 0;
  let _e;

  const wave = (e, d) => {
    r += d;
    if (r < 0) r = 0;
    const [x, y] = [e.x - canvas.offset.x, e.y - canvas.offset.y];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.circle(x, y, r);
    ctx.globalCompositeOperation = 'copy';
    if (r > 0 && r < max) {
      setTimeout(() => {
        wave(e, d);
      }, waveSpeed);
    } else if (d < 0) {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  input.onmousedown = e => {
    if (input !== document.activeElement) {
      _e = e;
      r = max;
      wave(e, -20);
    }
  };
  input.onblur = () => {
    r = 0;
    wave(_e, 20);
  };
});


const bubbleClick = document.getElementsByClassName('wave-effect');

Array.prototype.forEach.call(bubbleClick, el => {
  const [canvas, ctx] = fillcanvas(el);
  ctx.fillStyle = 'white';
  canvas.offset = canvas.getBoundingClientRect();
  const max = Math.max(canvas.width, canvas.height);
  let r = 0;
  let pressed = false;
  let clock;
  const wave = (e, delta) => {
    r += delta;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const [x, y] = [e.x - canvas.offset.x, e.y - canvas.offset.y];
    ctx.globalAlpha = 10 / r;
    ctx.circle(x, y, r);
    if (r > 0 && r < max && delta !== 0) {
      clock = setTimeout(() => {
        wave(e, delta);
      }, waveSpeed);
    } else
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  canvas.onmousedown = e => {
    // clearTimeout(clock);
    pressed = true;
    r = max;
    wave(e, -max / 20);
  };
  canvas.onmouseup = e => {
    clearTimeout(clock);
    pressed = false;
    r = 10;
    wave(e, max / 20);
  };
});
