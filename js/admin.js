const ADMIN_PASSWORD = 'Wang12315!';
const SESSION_KEY = 'cigar_admin_session';

applyI18n();

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

/* ── Auth ── */
function checkPassword() {
  if (document.getElementById('passwordInput').value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1');
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('adminMain').style.display = 'block';
    renderList();
  } else {
    document.getElementById('passwordError').textContent = t('pw_error');
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById('passwordInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

seedData();

if (sessionStorage.getItem(SESSION_KEY)) {
  document.getElementById('passwordScreen').style.display = 'none';
  document.getElementById('adminMain').style.display = 'block';
  renderList();
}

/* ── Form language tabs ── */
let formLang = 'zh';

// Temporary storage for all 3 language versions while editing
let formContent = {
  zh: { title: '', tags: '', body: '' },
  en: { title: '', tags: '', body: '' },
  es: { title: '', tags: '', body: '' },
};

function saveCurrentLangToBuffer() {
  formContent[formLang] = {
    title: document.getElementById('fTitle').value,
    tags:  document.getElementById('fTags').value,
    body:  document.getElementById('fBody').value,
  };
}

function loadLangFromBuffer(lang) {
  const c = formContent[lang];
  document.getElementById('fTitle').value = c.title;
  document.getElementById('fTags').value  = c.tags;
  document.getElementById('fBody').value  = c.body;
}

function switchFormLang(lang) {
  saveCurrentLangToBuffer();
  formLang = lang;
  loadLangFromBuffer(lang);
  document.querySelectorAll('.form-lang-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.formLang === lang);
  });
  updateFormPlaceholders();
}

function updateFormPlaceholders() {
  const ph = {
    zh: { title: '例：帕特加斯 D4 评测', tags: '例：泥土,皮革,咖啡', body: '在这里写下您的品鉴文章...' },
    en: { title: 'e.g. Partagas D4 Review', tags: 'e.g. earthy,leather,coffee', body: 'Write your tasting notes here...' },
    es: { title: 'ej: Reseña Partagas D4', tags: 'ej: tierra,cuero,café', body: 'Escribe tus notas de cata aquí...' },
  };
  const p = ph[formLang];
  document.getElementById('fTitle').placeholder = p.title;
  document.getElementById('fTags').placeholder  = p.tags;
  document.getElementById('fBody').placeholder  = p.body;
}

document.querySelectorAll('.form-lang-tab').forEach(btn => {
  btn.addEventListener('click', () => switchFormLang(btn.dataset.formLang));
});

/* ── List ── */
function renderList() {
  const posts = getPosts();
  const list = document.getElementById('adminList');
  const lang = getLang();

  if (posts.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="icon">📭</div><p>${escHtml(t('empty_admin'))}</p></div>`;
    return;
  }

  list.innerHTML = posts.map(post => {
    const date  = new Date(post.createdAt).toLocaleDateString();
    const avg   = avgRating(post.ratings);
    const avgText = post.ratings.length > 0
      ? `★ ${avg.toFixed(1)} (${post.ratings.length} ${t('votes')})`
      : t('no_votes_text');
    const title = localized(post.title, lang) || localized(post.title, 'zh') || '(no title)';
    const safeTitle = escHtml(title).replace(/'/g, '&#39;');
    return `
      <div class="admin-post-item">
        <div>
          <div class="item-title">${escHtml(title)}</div>
          <div class="item-meta">${escHtml(post.brand || '—')} · ${escHtml(post.origin || '—')} · ${tStrength(post.strength)} · ${avgText} · ${date}</div>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-sm" onclick="openModal('${post.id}')">${t('btn_edit')}</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDelete('${post.id}', '${safeTitle}')">${t('btn_delete')}</button>
        </div>
      </div>`;
  }).join('');
}

/* ── Modal ── */
function openModal(id) {
  document.getElementById('editId').value = id || '';
  document.getElementById('modalTitle').textContent = id ? t('modal_edit') : t('modal_add');

  // Reset to zh tab
  formLang = 'zh';
  document.querySelectorAll('.form-lang-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.formLang === 'zh');
  });

  if (id) {
    const post = getPost(id);
    if (!post) return;
    formContent = {
      zh: {
        title: localized(post.title, 'zh'),
        tags:  localizedTags(post.tags, 'zh').join(','),
        body:  localized(post.body, 'zh'),
      },
      en: {
        title: localized(post.title, 'en'),
        tags:  localizedTags(post.tags, 'en').join(','),
        body:  localized(post.body, 'en'),
      },
      es: {
        title: localized(post.title, 'es'),
        tags:  localizedTags(post.tags, 'es').join(','),
        body:  localized(post.body, 'es'),
      },
    };
    document.getElementById('fBrand').value    = post.brand || '';
    document.getElementById('fOrigin').value   = post.origin || '';
    document.getElementById('fStrength').value = post.strength || '中等';
    document.getElementById('fSize').value     = post.size || '';
    document.getElementById('fPrice').value    = post.price || '';
    document.getElementById('fCover').value    = post.coverUrl || '';
  } else {
    formContent = {
      zh: { title: '', tags: '', body: '' },
      en: { title: '', tags: '', body: '' },
      es: { title: '', tags: '', body: '' },
    };
    ['fBrand','fOrigin','fSize','fPrice','fCover'].forEach(f => {
      document.getElementById(f).value = '';
    });
    document.getElementById('fStrength').value = '中等';
  }

  loadLangFromBuffer('zh');
  updateFormPlaceholders();
  document.getElementById('modalOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('fTitle').focus(), 50);
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

function closeModalOnBg(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function savePost() {
  // Flush current tab's values to buffer before saving
  saveCurrentLangToBuffer();

  const zhTitle = formContent.zh.title.trim();
  const zhBody  = formContent.zh.body.trim();

  if (!zhTitle && !formContent.en.title.trim() && !formContent.es.title.trim()) {
    showToast(t('val_title'));
    return;
  }
  if (!zhBody && !formContent.en.body.trim() && !formContent.es.body.trim()) {
    showToast(t('val_body'));
    return;
  }

  const data = {
    title_zh: formContent.zh.title.trim(),
    title_en: formContent.en.title.trim(),
    title_es: formContent.es.title.trim(),
    body_zh:  formContent.zh.body.trim(),
    body_en:  formContent.en.body.trim(),
    body_es:  formContent.es.body.trim(),
    tags_zh:  formContent.zh.tags,
    tags_en:  formContent.en.tags,
    tags_es:  formContent.es.tags,
    brand:    document.getElementById('fBrand').value.trim(),
    origin:   document.getElementById('fOrigin').value.trim(),
    strength: document.getElementById('fStrength').value,
    size:     document.getElementById('fSize').value.trim(),
    price:    document.getElementById('fPrice').value.trim(),
    coverUrl: document.getElementById('fCover').value.trim(),
  };

  const id = document.getElementById('editId').value;
  if (id) {
    updatePost(id, data);
    showToast(t('toast_updated'));
  } else {
    createPost(data);
    showToast(t('toast_added'));
  }

  closeModal();
  renderList();
}

/* ── Delete ── */
function confirmDelete(id, title) {
  if (confirm(tFn('confirm_delete', title))) {
    deletePost(id);
    showToast(t('toast_deleted'));
    renderList();
  }
}
