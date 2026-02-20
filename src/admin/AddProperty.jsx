import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../firebase/firebaseUtils";

/* Upload multiple images to Cloudinary */
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
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Image upload failed");

    return data.secure_url;
  });

  return Promise.all(uploads);
};

export default function AddProperty() {
  const navigate = useNavigate();

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
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Handle image selection + preview */
  const handleFileChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);

    const previewUrls = list.map((file) => ({
      id: file.name + file.lastModified,
      url: URL.createObjectURL(file),
    }));

    setPreviews(previewUrls);
  };

  /* Submit form */
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }

    if (files.length > 5) {
      setError("You can upload a maximum of 5 images");
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await uploadMultipleToCloudinary(files);

      await addProperty(
        {
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          latitude: form.latitude ? Number(form.latitude) : null,
          longitude: form.longitude ? Number(form.longitude) : null,
        },
        imageUrls
      );

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>Add Property</h2>

      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
        }}
      >
        {/* LEFT SIDE – FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <input
            placeholder="Type (e.g. Apartment)"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            required
          />

          <input
            placeholder="Bedrooms"
            type="number"
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
            required
          />

          <input
            placeholder="Bathrooms"
            type="number"
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
            required
          />

          <input
            placeholder="Area (sq ft)"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />

          <input
            placeholder="Latitude"
            type="number"
            step="0.0001"
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          />

          <input
            placeholder="Longitude"
            type="number"
            step="0.0001"
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          />

          <select
            value={form.facing}
            onChange={(e) => setForm({ ...form, facing: e.target.value })}
          >
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

          <input
            placeholder="Parking (e.g. 1-2 Cars)"
            value={form.parking}
            onChange={(e) => setForm({ ...form, parking: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ minHeight: 100, fontFamily: "inherit", padding: 8, resize: "vertical" }}
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          {error && (
            <div style={{ color: "#d32f2f", fontSize: 14 }}>{error}</div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Property"}
          </button>
        </div>

        {/* RIGHT SIDE – IMAGE PREVIEW */}
        <div>
          <h4>Image Preview</h4>

          {previews.length === 0 ? (
            <div
              style={{
                border: "1px dashed #ccc",
                padding: 20,
                textAlign: "center",
                color: "#777",
              }}
            >
              No images selected
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {previews.map((p) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
