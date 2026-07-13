import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Customer, PaymentMethod, AppConfig, AuthState, CustomerInfo } from '../types';
import { apiService } from '../services/apiService';

interface AppContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (customer: CustomerInfo, paymentMethod: string, notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'historicoCompras' | 'totalComprado'>) => Customer;
  paymentMethods: PaymentMethod[];
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>;
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  auth: AuthState;
  login: (email: string, password: string, role: 'admin' | 'cliente') => Promise<boolean>;
  register: (nome: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  editProduct: (id: number, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  duplicateProduct: (id: number) => Promise<void>;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CONFIG: AppConfig = {
  nomeLoja: "Perfumaria Ferraz",
  logo: "✨ Ferraz",
  banner: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200",
  whatsapp: "5517996363787",
  instagram: "@ferraz.perfumaria",
  facebook: "perfumariaferraz",
  endereco: "Guaraci - SP",
  horarioAtendimento: "Segunda a Sábado: 08h às 19h",
  taxaEntrega: 0.00,
  tema: "light"
};

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pix', nome: 'PIX', ativo: true },
  { id: 'dinheiro', nome: 'Dinheiro', ativo: true },
  { id: 'cartao_credito', nome: 'Cartão de Crédito', ativo: true },
  { id: 'cartao_debito', nome: 'Cartão de Débito', ativo: true },
  { id: 'transferencia', nome: 'Transferência Bancária', ativo: true },
  { id: 'fiado', nome: 'Fiado (Clientes Especiais)', ativo: false }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load data from localStorage or seed
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ferraz_orders');
    if (saved) return JSON.parse(saved);
    const initialOrders: Order[] = [
      {
        id: "#1001",
        data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        cliente: {
          nome: "Mariana Silva",
          telefone: "11988887777",
          cidade: "São Paulo",
          endereco: "Alameda Lorena, 1500 - Cerqueira César"
        },
        produtos: [
          { productId: 102, nome: "Good Girl Eau de Parfum", marca: "Carolina Herrera", volume: "80 ml", quantidade: 1, preçoUnitario: 689.00 }
        ],
        formaPagamento: "Cartão de Crédito",
        valorTotal: 704.00,
        status: "Entregue",
        observacoes: "Embalar para presente, por favor!"
      },
      {
        id: "#1002",
        data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        cliente: {
          nome: "Lucas Ferraz",
          telefone: "11977776666",
          cidade: "São Bernardo do Campo",
          endereco: "Rua das Flores, 120 - Rudge Ramos"
        },
        produtos: [
          { productId: 101, nome: "Bleu de Chanel Eau de Parfum", marca: "Chanel", volume: "100 ml", quantidade: 1, preçoUnitario: 749.90 }
        ],
        formaPagamento: "PIX",
        valorTotal: 764.90,
        status: "Pago",
        observacoes: "Deixar com o porteiro."
      }
    ];
    localStorage.setItem('ferraz_orders', JSON.stringify(initialOrders));
    return initialOrders;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ferraz_customers');
    if (saved) return JSON.parse(saved);
    const initialCustomers: Customer[] = [
      {
        id: "c1",
        nome: "Mariana Silva",
        telefone: "11988887777",
        whatsapp: "11988887777",
        cidade: "São Paulo",
        endereco: "Alameda Lorena, 1500 - Cerqueira César",
        observacoes: "Cliente vip, gosta de amostras florais",
        totalComprado: 689.00,
        ultimaCompra: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        historicoCompras: [
          { orderId: "#1001", data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), total: 689.00 }
        ]
      }
    ];
    localStorage.setItem('ferraz_customers', JSON.stringify(initialCustomers));
    return initialCustomers;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('ferraz_payment_methods');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('ferraz_payment_methods', JSON.stringify(INITIAL_PAYMENT_METHODS));
    return INITIAL_PAYMENT_METHODS;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('ferraz_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      let updated = false;
      if (parsed.whatsapp === "5511999999999" || parsed.whatsapp === "11999999999") {
        parsed.whatsapp = "5517996363787";
        updated = true;
      }
      if (parsed.instagram === "@perfumaria_ferraz") {
        parsed.instagram = "@ferraz.perfumaria";
        updated = true;
      }
      if (parsed.horarioAtendimento === "Segunda a Sábado: 09h às 19h") {
        parsed.horarioAtendimento = "Segunda a Sábado: 08h às 19h";
        updated = true;
      }
      if (updated) {
        localStorage.setItem('ferraz_config', JSON.stringify(parsed));
      }
      return parsed;
    }
    localStorage.setItem('ferraz_config', JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('ferraz_auth');
    if (saved) return JSON.parse(saved);
    return { isAuthenticated: false, user: null };
  });

  // Load products from API Service
  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      const apiProducts = await apiService.fetchProducts();
      setProducts(apiProducts);
      setIsLoadingProducts(false);
    }
    loadProducts();
  }, []);

  // Sync favorites, cart and other states
  useEffect(() => {
    const favs = localStorage.getItem('ferraz_favorites');
    if (favs) setFavorites(JSON.parse(favs));
    
    const savedCart = localStorage.getItem('ferraz_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const saveFavorites = (updated: number[]) => {
    setFavorites(updated);
    localStorage.setItem('ferraz_favorites', JSON.stringify(updated));
  };

  const saveCart = (updated: CartItem[]) => {
    setCart(updated);
    localStorage.setItem('ferraz_cart', JSON.stringify(updated));
  };

  const saveProductsToStateAndCache = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('ferraz_cached_products', JSON.stringify(updated));
  };

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    saveCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart(cart.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Favorites
  const toggleFavorite = (productId: number) => {
    const isFav = favorites.includes(productId);
    const updated = isFav 
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    saveFavorites(updated);
  };

  // Orders Actions
  const addOrder = (customer: CustomerInfo, paymentMethod: string, notes?: string): Order => {
    const nextNum = 1001 + orders.length;
    const newOrder: Order = {
      id: `#${nextNum}`,
      data: new Date().toISOString(),
      cliente: customer,
      produtos: cart.map(item => {
        const hasPromo = (!!item.product.promoção && !!item.product.preçoPromocional) || (!!item.product.preçoPromocional && item.product.preçoPromocional < item.product.preço);
        const price = hasPromo ? item.product.preçoPromocional! : item.product.preço;
        return {
          productId: item.product.id,
          nome: item.product.nome,
          marca: item.product.marca,
          volume: item.product.volume,
          quantidade: item.quantity,
          preçoUnitario: price
        };
      }),
      formaPagamento: paymentMethod,
      valorTotal: cart.reduce((acc, item) => {
        const hasPromo = (!!item.product.promoção && !!item.product.preçoPromocional) || (!!item.product.preçoPromocional && item.product.preçoPromocional < item.product.preço);
        const price = hasPromo ? item.product.preçoPromocional! : item.product.preço;
        return acc + price * item.quantity;
      }, 0),
      status: 'Novo',
      observacoes: notes || customer.observacoes || ""
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('ferraz_orders', JSON.stringify(updatedOrders));

    // Send order to real Google Sheets Database Service
    apiService.createOrder(newOrder);

    // Also update customer purchase history (matching by phone/whatsapp)
    const existingCustIndex = customers.findIndex(c => c.telefone.replace(/\D/g, '') === customer.telefone.replace(/\D/g, ''));
    let updatedCusts = [...customers];
    
    const cleanTotal = newOrder.valorTotal;

    if (existingCustIndex > -1) {
      const cust = updatedCusts[existingCustIndex];
      cust.totalComprado += cleanTotal;
      cust.ultimaCompra = newOrder.data;
      cust.historicoCompras.unshift({
        orderId: newOrder.id,
        data: newOrder.data,
        total: cleanTotal
      });
    } else {
      const newCust: Customer = {
        id: `c_${Date.now()}`,
        nome: customer.nome,
        telefone: customer.telefone,
        whatsapp: customer.whatsapp || customer.telefone,
        cidade: customer.cidade,
        endereco: customer.endereco,
        observacoes: notes || "",
        totalComprado: cleanTotal,
        ultimaCompra: newOrder.data,
        historicoCompras: [
          { orderId: newOrder.id, data: newOrder.data, total: cleanTotal }
        ]
      };
      updatedCusts.unshift(newCust);
    }
    
    setCustomers(updatedCusts);
    localStorage.setItem('ferraz_customers', JSON.stringify(updatedCusts));
    
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('ferraz_orders', JSON.stringify(updated));

    // Send status change to Sheets API
    apiService.updateOrderStatus(orderId, status);
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id' | 'historicoCompras' | 'totalComprado'>): Customer => {
    const newCust: Customer = {
      ...customerData,
      id: `c_${Date.now()}`,
      totalComprado: 0,
      historicoCompras: []
    };
    const updated = [newCust, ...customers];
    setCustomers(updated);
    localStorage.setItem('ferraz_customers', JSON.stringify(updated));
    return newCust;
  };

  // Config management
  const updateConfig = (newConfig: Partial<AppConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('ferraz_config', JSON.stringify(updated));

    // Send config change to Sheets API
    apiService.updateConfig(updated);
  };

  // Authentication Mock
  const login = async (email: string, password: string, role: 'admin' | 'cliente'): Promise<boolean> => {
    if (email.toLowerCase() === 'admin@ferraz.com' && password === 'admin123') {
      const state = { 
        isAuthenticated: true, 
        user: { nome: "Diretor Ferraz", email: "admin@ferraz.com", role: 'admin' as const } 
      };
      setAuth(state);
      localStorage.setItem('ferraz_auth', JSON.stringify(state));
      return true;
    }
    return false;
  };

  const register = async (nome: string, email: string, password: string): Promise<boolean> => {
    return false;
  };

  const logout = () => {
    const state = { isAuthenticated: false, user: null };
    setAuth(state);
    localStorage.setItem('ferraz_auth', JSON.stringify(state));
  };

  // Product CRUD (Admin Operations connected to database service)
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1000;
    const newProduct: Product = {
      ...productData,
      id: newId
    };
    const updated = [newProduct, ...products];
    saveProductsToStateAndCache(updated);

    // Call Sheet API service
    await apiService.createProduct(productData);

    return newProduct;
  };

  const editProduct = async (id: number, updatedFields: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    saveProductsToStateAndCache(updated);

    // Call Sheet API service
    await apiService.updateProduct(id, updatedFields);
  };

  const deleteProduct = async (id: number) => {
    const updated = products.filter(p => p.id !== id);
    saveProductsToStateAndCache(updated);

    // Call Sheet API service
    await apiService.deleteProduct(id);
  };

  const duplicateProduct = async (id: number) => {
    const source = products.find(p => p.id === id);
    if (!source) return;
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1000;
    const duplicated: Product = {
      ...source,
      id: newId,
      nome: `${source.nome} (Cópia)`
    };
    const updated = [duplicated, ...products];
    saveProductsToStateAndCache(updated);

    // Call Sheet API service
    await apiService.createProduct(duplicated);
  };

  return (
    <AppContext.Provider value={{
      products,
      isLoadingProducts,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      addOrder,
      updateOrderStatus,
      customers,
      addCustomer,
      paymentMethods,
      setPaymentMethods,
      config,
      updateConfig,
      auth,
      login,
      register,
      logout,
      addProduct,
      editProduct,
      deleteProduct,
      duplicateProduct,
      favorites,
      toggleFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
