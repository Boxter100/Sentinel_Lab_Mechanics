import React, { useState, useMemo } from 'react';
import { addToCart } from '../stores/cart';
import Button from './UI/Button';

export default function ShopArea({
  id = 'gabinete-sentinel-pro',
  name = 'Gabinete Sentinel Pro',
  basePrice = 3500,
  shippingLabel = 'Envío gratis',
}) {
  const colorOptions = [
    { name: 'Sin pintura', price: 0, preview: '/frames/0250.webp' },
    { name: 'Blanco', price: 500, preview: '/frames/0300.webp' },
    { name: 'Negro', price: 500, preview: '/frames/0350.webp' },
    { name: 'Rojo', price: 500, preview: '/frames/0400.webp' },
  ];

  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isAdding, setIsAdding] = useState(false);

  const totalPrice = useMemo(() => basePrice + selectedColor.price, [basePrice, selectedColor]);
  const previewSrc = selectedColor.preview;

  const handleAddToCart = async () => {
    setIsAdding(true);

    const variantId = `${id}-${selectedColor.name}`.toLowerCase().replace(/\s+/g, '-');

    addToCart({
      id: variantId,
      name: `${name} (${selectedColor.name})`,
      price: totalPrice,
      image: previewSrc,
      color: selectedColor.name,
    });

    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <section id="comprar" className="py-16 bg-gradient-to-b from-gray-100 to-gray-150">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Compra tu Gabinete</h2>
        <p className="text-gray-600 text-center mb-10">Personaliza y adquiere tu gabinete Sentinel Lab</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Imagen del producto */}
          <div className="relative">
            <img
              src={previewSrc}
              alt="Gabinete"
              className="w-full rounded-lg shadow-lg transition-transform duration-500 hover:scale-[1.01]"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
              <span className="text-sm font-semibold">Vista previa</span>
            </div>
          </div>

          {/* Detalles y opciones de compra */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Gabinete de alta calidad con espacio optimizado para todos tus componentes. Incluye todo lo necesario
                para tu equipo, solo la pintura electroestática es adicional.
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${basePrice.toLocaleString()} MXN</p>
                  <p className="text-sm text-green-600">{shippingLabel}</p>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-lg">
                  <p className="text-sm">En stock</p>
                </div>
              </div>
            </div>

            {/* Opciones de color */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Selecciona el acabado:</h4>
              <div className="flex space-x-3">
                {colorOptions.map((opt) => {
                  const isSelected = opt.name === selectedColor.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setSelectedColor(opt)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      aria-pressed={isSelected}
                      title={opt.name}
                    >
                      <span
                        className={`w-6 h-6 rounded-full ${
                          opt.name === 'Blanco'
                            ? 'bg-white border border-gray-200'
                            : opt.name === 'Negro'
                            ? 'bg-black'
                            : opt.name === 'Rojo'
                            ? 'bg-red-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="block text-xs text-gray-500 mt-2">{selectedColor.name}</span>
            </div>

            {/* Resumen de precio */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Gabinete base:</span>
                <span>${basePrice.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Pintura ({selectedColor.name}):</span>
                <span>${selectedColor.price.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${totalPrice.toLocaleString()} MXN</span>
              </div>
            </div>

            {/* Botón: Agregar al carrito */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 relative overflow-hidden group"
                disabled={isAdding}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isAdding ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Agregando...
                    </>
                  ) : (
                    <>
                      Agregar al carrito
                      <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-black/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}