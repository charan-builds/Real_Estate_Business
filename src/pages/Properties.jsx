import { useEffect, useState } from "react";
import { getProperties } from "../firebase/firebaseUtils";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const list = await getProperties();
        if (mounted) setProperties(list);
      } catch (err) {
        console.error(err);
        if (mounted) setProperties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "28px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 8, color: "#222" }}>Properties</h1>
      <p style={{ marginTop: 0, color: "#666" }}>Browse available listings.</p>

      {loading && <p>Loading properties…</p>}

      {!loading && properties && properties.length === 0 && (
        <div style={{ padding: 28, background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>No properties found</h3>
          <p style={{ margin: 0, color: "#666" }}>There are currently no properties listed. Please check back later.</p>
        </div>
      )}

      {!loading && properties && properties.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 16,
          }}
        >
          {properties.map((p) => (
            <div key={p.id} style={{ height: "100%" }}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
