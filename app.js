/* ===========================================================================
   Horizon landing (v2). The control panel is a frozen snapshot, so the only
   live elements are the break-screen countdown and the first-launch dialog.
   No dependencies, no build step.
   =========================================================================== */
(function () {
  "use strict";

  function fmt(s) {
    s = Math.max(0, Math.round(s));
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ":" + String(sec).padStart(2, "0");
  }

  // --- break screen: loop a 20s countdown so the scene feels alive ---------
  var brk = document.getElementById("brkCount");
  if (brk) {
    var secs = 20;
    setInterval(function () {
      secs = secs <= 1 ? 20 : secs - 1;
      brk.textContent = fmt(secs);
    }, 1000);
  }

  // --- first-launch help dialog --------------------------------------------
  // Native <dialog>: built-in focus trap, Esc-to-close, focus return to trigger.
  var helpLink = document.getElementById("helpLink");
  var helpDialog = document.getElementById("helpDialog");
  var helpClose = document.getElementById("helpClose");
  if (helpLink && helpDialog) {
    helpLink.addEventListener("click", function () {
      if (typeof helpDialog.showModal === "function") helpDialog.showModal();
      else helpDialog.setAttribute("open", "");
    });
    if (helpClose) {
      helpClose.addEventListener("click", function () { helpDialog.close(); });
    }
    // Click on the backdrop (outside the card) closes the dialog.
    helpDialog.addEventListener("click", function (e) {
      var r = helpDialog.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right &&
                   e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) helpDialog.close();
    });
  }
})();
