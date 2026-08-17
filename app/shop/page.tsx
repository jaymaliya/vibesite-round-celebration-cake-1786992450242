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
              background: "#B2D2A2",
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

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* HERO — FULL_BLEED_OVERLAY */}
      <section
        className="reveal"
        style={{
          position: "relative",
          height: "92vh",
          minHeight: 560,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src="/product-1.jpg"
          alt="Fresh fruit cream cake, elevated angle, studio light"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, var(--bg) 8%, color-mix(in srgb, var(--bg) 55%, transparent) 34%, transparent 62%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "8vw",
            bottom: "8vh",
            maxWidth: 620,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 18,
            }}
          >
            Baked Fresh, Every Single Day
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "var(--text)",
            }}
          >
            Celebrate Life's<br />Sweetest Moments.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--text)",
              marginTop: 22,
              maxWidth: 440,
            }}
          >
            Real fruit, real cream, zero shortcuts — every cake built to order and delivered the same day.
          </p>
          <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={scrollToCollection}
              style={{
                height: 56,
                padding: "0 40px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.01em",
                cursor: "pointer",
                boxShadow: "var(--shadow-lg)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Order Your Cake
            </button>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                letterSpacing: "0.06em",
                color: "var(--muted)",
              }}
            >
              ★★★★★ 4.8 · 2,300+ orders
            </span>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID — HORIZONTAL_RAIL, bento-wide first card */}
      <section id="collection" className="reveal" style={{ padding: "var(--space-section) 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            The Full Collection
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              letterSpacing: "-0.02em",
              color: "var(--text)",
              maxWidth: 560,
            }}
          >
            Cakes Worth Celebrating
          </h2>

          <div className="flex flex-wrap" style={{ gap: 10, marginTop: 28 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  height: 34,
                  padding: "0 16px",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  background: activeFilter === f ? "var(--primary)" : "transparent",
                  color: activeFilter === f ? "#fff" : "var(--text)",
                  border: activeFilter === f ? "1px solid var(--primary)" : "1px solid color-mix(in srgb, var(--muted) 45%, transparent)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "36px 24px 20px",
            marginTop: 4,
          }}
        >
          {products.map((p, i) => (
            <article
              key={p.id}
              className="group reveal"
              style={{
                cursor: "pointer",
                flex: i === 0 ? "0 0 min(560px, 86vw)" : "0 0 min(300px, 78vw)",
                scrollSnapAlign: "start",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-md)",
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
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      background: "var(--accent)",
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
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
                    background: "rgba(255,255,255,0.94)",
                    color: "var(--primary)",
                    border: "1px solid var(--primary)",
                    borderRadius: "var(--radius-sm)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 13,
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
                    fontSize: i === 0 ? 22 : 17,
                    color: "var(--text)",
                  }}
                >
                  {p.name}
                </h3>
                {i === 0 && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13.5,
                      color: "var(--muted)",
                      marginTop: 6,
                      lineHeight: 1.6,
                      maxWidth: 420,
                    }}
                  >
                    {p.description}
                  </p>
                )}
                <div className="flex items-center" style={{ gap: 12, marginTop: 10 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: i === 0 ? 22 : 17,
                      color: "var(--accent)",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    ★ 4.8
                  </span>
                </div>

                <div className="flex" style={{ gap: 10, marginTop: 14 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(p);
                    }}
                    style={{
                      flex: 1,
                      height: 46,
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      background: added[p.id] ? "var(--accent)" : "var(--primary)",
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
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
                      height: 46,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--primary)",
                      background: "transparent",
                      color: "var(--primary)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* STORY_SPLIT — ASYMMETRIC_SPLIT 60/40, image bleeding, text offset */}
      <section className="reveal" style={{ padding: "var(--space-section) 0" }}>
        <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr]" style={{ alignItems: "center" }}>
          <div style={{ overflow: "hidden", height: "100%" }}>
            <img
              src="/product-2.jpg"
              alt="Red velvet layer cake, close crop of crimson layers"
              style={{
                width: "100%",
                height: "100%",
                minHeight: 380,
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div
            style={{
              padding: "48px 8vw 48px 48px",
              transform: "translateY(-32px)",
              background: "var(--bg)",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 14,
              }}
            >
              Our Story
            </p>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem,3vw,2.8rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                color: "var(--text)",
              }}
            >
              From one home kitchen to a citywide obsession.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.75,
                color: "var(--muted)",
                marginTop: 20,
                maxWidth: 440,
              }}
            >
              We started with one recipe and a wood-fired oven. Today every cake still leaves our kitchen the same way — sliced fruit by hand, cream whipped to order, nothing pre-made, nothing frozen.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                marginTop: 28,
                height: 46,
                padding: "0 28px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--primary)",
                background: "transparent",
                color: "var(--primary)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              See the Range
            </button>
          </div>
        </div>
      </section>

      {/* INGREDIENT_CLOSEUP — OVERLAP_BREAKOUT */}
      <section className="reveal" style={{ background: "var(--surface)", padding: "80px 24px 130px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            Ingredient Closeup
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              letterSpacing: "-0.02em",
              color: "#F7F4EF",
              maxWidth: 560,
            }}
          >
            Ganache poured slow. Fruit sliced fresh.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.75,
              color: "color-mix(in srgb, var(--bg) 65%, transparent)",
              marginTop: 18,
              maxWidth: 480,
            }}
          >
            No shortcuts in the process — glossy drips set by hand, layers cooled to the exact minute before the next goes on.
          </p>
        </div>
      </section>
      <div
        className="reveal"
        style={{
          maxWidth: 960,
          margin: "-96px auto 0",
          padding: "0 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ overflow: "hidden", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-xl)" }}>
          <img
            src="/product-3.jpg"
            alt="Chocolate ganache drip cake, close texture detail"
            style={{ width: "100%", aspectRatio: "16/7", objectFit: "cover", transition: "transform 0.7s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </div>

      {/* FEATURE_TRIO — BENTO_MOSAIC */}
      <section className="reveal" style={{ padding: "96px 24px var(--space-section)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ gap: 16, gridAutoRows: 200 }}
          >
            <div
              className="col-span-2"
              style={{
                gridColumn: "span 2",
                gridRow: "span 2",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <img
                src="/product-4.jpg"
                alt="Caramel praline drip cake with chopped nuts"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "20px",
                  background: "linear-gradient(to top, rgba(15,15,15,0.55), transparent)",
                }}
              >
                <span style={{ fontFamily: "var(--font-body)", color: "#fff", fontWeight: 700, fontSize: 15 }}>
                  Caramel Praline Drip
                </span>
              </div>
            </div>

            <div
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--primary)",
                color: "#fff",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 36 }}>4.8★</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginTop: 6,
                }}
              >
                2,300+ Reviews
              </span>
            </div>

            <div
              style={{
                borderRadius: "var(--radius-lg)",
                background: "var(--surface)",
                color: "#fff",
                padding: 24,
                display: "flex",
                alignItems: "center",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: 18, lineHeight: 1.4 }}>
                "Every cake tastes homemade — because it basically is."
              </p>
            </div>

            <div
              className="col-span-2 md:col-span-2"
              style={{
                gridColumn: "span 2",
                borderRadius: "var(--radius-lg)",
                background: "var(--accent)",
                color: "#fff",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 6,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16 }}>Made in India</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, opacity: 0.9 }}>Free delivery above ₹999 · Same-day baking</span>
            </div>
          </div>
        </div>
      </section>

      {/* CROWD_FAVOURITES — HORIZONTAL_RAIL */}
      <section className="reveal" style={{ padding: "0 0 var(--space-section)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 10,
            }}
          >
            Crowd Favourites
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            What everyone reorders
          </h2>
        </div>
        <div
          className="no-scrollbar"
          style={{ display: "flex", gap: 20, overflowX: "auto", padding: "28px 24px 8px", scrollSnapType: "x mandatory" }}
        >
          {products.map((p) => (
            <div
              key={`fav-${p.id}`}
              onClick={() =>
                router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)
              }
              style={{
                flex: "0 0 220px",
                scrollSnapAlign: "start",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--surface)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <div style={{ padding: "14px 14px 18px" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 14, color: "#fff" }}>{p.name}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.06em", color: "var(--muted)", marginTop: 4 }}>
                  ★ 4.8 · ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER — asymmetric FULL_BLEED_BAND */}
      <section className="reveal" style={{ background: "var(--primary)", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            right: "-10%",
            top: "-30%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--accent) 35%, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "8%",
            bottom: "-20%",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--surface) 70%, transparent)",
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: 520,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 14,
            }}
          >
            Stay Sweet
          </p>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,3.2vw,2.8rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "#F7F4EF",
            }}
          >
            First to know about seasonal flavours & drops.
          </h2>
          {subscribed ? (
            <p style={{ fontFamily: "var(--font-body)", color: "var(--accent)", marginTop: 24, fontSize: 15 }}>
              You're on the list — thank you!
            </p>
          ) : (
            <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", width: "100%" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{
                  flex: "1 1 240px",
                  height: 52,
                  padding: "0 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid color-mix(in srgb, var(--bg) 40%, transparent)",
                  background: "transparent",
                  color: "#F7F4EF",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubscribe}
                style={{
                  height: 52,
                  padding: "0 30px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 14,
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}