export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: 60,
        padding: "40px 24px",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e0e0e0",
        color: "#555555",
      }}
    >
      
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 40,
        }}
      >
        {/* Company Info */}
        <div>
              <img
  src="https://res.cloudinary.com/ddutqytdx/image/upload/v1771574795/Signature_Presents_h4l1yx.jpg"
  alt="Signature Presents"
  style={{ height: 40, marginBottom: 8 }}
/>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#2c3e50", marginBottom: 16 }}>

            SUNIL EKAM PROPERTIES
          </div>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: 14 }}>
            Premium real estate services in Hyderabad
          </p>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 }}>
            CONTACT
          </div>
          <p style={{ margin: "0 0 8px 0", fontSize: 14 }}>
            <strong>Phone:</strong>{" "}
            <a href="tel:+917901324545" style={{ color: "#3498db", textDecoration: "none" }}>
              +91 7901324545
            </a>
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@sunilekam.com" style={{ color: "#3498db", textDecoration: "none" }}>
              info@sunilekam.com
            </a>
          </p>
        </div>

        {/* Address */}
        <div>
          <div style={{ fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 }}>
            ADDRESS
          </div>
          <p style={{ margin: 0, lineHeight: 1.6, fontSize: 13 }}>
            9-24/9D, 9th Floor
            <br />
            Vaishnavi's Cymbol
            <br />
            Financial District Circle
            <br />
            Nanakramguda, Hyderabad
            <br />
            Telangana - 500032
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          fontSize: 13,
          color: "#888888",
        }}
      >
        © {currentYear} SUNIL EKAM PROPERTIES. All rights reserved.
      </div>

      {/* Subtle Admin Link - Low visibility for authorized users only */}
      <div
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 12,
        }}
      >
        <a
          href="/admin/login"
          style={{
            color: "#cccccc",
            textDecoration: "none",
            opacity: 0.5,
            transition: "opacity 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "0.5")}
        >
          Admin
        </a>
      </div>
    </footer>
  );
}
