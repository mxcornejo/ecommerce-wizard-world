document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  updateCartBadge();
});

function loadCart() {
  const cart = getCart();
  const cartItemsBody = document.getElementById("cart-items-body");
  const emptyCart = document.getElementById("empty-cart");
  const cartItems = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.style.display = "none";
    checkoutBtn.disabled = true;
  } else {
    emptyCart.style.display = "none";
    cartItems.style.display = "block";
    checkoutBtn.disabled = false;
    renderCartItems(cart);
  }

  updateTotals();
}

function renderCartItems(cart) {
  const cartItemsBody = document.getElementById("cart-items-body");
  cartItemsBody.innerHTML = "";

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${
      item.name
    }" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">SKU: ${item.id}</small>
          </div>
        </div>
      </td>
      <td class="text-center">
        <strong>${formatPrice(item.price)}</strong>
      </td>
      <td class="text-center">
        <div class="input-group input-group-sm" style="width: 120px; margin: 0 auto;">
          <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity(${index})">
            <i class="bi bi-dash"></i>
          </button>
          <input type="number" class="form-control text-center" value="${
            item.quantity
          }" min="1" max="10" readonly>
          <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity(${index})">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </td>
      <td class="text-center">
        <strong class="text-primary">${formatPrice(
          item.price * item.quantity
        )}</strong>
      </td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})" title="Eliminar">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    cartItemsBody.appendChild(row);
  });
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQuantity(index) {
  const cart = getCart();
  if (cart[index].quantity < 10) {
    cart[index].quantity++;
    saveCart(cart);
    loadCart();
    updateCartBadge();
  }
}

function decreaseQuantity(index) {
  const cart = getCart();
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    saveCart(cart);
    loadCart();
    updateCartBadge();
  }
}

function removeItem(index) {
  if (
    confirm("¿Estás seguro de que deseas eliminar este producto del carrito?")
  ) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
    updateCartBadge();

    showNotification("Producto eliminado del carrito", "danger");
  }
}

function updateTotals() {
  const cart = getCart();
  let subtotal = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  });

  const shipping = subtotal >= 50000 ? 0 : 0;
  const total = subtotal + shipping;

  document.getElementById("total-items").textContent = totalItems;
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("total").textContent = formatPrice(total);

  if (subtotal >= 50000) {
    document.getElementById("shipping").innerHTML =
      '<span class="text-success fw-semibold">Gratis</span>';
  } else {
    document.getElementById("shipping").innerHTML =
      '<span class="text-success fw-semibold">Gratis</span>';
  }
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById("cart-badge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function showNotification(message, type = "success") {
  const bgClass = type === "success" ? "bg-success" : "bg-danger";
  const icon = type === "success" ? "check-circle-fill" : "x-circle-fill";

  const toastHTML = `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header ${bgClass} text-white">
          <i class="bi bi-${icon} me-2"></i>
          <strong class="me-auto">Notificación</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
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

document.getElementById("checkout-btn")?.addEventListener("click", function () {
  window.location.href = "checkout.html";
});
