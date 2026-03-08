import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getServiceBySlug, SERVICES, SERVICE_SLUGS } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/content";
import { buildFAQPageSchema, buildServiceSchema, buildBreadcrumbSchema, getBaseUrl } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

/** Her hizmet için yerel arama anahtar kelimeleri – Trabzon'da 1. sıra hedefi */
const SERVICE_KEYWORDS: Record<string, string[]> = {
  "ameliyatsiz-varis-tedavisi": ["Trabzon varis tedavisi", "Trabzon ameliyatsız varis", "Trabzon varis doktoru", "Ortahisar varis tedavisi", "Trabzon lazer varis", "Trabzon köpük varis", "İmperial Hastanesi varis"],
  "tiroid-nodul-tedavisi": ["Trabzon tiroid nodül tedavisi", "Trabzon tiroid nodül", "Trabzon ameliyatsız tiroid", "Ortahisar tiroid nodül", "Trabzon MTA tiroid", "İmperial Hastanesi tiroid"],
  "girisimsel-radyoloji": ["Trabzon girişimsel radyoloji", "Trabzon girişimsel radyoloji uzmanı", "Ortahisar girişimsel radyoloji", "Trabzon biyopsi", "Trabzon port takılması"],
  "biyopsi": ["Trabzon biyopsi", "Trabzon ince iğne biyopsi", "Trabzon meme biyopsi", "Trabzon tiroid biyopsi", "Ortahisar biyopsi", "İmperial Hastanesi biyopsi"],
  "lazerle-varis-tedavisi": ["Trabzon lazer varis", "Trabzon EVLA", "Trabzon lazerle varis tedavisi", "Ortahisar lazer varis", "Trabzon endovenöz lazer"],
  "radyofrekansla-varis-tedavisi": ["Trabzon radyofrekans varis", "Trabzon RFA varis", "Trabzon radyofrekansla varis", "Ortahisar RFA varis"],
  "kopuk-skleroterapi": ["Trabzon köpük varis", "Trabzon köpük skleroterapi", "Trabzon spider varis", "Ortahisar köpük varis", "Trabzon köpük tedavisi"],
  "4d-gebe-ultrasonu": ["Trabzon 4D ultrason", "Trabzon gebe ultrasonu", "Trabzon 4 boyutlu ultrason", "Ortahisar 4D ultrason"],
  "port-takilmasi": ["Trabzon port takılması", "Trabzon port-a-kat", "Trabzon kemoterapi port", "Ortahisar port takılması"],
  "kist-abse-drenaji": ["Trabzon kist drenajı", "Trabzon abse drenajı", "Trabzon kist abse", "Ortahisar drenaj"],
  "bilgisayarli-tomografi": ["Trabzon BT", "Trabzon bilgisayarlı tomografi", "Trabzon tomografi", "Ortahisar BT"],
  "mr-goruntuleme": ["Trabzon MR", "Trabzon MR çekimi", "Trabzon manyetik rezonans", "Ortahisar MR"],
  "xray-goruntuleme": ["Trabzon röntgen", "Trabzon röntgen çekimi", "Trabzon X-ray", "Ortahisar röntgen"],
  "mamografi": ["Trabzon mamografi", "Trabzon meme filmi", "Trabzon meme kanseri taraması", "Ortahisar mamografi"],
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Hizmet" };
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}/hizmetler/${slug}`;
  const keywords = SERVICE_KEYWORDS[slug] ?? ["Trabzon", "İmperial Hastanesi", "Ortahisar"];
  return {
    title: service.title,
    description: service.excerpt,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: service.title,
      description: service.excerpt,
      url: canonical,
      type: "website",
      locale: "tr_TR",
    },
    twitter: { card: "summary_large_image", title: service.title, description: service.excerpt },
    robots: { index: true, follow: true },
  };
}

const SUBHEADING_PREFIXES = [
  "Kimlere uygulanır?",
  "Kimler için?",
  "İşlem nasıl yapılır?",
  "Uygulama:",
  "Avantajları:",
  "Artıları:",
  "Hangi işlemler yapılır?",
  "Hangi bölgelere uygulanır?",
  "Nereye?",
  "Kapsam:",
  "Sonrası:",
  "Sonrasında nelere dikkat?",
];

/** SSS: önce hizmete özel, eksikse genel sorularla 8'e tamamlanır. Özgün ifadeler. */
const GENERIC_FAQS = [
  { q: "Trabzon'da varis tedavisi nerede yapılır?", a: "Ortahisar, Kemerkaya İller Sk. 27-29 adresindeki İmperial Hastanesi'nde Uzm. Dr. Doğukan Atabay ameliyatsız varis tedavisi uyguluyor. Randevu: 0533 948 30 76 veya WhatsApp." },
  { q: "Trabzon'da ameliyatsız varis tedavisi kim yapar?", a: "Girişimsel radyoloji uzmanı Uzm. Dr. Doğukan Atabay, İmperial Hastanesi'nde lazer, köpük ve radyofrekans ile bu tedaviyi gerçekleştiriyor." },
  { q: "İmperial Hastanesi'nde randevu nasıl alınır?", a: "0533 948 30 76 numarasından veya WhatsApp ile iletişime geçebilir, iletişim sayfamızdaki formu doldurabilirsiniz. Adres: Ortahisar, Kemerkaya İller Sk. 27-29." },
  { q: "Trabzon'da varis tedavisi ücreti ne kadar?", a: "Ücret muayene ve tedavi kapsamına göre değişir. 0533 948 30 76 veya WhatsApp üzerinden ayrıntılı bilgi alabilirsiniz." },
  { q: "İşlem öncesi hazırlık gerekir mi?", a: "İşleme göre açlık, ilaç kesimi veya başka hazırlıklar istenebilir. Randevuda size özel talimatlar verilir." },
  { q: "Sigorta anlaşmalarınız var mı?", a: "Anlaşmalı sigortalar ve ödeme seçenekleri için 0533 948 30 76 numarasından bilgi alabilirsiniz." },
  { q: "İmperial Hastanesi çalışma saatleri nedir?", a: "Pazartesi–Cuma 08:00–17:00, Cumartesi 08:00–13:00. Pazar kapalı. Güncel saat için randevu sırasında bilgi verilir." },
  { q: "Trabzon'da girişimsel radyoloji nerede yapılır?", a: "Ortahisar İmperial Hastanesi, Kemerkaya İller Sk. 27-29. Uzm. Dr. Doğukan Atabay varis, tiroid nodül ablasyonu, biyopsi ve port işlemlerini burada uyguluyor. 0533 948 30 76." },
];

/** Paragraf "Başlık? Metin" veya "Başlık: Metin" ile başlıyorsa [başlık, metin] döner. */
function splitSubheading(paragraph: string): { heading: string; rest: string } | null {
  const t = paragraph.trim();
  for (const prefix of SUBHEADING_PREFIXES) {
    if (t.startsWith(prefix)) {
      const rest = t.slice(prefix.length).trim();
      return rest ? { heading: prefix, rest } : null;
    }
  }
  if (t.includes("? ") && t.length < 120) {
    const i = t.indexOf("? ");
    const heading = t.slice(0, i + 1).trim();
    const rest = t.slice(i + 1).trim();
    if (rest && heading.length < 50) return { heading, rest };
  }
  return null;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const phoneUrl = "tel:" + SITE_CONFIG.phone.replace(/\s/g, "");
  const otherServices = SERVICES.filter((s) => s.slug !== slug);
  const firstContentIndex = service.body.findIndex((p) => !splitSubheading(p));
  const faqList = [...(service.faq || []), ...GENERIC_FAQS].slice(0, 8);

  const breadcrumbItems = [
    { label: "Anasayfa", href: "/" },
    { label: "Hizmetlerimiz", href: "/hizmetler" },
    { label: service.title },
  ];
  const faqSchema = buildFAQPageSchema(faqList, `${service.title} – Sıkça Sorulan Sorular`);
  const serviceSchema = buildServiceSchema(
    { title: service.title, excerpt: service.excerpt, slug },
    { phone: SITE_CONFIG.phone, address: SITE_CONFIG.address }
  );
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  return (
    <main className="main-inner">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="page-hero-banner">
        <Image
          src="/images/hizmet-banner.jpg"
          alt=""
          fill
          className="page-hero-banner-img"
          sizes="100vw"
          priority
        />
        <div className="page-hero-banner-overlay" aria-hidden="true" />
        <div className="page-hero-banner-content">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="service-detail-layout">
        <aside className="service-detail-sidebar">
          <div className="service-detail-cta-card">
            <h2 className="service-detail-sidebar-title">Randevu ve bilgi</h2>
            <p>Bu hizmet hakkında sorularınız veya randevu talebiniz için bize ulaşabilirsiniz.</p>
            <div className="service-detail-cta-card-links">
              <a href={phoneUrl}>Hemen ara</a>
              <a href={SITE_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ile yaz</a>
            </div>
          </div>
          <nav className="service-detail-other" aria-label="Diğer hizmetler">
            <h2 className="service-detail-other-title">Diğer hizmetler</h2>
            <ul className="service-detail-other-list">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link href={`/hizmetler/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="section page-content service-detail-article">
          <h1>{service.title}</h1>
          {service.excerpt && (
            <p className="service-detail-excerpt">{service.excerpt}</p>
          )}
          <div className="service-detail-body">
            {service.body.map((p, i) => {
              const split = splitSubheading(p);
              if (split) {
                return (
                  <div key={i} className="service-detail-block">
                    <h2 className="service-detail-subheading">{split.heading}</h2>
                    <p>{split.rest}</p>
                  </div>
                );
              }
              const isFirst = firstContentIndex === i;
              return (
                <p key={i} className={isFirst ? "service-detail-lead" : undefined}>
                  {p}
                </p>
              );
            })}
          </div>
        </article>
      </div>
      <section className="service-detail-sss" id="sss" aria-labelledby="sss-title">
        <h2 id="sss-title" className="service-detail-sss-title">Sıkça Sorulan Sorular</h2>
        <div className="service-detail-sss-list">
          {faqList.map((item, i) => (
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
