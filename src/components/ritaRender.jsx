import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ modelPath }) {
  const gltf = useGLTF(modelPath, true);
  return <primitive object={gltf.scene} dispose={null} />;
}

function ritaRender({ modelPath = '/models/rita5.glb', background = '#f0f0f0' }) {
  const [active, setActive] = useState(false);
  const containerRef = useRef();

  // Control de doble clic para activar
  const handleDoubleClick = () => setActive(true);

  // Botón de cerrar
  const handleClose = () => setActive(false);

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      className={`relative transition-all duration-500 ease-in-out mx-auto rounded-2xl overflow-hidden shadow-xl
        ${active ? 'w-full h-screen fixed inset-0 z-50 bg-white' : 'w-full max-w-3xl h-[50vh] md:h-[70vh]'}
      `}
    >
      {/* Botón para cerrar */}
      {active && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 bg-black/70 text-white rounded-full px-3 py-1 text-sm hover:bg-black/90"
        >
          ✕ Cerrar
        </button>
      )}

      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ background }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <directionalLight position={[-1, 0.5, -1]} intensity={0.5} />
        {active && <OrbitControls enableDamping />}
        <Model modelPath={modelPath} />
      </Canvas>

      {/* Mensaje instructivo */}
      {!active && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full">
          Doble clic para inspeccionar el modelo
        </div>
      )}
    </div>
  );
}

export default ritaRender;
