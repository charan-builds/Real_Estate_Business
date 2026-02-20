import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperties } from "../firebase/firebaseUtils";
import PropertyCard from "../components/PropertyCard";

export default function Location() {
  const { location } = useParams();
  const displayLocation = decodeURIComponent(location || "");
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const all = await getProperties();
        // Filter by location text - case insensitive contains
        const filtered = all.filter((p) => {
          if (!p.location) return false;
          return p.location.toLowerCase().includes(displayLocation.toLowerCase());
        });
        if (mounted) setProperties(filtered);
      } catch (err) {
        console.error(err);
        if (mounted) setProperties([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [displayLocation]);

  return (
    <div style={{ maxWidth: 1100, margin: "28px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 8, color: "#222" }}>Properties in {displayLocation}</h1>
      <p style={{ marginTop: 0, color: "#666" }}>Showing listings for {displayLocation}.</p>

      {loading && <p>Loading properties…</p>}

      {!loading && properties && properties.length === 0 && (
        <div style={{ padding: 28, background: "#fff", borderRadius: 8, border: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>No properties found in {displayLocation}</h3>
          <p style={{ margin: 0, color: "#666" }}>Try a different location or check back later.</p>
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
