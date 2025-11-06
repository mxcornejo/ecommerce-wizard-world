document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    showError();
    return;
  }

  const product = getProductById(productId);

  if (!product) {
    showError();
    return;
  }

  renderProduct(product);
  setupEventListeners();
  updateCartBadge();
});

function renderProduct(product) {
  document.getElementById(
    "page-title"
  ).textContent = `${product.name} - Wizard World`;
  document.getElementById("category-link").textContent = product.category;
  document.getElementById("category-link").href = product.categoryLink;
  document.getElementById("breadcrumb-product").textContent = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.name;

  if (product.discount > 0) {
    const discountBadge = document.getElementById("discount-badge");
    discountBadge.textContent = `-${product.discount}%`;
    discountBadge.style.display = "block";
  }

  document.getElementById("product-category").textContent = product.category;
  document.getElementById("product-name").textContent = product.name;

  if (product.originalPrice) {
    document.getElementById("original-price").textContent = formatPrice(
      product.originalPrice
    );
    document.getElementById("original-price").style.display = "inline";
  }
  document.getElementById("current-price").textContent = formatPrice(
    product.price
  );
  document.getElementById("product-short-description").textContent =
    product.shortDescription;

  const stockStatus = document.getElementById("stock-status");
  if (product.stock) {
    stockStatus.innerHTML =
      '<i class="bi bi-check-circle-fill text-success me-2"></i>En stock';
    stockStatus.className = "text-success fw-semibold";
  } else {
    stockStatus.innerHTML =
      '<i class="bi bi-x-circle-fill text-danger me-2"></i>Agotado';
    stockStatus.className = "text-danger fw-semibold";
    document.getElementById("add-to-cart").disabled = true;
  }

  document.getElementById("product-full-description").innerHTML =
    product.fullDescription;

  const specificationsTable = document.getElementById("product-specifications");
  specificationsTable.innerHTML = "";

  for (const [key, value] of Object.entries(product.specifications)) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row" style="width: 30%;">${key}</th>
      <td>${value}</td>
    `;
    specificationsTable.appendChild(row);
  }
}

function setupEventListeners() {
  const quantityInput = document.getElementById("quantity");
  const decreaseBtn = document.getElementById("decrease-qty");
  const increaseBtn = document.getElementById("increase-qty");

  decreaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1;
    }
  });

  quantityInput.addEventListener("change", function () {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 1) {
      this.value = 1;
    } else if (value > 10) {
      this.value = 10;
    }
  });

  document.getElementById("add-to-cart").addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const product = getProductById(productId);

    if (product) {
      addToCart(product, quantity);
      showAddToCartNotification(product.name, quantity);
      updateCartBadge();
    }
  });

  document
    .getElementById("add-to-wishlist")
    .addEventListener("click", function () {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      const product = getProductById(productId);

      if (product) {
        addToWishlist(product);
        showWishlistNotification(product.name);
      }
    });
}

function addToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const exists = wishlist.some((item) => item.id === product.id);

  if (!exists) {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
}

function showAddToCartNotification(productName, quantity) {
  const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div id="cartToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <i class="bi bi-check-circle-fill me-2"></i>
          <strong class="me-auto">¡Agregado al carrito!</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <strong>${quantity}x ${productName}</strong> agregado al carrito exitosamente.
        </div>
      </div>
    </div>
  `;

  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = toastHTML;
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.remove();
  }, 3000);
}

function showWishlistNotification(productName) {
  const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div id="wishlistToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-info text-white">
          <i class="bi bi-heart-fill me-2"></i>
          <strong class="me-auto">¡Agregado a favoritos!</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <strong>${productName}</strong> agregado a tu lista de deseos.
        </div>
      </div>
    </div>
  `;

  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = toastHTML;
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.remove();
  }, 3000);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cart-badge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function showError() {
  document.querySelector("main").innerHTML = `
    <div class="container my-5 text-center">
      <i class="bi bi-exclamation-triangle text-warning" style="font-size: 5rem;"></i>
      <h1 class="mt-4">Producto no encontrado</h1>
      <p class="lead">Lo sentimos, el producto que buscas no existe o ha sido eliminado.</p>
      <a href="../index.html" class="btn btn-primary mt-3">Volver al inicio</a>
    </div>
  `;
}
