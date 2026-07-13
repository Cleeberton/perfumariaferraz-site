import { useApp } from '../context/AppContext';

export function useCart() {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  return { cart, addToCart, removeFromCart, updateCartQuantity, clearCart };
}
