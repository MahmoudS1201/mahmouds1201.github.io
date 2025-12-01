const fs = require("fs");

const SITE = "https://lotk8.com";

// Static pages
const STATIC_PAGES = [
  "",
  "features/",
  "latest/",
  "sections/",
  "archive/",
  "search/",
  "about/",
  "contact/",
  "mission/",
  "resume/",
  "newsletter/"
];

// Load posts.json
const posts = JSON.parse(fs.readFileSync("./posts.json", "utf8"));

function cleanSlug(slug) {
  return slug.replace(/^\/+|\/+$/g, "");
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;

// Static pages
for (const page of STATIC_PAGES) {
  xml += `  <url><loc>${SITE}/${page}</loc></url>\n`;
}
xml += `\n`;

// Articles
for (const post of posts) {
  const slug = cleanSlug(post.slug);
  xml += `  <url><loc>${SITE}/${slug}/</loc></url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync("./sitemap.xml", xml, "utf8");

console.log("sitemap.xml generated!");
