const collections = {
      "ribbon-roses": {
        title: "Ribbon Roses",
        description: "Ribbon roses, made by hand in a range of colors and bouquet sizes. Choose a favorite and send us your order on WhatsApp.",
        products: [
          { name: "16 Red Ribbon Roses", image: "images/rose%20collection/red%20roses.png", alt: "Bouquet of 16 handcrafted red ribbon roses", count: "16 roses", color: "Classic red", description: "A keepsake bouquet of sixteen deep-red ribbon roses, finished with a coordinating wrap and bow." },
          { name: "Blush Ribbon Roses", image: "images/rose%20collection/rose%20collection.jpg", alt: "Blush pink handcrafted ribbon roses",  color: "Blush pink", description: "Soft blush ribbon roses in your chosen bouquet size, carefully arranged by hand." },
          { name: "White Ribbon Roses", image: "images/rose%20collection/white%20roses.jpg", alt: "Ivory white handcrafted ribbon rose bouquet", color: "White and ivory", description: "Elegant white ribbon roses with airy baby's-breath details, ideal for weddings and thoughtful gifts." },
          { name: "Teal and Ivory Birthday Bouquet", image: "images/rose%20collection/rose%201%20.jpeg", alt: "Teal and ivory ribbon rose bouquet with birthday details", color: "Teal and ivory", description: "A colorful teal-and-ivory keepsake bouquet, decorated with a birthday sash and delicate butterfly accents." },
          { name: "Blue and Black Ribbon Roses", image: "images/rose%20collection/rose2.jpeg", alt: "Satin blue and black ribbon rose bouquet", color: "Royal blue and black", description: "Bold blue and black satin ribbon roses arranged in contrasting layers with a dark ribbon bow." },
          { name: "Red and Ivory Celebration Bouquet", image: "images/rose%20collection/rose%203.jpeg", alt: "Red and ivory ribbon roses graduation bouquet", color: "Red and ivory", description: "A bright red-and-ivory bouquet with celebratory graduation details and a personalised sash." },
          { name: "Teal and Ivory Just Because Bouquet", image: "images/rose%20collection/rose%204.jpeg", alt: "Teal and ivory ribbon rose bouquet with keepsake message sash", color: "Teal and ivory", description: "A teal-and-ivory rose bouquet finished with a keepsake message sash for an unexpected gift." },
                  ]
      },
      "glitter-roses": {
        title: "Glitter Roses",
        description: "Sparkling ribbon roses with a glitter finish, handmade in rich colors and thoughtful bouquet sizes.",
        products: [
          { name: "Purple Glitter Ribbon Roses", image: "images/hero-cutout.png", alt: "Deep purple glitter ribbon rose bouquet with lavender wrapping", color: "Deep purple", description: "A dramatic keepsake bouquet of glittering purple ribbon roses, finished with layered lavender wrapping." }
        ]
      },
      "ribbon-tulips": {
        title: "Ribbon Tulips",
        description: "Graceful ribbon tulips, handcrafted in cheerful colors for thoughtful gifts and lasting displays.",
        products: [{ name: "Ribbon Tulip Bouquet", image: "images/tulip%20collection/tulip%20collection.jpg", alt: "Handcrafted ribbon tulip bouquet", count: "Custom bouquet size", color: "Seasonal colors", description: "A bright arrangement of sculpted ribbon tulips, made by hand in colors chosen for your occasion." }]
      },
      "mixed-bouquets": {
        title: "Mixed Bouquets",
        description: "One-of-a-kind arrangements combining ribbon blooms in complementary colors and shapes.",
        products: [{ name: "Mixed Ribbon Bouquet", image: "images/mixed%20collection/mixed%20collection.jpg", alt: "Mixed handcrafted ribbon flower bouquet", count: "Custom bouquet size", color: "Mixed colors", description: "A thoughtful blend of ribbon flowers, arranged to create a distinctive keepsake bouquet." }]
      },
      "gift-collections": {
        title: "Gift Collections",
        description: "Floral keepsakes and thoughtful gift sets, beautifully presented for life's special moments.",
        products: [{ name: "Keepsake Flower Gift", image: "images/gift%20collection/gift%20collection.jpg", alt: "Handcrafted flower gift collection", count: "Made to order", color: "Personalised colors", description: "A ready-to-gift floral keepsake with details and colors tailored to your celebration." }]
      }
    };

    const params = new URLSearchParams(window.location.search);
    const selected = collections[params.get("collection")] || collections["ribbon-roses"];
    const grid = document.querySelector("#product-grid");
    document.title = `${selected.title} | WEM'S PETALS AND DECOR`;
    document.querySelector("#collection-title").textContent = selected.title;
    document.querySelector("#breadcrumb-current").textContent = selected.title;
    document.querySelector("#collection-description").textContent = selected.description;
    document.querySelector("#collection-count").textContent = `${selected.products.length} handcrafted ${selected.products.length === 1 ? "bouquet" : "bouquets"}`;

    const whatsappIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"/><path d="M9 8.5c.4 2.5 2 4.1 4.5 5l1.2-1.1 2 .9c-.2 1.3-1.2 2-2.5 2-3.5-.3-7.1-3.9-7.4-7.4 0-1.3.7-2.3 2-2.5l.9 2L9 8.5Z"/></svg>';
    const productCard = (product, index) => {
      const message = encodeURIComponent(`Hello, I would like to order the ${product.name} from Wem's Petals and Decor. Please share the price and ordering details.`);
      return `<article class="product-card">
        <div class="flip-stage">
          <div class="flip-inner">
            <div class="product-face front"><img class="product-photo" src="${product.image}" alt="${product.alt}" loading="${index < 2 ? "eager" : "lazy"}"><button class="details-toggle" type="button" aria-label="Show details for ${product.name}">View bouquet details</button></div>
            <div class="product-face back"><span class="back-kicker">Handmade ribbon flowers</span><h3>${product.name}</h3><p class="product-description">${product.description}</p><div class="product-meta">${product.count ? `<div><span>Number of flowers:</span> ${product.count}</div>` : ""}<div><span>Color:</span> ${product.color}</div></div><div class="price-line"><span>Price</span><span aria-label="Price to be added">KES</span><span class="amount" aria-hidden="true"></span></div><a class="order-link" href="https://wa.me/254746053722?text=${message}" target="_blank" rel="noopener noreferrer">${whatsappIcon} Place order on WhatsApp</a></div>
          </div>
        </div>
        <div class="product-info"><div><h2>${product.name}</h2><p>Handmade, made to last</p></div><span class="info-price" aria-label="Price to be added"></span></div>
      </article>`;
    };

    grid.innerHTML = selected.products.map(productCard).join("");
    grid.querySelectorAll(".details-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const isFlipped = card.classList.toggle("is-flipped");
        button.setAttribute("aria-label", isFlipped ? `Hide details for ${button.getAttribute("aria-label").replace("Show details for ", "")}` : `Show details for ${button.getAttribute("aria-label").replace("Hide details for ", "")}`);
      });
    });
