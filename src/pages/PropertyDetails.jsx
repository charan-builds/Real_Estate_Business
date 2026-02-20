import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../firebase/firebaseUtils";
import ImageCarousel from "../components/ImageCarousel";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getPropertyById(id)
      .then((prop) => {
        setProperty(prop);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px 24px", textAlign: "center" }}>Loading...</div>;
  }

  if (!property) {
    return <div style={{ padding: "40px 24px", textAlign: "center" }}>Property not found</div>;
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* IMAGE CAROUSEL */}
      <ImageCarousel images={property.images || []} />

      {/* MAIN INFO */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>{property.title}</h1>
        <div style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
          📍 {property.location}
        </div>

        <h2 style={{ fontSize: 28, color: "#2196F3", marginBottom: 24 }}>
          ₹ {property.price?.toLocaleString?.() || property.price}
        </h2>
      </div>

      {/* SPECS GRID */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 16 }}>Property Specifications</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 16,
          }}
        >
          {/* BEDROOMS */}
          {property.bedrooms && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Bedrooms</div>
              <div style={{ fontSize: 24, fontWeight: "bold" }}>{property.bedrooms}</div>
            </div>
          )}

          {/* BATHROOMS */}
          {property.bathrooms && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Bathrooms</div>
              <div style={{ fontSize: 24, fontWeight: "bold" }}>{property.bathrooms}</div>
            </div>
          )}

          {/* AREA */}
          {property.area && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Area</div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>{property.area}</div>
            </div>
          )}

          {/* FACING */}
          {property.facing && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Facing</div>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>{property.facing}</div>
            </div>
          )}

          {/* PARKING */}
          {property.parking && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Parking</div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>{property.parking}</div>
            </div>
          )}

          {/* TYPE */}
          {property.type && (
            <div
              style={{
                border: "1px solid #eee",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Type</div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>{property.type}</div>
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      {property.description && (
        <div style={{ marginBottom: 40 }}>
          <h3 style={{ marginBottom: 12 }}>About This Property</h3>
          <p style={{ lineHeight: 1.6, color: "#444" }}>{property.description}</p>
        </div>
      )}

      {/* CONTACT & ENQUIRY */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: 24,
          borderRadius: 12,
          marginBottom: 40,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Interested in this property?</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* CALL BUTTON */}
          <a
            href={`tel:+917901324545`}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2196F3",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📞 Call Now
          </a>

          {/* WHATSAPP BUTTON */}
          <a
            href={`https://wa.me/917901324545?text=Hi, I am interested in this property: ${property.title}. Price: ₹${property.price}. Location: ${property.location}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 24px",
              backgroundColor: "#25D366",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            💬 Send WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
