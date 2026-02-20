import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";

const ADMIN_EMAILS = [
  "charanderangula007@gmail.com"
];

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return null;

  // 🔐 NOT logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🔐 Logged in but NOT admin
  if (!ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
