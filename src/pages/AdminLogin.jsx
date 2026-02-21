import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAILS = ["charanderangula007@gmail.com",
  "ekampropertiess@gmail.com"]; // same list

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!ADMIN_EMAILS.includes(res.user.email)) {
        setError("You are not authorized to access the admin panel.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
<div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}></div>
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          width: 360,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <img
  src="https://res.cloudinary.com/ddutqytdx/image/upload/v1771574795/Signature_Presents_h4l1yx.jpg"
  alt="Signature Presents"
  style={{
    width: 140,
    display: "block",
    margin: "0 auto 16px",
  }}
/>
        <h2 style={{ marginBottom: 8 }}>Admin Login</h2>
        <p style={{ marginBottom: 16, color: "#555" }}>
          SUNIL EKAM PROPERTIES
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        {error && (
          <div style={{ color: "#d32f2f", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}