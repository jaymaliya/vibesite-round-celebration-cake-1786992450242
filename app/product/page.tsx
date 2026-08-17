"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense, createContext, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Inline CartContext
const CartContext = createContext<any>(null);

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([]);

  const addItem = (item: any) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  return <CartContext.Provider value={{ items, addItem }}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

const products = [
  { id: 1, img: "/product-1.jpg", name: "Fresh Fruit Cream Cake", description: "Vibrant fresh fruit cream cake on a rustic wooden board, perfect for celebrations.", price: 500, badge: "NEW", specs: [] },
  { id: 2, img: "/product-2.jpg", name: "Red Velvet Layer Cake", description: "Visually striking, multi-layered Red Velvet cake with vibrant crimson layers and creamy", price: 200, badge: "", specs: [] },
  { id: 3, img: "/product-3.jpg", name: "Chocolate Ganache Drip Cake", description: "Meticulously crafted round chocolate cake with glossy ganache and varied chocolate", price: 300, badge: "", specs: [] },
  { id: 4, img: "/product-4.jpg", name: "Caramel Praline Drip Cake", description: "Elegant multi-layered caramel mocha celebration cake with drip glaze and chopped nuts.", price: 400, badge: "", specs: [] }
];

const sizePills = ["0.5 kg", "1 kg", "2 kg"];

const reviews = [
  { name: "Meenal Kulkarni", city: "Pune", rating: 5, text: "Ordered this for my daughter's birthday — the fruit was so fresh and the cream wasn't overly sweet. Everyone asked where I got it." },
  { name: "Thabo Reddy", city: "Hyderabad", rating: 4, text: "Beautiful presentation on the wooden board, looked exactly like the photos. Delivery was slightly late but the cake made up for it." },
  { name: "Ishaan Bordoloi", city: "Guwahati", rating: 5, text: "The kiwi and strawberry combo on top was so vibrant, felt like a proper celebration cake and not a factory one." },
  { name: "Devika Nair", city: "Kochi", rating: 4, text: "Loved the texture of the frosting — smooth and light. Would've liked a bit more fruit inside the layers too." }
];

function FruitDots() {
  const dots = [
    { label: "S", top: "20%", left: "18%" },
    { label: "K", top: "14%", left: "62%" },
    { label: "B", top: "60%", left: "76%" },
    { label: "C", top: "66%", left: "24%" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d, i) => (
        <div key={i} className="absolute" style={{ top: d.top, left: d.left }}>
          <div
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ width: 20, height: 20, background: "rgba(255,255,255,0.7)", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
          />
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-[transform,opacity,box-shadow] duration-200"
            style={{
              width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff",
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
              textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center",
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

function Stars({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < count ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1">
          <polygon points="10,1 12.6,7 19,7.5 14,12 15.5,18.5 10,15 4.5,18.5 6,12 1,7.5 7.4,7" />
        </svg>
      ))}
    </span>
  );
}

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const displayImg = paramImg ?? "/product-1.jpg";
  const { addItem } = useCart();

  const matched = products.find((p) => p.name === paramName) ?? products[0];
  const displayName = paramName ?? matched.name;
  const displayPrice = paramPrice ?? matched.price;

  const [size, setSize] = useState(sizePills[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) el.classList.add("will-reveal");
      else el.classList.add("visible");
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

  const priceMultiplier = size === "0.5 kg" ? 0.6 : size === "2 kg" ? 1.9 : 1;
  const finalPrice = Math.round(displayPrice * priceMultiplier);

  const handleAddToCart = () => {
    addItem({ id: `${matched.id}-${size}`, name: `${displayName} (${size})`, price: finalPrice, quantity: qty, image: displayImg });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `${matched.id}-${size}`, name: `${displayName} (${size})`, price: finalPrice, quantity: qty, image: displayImg });
    setBuying(true);
    router.push("/checkout");
  };

  const recs = products.filter((p) => p.name !== displayName).slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.will-reveal { opacity: 0; transform: translateY(24px); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .rail::-webkit-scrollbar { display: none; }
        .rail { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Navbar />

      {/* Breadcrumb / back */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px 0" }}>
        <button
          onClick={() => router.push("/shop")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: 14, whiteSpace: "nowrap" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Back to Shop
        </button>
      </div>

      {/* Two column product detail */}
      <section className="reveal" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 48, alignItems: "start" }}>
          {/* Image column */}
          <div style={{ position: "sticky", top: 100 }}>
            <div
              className="group"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--radius-lg)",
                background: "var(--bg)",
                boxShadow: "var(--shadow-md)",
                aspectRatio: "4/5",
              }}
            >
              <img
                src={displayImg}
                alt={displayName}
                style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <FruitDots />
            </div>
            <p style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>
              Hover the photo to see the fresh fruits used inside.
            </p>
          </div>

          {/* Info column */}
          <div>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)" }}>
              Celebration Cakes
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(2rem,4.5vw,3.2rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--text)",
                marginTop: 12,
              }}
            >
              {displayName}
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.65, color: "var(--muted)", marginTop: 16, maxWidth: 480 }}>
              {matched.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.75rem", color: "var(--primary)" }}>
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>incl. all taxes</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Stars count={5} /> 4.8 (312 reviews)</span>
              <span>Baked fresh, same-day</span>
              <span>Free delivery above ₹999</span>
            </div>

            {/* Size selector */}
            <div style={{ marginTop: 32 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Size</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                {sizePills.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      height: 44,
                      padding: "0 20px",
                      borderRadius: "var(--radius-pill)",
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      background: size === s ? "var(--primary)" : "var(--surface)",
                      color: size === s ? "#fff" : "var(--text)",
                      border: size === s ? "none" : "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
                      transition: "transform 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginTop: 28 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Quantity</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)", background: "var(--surface)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  −
                </button>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 600, color: "var(--text)", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", border: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)", background: "var(--surface)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs (hidden on mobile, shown as sticky bar there) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32, maxWidth: 420 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  height: 56,
                  borderRadius: "var(--radius-md)",
                  background: added ? "var(--accent)" : "var(--primary)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: 17,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.15s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {added ? "✓ Added to Bag" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  height: 56,
                  borderRadius: "var(--radius-md)",
                  background: "transparent",
                  color: "var(--text)",
                  border: "2px solid var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 17,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "none",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {buying ? "Redirecting…" : "Buy Now"}
              </button>
            </div>

            {/* Specs */}
            {matched.specs.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>
                  Details
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "0px 24px", marginTop: 16 }}>
                  {matched.specs.map((s, i) => (
                    <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)" }}>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", fontWeight: 500, marginTop: 4 }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reveal" id="reviews" style={{ maxWidth: 1280, margin: "0 auto", padding: "var(--space-section) 24px" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)" }}>
          What customers say
        </span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", letterSpacing: "-0.02em", color: "var(--text)", marginTop: 12 }}>
          Loved for its freshness
        </h2>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column" }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: "24px 0", borderBottom: i < reviews.length - 1 ? "1px solid color-mix(in srgb, var(--muted) 20%, transparent)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Stars count={r.rating} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{r.name}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>· {r.city}</span>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.65, color: "var(--muted)", maxWidth: 640 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* You might also like */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--primary)" }}>
            More to celebrate with
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", letterSpacing: "-0.02em", color: "var(--text)", marginTop: 12, marginBottom: 32 }}>
            You Might Also Like
          </h2>
          <div className="rail" style={{ display: "flex", gap: 24, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 8 }}>
            {recs.map((p) => (
              <article
                key={p.id}
                className="group"
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{ flex: "0 0 auto", width: 280, scrollSnapAlign: "start", cursor: "pointer" }}
              >
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-md)", background: "#fff", boxShadow: "var(--shadow-sm)" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <FruitDots />
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 18, color: "var(--text)", marginTop: 16 }}>{p.name}</h3>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20, color: "var(--primary)", marginTop: 8 }}>₹{p.price.toLocaleString("en-IN")}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`);
                  }}
                  style={{
                    marginTop: 12,
                    height: 40,
                    width: "100%",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  View Details
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile bar */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 20px",
            background: "var(--bg)",
            borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            zIndex: 50,
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", whiteSpace: "nowrap" }}>
            ₹{finalPrice.toLocaleString("en-IN")}
          </span>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              maxWidth: 220,
              height: 48,
              borderRadius: "var(--radius-md)",
              border: "none",
              background: added ? "var(--accent)" : "var(--primary)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {added ? "✓ Added to Bag" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <CartProvider>
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
        <ProductContent />
      </Suspense>
    </CartProvider>
  );
}