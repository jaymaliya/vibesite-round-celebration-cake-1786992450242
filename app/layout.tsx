import type { Metadata } from "next";
import CartProvider from "../components/CartContext";
import Toast from "../components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Round Celebration Cake",
  description: "This is a beautifully presented round celebration cake, generously adorned with a vibrant array of fresh, colorful fruits and pristine white cream fro",
  openGraph: { title: "Round Celebration Cake", description: "This is a beautifully presented round celebration cake, generously adorned with a vibrant array of fresh, colorful fruits and pristine white cream fro", type: "website", images: ["/product-1.jpg"] },
  twitter: { card: "summary_large_image", title: "Round Celebration Cake", description: "This is a beautifully presented round celebration cake, generously adorned with a vibrant array of fresh, colorful fruits and pristine white cream fro" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNGRkJGMzUiIC8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05IDE4YzEuNS0zIDUtMyA3LTFzNSAyIDctMSIgc3Ryb2tlPSIjRTY0QjU1IiBzdHJva2VXaWR0aD0iMiIgc3Ryb2tlTGluZWNhcD0icm91bmQiIGZpbGw9Im5vbmUiIC8+CiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEuNiIgZmlsbD0iI0U2NEI1NSIgLz4KICAgICAgICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIxMiIgcj0iMS42IiBmaWxsPSIjM0EyQTIyIiAvPgogICAgICAgICAgPC9zdmc+" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "try{if(location.search.indexOf('screenshot=1')>-1){var s=document.createElement('style');s.textContent='*{animation:none!important;transition:none!important}.will-reveal,.is-hidden,[class*=reveal],[class*=fade]{opacity:1!important;transform:none!important;visibility:visible!important}';document.head.appendChild(s);}}catch(e){}" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Round Celebration Cake", logo: "/product-1.jpg", url: process.env.VAANI_SITE_URL || undefined }) }} />
      </head>
      <body>
        <CartProvider>
          <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
