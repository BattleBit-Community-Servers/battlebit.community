// JavaScript for smoother scrolling
const sections = document.querySelectorAll(".snap-section");

// Add a scroll event listener to detect wheel scrolling
window.addEventListener("wheel", (event) => {
  const currentIndex = [...sections].findIndex((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  });

  if (event.deltaY > 0 && currentIndex < sections.length - 1) {
    // Scroll down
    sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
  } else if (event.deltaY < 0 && currentIndex > 0) {
    // Scroll up
    sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
  }
});
