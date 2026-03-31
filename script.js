(function () {
  const card = document.getElementById("card");
  const hint = document.getElementById("hint");
  if (!card) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let raf = 0;
  let targetRx = 0;
  let targetRy = 0;
  let rx = 0;
  let ry = 0;

  function tick() {
    raf = 0;
    rx += (targetRx - rx) * 0.12;
    ry += (targetRy - ry) * 0.12;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (Math.abs(targetRx - rx) > 0.01 || Math.abs(targetRy - ry) > 0.01) {
      raf = requestAnimationFrame(tick);
    }
  }

  function scheduleTick() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX - cx) / (rect.width / 2);
    const y = (e.clientY - cy) / (rect.height / 2);
    targetRy = Math.max(-12, Math.min(12, x * 10));
    targetRx = Math.max(-10, Math.min(10, -y * 8));
    scheduleTick();
  }

  function onLeave() {
    targetRx = 0;
    targetRy = 0;
    scheduleTick();
  }

  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", onLeave);

  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
    if (hint) hint.textContent = "카드를 기울이거나 탭 후 자이로를 허용해 보세요.";
  }

  window.addEventListener(
    "deviceorientation",
    (e) => {
      if (e.gamma == null || e.beta == null) return;
      targetRy = Math.max(-12, Math.min(12, (e.gamma / 90) * 14));
      targetRx = Math.max(-10, Math.min(10, ((e.beta - 45) / 90) * -10));
      scheduleTick();
    },
    true
  );
})();
