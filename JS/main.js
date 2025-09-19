document.addEventListener("DOMContentLoaded", () => {
    function loadComponent(id, file, errMsg) {
        fetch(file)
            .then(res => res.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;

                if (id === "navbar") {
                    let currentPage = window.location.pathname.split("/").pop();
                    let links = document.querySelectorAll("#navbar a");

                    links.forEach(link => {
                        let href = link.getAttribute("href");

                        if (href === currentPage || (currentPage === "" && href === "index.html")) {
                            link.classList.add("active");
                        } else {
                            link.classList.remove("active");
                        }
                    });
                }
            })
            .catch(error => alert(errMsg, error));
    }

    // Navbar + Footer
    loadComponent("navbar", "../components/navbar.html", "Error loading navbar...");
    loadComponent("footer", "../components/footer.html", "Error loading footer...");

    /* ===================================================================== */

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
});