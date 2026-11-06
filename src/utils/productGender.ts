// Helper to accurately resolve a product's gender categorization based on name and sheet data
export const getProductGender = (p: { nome: string; categoria: string; tipo?: string }): 'masculino' | 'feminino' | 'unissex' => {
  const name = (p.nome || '').toLowerCase();
  const cat = (p.categoria || '').toLowerCase();
  const sheetTipo = (p.tipo || '').toLowerCase().trim();

  // 1. Force masculine for famous masculine names or brand collections
  if (
    name.includes('malbec') || 
    name.includes('club 6') || 
    name.includes('the blend') || 
    name.includes('sauvage') || 
    name.includes('bleu de chanel') || 
    name.includes('invictus') || 
    name.includes('1 million') || 
    name.includes('le male') || 
    name.includes('scandal pour homme') || 
    name.includes('ultra male') || 
    name.includes('eros') || 
    name.includes('pour homme') || 
    name.includes('bad boy') || 
    name.includes('212 vip black') || 
    name.includes('212 men') || 
    name.includes('ch men') || 
    name.includes('hugo man') || 
    name.includes('boss bottled') || 
    name.includes('explorer') || 
    name.includes('legend') || 
    name.includes('club de nuit') ||
    name.includes('asad') ||
    name.includes('fakhar black') ||
    name.includes('9 pm') ||
    name.includes('9pm') ||
    name.includes('supremacy') ||
    name.includes('turathi') ||
    name.includes('hawas') ||
    name.includes('daarej')
  ) {
    return 'masculino';
  }

  // 2. Force feminine for famous feminine names or brand collections
  if (
    name.includes('la vie est belle') || 
    name.includes('idôle') || 
    name.includes('good girl') || 
    name.includes('212 vip rosé') || 
    name.includes('libre') || 
    name.includes('black opium') || 
    name.includes('j\'adore') || 
    name.includes('miss dior') || 
    name.includes('coco mademoiselle') || 
    name.includes('chance') || 
    name.includes('floratta') || 
    name.includes('egeo dolce') || 
    name.includes('lily') ||
    name.includes('fakhar rose') ||
    name.includes('yara')
  ) {
    return 'feminino';
  }

  // 3. Fallback to sheet tipo
  if (sheetTipo === 'masculino') return 'masculino';
  if (sheetTipo === 'feminino') return 'feminino';
  if (sheetTipo === 'unisex' || sheetTipo === 'unissex') return 'unissex';

  // 4. Default by category name
  if (cat.includes('masculino')) return 'masculino';
  if (cat.includes('feminino')) return 'feminino';

  return 'unissex';
};
