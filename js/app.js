seedData();
applyI18n();

const grid = document.getElementById('postGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterStrength = document.getElementById('filterStrength');
const filterOrigin = document.getElementById('filterOrigin');

function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildStrengthSelect() {
  filterStrength.innerHTML = `<option value="">${t('all_strengths')}</option>` +
    ['清淡','中等','浓郁'].map(v=>`<option value="${v}">${tStrength(v)}</option>`).join('');
}

function populateOriginFilter(posts) {
  const cur = filterOrigin.value;
  const origins = [...new Set(posts.map(p=>p.origin).filter(Boolean))];
  filterOrigin.innerHTML = `<option value="">${t('all_origins')}</option>` +
    origins.map(o=>`<option value="${escHtml(o)}"${o===cur?' selected':''}>${escHtml(o)}</option>`).join('');
}

function renderStars(avg) {
  const full = Math.round(avg);
  return '<span class="stars">' + Array.from({length:5},(_,i)=>`<span class="star${i<full?' on':''}">★</span>`).join('') + '</span>';
}

function scoreColor(s) {
  if (s >= 95) return '#f5c518';
  if (s >= 90) return '#c9a84c';
  return '#9a8060';
}

function renderCard(post) {
  const lang  = getLang();
  const avg   = avgRating(post.ratings);
  const count = post.ratings.length;
  const title  = localized(post.title, lang);
  const body   = localized(post.body, lang);
  const tags   = localizedTags(post.tags, lang);
  const brand  = post.brand || t('unknown_brand');
  const avgText = avg > 0 ? avg.toFixed(1) : t('no_rating');
  const excerpt = body.slice(0, 90) + (body.length > 90 ? '…' : '');
  const tagHtml = tags.slice(0,3).map(tag=>`<span class="tag">${escHtml(tag)}</span>`).join('');

  const coverHtml = post.coverUrl
    ? `<img class="cover" src="${escHtml(post.coverUrl)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const placeholderStyle = post.coverUrl ? 'style="display:none"' : '';

  const scoreHtml = post.myRating > 0
    ? `<div class="card-score" style="color:${scoreColor(post.myRating)}">${post.myRating}</div>`
    : '';

  return `
    <div class="post-card" onclick="location.href='post.html?id=${post.id}'">
      <div class="cover-wrap">
        ${coverHtml}
        <div class="cover-placeholder" ${placeholderStyle}>🚬</div>
        ${scoreHtml}
      </div>
      <div class="card-body">
        <div class="meta">
          <span>${escHtml(brand)}</span>
          ${post.vitola ? `<span>${escHtml(post.vitola)}</span>` : ''}
          <span class="strength strength-${escHtml(post.strength)}">${tStrength(post.strength)}</span>
        </div>
        <h2>${escHtml(title)}</h2>
        <p class="excerpt">${escHtml(excerpt)}</p>
        <div class="tags">${tagHtml}</div>
        <div class="rating-row">
          ${renderStars(avg)}
          <span>${avgText} (${count} ${t('votes')})</span>
        </div>
      </div>
    </div>`;
}

function render() {
  const lang = getLang();
  const q   = searchInput.value.trim().toLowerCase();
  const str = filterStrength.value;
  const ori = filterOrigin.value;
  let posts = getPosts();
  populateOriginFilter(posts);
  if (q) posts = posts.filter(p =>
    localized(p.title, lang).toLowerCase().includes(q) ||
    (p.brand||'').toLowerCase().includes(q) ||
    (p.origin||'').toLowerCase().includes(q)
  );
  if (str) posts = posts.filter(p => p.strength === str);
  if (ori) posts = posts.filter(p => p.origin === ori);

  if (posts.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    grid.innerHTML = posts.map(renderCard).join('');
  }
}

buildStrengthSelect();
searchInput.addEventListener('input', render);
filterStrength.addEventListener('change', render);
filterOrigin.addEventListener('change', render);
render();
