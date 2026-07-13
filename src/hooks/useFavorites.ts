import { useApp } from '../context/AppContext';

export function useFavorites() {
  const { favorites, toggleFavorite } = useApp();
  return { favorites, toggleFavorite };
}
