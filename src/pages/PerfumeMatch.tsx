import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Check, 
  Heart, 
  MessageSquare, 
  Clock, 
  Flame, 
  Eye, 
  ShoppingBag,
  Award,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PerfumeMatchAnswers, 
  calculatePerfumeMatches, 
  MatchRecommendation 
} from '../utils/perfumeMatchEngine';

interface QuestionConfig {
  id: number;
  title: string;
  subtitle: string;
  field: keyof PerfumeMatchAnswers;
  isOptional?: boolean;
  type: 'options' | 'text';
  options?: {
    label: string;
    description?: string;
    icon?: string;
  }[];
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 1,
    title: 'Qual tipo de perfume você procura?',
    subtitle: 'Essa pergunta trata da categoria olfativa desejada, definindo o perfil inicial da fragrância.',
    field: 'categoria',
    type: 'options',
    options: [
      { label: 'Feminino', description: 'Fragrâncias de acordes florais, frutados ou doces marcantes' },
      { label: 'Masculino', description: 'Fragrâncias amadeiradas, aromáticas, cítricas ou especiadas' },
      { label: 'Unissex', description: 'Criações compartilháveis e versáteis que caem bem em qualquer pessoa' },
    ]
  },
  {
    id: 2,
    title: 'Qual estilo de fragrância você prefere?',
    subtitle: 'A família olfativa expressa a personalidade e sensação da sua assinatura.',
    field: 'estilo',
    type: 'options',
    options: [
      { label: 'Doce e envolvente', description: 'Notas de baunilha, caramelo, âmbar e gourmand' },
      { label: 'Fresco e cítrico', description: 'Bergamota, limão siciliano, acordes aquáticos e verdes' },
      { label: 'Amadeirado e sofisticado', description: 'Cedro, sândalo, vetiver e madeiras nobres' },
      { label: 'Floral e delicado', description: 'Rosas, jasmim, flor de laranjeira e orquídeas' },
      { label: 'Oriental e especiado', description: 'Especiarias árabes, canela, cardamomo e incenso' },
      { label: 'Ainda não sei', description: 'Quero que o consultor analise as melhores opções' },
    ]
  },
  {
    id: 3,
    title: 'Em quais ocasiões pretende usar?',
    subtitle: 'Escolha o momento de maior destaque para o seu perfume.',
    field: 'ocasiao',
    type: 'options',
    options: [
      { label: 'Trabalho e dia a dia', description: 'Agradável, sofisticado e não invasivo' },
      { label: 'Encontros românticos', description: 'Sedutor, aconchegante e inesquecível' },
      { label: 'Festas e eventos', description: 'Marcante, que deixa rastro por onde passa' },
      { label: 'Ocasiões especiais', description: 'Para casamentos, jantares e momentos únicos' },
      { label: 'Quero um perfume versátil', description: 'Curinga que funciona do dia à noite' },
    ]
  },
  {
    id: 4,
    title: 'Qual intensidade prefere?',
    subtitle: 'A projeção determina o alcance da fragrância ao seu redor.',
    field: 'intensidade',
    type: 'options',
    options: [
      { label: 'Suave e discreta', description: 'Percebida na pele de quem se aproxima' },
      { label: 'Moderada e equilibrada', description: 'Presença elegante na medida exata' },
      { label: 'Intensa e marcante', description: 'Grande rastro e projeção memorável' },
      { label: 'Não tenho preferência', description: 'Aberto a diferentes experiências' },
    ]
  },
  {
    id: 5,
    title: 'Qual faixa de preço deseja?',
    subtitle: 'Selecionamos opções com o melhor custo-benefício e valor dentro da sua meta.',
    field: 'faixaPreco',
    type: 'options',
    options: [
      { label: 'Até R$ 150', description: 'Opções acessíveis e Body Splashes de alto padrão' },
      { label: 'De R$ 150 a R$ 250', description: 'Excelente custo-benefício em perfumes de 100ml' },
      { label: 'De R$ 250 a R$ 400', description: 'Importados selecionados e árabes premium' },
      { label: 'Acima de R$ 400', description: 'Fragrâncias de puro luxo e alta exclusividade' },
      { label: 'Sem limite definido', description: 'Mostrar as melhores fragrâncias independente do valor' },
    ]
  },
  {
    id: 6,
    title: 'Em qual clima costuma usar perfume?',
    subtitle: 'A temperatura do ambiente influencia diretamente na evolução das notas.',
    field: 'clima',
    type: 'options',
    options: [
      { label: 'Calor', description: 'Notas leves que não pesam em dias ensolarados' },
      { label: 'Frio', description: 'Fragrâncias densas, quentes e aveludadas' },
      { label: 'Ambientes climatizados', description: 'Ideal para escritório com ar-condicionado' },
      { label: 'Qualquer clima', description: 'Fórmula equilibrada para todas as estações' },
    ]
  },
  {
    id: 7,
    title: 'O que você mais valoriza?',
    subtitle: 'O aspecto fundamental que não pode faltar na sua fragrância.',
    field: 'prioridade',
    type: 'options',
    options: [
      { label: 'Um perfume agradável e confortável', description: 'Sensação de bem-estar o dia inteiro' },
      { label: 'Elegância e sofisticação', description: 'Passar uma imagem refinada e impecável' },
      { label: 'Uma fragrância diferente e original', description: 'Fugir do óbvio com notas autênticas' },
      { label: 'Fixação prolongada', description: 'Durabilidade que dura muitas horas na pele' },
      { label: 'Versatilidade', description: 'Praticidade para usar em qualquer situação' },
    ]
  },
  {
    id: 8,
    title: 'Existe algum perfume que você já usa e gosta?',
    subtitle: 'Opcional: digite o nome de um perfume que você admira para calibrarmos ainda melhor a recomendação.',
    field: 'perfumeReferencia',
    isOptional: true,
    type: 'text'
  }
];

export const PerfumeMatch: React.FC = () => {
  const { products, config } = useApp();
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1..8 = Questions, 9 = Analyzing, 10 = Results
  const [answers, setAnswers] = useState<PerfumeMatchAnswers>({
    categoria: 'unissex',
    estilo: 'Ainda não sei',
    ocasiao: 'Quero um perfume versátil',
    intensidade: 'Moderada e equilibrada',
    faixaPreco: 'Sem limite definido',
    clima: 'Qualquer clima',
    prioridade: 'Versatilidade',
    perfumeReferencia: ''
  });

  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);
  const [totalPool, setTotalPool] = useState<number>(0);
  const [copiedToast, setCopiedToast] = useState(false);

  const currentQuestion = QUESTIONS[step - 1];

  const handleStart = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (field: keyof PerfumeMatchAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finalize and analyze
      setStep(9); // Loading transition
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        const result = calculatePerfumeMatches(products, answers);
        setRecommendations(result.recommendations);
        setTotalPool(result.totalConsidered);
        setStep(10); // Show results
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1600);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 1) {
      setStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({
      categoria: 'unissex',
      estilo: 'Ainda não sei',
      ocasiao: 'Quero um perfume versátil',
      intensidade: 'Moderada e equilibrada',
      faixaPreco: 'Sem limite definido',
      clima: 'Qualquer clima',
      prioridade: 'Versatilidade',
      perfumeReferencia: ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Perfume Match - Perfumaria Ferraz',
        text: 'Encontre a fragrância perfeita para seu estilo no consultor virtual da Perfumaria Ferraz!',
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const getWhatsAppMessageUrl = (productName: string) => {
    const text = `Olá! Fiz o teste de perfumes no site e gostei do ${productName}. Gostaria de saber mais sobre ele.`;
    return `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* TOAST COPIED */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-6 z-50 bg-slate-800 text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
            >
              <Check size={14} className="text-emerald-400" />
              <span>Link copiado para a área de transferência!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP 0: INTRO SCREEN */}
        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-14 shadow-sm text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DCEEFF]/60 rounded-full border border-[#BBDDFB] text-[#2C5E8A] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Consultor Virtual Interativo</span>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-5xl font-serif font-light text-slate-800 uppercase tracking-wide leading-tight">
                Descubra o perfume <br />
                <span className="font-semibold text-[#2C5E8A]">perfeito para você</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                Responda algumas perguntas e encontre a fragrância que combina com seu estilo. Nosso algoritmo inteligente analisa notas olfativas, fixação e ocasiões de uso para indicar os 3 perfumes ideais do catálogo.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E8A] block">1. Personalizado</span>
                <p className="text-xs text-slate-500 leading-relaxed">Perguntas sobre ocasiões, intensidade e notas que você realmente aprecia.</p>
              </div>
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E8A] block">2. Catálogo Real</span>
                <p className="text-xs text-slate-500 leading-relaxed">Recomendações com base nas fragrâncias e preços reais da loja.</p>
              </div>
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E8A] block">3. Explicação Clara</span>
                <p className="text-xs text-slate-500 leading-relaxed">Você entende exatamente o motivo de cada perfume ter sido indicado.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 bg-[#2C5E8A] hover:bg-[#1E4364] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wand2 size={16} />
                <span>Descobrir meu perfume</span>
                <ArrowRight size={16} />
              </button>
              
              <Link
                to="/catalogo"
                className="w-full sm:w-auto px-6 py-4 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Explorar catálogo manualmente
              </Link>
            </div>
          </motion.div>
        )}

        {/* STEP 1..8: INTERACTIVE QUESTIONS */}
        {step >= 1 && step <= QUESTIONS.length && currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* Header / Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Voltar</span>
                </button>
                <span className="font-bold text-[#2C5E8A]">
                  Pergunta {step} de {QUESTIONS.length}
                </span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2C5E8A] transition-all duration-300 rounded-full"
                  style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-serif text-slate-800 font-normal">
                {currentQuestion.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options grid or text input */}
            {currentQuestion.type === 'options' && currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const currentValue = answers[currentQuestion.field];
                  const isSelected = 
                    currentQuestion.field === 'categoria'
                      ? (currentValue as string).toLowerCase() === opt.label.toLowerCase()
                      : currentValue === opt.label;

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(
                        currentQuestion.field, 
                        currentQuestion.field === 'categoria' ? opt.label.toLowerCase() : opt.label
                      )}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected 
                          ? 'border-[#2C5E8A] bg-[#DCEEFF]/30 shadow-xs' 
                          : 'border-slate-150 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${isSelected ? 'text-[#2C5E8A]' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-xs text-slate-500 leading-snug block font-light">
                            {opt.description}
                          </span>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-[#2C5E8A] bg-[#2C5E8A] text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text Input question (Reference perfume) */}
            {currentQuestion.type === 'text' && (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Ex: Good Girl, Sauvage, Malbec, Asad..."
                  value={answers.perfumeReferencia || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, perfumeReferencia: e.target.value }))}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C5E8A] focus:bg-white transition-all"
                />
                <p className="text-xs text-slate-400 italic">
                  Você pode deixar em branco caso não queira informar um perfume de referência.
                </p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-[#2C5E8A] hover:bg-[#1E4364] text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>{step === QUESTIONS.length ? 'Finalizar e Ver Recomendações' : 'Avançar'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 9: ANALYZING TRANSITION */}
        {step === 9 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-100 p-12 sm:p-20 shadow-sm text-center space-y-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-[#DCEEFF] border-t-[#2C5E8A] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[#2C5E8A]">
                <Wand2 size={24} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-serif text-slate-800">
                Encontramos fragrâncias que combinam com você
              </h2>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Calculando compatibilidade, intensidade e notas olfativas com base nos perfumes cadastrados na Perfumaria Ferraz...
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 10: RESULTS SCREEN */}
        {step === 10 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Header summary */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2C5E8A] flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Resultado da Análise
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-light text-slate-800 uppercase tracking-wide">
                  Seus 3 Perfumes Ideais
                </h1>
                <p className="text-xs text-slate-500 font-light max-w-xl">
                  Analisamos {totalPool} perfumes do catálogo. Os índices abaixo representam estimativas de afinidade com o seu perfil declarado.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Refazer teste</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-[#DCEEFF] hover:bg-[#CBE4F9] text-[#2C5E8A] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => {
                const p = rec.product;
                const isWinner = index === 0;
                const hasDiscount = (!!p.promoção && !!p.preçoPromocional) || (!!p.preçoPromocional && p.preçoPromocional < p.preço);
                const currentPrice = hasDiscount ? p.preçoPromocional! : p.preço;

                return (
                  <div
                    key={p.id}
                    className={`relative bg-white rounded-3xl border overflow-hidden flex flex-col transition-all duration-300 ${
                      isWinner 
                        ? 'border-[#2C5E8A] shadow-md ring-2 ring-[#2C5E8A]/20' 
                        : 'border-slate-150 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Top Badge: Winner or Rank */}
                    <div className="p-4 pb-0 flex items-center justify-between">
                      {isWinner ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2C5E8A] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-2xs">
                          <Award size={12} />
                          Sua melhor combinação
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Opção #{index + 1}
                        </span>
                      )}

                      {/* Estimated Compatibility Badge */}
                      <span className="text-xs font-bold font-mono text-[#2C5E8A] bg-[#DCEEFF]/60 border border-[#BBDDFB] px-2.5 py-0.5 rounded-full">
                        {rec.score}% compatível*
                      </span>
                    </div>

                    {/* Image */}
                    <div className="p-4 pb-0">
                      <Link to={`/produto/${p.id}`} className="block relative aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden group">
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {p.estoque > 0 ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              A Pronta Entrega
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                              <Clock size={10} />
                              Sob Pedido
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Details Body */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>{p.marca}</span>
                          <span>{p.volume} • {p.categoria}</span>
                        </div>

                        <Link to={`/produto/${p.id}`} className="block text-base font-bold text-slate-800 hover:text-[#2C5E8A] transition-colors leading-snug">
                          {p.nome}
                        </Link>

                        {/* Pricing */}
                        <div className="pt-1">
                          {hasDiscount ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-slate-400 line-through">
                                R$ {p.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-base font-bold text-rose-600">
                                R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          ) : (
                            <div className="text-base font-bold text-slate-800">
                              R$ {p.preço.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          )}
                        </div>

                        {/* Personalized Explanation Box */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600 leading-relaxed font-light">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-[#2C5E8A] block">
                            Por que recomendamos:
                          </span>
                          <p>{rec.explicacao}</p>
                        </div>
                      </div>

                      {/* Call to actions */}
                      <div className="space-y-2 pt-2">
                        <a
                          href={getWhatsAppMessageUrl(p.nome)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-[#2C5E8A] hover:bg-[#1E4364] text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare size={14} />
                          <span>Quero esse perfume</span>
                        </a>

                        <Link
                          to={`/produto/${p.id}`}
                          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Ver detalhes</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer footer */}
            <div className="p-4 bg-slate-100/60 rounded-2xl text-center text-xs text-slate-400 leading-relaxed">
              * Nota: Os índices de compatibilidade são estimativas calculadas a partir das notas e preferências informadas, não constituindo garantia absoluta de agrado olfativo individual.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
