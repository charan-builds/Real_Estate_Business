import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../firebase/firebaseUtils";

// 🔥 Upload multiple images to Cloudinary
const uploadMultipleToCloudinary = async (files) => {
  const uploads = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    return data.secure_url;
  });

  return Promise.all(uploads);
};

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    latitude: "",
    longitude: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    facing: "",
    parking: "",
    description: "",
    images: [],
  });

  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    if (!id) {
      setError("Invalid property ID");
      setLoading(false);
      return;
    }

    const loadProperty = async () => {
      try {
        const p = await getPropertyById(id);
        if (!p) {
          setError("Property not found");
        } else {
          setForm({
            title: p.title || "",
            price: p.price || "",
            location: p.location || "",
            latitude: p.latitude || "",
            longitude: p.longitude || "",
            type: p.type || "",
            bedrooms: p.bedrooms || "",
            bathrooms: p.bathrooms || "",
            area: p.area || "",
            facing: p.facing || "",
            parking: p.parking || "",
            description: p.description || "",
            images: p.images || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleNewFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setNewFiles(list);
    const urls = list.map((f) => ({ id: f.name + Date.now(), url: URL.createObjectURL(f) }));
    setNewPreviews(urls);
  };

  const removeExistingImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let images = form.images || [];

      // If new files uploaded, upload and append to existing
      if (newFiles.length > 0) {
        if (newFiles.length > 5) {
          setError("You can upload a maximum of 5 images at a time");
          setSaving(false);
          return;
        }
        const uploaded = await uploadMultipleToCloudinary(newFiles);
        images = images.concat(uploaded);
      }

      await updateProperty(
        id,
        {
          title: form.title,
          price: Number(form.price),
          location: form.location,
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
          type: form.type,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          area: form.area,
          facing: form.facing,
          parking: form.parking,
          description: form.description,
        },
        images.length ? images : null
      );

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 12 }}>Loading property...</div>;
  }

  if (error) {
    return <div style={{ padding: 12 }}>{error}</div>;
  }

  return (
    <div style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16, color: "#2c3e50" }}>Edit Property</h2>

      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Title</label>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label style={{ fontSize: 13, color: "#555" }}>Price (₹)</label>
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />

          <label style={{ fontSize: 13, color: "#555" }}>Location</label>
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />

          <label style={{ fontSize: 13, color: "#555" }}>Latitude</label>
          <input placeholder="Latitude" type="number" step="0.0001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />

          <label style={{ fontSize: 13, color: "#555" }}>Longitude</label>
          <input placeholder="Longitude" type="number" step="0.0001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, color: "#555" }}>Type</label>
              <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            </div>
            <div style={{ width: 120 }}>
              <label style={{ fontSize: 13, color: "#555" }}>Bedrooms</label>
              <input placeholder="Beds" type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            </div>
            <div style={{ width: 120 }}>
              <label style={{ fontSize: 13, color: "#555" }}>Bathrooms</label>
              <input placeholder="Baths" type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            </div>
          </div>

          <label style={{ fontSize: 13, color: "#555" }}>Area (sq ft)</label>
          <input placeholder="Area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />

          <label style={{ fontSize: 13, color: "#555" }}>Facing</label>
          <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })}>
            <option value="">Select Facing</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
            <option value="North-East">North-East</option>
            <option value="North-West">North-West</option>
            <option value="South-East">South-East</option>
            <option value="South-West">South-West</option>
          </select>

          <label style={{ fontSize: 13, color: "#555" }}>Parking</label>
          <input placeholder="Parking (e.g. 1-2 Cars)" value={form.parking} onChange={(e) => setForm({ ...form, parking: e.target.value })} />

          <label style={{ fontSize: 13, color: "#555" }}>Description</label>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: 100, fontFamily: "inherit", padding: 8, resize: "vertical" }} />

          {error && <div style={{ color: "#d32f2f" }}>{error}</div>}

          <div>
            <button type="submit" disabled={saving} style={{ padding: "10px 16px", backgroundColor: "#2c3e50", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>

        {/* Right column: existing images + new uploads */}
        <div>
          <label style={{ fontSize: 13, color: "#555" }}>Existing Images</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 8 }}>
            {form.images && form.images.length === 0 && (
              <div style={{ padding: 12, background: "#f8f9fa", borderRadius: 6 }}>No images</div>
            )}
            {form.images && form.images.map((img, idx) => (
              <div key={idx} style={{ position: "relative", height: 100, borderRadius: 6, overflow: "hidden", border: "1px solid #e8e8e8" }}>
                <img src={img} alt={`img-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" onClick={() => removeExistingImage(idx)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: 4, padding: "4px 6px", cursor: "pointer" }}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, color: "#555" }}>Upload New Images (optional)</label>
            <input type="file" accept="image/*" multiple onChange={handleNewFiles} />

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {newPreviews.map((p) => (
                <div key={p.id} style={{ width: 100, height: 70, overflow: "hidden", borderRadius: 6 }}>
                  <img src={p.url} alt="new" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
