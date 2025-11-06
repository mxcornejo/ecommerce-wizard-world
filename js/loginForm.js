// Formulario de inicio de sesión

import { noEstaVacio } from "./validators.js";

import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  mostrarMensajeExito,
  mostrarMensajeError,
} from "./formHelpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-login");

  // Verificar si ya hay una sesión activa
  verificarSesionActiva();

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormularioLogin()) {
      iniciarSesion();
    }
  });
});

function validarFormularioLogin() {
  let esValido = true;

  esValido &= validarCampoVacio("emailUsuario");
  esValido &= validarCampoVacio("password");

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

function iniciarSesion() {
  const emailUsuario = obtenerCampo("emailUsuario").value.trim();
  const password = obtenerCampo("password").value;
  const recordarme = obtenerCampo("recordarme").checked;

  // Obtener usuarios registrados desde localStorage
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];

  // Buscar usuario por email o nombre de usuario
  const usuarioEncontrado = usuariosRegistrados.find(
    (user) =>
      (user.email === emailUsuario || user.usuario === emailUsuario) &&
      user.password === password
  );

  if (usuarioEncontrado) {
    // Crear objeto de sesión
    const sesionUsuario = {
      id: usuarioEncontrado.id || Date.now(),
      nombre: usuarioEncontrado.nombre,
      usuario: usuarioEncontrado.usuario,
      email: usuarioEncontrado.email,
      fechaLogin: new Date().toISOString(),
      recordarme: recordarme,
    };

    // Guardar sesión en sessionStorage
    sessionStorage.setItem("sesionActiva", JSON.stringify(sesionUsuario));

    // Si marcó "recordarme", también guardar en localStorage
    if (recordarme) {
      localStorage.setItem("ultimaSesion", JSON.stringify(sesionUsuario));
    }

    mostrarMensajeExito(
      `¡Bienvenido de vuelta, ${usuarioEncontrado.nombre}! 🎮`
    );

    // Redirigir a la página principal después de 1 segundo
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
  } else {
    mostrarMensajeError(
      "Usuario o contraseña incorrectos. Por favor, intenta de nuevo."
    );

    // Marcar campos como inválidos
    marcarComoInvalido(obtenerCampo("emailUsuario"));
    marcarComoInvalido(obtenerCampo("password"));
  }
}

function verificarSesionActiva() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");

  if (sesionActiva) {
    const sesion = JSON.parse(sesionActiva);

    // Si ya hay sesión activa, preguntar si quiere continuar
    const continuar = confirm(
      `Ya tienes una sesión activa como ${sesion.usuario}. ¿Deseas continuar a la página principal?`
    );

    if (continuar) {
      window.location.href = "../index.html";
    } else {
      // Cerrar sesión actual
      sessionStorage.removeItem("sesionActiva");
    }
  }
}

// Función para cerrar sesión (puede ser llamada desde otras páginas)
export function cerrarSesion() {
  sessionStorage.removeItem("sesionActiva");
  localStorage.removeItem("ultimaSesion");
  window.location.href = "../pages/singIn.html";
}

// Función para obtener usuario de la sesión activa
export function obtenerUsuarioSesion() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  return sesionActiva ? JSON.parse(sesionActiva) : null;
}
