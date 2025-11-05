// Utilidades para formularios

export function marcarComoValido(campo) {
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");
}

export function marcarComoInvalido(campo) {
  campo.classList.remove("is-valid");
  campo.classList.add("is-invalid");
}

export function limpiarEstadoValidacion(campo) {
  campo.classList.remove("is-valid", "is-invalid");
}

export function obtenerValorCampo(idCampo) {
  const campo = document.getElementById(idCampo);
  return campo ? campo.value.trim() : "";
}

export function obtenerCampo(idCampo) {
  return document.getElementById(idCampo);
}

export function resetearFormulario(formulario) {
  formulario.reset();
  formulario.querySelectorAll(".is-valid, .is-invalid").forEach((campo) => {
    limpiarEstadoValidacion(campo);
  });
}

export function mostrarMensajeExito(mensaje) {
  alert(mensaje);
}

export function mostrarMensajeError(mensaje) {
  alert(mensaje);
}
