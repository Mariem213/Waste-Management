import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseLogout } from "../JS/login.js";

const db = getFirestore();

// ==========================================
// 1. Statistics Data & Rendering
// ==========================================

const regionalData = [
    {
        id: "khamis_mushait",
        name: "مدينة خميس مشيط",
        coords: [18.3029, 42.7297],
        neighborhoods: [
            { name: "حي البديع", coords: [18.2071, 42.5172] },
            { name: "حي الهرير", coords: [18.2923, 42.6930] },
            { name: "حي الصفق", coords: [18.2881, 42.7072] },
            { name: "مدينة الملك فيصل العسكرية", coords: [18.2935, 42.6484] }
        ]
    },
    {
        id: "abha",
        name: "مدينة أبها",
        coords: [18.2164, 42.5053],
        neighborhoods: [
            { name: "حي المنسك", coords: [18.2216, 42.5278] },
            { name: "حي الرصراص", coords: [18.2220, 42.5005] },
            { name: "جامعة الملك خالد - الفرعاء", coords: [18.2128, 42.6547] }
        ]
    }
];


function renderStatistics() {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    regionalData.forEach(city => {
        const cityPercentage = Math.floor(Math.random() * 100);
        const cityDegree = cityPercentage * 3.6;
        const neighborhoodsHTML = city.neighborhoods.map(hood => {
            const hoodPercentage = Math.floor(Math.random() * 100);

            let barColor = '#52796f';
            if (hoodPercentage < 40) barColor = '#e76f51';
            else if (hoodPercentage < 75) barColor = '#f4a261';

            return `
                <li class="neighborhood-item">
                    <div class="neighborhood-info">
                        <span>${hood.name}</span>
                        <svg class="location-icon" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>

                    <div class="neighborhood-stats">
                        <span class="percent-text" style="color:${barColor}">${hoodPercentage}%</span>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${hoodPercentage}%; background-color: ${barColor};"></div>
                        </div>
                    </div>
                </li>
            `;
        }).join('');

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div class="stat-header">
                <div class="city-info">
                    <h3>${city.name}</h3>
                    <p style="opacity:0.9; font-size:0.8rem;">Statistics Overview</p>
                </div>
                <div class="header-progress">
                    <div class="header-progress-circle" 
                        style="background: conic-gradient(#ffffff ${cityDegree}deg, rgba(255,255,255,0.15) 0deg);">
                    </div>
                    <div style="position:absolute; width: 58px; height: 58px; background: #52796f; border-radius:50%; box-shadow:inset 0 0 10px rgba(0,0,0,0.2);"></div>
                    <span class="header-progress-value">${cityPercentage}%</span>
                </div>
            </div>

            <div class="stat-body">
                <ul class="neighborhood-list">
                    ${neighborhoodsHTML}
                </ul>
            </div>
        `;
        grid.appendChild(card);
    });
}

renderStatistics();

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

fetchData();
renderStatistics();