import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseLogout } from "../JS/login.js";

const db = getFirestore();

// ==========================================
// 1. Statistics Data & Rendering
// ==========================================

const cities = {
    khamis_mushait: { coords: [18.3029, 42.7297], name: "مدينة خميس مشيط" },
    abha: { coords: [18.2164, 42.5053], name: "مدينة أبها" },
    al_mansak: { coords: [18.2216, 42.5278], name: "حي المنسك" },
    al_badea: { coords: [18.2071, 42.5172], name: "حي البديع" },
    king_khalid_uni: { coords: [18.2128, 42.6547], name: "جامعة الملك خالد - الفرعاء" },
    al_harir: { coords: [18.2923, 42.6930], name: "حي الهرير" },
    al_rasras: { coords: [18.2220, 42.5005], name: "حي الرصراص" },
    al_safq: { coords: [18.2881, 42.7072], name: "حي الصفق" },
    king_faisal_city: { coords: [18.2935, 42.6484], name: "مدينة الملك فيصل العسكرية" }
};

function renderStatistics() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    Object.values(cities).forEach(city => {
        const percentage = Math.floor(Math.random() * 100);
        const degree = percentage * 3.6;

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <h3>${city.name}</h3>
            <div class="progress-circle" style="background: conic-gradient(#52796f ${degree}deg, #e0e0e0 0deg);">
                <span class="progress-value">${percentage}%</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// 2. Sidebar & Navigation
// ==========================================

const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');

        document.querySelectorAll('.dashboard-section').forEach(sec => sec.style.display = 'none');

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    });
});

const goToProfileBtn = document.getElementById("goToProfile");
if (goToProfileBtn) {
    goToProfileBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

// ==========================================
// 3. User Management & Logout
// ==========================================

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        firebaseLogout();
    });
}

const adminNameEl = document.getElementById("adminName");
const currentUser = JSON.parse(localStorage.getItem("user"));
if (currentUser && currentUser.role === "admin" && adminNameEl) {
    adminNameEl.textContent = currentUser.name;
}

// ==========================================
// 4. Data Fetching
// ==========================================

async function fetchData() {
    const usersSnapshot = await getDocs(collection(db, "users"));

    let totalUsers = 0, totalAdmins = 0, totalUserCoins = 0, totalAdminCoins = 0;

    const usersTable = document.getElementById("usersTable");
    const adminsTable = document.getElementById("adminsTable");
    const allUsersTable = document.getElementById("allUsersTable");
    const allAdminsTable = document.getElementById("allAdminsTable");
    const ordersTable = document.getElementById("ordersTable");

    // Clear tables
    if (usersTable) usersTable.innerHTML = "";
    if (adminsTable) adminsTable.innerHTML = "";
    if (allUsersTable) allUsersTable.innerHTML = "";
    if (allAdminsTable) allAdminsTable.innerHTML = "";
    if (ordersTable) ordersTable.innerHTML = "";

    usersSnapshot.forEach(docSnap => {
        const user = docSnap.data();

        const rowEl = document.createElement("tr");
        if (user.role === "admin") {
            if (adminsTable) {
                rowEl.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || '-'}</td>
                    <td>${user.role || 'Admin'}</td>
                `;
                adminsTable.appendChild(rowEl);
            }
        } else {
            if (usersTable) {
                rowEl.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.coins || 0}</td>
                    <td>${user.bags || 0}</td>
                    <td>${user.role || 'User'}</td>
                `;
                usersTable.appendChild(rowEl);
            }
        }

        const fullRow = document.createElement("tr");
        if (user.role === "admin") {
            if (allAdminsTable) {
                fullRow.innerHTML = `
                    <td><img src="${user.image || 'https://via.placeholder.com/50'}" width="50" height="50" style="border-radius:50%;"></td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.gender || '-'}</td>
                    <td>${user.phone || '-'}</td>
                    <td>${user.address || '-'}</td>
                    <td>${user.age || '-'}</td>
                    <td>${user.job || '-'}</td>
                `;
                allAdminsTable.appendChild(fullRow);
            }
        } else {
            if (allUsersTable) {
                fullRow.innerHTML = `
                    <td><img src="${user.image || 'https://via.placeholder.com/50'}" width="50" height="50" style="border-radius:50%;"></td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.gender || '-'}</td>
                    <td>${user.phone || '-'}</td>
                    <td>${user.address || '-'}</td>
                    <td>${user.age || '-'}</td>
                    <td>${user.job || '-'}</td>
                    <td>${user.coins || 0}</td>
                    <td>${user.bags || 0}</td>
                `;
                allUsersTable.appendChild(fullRow);
            }
        }

        if (user.role === "admin") {
            totalAdmins++;
        } else {
            totalUsers++;
            totalUserCoins += user.coins || 0;
        }

        if (user.role !== "admin" && ordersTable) {
            const orderRow = document.createElement("tr");
            orderRow.innerHTML = `
                <td>${docSnap.id}</td>
                <td>${user.name}</td>
                <td>${user.coins || 0}</td>
                <td>${user.bags || 0}</td>
                <td>Completed</td>
            `;
            ordersTable.appendChild(orderRow);
        }
    });

    const totalUsersEl = document.getElementById("totalUsers");
    const totalAdminsEl = document.getElementById("totalAdmins");
    const totalUserCoinsEl = document.getElementById("totalUserCoins");
    const totalAdminCoinsEl = document.getElementById("totalAdminCoins");

    if (totalUsersEl) totalUsersEl.textContent = totalUsers;
    if (totalAdminsEl) totalAdminsEl.textContent = totalAdmins;
    if (totalUserCoinsEl) totalUserCoinsEl.textContent = totalUserCoins;
    if (totalAdminCoinsEl) totalAdminCoinsEl.textContent = totalAdminCoins;
}

// Initialize
fetchData();
renderStatistics();