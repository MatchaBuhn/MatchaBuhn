const product = {
  id: 1,
  name: "Kawaii Mochi Sticker Pack",
  price: 3.99,
  image: "images/kawaii-mochi-sticker-pack-cover.png",
  desc: "A cute digital sticker pack featuring kawaii mochi designs. Includes transparent PNG stickers and a thank-you note.",
  buyUrl: "https://kaliyah40.gumroad.com/l/kawaii-mochi-sticker-pack"
};

const $ = id => document.getElementById(id);
const money = n => `$${n.toFixed(2)}`;

function renderProduct() {
  const grid = $("productGrid");

  grid.innerHTML = `
    <article class="product-card">
      <button
        class="product-image"
        id="productImage"
        aria-label="View ${product.name}"
      >
        <img
          src="${product.image}"
          alt="${product.name}"
          style="width:100%;height:100%;object-fit:contain;"
        >
        <span class="new-badge">NEW</span>
      </button>

      <div class="product-info">
        <h3>${product.name}</h3>
        <span class="price">${money(product.price)}</span>
        <button
          class="quick"
          id="quickView"
          aria-label="View ${product.name}"
        >
          ♡
        </button>
      </div>
    </article>
  `;

  $("productImage").onclick = openProduct;
  $("quickView").onclick = openProduct;
}

function openProduct() {
  $("dialogContent").innerHTML = `
    <div class="dialog-inner">
      <div class="dialog-art">
        <img
          src="${product.image}"
          alt="${product.name}"
          style="width:100%;max-width:360px;border-radius:20px;"
        >
      </div>

      <div class="dialog-info">
        <h2>${product.name}</h2>

        <div class="dialog-price">
          ${money(product.price)}
        </div>

        <p>${product.desc}</p>

        <p>
          <strong>Includes:</strong><br>
          • Transparent PNG stickers<br>
          • Kawaii mochi designs<br>
          • Thank-you note<br>
          • Digital download
        </p>

        <a
          class="button pink"
          href="${product.buyUrl}"
          target="_blank"
          rel="noopener"
        >
          BUY NOW ♡
        </a>
      </div>
    </div>
  `;

  $("productDialog").showModal();
}

$("closeDialog").onclick = () => {
  $("productDialog").close();
};

$("searchButton").onclick = () => {
  $("searchRow").classList.toggle("open");

  if ($("searchRow").classList.contains("open")) {
    $("searchInput").focus();
  }
};

$("searchInput").addEventListener("input", event => {
  const query = event.target.value.toLowerCase().trim();

  if (
    product.name.toLowerCase().includes(query) ||
    product.desc.toLowerCase().includes(query)
  ) {
    renderProduct();
  } else {
    $("productGrid").innerHTML = `
      <div class="no-results">
        <div style="font-size:60px">🐰</div>
        <h3>No cuties found!</h3>
        <p>Try another search.</p>
      </div>
    `;
  }
});

$("viewAll").onclick = () => {
  $("searchInput").value = "";
  $("searchRow").classList.add("open");
  renderProduct();
  $("shop").scrollIntoView({ behavior: "smooth" });
};

$("menuButton").onclick = () => {
  $("nav").classList.toggle("open");
};

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("nav").classList.remove("open");
  });
});

$("contactForm").addEventListener("submit", event => {
  event.preventDefault();

  const data = new FormData(event.target);

  const subject = encodeURIComponent("MatchaBuhn website message");

  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
  );

 window.location.href =
  `mailto:shopmatchabuhn@gmail.com?subject=${subject}&body=${body}`;
});

$("cartButton").onclick = () => {
  alert("Digital downloads are purchased through the BUY NOW ♡ button.");
};

$("closeCart").onclick = () => {
  $("cartDrawer").classList.remove("open");
  $("overlay").classList.remove("open");
};

$("overlay").onclick = () => {
  $("cartDrawer").classList.remove("open");
  $("overlay").classList.remove("open");
};

$("checkoutButton").onclick = () => {
  window.location.href = product.buyUrl;
};

$("year").textContent = new Date().getFullYear();

renderProduct();
