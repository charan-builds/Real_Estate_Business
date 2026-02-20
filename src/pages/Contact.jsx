export default function Contact() {
  const phone = "+91 79013 24545";
  const phoneRaw = "+917901324545";
  const whatsappLink = `https://wa.me/${phoneRaw.replace(/\+/g, "")}?text=${encodeURIComponent("Hello SUNIL EKAM PROPERTIES")}`;

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 8 }}>Contact</h1>
      <p style={{ color: "#666", marginTop: 0 }}>We're here to help — reach out by phone or WhatsApp.</p>

      <div style={{ display: "flex", gap: 20, marginTop: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 260, background: "#fff", padding: 18, borderRadius: 8, border: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>Phone</h3>
          <p style={{ margin: 0 }}><a href={`tel:${phoneRaw}`} style={{ color: "#1a73e8", textDecoration: "none" }}>{phone}</a></p>

          <h3 style={{ marginTop: 12 }}>WhatsApp</h3>
          <p style={{ margin: 0 }}>
            <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "8px 12px", background: "#25D366", color: "white", borderRadius: 6, textDecoration: "none" }}>
              Message on WhatsApp
            </a>
          </p>

          <h3 style={{ marginTop: 12 }}>Office</h3>
          <p style={{ margin: 0, color: "#444" }}>123 Business Avenue, Financial District, Hyderabad</p>
        </div>

        <div style={{ flex: 2, minWidth: 300 }}>
          <div style={{ width: "100%", height: 320, borderRadius: 8, overflow: "hidden", border: "1px solid #eee" }}>
            <iframe
              title="Office map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent("Financial District, Hyderabad")}&output=embed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
