// Formulario de registro

import {
  esEmailValido,
  esPasswordSegura,
  esMayorDe13,
  noEstaVacio,
  sonIguales,
} from "./validators.js";

import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  resetearFormulario,
  mostrarMensajeExito,
} from "./formHelpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-inscripcion");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormulario()) {
      mostrarMensajeExito("Formulario enviado con éxito 🥳");
      resetearFormulario(formulario);
    }
  });
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

  if (!esPasswordSegura(pass.value)) {
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
