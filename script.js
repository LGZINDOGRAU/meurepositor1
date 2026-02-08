const som = document.getElementById("hoverSound");

document.querySelectorAll("[data-sound]").forEach(card => {
    card.addEventListener("mouseenter", () => {
        som.currentTime = 0;
        som.play();
    });
});

