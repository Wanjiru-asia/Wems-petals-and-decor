const searchToggle = document.querySelector("#search-toggle");
    const searchPanel = document.querySelector("#search-panel");
    const menuToggle = document.querySelector("#menu-toggle");
    const mainNavigation = document.querySelector("#main-navigation");

    if (searchToggle && searchPanel) {
      searchToggle.addEventListener("click", () => {
        const isOpen = searchPanel.classList.toggle("open");
        searchToggle.setAttribute("aria-expanded", String(isOpen));
        if (isOpen) searchPanel.querySelector("input")?.focus();
      });
    }

    if (menuToggle && mainNavigation) {
      const setMenuOpen = isOpen => {
        mainNavigation.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      };

      menuToggle.addEventListener("click", () => {
        setMenuOpen(!mainNavigation.classList.contains("open"));
      });
      mainNavigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenuOpen(false));
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenuOpen(false);
      });
    }
