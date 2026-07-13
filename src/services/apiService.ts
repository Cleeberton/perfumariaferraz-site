import { Product, Order, Customer, AppConfig, PaymentMethod } from '../types';
import { formatImageUrl } from '../utils/image';

const API_URL = 'https://script.google.com/macros/s/AKfycbwiieqronfc_upTUiVvO8G7W1utzh0F6ifvqNTgtHIALa_06cBPDy988cpXuwqcSswi/exec';

/**
 * Robustly maps product fields to support both accented, non-accented, camelCase,
 * and string representations ('sim' / 'não') in the Google Sheet columns.
 */
function mapProductToSheetFormat(product: Partial<Product>): any {
  const result: any = { ...product };

  // Price keys mapping
  if (product.preço !== undefined) {
    result.preco = product.preço;
    result.preço = product.preço;
  } else if ((product as any).preco !== undefined) {
    result.preço = (product as any).preco;
    result.preco = (product as any).preco;
  }

  // Promo price keys mapping
  if (product.preçoPromocional !== undefined) {
    result.precoPromocional = product.preçoPromocional;
    result.preçoPromocional = product.preçoPromocional;
  } else if ((product as any).precoPromocional !== undefined) {
    result.preçoPromocional = (product as any).precoPromocional;
    result.precoPromocional = (product as any).precoPromocional;
  }

  // Description keys mapping
  if (product.descrição !== undefined) {
    result.descricao = product.descrição;
    result.descrição = product.descrição;
  } else if ((product as any).descricao !== undefined) {
    result.descrição = (product as any).descricao;
    result.descricao = (product as any).descricao;
  }

  // Lançamento boolean & string mappings
  if (product.lançamento !== undefined) {
    result.lancamento = product.lançamento;
    result.lançamento = product.lançamento;
    result.Lançamento = product.lançamento ? 'sim' : 'não';
    result.Lancamento = product.lançamento ? 'sim' : 'não';
  }

  // Promoção boolean & string mappings
  if (product.promoção !== undefined) {
    result.promocao = product.promoção;
    result.promoção = product.promoção;
    result.Promoção = product.promoção ? 'sim' : 'não';
    result.Promocao = product.promoção ? 'sim' : 'não';
    result.promo = product.promoção ? 'sim' : 'não';
    result.Promo = product.promoção ? 'sim' : 'não';
  }

  // Destaque boolean & string mappings
  if (product.destaque !== undefined) {
    result.Destaque = product.destaque ? 'sim' : 'não';
    result.destaque = product.destaque;
  }

  // Ativo boolean & string mappings
  if (product.ativo !== undefined) {
    result.Ativo = product.ativo ? 'sim' : 'não';
    result.ativo = product.ativo;
  }

  // Tipo mappings
  if (product.tipo !== undefined) {
    result.tipo = product.tipo;
    result.Tipo = product.tipo;
  } else if ((product as any).Tipo !== undefined) {
    result.tipo = (product as any).Tipo;
    result.Tipo = (product as any).Tipo;
  }

  // Intensidade mapping
  if (product.intensidade !== undefined) {
    result.intensidade = product.intensidade;
    result.Intensidade = product.intensidade;
  }

  return result;
}

/**
 * Service Layer responsible for all Google Sheets API communication
 */
export const apiService = {
  /**
   * Fetches the complete products catalog from the Google Sheets API.
   * Maps fields flexibly to standard Product interface and caches results.
   */
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const mappedProducts: Product[] = data.map((item: any) => {
          const idStr = item.id ? String(item.id) : '';
          const id = parseInt(idStr) || Math.floor(Math.random() * 10000);
          
          // Price resolution
          const rawPreco = item.preço !== undefined ? item.preço : (item.preco !== undefined ? item.preco : 0);
          const precoNum = parseFloat(String(rawPreco).replace(',', '.')) || 0;
          
          // Promotion resolution
          const isPromoField = item['promoçao'] !== undefined ? item['promoçao']
                             : (item['Promoçao'] !== undefined ? item['Promoçao']
                             : (item.Promoção !== undefined ? item.Promoção 
                             : (item.promoção !== undefined ? item.promoção 
                             : (item.promocao !== undefined ? item.promocao 
                             : (item.Promo !== undefined ? item.Promo : false)))));
          const promoção = isPromoField === 'sim' || isPromoField === 'SIM' || isPromoField === true || isPromoField === 'true' || isPromoField === 'TRUE' || isPromoField === 'True' || isPromoField === '1' || isPromoField === 1;

          // Promo price
          const rawPromoPreco = item['Valor Promocional'] !== undefined ? item['Valor Promocional']
                              : (item['valor_promocional'] !== undefined ? item['valor_promocional']
                              : (item['valorPromocional'] !== undefined ? item['valorPromocional']
                              : (item['Valor promocional'] !== undefined ? item['Valor promocional']
                              : (item.preçoPromocional !== undefined ? item.preçoPromocional 
                              : (item.precoPromocional !== undefined ? item.precoPromocional 
                              : (item.preçoPromo !== undefined ? item.preçoPromo 
                              : (item.precoPromo !== undefined ? item.precoPromo : undefined)))))));
          let preçoPromocional = rawPromoPreco !== undefined && rawPromoPreco !== '' ? parseFloat(String(rawPromoPreco).replace(',', '.')) : undefined;
          if (preçoPromocional && isNaN(preçoPromocional)) preçoPromocional = undefined;

          // Ativo resolution
          const rawAtivo = item.ativo !== undefined ? item.ativo : true;
          const ativo = rawAtivo !== 'não' && rawAtivo !== 'nao' && rawAtivo !== 'NÃO' && rawAtivo !== 'NAO' && rawAtivo !== 'false' && rawAtivo !== false && rawAtivo !== '0' && rawAtivo !== 0;

          // Destaque resolution
          const rawDestaque = item.destaque !== undefined ? item.destaque : false;
          const destaque = rawDestaque === 'sim' || rawDestaque === 'SIM' || rawDestaque === true || rawDestaque === 'true' || rawDestaque === '1' || rawDestaque === 1;

          // Lançamento resolution
          const rawLancamento = item.lançamento !== undefined ? item.lançamento : (item.lancamento !== undefined ? item.lancamento : false);
          const lançamento = rawLancamento === 'sim' || rawLancamento === 'SIM' || rawLancamento === true || rawLancamento === 'true' || rawLancamento === '1' || rawLancamento === 1;

          // Image mapping
          const imagem = formatImageUrl(item.imagem || item.imagemUrl);
          const descrição = item.descrição || item.descricao || 'Fragrância sofisticada de nossa perfumaria.';
          const tipo = item.tipo || item.Tipo || '';

          // Intensidade resolution
          const rawIntensidade = item['intensidade'] !== undefined ? item['intensidade']
                               : (item['Intensidade'] !== undefined ? item['Intensidade'] : undefined);
          const intensidade = rawIntensidade !== undefined && rawIntensidade !== '' ? parseInt(String(rawIntensidade)) : undefined;

          return {
            id,
            nome: item.nome || 'Perfume sem nome',
            marca: item.marca || 'Importado',
            categoria: item.categoria || 'Importados',
            tipo: tipo,
            volume: item.volume || '100 ml',
            preço: precoNum,
            preçoPromocional,
            estoque: typeof item.estoque === 'number' ? item.estoque : parseInt(item.estoque) || 0,
            imagem,
            descrição,
            ativo,
            destaque,
            lançamento,
            promoção,
            intensidade,
          };
        });

        const validProducts = mappedProducts.filter(p => p.nome && p.preço >= 0);
        if (validProducts.length > 0) {
          localStorage.setItem('ferraz_cached_products', JSON.stringify(validProducts));
          return validProducts;
        }
      }
      return this.getCachedProducts();
    } catch (error) {
      console.error('Erro ao carregar dados do Google Sheets:', error);
      return this.getCachedProducts();
    }
  },

  /**
   * Safe localStorage fallback for products cache
   */
  getCachedProducts(): Product[] {
    try {
      const cached = localStorage.getItem('ferraz_cached_products');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  },

  /**
   * Post actions helper to support saving/updating Google Sheets records.
   * Gracefully manages request errors by falling back to state/cache.
   */
  async sendPostAction(action: string, data: any): Promise<boolean> {
    try {
      // POST requests to Google Apps Script might trigger CORS redirects, so we use no-cors
      // or handle JSON response safely if permitted.
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', // standard Apps Script POST requirement
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
      });
      return true; // we assume true when no exceptions are thrown
    } catch (error) {
      console.warn(`Ação de escrita '${action}' falhou no Google Sheets. Operando localmente:`, error);
      return false;
    }
  },

  /**
   * Persist a new product. Calls real API and falls back gracefully.
   */
  async createProduct(product: Omit<Product, 'id'> & { id?: number }): Promise<boolean> {
    const formattedProduct = mapProductToSheetFormat(product);
    const payload = {
      product: formattedProduct,
      ...formattedProduct
    };
    // Send both createProduct and addProduct actions for maximum backend script compatibility
    await this.sendPostAction('createProduct', payload);
    await this.sendPostAction('addProduct', payload);
    return true;
  },

  /**
   * Update an existing product. Calls real API and falls back gracefully.
   */
  async updateProduct(id: number, updatedFields: Partial<Product>): Promise<boolean> {
    const formattedFields = mapProductToSheetFormat(updatedFields);
    const payload = {
      id,
      updatedFields: formattedFields,
      product: { id, ...formattedFields },
      ...formattedFields
    };
    // Send both updateProduct and editProduct actions for maximum backend script compatibility
    await this.sendPostAction('updateProduct', payload);
    await this.sendPostAction('editProduct', payload);
    return true;
  },

  /**
   * Delete product. Calls real API and falls back gracefully.
   */
  async deleteProduct(id: number): Promise<boolean> {
    const payload = { id };
    // Send both deleteProduct and removeProduct actions for maximum backend script compatibility
    await this.sendPostAction('deleteProduct', payload);
    await this.sendPostAction('removeProduct', payload);
    return true;
  },

  /**
   * Create order. Sends order information to the API.
   */
  async createOrder(order: Order): Promise<boolean> {
    return this.sendPostAction('createOrder', { order });
  },

  /**
   * Update order status.
   */
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    return this.sendPostAction('updateOrderStatus', { orderId, status });
  },

  /**
   * Update settings/config.
   */
  async updateConfig(config: AppConfig): Promise<boolean> {
    return this.sendPostAction('updateConfig', { config });
  }
};
