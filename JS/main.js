document.addEventListener("DOMContentLoaded", () => {
  /* ===================================================================== */
  /* ============================== Mapping ============================== */

  const map = L.map('map').setView([18.3053, 42.7360], 8);
  +
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

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
      map.flyTo(coords, 13, { animate: true, duration: 2 });
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

    if (localStorage.getItem("isLoggedIn") === "true" && user) {
      authLink.innerHTML = `
            <span id="userNameLink" style="cursor:pointer;">${user.name}</span>
            <span style="color:white;"> | </span>
            <span id="logoutLink" style="cursor:pointer; color: #0dc73bff;">Logout</span>
        `;
      authLink.href = "#";

      document.addEventListener("click", function (e) {
        if (e.target && e.target.id === "userNameLink") {
          window.location.href = "pages/profile.html";
        }
        if (e.target && e.target.id === "logoutLink") {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          alert("You have logged out successfully!");
          window.location.href = "../index.html";
        }
      });

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
    const navLinks = document.querySelectorAll(".link-item");

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