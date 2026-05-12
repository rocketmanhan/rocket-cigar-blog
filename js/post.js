applyI18n();

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function scoreColor(s) {
  if (s >= 95) return '#f5c518';
  if (s >= 90) return '#c9a84c';
  if (s >= 85) return '#a07840';
  return '#7a6030';
}

function renderRatingWidget(post) {
  const voted = hasVoted(post.id);
  const avg   = avgRating(post.ratings);
  const count = post.ratings.length;
  const starsHtml = Array.from({length:5},(_,i)=>`<span class="star" data-score="${i+1}">★</span>`).join('');
  const statsText = count > 0 ? tFn('rating_avg', avg.toFixed(1), count) : t('rating_none');
  return `
    <div class="rating-widget" id="ratingWidget">
      <h3>${t('rating_title')}</h3>
      <div class="stars big-stars${voted?'':' interactive'}" id="ratingStars">${starsHtml}</div>
      ${voted ? `<div class="voted-msg">${t('rating_voted')}</div>` : `<div class="hint">${t('rating_hint')}</div>`}
      <div class="stats">${statsText}</div>
    </div>`;
}

function attachRatingEvents(postId) {
  const starsEl = document.getElementById('ratingStars');
  if (!starsEl || !starsEl.classList.contains('interactive')) return;
  const stars = starsEl.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const s = parseInt(star.dataset.score);
      stars.forEach((x,i) => x.classList.toggle('on', i<s));
    });
  });
  starsEl.addEventListener('mouseleave', () => stars.forEach(s => s.classList.remove('on')));
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const score = parseInt(star.dataset.score);
      if (addRating(postId, score)) {
        document.getElementById('ratingWidget').outerHTML = renderRatingWidget(getPost(postId));
        showToast(tFn('toast_rated', score));
        attachRatingEvents(postId);
      } else {
        showToast(t('toast_already_voted'));
      }
    });
  });
}

function row(label, value) {
  if (!value) return '';
  return `<div class="spec-item"><div class="spec-label">${label}</div><div class="spec-value">${escHtml(value)}</div></div>`;
}

function render() {
  const id     = new URLSearchParams(location.search).get('id');
  const detail = document.getElementById('postDetail');
  const lang   = getLang();

  if (!id) { detail.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p><a href="index.html">${t('back_home')}</a></p></div>`; return; }

  const post = getPost(id);
  if (!post) { detail.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p><a href="index.html">${t('back_home')}</a></p></div>`; return; }

  const title  = localized(post.title, lang);
  const body   = localized(post.body, lang);
  const notes  = localized(post.notes, lang);
  const tags   = localizedTags(post.tags, lang);

  document.title = `${title} — ${t('site_name')}`;

  const tagHtml = tags.map(tag => `<span class="tag">${escHtml(tag)}</span>`).join('');
  const date = new Date(post.createdAt).toLocaleDateString();

  const scoreHtml = post.myRating > 0 ? `
    <div class="my-score-badge">
      <div class="score-number" style="color:${scoreColor(post.myRating)}">${post.myRating}</div>
      <div class="score-label">${t('my_score_label')}</div>
    </div>` : '';

  detail.innerHTML = `
    <a class="back-link" href="index.html">${t('back_home')}</a>

    ${post.coverUrl ? `<img class="cover-full" src="${escHtml(post.coverUrl)}" alt="">` : ''}

    <div class="post-header">
      <div class="post-header-text">
        <div class="post-brand-line">${escHtml(post.brand||'')} ${post.vitola ? `<span class="vitola-tag">${escHtml(post.vitola)}</span>` : ''}</div>
        <h1>${escHtml(title)}</h1>
        <div class="tags" style="margin-top:0.75rem">
          <span class="strength strength-${escHtml(post.strength)}">${tStrength(post.strength)}</span>
          ${tagHtml}
        </div>
      </div>
      ${scoreHtml}
    </div>

    <div class="spec-grid">
      ${row(t('label_origin'),  post.origin)}
      ${row(t('label_vitola'),  post.vitola)}
      ${row(t('label_wrapper'), post.wrapper)}
      ${row(t('label_binder'),  post.binder)}
      ${row(t('label_filler'),  post.filler)}
      ${row(t('label_size'),    post.size)}
      ${row(t('label_price'),   post.price)}
      ${row(t('label_date'),    date)}
    </div>

    ${body ? `
    <div class="content-section">
      <h2 class="section-title">${t('section_description')}</h2>
      <div class="post-body">${escHtml(body)}</div>
    </div>` : ''}

    ${notes ? `
    <div class="content-section">
      <h2 class="section-title">${t('section_notes')}</h2>
      <div class="post-body tasting-notes">${escHtml(notes)}</div>
    </div>` : ''}

    ${renderRatingWidget(post)}
  `;

  attachRatingEvents(id);
}

render();
