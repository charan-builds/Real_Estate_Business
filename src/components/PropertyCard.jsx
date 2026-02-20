import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    id,
    title = "Untitled Property",
    location = "Unknown location",
    price = 0,
    images = [],
  } = property;

  const coverImage = images[0]; // first image as cover

  return (
    <Link
      to={`/property/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          backgroundColor: "#ffffff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.12)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            style={{
              width: "100%",
              height: 240,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 240,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 14,
            }}
          >
            No Image Available
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: 18,
              fontWeight: 600,
              color: "#2c3e50",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: 14,
              color: "#888",
            }}
          >
            {location}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: "bold",
              color: "#e74c3c",
            }}
          >
            ₹{price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
}
