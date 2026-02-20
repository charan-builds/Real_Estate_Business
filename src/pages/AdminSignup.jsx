import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, isAdminUser, ADMIN_EMAILS } from "../firebase/firebaseConfig";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminUser(user.email)) {
        navigate("/admin/dashboard", { replace: true });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if email is in admin whitelist
    if (!isAdminUser(email)) {
      setError(`This email is not authorized. Admin emails: ${ADMIN_EMAILS.join(", ")}`);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  if (loading) return <div style={{ padding: 12 }}>Loading...</div>;

  return (
    <div style={{ padding: 12 }}>
      <h2>Admin Signup</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}
      >
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
        {error && <div style={{ color: "red", fontSize: 12 }}>{error}</div>}
      </form>
      <p style={{ fontSize: 12, marginTop: 12, color: "#666" }}>
        Already have an account? <Link to="/admin/login">Login</Link>
      </p>
    </div>
  );
}
