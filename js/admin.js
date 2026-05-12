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
function logout() { sessionStorage.removeItem(SESSION_KEY); location.reload(); }
document.getElementById('passwordInput').addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

seedData();
if (sessionStorage.getItem(SESSION_KEY)) {
  document.getElementById('passwordScreen').style.display = 'none';
  document.getElementById('adminMain').style.display = 'block';
  renderList();
}

/* ── Image upload ── */
let pendingImageData = null; // base64 string or null

function resizeAndStore(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1000;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('fileInput').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  const data = await resizeAndStore(file);
  pendingImageData = data;
  document.getElementById('coverPreview').src = data;
  document.getElementById('coverPreview').style.display = 'block';
  document.getElementById('uploadPlaceholder').style.display = 'none';
  document.getElementById('fCover').value = '';
});

document.getElementById('fCover').addEventListener('input', e => {
  const url = e.target.value.trim();
  if (url) {
    pendingImageData = null;
    document.getElementById('coverPreview').src = url;
    document.getElementById('coverPreview').style.display = 'block';
    document.getElementById('uploadPlaceholder').style.display = 'none';
  }
});

/* ── Form language tabs ── */
let formLang = 'zh';
let formContent = {
  zh: { title: '', tags: '', body: '', notes: '' },
  en: { title: '', tags: '', body: '', notes: '' },
  es: { title: '', tags: '', body: '', notes: '' },
};

function saveCurrentLangToBuffer() {
  formContent[formLang] = {
    title: document.getElementById('fTitle').value,
    tags:  document.getElementById('fTags').value,
    body:  document.getElementById('fBody').value,
    notes: document.getElementById('fNotes').value,
  };
}

function loadLangFromBuffer(lang) {
  const c = formContent[lang];
  document.getElementById('fTitle').value = c.title;
  document.getElementById('fTags').value  = c.tags;
  document.getElementById('fBody').value  = c.body;
  document.getElementById('fNotes').value = c.notes;
}

const phMap = {
  zh: { title: '例：Tatuaje Tuxtla 品鉴', tags: '例：泥土,皮革,咖啡', body: '写下这支雪茄的背景介绍...', notes: '写下你的品鉴笔记（开燃、中段、尾段感受）...' },
  en: { title: 'e.g. Tatuaje Tuxtla Review', tags: 'e.g. earthy,leather,coffee', body: 'Write a background overview...', notes: 'Write your tasting notes (cold draw, first third, mid, final)...' },
  es: { title: 'ej: Reseña Tatuaje Tuxtla', tags: 'ej: tierra,cuero,café', body: 'Escribe una descripción...', notes: 'Escribe tus notas de cata...' },
};

function updateFormPlaceholders() {
  const p = phMap[formLang];
  document.getElementById('fTitle').placeholder = p.title;
  document.getElementById('fTags').placeholder  = p.tags;
  document.getElementById('fBody').placeholder  = p.body;
  document.getElementById('fNotes').placeholder = p.notes;
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
    const avgText = post.ratings.length > 0 ? `★ ${avg.toFixed(1)} (${post.ratings.length})` : t('no_votes_text');
    const title = localized(post.title, lang) || '(no title)';
    const safeTitle = escHtml(title).replace(/'/g, '&#39;');
    const score = post.myRating > 0 ? `${post.myRating}/100` : '—';
    return `
      <div class="admin-post-item">
        <div style="display:flex;gap:1rem;align-items:center">
          ${post.coverUrl ? `<img src="${escHtml(post.coverUrl)}" style="width:56px;height:56px;object-fit:cover;border-radius:4px;flex-shrink:0;border:1px solid var(--border)">` : `<div style="width:56px;height:56px;background:var(--bg3);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.5rem">🚬</div>`}
          <div>
            <div class="item-title">${escHtml(title)}</div>
            <div class="item-meta">${escHtml(post.brand||'—')} · ${escHtml(post.vitola||'—')} · ${tStrength(post.strength)} · ${t('my_score_label')}: ${score} · ${avgText} · ${date}</div>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-sm" onclick="openModal('${post.id}')">${t('btn_edit')}</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDelete('${post.id}','${safeTitle}')">${t('btn_delete')}</button>
        </div>
      </div>`;
  }).join('');
}

/* ── Modal ── */
function resetImageUpload() {
  pendingImageData = null;
  document.getElementById('coverPreview').style.display = 'none';
  document.getElementById('coverPreview').src = '';
  document.getElementById('uploadPlaceholder').style.display = 'flex';
  document.getElementById('fileInput').value = '';
  document.getElementById('fCover').value = '';
}

function openModal(id) {
  document.getElementById('editId').value = id || '';
  document.getElementById('modalTitle').textContent = id ? t('modal_edit') : t('modal_add');
  formLang = 'zh';
  document.querySelectorAll('.form-lang-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.formLang === 'zh'));

  if (id) {
    const post = getPost(id);
    if (!post) return;
    formContent = {
      zh: { title: localized(post.title,'zh'), tags: localizedTags(post.tags,'zh').join(','), body: localized(post.body,'zh'), notes: localized(post.notes,'zh') },
      en: { title: localized(post.title,'en'), tags: localizedTags(post.tags,'en').join(','), body: localized(post.body,'en'), notes: localized(post.notes,'en') },
      es: { title: localized(post.title,'es'), tags: localizedTags(post.tags,'es').join(','), body: localized(post.body,'es'), notes: localized(post.notes,'es') },
    };
    document.getElementById('fBrand').value    = post.brand    || '';
    document.getElementById('fOrigin').value   = post.origin   || '';
    document.getElementById('fStrength').value = post.strength || '中等';
    document.getElementById('fVitola').value   = post.vitola   || '';
    document.getElementById('fWrapper').value  = post.wrapper  || '';
    document.getElementById('fBinder').value   = post.binder   || '';
    document.getElementById('fFiller').value   = post.filler   || '';
    document.getElementById('fSize').value     = post.size     || '';
    document.getElementById('fPrice').value    = post.price    || '';
    document.getElementById('fMyRating').value = post.myRating || '';

    resetImageUpload();
    if (post.coverUrl) {
      document.getElementById('fCover').value = post.coverUrl.startsWith('data:') ? '' : post.coverUrl;
      document.getElementById('coverPreview').src = post.coverUrl;
      document.getElementById('coverPreview').style.display = 'block';
      document.getElementById('uploadPlaceholder').style.display = 'none';
      if (post.coverUrl.startsWith('data:')) pendingImageData = post.coverUrl;
    }
  } else {
    formContent = {
      zh: { title: '', tags: '', body: '', notes: '' },
      en: { title: '', tags: '', body: '', notes: '' },
      es: { title: '', tags: '', body: '', notes: '' },
    };
    ['fBrand','fOrigin','fVitola','fWrapper','fBinder','fFiller','fSize','fPrice','fMyRating'].forEach(f => { document.getElementById(f).value = ''; });
    document.getElementById('fStrength').value = '中等';
    resetImageUpload();
  }

  loadLangFromBuffer('zh');
  updateFormPlaceholders();
  document.getElementById('modalOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('fTitle').focus(), 50);
}

function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; }
function closeModalOnBg(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }

function savePost() {
  saveCurrentLangToBuffer();
  if (!formContent.zh.title && !formContent.en.title && !formContent.es.title) { showToast(t('val_title')); return; }
  if (!formContent.zh.body  && !formContent.en.body  && !formContent.es.body)  { showToast(t('val_body'));  return; }

  const coverUrl = pendingImageData || document.getElementById('fCover').value.trim();
  const data = {
    title_zh: formContent.zh.title, title_en: formContent.en.title, title_es: formContent.es.title,
    body_zh:  formContent.zh.body,  body_en:  formContent.en.body,  body_es:  formContent.es.body,
    notes_zh: formContent.zh.notes, notes_en: formContent.en.notes, notes_es: formContent.es.notes,
    tags_zh:  formContent.zh.tags,  tags_en:  formContent.en.tags,  tags_es:  formContent.es.tags,
    brand:    document.getElementById('fBrand').value.trim(),
    origin:   document.getElementById('fOrigin').value.trim(),
    strength: document.getElementById('fStrength').value,
    vitola:   document.getElementById('fVitola').value.trim(),
    wrapper:  document.getElementById('fWrapper').value.trim(),
    binder:   document.getElementById('fBinder').value.trim(),
    filler:   document.getElementById('fFiller').value.trim(),
    size:     document.getElementById('fSize').value.trim(),
    price:    document.getElementById('fPrice').value.trim(),
    myRating: document.getElementById('fMyRating').value,
    coverUrl,
  };

  const id = document.getElementById('editId').value;
  if (id) { updatePost(id, data); showToast(t('toast_updated')); }
  else    { createPost(data);     showToast(t('toast_added'));   }
  closeModal();
  renderList();
}

function confirmDelete(id, title) {
  if (confirm(tFn('confirm_delete', title))) {
    deletePost(id);
    showToast(t('toast_deleted'));
    renderList();
  }
}
