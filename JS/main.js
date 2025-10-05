document.addEventListener("DOMContentLoaded", () => {
  /* ===================================================================== */
  /* ============================== Mapping ============================== */

  const map = L.map('map').setView([24.7136, 46.6753], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const cities = {
    riyadh: { coords: [24.7136, 46.6753], name: "الرياض" },
    jeddah: { coords: [21.4858, 39.1925], name: "جدة" },
    dammam: { coords: [26.4207, 50.0888], name: "الدمام" }
  };

  const markers = {};

  for (let city in cities) {
    const { coords, name } = cities[city];
    const marker = L.marker(coords).addTo(map).bindPopup(`<b>${name}</b>`);
    markers[city] = marker;
  }

  function showAllCities() {
    const allCoords = Object.values(cities).map(c => c.coords);
    const bounds = L.latLngBounds(allCoords);
    map.fitBounds(bounds);
  }

  showAllCities();

  document.getElementById('citySelect').addEventListener('change', (e) => {
    const city = e.target.value;

    if (city === "all") {
      showAllCities();
    } else {
      const { coords } = cities[city];
      map.flyTo(coords, 12, { animate: true, duration: 2 });
      markers[city].openPopup();
    }
  });

  /* ===================================================================== */
  /* ============================== Contact ============================== */

  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const formAlert = document.getElementById("formAlert");

    emailjs.send("service_bp2u60n", "template_vn9qw9l", {
      from_name: name,
      from_email: email,
      message: message
    }, "n_H-U2g8xl-LVWr-p")
      .then(() => {
        formAlert.className = "alert alert-success mt-3";
        formAlert.textContent = "✅ Message sent successfully!";
        formAlert.classList.remove("d-none");
        document.getElementById("contactForm").reset();
      })
      .catch((err) => {
        formAlert.className = "alert alert-danger mt-3";
        formAlert.textContent = "❌ An error occurred while sending the message!";
        formAlert.classList.remove("d-none");
        console.error("Error:", err);
      });
  });

  /* ===================================================================== */
  /* ===================== Navbar login/logout switch ==================== */

  function updateAuthLink() {
    const user = JSON.parse(localStorage.getItem("user"));
    const authLink = document.getElementById("authLink");
    if (localStorage.getItem("isLoggedIn") === "true") {
      // authLink.textContent = "Logout";
      authLink.innerHTML = `${user.name} | Logout`;
      authLink.href = "index.html";
      authLink.onclick = function () {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "pages/login.html";
      };
    } else {
      authLink.textContent = "Login";
      authLink.href = "pages/login.html";
      authLink.onclick = null;
    }
  }

  updateAuthLink();

  /* ===================================================================== */
  /* ===================== Navbar active ==================== */
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");

    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
      const linkPage = link.getAttribute("href").split("/").pop();

      if (linkPage === currentPage ||
        (currentPage === "" && linkPage === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });

});