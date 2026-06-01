/* ===========================================================================
   Horizon landing — interactive menu-bar preview.
   Vanilla port of the prototype's `useHorizon` hook + V2 popover behaviour.
   No dependencies, no build step.
   =========================================================================== */
(function () {
  "use strict";

  var EVERY_OPTS = [15, 20, 25, 30, 45, 60]; // minutes between breaks
  var LEN_OPTS = [20, 30, 45, 60];           // seconds per break
  var RING_C = 2 * Math.PI * 62.5;           // ring circumference (r = 62.5)
  var PAUSE_TOTAL = 60 * 60;                 // "pause for 1 hour"

  var state = {
    everyMin: 20,
    lenSec: 20,
    launch: true,
    paused: false,
    secs: 12 * 60 + 34, // matches the prototype's starting countdown (12:34)
    pauseSecs: PAUSE_TOTAL,
    flash: false,
  };

  var el = {
    arc: document.getElementById("ringArc"),
    time: document.getElementById("v2Time"),
    sub: document.getElementById("v2Sub"),
    cap: document.getElementById("v2Cap"),
    btnBreak: document.getElementById("btnBreak"),
    btnPause: document.getElementById("btnPause"),
    everyVal: document.getElementById("everyVal"),
    lenVal: document.getElementById("lenVal"),
    sw: document.getElementById("swLaunch"),
    stepEvery: document.getElementById("stepEvery"),
    stepLen: document.getElementById("stepLen"),
    cta: document.getElementById("cta"),
    ctaSoon: document.getElementById("ctaSoon"),
  };

  function fmt(s) {
    s = Math.max(0, Math.round(s));
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ":" + String(sec).padStart(2, "0");
  }

  function setDisabled(stepEl, atMin, atMax) {
    stepEl.querySelector('[data-dir="-1"]').disabled = atMin;
    stepEl.querySelector('[data-dir="1"]').disabled = atMax;
  }

  function render() {
    var total = state.everyMin * 60;
    var progress = 1 - state.secs / total;                 // 0..1 toward next break
    var frac = state.paused ? 1 - state.pauseSecs / PAUSE_TOTAL : progress;

    el.arc.style.strokeDashoffset = (RING_C * (1 - frac)).toFixed(2);
    el.arc.setAttribute("stroke", state.paused ? "rgba(0,0,0,0.28)" : "var(--ac)");

    el.time.textContent = state.paused ? fmt(state.pauseSecs) : fmt(state.secs);
    el.time.classList.toggle("flash", state.flash);
    el.sub.textContent = state.paused ? "paused" : "min : sec";
    el.cap.textContent = state.paused
      ? "Resuming soon — enjoy the focus."
      : "until you rest your eyes";
    el.btnPause.textContent = state.paused ? "Resume now" : "Pause for 1 hour";

    el.everyVal.textContent = state.everyMin + " min";
    el.lenVal.textContent = state.lenSec + " sec";

    el.sw.classList.toggle("on", state.launch);
    el.sw.setAttribute("aria-pressed", String(state.launch));

    var ei = EVERY_OPTS.indexOf(state.everyMin);
    var li = LEN_OPTS.indexOf(state.lenSec);
    setDisabled(el.stepEvery, ei <= 0, ei >= EVERY_OPTS.length - 1);
    setDisabled(el.stepLen, li <= 0, li >= LEN_OPTS.length - 1);
  }

  // --- timers --------------------------------------------------------------
  // Break countdown ticks every second unless paused; wraps to a fresh cycle.
  setInterval(function () {
    if (state.paused) return;
    state.secs = state.secs <= 1 ? state.everyMin * 60 : state.secs - 1;
    render();
  }, 1000);

  // Pause countdown only runs while paused; auto-resumes when it hits zero.
  var pauseTimer = null;
  function startPauseTimer() {
    if (pauseTimer) return;
    pauseTimer = setInterval(function () {
      if (!state.paused) { clearInterval(pauseTimer); pauseTimer = null; return; }
      if (state.pauseSecs <= 1) {
        state.paused = false;
        state.pauseSecs = PAUSE_TOTAL;
        clearInterval(pauseTimer); pauseTimer = null;
        render();
        return;
      }
      state.pauseSecs -= 1;
      render();
    }, 1000);
  }

  // --- handlers ------------------------------------------------------------
  el.btnBreak.addEventListener("click", function () {
    state.flash = true;
    state.secs = state.everyMin * 60; // reset the cycle, like "take a break now"
    render();
    setTimeout(function () { state.flash = false; render(); }, 1100);
  });

  el.btnPause.addEventListener("click", function () {
    if (state.paused) {
      state.paused = false;
      if (pauseTimer) { clearInterval(pauseTimer); pauseTimer = null; }
    } else {
      state.paused = true;
      state.pauseSecs = PAUSE_TOTAL;
      startPauseTimer();
    }
    render();
  });

  function stepHandler(opts, key, onChange) {
    return function (e) {
      var btn = e.target.closest("button[data-dir]");
      if (!btn || btn.disabled) return;
      var i = opts.indexOf(state[key]);
      var n = Math.min(opts.length - 1, Math.max(0, i + Number(btn.dataset.dir)));
      state[key] = opts[n];
      if (onChange) onChange();
      render();
    };
  }
  // "Break every" also resets the running countdown (matches changeEvery()).
  el.stepEvery.addEventListener("click", stepHandler(EVERY_OPTS, "everyMin", function () {
    state.secs = state.everyMin * 60;
  }));
  el.stepLen.addEventListener("click", stepHandler(LEN_OPTS, "lenSec", null));

  el.sw.addEventListener("click", function () {
    state.launch = !state.launch;
    render();
  });

  // --- CTA: no build yet, so reveal a subtle "coming soon" note ------------
  if (el.cta && el.ctaSoon) {
    el.cta.addEventListener("click", function (e) {
      e.preventDefault();
      el.ctaSoon.hidden = false;
      // next frame so the transition runs from the hidden state
      requestAnimationFrame(function () { el.ctaSoon.classList.add("show"); });
    });
  }

  render();
})();
