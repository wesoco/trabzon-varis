import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getBlogPostBySlug, BLOG_POSTS, BLOG_SLUGS } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/content";
import { buildFAQPageSchema, buildArticleSchema, buildBreadcrumbSchema, getBaseUrl } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

/** Önemli blog yazıları için sayfa bazlı keywords (Trabzon yerel SEO) */
const BLOG_KEYWORDS: Record<string, string[]> = {
  "ameliyatsiz-varis-tedavisi-nasil-yapilir": ["Trabzon varis tedavisi", "Trabzon ameliyatsız varis", "Trabzon lazer varis", "Trabzon köpük varis", "Trabzon radyofrekans varis", "Ortahisar varis", "İmperial Hastanesi varis"],
  "tiroid-nodulu-tedavisi": ["Trabzon tiroid nodül", "Trabzon MTA tiroid", "Trabzon ameliyatsız tiroid", "Ortahisar tiroid nodül", "İmperial Hastanesi tiroid"],
  "girisimsel-radyoloji-islemleri": ["Trabzon girişimsel radyoloji", "Trabzon biyopsi", "Trabzon varis tedavisi", "Trabzon port takılması", "Ortahisar girişimsel radyoloji"],
  "biyopsi-oncesi-sonrasi": ["Trabzon biyopsi", "ince iğne biyopsi", "biyopsi öncesi", "biyopsi sonrası", "Trabzon patoloji"],
  "kopuk-skleroterapi-rehberi": ["Trabzon köpük varis", "Trabzon köpük skleroterapi", "Trabzon spider varis", "Ortahisar köpük varis"],
  "4d-ultrason-bebek": ["Trabzon 4D ultrason", "Trabzon gebe ultrasonu", "4D ultrason gebelik", "Trabzon 4 boyutlu ultrason"],
  "port-takilmasi-kemoterapi": ["Trabzon port takılması", "port-a-kat", "Trabzon kemoterapi port", "Ortahisar port"],
  "trabzon-varis-tedavisi-fiyatlari": ["Trabzon varis tedavisi fiyat", "Trabzon varis ücreti", "Trabzon ameliyatsız varis fiyat", "İmperial Hastanesi varis fiyat"],
  "tiroid-nodulu-kac-cm-tehlikeli": ["Trabzon tiroid nodül", "tiroid nodül boyutu", "tiroid nodül tehlikeli mi", "Trabzon tiroid"],
  "gebelikte-varis": ["Trabzon gebelikte varis", "gebe varis tedavisi", "Trabzon varis", "hamilelikte varis"],
  "evla-lazer-endovenoz": ["Trabzon EVLA", "Trabzon lazer varis", "endovenöz lazer", "Trabzon lazer varis tedavisi"],
  "rfa-radyofrekans-ablasyon": ["Trabzon RFA varis", "Trabzon radyofrekans varis", "RFA varis tedavisi", "Trabzon radyofrekans"],
  "girisimsel-radyoloji-trabzon": ["Trabzon girişimsel radyoloji", "Trabzon girişimsel radyoloji uzmanı", "Ortahisar girişimsel radyoloji", "İmperial Hastanesi radyoloji"],
  "mikrodalga-ablasyon-fiyat": ["Trabzon MTA fiyat", "tiroid nodül ablasyon fiyat", "Trabzon mikrodalga ablasyon", "Trabzon tiroid tedavisi fiyat"],
  "varis-tedavisi-sigorta": ["Trabzon varis sigorta", "varis tedavisi SGK", "Trabzon varis ücret", "İmperial Hastanesi sigorta"],
};

/** Kategori ve slug'dan sayfa bazlı keywords üretir (liste yoksa) */
function getBlogKeywords(post: { title: string; category: string; slug: string }): string[] {
  const exact = BLOG_KEYWORDS[post.slug];
  if (exact?.length) return exact;
  const base = ["Trabzon", "Ortahisar", "İmperial Hastanesi", "Doğukan Atabay"];
  const byCategory: Record<string, string[]> = {
    Varis: ["Trabzon varis", "Trabzon varis tedavisi", "Trabzon ameliyatsız varis"],
    Tiroid: ["Trabzon tiroid", "Trabzon tiroid nodül", "Trabzon MTA tiroid"],
    Radyoloji: ["Trabzon girişimsel radyoloji", "Trabzon radyoloji"],
    Tanı: ["Trabzon biyopsi", "Trabzon tanı", "Trabzon patoloji"],
    Ultrason: ["Trabzon ultrason", "Trabzon 4D ultrason", "Trabzon gebe ultrasonu"],
    Girişimsel: ["Trabzon girişimsel radyoloji", "Trabzon port", "Trabzon biyopsi"],
  };
  const fromCat = byCategory[post.category] ?? [];
  const fromSlug =
    post.slug.includes("varis") ? ["Trabzon varis", "Trabzon varis tedavisi"] :
    post.slug.includes("tiroid") ? ["Trabzon tiroid", "Trabzon tiroid nodül"] :
    post.slug.includes("biyopsi") ? ["Trabzon biyopsi"] :
    post.slug.includes("port") ? ["Trabzon port takılması"] :
    post.slug.includes("drenaj") || post.slug.includes("kist") ? ["Trabzon kist drenajı", "Trabzon abse drenajı"] :
    post.slug.includes("mamografi") ? ["Trabzon mamografi"] :
    post.slug.includes("mr-") || post.slug.includes("bt-") ? ["Trabzon MR", "Trabzon BT"] :
    [];
  return [...new Set([...fromCat, ...fromSlug, ...base])].slice(0, 18);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Blog" };
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/blog/${slug}`;
  const imageUrl = post.image ? `${baseUrl}${post.image}` : `${baseUrl}/blog-banner.webp`;
  const keywords = getBlogKeywords(post);
  return {
    title: post.title,
    description: post.excerpt,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      locale: "tr_TR",
      publishedTime: post.date,
      images: [{ url: imageUrl, width: 720, height: 405, alt: post.imageAlt || post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
    robots: { index: true, follow: true },
  };
}

/** Blog SSS: 8 soru, özgün ifadeler. */
const BLOG_FAQS = [
  { q: "Trabzon'da bu tedavi nerede yapılır?", a: "Yazıda geçen işlemler Ortahisar İmperial Hastanesi (Kemerkaya İller Sk. 27-29) adresinde Uzm. Dr. Doğukan Atabay tarafından uygulanıyor. Randevu: 0533 948 30 76." },
  { q: "Bu konuda randevu alabilir miyim?", a: "Evet. Varis, tiroid nodül, biyopsi ve girişimsel radyoloji için 0533 948 30 76 veya WhatsApp ile İmperial Hastanesi'nden randevu alabilirsiniz." },
  { q: "Yazıdaki bilgiler güncel mi?", a: "Yazılar genel bilgilendirme içindir. Kişiye özel tanı ve tedavi muayene ve görüntüleme ile belirlenir." },
  { q: "Trabzon'da randevu nasıl alınır?", a: "0533 948 30 76 veya WhatsApp ile arayabilir, iletişim sayfamızdaki formu kullanabilirsiniz. Adres: Ortahisar, Trabzon." },
  { q: "Trabzon'da varis tedavisi ücreti ne kadar?", a: "Ücretler tedavi kapsamına göre değişir. Ayrıntı için 0533 948 30 76 numarasından bilgi alabilirsiniz." },
  { q: "Sigorta anlaşmalarınız var mı?", a: "Anlaşmalı sigortalar ve ödeme seçenekleri için 0533 948 30 76 numarasından bilgi alabilirsiniz." },
  { q: "İmperial Hastanesi çalışma saatleri nedir?", a: "Pazartesi–Cuma 08:00–17:00, Cumartesi 08:00–13:00. Pazar kapalı." },
  { q: "Trabzon'da girişimsel radyoloji nerede?", a: "Ortahisar, Kemerkaya İller Sk. 27-29, İmperial Hastanesi. Uzm. Dr. Doğukan Atabay varis, tiroid nodül, biyopsi ve port işlemlerini burada uyguluyor. 0533 948 30 76." },
];

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const phoneUrl = "tel:" + SITE_CONFIG.phone.replace(/\s/g, "");
  const rest = BLOG_POSTS.filter((p) => p.slug !== slug);
  const sameCategory = rest.filter((p) => p.category === post.category);
  const otherCategory = rest.filter((p) => p.category !== post.category);
  const otherPosts = [...sameCategory, ...otherCategory].slice(0, 5);

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];
  const faqSchema = buildFAQPageSchema(BLOG_FAQS, `${post.title} – Sıkça Sorulan Sorular`);
  const articleSchema = buildArticleSchema({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.date,
    image: post.image,
    imageAlt: post.imageAlt,
    category: post.category,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <main className="main-inner">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="service-detail-layout">
        <aside className="service-detail-sidebar">
          <div className="service-detail-cta-card">
            <h2 className="service-detail-sidebar-title">Randevu ve bilgi</h2>
            <p>Bu konu veya diğer hizmetlerimiz hakkında sorularınız için bize ulaşabilirsiniz.</p>
            <div className="service-detail-cta-card-links">
              <a href={phoneUrl}>Hemen ara</a>
              <a href={SITE_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ile yaz</a>
            </div>
          </div>
          <nav className="service-detail-other" aria-label="Diğer yazılar">
            <h2 className="service-detail-other-title">Diğer yazılar</h2>
            <ul className="service-detail-other-list">
              {otherPosts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="section page-content service-detail-article blog-detail">
          <div className="blog-detail-meta">
            <span className="blog-card-category">{post.category}</span>
            <time dateTime={post.date}>{post.date}</time>
            <span className="blog-card-reading">{post.readingTime}</span>
          </div>
          <h1>{post.title}</h1>
          <div className="blog-detail-hero">
            <Image
              src={post.image || "/blog-banner.webp"}
              alt={post.imageAlt || post.title}
              width={720}
              height={405}
              className="blog-detail-hero-img"
              sizes="(max-width: 900px) 100vw, 720px"
            />
          </div>
          <Breadcrumb items={breadcrumbItems} />
          {post.excerpt && (
            <p className="service-detail-excerpt">{post.excerpt}</p>
          )}
          <div className="service-detail-body">
            {post.body.map((p, i) => (
              <p key={i} className={i === 0 ? "service-detail-lead" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </article>
      </div>
      <section className="service-detail-sss" id="sss" aria-labelledby="sss-title">
        <h2 id="sss-title" className="service-detail-sss-title">Sıkça Sorulan Sorular</h2>
        <div className="service-detail-sss-list">
          {BLOG_FAQS.map((item, i) => (
            <details key={i} className="service-detail-sss-item">
              <summary className="service-detail-sss-q">{item.q}</summary>
              <p className="service-detail-sss-a">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="cta-card">
        <div className="cta-card-inner">
          <h2 className="cta-title">Randevu almak veya aklınıza takılanları sormak ister misiniz?</h2>
          <p className="cta-desc">Varis, girişimsel radyoloji ve tanı işlemleriyle ilgili sorularınız için buradayız.</p>
          <div className="cta-buttons">
            <a href={phoneUrl} className="btn btn-primary cta-btn">Hemen ara</a>
            <a href={SITE_CONFIG.whatsapp} className="btn cta-btn cta-btn-outline" target="_blank" rel="noopener noreferrer">WhatsApp ile yaz</a>
          </div>
        </div>
        <div className="cta-card-image" aria-hidden="true">
          <Image src="/Dogukan-atabay.webp" alt="" width={280} height={200} />
        </div>
      </div>
    </main>
  );
}
