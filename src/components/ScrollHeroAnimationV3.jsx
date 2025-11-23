import React, { useState, useEffect, useRef, useCallback } from 'react';

const ScrollHeroAnimation = ({ 
  path = "/frames",
  maxFrames = 807,
  preloadFrames = 20,
  containerHeight = "300vh",
  startFrame = 1
}) => {
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const containerRef = useRef(null);
  const frameCache = useRef(new Map());

  // Precargar frames iniciales
  useEffect(() => {
    for (let i = startFrame; i < startFrame + preloadFrames && i <= maxFrames; i++) {
      const frameId = i.toString().padStart(4, '0');
      if (!frameCache.current.has(frameId)) {
        const img = new Image();
        img.src = `${path}/${frameId}.webp`;
        frameCache.current.set(frameId, img);
      }
    }
  }, [path, maxFrames, preloadFrames, startFrame]);

  // Cargar frame específico
  const loadFrame = useCallback((frameNumber) => {
    const frameId = frameNumber.toString().padStart(4, '0');
    
    if (!frameCache.current.has(frameId)) {
      const img = new Image();
      img.src = `${path}/${frameId}.webp`;
      frameCache.current.set(frameId, img);
    }
    
    return frameCache.current.get(frameId);
  }, [path]);

  // Calcular progreso del scroll
  const getScrollProgress = useCallback(() => {
    if (!containerRef.current) return 0;

    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollWithinContainer = scrollY - containerTop;
    const maxScroll = containerHeight - windowHeight;
    const progress = scrollWithinContainer / maxScroll;

    return Math.max(0, Math.min(1, progress));
  }, []);

  // Actualizar frame basado en scroll
  const updateFrame = useCallback(() => {
    const progress = getScrollProgress();
    const totalFrames = maxFrames - startFrame + 1;
    const frameNumber = Math.floor(progress * totalFrames) + startFrame;
    const clampedFrame = Math.min(maxFrames, Math.max(startFrame, frameNumber));

    if (clampedFrame !== currentFrame) {
      setCurrentFrame(clampedFrame);
      
      const nextFrame = clampedFrame + 1;
      if (nextFrame <= maxFrames) {
        loadFrame(nextFrame);
      }
    }
  }, [getScrollProgress, maxFrames, startFrame, currentFrame, loadFrame]);

  // Manejar scroll con requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateFrame();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateFrame();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [updateFrame]);

  const currentFrameId = currentFrame.toString().padStart(4, '0');
  const currentFrameSrc = `${path}/${currentFrameId}.webp`;

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        height: containerHeight,
        width: '100%'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <img
          src={currentFrameSrc}
          alt={`Frame ${currentFrame}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000',
            display: 'block',
            willChange: 'transform'
          }}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default ScrollHeroAnimation;