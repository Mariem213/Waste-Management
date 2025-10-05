/* ===================================================================== */
/* ===================== Reward ==================== */
const userCoins = document.getElementById("userCoins");
const badgesSection = document.getElementById("badgesSection");
const certificateSection = document.getElementById("certificateSection");

let user = JSON.parse(localStorage.getItem("user")) || {};
let coins = user.coins || 0;
userCoins.textContent = coins;

const badges = [
    { name: "Starter Recycler", min: 10, icon: '<i class="fa-solid fa-medal bronze"></i>' },
    { name: "Eco Contributor", min: 50, icon: '<i class="fa-solid fa-medal silver"></i>' },
    { name: "Green Guardian", min: 100, icon: '<i class="fa-solid fa-medal gold"></i>' },
    { name: "Environmental Hero", min: 200, icon: '<i class="fa-solid fa-medal green"></i>' },
];

badgesSection.innerHTML = ""; // clear existing badges

badges.forEach(badge => {
    const div = document.createElement("div");
    div.classList.add("badge-card");

    const unlocked = coins >= badge.min;

    div.innerHTML = `
        <div class="medal-icon">${badge.icon}</div>
        <div>
            <h5>${badge.name}</h5>
            <p class="${unlocked ? 'text-success fw-semibold' : 'text-muted'}">
            ${unlocked ? `✅ Unlocked (${badge.min}+ coins)` : `🔒 Locked — needs ${badge.min} coins`}
            </p>
        </div>
    `;

    if (!unlocked) div.style.opacity = "0.5";
    badgesSection.appendChild(div);
});

if (coins >= 100) {
    certificateSection.classList.remove("d-none");
}
