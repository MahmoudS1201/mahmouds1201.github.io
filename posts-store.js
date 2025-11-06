<script type="module" id="posts-store">
/* posts-store.js — tiny shared loader for your site */
export async function loadPosts() {
  // 1) Try site-wide JSON (for production hosting)
  try {
    const res = await fetch('/posts.json', { cache: 'no-store' });
    if (res.ok) {
      const arr = await res.json();
      return arr.map(normalize).sort(byNewest);
    }
  } catch {}

  // 2) Fallback to localStorage (great for local dev / preview)
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('ctr:admin:published:')) {
      try {
        const obj = JSON.parse(localStorage.getItem(k));
        if (obj && obj.title) out.push(obj);
      } catch {}
    }
  }
  return out.map(normalize).sort(byNewest);
}

export function getBySection(posts, sectionName) {
  return posts.filter(p => (p.section || '').toLowerCase() === sectionName.toLowerCase());
}
export function getLatest(posts, n = 6) { return posts.slice(0, n); }
export function groupBySection(posts) {
  const map = new Map();
  posts.forEach(p => {
    const key = p.section || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  });
  return map;
}

function normalize(item) {
  // Admin uses slug + optional url; make one href
  const href = item.slug ? `/${item.slug}.html` : (item.url || '#');
  return {
    title: item.title || '',
    href,
    slug: item.slug || '',
    section: item.section || '',
    description: item.excerpt || item.description || '',
    date: item.date || item.publishedAt || new Date().toISOString(),
    readMinutes: item.readMinutes || 1,
    cover: item.cover?.src || '',
    featured: !!item.featured,
    tags: item.tags || []
  };
}
function byNewest(a, b){ return new Date(b.date) - new Date(a.date); }

/* Optional: live re-render if admin publishes in another tab */
export function onLocalChanges(cb){
  window.addEventListener('storage', (e) => {
    if (!e.key) return;
    if (e.key.startsWith('ctr:admin:published:')) cb();
  });
}
</script>
