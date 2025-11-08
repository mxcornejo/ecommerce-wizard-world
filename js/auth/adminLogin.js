import { noEstaVacio } from "../shared/validators.js";

import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  mostrarMensajeExito,
  mostrarMensajeError,
} from "../shared/formHelpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-admin-login");

  inicializarAdmin();
  verificarSesionAdminActiva();

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormularioAdmin()) {
      iniciarSesionAdmin();
    }
  });
});

function validarFormularioAdmin() {
  let esValido = true;

  esValido &= validarCampoVacio("adminUsuario");
  esValido &= validarCampoVacio("adminPassword");

  return Boolean(esValido);
}

function validarCampoVacio(idCampo) {
  const campo = obtenerCampo(idCampo);

  if (!noEstaVacio(campo.value)) {
    marcarComoInvalido(campo);
    return false;
  } else {
    marcarComoValido(campo);
    return true;
  }
}

function iniciarSesionAdmin() {
  const usuario = obtenerCampo("adminUsuario").value.trim();
  const password = obtenerCampo("adminPassword").value;

  const adminGuardado = JSON.parse(localStorage.getItem("adminUsuario"));

  if (
    adminGuardado &&
    adminGuardado.usuario === usuario &&
    adminGuardado.password === password
  ) {
    const sesionAdmin = {
      usuario: adminGuardado.usuario,
      rol: "admin",
      fechaLogin: new Date().toISOString(),
    };

    sessionStorage.setItem("sesionActiva", JSON.stringify(sesionAdmin));

    mostrarMensajeExito("¡Acceso concedido! Bienvenido, Administrador 🔐");

    setTimeout(() => {
      window.location.href = "adminDashboard.html";
    }, 1000);
  } else {
    mostrarMensajeError("Credenciales incorrectas. Acceso denegado.");

    marcarComoInvalido(obtenerCampo("adminUsuario"));
    marcarComoInvalido(obtenerCampo("adminPassword"));
  }
}

function verificarSesionAdminActiva() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");

  if (sesionActiva) {
    const sesion = JSON.parse(sesionActiva);

    if (sesion.rol === "admin") {
      window.location.href = "adminDashboard.html";
    }
  }
}

function inicializarAdmin() {
  const adminExiste = localStorage.getItem("adminUsuario");

  if (!adminExiste) {
    const admin = {
      usuario: "admin",
      password: "1234",
      rol: "admin",
      fechaCreacion: new Date().toISOString(),
    };

    localStorage.setItem("adminUsuario", JSON.stringify(admin));
  }
}
