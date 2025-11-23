import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false,
  fullWidth = false,
  size = 'md'
}) => {
  // Estilos base para todos los botones
  const baseStyles = 'font-sans font-medium transition-all duration-300 ease-in-out focus:outline-none';
  
  // Variantes de estilo
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
    secondary: 'bg-white text-black border border-gray-300 hover:bg-gray-100 active:bg-gray-200',
    success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  };
  
  // Tamaños
  const sizes = {
    sm: 'text-sm py-2 px-3 rounded-lg',
    md: 'text-base py-3 px-4 rounded-lg',
    lg: 'text-lg py-4 px-6 rounded-lg',
  };
  
  // Estilos para ancho completo
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Estilos para estado deshabilitado
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;