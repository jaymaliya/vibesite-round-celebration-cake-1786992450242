"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type PayData = {
  upiId: string;
  orderId: string;
  amount: number;
  qrBase64?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart, removeItem, updateQuantity } = useCart() ?? {};

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<PayData | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);

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

  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  function validate() {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim() || !email.includes("@")) errs.email = "Valid email is required";
    if (!/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function payNow() {
    if (!payData) return;
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [
            {
              supportedMethods: "https://tez.google.com/pay",
              data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: "INR" },
            },
          ],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleProceedToPay() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: fullName,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch (_e) {
      setPayData({ upiId: "merchant@upi", orderId: `ORD${Date.now()}`, amount: total });
    }
  }

  async function handleConfirm() {
    if (!payData) return;
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: fullName,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map((i: any) => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "Round Celebration Cake",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart && clearCart();
    } catch (_e) {
      setPaid(true);
      clearCart && clearCart();
    } finally {
      setConfirming(false);
    }
  }

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "var(--radius-md)",
    border: `1.5px solid ${hasError ? "var(--primary)" : "color-mix(in srgb, var(--muted) 35%, transparent)"}`,
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
  });

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "6px",
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 96px" }}>
        <div className="reveal" style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
            }}
          >
            Secure Checkout
          </p>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2rem,4vw,3rem)",
              letterSpacing: "-0.02em",
              color: "var(--text)",
              lineHeight: 1.1,
            }}
          >
            Complete Your Order
          </h1>
        </div>

        {items.length === 0 ? (
          <div
            className="reveal"
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.75rem",
                color: "var(--text)",
                marginBottom: "12px",
              }}
            >
              Your bag is empty
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginBottom: "28px", fontSize: "16px" }}>
              Looks like you haven't added any celebration cakes yet.
            </p>
            <button
              onClick={() => router.push("/shop")}
              style={{
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                boxShadow: "var(--shadow-md)",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* FORM */}
            <div className="reveal">
              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  padding: "32px 28px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "var(--text)",
                    marginBottom: "24px",
                  }}
                >
                  Delivery Details
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      style={inputStyle(!!errors.fullName)}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aditi Rao"
                    />
                    {errors.fullName && (
                      <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      style={inputStyle(!!errors.email)}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditi@example.com"
                    />
                    {errors.email && (
                      <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input
                      style={inputStyle(!!errors.phone)}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>Address</label>
                    <input
                      style={inputStyle(!!errors.address)}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat, Street, Locality"
                    />
                    {errors.address && (
                      <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>City</label>
                      <input
                        style={inputStyle(!!errors.city)}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                      />
                      {errors.city && (
                        <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>State</label>
                      <input
                        style={inputStyle(!!errors.state)}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Karnataka"
                      />
                      {errors.state && (
                        <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code</label>
                      <input
                        style={inputStyle(!!errors.pin)}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="560001"
                      />
                      {errors.pin && (
                        <p style={{ color: "var(--primary)", fontSize: "12.5px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                          {errors.pin}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginTop: "28px",
                    paddingTop: "20px",
                    borderTop: "1px solid color-mix(in srgb, var(--muted) 25%, transparent)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--muted)",
                  }}
                >
                  <span>🔒 100% Secure Payment</span>
                  <span>Free delivery above ₹500</span>
                  <span>Handcrafted with fresh fruits daily</span>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="reveal">
              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  padding: "32px 28px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "var(--text)",
                    marginBottom: "24px",
                  }}
                >
                  Order Summary
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "14px",
                        paddingBottom: "18px",
                        borderBottom: "1px solid color-mix(in srgb, var(--muted) 20%, transparent)",
                      }}
                    >
                      <div style={{ overflow: "hidden", borderRadius: "var(--radius-md)", flexShrink: 0 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "76px", height: "76px", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "15px",
                            color: "var(--text)",
                            marginBottom: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "var(--primary)",
                            marginBottom: "8px",
                          }}
                        >
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid color-mix(in srgb, var(--muted) 35%, transparent)",
                              borderRadius: "var(--radius-pill)",
                            }}
                          >
                            <button
                              onClick={() => updateQuantity && updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              style={{
                                width: "28px",
                                height: "28px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "var(--text)",
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "var(--text)",
                                minWidth: "20px",
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity && updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                width: "28px",
                                height: "28px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: "var(--text)",
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem && removeItem(item.id)}
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "12.5px",
                              fontWeight: 600,
                              color: "var(--primary)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "14.5px", color: "var(--muted)" }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: "14.5px", color: "var(--muted)" }}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid color-mix(in srgb, var(--muted) 30%, transparent)",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "var(--text)",
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: "var(--primary)" }}>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPay}
                  disabled={paying}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    marginTop: "24px",
                    padding: "16px 24px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    cursor: "pointer",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    boxShadow: "var(--shadow-md)",
                    transition: "transform 0.15s ease",
                    opacity: paying ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {paying ? "Preparing Payment..." : `Proceed to Pay — ₹${total.toLocaleString("en-IN")}`}
                </button>

                <button
                  onClick={() => router.push("/shop")}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "14px 24px",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid color-mix(in srgb, var(--muted) 40%, transparent)",
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--text)",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* PAYMENT OVERLAY */}
      {payData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(58,42,34,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "var(--bg)",
              borderRadius: "20px",
              padding: "28px",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {!paid ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--text)",
                    }}
                  >
                    Round Celebration Cake
                  </span>
                  <button
                    onClick={() => {
                      setPayData(null);
                      setPaying(false);
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "2rem",
                    color: "var(--primary)",
                    marginBottom: "24px",
                  }}
                >
                  ₹{payData.amount.toLocaleString("en-IN")}
                </p>

                {isMobile ? (
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <button
                      onClick={payNow}
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: "var(--primary)",
                        color: "#fff",
                        fontWeight: 600,
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-md)",
                      }}
                    >
                      Pay ₹{payData.amount.toLocaleString("en-IN")} Now
                    </button>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)", marginTop: "12px" }}>
                      Opens Google Pay · PhonePe · Paytm
                    </p>
                    {paymentLaunched && (
                      <p
                        style={{
                          marginTop: "14px",
                          padding: "10px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--surface)",
                          color: "var(--text)",
                          fontFamily: "var(--font-body)",
                          fontSize: "13.5px",
                        }}
                      >
                        Payment app opened — confirm below
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    {payData.qrBase64 ? (
                      <img
                        src={`data:image/png;base64,${payData.qrBase64}`}
                        width={200}
                        height={200}
                        alt="UPI QR Code"
                        style={{ margin: "0 auto", borderRadius: "var(--radius-md)" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "200px",
                          height: "200px",
                          margin: "0 auto",
                          background: "var(--surface)",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          textAlign: "center",
                          padding: "16px",
                        }}
                      >
                        QR unavailable — use UPI ID {payData.upiId}
                      </div>
                    )}
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--muted)", marginTop: "12px" }}>
                      Scan with any UPI app
                    </p>
                  </div>
                )}

                <input
                  placeholder="UPI Transaction ID (optional)"
                  value={upiTxnId}
                  onChange={(e) => setUpiTxnId(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid color-mix(in srgb, var(--muted) 35%, transparent)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    marginBottom: "14px",
                    outline: "none",
                  }}
                />

                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--text)",
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    cursor: "pointer",
                    opacity: confirming ? 0.7 : 1,
                  }}
                >
                  {confirming ? "Confirming..." : "I've Paid — Confirm Order"}
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    color: "var(--text)",
                    marginBottom: "10px",
                  }}
                >
                  Order Confirmed!
                </h2>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginBottom: "6px" }}>
                  Order #{payData.orderId.slice(-8)}
                </p>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginBottom: "24px" }}>
                  We'll ship soon!
                </p>
                <button
                  onClick={() => router.push("/")}
                  style={{
                    padding: "14px 36px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}