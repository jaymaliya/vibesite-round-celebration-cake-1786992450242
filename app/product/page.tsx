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
    { label: "S", top: "22%", left: "20%" },
    { label: "K", top: "16%", left: "58%" },
    { label: "B", top: "58%", left: "72%" },
    { label: "C", top: "64%", left: "26%" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0">
      {dots.map((d, i) => (
        <div key={i} className="absolute" style={{ top: d.top, left: d.left }}>
          <div
            className="rounded-full opacity-0 group-hover:opacity-100 transition-transform transition-opacity duration-300 group-hover:scale-125"
            style={{ width: 20, height: 20, background: "rgba(255,255,255,0.7)", transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
          />
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 translate-y-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-[transform,opacity] duration-200"
            style={{
              width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff",
              fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
              textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center",
              transitionTimingFunction: "ease-out", boxShadow: "var(--shadow-sm)",
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
  const [isMobile, setIsMobile] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

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
    router.push("/checkout");
  };

  const scrollToBuy = () => document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });

  const recs = products.filter((p) => p.name !== displayName).slice(0, 3);

  const blush = "color-mix(in srgb, var(--accent) 8%, var(--bg))";
  const softTint = "color-mix(in srgb, var(--primary) 4%, var(--bg))";
  const railTint = "color-mix(in srgb, var(--accent) 6%, var(--bg))";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* ================= HERO — FULL_BLEED_OVERLAY ================= */}
      <section className="reveal" style={{ position: "relative", width: "100%", height: "92vh", minHeight: 560, overflow: "hidden" }}>
        <button
          onClick={() => router.push("/shop")}
          style={{
            position: "absolute", top: 24, left: 24, zIndex: 10, display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "var(--radius-pill)", padding: "8px 18px",
            cursor: "pointer", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
            boxShadow: "var(--shadow-sm)", transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Back to Shop
        </button>

        <div className="group" style={{ position: "absolute", inset: 0 }}>
          <img
            src={displayImg}
            alt={displayName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <FruitDots />
        </div>

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.82) 0%, rgba(15,15,15,0.45) 32%, rgba(15,15,15,0) 62%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,15,15,0.35) 0%, rgba(15,15,15,0) 45%)" }} />

        <div style={{ position: "absolute", left: "6%", right: "6%", bottom: "7%", maxWidth: 700 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            Celebration Cakes
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(3rem,6vw,5.5rem)",
              letterSpacing: "-0.02em", lineHeight: 1.02, color: "#fff", marginTop: 10,
            }}
          >
            {displayName}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.6, maxWidth: 460, marginTop: 14 }}>
            {matched.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", fontSize: 13.5, color: "rgba(255,255,255,0.85)", marginTop: 18 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Stars count={5} /> 4.8 (312 reviews)</span>
            <span>Baked fresh, same-day</span>
            <span>Free delivery above ₹999</span>
          </div>

          <button
            onClick={scrollToBuy}
            style={{
              marginTop: 26, height: 56, padding: "0 40px", borderRadius: "var(--radius-pill)", border: "none",
              cursor: "pointer", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 16,
              boxShadow: "var(--glow)", transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Order Your Cake
          </button>
        </div>
      </section>

      {/* ================= BUY BOX — ASYMMETRIC_SPLIT ================= */}
      <section id="buy" className="reveal grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-12 items-start" style={{ maxWidth: 1280, margin: "0 auto", padding: "var(--space-section) 24px" }}>
        <div className="group" style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
          <img
            src={displayImg}
            alt={displayName}
            style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 0.6s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <FruitDots />
          <span style={{ position: "absolute", bottom: 14, left: 14, background: "rgba(15,15,15,0.55)", color: "#fff", fontSize: 12, padding: "6px 12px", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-body)" }}>
            Hover to spot the fresh fruit
          </span>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.9rem", color: "var(--primary)" }}>
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>incl. all taxes</span>
          </div>

          <div style={{ marginTop: 28 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Size</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {sizePills.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    height: 44, padding: "0 20px", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-body)",
                    fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer",
                    background: size === s ? "var(--primary)" : "var(--surface)",
                    color: size === s ? "#fff" : "#fff",
                    opacity: size === s ? 1 : 0.85,
                    border: "none", transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)" }}>Quantity</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: 40, height: 40, borderRadius: "var(--radius-pill)", border: "1px solid color-mix(in srgb, var(--muted) 40%, transparent)", background: "var(--bg)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                −
              </button>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 600, color: "var(--text)", minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{ width: 40, height: 40, borderRadius: "var(--radius-pill)", border: "1px solid color-mix(in srgb, var(--muted) 40%, transparent)", background: "var(--bg)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap" }}>
            <button
              onClick={handleAddToCart}
              style={{
                height: 54, padding: "0 30px", borderRadius: "var(--radius-pill)", border: "1.5px solid var(--primary)",
                background: "transparent", color: "var(--primary)", fontWeight: 600, fontSize: 15, cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {added ? "✓ Added" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                height: 54, padding: "0 36px", borderRadius: "var(--radius-pill)", border: "none",
                background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer",
                boxShadow: "var(--shadow-lg)", transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Buy Now
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Stars count={5} /> 4.8 (312)</span>
            <span>Made fresh in India</span>
            <span>Eggless option available</span>
          </div>
        </div>
      </section>

      {/* ================= STORY_SPLIT — ASYMMETRIC_SPLIT (image bleeds right) ================= */}
      <section id="story" className="reveal" style={{ background: blush, padding: "var(--space-section) 0" }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "0 24px", position: "relative", zIndex: 2 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
              Our Craft
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-0.015em", color: "var(--text)", marginTop: 10, lineHeight: 1.15 }}>
              Layered by hand, finished with fruit picked at its peak.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--muted)", marginTop: 16, maxWidth: 380 }}>
              Every cake starts a day before it leaves our kitchen — sponge baked to order, cream whipped fresh, and fruit sliced only hours before delivery so it never tastes like it's been sitting around.
            </p>
            <button
              onClick={() => document.getElementById("ingredients")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                marginTop: 22, height: 50, padding: "0 30px", borderRadius: "var(--radius-pill)", border: "none",
                background: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
                boxShadow: "var(--shadow-md)", transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              See the Ingredients
            </button>
          </div>
          <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)", marginTop: isMobile ? 32 : 0, marginRight: isMobile ? 0 : "-8%", boxShadow: "var(--shadow-lg)" }}>
            <img
              src="/product-3.jpg"
              alt="Cake being layered by hand"
              style={{ width: "100%", aspectRatio: isMobile ? "4/3" : "16/10", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ================= INGREDIENT_CLOSEUP — OVERLAP_BREAKOUT ================= */}
      <section id="ingredients" className="reveal" style={{ background: softTint, padding: "var(--space-section) 24px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            Straight From the Fruit Bowl
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-0.015em", color: "var(--text)", marginTop: 10, maxWidth: 560 }}>
            Strawberry, kiwi, blueberry, cherry — nothing frozen, nothing canned.
          </h2>

          <div style={{ position: "relative", marginTop: 48, height: isMobile ? 340 : 420 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: isMobile ? "70%" : "56%", overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}>
              <img src="/product-1.jpg" alt="Fresh fruit close-up on cake" style={{ width: "100%", aspectRatio: "5/4", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", right: 0, bottom: 0, width: isMobile ? "56%" : "40%", overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)", border: "6px solid var(--bg)" }}>
              <img src="/product-4.jpg" alt="Caramel and fruit detail" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: 64 }}>
            {[
              { t: "100% Fresh Fruit", d: "Sourced each morning, never frozen or tinned." },
              { t: "Baked to Order", d: "No shelf cakes — yours is baked the day you order." },
              { t: "Eggless Available", d: "Every flavour can be made egg-free on request." },
            ].map((f, i) => (
              <div key={i} style={{ padding: "20px 4px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-pill)", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 18, color: "var(--text)", marginTop: 14 }}>{f.t}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginTop: 6 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= YOU MIGHT ALSO LIKE — BENTO_MOSAIC ================= */}
      <section className="reveal" style={{ padding: "var(--space-section) 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            More to Celebrate With
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-0.015em", color: "var(--text)", marginTop: 10 }}>
            You Might Also Like
          </h2>

          <div className="grid grid-cols-4 gap-4" style={{ marginTop: 36, gridAutoRows: 220 }}>
            {recs.map((p, i) => (
              <article
                key={p.id}
                className={i === 0 ? "col-span-4 md:col-span-2 md:row-span-2" : "col-span-4 md:col-span-2"}
                style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-lg)", cursor: "pointer", boxShadow: "var(--shadow-md)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-xl)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,15,15,0.7) 0%, rgba(15,15,15,0) 55%)" }} />
                <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: i === 0 ? "1.3rem" : "1.05rem", color: "#fff" }}>{p.name}</h3>
                  <p style={{ marginTop: 4, color: "var(--accent)", fontWeight: 600, fontSize: 14 }}>₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS — HORIZONTAL_RAIL ================= */}
      <section className="reveal" style={{ background: railTint, padding: "var(--space-section) 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            Real Orders, Real Words
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.8rem)", letterSpacing: "-0.015em", color: "var(--text)", marginTop: 10 }}>
            Loved for Its Freshness
          </h2>

          <div className="flex gap-5 overflow-x-auto" style={{ marginTop: 32, paddingBottom: 16, scrollbarWidth: "none" as any }}>
            {reviews.map((r) => (
              <div
                key={r.name}
                className="flex-none"
                style={{
                  width: 280, background: "var(--bg)", borderRadius: "var(--radius-lg)", padding: 24,
                  border: "1px solid color-mix(in srgb, var(--muted) 25%, transparent)", boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, flexShrink: 0 }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>{r.city}</p>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}><Stars count={r.rating} /></div>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--muted)", marginTop: 12 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER — FULL_BLEED_BAND (dark) ================= */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "var(--space-section) 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
            Stay Sweet
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "#fff", marginTop: 10, lineHeight: 1.2 }}>
            First to know about new flavours and festive drops.
          </h2>
          {subscribed ? (
            <p style={{ marginTop: 20, color: "var(--accent)", fontWeight: 600 }}>✓ You're on the list — see you in your inbox.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3"
              style={{ marginTop: 24, maxWidth: 460 }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  flex: 1, height: 52, padding: "0 18px", borderRadius: "var(--radius-pill)", border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.06)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height: 52, padding: "0 30px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--accent)",
                  color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "var(--shadow-lg)", transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />

      {/* Sticky mobile add-to-cart bar */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "14px 20px", background: "var(--bg)", borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 50, boxShadow: "var(--shadow-lg)" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)" }}>₹{finalPrice.toLocaleString("en-IN")}</span>
          <button
            onClick={handleAddToCart}
            style={{ padding: "12px 28px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--accent)", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            {added ? "✓ Added" : "Add to Cart"}
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