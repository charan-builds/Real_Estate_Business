import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProperties, deleteProperty } from "../firebase/firebaseUtils";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const loadProperties = async () => {
    try {
      setLoading(true);
      const list = await getProperties();
      setProperties(list || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this property?");
    if (!ok) return;
    setActionLoading(true);
    try {
      await deleteProperty(id);
      await loadProperties();
    } catch (err) {
      console.error(err);
      setError("Failed to delete property");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ color: "#666" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, color: "#2c3e50" }}>Admin Dashboard</h2>
        <div>
          <button
            onClick={() => navigate("/admin/add")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Add Property
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, color: "#d32f2f" }}>{error}</div>
      )}

      {properties.length === 0 ? (
        <div style={{ padding: 24, background: "#f8f9fa", borderRadius: 8 }}>
          <p style={{ margin: 0, color: "#666" }}>No properties added yet.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {properties.map((p) => {
            const cover = (p.images && p.images.length > 0) ? p.images[0] : null;
            return (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                <div style={{ height: 180, background: "#f5f5f5" }}>
                  {cover ? (
                    <img src={cover} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>No Image</div>
                  )}
                </div>

                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#2c3e50" }}>{p.title || "Untitled"}</h3>
                  <p style={{ margin: "8px 0", color: "#666" }}>{p.location || "Unknown location"}</p>
                  <p style={{ margin: 0, fontWeight: 700, color: "#e74c3c" }}>₹{(p.price || 0).toLocaleString("en-IN")}</p>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => navigate(`/admin/edit/${p.id}`)}
                      style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", background: "white", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={actionLoading}
                      style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#e74c3c", color: "white", cursor: "pointer" }}
                    >
                      {actionLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

