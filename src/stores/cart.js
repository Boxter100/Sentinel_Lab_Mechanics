import { atom, map } from 'nanostores';

// Store para el carrito de compras
export const cartItems = map({});
export const cartCount = atom(0);
export const cartTotal = atom(0);

// Función para agregar un producto al carrito
export function addToCart(product) {
  const currentItems = cartItems.get();
  const existingItem = currentItems[product.id];
  
  if (existingItem) {
    // Si el producto ya existe, incrementamos la cantidad
    cartItems.setKey(product.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1
    });
  } else {
    // Si es un producto nuevo, lo agregamos con cantidad 1
    cartItems.setKey(product.id, {
      ...product,
      quantity: 1
    });
  }
  
  // Actualizamos el contador y el total
  updateCartCountAndTotal();
}

// Función para eliminar un producto del carrito
export function removeFromCart(productId) {
  const currentItems = cartItems.get();
  const existingItem = currentItems[productId];
  
  if (existingItem && existingItem.quantity > 1) {
    // Si hay más de uno, reducimos la cantidad
    cartItems.setKey(productId, {
      ...existingItem,
      quantity: existingItem.quantity - 1
    });
  } else {
    // Si solo hay uno, eliminamos el producto
    const newItems = { ...currentItems };
    delete newItems[productId];
    cartItems.set(newItems);
  }
  
  // Actualizamos el contador y el total
  updateCartCountAndTotal();
}

// Función para actualizar el contador y el total del carrito
function updateCartCountAndTotal() {
  const items = cartItems.get();
  const count = Object.values(items).reduce((total, item) => total + item.quantity, 0);
  const total = Object.values(items).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.set(count);
  cartTotal.set(total);
}

// Función para actualizar la cantidad de un producto específico en el carrito
export function updateCartItem(productId, quantity) {
  const currentItems = cartItems.get();
  const existingItem = currentItems[productId];
  
  if (existingItem) {
    // Actualizamos la cantidad del producto
    cartItems.setKey(productId, {
      ...existingItem,
      quantity: quantity
    });
    
    // Actualizamos el contador y el total
    updateCartCountAndTotal();
  }
}

// Función para limpiar el carrito
export function clearCart() {
  cartItems.set({});
  cartCount.set(0);
  cartTotal.set(0);
}