import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isAdminUser } from "../firebase/firebaseConfig";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const navigate = useNavigate();

  const LOCATIONS = [
    "Hyderabad",
    "Financial District",
    "Gachibowli",
    "Nanakramguda",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser ? isAdminUser(currentUser.email) : false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const goToLocation = (loc) => {
    setMobileOpen(false);
    setLocationsOpen(false);
    navigate(`/locations/${encodeURIComponent(loc)}`);
  };

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #eaeaea",
        display: "flex",
        gap: 20,
        alignItems: "center",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
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
            alt="SUNIL EKAM PROPERTIES"
            style={{ height: 36 }}
          />
          <strong style={{ fontSize: 16 }}>SUNIL EKAM PROPERTIES</strong>
        </div>
      </Link>

      {/* Public Navigation (hidden when admin) */}
      {!isAdmin && (
        <>
          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 22, alignItems: "center", marginLeft: 20 }}>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
              <Link to="/properties" style={linkStyle}>
                Properties
              </Link>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setLocationsOpen((s) => !s)}
                  onMouseEnter={() => setLocationsOpen(true)}
                  onMouseLeave={() => setLocationsOpen(false)}
                  style={{ ...linkStyle, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  Locations ▾
                </button>

                {locationsOpen && (
                  <div
                    onMouseEnter={() => setLocationsOpen(true)}
                    onMouseLeave={() => setLocationsOpen(false)}
                    style={{
                      position: "absolute",
                      top: 28,
                      left: 0,
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: 6,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                      padding: 8,
                      zIndex: 40,
                      minWidth: 180,
                    }}
                  >
                    {LOCATIONS.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => goToLocation(loc)}
                        style={{ padding: "8px 10px", cursor: "pointer", color: "#333" }}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" style={linkStyle}>
                About
              </Link>
              <Link to="/contact" style={linkStyle}>
                Contact
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          {isMobile && (
            <div style={{ marginLeft: "auto" }}>
              <button
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((s) => !s)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 22, height: 2, background: "#333", margin: "4px 0" }} />
                <div style={{ width: 22, height: 2, background: "#333", margin: "4px 0" }} />
                <div style={{ width: 16, height: 2, background: "#333", margin: "4px 0" }} />
              </button>

              {mobileOpen && (
                <div style={{ position: "absolute", right: 12, top: 64, background: "#fff", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 12, width: 220, zIndex: 50 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Link to="/" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/properties" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>Properties</Link>

                    <div>
                      <button onClick={() => setLocationsOpen((s) => !s)} style={{ ...mobileLinkStyle, width: "100%", textAlign: "left", background: "none", border: "none" }}>
                        Locations ▾
                      </button>
                      {locationsOpen && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                          {LOCATIONS.map((loc) => (
                            <button key={loc} onClick={() => goToLocation(loc)} style={{ background: "none", border: "none", padding: "6px 8px", textAlign: "left", cursor: "pointer", color: "#333" }}>{loc}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link to="/about" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>About</Link>
                    <Link to="/contact" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>Contact</Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Dev-only Admin Link (development convenience) */}
      {import.meta.env.DEV && !isAdmin && (
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          <Link
            to="/admin/login"
            style={{
              textDecoration: "none",
              color: "#999999",
              fontSize: 12,
              opacity: 0.6,
            }}
          >
            [Dev: Admin]
          </Link>
        </div>
      )}

      {/* Admin Navigation */}
      {isAdmin && (
        <div style={{ display: "flex", gap: 24, alignItems: "center", marginLeft: "auto" }}>
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

const linkStyle = {
  textDecoration: "none",
  color: "#444",
  fontSize: 14,
  fontWeight: 500,
};

const mobileLinkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: 15,
  fontWeight: 500,
};
