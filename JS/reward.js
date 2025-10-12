/* ===================== Reward System ===================== */
const userCoins = document.getElementById("userCoins");
const userBags = document.getElementById("userBags");
const shopItems = document.getElementById("shopItems");
const offersContainer = document.getElementById("offersContainer");

// Get user data
let user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", coins: 100, bags: 0 };
let coins = user.coins;
let bags = user.bags;

// Display initial data
function displayUserInfo() {
    userCoins.textContent = coins;
    userBags.textContent = bags;
}

// Update local storage
function updateUserData() {
    user.coins = coins;
    user.bags = bags;
    localStorage.setItem("user", JSON.stringify(user));
    displayUserInfo();
}

// Shop Items
const bagsList = [
    { name: "Small Bag", price: 20, icon: "fa-bag-shopping" },
    { name: "Medium Bag", price: 40, icon: "fa-shopping-bag" },
    { name: "Large Bag", price: 70, icon: "fa-suitcase-rolling" }
];

// Render Shop
function displayShop() {
    shopItems.innerHTML = "";
    bagsList.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("bag-card");
        div.innerHTML = `
        <div class="bag-info">
            <h5><i class="fa-solid ${item.icon}"></i> ${item.name}</h5>
            <p class="text-muted">Price: ${item.price} coins</p>
        </div>
        <button class="btn-buy" onclick="buyBag(${item.price})">Buy</button>
    `;
        shopItems.appendChild(div);
    });
}

// Buy Bag
function buyBag(price) {
    if (coins >= price) {
        coins -= price;
        bags += 1;
        updateUserData();
        alert("✅ Purchase successful! You got a new bag!");
    } else {
        alert("❌ Not enough coins!");
    }
}

// Offers
const offers = [
    { name: "50% Off Small Bag", desc: "Buy a Small Bag for only 10 coins!", price: 10, expires: "2025-10-15T23:59:59" },
    { name: "Buy 2 Get 1 Free", desc: "Buy 2 Medium Bags and get 1 free!", type: "bundle", expires: "2025-10-14T20:00:00" }
];

// Render Offers + Countdown Timer
function displayOffers() {
    offersContainer.innerHTML = "";
    offers.forEach((offer, index) => {
        const div = document.createElement("div");
        div.classList.add("offer-card");

        const countdownId = `countdown-${index}`;
        const isActive = isOfferActive(offer.expires);

        div.innerHTML = `
            <h5>${offer.name}</h5>
            <p>${offer.desc}</p>
            <small id="${countdownId}" class="text-muted"></small><br><br>
            ${isActive
                ? offer.type === "bundle"
                    ? `<button class="btn-buy" onclick="applyBundleOffer()">Apply Offer</button>`
                    : `<button class="btn-buy" onclick="buyBag(${offer.price})">Buy Now</button>`
                : `<button class="btn-buy" disabled>Expired ❌</button>`
            }
        `;
        offersContainer.appendChild(div);

        // Start countdown timer
        startCountdown(offer.expires, countdownId);
    });
}

// Countdown Timer
function startCountdown(expiryDate, elementId) {
    const countdownEl = document.getElementById(elementId);

    function updateCountdown() {
        const now = new Date();
        const expire = new Date(expiryDate);
        const diff = expire - now;

        if (diff <= 0) {
            countdownEl.textContent = "❌ Offer expired";
            displayOffers(); // refresh to disable button
            return;
        }

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownEl.textContent = `⏳ Expires in: ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Bundle Offer
function applyBundleOffer() {
    const mediumBag = bagsList.find(b => b.name === "Medium Bag");
    const totalPrice = mediumBag.price * 2;

    if (coins >= totalPrice) {
        coins -= totalPrice;
        bags += 3; // 2 bought + 1 free
        updateUserData();
        alert("🎉 Offer applied! You got 3 Medium Bags for the price of 2!");
    } else {
        alert("❌ Not enough coins for this offer.");
    }
}

function isOfferActive(expiryDate) {
    const now = new Date();
    const expire = new Date(expiryDate);
    return now < expire;
}

// Initialize
displayUserInfo();
displayShop();
displayOffers();
