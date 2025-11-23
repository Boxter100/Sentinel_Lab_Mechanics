import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartCount, cartTotal, removeFromCart, clearCart, updateCartItem } from '../stores/cart';
import Button from './UI/Button';
import Modal from './UI/Modal';

const FloatingCart = () => {
  const $cartItems = useStore(cartItems);
  const $cartCount = useStore(cartCount);
  const $cartTotal = useStore(cartTotal);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonSize, setButtonSize] = useState('md');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  
  // Efecto para controlar la visibilidad del carrito flotante y la animación de pulso
  useEffect(() => {
    if ($cartCount > 0 && !isVisible) {
      // El carrito acaba de aparecer (pasó de 0 a 1+)
      setIsVisible(true);
      setShouldPulse(true);
      
      // Desactivar el pulso después de 3 ciclos (aproximadamente 3 segundos)
      const timer = setTimeout(() => {
        setShouldPulse(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else if ($cartCount === 0 && isVisible) {
      // El carrito se vació
      setIsVisible(false);
      // El pulso se reactivará automáticamente cuando vuelva a aparecer
    }
  }, [$cartCount]);
  
  // Efecto para actualizar el tamaño del botón basado en el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      setButtonSize(window.innerWidth < 640 ? 'sm' : 'md');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Función para iniciar el proceso de pago con Mercado Pago
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
  
      const items = Object.values($cartItems).map(item => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'MXN'
      }));
  
      const response = await fetch('/api/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
  
      const data = await response.json();
  
      if (data.initPoint) {
        localStorage.setItem('limfarCart', JSON.stringify({
          items: $cartItems,
          total: $cartTotal,
          count: $cartCount,
          timestamp: new Date().toISOString()
        }));
  
        window.location.href = data.initPoint;
      } else {
        throw new Error('No se pudo crear la preferencia de pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efecto para animar el contador cuando cambia
  const [isCountAnimating, setIsCountAnimating] = useState(false);
  
  useEffect(() => {
    if ($cartCount > 0) {
      setIsCountAnimating(true);
      const timer = setTimeout(() => setIsCountAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [$cartCount]);

  return (
    <>
      {/* Botón flotante con animaciones */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative group"
          aria-label="Carrito de compras"
        >
          {/* Círculo principal con sombra y efectos */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center">
            {/* Efecto de pulso cuando hay items - solo 3 veces al aparecer */}
            {shouldPulse && (
              <span className="absolute inset-0 rounded-full bg-black opacity-75 animate-ping"></span>
            )}
            
            {/* Ícono del carrito */}
            <div className="relative z-10">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 sm:h-7 sm:w-7 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                <circle cx="9" cy="19" r="1" stroke="none" fill="currentColor" />
                <circle cx="15" cy="19" r="1" stroke="none" fill="currentColor" />
              </svg>
            </div>
            
            {/* Contador de items con animación */}
            {$cartCount > 0 && (
              <span 
                className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[22px] h-5 sm:min-w-[24px] sm:h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white transition-all duration-300 ${
                  isCountAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                }`}
              >
                {$cartCount}
              </span>
            )}
          </div>
          
          {/* Anillo de hover */}
          <span className="absolute inset-0 rounded-full border-2 border-black scale-100 opacity-0 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300"></span>
        </button>
      </div>
      
      {/* Modal del carrito (mismo que antes) */}
      <Modal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        title={
          <div className="flex items-center text-lg sm:text-xl font-bold">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Tu carrito
          </div>
        }
        maxWidth="max-w-xl"
      >
        {Object.keys($cartItems).length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 11V9a2 2 0 114 0v2" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Parece que aún no has agregado productos a tu carrito</p>
            <Button 
              onClick={() => setIsCartOpen(false)}
              variant="primary"
              size={buttonSize}
              fullWidth
            >
              Explorar productos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Encabezado de la lista */}
            <div className="mb-3 sm:mb-4 pb-2 text-xs sm:text-sm font-medium text-gray-500 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Producto ({$cartCount})</span>
                <span>Subtotal</span>
              </div>
            </div>
            
            {/* Lista de productos */}
            <div className="mb-4 sm:mb-6 max-h-[30vh] sm:max-h-[40vh] overflow-y-auto custom-scrollbar">
              {Object.values($cartItems).map(item => (
                <div 
                  key={item.id} 
                  className="py-3 sm:py-4 flex justify-between items-center border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-2"
                >
                  <div className="flex items-center flex-1">
                    <div className="relative group">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mr-3 sm:mr-4 border border-gray-200 group-hover:border-gray-300 transition-all"
                      />
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        aria-label="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                        ${item.price.toLocaleString()}
                      </p>
                      
                      {/* Control de cantidad */}
                      <div className="flex items-center">
                        <button 
                          onClick={() => item.quantity > 1 ? updateCartItem(item.id, item.quantity - 1) : removeFromCart(item.id)}
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-l-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="w-8 h-6 sm:w-10 sm:h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white text-xs sm:text-sm">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-r-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="font-medium text-right text-sm sm:text-base ml-2">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumen y total */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base">
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${$cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200 mt-2 sm:mt-3">
                <span className="text-base sm:text-lg font-bold">Total</span>
                <span className="text-base sm:text-lg font-bold">${$cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Mensaje de advertencia */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4 sm:mb-5 rounded-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs sm:text-sm text-gray-700">
                Una vez realizada la compra espera a ser redirigido nuevamente para responder el formulario con tus datos para el envío.
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <Button 
                onClick={handleCheckout}
                disabled={isLoading}
                fullWidth
                size={buttonSize}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Finalizar compra
                      <svg className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-black bg-opacity-10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Button>
              <Button 
                onClick={() => setIsCartOpen(false)}
                variant="secondary"
                fullWidth
                size={buttonSize}
              >
                Seguir comprando
              </Button>
              <button 
                onClick={() => clearCart()}
                className="text-gray-500 hover:text-red-500 text-xs sm:text-sm font-medium mt-1 sm:mt-2 self-center transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default FloatingCart;