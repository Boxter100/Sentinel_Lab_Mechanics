import { useState, useEffect } from 'react';
import Button from './UI/Button';
import { addToCart } from '../stores/cart';

const GabineteDetails = ({ gabinete, onClose }) => {
  // Estado para la opción de pintura seleccionada
  const [selectedFinish, setSelectedFinish] = useState('none');
  const [buttonSize, setButtonSize] = useState('md');
  const [isAdding, setIsAdding] = useState(false);
  
  // Precio base del gabinete
  const basePrice = gabinete?.price || 3500;
  
  // Imágenes por defecto si no vienen en el objeto
  const defaultImages = {
    none: '/frames/0250.webp',
    white: '/frames/0300.webp',
    black: '/frames/0350.webp',
    red: '/frames/0400.webp'
  };
  
  // Usar imágenes del gabinete o las predeterminadas
  const images = gabinete?.images || defaultImages;
  
  // Opciones de acabado con sus precios adicionales
  const finishOptions = [
    { 
      id: 'none', 
      name: 'Sin pintura', 
      price: 0, 
      color: 'bg-gray-200',
      image: images.none
    },
    { 
      id: 'white', 
      name: 'Blanco', 
      price: 500, 
      color: 'bg-white border border-gray-200',
      image: images.white
    },
    { 
      id: 'black', 
      name: 'Negro', 
      price: 500, 
      color: 'bg-black',
      image: images.black
    },
    { 
      id: 'red', 
      name: 'Rojo', 
      price: 500, 
      color: 'bg-red-600',
      image: images.red
    }
  ];
  
  const [selectedImage, setSelectedImage] = useState(finishOptions[0].image);
  
  // Calcular el precio total según la opción seleccionada
  const selectedOption = finishOptions.find(option => option.id === selectedFinish);
  const totalPrice = basePrice + (selectedOption?.price || 0);
  
  // Efecto para actualizar el tamaño del botón basado en el ancho de la ventana
  useEffect(() => {
    const handleResize = () => {
      setButtonSize(window.innerWidth < 640 ? 'sm' : 'md');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Función para cambiar la opción de acabado
  const handleFinishChange = (finishId) => {
    setSelectedFinish(finishId);
    const option = finishOptions.find(opt => opt.id === finishId);
    if (option) {
      setSelectedImage(option.image);
    }
  };
  
  // Función para agregar al carrito con la configuración seleccionada
  const handleAddToCart = () => {
    setIsAdding(true);
    
    const productToAdd = {
      id: `${gabinete?.id || 'gabinete'}-${selectedFinish}`,
      name: `${gabinete?.name || 'Gabinete'} - ${selectedOption.name}`,
      price: totalPrice,
      image: selectedImage,
      baseProduct: gabinete?.id || 'gabinete',
      finish: selectedFinish,
      finishName: selectedOption.name
    };
    
    addToCart(productToAdd);
    
    // Feedback visual
    setTimeout(() => {
      setIsAdding(false);
      if (onClose) {
        setTimeout(onClose, 200);
      }
    }, 600);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-h-[85vh] overflow-hidden">
      {/* Columna izquierda - Imagen del gabinete */}
      <div className="lg:w-1/2 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        {/* Imagen principal con efecto de zoom sutil */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm group">
          <img 
            src={selectedImage} 
            alt={`${gabinete?.name || 'Gabinete'} - ${selectedOption.name}`} 
            className="w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-105 p-4"
          />
          
          {/* Badge de vista previa */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Vista previa</span>
          </div>
          
          {/* Indicador de acabado seleccionado */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="text-xs sm:text-sm font-medium text-white">{selectedOption.name}</span>
          </div>
        </div>
      </div>
      
      {/* Columna derecha - Información y controles */}
      <div className="lg:w-1/2 flex flex-col overflow-y-auto custom-scrollbar pr-2">
        {/* Header con título y valoración */}
        <div className="mb-6 animate-fadeIn">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 leading-tight">
            {gabinete?.name || 'Gabinete Sentinel Pro'}
          </h2>
          
          {/* Valoración */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 drop-shadow-sm" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">(128 reseñas)</span>
          </div>
          
          {/* Stock y envío */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-700 font-medium text-sm">En stock</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="font-medium">Envío gratis</span>
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <div className="mb-6 animate-fadeIn">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Descripción</h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {gabinete?.description || 'Gabinete de alta calidad con espacio optimizado para todos tus componentes. Incluye todo lo necesario para tu equipo, solo la pintura electroestática es adicional.'}
          </p>
        </div>
        
        {/* Opciones de acabado */}
        <div className="mb-6 animate-fadeIn">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Selecciona el acabado:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {finishOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFinishChange(option.id)}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedFinish === option.id 
                    ? 'border-black bg-gray-50 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                {/* Indicador de selección */}
                {selectedFinish === option.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-full ${option.color} mb-2 shadow-sm transition-transform duration-300 ${
                  selectedFinish === option.id ? 'scale-110' : 'scale-100'
                }`}></div>
                <span className="text-sm font-medium text-gray-900 text-center">{option.name}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {option.price > 0 ? `+$${option.price.toLocaleString()}` : 'Incluido'}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Resumen de precio */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 mb-6 shadow-sm animate-fadeIn">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">Gabinete base:</span>
              <span className="font-semibold text-gray-900">${basePrice.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">Acabado ({selectedOption.name}):</span>
              <span className={`font-semibold ${selectedOption.price > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                {selectedOption.price > 0 ? `+$${selectedOption.price.toLocaleString()}` : 'Gratis'}
              </span>
            </div>
            <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
              <span className="text-lg sm:text-xl font-bold text-gray-900">Total:</span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold text-black">${totalPrice.toLocaleString()}</span>
                <span className="text-base sm:text-lg font-semibold text-gray-600 ml-1">MXN</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Características */}
        {gabinete?.features && gabinete.features.length > 0 && (
          <div className="mb-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Características principales</h3>
            <ul className="space-y-2">
              {gabinete.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Botón de acción con ancho máximo */}
        <div className="mt-auto pt-6 pb-2 max-w-md mx-auto w-full">
          <Button 
            onClick={handleAddToCart}
            variant="primary"
            fullWidth
            size={buttonSize}
            disabled={isAdding}
            className="relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAdding ? 'opacity-0' : 'opacity-100'}`}>
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="font-semibold">Agregar al carrito</span>
            </span>
            
            {/* Animación de agregado */}
            {isAdding && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            )}
            
            {/* Efecto de onda al hacer clic */}
            <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity"></span>
          </Button>
          
          {/* Mensaje de cierre opcional */}
          {onClose && (
            <button 
              onClick={onClose}
              className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              Seguir explorando
            </button>
          )}
        </div>
      </div>
      
      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default GabineteDetails;