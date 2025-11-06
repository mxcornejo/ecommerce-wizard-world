document.addEventListener("DOMContentLoaded", function () {
  // Cargar resumen del pedido
  loadOrderSummary();
  updateCartBadge();

  // Verificar si hay productos en el carrito
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = "cart.html";
  }

  // Configurar validación del formulario
  setupFormValidation();

  // Configurar cambio de método de pago
  setupPaymentMethodSwitch();

  // Formatear inputs automáticamente
  setupInputFormatting();

  // Agregar feedback visual en tiempo real
  setupRealTimeFeedback();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function loadOrderSummary() {
  const cart = getCart();
  const orderItemsContainer = document.getElementById("order-items");
  orderItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "d-flex align-items-center mb-3";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${
      item.name
    }" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
      <div class="flex-grow-1">
        <h6 class="mb-0">${item.name}</h6>
        <small class="text-muted">Cantidad: ${item.quantity}</small>
      </div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    `;
    orderItemsContainer.appendChild(itemDiv);
  });

  updateTotals();
}

function updateTotals() {
  const cart = getCart();
  let subtotal = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    totalItems += item.quantity;
  });

  // Calcular IVA (19%)
  const tax = subtotal * 0.19;

  // Envío (gratis para este ejemplo)
  const shipping = 0;

  // Total
  const total = subtotal + tax + shipping;

  // Actualizar DOM
  document.getElementById("total-items").textContent = totalItems;
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("tax").textContent = formatPrice(tax);
  document.getElementById("total").textContent = formatPrice(total);

  if (shipping === 0) {
    document.getElementById("shipping").innerHTML =
      '<span class="text-success fw-semibold">Gratis</span>';
  } else {
    document.getElementById("shipping").textContent = formatPrice(shipping);
  }
}

function setupFormValidation() {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("🔍 Formulario enviado, validando...");

    // Validar el método de pago seleccionado
    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked'
    ).value;
    console.log("💳 Método de pago:", paymentMethod);

    // Si es tarjeta, validar campos de tarjeta
    if (paymentMethod === "credit") {
      validateCardFields();
    }

    // Verificar validez del formulario
    const isValid = form.checkValidity();
    console.log("✅ Formulario válido:", isValid);

    if (isValid) {
      // Todo válido, procesar el pedido
      console.log("🎉 Procesando pedido...");
      processOrder();
    } else {
      // Mostrar errores de validación
      form.classList.add("was-validated");

      // Contar campos inválidos
      const invalidFields = form.querySelectorAll(":invalid");
      const errorCount = invalidFields.length;
      console.log("❌ Campos inválidos:", errorCount);
      console.log(
        "📋 Campos con error:",
        Array.from(invalidFields).map((f) => f.id || f.name)
      );

      // Mostrar alerta con los campos que faltan
      showValidationAlert(errorCount, invalidFields);

      // Scroll al primer error
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        console.log(
          "🎯 Haciendo scroll al primer campo inválido:",
          firstInvalid.id
        );
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          firstInvalid.focus();
        }, 300);
      }
    }
  });
}

function validateCardFields() {
  const cardNumber = document.getElementById("cardNumber");
  const cardName = document.getElementById("cardName");
  const expiryDate = document.getElementById("expiryDate");
  const cvv = document.getElementById("cvv");

  // Validar número de tarjeta
  if (cardNumber && cardNumber.value) {
    const cardNumberClean = cardNumber.value.replace(/\s/g, "");
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      cardNumber.setCustomValidity(
        "El número de tarjeta debe tener entre 13 y 19 dígitos"
      );
    } else {
      cardNumber.setCustomValidity("");
    }
  }

  // Validar CVV
  if (cvv && cvv.value) {
    if (cvv.value.length < 3 || cvv.value.length > 4) {
      cvv.setCustomValidity("El CVV debe tener 3 o 4 dígitos");
    } else {
      cvv.setCustomValidity("");
    }
  }

  // Validar fecha de expiración
  if (expiryDate && expiryDate.value) {
    const [month, year] = expiryDate.value.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (
      !month ||
      !year ||
      parseInt(month) < 1 ||
      parseInt(month) > 12 ||
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      expiryDate.setCustomValidity("Fecha de expiración inválida o vencida");
    } else {
      expiryDate.setCustomValidity("");
    }
  }
}

function showValidationAlert(errorCount, invalidFields) {
  // Crear lista de campos con error
  let errorList = [];
  invalidFields.forEach((field) => {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
      errorList.push(label.textContent.replace("*", "").trim());
    } else {
      errorList.push(field.name || field.id);
    }
  });

  // Crear alerta
  const alertHTML = `
    <div class="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5" 
         role="alert" style="z-index: 9999; max-width: 500px;">
      <h5 class="alert-heading">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        Por favor completa los campos requeridos
      </h5>
      <hr>
      <p class="mb-2">Se encontraron <strong>${errorCount}</strong> ${
    errorCount === 1 ? "error" : "errores"
  }:</p>
      <ul class="mb-0 ps-3">
        ${errorList.map((field) => `<li>${field}</li>`).join("")}
      </ul>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  // Eliminar alertas anteriores
  const oldAlerts = document.querySelectorAll(".alert-danger.position-fixed");
  oldAlerts.forEach((alert) => alert.remove());

  // Agregar nueva alerta
  const alertContainer = document.createElement("div");
  alertContainer.innerHTML = alertHTML;
  document.body.appendChild(alertContainer);

  // Auto-eliminar después de 8 segundos
  setTimeout(() => {
    alertContainer.remove();
  }, 8000);
}

function setupPaymentMethodSwitch() {
  const paymentMethods = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const cardSection = document.getElementById("card-payment-section");
  const paypalSection = document.getElementById("paypal-payment-section");
  const transferSection = document.getElementById("transfer-payment-section");

  // Inputs de tarjeta
  const cardInputs = cardSection.querySelectorAll("input");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      // Ocultar todas las secciones
      cardSection.style.display = "none";
      paypalSection.style.display = "none";
      transferSection.style.display = "none";

      // Deshabilitar todos los inputs de tarjeta
      cardInputs.forEach((input) => {
        input.required = false;
      });

      // Mostrar la sección seleccionada
      if (this.value === "credit") {
        cardSection.style.display = "block";
        cardInputs.forEach((input) => {
          input.required = true;
        });
      } else if (this.value === "paypal") {
        paypalSection.style.display = "block";
      } else if (this.value === "transfer") {
        transferSection.style.display = "block";
      }
    });
  });
}

function setupInputFormatting() {
  // Formatear número de tarjeta
  const cardNumberInput = document.getElementById("cardNumber");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formattedValue;
    });
  }

  // Formatear fecha de expiración
  const expiryDateInput = document.getElementById("expiryDate");
  if (expiryDateInput) {
    expiryDateInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  // Solo números en CVV
  const cvvInput = document.getElementById("cvv");
  if (cvvInput) {
    cvvInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }

  // Validar solo números en teléfono
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^0-9+\s-]/g, "");
    });
  }
}

function processOrder() {
  // Mostrar loader en el botón
  const placeOrderBtn = document.getElementById("place-order-btn");
  const originalBtnText = placeOrderBtn.innerHTML;
  placeOrderBtn.disabled = true;
  placeOrderBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...';

  // Simular procesamiento de pago (2 segundos)
  setTimeout(function () {
    // Generar número de orden
    const orderNumber = generateOrderNumber();

    // Guardar orden en localStorage
    saveOrder(orderNumber);

    // Limpiar carrito
    localStorage.removeItem("cart");
    updateCartBadge();

    // Restaurar botón
    placeOrderBtn.disabled = false;
    placeOrderBtn.innerHTML = originalBtnText;

    // Redirigir a la página de confirmación
    window.location.href = "confirmation.html";
  }, 2000);
}

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `WW-${timestamp}-${random}`;
}

function saveOrder(orderNumber) {
  const cart = getCart();
  const form = document.getElementById("checkout-form");

  const order = {
    orderNumber: orderNumber,
    date: new Date().toISOString(),
    items: cart,
    customer: {
      firstName: form.querySelector("#firstName").value,
      lastName: form.querySelector("#lastName").value,
      email: form.querySelector("#email").value,
      phone: form.querySelector("#phone").value,
    },
    shipping: {
      address: form.querySelector("#address").value,
      city: form.querySelector("#city").value,
      region: form.querySelector("#region").value,
      postalCode: form.querySelector("#postalCode").value,
    },
    payment: {
      method: document.querySelector('input[name="paymentMethod"]:checked')
        .value,
    },
    notes: form.querySelector("#orderNotes").value,
    totals: calculateOrderTotals(cart),
    status: "pending",
  };

  // Guardar en el historial de órdenes
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  return order;
}

function calculateOrderTotals(cart) {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * 0.19;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return {
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total,
  };
}

// Validaciones en tiempo real más suaves
document.getElementById("email")?.addEventListener("input", function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.value && !emailRegex.test(this.value)) {
    this.setCustomValidity(
      "Por favor ingresa un email válido (ejemplo@correo.com)"
    );
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("cardNumber")?.addEventListener("input", function () {
  const cardNumber = this.value.replace(/\s/g, "");
  // Solo validar si ya escribió algo
  if (cardNumber.length > 0 && cardNumber.length < 13) {
    this.setCustomValidity("El número debe tener al menos 13 dígitos");
  } else if (cardNumber.length > 19) {
    this.setCustomValidity("El número no puede tener más de 19 dígitos");
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("expiryDate")?.addEventListener("input", function () {
  const value = this.value;
  // Solo validar si el formato está completo
  if (value.length === 5) {
    const [month, year] = value.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!month || !year) {
      this.setCustomValidity("Formato inválido. Use MM/AA");
    } else if (parseInt(month) < 1 || parseInt(month) > 12) {
      this.setCustomValidity("El mes debe estar entre 01 y 12");
    } else if (parseInt(year) < currentYear) {
      this.setCustomValidity("La tarjeta está vencida");
    } else if (
      parseInt(year) === currentYear &&
      parseInt(month) < currentMonth
    ) {
      this.setCustomValidity("La tarjeta está vencida");
    } else {
      this.setCustomValidity("");
    }
  } else {
    this.setCustomValidity("");
  }
});

document.getElementById("cvv")?.addEventListener("input", function () {
  const cvv = this.value;
  if (cvv.length > 0 && cvv.length < 3) {
    this.setCustomValidity("El CVV debe tener al menos 3 dígitos");
  } else if (cvv.length > 4) {
    this.setCustomValidity("El CVV no puede tener más de 4 dígitos");
  } else {
    this.setCustomValidity("");
  }
});

// Feedback visual en tiempo real
function setupRealTimeFeedback() {
  const form = document.getElementById("checkout-form");
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    // Agregar clase de validación al escribir
    input.addEventListener("input", function () {
      if (this.value) {
        if (this.checkValidity()) {
          this.classList.remove("is-invalid");
          this.classList.add("is-valid");
        } else {
          this.classList.remove("is-valid");
          this.classList.add("is-invalid");
        }
      } else {
        this.classList.remove("is-valid", "is-invalid");
      }
    });

    // Validar al perder el foco
    input.addEventListener("blur", function () {
      if (this.value && this.required) {
        if (this.checkValidity()) {
          this.classList.remove("is-invalid");
          this.classList.add("is-valid");
        } else {
          this.classList.remove("is-valid");
          this.classList.add("is-invalid");
        }
      }
    });
  });
}

// Agregar tooltip de ayuda para campos con error
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    .is-valid {
      border-color: #198754 !important;
    }
    .is-invalid {
      border-color: #dc3545 !important;
    }
    .form-control.is-valid:focus,
    .form-select.is-valid:focus {
      border-color: #198754 !important;
      box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
    }
    .form-control.is-invalid:focus,
    .form-select.is-invalid:focus {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
    }
  `;
  document.head.appendChild(style);
});
