(function () {
  'use strict';

  var stage     = document.getElementById('stage');
  var pages     = {
    1: document.getElementById('page1'),
    2: document.getElementById('page2'),
    3: document.getElementById('page3'),
    4: document.getElementById('page4'),
    5: document.getElementById('page5')
  };
  var cleanBase = document.getElementById('cleanBase');
  var plane     = document.getElementById('plane');
  var faceLayer = document.getElementById('faceLayer');
  var iconHots  = Array.prototype.slice.call(document.querySelectorAll('.hot.icon'));
  var covers    = Array.prototype.slice.call(document.querySelectorAll('.hot.cover'));
  var exprs     = Array.prototype.slice.call(document.querySelectorAll('.hot.expr'));

  var audio = new Audio();
  audio.loop = true;
  audio.volume = 0.5;
  var curTrack = '';

  var curPage = 0;

  /* ---------- 舞台等比适配，杜绝拉伸与错位 ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 16, window.innerHeight / 9);
    stage.style.width  = Math.round(s * 16) + 'px';
    stage.style.height = Math.round(s * 9) + 'px';
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  fit();

  /* ---------- 页面切换 ---------- */
  function show(n) {
    if (curPage === n) {
      if (n === 4) startPlane();      // 重复点击地球图标：重播入场动效
      return;
    }
    Object.keys(pages).forEach(function (k) {
      pages[k].classList.remove('on');
      pages[k].classList.remove('anim');
    });

    var el = pages[n];
    el.classList.add('on');
    void el.offsetWidth;
    el.classList.add('anim');

    curPage = n;

    covers.forEach(function (c) { c.classList.toggle('on', n === 3); });
    exprs.forEach(function (c) { c.classList.toggle('on', n === 5); });

    if (n !== 3) {
      audio.pause();
    }
    if (n !== 5) {
      faceLayer.style.opacity = 0;     // 离开换装页时复位为设计稿原始表情
    }
    if (n === 4) {
      startPlane();
    } else {
      resetPlane();
    }
  }

  /* ---------- 图4 飞机入场动效 ---------- */
  function startPlane() {
    cleanBase.style.opacity = 1;
    plane.style.animation = 'none';
    void plane.offsetWidth;
    plane.style.animation = 'flyIn 1.6s cubic-bezier(.18,.75,.25,1) .18s both';
  }

  function resetPlane() {
    plane.style.animation = 'none';
    plane.style.opacity = 0;
    cleanBase.style.opacity = 0;
  }

  plane.addEventListener('animationend', function () {
    // 飞机就位：隐藏切图与无飞机底图，立即露出设计稿原图（位置完全重合，切换无缝）
    plane.style.animation = 'none';
    plane.style.opacity = 0;
    cleanBase.style.opacity = 0;
  });

  /* ---------- 左侧图标：点击跳转 ---------- */
  iconHots.forEach(function (el) {
    el.addEventListener('click', function () {
      var act = el.dataset.act;
      if (act === 'none') return;              // 设计稿中该图标无对应页面
      show(parseInt(act.slice(1), 10));
    });
  });

  /* ---------- 图3：鼠标移到专辑封面切换播放对应音乐 ---------- */
  covers.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      var t = el.dataset.track;
      if (curTrack !== t) {
        curTrack = t;
        audio.src = t;
        audio.currentTime = 0;
      }
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    });
    el.addEventListener('mouseleave', function () {
      audio.pause();
    });
    el.addEventListener('click', function () {
      var t = el.dataset.track;
      if (curTrack !== t) {
        curTrack = t;
        audio.src = t;
        audio.currentTime = 0;
      }
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    });
  });

  /* ---------- 图5：点击表情方块改变人物表情 ---------- */
  // 预加载四张五官局部 patch，避免首次点击闪烁
  [1, 2, 3, 4].forEach(function (i) {
    var im = new Image();
    im.src = 'assets/expr_' + i + '.png';
  });

  exprs.forEach(function (el) {
    el.addEventListener('click', function () {
      faceLayer.src = 'assets/expr_' + el.dataset.face + '.png';
      faceLayer.style.opacity = 1;
    });
  });

  /* ---------- 初始：默认首页（图1），支持 #p2~#p5 直达 ---------- */
  var m = /^#p([1-5])$/.exec(location.hash);
  show(m ? parseInt(m[1], 10) : 1);
})();
