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

function renderRatingWidget(post) {
  const voted = hasVoted(post.id);
  const avg   = avgRating(post.ratings);
  const count = post.ratings.length;
  const starsHtml = Array.from({ length: 5 }, (_, i) =>
    `<span class="star" data-score="${i + 1}">★</span>`
  ).join('');
  const statsText = count > 0
    ? tFn('rating_avg', avg.toFixed(1), count)
    : t('rating_none');

  return `
    <div class="rating-widget" id="ratingWidget">
      <h3>${t('rating_title')}</h3>
      <div class="stars big-stars${voted ? '' : ' interactive'}" id="ratingStars">
        ${starsHtml}
      </div>
      ${voted
        ? `<div class="voted-msg">${t('rating_voted')}</div>`
        : `<div class="hint">${t('rating_hint')}</div>`
      }
      <div class="stats">${statsText}</div>
    </div>`;
}

function attachRatingEvents(postId) {
  const starsEl = document.getElementById('ratingStars');
  if (!starsEl || !starsEl.classList.contains('interactive')) return;
  const stars = starsEl.querySelectorAll('.star');

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const score = parseInt(star.dataset.score);
      stars.forEach((s, i) => s.classList.toggle('on', i < score));
    });
  });
  starsEl.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('on'));
  });
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

function render() {
  const id     = new URLSearchParams(location.search).get('id');
  const detail = document.getElementById('postDetail');
  const lang   = getLang();

  if (!id) {
    detail.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p><a href="index.html">${t('back_home')}</a></p></div>`;
    return;
  }

  const post = getPost(id);
  if (!post) {
    detail.innerHTML = `<div class="empty-state"><div class="icon">❌</div><p><a href="index.html">${t('back_home')}</a></p></div>`;
    return;
  }

  const title = localized(post.title, lang);
  const body  = localized(post.body, lang);
  const tags  = localizedTags(post.tags, lang);

  document.title = `${title} — ${t('site_name')}`;

  const coverHtml = post.coverUrl
    ? `<img class="cover-full" src="${escHtml(post.coverUrl)}" alt="" onerror="this.style.display='none'">`
    : '';
  const tagHtml = tags.map(tag => `<span class="tag">${escHtml(tag)}</span>`).join('');
  const date = new Date(post.createdAt).toLocaleDateString();

  detail.innerHTML = `
    <a class="back-link" href="index.html">${t('back_home')}</a>

    <h1>${escHtml(title)}</h1>

    <div class="tags" style="margin-bottom:1rem">
      <span class="strength strength-${escHtml(post.strength)}">${tStrength(post.strength)}</span>
      ${tagHtml}
    </div>

    ${coverHtml}

    <div class="info-panel">
      <div class="info-item">
        <span class="info-label">${t('label_brand')}</span>
        <span class="info-value">${escHtml(post.brand || '—')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t('label_origin')}</span>
        <span class="info-value">${escHtml(post.origin || '—')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t('label_size')}</span>
        <span class="info-value">${escHtml(post.size || '—')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t('label_price')}</span>
        <span class="info-value">${escHtml(post.price || '—')}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t('label_date')}</span>
        <span class="info-value">${date}</span>
      </div>
    </div>

    <div class="post-body">${escHtml(body)}</div>

    ${renderRatingWidget(post)}
  `;

  attachRatingEvents(id);
}

render();
