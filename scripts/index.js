const searchToggle = document.querySelector("#search-toggle");
    const searchPanel = document.querySelector("#search-panel");
    const menuToggle = document.querySelector("#menu-toggle");
    const mainNavigation = document.querySelector("#main-navigation");

    searchToggle.addEventListener("click", () => {
      const isOpen = searchPanel.classList.toggle("open");
      searchToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) searchPanel.querySelector("input").focus();
    });

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNavigation.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
