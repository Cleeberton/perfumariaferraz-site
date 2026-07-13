import { useApp } from '../context/AppContext';

export function useOrders() {
  const { orders, addOrder, updateOrderStatus, customers, addCustomer } = useApp();
  return { orders, addOrder, updateOrderStatus, customers, addCustomer };
}
