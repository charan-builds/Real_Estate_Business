import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isAdminUser } from "../firebase/firebaseConfig";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser ? isAdminUser(currentUser.email) : false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        gap: 32,
        alignItems: "center",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Logo and Company Name */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          textDecoration: "none",
          color: "#1a1a1a",
        }}
      >
       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <img
    src="https://res.cloudinary.com/ddutqytdx/image/upload/v1771574795/Signature_Presents_h4l1yx.jpg"
    alt="Signature Presents"
    style={{ height: 36 }}
  />
  <strong>SUNIL EKAM PROPERTIES</strong>
</div>
      </Link>

      {/* Public Navigation */}
      {!isAdmin && (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#555555",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          <a
            href="tel:+917901324545"
            style={{
              textDecoration: "none",
              color: "#555555",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Contact
          </a>
        </div>
      )}

      {/* Admin Navigation */}
      {isAdmin && (
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link
            to="/admin/dashboard"
            style={{
              textDecoration: "none",
              color: "#555555",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Admin Panel
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Logout
          </button>
          
        </div>

      )}
      
    </nav>
    
  );
}
