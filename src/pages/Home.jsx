import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProperties } from "../firebase/firebaseUtils";
import { isAdminUser } from "../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminUser(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: "#888" }}>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: "#d32f2f" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px", backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Hero Section */}
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: "bold",
              color: "#2c3e50",
              margin: "0 0 12px 0",
              letterSpacing: "-1px",
            }}
          >
            Premium Properties in Hyderabad
          </h1>
          <p style={{ fontSize: 16, color: "#888", margin: "0 0 20px 0" }}>
            Discover luxury real estate in the heart of Telangana
          </p>

          {/* Admin Panel Button - Only for Admins */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontWeight: "bold",
                fontSize: 14,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1976D2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2196F3")}
            >
              ⚙️ Admin Panel
            </button>
          )}
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              backgroundColor: "#f8f9fa",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 16, color: "#888", margin: 0 }}>
              No properties available at this moment. Check back soon!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

