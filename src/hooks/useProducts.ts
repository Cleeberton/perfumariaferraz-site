import { useApp } from '../context/AppContext';
import { Product } from '../types';

export function useProducts() {
  const { 
    products, 
    isLoadingProducts, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    duplicateProduct 
  } = useApp();

  return {
    products,
    isLoadingProducts,
    addProduct,
    editProduct,
    deleteProduct,
    duplicateProduct,
  };
}
