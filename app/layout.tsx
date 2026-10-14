import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { preload } from "react-dom";
import { Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import SmoothScroll from "../components/SmoothScroll";
import CursorReticle from "../components/CursorReticle";
import MemProbe from "../components/MemProbe";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./evolution.css";

// Absolute-URL base for canonical links, OG/Twitter images, and the sitemap.
// Env var wins on Vercel previews; falls back to the production domain.
import { SITE } from "@/lib/site";

const SITE_URL = SITE.url;
const DESCRIPTION =
  `${SITE.name}'s developer portfolio: MERN-stack fintech apps, real-time Socket.IO systems, and Flutter mobile releases.`;

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  // 300 was loaded but never referenced anywhere in globals.css or TSX
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: `${SITE.name}: ${SITE.role}`,
  description: DESCRIPTION,
  keywords: [
    SITE.name,
    "full-stack developer",
    "software engineer",
    "MERN stack developer",
    "React.js developer",
    "Node.js developer",
    "Flutter developer",
    "Socket.IO",
    "fintech",
    "Next.js portfolio",
  ],
  openGraph: {
    title: `${SITE.name}: ${SITE.role}`,
    description: DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE.name,
    // og:image is injected automatically by app/opengraph-image.jpeg
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: ${SITE.role}`,
    description: DESCRIPTION,
    // twitter:image is injected automatically by app/twitter-image.jpeg
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0B09",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Kick off hero-critical asset fetches from the initial HTML instead of
  // waiting for client JS to evaluate useGLTF.preload — parallel with the
  // JS download, shortens the preloader's wall time on cold loads.
  preload("/assets/hardware_laptop.glb", { as: "fetch", crossOrigin: "anonymous" });
  // crossOrigin must match THREE's loaders (anonymous) or the preloaded
  // response has a different credentials mode and both textures download twice.
  preload("/assets/textures/bg.jpg", { as: "image", crossOrigin: "anonymous" });
  preload("/assets/textures/Mac Keyboard.jpg", {
    as: "image",
    crossOrigin: "anonymous",
  });

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`history.scrollRestoration = "manual";
if (!location.hash) window.scrollTo(0, 0);`}
        </Script>
        {/* Film-grain noise overlay — fixed, pointer-events-none, adds physical texture */}
        <div className="grain-overlay" aria-hidden="true" />
        {/* Person structured data for name-search rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: SITE.name,
              url: SITE_URL,
              email: SITE.email,
              jobTitle: SITE.role,
              worksFor: { "@type": "Organization", name: "Keyutech Pvt. Ltd." },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Sardar Patel University, Balaghat",
              },
              sameAs: [SITE.github, SITE.linkedin].filter(Boolean),
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        {/* Detection-reticle cursor — body-level sibling so position:fixed is
            never trapped inside a transformed ancestor. Renders null on
            touch / reduced-motion. */}
        <CursorReticle />
        {/* Temporary OOM-investigation HUD — renders nothing without ?memprobe */}
        <MemProbe />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
