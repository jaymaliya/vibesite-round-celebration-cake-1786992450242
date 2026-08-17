"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [badgeBump, setBadgeBump] = React.useState(false);
  const prevTotal = React.useRef(totalItems);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (totalItems !== prevTotal.current) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 400);
      prevTotal.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  function goToSection(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function go(path: string) {
    setMenuOpen(false);
    router.push(path);
  }

  const navBg = scrolled || menuOpen ? "var(--bg)" : "transparent";
  const navShadow = scrolled ? "var(--shadow-sm)" : "none";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: navBg,
        boxShadow: navShadow,
        transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <button
          onClick={() => go("/")}
          className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: "var(--primary)" }}
          aria-label="Round Celebration Cake home"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="var(--accent)" />
            <path d="M9 18c1.5-3 5-3 7-1s5 2 7-1" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="12" cy="12" r="1.6" fill="var(--primary)" />
            <circle cx="20" cy="12" r="1.6" fill="var(--text)" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              fontWeight: 700,
              fontSize: "20px",
              letterSpacing: "-0.01em",
            }}
          >
            Round Celebration Cake
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => go("/shop")}
            className="text-[15px] font-semibold transition-colors hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            Cakes
          </button>
          <button
            onClick={() => go("/shop")}
            className="text-[15px] font-semibold transition-colors hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            Desserts
          </button>
          <button
            onClick={() => goToSection("about")}
            className="text-[15px] font-semibold transition-colors hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            Our Story
          </button>
          <button
            onClick={() => goToSection("about")}
            className="text-[15px] font-semibold transition-colors hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
          >
            Gifts
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/checkout")}
            className="relative flex items-center justify-center rounded-full p-2 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ transition: "opacity 0.2s ease, transform 0.2s ease" }}
            aria-label="Go to checkout"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 4h2l1.4 10.2A2 2 0 0 0 8.4 16H18a2 2 0 0 0 2-1.7L21 8H6"
                stroke="var(--text)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="9" cy="20" r="1.4" fill="var(--text)" />
              <circle cx="17" cy="20" r="1.4" fill="var(--text)" />
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute -right-1 -top-1 flex items-center justify-center rounded-full"
                style={{
                  width: "18px",
                  height: "18px",
                  backgroundColor: "var(--muted)",
                  color: "var(--bg)",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  transform: badgeBump ? "scale(1.25)" : "scale(1)",
                  transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center justify-center rounded-md p-2 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
            style={{ color: "var(--text)", transition: "transform 0.2s ease" }}
            aria-label="Toggle menu"
          >
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 top-[64px] z-40 flex flex-col gap-2 px-6 py-8 md:hidden"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <button
            onClick={() => go("/shop")}
            className="rounded-md px-4 py-4 text-left text-lg font-semibold hover:bg-[var(--surface)] active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, transform 0.2s ease" }}
          >
            Cakes
          </button>
          <button
            onClick={() => go("/shop")}
            className="rounded-md px-4 py-4 text-left text-lg font-semibold hover:bg-[var(--surface)] active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, transform 0.2s ease" }}
          >
            Desserts
          </button>
          <button
            onClick={() => goToSection("about")}
            className="rounded-md px-4 py-4 text-left text-lg font-semibold hover:bg-[var(--surface)] active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, transform 0.2s ease" }}
          >
            Our Story
          </button>
          <button
            onClick={() => goToSection("about")}
            className="rounded-md px-4 py-4 text-left text-lg font-semibold hover:bg-[var(--surface)] active:scale-95"
            style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, transform 0.2s ease" }}
          >
            Gifts
          </button>
        </div>
      )}
    </header>
  );
}