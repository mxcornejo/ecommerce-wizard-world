// Formulario de registro

import {
  esEmailValido,
  esPasswordSegura,
  esMayorDe13,
  noEstaVacio,
  sonIguales,
  validarPasswordCompleta,
} from "../shared/validators.js";

import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  resetearFormulario,
  mostrarMensajeExito,
} from "../shared/formHelpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-inscripcion");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormulario()) {
      const usuarioCreado = guardarUsuario();

      // Iniciar sesión automáticamente
      iniciarSesionAutomatica(usuarioCreado);

      mostrarMensajeExito("¡Registro exitoso! Bienvenido a Wizard World 🥳");

      // Redirigir al inicio después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    }
  });

  // Validación en tiempo real de la contraseña
  const passwordField = obtenerCampo("password");
  if (passwordField) {
    passwordField.addEventListener("input", function () {
      mostrarValidacionPasswordEnTiempoReal(this.value);
    });
  }
});

function validarFormulario() {
  let esValido = true;

  esValido &= validarCampoVacio("nombre");
  esValido &= validarCampoVacio("usuario");
  esValido &= validarEmail("email");
  esValido &= validarFechaNacimiento("fechaNacimiento");
  esValido &= validarPassword("password", "confirmarPassword");

  return Boolean(esValido);
}

function guardarUsuario() {
  const usuario = {
    id: Date.now(),
    nombre: obtenerCampo("nombre").value.trim(),
    usuario: obtenerCampo("usuario").value.trim(),
    email: obtenerCampo("email").value.trim(),
    fechaNacimiento: obtenerCampo("fechaNacimiento").value,
    password: obtenerCampo("password").value,
    comentarios: obtenerCampo("comentarios").value.trim(),
    fechaRegistro: new Date().toISOString(),
  };

  // Obtener usuarios existentes o crear array vacío
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];

  // Agregar nuevo usuario
  usuariosRegistrados.push(usuario);

  // Guardar en localStorage
  localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

  // Retornar el usuario creado para iniciar sesión
  return usuario;
}

function iniciarSesionAutomatica(usuario) {
  // Crear objeto de sesión
  const sesionUsuario = {
    id: usuario.id,
    nombre: usuario.nombre,
    usuario: usuario.usuario,
    email: usuario.email,
    fechaLogin: new Date().toISOString(),
    recordarme: false,
  };

  // Guardar sesión en sessionStorage
  sessionStorage.setItem("sesionActiva", JSON.stringify(sesionUsuario));
}

function mostrarValidacionPasswordEnTiempoReal(password) {
  // Esta función se puede usar si se agregan indicadores visuales en el HTML
  const validacion = validarPasswordCompleta(password);

  // Aquí puedes agregar código para actualizar indicadores visuales si existen
  // Por ejemplo, cambiar colores de checkmarks como en recoverPassword.html
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

function validarEmail(idCampo) {
  const campo = obtenerCampo(idCampo);

  if (!esEmailValido(campo.value)) {
    marcarComoInvalido(campo);
    return false;
  } else {
    marcarComoValido(campo);
    return true;
  }
}

function validarFechaNacimiento(idCampo) {
  const campo = obtenerCampo(idCampo);

  if (!esMayorDe13(campo.value)) {
    marcarComoInvalido(campo);
    return false;
  } else {
    marcarComoValido(campo);
    return true;
  }
}

function validarPassword(idPassword, idConfirmar) {
  const pass = obtenerCampo(idPassword);
  const confirm = obtenerCampo(idConfirmar);

  let valido = true;

  // Usar validación completa con 4 criterios
  const validacion = validarPasswordCompleta(pass.value);

  if (!validacion.esValida) {
    marcarComoInvalido(pass);
    valido = false;
  } else {
    marcarComoValido(pass);
  }

  if (!sonIguales(pass.value, confirm.value) || !noEstaVacio(confirm.value)) {
    marcarComoInvalido(confirm);
    valido = false;
  } else {
    marcarComoValido(confirm);
  }

  return valido;
}
