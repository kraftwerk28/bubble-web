(() => {
  'use strict';

  const buttonWaveColor = 'rgba(255, 255, 255, 0.5)'
  const iterate = (iterable, fn) => {
    Array.prototype.forEach.call(iterable, fn)
  };

  window.onresize = () => {
    iterate(document.getElementsByClassName('button-canvas'),
      el => {
        el.offset = el.parentNode.getBoundingClientRect();
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

  iterate(checkboxes, el => {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.appendChild(div2);
    el.appendChild(input);
    el.appendChild(div1);
    input.onchange = () => {
      if (input.checked)
        el.setAttribute('checked', '');
      else
        el.removeAttribute('checked');
    };
  });

  const radios = document.getElementsByClassName('radio');

  iterate(radios, el => {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.appendChild(div2);
    el.appendChild(input);
    el.appendChild(div1);

    if (el.getAttribute('name'))
      input.setAttribute('name', el.getAttribute('name'));

  });


  const inputText = document.getElementsByClassName('input-text');

  iterate(inputText, el => {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder',
      el.getAttribute('placeholder') ? el.getAttribute('placeholder') : '');
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

  const dropdowns = document.getElementsByClassName('dropdown');

  iterate(dropdowns, el => {
    let t, h;
    el.showing = false;
    el.children[0].style.display = 'none';
    el.onclick = (e) => {
      if (e.target === el) {
        el.showing = !el.showing;
        if (el.showing) {
          clearTimeout(h);
          el.firstElementChild.style.display = 'block';
          iterate(el.firstElementChild.children, (li, i) => {
            li.style.animationName = 'dropdown-li';
            li.style.pointerEvents = 'auto';
            li.style.animationDelay = i * 50 + 'ms';
          });
          el.style.width = el.firstElementChild.offsetWidth;
        } else {
          el.style.width = 'initial';
          iterate(el.firstElementChild.children, (li, i) => {
            li.style.animationName = 'dropdown-li-back';
            li.style.pointerEvents = 'none';
            li.style.animationDelay =
              (el.firstElementChild.children.length - i) * 50 + 'ms';
          });
          h = setTimeout(() => {
            el.firstElementChild.style.display = 'none';
          }, 500);
        }
      }

    };
    el.onmouseleave = () => {
      t = setTimeout(() => {
        if (el.showing)
          el.click();
      }, 1000);
    };
    el.onmouseenter = () => {
      clearTimeout(t);
    };
  });

  const bubbleClick = [
    ...document.getElementsByClassName('wave-effect'),
    ...document.getElementsByClassName('dropdown')
  ]

  iterate(bubbleClick, el => {
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

})();
