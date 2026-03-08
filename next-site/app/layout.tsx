import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buildOrganizationSchema, getBaseUrl } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/content";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const baseUrl = getBaseUrl();
const siteName = "Trabzon Varis Tedavisi | Ameliyatsız Varis, Tiroid Nodül – Uzm. Dr. Doğukan Atabay";
const defaultDescription =
  "Trabzon'da ameliyatsız varis tedavisi, lazer ve köpük skleroterapi, tiroid nodül tedavisi. Uzm. Dr. Doğukan Atabay – Trabzon İmperial Hastanesi. Randevu: 0533 948 30 76.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: "Uzm. Dr. Doğukan Atabay - Trabzon Varis Tedavisi | Girişimsel Radyoloji",
  icons: {
    icon: "/favicon.webp",
  },
  title: {
    default: siteName,
    template: "%s | Uzm. Dr. Doğukan Atabay",
  },
  description: defaultDescription,
  keywords: [
    "Trabzon varis tedavisi",
    "Trabzon ameliyatsız varis",
    "Trabzon varis doktoru",
    "Trabzon lazer varis",
    "Trabzon köpük varis",
    "Trabzon tiroid nodül tedavisi",
    "Trabzon girişimsel radyoloji",
    "İmperial Hastanesi Trabzon varis",
    "Doğukan Atabay Trabzon",
    "Ortahisar varis tedavisi",
    "Trabzon Rize Artvin varis tedavisi",
    "girişimsel radyoloji Trabzon",
    "köpük skleroterapi Trabzon",
    "biyopsi Trabzon",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: baseUrl,
    siteName,
    title: siteName,
    description: defaultDescription,
    images: [{ url: `${baseUrl}/Dogukan-atabay.webp`, width: 800, height: 600, alt: "Uzm. Dr. Doğukan Atabay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
};

const organizationSchema = buildOrganizationSchema({
  name: "Uzm. Dr. Doğukan Atabay - Trabzon Varis Tedavisi",
  phone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  address: SITE_CONFIG.address,
  hours: SITE_CONFIG.hours,
  url: baseUrl,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <div className="page-container">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
