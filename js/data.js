const DB_KEY = 'cigar_blog_posts';
const VOTES_KEY = 'cigar_blog_votes';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getPosts() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(posts) { localStorage.setItem(DB_KEY, JSON.stringify(posts)); }

function getPost(id) { return getPosts().find(p => p.id === id) || null; }

function localized(field, lang) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[lang] || field.zh || field.en || field.es || '';
}

function localizedTags(field, lang) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return field[lang] || field.zh || field.en || field.es || [];
}

function migrateData() {
  const posts = getPosts();
  let changed = false;
  posts.forEach(p => {
    if (typeof p.title === 'string') {
      p.title = { zh: p.title, en: '', es: '' };
      p.body  = { zh: p.body  || '', en: '', es: '' };
      p.tags  = { zh: p.tags  || [], en: [], es: [] };
      changed = true;
    }
    if (!p.notes)    { p.notes    = { zh: '', en: '', es: '' }; changed = true; }
    if (!p.vitola)   { p.vitola   = ''; changed = true; }
    if (!p.wrapper)  { p.wrapper  = ''; changed = true; }
    if (!p.binder)   { p.binder   = ''; changed = true; }
    if (!p.filler)   { p.filler   = ''; changed = true; }
    if (p.myRating === undefined) { p.myRating = 0; changed = true; }
  });
  if (changed) savePosts(posts);
}

function splitTags(str) {
  return (str || '').split(',').map(s => s.trim()).filter(Boolean);
}

function createPost(data) {
  const posts = getPosts();
  const post = {
    id: generateId(),
    title:    { zh: data.title_zh || '', en: data.title_en || '', es: data.title_es || '' },
    body:     { zh: data.body_zh  || '', en: data.body_en  || '', es: data.body_es  || '' },
    notes:    { zh: data.notes_zh || '', en: data.notes_en || '', es: data.notes_es || '' },
    tags:     { zh: splitTags(data.tags_zh), en: splitTags(data.tags_en), es: splitTags(data.tags_es) },
    brand:    data.brand    || '',
    origin:   data.origin   || '',
    strength: data.strength || '中等',
    vitola:   data.vitola   || '',
    wrapper:  data.wrapper  || '',
    binder:   data.binder   || '',
    filler:   data.filler   || '',
    size:     data.size     || '',
    price:    data.price    || '',
    myRating: parseInt(data.myRating) || 0,
    coverUrl: data.coverUrl || '',
    ratings:  [],
    createdAt: Date.now()
  };
  posts.unshift(post);
  savePosts(posts);
  return post;
}

function updatePost(id, data) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  posts[idx] = {
    ...posts[idx],
    title:    { zh: data.title_zh || '', en: data.title_en || '', es: data.title_es || '' },
    body:     { zh: data.body_zh  || '', en: data.body_en  || '', es: data.body_es  || '' },
    notes:    { zh: data.notes_zh || '', en: data.notes_en || '', es: data.notes_es || '' },
    tags:     { zh: splitTags(data.tags_zh), en: splitTags(data.tags_en), es: splitTags(data.tags_es) },
    brand:    data.brand    || '',
    origin:   data.origin   || '',
    strength: data.strength || '中等',
    vitola:   data.vitola   || '',
    wrapper:  data.wrapper  || '',
    binder:   data.binder   || '',
    filler:   data.filler   || '',
    size:     data.size     || '',
    price:    data.price    || '',
    myRating: parseInt(data.myRating) || 0,
    coverUrl: data.coverUrl !== undefined ? data.coverUrl : posts[idx].coverUrl,
  };
  savePosts(posts);
  return posts[idx];
}

function deletePost(id) { savePosts(getPosts().filter(p => p.id !== id)); }

function hasVoted(postId) {
  return !!(JSON.parse(localStorage.getItem(VOTES_KEY) || '{}')[postId]);
}

function addRating(postId, score) {
  if (hasVoted(postId)) return false;
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === postId);
  if (idx === -1) return false;
  posts[idx].ratings.push(score);
  savePosts(posts);
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  votes[postId] = score;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  return true;
}

function avgRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

const PINNED = [
  {
    pid: 'tatuaje-tuxtla-2026',
    title:   { zh: 'Tatuaje ES 2026 Tuxtla Robusto Gordo (5 5/8 × 54)', en: 'Tatuaje ES 2026 Tuxtla Robusto Gordo (5 5/8 × 54)', es: 'Tatuaje ES 2026 Tuxtla Robusto Gordo (5 5/8 × 54)' },
    body: {
      zh: 'Tatuaje Exclusive Series Tuxtla 2026 是 Pete Johnson 精心打造的限量杰作，充分展现了墨西哥 San Andrés 茄衣大胆而丰富的个性。这款深色油润的茄衣生长于墨西哥韦拉克鲁斯州著名的 San Andrés Tuxtla 地区，带来可可、大地、胡椒以及微妙天然甜味的精致风味。\n\n由 Pete Johnson 精心调配，并在尼加拉瓜备受推崇的 My Father Cigars 工厂严格制作，这款限量版充分展示了 Tatuaje 品牌背后的精湛工艺。Tuxtla 系列将墨西哥 San Andrés 烟草的力量与精选优质茄芯完美融合，带来浓郁而复杂的品烟体验。',
      en: 'Introducing the Tatuaje Exclusive Series Tuxtla 2026. This exceptional cigar is a true masterpiece, crafted to showcase the bold, rich character of the Mexican San Andrés wrapper. Grown in the renowned San Andrés Tuxtla region of Veracruz, Mexico, this dark, oily leaf delivers a refined profile of cocoa, earth, pepper, and a subtle natural sweetness.\n\nExpertly blended by Pete Johnson and meticulously produced at the esteemed My Father Cigars factory in Nicaragua, this release exemplifies the artistry behind the Tatuaje brand. The Tuxtla series brings together the strength of Mexican San Andrés tobacco with carefully selected premium fillers, resulting in a robust and complex smoking experience.',
      es: 'Presentamos el Tatuaje Exclusive Series Tuxtla 2026. Este excepcional puro es una verdadera obra maestra, elaborado para mostrar el carácter audaz y rico de la capa mexicana San Andrés. Cultivada en la famosa región San Andrés Tuxtla de Veracruz, México, esta hoja oscura y aceitosa ofrece un perfil refinado de cacao, tierra, pimienta y una sutil dulzura natural.\n\nMagistralmente mezclado por Pete Johnson y meticulosamente producido en la prestigiosa fábrica My Father Cigars en Nicaragua, este lanzamiento ejemplifica la maestría detrás de la marca Tatuaje. La serie Tuxtla reúne la potencia del tabaco mexicano San Andrés con rellenos premium cuidadosamente seleccionados, resultando en una experiencia de fumado robusta y compleja.'
    },
    notes:   { zh: '', en: '', es: '' },
    tags:    { zh: ['可可','大地','胡椒','甜味'], en: ['cocoa','earthy','pepper','sweet'], es: ['cacao','tierra','pimienta','dulce'] },
    brand: 'Tatuaje', origin: '尼加拉瓜', strength: '浓郁',
    vitola: 'Robusto Gordo', wrapper: 'Mexican San Andrés Maduro',
    binder: 'Nicaragua', filler: 'Nicaragua Blend',
    size: '5 5/8 × 54', price: '', myRating: 0,
    coverUrl: 'https://rocketmanhan.github.io/rocket-cigar-blog/images/tuxtla26.jpg',
    ratings: [], createdAt: Date.now()
  }
];

function syncPinned() {
  const posts = getPosts();
  let changed = false;
  PINNED.forEach(pinned => {
    if (!posts.find(p => p.pid === pinned.pid)) {
      posts.unshift({ id: generateId(), ...pinned });
      changed = true;
    }
  });
  if (changed) savePosts(posts);
}

function seedData() {
  migrateData();
  syncPinned();
  if (getPosts().length > 1) return;

  const posts = [
    {
      id: generateId(),
      title:   { zh: 'Tatuaje Tuxtla — 墨西哥烈性茄', en: 'Tatuaje Tuxtla — Mexican Power', es: 'Tatuaje Tuxtla — Poder Mexicano' },
      body:    { zh: 'Tatuaje Tuxtla 是 Pete Johnson 向墨西哥 San Andrés 烟草致敬之作，采用100%墨西哥叶料，产量极为有限。茄衣选用深黑色的墨西哥马杜罗，油润厚实，外观令人印象深刻。', en: 'The Tatuaje Tuxtla is Pete Johnson\'s tribute to Mexican San Andrés tobacco, made with 100% Mexican leaf and produced in extremely limited quantities. The dark Mexican maduro wrapper is oily and thick, making an impressive first impression.', es: 'El Tatuaje Tuxtla es el homenaje de Pete Johnson al tabaco mexicano San Andrés, elaborado con hoja 100% mexicana y producido en cantidades extremadamente limitadas.' },
      notes:   { zh: '冷吸：浓郁的黑巧克力与皮革气息。\n\n开燃段：强烈的黑胡椒冲击，伴随着黑咖啡与可可的底韵，力道十足。\n\n中段：口感逐渐圆润，皮革与烤坚果的香气浮现，余韵悠长。\n\n尾段：甜度微升，雪松木与黑巧克力收尾，令人回味。', en: 'Cold draw: Rich dark chocolate and leather.\n\nFirst third: Intense black pepper hit with undercurrents of black coffee and cocoa — this is a powerful smoke.\n\nSecond third: The profile rounds out, leather and roasted nuts emerge with a long finish.\n\nFinal third: Sweetness rises slightly, closing with cedar and dark chocolate.', es: 'Tiraje en frío: Chocolate negro intenso y cuero.\n\nPrimer tercio: Golpe de pimienta negra intensa con fondo de café negro y cacao.\n\nSegundo tercio: El perfil se redondea, emergen cuero y nueces tostadas.\n\nTercio final: La dulzura sube ligeramente, cerrando con cedro y chocolate negro.' },
      tags:    { zh: ['黑巧克力','皮革','黑胡椒','咖啡'], en: ['dark chocolate','leather','black pepper','coffee'], es: ['chocolate negro','cuero','pimienta negra','café'] },
      brand: 'Tatuaje', origin: '尼加拉瓜', strength: '浓郁',
      vitola: 'Robusto Gordo', wrapper: '墨西哥 San Andrés Maduro',
      binder: '尼加拉瓜', filler: '尼加拉瓜混合',
      size: '5½ × 60', price: '¥120–150', myRating: 93,
      coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      ratings: [5, 4, 5, 5], createdAt: Date.now() - 86400000 * 3
    },
    {
      id: generateId(),
      title:   { zh: 'Cohiba Siglo VI — 古巴皇冠之作', en: 'Cohiba Siglo VI — Crown of Cuba', es: 'Cohiba Siglo VI — La Corona de Cuba' },
      body:    { zh: 'Cohiba Siglo VI 是科伊巴系列旗舰款，采用维亚尔塔阿瓦霍最顶级烟叶精制而成，每支均经三重发酵处理，是古巴工艺的极致体现。', en: 'The Cohiba Siglo VI is the flagship of the Cohiba line, crafted from the finest Vuelta Abajo tobaccos, triple fermented — the ultimate expression of Cuban craftsmanship.', es: 'El Cohiba Siglo VI es la joya de la corona de la línea Cohiba, elaborado con los mejores tabacos de Vuelta Abajo, de triple fermentación.' },
      notes:   { zh: '冷吸：花香与奶油，令人期待。\n\n开燃段：丝滑的奶油口感，伴随淡淡的花香与坚果，燃烧极为均匀。\n\n中段：雪松木与黑胡椒微微浮现，层次丰富，余韵悠长。\n\n尾段：温暖的皮革与核桃收尾，始终优雅。', en: 'Cold draw: Floral and creamy — very promising.\n\nFirst third: Silky cream with delicate floral notes and nuts, incredibly even burn.\n\nSecond third: Cedar and gentle pepper emerge, complex and long-finishing.\n\nFinal third: Warm leather and walnut close, elegant throughout.', es: 'Tiraje en frío: Floral y cremoso.\n\nPrimer tercio: Crema sedosa con notas florales delicadas y nueces.\n\nSegundo tercio: Cedro y pimienta suave emergen, complejo.\n\nTercio final: Cuero cálido y nuez, elegante.' },
      tags:    { zh: ['花香','奶油','雪松','坚果'], en: ['floral','creamy','cedar','nuts'], es: ['floral','cremoso','cedro','nueces'] },
      brand: 'Cohiba', origin: '古巴', strength: '中等',
      vitola: 'Gran Corona', wrapper: '古巴 Colorado Claro',
      binder: '古巴', filler: '古巴维亚尔塔阿瓦霍',
      size: '52 × 150mm', price: '¥380–450', myRating: 97,
      coverUrl: 'https://images.unsplash.com/photo-1605022671880-e26c006e3f48?w=800&q=80',
      ratings: [5, 5, 4, 5], createdAt: Date.now() - 86400000 * 7
    }
  ];
  savePosts(posts);
}
