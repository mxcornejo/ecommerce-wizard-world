document.addEventListener("DOMContentLoaded", function () {
  // Obtener la última orden del localStorage
  const lastOrder = getLastOrder();

  if (!lastOrder) {
    // Si no hay orden, redirigir al inicio
    window.location.href = "../index.html";
    return;
  }

  // Mostrar los datos de la orden
  displayOrderConfirmation(lastOrder);
  updateCartBadge();

  // Animar el checkmark
  animateCheckmark();
});

function getLastOrder() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orders.length === 0) {
    return null;
  }
  return orders[orders.length - 1];
}

function displayOrderConfirmation(order) {
  // Número de orden
  document.getElementById("orderNumber").textContent = order.orderNumber;

  // Información del cliente
  document.getElementById(
    "customerName"
  ).textContent = `${order.customer.firstName} ${order.customer.lastName}`;
  document.getElementById("customerEmail").textContent = order.customer.email;
  document.getElementById("customerPhone").textContent = order.customer.phone;

  // Dirección de envío
  document.getElementById("shippingAddress").textContent =
    order.shipping.address;
  document.getElementById("shippingCity").textContent = `${
    order.shipping.city
  }, ${order.shipping.region}${
    order.shipping.postalCode ? " - " + order.shipping.postalCode : ""
  }`;

  // Productos del pedido
  const orderSummary = document.getElementById("orderSummary");
  orderSummary.innerHTML = "";

  order.items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className =
      "d-flex justify-content-between align-items-center mb-2";
    itemDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" alt="${
      item.name
    }" class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
        <div class="text-start">
          <p class="mb-0 small fw-bold">${item.name}</p>
          <p class="mb-0 text-muted" style="font-size: 0.75rem;">Cantidad: ${
            item.quantity
          }</p>
        </div>
      </div>
      <span class="fw-bold">${formatPrice(item.price * item.quantity)}</span>
    `;
    orderSummary.appendChild(itemDiv);
  });

  // Totales
  document.getElementById("summarySubtotal").textContent = formatPrice(
    order.totals.subtotal
  );
  document.getElementById("summaryTax").textContent = formatPrice(
    order.totals.tax
  );
  document.getElementById("summaryTotal").textContent = formatPrice(
    order.totals.total
  );

  // Fecha estimada de entrega (7 días hábiles)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const options = { year: "numeric", month: "long", day: "numeric" };
  document.getElementById("estimatedDelivery").textContent =
    deliveryDate.toLocaleDateString("es-ES", options);
}

function animateCheckmark() {
  setTimeout(() => {
    const checkmark = document.querySelector(".success-checkmark");
    if (checkmark) {
      checkmark.classList.add("animate");
    }
  }, 300);
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
