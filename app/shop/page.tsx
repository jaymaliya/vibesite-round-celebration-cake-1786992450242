"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Fresh Fruit Cream Cake", description: "Vibrant fresh fruit cream cake on a rustic wooden board, perfect for celebrations.", price: 500, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Red Velvet Layer Cake", description: "Visually striking, multi-layered Red Velvet cake with vibrant crimson layers and creamy", price: 200, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Chocolate Ganache Drip Cake", description: "Meticulously crafted round chocolate cake with glossy ganache and varied chocolate", price: 300, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Caramel Praline Drip Cake", description: "Elegant multi-layered caramel mocha celebration cake with drip glaze and chopped nuts.", price: 400, badge: "" }
];

const filters = ["All Cakes", "Fresh Fruit", "Chocolate", "Seasonal Specials"];

function FruitOverlay() {
  const dots = [
    { label: "S", top: "18%", left: "14%" },
    { label: "K", top: "10%", left: "58%" },
    { label: "B", top: "56%", left: "76%" },
    { label: "C", top: "62%", left: "20%" },
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

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Cakes");
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

  const handleAdd = (p: typeof products[number]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAdded((s) => ({ ...s, [p.id]: true }));
    setTimeout(() => setAdded((s) => ({ ...s, [p.id]: false })), 1500);
  };

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .reveal { transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Navbar />

      {/* Page hero strip */}
      <section
        className="reveal"
        style={{
          padding: "56px 24px 40px",
          background: "var(--surface)",
          borderBottom: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: 12,
            }}
          >
            The Full Collection
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2.2rem,5vw,4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
              maxWidth: 640,
            }}
          >
            Cakes Worth Celebrating
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--muted)",
              marginTop: 16,
              maxWidth: 520,
            }}
          >
            Handcrafted daily with fresh fruit, real cream, and zero shortcuts — every cake baked to order.
          </p>
          <div
            className="flex flex-wrap"
            style={{ gap: 20, marginTop: 24, fontSize: 14, color: "var(--muted)", fontFamily: "var(--font-body)" }}
          >
            <span>★★★★★ 4.8 (2,300+ orders)</span>
            <span>Baked fresh, same-day</span>
            <span>Free delivery above ₹999</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="reveal" style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex flex-wrap" style={{ gap: 12 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  height: 36,
                  padding: "0 18px",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  background: activeFilter === f ? "var(--primary)" : "var(--surface)",
                  color: activeFilter === f ? "#fff" : "var(--text)",
                  border: activeFilter === f ? "1px solid var(--primary)" : "1px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="reveal" style={{ padding: "32px 24px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: 32 }}
          >
            {products.map((p) => (
              <article
                key={p.id}
                className="group reveal"
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onClick={() =>
                    router.push(
                      `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                    )
                  }
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      transition: "transform 0.6s ease",
                      display: "block",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <FruitOverlay />
                  {/* Desktop hover View Details */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      );
                    }}
                    className="hidden md:block opacity-0 group-hover:opacity-100"
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: "5%",
                      width: "90%",
                      height: 40,
                      background: "rgba(255,255,255,0.92)",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                      transform: "translateY(10px)",
                    }}
                  >
                    View Details
                  </button>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: 18,
                      color: "var(--text)",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--muted)",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.description}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--primary)",
                      marginTop: 8,
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>

                  <div className="flex" style={{ gap: 10, marginTop: 14 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(p);
                      }}
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: added[p.id] ? "var(--accent)" : "var(--primary)",
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "transform 0.15s ease, background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {added[p.id] ? "Added ✓" : "Add to Cart"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                        );
                      }}
                      className="md:hidden"
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--primary)",
                        background: "transparent",
                        color: "var(--primary)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 56 }}>
            <button
              onClick={() => router.push("/shop")}
              style={{
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--primary)",
                background: "transparent",
                color: "var(--primary)",
                fontFamily: "var(--font-body)",
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
        </div>
      </section>

      {/* Newsletter band */}
      <section
        className="reveal"
        style={{ background: "var(--primary)", padding: "72px 24px" }}
      >
        <div
          className="flex flex-col items-center"
          style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,3vw,2.5rem)",
              color: "#fff",
            }}
          >
            Join Our Sweet Community
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.9)",
              marginTop: 16,
            }}
          >
            First taste of new flavours, seasonal drops, and festive offers — straight to your inbox.
          </p>
          <div
            className="flex flex-col sm:flex-row"
            style={{ gap: 12, marginTop: 28, width: "100%", maxWidth: 500, justifyContent: "center" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              style={{
                flex: 1,
                height: 48,
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.1)",
                padding: "0 16px",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                height: 48,
                padding: "0 28px",
                background: "#fff",
                color: "var(--primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 16,
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Subscribe
            </button>
          </div>
          {subscribed && (
            <p
              style={{
                marginTop: 16,
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Thank You for Subscribing!
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}