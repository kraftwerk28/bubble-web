(() => {
  'use strict';

  const buttonWaveColor = 'rgba(255, 255, 255, 0.5)'
  const iterate = (iterable, fn) => {
    Array.prototype.forEach.call(iterable, fn)
  };

  window.onresize = () => {
    iterate(document.getElementsByClassName('button-canvas'),
      (el) => {
        el.offset = el.parentNode.getBoundingClientRect();
      });
  };

  const fillcanvas = (el, color) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.circle = (x, y, r) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    el.addEventListener('mousedown', () => {
      canvas.offset = canvas.getBoundingClientRect();
    });
    canvas.ontouchstart = canvas.onmousedown;
    canvas.className = 'button-canvas';
    el.appendChild(canvas);
    setTimeout(() => {
      canvas.top = el.offsetTop;
      canvas.left = el.offsetLeft;
      canvas.width = el.clientWidth;
      canvas.height = el.clientHeight;
      canvas.offset = canvas.getBoundingClientRect();
      if (color !== undefined)
        ctx.fillStyle = color;
      else
        ctx.fillStyle = 'white';
    }, 100);
    return [canvas, ctx];
  };

  const waveSpeed = 1000 / 50;

  const colors = document.querySelectorAll('button, .dropdown, .dropdown');

  iterate(colors, (el) => {
    const color = el.getAttribute('color');
    if (color) {
      el.style.backgroundColor = color;
    }
  });

  const checkboxes = document.getElementsByClassName('checkbox');

  iterate(checkboxes, (el) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.appendChild(div2);
    el.appendChild(input);
    el.appendChild(div1);
    input.onchange = (e) => {
      el.checked = input.checked;
    };
  });

  const radios = document.getElementsByClassName('radio');

  iterate(radios, (el) => {
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

  iterate(inputText, (el) => {

    let color = el.getAttribute('color');
    color = color ? color : 'orange';
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder',
      el.getAttribute('placeholder') ? el.getAttribute('placeholder') : '');
    el.appendChild(input);
    const div = document.createElement('div');
    div.className = 'wave-div-input';
    div.style.backgroundColor = color;
    input.style.borderColor = color;
    const s = Math.max(el.offsetWidth, el.offsetHeight);

    input.onmousedown = e => {
      if (input !== document.activeElement) {
        el.appendChild(div);
        div.style.width = div.style.height = 2 * s;
        div.style.left = e.clientX - el.offsetLeft - s;
        div.style.top = e.clientY - el.offsetTop - s;
        div.style.animationName = 'waveInputIn';
      }
    };
    input.onblur = () => {
      div.style.animationName = 'waveInputOut';
    };
  });

  const dropdowns = document.getElementsByClassName('dropdown');

  iterate(dropdowns, (el) => {
    let t, h;
    el.showing = false;
    el.firstElementChild.style.display = 'none';
    el.onclick = (e) => {
      if (e.target === el || e.target === el.lastElementChild) {
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

  const waveEffect = document.getElementsByClassName('wave');

  iterate(waveEffect, (el) => {
    const div = document.createElement('div');
    div.className = 'wave-div';
    const s = Math.max(el.offsetWidth, el.offsetHeight);

    el.onmousedown = (e) => {
      el.appendChild(div);
      div.style.width = div.style.height = 2 * s;
      div.style.left = e.clientX - el.offsetLeft - s;
      div.style.top = e.clientY - el.offsetTop - s;
      div.style.animationName = 'waveIn';
    };
    el.onmouseup = (e) => {
      div.style.left = e.clientX - el.offsetLeft - s;
      div.style.top = e.clientY - el.offsetTop - s;
      div.style.animationName = 'waveOut';
    };
  });
})();
