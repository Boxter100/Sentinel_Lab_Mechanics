document.querySelectorAll('.render-container').forEach(container => {
  const img = container.querySelector('img');

  const MAX_FRAMES = parseInt(container.dataset.max);
  const PRELOAD_FRAMES = parseInt(container.dataset.preload);
  const PATH = container.dataset.path;
  const START_FRAME = parseInt(container.dataset.startFrame) || 1;

  const frameCache = new Map();

  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function preloadInitialFrames() {
    for (let i = START_FRAME; i < START_FRAME + PRELOAD_FRAMES && i <= MAX_FRAMES; i++) {
      const id = i.toString().padStart(4, '0');
      const image = new Image();
      image.src = `${PATH}/${id}.webp`;
      frameCache.set(id, image);
    }
  }

  function loadFrame(id) {
    if (!frameCache.has(id)) {
      const image = new Image();
      image.src = `${PATH}/${id}.webp`;
      frameCache.set(id, image);
    }
    return frameCache.get(id);
  }

  function getScrollProgressInContainer() {
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollYWithin = scrollY - containerTop;
    const maxScroll = containerHeight - windowHeight;
    const progress = scrollYWithin / maxScroll;
    return Math.max(0, Math.min(1, progress));
  }

  const updateFrame = throttle(() => {
    const scrollFraction = getScrollProgressInContainer();
    // Calcular el frame actual sumando START_FRAME - 1
    const frameNum = Math.min(MAX_FRAMES, Math.max(START_FRAME, Math.floor(scrollFraction * (MAX_FRAMES - START_FRAME + 1) + START_FRAME)));
    const id = frameNum.toString().padStart(4, '0');
    const cachedImage = loadFrame(id);

    if (cachedImage.complete) {
      img.src = cachedImage.src;
    } else {
      cachedImage.onload = () => {
        img.src = cachedImage.src;
      };
    }
  }, 16);

  window.addEventListener("scroll", updateFrame);
  window.addEventListener("resize", updateFrame);
  window.addEventListener("load", () => {
    preloadInitialFrames();
    updateFrame();
  });
});
