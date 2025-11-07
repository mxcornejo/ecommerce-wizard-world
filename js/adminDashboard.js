import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  mostrarMensajeExito,
  mostrarMensajeError,
} from "./formHelpers.js";

import { noEstaVacio, esEmailValido } from "./validators.js";

let clientes = [];
let clienteSeleccionadoId = null;

document.addEventListener("DOMContentLoaded", () => {
  verificarAccesoAdmin();
  cargarClientes();

  document
    .getElementById("btn-cerrar-sesion")
    .addEventListener("click", cerrarSesion);

  document
    .getElementById("btn-recargar")
    .addEventListener("click", cargarClientes);

  document
    .getElementById("buscar-cliente")
    .addEventListener("input", filtrarClientes);

  document
    .getElementById("btn-guardar-cambios")
    .addEventListener("click", guardarCambiosCliente);

  document
    .getElementById("btn-confirmar-eliminar")
    .addEventListener("click", confirmarEliminarCliente);

  mostrarNombreAdmin();
});

function verificarAccesoAdmin() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");

  if (!sesionActiva) {
    window.location.href = "adminLogin.html";
    return;
  }

  const sesion = JSON.parse(sesionActiva);

  if (sesion.rol !== "admin") {
    alert("Acceso denegado. No tienes permisos de administrador.");
    window.location.href = "../index.html";
  }
}

function mostrarNombreAdmin() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  if (sesionActiva) {
    const sesion = JSON.parse(sesionActiva);
    document.getElementById("nombre-admin").textContent =
      sesion.usuario || "Administrador";
  }
}

function cargarClientes() {
  clientes = JSON.parse(localStorage.getItem("usuarios")) || [];
  actualizarEstadisticas();
  renderizarTablaClientes(clientes);
}

function actualizarEstadisticas() {
  document.getElementById("total-clientes").textContent = clientes.length;

  const hoy = new Date().toDateString();
  const registrosHoy = clientes.filter((cliente) => {
    const fechaRegistro = new Date(cliente.fechaRegistro).toDateString();
    return fechaRegistro === hoy;
  }).length;

  document.getElementById("registros-hoy").textContent = registrosHoy;

  const ahora = new Date();
  document.getElementById("ultima-actualizacion").textContent =
    ahora.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
}

function renderizarTablaClientes(clientesFiltrados) {
  const tbody = document.getElementById("tabla-clientes");

  if (clientesFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="mt-2 text-muted">No hay clientes registrados</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = clientesFiltrados
    .map((cliente) => {
      const fechaRegistro = new Date(cliente.fechaRegistro).toLocaleDateString(
        "es-ES",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );

      return `
      <tr>
        <td>${cliente.id}</td>
        <td>
          <i class="bi bi-person-circle text-primary me-2"></i>
          ${cliente.nombre}
        </td>
        <td>${cliente.usuario}</td>
        <td>
          <i class="bi bi-envelope me-2"></i>
          ${cliente.email}
        </td>
        <td>${fechaRegistro}</td>
        <td class="text-center">
          <button
            class="btn btn-sm btn-primary me-2"
            onclick="abrirModalEditar(${cliente.id})"
            title="Editar cliente"
          >
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button
            class="btn btn-sm btn-danger"
            onclick="abrirModalEliminar(${cliente.id})"
            title="Eliminar cliente"
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function filtrarClientes(e) {
  const textoBusqueda = e.target.value.toLowerCase().trim();

  if (!textoBusqueda) {
    renderizarTablaClientes(clientes);
    return;
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    return (
      cliente.nombre.toLowerCase().includes(textoBusqueda) ||
      cliente.usuario.toLowerCase().includes(textoBusqueda) ||
      cliente.email.toLowerCase().includes(textoBusqueda)
    );
  });

  renderizarTablaClientes(clientesFiltrados);
}

window.abrirModalEditar = function (id) {
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    mostrarMensajeError("Cliente no encontrado");
    return;
  }

  clienteSeleccionadoId = id;

  obtenerCampo("edit-id").value = cliente.id;
  obtenerCampo("edit-nombre").value = cliente.nombre;
  obtenerCampo("edit-usuario").value = cliente.usuario;
  obtenerCampo("edit-email").value = cliente.email;
  obtenerCampo("edit-fechaNacimiento").value = cliente.fechaNacimiento;
  obtenerCampo("edit-comentarios").value = cliente.comentarios || "";

  const modal = new bootstrap.Modal(
    document.getElementById("modalEditarCliente")
  );
  modal.show();
};

window.abrirModalEliminar = function (id) {
  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    mostrarMensajeError("Cliente no encontrado");
    return;
  }

  clienteSeleccionadoId = id;

  document.getElementById(
    "nombre-cliente-eliminar"
  ).textContent = `${cliente.nombre} (${cliente.email})`;

  const modal = new bootstrap.Modal(
    document.getElementById("modalEliminarCliente")
  );
  modal.show();
};

function guardarCambiosCliente() {
  if (!validarFormularioEdicion()) {
    return;
  }

  const nombre = obtenerCampo("edit-nombre").value.trim();
  const usuario = obtenerCampo("edit-usuario").value.trim();
  const email = obtenerCampo("edit-email").value.trim();
  const fechaNacimiento = obtenerCampo("edit-fechaNacimiento").value;
  const comentarios = obtenerCampo("edit-comentarios").value.trim();

  const indice = clientes.findIndex((c) => c.id === clienteSeleccionadoId);

  if (indice === -1) {
    mostrarMensajeError("Error al actualizar cliente");
    return;
  }

  clientes[indice] = {
    ...clientes[indice],
    nombre,
    usuario,
    email,
    fechaNacimiento,
    comentarios,
    fechaModificacion: new Date().toISOString(),
  };

  localStorage.setItem("usuarios", JSON.stringify(clientes));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalEditarCliente")
  );
  modal.hide();

  cargarClientes();
  mostrarMensajeExito("Cliente actualizado correctamente ✅");
}

function confirmarEliminarCliente() {
  const indice = clientes.findIndex((c) => c.id === clienteSeleccionadoId);

  if (indice === -1) {
    mostrarMensajeError("Error al eliminar cliente");
    return;
  }

  clientes.splice(indice, 1);
  localStorage.setItem("usuarios", JSON.stringify(clientes));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalEliminarCliente")
  );
  modal.hide();

  cargarClientes();
  mostrarMensajeExito("Cliente eliminado correctamente 🗑️");
}

function validarFormularioEdicion() {
  let esValido = true;

  const nombre = obtenerCampo("edit-nombre");
  if (!noEstaVacio(nombre.value)) {
    marcarComoInvalido(nombre);
    esValido = false;
  } else {
    marcarComoValido(nombre);
  }

  const usuario = obtenerCampo("edit-usuario");
  if (!noEstaVacio(usuario.value)) {
    marcarComoInvalido(usuario);
    esValido = false;
  } else {
    marcarComoValido(usuario);
  }

  const email = obtenerCampo("edit-email");
  if (!esEmailValido(email.value)) {
    marcarComoInvalido(email);
    esValido = false;
  } else {
    marcarComoValido(email);
  }

  const fechaNacimiento = obtenerCampo("edit-fechaNacimiento");
  if (!noEstaVacio(fechaNacimiento.value)) {
    marcarComoInvalido(fechaNacimiento);
    esValido = false;
  } else {
    marcarComoValido(fechaNacimiento);
  }

  return esValido;
}

function cerrarSesion() {
  const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");

  if (confirmar) {
    sessionStorage.removeItem("sesionActiva");
    localStorage.removeItem("ultimaSesion");
    window.location.href = "adminLogin.html";
  }
}
