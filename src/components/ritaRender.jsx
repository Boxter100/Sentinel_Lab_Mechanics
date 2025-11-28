import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';

function Model({ modelPath, autoRotate }) {
  const gltf = useGLTF(modelPath, true);
  const meshRef = useRef();

  useFrame(() => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={meshRef} object={gltf.scene} dispose={null} />;
}

function RitaRender({ modelPath = '/models/rita5.glb' }) {
  const [active, setActive] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef();
  const controlsRef = useRef();

  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setShowControls(true);
      return;
    }
    
    // Mostrar controles al activar
    setShowControls(true);
    
    // Ocultar después de 4 segundos de inactividad
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [active]);

  const handleMouseMove = () => {
    // Mostrar controles inmediatamente
    setShowControls(true);
    
    // Limpiar el timer anterior
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    
    // Crear nuevo timer para ocultar después de 4 segundos
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (direction) => {
    if (controlsRef.current) {
      const factor = direction === 'in' ? 0.8 : 1.2;
      controlsRef.current.dollyIn(factor);
      controlsRef.current.update();
    }
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
      <div
        ref={containerRef}
        onDoubleClick={() => !active && setActive(true)}
        onMouseMove={active ? handleMouseMove : undefined}
        className={`relative transition-all duration-700 ease-out mx-auto overflow-hidden
          ${active 
            ? 'w-full h-screen fixed inset-0 z-50 rounded-none' 
            : 'w-full max-w-4xl h-[60vh] md:h-[75vh] rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-transform duration-300'
          }
        `}
        style={{
          background: active 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }}
      >
      {/* Controles superiores */}
      <div 
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-500 ${
          active && showControls ? 'opacity-100 translate-y-0' : active ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        <div className="bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm p-6">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h2 className="text-white text-2xl font-bold tracking-tight">
              Modelo 3D - Rita
            </h2>
            <button
              onClick={() => setActive(false)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-2 backdrop-blur-md transition-all duration-300 hover:scale-110 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Canvas 3D */}
      <Canvas
        className="w-full h-full"
        shadows
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={75} />
        
        {/* Iluminación mejorada */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 5, -5]} intensity={0.5} />
        <spotLight position={[0, 15, 0]} angle={0.3} intensity={0.5} penumbra={1} castShadow />
        
        {/* Entorno para reflejos realistas */}
        <Environment preset="city" />
        
        {/* Modelo */}
        <Model modelPath={modelPath} autoRotate={autoRotate && !active} />
        
        {/* Sombras de contacto */}
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.5} 
          scale={50} 
          blur={1} 
          far={10} 
        />
        
        {/* Controles de órbita */}
        {active && (
          <OrbitControls 
            ref={controlsRef}
            enableDamping 
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={20}
            maxDistance={100}
            makeDefault
          />
        )}
      </Canvas>

      {/* Panel de controles inferior */}
      {active && (
        <div 
          className={`absolute bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
          }`}
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm p-6">
            <div className="flex justify-center items-center gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 backdrop-blur-md transition-all duration-300 hover:scale-110 flex items-center gap-2 font-medium"
                title={autoRotate ? 'Pausar rotación' : 'Iniciar rotación'}
              >
                {autoRotate ? '⏸' : '▶'}
                <span className="text-sm">{autoRotate ? 'Pausar' : 'Rotar'}</span>
              </button>

              <button
                onClick={() => handleZoom('in')}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 backdrop-blur-md transition-all duration-300 hover:scale-110 font-medium"
                title="Acercar"
              >
                🔍+
              </button>

              <button
                onClick={() => handleZoom('out')}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 backdrop-blur-md transition-all duration-300 hover:scale-110 font-medium"
                title="Alejar"
              >
                🔍−
              </button>

              <button
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 backdrop-blur-md transition-all duration-300 hover:scale-110 font-medium"
                title="Reiniciar vista"
              >
                🔄
              </button>
            </div>

            <p className="text-white/80 text-center text-sm mt-4">
              Arrastra para rotar • Rueda del mouse para zoom • Click derecho para mover
            </p>
          </div>
        </div>
      )}

      {/* Mensaje instructivo (modo compacto) */}
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 animate-pulse">
            <div className="bg-white/90 backdrop-blur-md text-gray-800 px-8 py-4 rounded-2xl shadow-2xl">
              <div className="text-4xl mb-2">⛶</div>
              <p className="text-lg font-semibold">Doble clic para explorar</p>
              <p className="text-sm text-gray-600 mt-1">Visualización 3D interactiva</p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de carga */}
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-xs font-medium">
          3D Viewer
        </div>
      </div>
      </div>
    </section>
  );
}

export default RitaRender;