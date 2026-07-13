export interface Product {
  id: number;
  nome: string;
  marca: string;
  categoria: string; // Importados, Árabes, Body Splash, Kits
  tipo?: string; // Masculino, Feminino, Unissex
  volume: string;
  preço: number;
  preçoPromocional?: number; // Preço com desconto, se aplicável
  estoque: number;
  imagem: string;
  imagens?: string[]; // Múltiplas imagens, opcional
  descrição: string;
  ativo: boolean;
  destaque: boolean;
  lançamento?: boolean;
  promoção?: boolean;
  intensidade?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  nome: string;
  telefone: string;
  whatsapp?: string;
  cidade: string;
  endereco: string;
  observacoes?: string;
}

export interface Customer {
  id: string;
  nome: string;
  telefone: string;
  whatsapp: string;
  cidade: string;
  endereco: string;
  observacoes: string;
  totalComprado: number;
  ultimaCompra?: string;
  historicoCompras: {
    orderId: string;
    data: string;
    total: number;
  }[];
}

export type OrderStatus = 'Novo' | 'Em separação' | 'Aguardando pagamento' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface Order {
  id: string; // ex: #1001
  data: string;
  cliente: CustomerInfo;
  produtos: {
    productId: number;
    nome: string;
    marca: string;
    volume: string;
    quantidade: number;
    preçoUnitario: number;
  }[];
  formaPagamento: string;
  valorTotal: number;
  status: OrderStatus;
  observacoes?: string;
}

export interface PaymentMethod {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface AppConfig {
  nomeLoja: string;
  logo: string;
  banner: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  endereco: string;
  horarioAtendimento: string;
  taxaEntrega: number;
  tema: 'light' | 'soft-blue';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    nome: string;
    email: string;
    role: 'admin' | 'cliente';
  } | null;
}
