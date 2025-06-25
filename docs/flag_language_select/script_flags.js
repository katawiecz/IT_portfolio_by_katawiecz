let currentIndex = 0;
const sliderTrack = document.getElementById("sliderTrack");
const totalSlides = document.querySelectorAll(".step").length;

function updateSlider() {
  sliderTrack.style.transform = `translateX(-${currentIndex * 100}vw)`;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && currentIndex < totalSlides - 1) {
    currentIndex++;
    updateSlider();
  }
  if (event.key === "ArrowLeft" && currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});