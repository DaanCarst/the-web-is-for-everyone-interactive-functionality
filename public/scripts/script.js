const details = document.querySelectorAll("details");

// Add the onclick listeners.
details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    // Close all the details that are not targetDetail.
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
    current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
  });
});

function scrollFunction() {
  const element = document.getElementById("info");
  element.scrollIntoView({behavior: "smooth"});
}