import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, MessageSquare, ArrowLeft, Heart, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, config, addOrder } = useApp();

  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao'>('pix');

  const hasOnOrderItems = cart.some(item => item.product.estoque <= 0);

  // Calculate pricing based on product promotional price or regular price
  const subtotal = cart.reduce((acc, item) => {
    const hasPromo = (!!item.product.promoção && !!item.product.preçoPromocional) || (!!item.product.preçoPromocional && item.product.preçoPromocional < item.product.preço);
    const price = hasPromo ? item.product.preçoPromocional! : item.product.preço;
    return acc + price * item.quantity;
  }, 0);

  const pixDiscount = subtotal * 0.05;
  const totalPix = subtotal > 0 ? subtotal - pixDiscount : 0;
  const totalCard = subtotal > 0 ? subtotal : 0;
  const installmentValue = totalCard / 3;

  const handleWhatsAppSubmit = () => {
    if (cart.length === 0) return;

    try {
      // Store order locally for mock/dashboard compatibility
      const customer = {
        nome: "Cliente Perfumaria",
        telefone: "",
        cidade: "Guaraci - SP",
        endereco: "Combinar via WhatsApp",
        observacoes: ""
      };
      addOrder(customer, formaPagamento === 'pix' ? 'PIX' : 'Cartão', "");
    } catch (err) {
      console.error("Erro ao salvar pedido localmente:", err);
    }

    // Formulate Portuguese WhatsApp text message
    let message = `*🛍️ NOVO PEDIDO - ${config.nomeLoja.toUpperCase()}*\n`;
    message += `-------------------------------------------\n\n`;
    
    message += `• *Forma de Pagamento Preferida:* ${formaPagamento === 'pix' ? 'PIX (com 5% OFF)' : 'Cartão de Crédito (até 3x)'}\n`;
    message += `\n-------------------------------------------\n\n`;
    message += `*📦 PRODUTOS PEDIDOS:*\n`;
    cart.forEach((item, index) => {
      const hasPromo = (!!item.product.promoção && !!item.product.preçoPromocional) || (!!item.product.preçoPromocional && item.product.preçoPromocional < item.product.preço);
      const price = hasPromo ? item.product.preçoPromocional! : item.product.preço;
      const statusLabel = item.product.estoque > 0 ? ' (Pronta Entrega)' : ' (Sob Pedido - 5 a 15 dias)';
      message += `${index + 1}. *${item.product.nome}* (${item.product.volume})${statusLabel}\n`;
      message += `   Qtd: ${item.quantity}x | R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `   Subtotal: R$ ${(price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
    });
    
    message += `-------------------------------------------\n`;
    message += `*Subtotal:* R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    
    if (formaPagamento === 'pix') {
      message += `*Desconto PIX (5%):* -R$ ${pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
      message += `*💰 TOTAL DO PEDIDO:* R$ ${totalPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\n`;
    } else {
      message += `*💰 TOTAL NO CARTÃO:* R$ ${totalCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (em até 3x de R$ ${installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros)\n\n`;
    }
    
    if (hasOnOrderItems) {
      message += `⚠️ *Aviso de Prazo:* Meu pedido inclui produto(s) por pedido (prazo de 5 a 15 dias a confirmar).\n\n`;
    }

    message += `Olá! Gostaria de finalizar a compra destes produtos. Fico no aguardo para combinarmos a entrega/retirada!`;

    // Encode text for URL
    const encodedText = encodeURIComponent(message);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${config.whatsapp}&text=${encodedText}`;

    // Close drawer
    onClose();

    // Open WhatsApp
    window.open(whatsappLink, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Cart Drawer Canvas */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-55 w-full sm:max-w-md bg-white shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
              <div className="flex items-center space-x-2 text-stone-900">
                <ShoppingBag size={20} className="text-[#C5A059]" />
                <span className="font-serif font-semibold text-sm uppercase tracking-wider text-slate-800">
                  Seu Carrinho
                </span>
                <span className="text-xs bg-[#DCEEFF] text-[#2C5E8A] font-bold px-2.5 py-0.5 rounded-full">
                  {cart.length} {cart.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Container */}
            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#DCEEFF]/50 border border-[#DCEEFF] flex items-center justify-center text-[#2C5E8A]">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-serif font-light text-xl text-slate-800 uppercase tracking-wider">Carrinho vazio</h3>
                  <p className="text-xs text-slate-400 font-normal max-w-[240px] mx-auto mt-1 leading-relaxed">
                    Navegue pelo nosso catálogo e descubra fragrâncias maravilhosas.
                  </p>
                </div>
                <button
                  id="cart-continue-shopping-btn"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#DCEEFF] hover:bg-[#CBE4F9] text-slate-800 font-bold uppercase tracking-wider text-xs rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <>
                {/* Items List View */}
                <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seus Produtos</p>
                    {cart.map((item) => {
                      const hasPromo = (!!item.product.promoção && !!item.product.preçoPromocional) || (!!item.product.preçoPromocional && item.product.preçoPromocional < item.product.preço);
                      const price = hasPromo ? item.product.preçoPromocional! : item.product.preço;
                      return (
                        <div key={item.product.id} className="flex items-start space-x-3.5 py-3 border-b border-slate-50">
                          {/* Mini Photo */}
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                            <img
                              src={item.product.imagem}
                              alt={item.product.nome}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-grow min-w-0">
                            <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest">{item.product.marca}</p>
                            <h4 className="text-xs font-bold text-stone-800 truncate">{item.product.nome}</h4>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                                {item.product.volume} • {item.product.categoria}
                              </p>
                              {item.product.estoque <= 0 && (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mb-1">
                                  Sob Pedido (5-15 dias)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-1.5">
                              {/* Quantity toggler */}
                              <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 px-1 py-0.5">
                                <button
                                  id={`qty-minus-${item.product.id}`}
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="px-2 text-stone-400 hover:text-stone-800 cursor-pointer font-bold animate-none"
                                  aria-label="Diminuir quantidade"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="px-1 text-xs font-bold text-stone-800 font-mono">{item.quantity}</span>
                                <button
                                  id={`qty-plus-${item.product.id}`}
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="px-2 text-stone-400 hover:text-stone-800 cursor-pointer font-bold animate-none"
                                  aria-label="Aumentar quantidade"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>

                              {/* Price and delete button */}
                              <div className="flex items-center space-x-3">
                                <span className="text-xs font-bold text-slate-800 font-mono">
                                  R$ {(price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                <button
                                  id={`cart-remove-${item.product.id}`}
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-stone-300 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                                  aria-label="Remover do carrinho"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sticky pricing summary & payment footer with direct WhatsApp submit */}
                <div className="border-t border-stone-200/80 px-6 py-4 bg-stone-50 shrink-0 space-y-4">
                  {hasOnOrderItems && (
                    <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl flex items-start space-x-2 text-[11px] text-amber-900 leading-snug">
                      <Clock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>Seu carrinho possui produto(s) <strong>por pedido</strong> (prazo de <strong>5 a 15 dias</strong> a confirmar com a vendedora).</span>
                    </div>
                  )}

                  {/* Payment selection */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Forma de Pagamento</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormaPagamento('pix')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border text-center flex items-center justify-center space-x-1.5 ${
                          formaPagamento === 'pix'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <span>PIX</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1 rounded-sm">5% OFF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormaPagamento('cartao')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border text-center flex items-center justify-center space-x-1.5 ${
                          formaPagamento === 'cartao'
                            ? 'bg-[#DCEEFF] border-[#5B8FB9] text-slate-800 font-bold'
                            : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <span>Cartão</span>
                        <span className="text-[9px] text-slate-500 font-medium">Até 3x</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5 pt-1 border-t border-stone-200/80">
                    <div className="flex justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      <span>Subtotal</span>
                      <span className="font-mono">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    {formaPagamento === 'pix' ? (
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-stone-800">
                          <span className="font-bold text-xs uppercase tracking-wider text-emerald-700">Total no PIX (5% OFF)</span>
                          <span className="font-bold text-base text-emerald-700 font-mono">
                            R$ {totalPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-[9px] text-stone-400 text-right">
                          Economia de R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-stone-800">
                          <span className="font-bold text-xs uppercase tracking-wider text-slate-800">Total no Cartão</span>
                          <span className="font-bold text-base text-slate-800 font-mono">
                            R$ {totalCard.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-[9px] text-stone-400 text-right font-light">
                          ou em até 3x de R$ {installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="space-y-2">
                    <button
                      id="cart-submit-whatsapp"
                      onClick={handleWhatsAppSubmit}
                      className="w-full flex items-center justify-center py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <MessageSquare size={14} className="mr-2 animate-pulse" />
                      <span>Enviar no WhatsApp</span>
                    </button>
                    <p className="text-[9px] text-center text-slate-400 font-semibold uppercase tracking-wider">
                      O pedido será enviado para o WhatsApp para combinar a entrega
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

