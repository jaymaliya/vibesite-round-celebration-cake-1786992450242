"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Fresh Fruit Cream Cake", description: "Vibrant fresh fruit cream cake on a rustic wooden board, perfect for celebrations.", price: 500, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Red Velvet Layer Cake", description: "Visually striking, multi-layered Red Velvet cake with vibrant crimson layers and creamy", price: 200, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Chocolate Ganache Drip Cake", description: "Meticulously crafted round chocolate cake with glossy ganache and varied chocolate", price: 300, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Caramel Praline Drip Cake", description: "Elegant multi-layered caramel mocha celebration cake with drip glaze and chopped nuts.", price: 400, badge: "" }
];

function FruitOverlay() {
  const dots = [
    { label: "S", top: "18%", left: "16%" },
    { label: "K", top: "12%", left: "60%" },
    { label: "B", top: "58%", left: "74%" },
    { label: "C", top: "64%", left: "22%" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d, i) => (
        <div key={i} className="absolute" style={{ top: d.top, left: d.left }}>
          <div
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              width: 20,
              height: 20,
              background: "rgba(255,255,255,0.7)",
              transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-[transform,opacity,box-shadow] duration-200"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transitionTimingFunction: "ease-out",
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState<Record<number, boolean>>({});
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAdd = (p: (typeof products)[number]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAdded((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const goToProduct = (p: (typeof products)[number]) => {
    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      // fail silently, still confirm optimistically
    }
    setSubscribed(true);
  };

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* HERO — FULL_BLEED_OVERLAY */}
      <section className="reveal relative w-full" style={{ minHeight: "92vh" }}>
        <img
          src="/product-1.jpg"
          alt="Fresh fruit cream celebration cake topped with strawberries, kiwi, blueberries and cherries"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, rgba(255,248,238,0.55) 35%, rgba(255,248,238,0.05) 65%)",
          }}
        />
        {/* cake-cutting rule line + circular breakout tab */}
        <div
          className="hidden md:block absolute pointer-events-none"
          style={{ right: "6%", bottom: "18%", width: "180px", height: "180px" }}
        >
          <div
            className="rounded-full overflow-hidden"
            style={{ width: 140, height: 140, border: "4px solid var(--bg)", boxShadow: "var(--shadow-lg)" }}
          >
            <img src="/product-1.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -10,
              right: -18,
              background: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: "999px",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            Same-Day Baked
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16" style={{ minHeight: "92vh", paddingBottom: "8vh", paddingTop: "18vh" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: 16,
            }}
          >
            Fresh Fruit · Real Cream · Every Slice
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2.6rem, 6vw, 5.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              maxWidth: "640px",
              color: "var(--text)",
            }}
          >
            Celebrate Life&rsquo;s Sweetest Moments.
          </h1>
          <p style={{ marginTop: 20, maxWidth: 460, fontSize: 16, lineHeight: 1.65, color: "var(--muted)" }}>
            Handpiled strawberries, kiwi, blueberries and cherries over pillow-soft cream, finished on a
            rustic wooden board — baked fresh, the morning of your celebration.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => router.push("/shop")}
              style={{
                height: 56,
                padding: "0 40px",
                background: "var(--primary)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Shop Now
            </button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm" style={{ color: "var(--muted)" }}>
            <span>★★★★★ 4.8 (620+ orders)</span>
            <span>Baked fresh in India, daily</span>
            <span>Free delivery above ₹999</span>
          </div>
        </div>
      </section>

      {/* OUR ARTISANAL CREATIONS — HORIZONTAL_RAIL */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 0" }}>
        <div className="px-6 md:px-16">
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 }}>
            Best Loved
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.02em", marginBottom: 40 }}>
            Our Artisanal Creations
          </h2>
        </div>
        <div
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <article
              key={p.id}
              className="group snap-start flex-shrink-0"
              style={{ width: 280, cursor: "pointer" }}
              onClick={() => goToProduct(p)}
            >
              <div className="relative">
                <div style={{ overflow: "hidden", borderRadius: "var(--radius-md)" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <FruitOverlay />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.1rem", marginTop: 16, color: "var(--text)" }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{p.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.25rem", color: "var(--primary)" }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(p);
                  }}
                  style={{
                    height: 40,
                    padding: "0 18px",
                    background: added[p.id] ? "var(--accent)" : "transparent",
                    color: added[p.id] ? "#fff" : "var(--primary)",
                    border: "1.5px solid var(--primary)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {added[p.id] ? "✓ Added" : "Add to Cart"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* OUR STORY — ASYMMETRIC_SPLIT */}
      <section id="about" className="reveal" style={{ background: "var(--bg)", padding: "var(--space-section) 24px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-10 items-center max-w-6xl mx-auto">
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 16 }}>
              The Heart of Our Craft
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(2rem,3.5vw,3rem)", letterSpacing: "-0.02em", maxWidth: 560 }}>
              Every cake starts with what&rsquo;s ripe that morning.
            </h2>
            <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.65, color: "var(--muted)", maxWidth: 560 }}>
              Long before the piping begins, our bakers are at the market choosing strawberries by
              scent and kiwi by feel. We whip cream to soft peaks, not stiff ones, and pipe every
              ridge by hand so no two cakes sit quite the same. What lands on your table is fresh,
              unhurried, and made to be shared.
            </p>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                marginTop: 28,
                background: "transparent",
                border: "none",
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                borderBottom: "2px solid var(--primary)",
                paddingBottom: 2,
                whiteSpace: "nowrap",
              }}
            >
              Our Story
            </button>
          </div>
          <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
            <img
              src="/product-2.jpg"
              alt="Baker piping cream ridges around a celebration cake"
              style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", transition: "transform 0.6s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* NATURE'S BOUNTY — OVERLAP_BREAKOUT */}
      <section id="features" className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 24px" }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12, textAlign: "center" }}>
            Nature&rsquo;s Bounty
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.02em", textAlign: "center", marginBottom: 56 }}>
            Our Fresh Ingredients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div style={{ background: "var(--bg)", padding: 32, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary)" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20, marginTop: 24 }}>Juicy Strawberries</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: 8 }}>
                Hand-sliced at peak ripeness for a natural sweetness in every bite.
              </p>
            </div>
            <div
              style={{
                background: "var(--bg)",
                padding: 32,
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                marginTop: "-32px",
                marginBottom: "-32px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#8FA663" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20, marginTop: 24 }}>Zesty Kiwi</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: 8 }}>
                Bright, tangy discs that cut through the cream with fresh acidity.
              </p>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  marginTop: 20,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Discover More
              </button>
            </div>
            <div style={{ background: "var(--bg)", padding: 32, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#5B6B8C" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 20, marginTop: 24 }}>Plump Blueberries</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: 8 }}>
                Sweet little bursts scattered generously across every layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR SIGNATURE FLAVOURS — BENTO_MOSAIC */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "var(--space-section) 24px" }}>
        <div className="max-w-6xl mx-auto">
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 }}>
            The Range
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.02em", marginBottom: 40 }}>
            Our Signature Flavours
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 relative cursor-pointer"
              style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}
              onClick={() => goToProduct(products[1])}
            >
              <img
                src={products[1].img}
                alt={products[1].name}
                style={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <span
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                New
              </span>
            </div>
            <div style={{ background: "var(--surface)", padding: 24, borderRadius: "var(--radius-lg)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
                {products[1].name}
              </h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{products[1].description}</p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18, color: "var(--primary)", marginTop: 12 }}>
                ₹{products[1].price.toLocaleString("en-IN")}
              </p>
            </div>
            <div
              className="cursor-pointer"
              style={{ overflow: "hidden", borderRadius: "var(--radius-md)" }}
              onClick={() => goToProduct(products[2])}
            >
              <img
                src={products[2].img}
                alt={products[2].name}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div
              className="cursor-pointer"
              style={{ overflow: "hidden", borderRadius: "var(--radius-md)" }}
              onClick={() => goToProduct(products[3])}
            >
              <img
                src={products[3].img}
                alt={products[3].name}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div style={{ background: "var(--surface)", padding: 24, borderRadius: "var(--radius-lg)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
                Made to Order
              </h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
                Every cake is baked the same day it&rsquo;s delivered — nothing sits in a freezer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CROWD FAVOURITES — HORIZONTAL_RAIL */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 0" }}>
        <div className="px-6 md:px-16">
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 12 }}>
            Celebrate With Us
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.02em", marginBottom: 40 }}>
            Your Crowd Favourites
          </h2>
        </div>
        <div
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-16 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="group snap-start flex-shrink-0 cursor-pointer"
              style={{ width: 240 }}
              onClick={() => goToProduct(p)}
            >
              <div style={{ overflow: "hidden", borderRadius: "var(--radius-md)" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, textAlign: "center", marginTop: 12 }}>
                {p.name}
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18, color: "var(--primary)", textAlign: "center", marginTop: 4 }}>
                ₹{p.price.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12 px-6">
          <button
            onClick={() => router.push("/shop")}
            style={{
              height: 52,
              padding: "0 32px",
              background: "transparent",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "var(--radius-pill)",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            View All Cakes
          </button>
        </div>
      </section>

      {/* CONTACT strip */}
      <section id="contact" className="reveal" style={{ background: "var(--bg)", padding: "56px 24px" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.6rem" }}>Visit or Reach Us</h3>
            <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
              Koramangala, Bengaluru · Open 9am – 9pm, all days
            </p>
          </div>
          <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: 15 }}>+91 98765 43210 · hello@roundcelebration.in</p>
        </div>
      </section>

      {/* NEWSLETTER — FULL_BLEED_BAND */}
      <section className="reveal" style={{ background: "var(--primary)", padding: "var(--space-section) 24px" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#fff" }}>
            Join Our Sweet Community
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "rgba(255,255,255,0.9)", marginTop: 16 }}>
            Seasonal flavours, festive specials and first access to limited-batch cakes — straight to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center items-stretch gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{
                height: 48,
                flex: 1,
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.1)",
                padding: "0 16px",
                color: "#fff",
                fontSize: 14,
              }}
            />
            <button
              type="submit"
              style={{
                height: 48,
                padding: "0 28px",
                background: "#fff",
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p style={{ marginTop: 16, color: "#fff", fontWeight: 600, fontSize: 14 }}>
              Thank You for Subscribing!
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}