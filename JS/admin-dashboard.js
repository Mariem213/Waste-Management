import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseLogout } from "../JS/login.js";

const db = getFirestore();

// Sidebar toggle
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.querySelectorAll('.dashboard-section').forEach(sec => sec.style.display = 'none');
        document.getElementById(targetId).style.display = 'block';
    });
});

document.getElementById("goToProfile").addEventListener("click", () => {
    window.location.href = "profile.html";
});


// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    firebaseLogout();
});

// Navbar admin name
const adminNameEl = document.getElementById("adminName");
const currentUser = JSON.parse(localStorage.getItem("user"));
if (currentUser && currentUser.role === "admin") {
    adminNameEl.textContent = currentUser.name;
}

// Fetch data for tables
async function fetchData() {
    const usersSnapshot = await getDocs(collection(db, "users"));

    let totalUsers = 0, totalAdmins = 0, totalUserCoins = 0;

    const usersTable = document.getElementById("usersTable");
    const adminsTable = document.getElementById("adminsTable");
    const allUsersTable = document.getElementById("allUsersTable");
    const allAdminsTable = document.getElementById("allAdminsTable");
    const ordersTable = document.getElementById("ordersTable");

    usersTable.innerHTML = "";
    adminsTable.innerHTML = "";
    allUsersTable.innerHTML = "";
    allAdminsTable.innerHTML = "";
    ordersTable.innerHTML = "";

    usersSnapshot.forEach(docSnap => {
        const user = docSnap.data();

        // Dashboard table
        const rowEl = document.createElement("tr");
        if (user.role === "admin") {
            rowEl.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.role || 'Admin'}</td>
            `;
            adminsTable.appendChild(rowEl);
        } else {
            rowEl.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.coins || 0}</td>
                <td>${user.bags || 0}</td>
                <td>${user.role || 'User'}</td>
            `;
            usersTable.appendChild(rowEl);
        }

        // Full table
        const fullRow = document.createElement("tr");
        if (user.role === "admin") {
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
        } else {
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

        // Dashboard totals
        if (user.role === "admin") {
            totalAdmins++;
            // totalAdminCoins += user.coins || 0;
        } else {
            totalUsers++;
            totalUserCoins += user.coins || 0;
        }

        // Orders (skip admins)
        if (user.role !== "admin") {
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

    // Update totals
    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalAdmins").textContent = totalAdmins;
    document.getElementById("totalUserCoins").textContent = totalUserCoins;
    document.getElementById("totalAdminCoins").textContent = totalAdminCoins;

}

fetchData();