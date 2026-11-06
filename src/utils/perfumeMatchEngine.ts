import { Product } from '../types';
import { getProductGender } from './productGender';

export interface PerfumeMatchAnswers {
  categoria: 'feminino' | 'masculino' | 'unissex'; // Pergunta 1
  estilo: string; // Pergunta 2 (Doce e envolvente, Fresco e cítrico, Amadeirado e sofisticado, Floral e delicado, Oriental e especiado, Ainda não sei)
  ocasiao: string; // Pergunta 3 (Trabalho e dia a dia, Encontros românticos, Festas e eventos, Ocasiões especiais, Quero um perfume versátil)
  intensidade: string; // Pergunta 4 (Suave e discreta, Moderada e equilibrada, Intensa e marcante, Não tenho preferência)
  faixaPreco: string; // Pergunta 5 (Até R$ 150, De R$ 150 a R$ 250, De R$ 250 a R$ 400, Acima de R$ 400, Sem limite definido)
  clima: string; // Pergunta 6 (Calor, Frio, Ambientes climatizados, Qualquer clima)
  prioridade: string; // Pergunta 7 (Um perfume agradável e confortável, Elegância e sofisticação, Uma fragrância diferente e original, Fixação prolongada, Versatilidade)
  perfumeReferencia?: string; // Pergunta 8
}

export interface MatchRecommendation {
  product: Product;
  score: number; // 0 a 100
  explicacao: string;
  pontosDestaque: string[];
}

export const calculatePerfumeMatches = (
  products: Product[],
  answers: PerfumeMatchAnswers
): { recommendations: MatchRecommendation[]; totalConsidered: number } => {
  // Apenas perfumes ativos com preço cadastrado
  const activeProducts = products.filter(p => p.ativo && p.preço > 0);

  // 1. Filtrar estritamente pela categoria solicitada:
  // Se usuário escolheu masculino: produtos masculinos ou unissex
  // Se usuário escolheu feminino: produtos femininos ou unissex
  // Se escolheu unissex: preferência por unissex ou todos
  let candidatePool = activeProducts.filter(p => {
    const gender = getProductGender(p);
    if (answers.categoria === 'masculino') {
      return gender === 'masculino' || gender === 'unissex';
    }
    if (answers.categoria === 'feminino') {
      return gender === 'feminino' || gender === 'unissex';
    }
    return true;
  });

  // Se o pool de candidatos for muito pequeno, considerar activeProducts
  if (candidatePool.length === 0) {
    candidatePool = activeProducts;
  }

  const scored: MatchRecommendation[] = candidatePool.map(product => {
    let score = 50; // Base score
    const pontos: string[] = [];
    const descLower = (product.descrição || '').toLowerCase();
    const nomeLower = (product.nome || '').toLowerCase();
    const marcaLower = (product.marca || '').toLowerCase();
    const catLower = (product.categoria || '').toLowerCase();
    const gender = getProductGender(product);

    // 1. Categoria Gênero (peso 15)
    if (gender === answers.categoria) {
      score += 15;
      pontos.push(`Perfil ${answers.categoria} perfeitamente alinhado`);
    } else if (gender === 'unissex') {
      score += 10;
      pontos.push('Fragrância unissex de perfil versátil');
    }

    // 2. Disponibilidade em Estoque (peso 15 - prioridade para pronta entrega)
    if (product.estoque > 0) {
      score += 15;
      pontos.push('Disponível a pronta entrega');
    } else {
      score += 5; // Disponível sob pedido
    }

    // 3. Faixa de Preço (peso 15)
    const effectivePrice = (product.preçoPromocional && product.preçoPromocional > 0) ? product.preçoPromocional : product.preço;
    let priceMatch = false;
    switch (answers.faixaPreco) {
      case 'Até R$ 150':
        priceMatch = effectivePrice <= 150;
        break;
      case 'De R$ 150 a R$ 250':
        priceMatch = effectivePrice >= 140 && effectivePrice <= 260;
        break;
      case 'De R$ 250 a R$ 400':
        priceMatch = effectivePrice >= 240 && effectivePrice <= 420;
        break;
      case 'Acima de R$ 400':
        priceMatch = effectivePrice >= 390;
        break;
      case 'Sem limite definido':
      default:
        priceMatch = true;
        break;
    }
    if (priceMatch) {
      score += 15;
      pontos.push('Dentro da sua faixa de investimento');
    }

    // 4. Estilo de Fragrância / Família Olfativa (peso 20)
    const estilo = answers.estilo;
    if (estilo.includes('Doce') || estilo.includes('envolvente')) {
      if (descLower.includes('doce') || descLower.includes('baunilha') || descLower.includes('gourmand') || descLower.includes('caramelo') || descLower.includes('âmbar') || descLower.includes('ambar') || catLower.includes('body splash')) {
        score += 20;
        pontos.push('Notas adocicadas e envolventes');
      }
    } else if (estilo.includes('Fresco') || estilo.includes('cítrico')) {
      if (descLower.includes('fresc') || descLower.includes('cítric') || descLower.includes('citric') || descLower.includes('bergamota') || descLower.includes('aquátic') || descLower.includes('aquatic') || descLower.includes('limão') || descLower.includes('laranja')) {
        score += 20;
        pontos.push('Acordes frescos e revigorantes');
      }
    } else if (estilo.includes('Amadeirado') || estilo.includes('sofisticado')) {
      if (descLower.includes('madeira') || descLower.includes('amadeirad') || descLower.includes('cedro') || descLower.includes('sândalo') || descLower.includes('sandalo') || descLower.includes('vetiver') || descLower.includes('oud')) {
        score += 20;
        pontos.push('Base amadeirada nobre e elegante');
      }
    } else if (estilo.includes('Floral') || estilo.includes('delicado')) {
      if (descLower.includes('flor') || descLower.includes('rosa') || descLower.includes('jasmin') || descLower.includes('jasmim') || descLower.includes('orquídea') || descLower.includes('delicad')) {
        score += 20;
        pontos.push('Buquê floral sofisticado');
      }
    } else if (estilo.includes('Oriental') || estilo.includes('especiado')) {
      if (descLower.includes('especi') || descLower.includes('oriental') || descLower.includes('canela') || descLower.includes('cardamomo') || catLower.includes('árabe') || catLower.includes('arabe') || descLower.includes('incenso')) {
        score += 20;
        pontos.push('Perfil oriental e especiarias marcantes');
      }
    } else {
      // "Ainda não sei"
      score += 10;
    }

    // 5. Intensidade (peso 15)
    const intensidade = product.intensidade || 3;
    if (answers.intensidade.includes('Suave')) {
      if (intensidade <= 2) {
        score += 15;
        pontos.push('Projeção suave e discreta');
      } else if (intensidade === 3) {
        score += 8;
      }
    } else if (answers.intensidade.includes('Moderada')) {
      if (intensidade === 3) {
        score += 15;
        pontos.push('Intensidade equilibrada para qualquer momento');
      } else {
        score += 8;
      }
    } else if (answers.intensidade.includes('Intensa')) {
      if (intensidade >= 4) {
        score += 15;
        pontos.push('Excelente rastro e alta intensidade');
      } else if (intensidade === 3) {
        score += 7;
      }
    } else {
      score += 10;
    }

    // 6. Ocasião e Clima (peso 15)
    const ocasiao = answers.ocasiao;
    if (ocasiao.includes('Trabalho') || ocasiao.includes('dia a dia')) {
      if (descLower.includes('dia') || descLower.includes('trabalho') || descLower.includes('versátil') || descLower.includes('fresc') || intensidade <= 3) {
        score += 10;
        pontos.push('Perfeito para a rotina diária');
      }
    } else if (ocasiao.includes('Encontros') || ocasiao.includes('românticos')) {
      if (descLower.includes('sedut') || descLower.includes('sensual') || descLower.includes('marcante') || descLower.includes('romântic')) {
        score += 10;
        pontos.push('Ideal para encontros marcantes');
      }
    } else if (ocasiao.includes('Festas') || ocasiao.includes('especiais')) {
      if (intensidade >= 4 || descLower.includes('noite') || descLower.includes('luxo') || descLower.includes('festa')) {
        score += 10;
        pontos.push('Destaca-se em noites e ocasiões especiais');
      }
    } else {
      score += 8;
    }

    // 7. Prioridade do Usuário (peso 10)
    if (answers.prioridade.includes('Fixação')) {
      if (intensidade >= 4 || descLower.includes('fixação') || descLower.includes('longa duração')) {
        score += 10;
        pontos.push('Alta durabilidade na pele');
      }
    } else if (answers.prioridade.includes('Elegância')) {
      if (descLower.includes('sofistic') || descLower.includes('elegân') || catLower.includes('importado')) {
        score += 10;
        pontos.push('Toque de pura elegância e requinte');
      }
    } else if (answers.prioridade.includes('diferente') || answers.prioridade.includes('original')) {
      if (catLower.includes('árabe') || catLower.includes('arabe') || descLower.includes('exclusiv')) {
        score += 10;
        pontos.push('Fragrância autêntica e memorável');
      }
    }

    // 8. Perfume de Referência (bônus caso mencione marca ou nome similar)
    if (answers.perfumeReferencia && answers.perfumeReferencia.trim().length > 2) {
      const ref = answers.perfumeReferencia.toLowerCase().trim();
      if (nomeLower.includes(ref) || marcaLower.includes(ref) || descLower.includes(ref)) {
        score += 15;
        pontos.push(`Harmoniza com sua referência (${answers.perfumeReferencia})`);
      }
    }

    // Normalizar pontuação para intervalo realista de 75% a 98%
    const normalizedScore = Math.min(98, Math.max(76, Math.round(score * 0.72 + 25)));

    // Elaborar explicação personalizada baseada nos pontos reais do produto
    let explicacao = `Selecionado por harmonizar com sua busca por um perfume ${answers.categoria} `;
    if (answers.estilo !== 'Ainda não sei') {
      explicacao += `de estilo ${answers.estilo.toLowerCase()}. `;
    } else {
      explicacao += `de perfil equilibrado e marcante. `;
    }

    if (pontos.length > 0) {
      explicacao += `Destaca-se por: ${pontos.slice(0, 2).join(' e ')}.`;
    }

    return {
      product,
      score: normalizedScore,
      explicacao,
      pontosDestaque: pontos.slice(0, 3)
    };
  });

  // Ordenar pela maior pontuação
  scored.sort((a, b) => b.score - a.score);

  // Retornar os 3 melhores
  return {
    recommendations: scored.slice(0, 3),
    totalConsidered: candidatePool.length
  };
};
