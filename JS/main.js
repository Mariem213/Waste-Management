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
});