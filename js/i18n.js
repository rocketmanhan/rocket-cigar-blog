const LANG_KEY = 'rocket_lang';

const TRANSLATIONS = {
  zh: {
    form_content_notice: '📝 以下标题、正文、标签可分三种语言填写',
    site_name: 'Rocket 雪茄房',
    site_tagline: '探索世界顶级雪茄 · 分享品鉴心得',
    nav_home: '首页',
    nav_admin: '管理',
    search_placeholder: '搜索雪茄名称、品牌...',
    all_strengths: '全部口感',
    all_origins: '全部产地',
    strength_light: '清淡',
    strength_medium: '中等',
    strength_full: '浓郁',
    unknown_brand: '未知品牌',
    votes: '票',
    no_rating: '暂无',
    empty_posts: '暂无文章，请前往<a href="admin.html">管理面板</a>添加。',
    back_home: '← 返回首页',
    label_brand: '品牌',
    label_origin: '产地',
    label_size: '尺寸',
    label_price: '价格区间',
    label_date: '发布日期',
    rating_title: '📊 读者评分',
    rating_hint: '点击星星为这支雪茄评分',
    rating_voted: '✅ 感谢您的评分！',
    rating_none: '暂无评分，成为第一个评分的人！',
    toast_already_voted: '您已经评过分了',
    admin_title: '📋 文章管理',
    btn_add: '＋ 添加文章',
    btn_logout: '退出登录',
    btn_edit: '✏️ 编辑',
    btn_delete: '🗑️ 删除',
    btn_save: '💾 保存',
    btn_cancel: '取消',
    pw_title: '🔒 管理员登录',
    pw_hint: '请输入管理密码以进入后台',
    pw_btn: '进入管理',
    pw_error: '密码错误，请重试。',
    modal_add: '添加新文章',
    modal_edit: '编辑文章',
    lbl_art_title: '文章标题 *',
    lbl_brand: '品牌',
    lbl_origin: '产地',
    lbl_strength: '口感强度',
    lbl_size: '尺寸规格',
    lbl_price: '价格区间',
    lbl_tags: '标签（逗号分隔）',
    lbl_cover: '封面图片 URL',
    lbl_body: '文章正文 *',
    ph_title: '例：帕特加斯 D4 评测',
    ph_brand: '例：Partagas',
    ph_origin: '例：古巴',
    ph_size: '例：罗布图 (50×124mm)',
    ph_price: '例：¥180–220',
    ph_tags: '例：泥土,皮革,咖啡',
    ph_cover: 'https://...',
    ph_body: '在这里写下您的品鉴文章...',
    toast_updated: '文章已更新',
    toast_added: '文章已添加',
    toast_deleted: '文章已删除',
    confirm_delete: (title) => `确认删除文章「${title}」？此操作不可撤销。`,
    val_title: '请填写文章标题',
    val_body: '请填写文章正文',
    empty_admin: '暂无文章，点击"添加文章"开始。',
    no_votes_text: '暂无评分',
    toast_rated: (score) => `您给出了 ${score} 星评分，谢谢！`,
    rating_avg: (avg, count) => `平均 ${avg} 分 · 共 ${count} 人评分`,
  },
  en: {
    form_content_notice: '📝 Fill in title, body and tags for each language below',
    site_name: 'Rocket Cigar Lounge',
    site_tagline: 'Explore Premium Cigars · Share Your Reviews',
    nav_home: 'Home',
    nav_admin: 'Admin',
    search_placeholder: 'Search by name, brand...',
    all_strengths: 'All Strengths',
    all_origins: 'All Origins',
    strength_light: 'Mild',
    strength_medium: 'Medium',
    strength_full: 'Full',
    unknown_brand: 'Unknown Brand',
    votes: 'votes',
    no_rating: 'N/A',
    empty_posts: 'No articles yet. Go to the <a href="admin.html">Admin panel</a> to add one.',
    back_home: '← Back to Home',
    label_brand: 'Brand',
    label_origin: 'Origin',
    label_size: 'Size',
    label_price: 'Price Range',
    label_date: 'Published',
    rating_title: '📊 Reader Ratings',
    rating_hint: 'Click the stars to rate this cigar',
    rating_voted: '✅ Thank you for your rating!',
    rating_none: 'No ratings yet. Be the first!',
    toast_already_voted: 'You have already rated this cigar',
    admin_title: '📋 Manage Articles',
    btn_add: '＋ Add Article',
    btn_logout: 'Log Out',
    btn_edit: '✏️ Edit',
    btn_delete: '🗑️ Delete',
    btn_save: '💾 Save',
    btn_cancel: 'Cancel',
    pw_title: '🔒 Admin Login',
    pw_hint: 'Enter the admin password to continue',
    pw_btn: 'Enter',
    pw_error: 'Incorrect password. Please try again.',
    modal_add: 'Add New Article',
    modal_edit: 'Edit Article',
    lbl_art_title: 'Title *',
    lbl_brand: 'Brand',
    lbl_origin: 'Origin',
    lbl_strength: 'Strength',
    lbl_size: 'Size',
    lbl_price: 'Price Range',
    lbl_tags: 'Tags (comma separated)',
    lbl_cover: 'Cover Image URL',
    lbl_body: 'Article Body *',
    ph_title: 'e.g. Partagas D4 Review',
    ph_brand: 'e.g. Partagas',
    ph_origin: 'e.g. Cuba',
    ph_size: 'e.g. Robusto (50×124mm)',
    ph_price: 'e.g. $25–30',
    ph_tags: 'e.g. earthy,leather,coffee',
    ph_cover: 'https://...',
    ph_body: 'Write your tasting notes here...',
    toast_updated: 'Article updated',
    toast_added: 'Article added',
    toast_deleted: 'Article deleted',
    confirm_delete: (title) => `Delete article "${title}"? This cannot be undone.`,
    val_title: 'Please enter a title',
    val_body: 'Please enter the article body',
    empty_admin: 'No articles yet. Click "Add Article" to start.',
    no_votes_text: 'No ratings yet',
    toast_rated: (score) => `You gave ${score} stars. Thank you!`,
    rating_avg: (avg, count) => `Avg ${avg} · ${count} ratings`,
  },
  es: {
    form_content_notice: '📝 Completa el título, cuerpo y etiquetas en cada idioma',
    site_name: 'Rocket Sala de Puros',
    site_tagline: 'Explora los Mejores Puros · Comparte Tus Reseñas',
    nav_home: 'Inicio',
    nav_admin: 'Admin',
    search_placeholder: 'Buscar por nombre, marca...',
    all_strengths: 'Todas las intensidades',
    all_origins: 'Todos los orígenes',
    strength_light: 'Suave',
    strength_medium: 'Medio',
    strength_full: 'Intenso',
    unknown_brand: 'Marca desconocida',
    votes: 'votos',
    no_rating: 'N/D',
    empty_posts: 'Sin artículos. Ve al <a href="admin.html">panel de admin</a> para agregar uno.',
    back_home: '← Volver al inicio',
    label_brand: 'Marca',
    label_origin: 'Origen',
    label_size: 'Tamaño',
    label_price: 'Precio',
    label_date: 'Publicado',
    rating_title: '📊 Valoraciones',
    rating_hint: 'Haz clic en las estrellas para valorar',
    rating_voted: '✅ ¡Gracias por tu valoración!',
    rating_none: '¡Sin valoraciones aún. Sé el primero!',
    toast_already_voted: 'Ya valoraste este puro',
    admin_title: '📋 Gestionar Artículos',
    btn_add: '＋ Agregar Artículo',
    btn_logout: 'Cerrar sesión',
    btn_edit: '✏️ Editar',
    btn_delete: '🗑️ Eliminar',
    btn_save: '💾 Guardar',
    btn_cancel: 'Cancelar',
    pw_title: '🔒 Acceso Admin',
    pw_hint: 'Ingresa la contraseña para continuar',
    pw_btn: 'Entrar',
    pw_error: 'Contraseña incorrecta. Inténtalo de nuevo.',
    modal_add: 'Agregar Artículo',
    modal_edit: 'Editar Artículo',
    lbl_art_title: 'Título *',
    lbl_brand: 'Marca',
    lbl_origin: 'Origen',
    lbl_strength: 'Intensidad',
    lbl_size: 'Tamaño',
    lbl_price: 'Precio',
    lbl_tags: 'Etiquetas (separadas por coma)',
    lbl_cover: 'URL de imagen de portada',
    lbl_body: 'Cuerpo del artículo *',
    ph_title: 'ej: Reseña Partagas D4',
    ph_brand: 'ej: Partagas',
    ph_origin: 'ej: Cuba',
    ph_size: 'ej: Robusto (50×124mm)',
    ph_price: 'ej: $25–30',
    ph_tags: 'ej: tierra,cuero,café',
    ph_cover: 'https://...',
    ph_body: 'Escribe tus notas de cata aquí...',
    toast_updated: 'Artículo actualizado',
    toast_added: 'Artículo agregado',
    toast_deleted: 'Artículo eliminado',
    confirm_delete: (title) => `¿Eliminar el artículo "${title}"? Esto no se puede deshacer.`,
    val_title: 'Por favor ingresa un título',
    val_body: 'Por favor ingresa el cuerpo del artículo',
    empty_admin: 'Sin artículos. Haz clic en "Agregar Artículo" para comenzar.',
    no_votes_text: 'Sin valoraciones',
    toast_rated: (score) => `Diste ${score} estrellas. ¡Gracias!`,
    rating_avg: (avg, count) => `Promedio ${avg} · ${count} valoraciones`,
  }
};

const STRENGTH_KEY = { '清淡': 'strength_light', '中等': 'strength_medium', '浓郁': 'strength_full' };

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'zh';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  location.reload();
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] ?? TRANSLATIONS.zh)[key] ?? TRANSLATIONS.zh[key] ?? key;
}

function tFn(key, ...args) {
  const lang = getLang();
  const fn = (TRANSLATIONS[lang] ?? TRANSLATIONS.zh)[key] ?? TRANSLATIONS.zh[key];
  return typeof fn === 'function' ? fn(...args) : fn;
}

function tStrength(stored) {
  return t(STRENGTH_KEY[stored] || 'strength_medium');
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === getLang());
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}
