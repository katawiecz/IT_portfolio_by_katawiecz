/**
 * Avatar-controlled movement
 * by Katarzyna Wieczorek (2025)
 * 
 * Keyboard controls: arrow keys (⬅️⬆️➡️⬇️)
 * Automatic teleportation between sections at screen edges
 * 
 * Dependencies: HTML structure with class="step", avatar with id="avatar"
 */

// === SECTION HANDLING ===

// Current visible section index
let currentIndex = 0;

// All tree sections
const sections = document.querySelectorAll(".step");

// Show only the selected section, hide the rest
function goToSection(index) {
  if (index < 0 || index >= sections.length) return; // boundary check
  currentIndex = index;
  sections.forEach((section, i) => {
    section.classList.toggle("hidden", i !== index);
  });
  updateDebugInfo(); // update debug UI (optional)
}

// Debug display of the current section
function updateDebugInfo() {
  const sectionNames = ["Ground", "Root", "Trunk", "Left Branch", "Crown", "Sky"];
  const info = document.getElementById("debug-info");
  if (info) {
    info.textContent =
      `🌳 Current section: ${sectionNames[currentIndex] || "Unknown"} (index ${currentIndex})\n` +
      `🎭 Index type: ${typeof currentIndex}`;
  }
}

// Set the initial section (ground)
goToSection(0);
// === AVATAR MOVEMENT SETUP ===

// Avatar element and initial position
const avatar = document.getElementById("avatar");
let avatarX = 300;
let avatarY = 500;
const step = 4; // Movement step (smaller = smoother)

// === KEYBOARD HANDLING ===

// Track the state of arrow keys
const keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
};

// Listen for key press
document.addEventListener("keydown", (e) => {
  if (keys[e.key] !== undefined) keys[e.key] = true;
});

// Listen for key release
document.addEventListener("keyup", (e) => {
  if (keys[e.key] !== undefined) keys[e.key] = false;
});

// === AVATAR MOVEMENT ===

// Update the avatar's CSS position
function updateAvatarPosition() {
  avatar.style.left = `${avatarX}px`;
  avatar.style.top = `${avatarY}px`;
}

// Keep the avatar inside the viewport
function clampAvatarPosition() {
  const w = window.innerWidth - avatar.offsetWidth;
  const h = window.innerHeight - avatar.offsetHeight;
  avatarX = Math.max(0, Math.min(avatarX, w));
  avatarY = Math.max(0, Math.min(avatarY, h));
}

// === SECTION TELEPORT MAP ===

// Define where the avatar can move from each section (portal logic)
const portals = {
  0: { right: 1 },          // Ground
  1: { up: 2, left: 0 },    // Root
  2: { left: 3, down: 1 },  // Trunk
  3: { up: 4, right: 2 },   // Left Branch
  4: { right: 5, down: 3 }, // Crown
  5: { left: 4 },           // Sky
};

// Detect if the avatar touches any screen edge
function edgeHit() {
  const w = window.innerWidth - avatar.offsetWidth;
  const h = window.innerHeight - avatar.offsetHeight;

  if (avatarX >= w) return "right";
  if (avatarX <= 0) return "left";
  if (avatarY <= 0) return "up";
  if (avatarY >= h) return "down";
  return null;
}

// Handle teleportation between sections when hitting a portal edge
function checkEdgeAndGo() {
  const edge = edgeHit();
  if (!edge) return;

  const next = portals[currentIndex]?.[edge];
  if (next === undefined) return;

  console.log(`🚪 PORTAL ${edge.toUpperCase()} → section ${next}`);
  goToSection(next);

  // Reset avatar position depending on direction
  switch (edge) {
    case "right": avatarX = 0; break;
    case "left": avatarX = window.innerWidth - avatar.offsetWidth; break;
    case "up": avatarY = window.innerHeight - avatar.offsetHeight; break;
    case "down": avatarY = 0; break;
  }

  updateAvatarPosition();
}
// === GAME LOOP ===

// Repeatedly update avatar position, section teleportation, and rendering
function gameLoop() {
  if (keys.ArrowRight) avatarX += step;
  if (keys.ArrowLeft)  avatarX -= step;
  if (keys.ArrowUp)    avatarY -= step;
  if (keys.ArrowDown)  avatarY += step;

  clampAvatarPosition();     // keep within bounds
  updateAvatarPosition();    // move avatar visually
  checkEdgeAndGo();          // handle teleport if needed

  requestAnimationFrame(gameLoop); // repeat ~60 times per second
}
requestAnimationFrame(gameLoop);

const arrowButtons = document.querySelectorAll('.arrow');

document.addEventListener("keydown", e => {
  const arrow = document.querySelector(`.arrow[data-dir="${e.key}"]`);
  if (arrow) arrow.classList.add("active");
});

document.addEventListener("keyup", e => {
  const arrow = document.querySelector(`.arrow[data-dir="${e.key}"]`);
  if (arrow) arrow.classList.remove("active");
});

