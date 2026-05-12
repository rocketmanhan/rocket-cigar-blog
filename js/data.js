const DB_KEY = 'cigar_blog_posts';
const VOTES_KEY = 'cigar_blog_votes';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getPosts() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(posts) {
  localStorage.setItem(DB_KEY, JSON.stringify(posts));
}

function getPost(id) {
  return getPosts().find(p => p.id === id) || null;
}

// Migrate old single-language posts to multilingual structure
function migrateData() {
  const posts = getPosts();
  let changed = false;
  posts.forEach(post => {
    if (typeof post.title === 'string') {
      post.title = { zh: post.title, en: '', es: '' };
      post.body  = { zh: post.body  || '', en: '', es: '' };
      post.tags  = { zh: post.tags  || [], en: [], es: [] };
      changed = true;
    }
  });
  if (changed) savePosts(posts);
}

// Get localized field value with fallback chain
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

function createPost(data) {
  const posts = getPosts();
  const post = {
    id: generateId(),
    title: { zh: data.title_zh || '', en: data.title_en || '', es: data.title_es || '' },
    body:  { zh: data.body_zh  || '', en: data.body_en  || '', es: data.body_es  || '' },
    tags:  {
      zh: (data.tags_zh || '').split(',').map(s => s.trim()).filter(Boolean),
      en: (data.tags_en || '').split(',').map(s => s.trim()).filter(Boolean),
      es: (data.tags_es || '').split(',').map(s => s.trim()).filter(Boolean),
    },
    brand: data.brand || '',
    origin: data.origin || '',
    strength: data.strength || '中等',
    size: data.size || '',
    price: data.price || '',
    coverUrl: data.coverUrl || '',
    ratings: [],
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
  const existing = posts[idx];

  posts[idx] = {
    ...existing,
    title: { zh: data.title_zh || '', en: data.title_en || '', es: data.title_es || '' },
    body:  { zh: data.body_zh  || '', en: data.body_en  || '', es: data.body_es  || '' },
    tags:  {
      zh: (data.tags_zh || '').split(',').map(s => s.trim()).filter(Boolean),
      en: (data.tags_en || '').split(',').map(s => s.trim()).filter(Boolean),
      es: (data.tags_es || '').split(',').map(s => s.trim()).filter(Boolean),
    },
    brand: data.brand || '',
    origin: data.origin || '',
    strength: data.strength || '中等',
    size: data.size || '',
    price: data.price || '',
    coverUrl: data.coverUrl || '',
  };
  savePosts(posts);
  return posts[idx];
}

function deletePost(id) {
  savePosts(getPosts().filter(p => p.id !== id));
}

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

function seedData() {
  migrateData();
  if (getPosts().length > 0) return;

  const samples = [
    {
      title_zh: '帕特加斯 D4 — 古巴经典之作',
      title_en: 'Partagas D4 — A Cuban Classic',
      title_es: 'Partagas D4 — Un Clásico Cubano',
      body_zh: '帕特加斯 D4（Partagas Serie D No.4）是古巴雪茄中的殿堂级作品，自1950年代起便备受烟友追捧。\n\n茄衣为深棕色科罗拉多马杜罗，油润光滑，包裹紧实。点燃后，浓烈的泥土气息扑面而来，伴随着黑胡椒与可可粉的复杂层次。燃烧中段，皮革与咖啡的香气逐渐显现，余味悠长。\n\n这支雪茄适合有经验的烟客，口感浓郁，力道十足，建议在餐后配以一杯陈年朗姆酒享用。',
      body_en: 'The Partagas Serie D No.4 is an iconic Cuban cigar that has been coveted by aficionados since the 1950s.\n\nThe colorado maduro wrapper is dark brown, oily, and tightly rolled. Upon lighting, a powerful wave of earth and black pepper hits you, evolving into complex layers of cocoa and leather through the mid-section.\n\nThis is a cigar for experienced smokers — bold, full-bodied, and best enjoyed after dinner with a glass of aged rum.',
      body_es: 'El Partagas Serie D No.4 es un puro cubano icónico, codiciado por los aficionados desde la década de 1950.\n\nLa capa colorado maduro es de color marrón oscuro, aceitosa y bien enrollada. Al encenderlo, una potente oleada de tierra y pimienta negra te envuelve, evolucionando hacia capas complejas de cacao y cuero en el tramo medio.\n\nEste es un puro para fumadores con experiencia — atrevido, con mucho cuerpo, y que se disfruta mejor después de cenar con un vaso de ron añejo.',
      tags_zh: '泥土,皮革,咖啡,黑胡椒',
      tags_en: 'earthy,leather,coffee,black pepper',
      tags_es: 'tierra,cuero,café,pimienta negra',
      brand: 'Partagas', origin: '古巴', strength: '浓郁',
      size: 'Robusto (50 × 124mm)', price: '¥180–220',
      coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      ratings: [5, 4, 5, 5, 4], createdAt: Date.now() - 86400000 * 10
    },
    {
      title_zh: 'Cohiba Siglo VI — 品质与优雅的巅峰',
      title_en: 'Cohiba Siglo VI — The Pinnacle of Quality',
      title_es: 'Cohiba Siglo VI — La Cima de la Elegancia',
      body_zh: 'Cohiba Siglo VI 是科伊巴品牌中的旗舰款型，采用最顶级的维亚尔塔阿瓦霍产区茄叶，每一支均经过严格筛选。\n\n外观精致，茄衣颜色均匀，呈深金棕色，手感如绸缎般顺滑。点燃后，花香与奶油香气交织，令人沉醉。随着燃烧推进，坚果与雪松木的气息逐渐加深，层次丰富。\n\n这是一支适合放慢节奏、细细品味的雪茄，建议在安静的午后独自享用。',
      body_en: 'The Cohiba Siglo VI is the flagship of the Cohiba line, crafted from the finest Vuelta Abajo tobaccos, each leaf meticulously selected.\n\nThe construction is impeccable — the wrapper is a uniform deep golden-brown, smooth as silk to the touch. On lighting, floral and creamy notes intertwine in a mesmerizing opening. As it burns, walnut and cedarwood deepen the profile.\n\nThis is a cigar to be savored slowly, best enjoyed alone on a quiet afternoon.',
      body_es: 'El Cohiba Siglo VI es la joya de la corona de la línea Cohiba, elaborado con los mejores tabacos de Vuelta Abajo, cada hoja meticulosamente seleccionada.\n\nLa construcción es impecable — la capa es de un marrón dorado uniforme, suave como la seda al tacto. Al encenderlo, notas florales y cremosas se entrelazan en una apertura hipnótica. A medida que avanza la combustión, nuez y cedro profundizan el perfil.\n\nEste es un puro para saborear despacio, mejor disfrutado solo en una tarde tranquila.',
      tags_zh: '花香,奶油,坚果,雪松',
      tags_en: 'floral,creamy,walnut,cedar',
      tags_es: 'floral,cremoso,nuez,cedro',
      brand: 'Cohiba', origin: '古巴', strength: '中等',
      size: 'Gran Corona (52 × 150mm)', price: '¥380–450',
      coverUrl: 'https://images.unsplash.com/photo-1605022671880-e26c006e3f48?w=600&q=80',
      ratings: [5, 5, 4, 5], createdAt: Date.now() - 86400000 * 5
    },
    {
      title_zh: 'Arturo Fuente Hemingway — 多米尼加的诗意',
      title_en: 'Arturo Fuente Hemingway — Dominican Poetry',
      title_es: 'Arturo Fuente Hemingway — Poesía Dominicana',
      body_zh: 'Arturo Fuente Hemingway 系列以文学巨匠海明威命名，产自多米尼加共和国，是非古巴雪茄中的顶尖之作。\n\n鱼雷形状的独特外观令其在众多雪茄中脱颖而出。茄衣采用喀麦隆日晒叶，颜色呈淡棕色，质地细腻。初燃时，甜美的干果香气令人愉悦，中段转变为轻微的香料与木质调性。\n\n整体口感平衡，适合各类场合享用，无论新手还是老烟枪都能找到愉悦感。',
      body_en: 'The Arturo Fuente Hemingway series is named after the literary giant and hails from the Dominican Republic — among the finest non-Cuban cigars available.\n\nIts distinctive torpedo shape sets it apart. The Cameroon sun-grown wrapper is a light tan, delicate in texture. The opening offers sweet dried fruit, transitioning to gentle spice and woody notes through the mid-section.\n\nWell-balanced and accessible, it is enjoyable on any occasion — whether you are new to cigars or a seasoned enthusiast.',
      body_es: 'La serie Arturo Fuente Hemingway lleva el nombre del gigante literario y proviene de la República Dominicana — uno de los mejores puros no cubanos disponibles.\n\nSu distintiva forma de torpedo lo diferencia. La capa camerunesa de cultivo solar es de un bronceado claro y de textura delicada. La apertura ofrece fruta seca dulce, que va hacia notas de especias suaves y madera.\n\nEquilibrado y accesible, es disfrutable en cualquier ocasión, ya seas nuevo en los puros o un entusiasta experimentado.',
      tags_zh: '干果,甜香,木质,香料',
      tags_en: 'dried fruit,sweet,woody,spice',
      tags_es: 'fruta seca,dulce,madera,especias',
      brand: 'Arturo Fuente', origin: '多米尼加', strength: '清淡',
      size: 'Torpedo (52 × 178mm)', price: '¥120–160',
      coverUrl: 'https://images.unsplash.com/photo-1574245047851-1a18a4a7b0e1?w=600&q=80',
      ratings: [4, 4, 5, 3, 4], createdAt: Date.now() - 86400000 * 2
    }
  ];

  const posts = [];
  samples.forEach(s => {
    const id = generateId();
    posts.push({
      id,
      title:    { zh: s.title_zh, en: s.title_en, es: s.title_es },
      body:     { zh: s.body_zh,  en: s.body_en,  es: s.body_es  },
      tags:     {
        zh: s.tags_zh.split(','),
        en: s.tags_en.split(','),
        es: s.tags_es.split(','),
      },
      brand:    s.brand,
      origin:   s.origin,
      strength: s.strength,
      size:     s.size,
      price:    s.price,
      coverUrl: s.coverUrl,
      ratings:  s.ratings,
      createdAt: s.createdAt
    });
  });
  savePosts(posts);
}
