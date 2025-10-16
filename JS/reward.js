/* ===================================================================== */
/* ===================== Reward System ===================== */

const userCoins = document.getElementById("userCoins");
const userBags = document.getElementById("userBags");
const shopItems = document.getElementById("shopItems");
const offersContainer = document.getElementById("offersContainer");
const myBagsContainer = document.getElementById("myBagsContainer");

/* ========== Get & Validate User Data ========== */
let rawUser = localStorage.getItem("user");
let user;

if (rawUser) {
    try {
        user = JSON.parse(rawUser);
    } catch (e) {
        user = { name: "Guest", coins: 100, bags: [] };
    }
} else {
    user = { name: "Guest", coins: 100, bags: [] };
}

// Coins & Bags setup (ensure valid types)
let coins = typeof user.coins === "number" ? user.coins : Number(user.coins) || 0;

// Guarantee bags is an array
let bagsRaw = user.bags;
let bags;
if (Array.isArray(bagsRaw)) {
    bags = bagsRaw;
} else if (typeof bagsRaw === "string") {
    try {
        bags = JSON.parse(bagsRaw);
        if (!Array.isArray(bags)) bags = [];
    } catch (e) {
        bags = [];
    }
} else {
    bags = [];
}

// Re-save corrected data
user.coins = coins;
user.bags = bags;
localStorage.setItem("user", JSON.stringify(user));

/* ========== Display User Info ========== */
function displayUserInfo() {
    const availableCount = Array.isArray(bags)
        ? bags.filter(b => !b.received).length
        : 0;
    userCoins.textContent = coins;
    userBags.textContent = availableCount;
}

/* ========== Update User Data ========== */
function updateUserData() {
    user.coins = coins;
    user.bags = bags;
    localStorage.setItem("user", JSON.stringify(user));
    displayUserInfo();
    displayMyBags();
}

/* ========== Shop Items ========== */
const bagsList = [
    { name: "Small Bag", price: 20, icon: "fa-bag-shopping" },
    { name: "Medium Bag", price: 40, icon: "fa-shopping-bag" },
    { name: "Large Bag", price: 70, icon: "fa-suitcase-rolling" }
];

/* Render Shop */
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
            <button class="btn-buy" onclick="buyBag(${item.price}, '${item.name}', '${item.icon}')">Buy</button>
        `;
        shopItems.appendChild(div);
    });
}

/* Buy Bag */
function buyBag(price, name, icon) {
    if (coins >= price) {
        coins -= price;
        bags.push({ name, icon, received: false });
        updateUserData();
        alert(`✅ Purchase successful! You got a ${name}!`);
    } else {
        alert("❌ Not enough coins!");
    }
}

/* ========== Offers ========== */
const offers = [
    { name: "50% Off Small Bag", desc: "Buy a Small Bag for only 10 coins!", price: 10, expires: new Date(2025, 9, 19, 23, 59, 59) },
    { name: "Buy 2 Get 1 Free", desc: "Buy 2 Medium Bags and get 1 free!", type: "bundle", expires: new Date(2025, 9, 25, 23, 59, 59) }
];

/* Render Offers + Countdown Timer */
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
                    : `<button class="btn-buy" onclick="buyBag(${offer.price}, 'Small Bag', 'fa-bag-shopping')">Buy Now</button>`
                : `<button class="btn-buy" disabled>Expired ❌</button>`
            }
        `;
        offersContainer.appendChild(div);

        // Start countdown timer
        startCountdown(offer.expires, countdownId);
    });
}

/* Countdown Timer */
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

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days > 0) {
            countdownEl.textContent = `⏳ Expires in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownEl.textContent = `⏳ Expires in: ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* Apply Bundle Offer */
function applyBundleOffer() {
    const mediumBag = bagsList.find(b => b.name === "Medium Bag");
    const totalPrice = mediumBag.price * 2;

    if (coins >= totalPrice) {
        coins -= totalPrice;
        for (let i = 0; i < 3; i++) {
            bags.push({ name: "Medium Bag", icon: "fa-shopping-bag", received: false });
        }
        updateUserData();
        alert("🎉 Offer applied! You got 3 Medium Bags for the price of 2!");
    } else {
        alert("❌ Not enough coins for this offer.");
    }
}

/* Offer Status */
function isOfferActive(expiryDate) {
    const now = new Date();
    const expire = new Date(expiryDate);
    return now < expire;
}

/* ===================== My Bags Section ===================== */
function displayMyBags() {
    myBagsContainer.innerHTML = "";
    if (!Array.isArray(bags) || bags.length === 0) {
        myBagsContainer.innerHTML = "<p class='text-muted'>No bags yet 👜</p>";
        return;
    }

    bags.forEach((bag, index) => {
        const div = document.createElement("div");
        div.classList.add("bag-card");
        div.innerHTML = `
            <div class="bag-info">
                <h5><i class="fa-solid ${bag.icon}" style="color:#44634b;"></i> ${bag.name}</h5>
            </div>
            ${!bag.received
                ? `<button class="btn-buy" onclick="claimBag(${index})">Claim</button>`
                : `<span class="text-success fw-bold">✅ Claimed</span>`
            }
        `;
        myBagsContainer.appendChild(div);
    });
}

/* Claim Bag */
function claimBag(index) {
    if (bags[index]) {
        bags[index].received = true;
        updateUserData();
        alert(`🎉 You claimed your ${bags[index].name}!`);
    }
}

/* ========== Initialize ========== */
displayUserInfo();
displayShop();
displayOffers();
displayMyBags();
