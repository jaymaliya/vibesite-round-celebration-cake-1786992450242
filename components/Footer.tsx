"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer style={{ backgroundColor: "var(--bg)", color: "var(--text)" }} className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span
              style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700 }}
            >
              Round Celebration Cake
            </span>
            <p
              style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "15px", lineHeight: 1.6 }}
            >
              Fresh fruit, pristine cream, wholesome celebration — baked for every joyful moment.
            </p>
            <a
              href="mailto:maliyajay77@gmail.com"
              className="w-fit text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--primary)", fontFamily: "var(--font-body)" }}
            >
              Contact Us
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "16px" }}>
              Quick Links
            </span>
            <button
              onClick={() => router.push("/")}
              className="w-fit text-left text-[15px] hover:opacity-70 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
            >
              Home
            </button>
            <button
              onClick={() => router.push("/shop")}
              className="w-fit text-left text-[15px] hover:opacity-70 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--text)", fontFamily: "var(--font-body)", transition: "opacity 0.2s ease, transform 0.2s ease" }}
            >
              Shop
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "16px" }}>
              Follow Us
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ transition: "opacity 0.2s ease" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--text)" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" stroke="var(--text)" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="var(--text)" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ transition: "opacity 0.2s ease" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 5.5c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.6-2.1c-.7.4-1.5.8-2.4.9a3.8 3.8 0 0 0-6.5 3.5A10.8 10.8 0 0 1 3.6 4.4a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.8-.6.1-1.1.2-1.7.1a3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 2 17.3a10.8 10.8 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.7-.5 1.3-1.2 1.8-2z"
                    stroke="var(--text)"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </svg>
              </a>
              <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ transition: "opacity 0.2s ease" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 12a8 8 0 1 1-14.6-4.6L4 20l4.8-1.3A8 8 0 0 1 20 12z"
                    stroke="var(--text)"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 9.5c0 3 2.5 5.5 5.5 5.5.4 0 .8-.3.7-.7l-.3-1.1a.7.7 0 0 0-.7-.5h-.9a3.6 3.6 0 0 1-2.5-2.5v-.9a.7.7 0 0 0-.5-.7l-1.1-.3c-.4-.1-.7.3-.7.7z"
                    fill="var(--text)"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "16px" }}>
              Stay Sweet
            </span>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "14px" }}>
              Subscribe for fresh offers &amp; new flavors.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-md px-4 py-2 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  border: "1px solid #8C7A6B33",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-md px-4 py-2 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--bg)",
                  fontFamily: "var(--font-body)",
                  transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
                }}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
              {status === "success" && (
                <span style={{ color: "var(--text)", fontSize: "13px", fontFamily: "var(--font-body)" }}>
                  Thanks! We&apos;ll be in touch.
                </span>
              )}
              {status === "error" && (
                <span style={{ color: "var(--primary)", fontSize: "13px", fontFamily: "var(--font-body)" }}>
                  Something went wrong. Try again.
                </span>
              )}
            </form>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-6 text-center text-sm"
          style={{ borderColor: "#8C7A6B33", color: "var(--muted)", fontFamily: "var(--font-body)" }}
        >
          © {new Date().getFullYear()} Round Celebration Cake. All rights reserved.
        </div>
      </div>
    </footer>
  );
}