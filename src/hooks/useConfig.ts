import { useApp } from '../context/AppContext';

export function useConfig() {
  const { config, updateConfig, paymentMethods, setPaymentMethods } = useApp();
  return { config, updateConfig, paymentMethods, setPaymentMethods };
}
