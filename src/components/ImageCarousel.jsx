import { useState, useEffect } from "react";

export default function ImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (idx) => {
    setCurrentIndex(idx);
  };

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: 16,
        }}
      >
        No images available
      </div>
    );
  }

  const hasPrevNext = images.length > 1;

  return (
    <div style={{ width: "100%", marginBottom: 40 }}>
      {/* MAIN IMAGE CONTAINER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          borderRadius: 12,
          backgroundColor: "#f5f5f5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* IMAGE */}
        <img
          src={images[currentIndex]}
          alt={`Property view ${currentIndex + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1,
            transition: "opacity 0.4s ease-in-out",
          }}
        />

        {/* LEFT ARROW */}
        {hasPrevNext && (
          <button
            onClick={goToPrevious}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "none",
              color: "white",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              transition: "background-color 0.3s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
          >
            ❮
          </button>
        )}

        {/* RIGHT ARROW */}
        {hasPrevNext && (
          <button
            onClick={goToNext}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "none",
              color: "white",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              transition: "background-color 0.3s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
          >
            ❯
          </button>
        )}

        {/* IMAGE COUNTER */}
        {hasPrevNext && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* DOTS INDICATOR */}
      {hasPrevNext && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToImage(idx)}
              aria-label={`Go to image ${idx + 1}`}
              style={{
                width: currentIndex === idx ? 28 : 10,
                height: 10,
                borderRadius: 5,
                border: "none",
                backgroundColor: currentIndex === idx ? "#2196F3" : "#d0d0d0",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
