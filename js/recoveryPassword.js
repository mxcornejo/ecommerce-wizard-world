// Formulario de recuperación de contraseña

import {
  esEmailValido,
  noEstaVacio,
  sonIguales,
  validarPasswordCompleta,
} from "./validators.js";

import {
  marcarComoValido,
  marcarComoInvalido,
  obtenerCampo,
  mostrarMensajeExito,
  mostrarMensajeError,
} from "./formHelpers.js";

let codigoGenerado = null;
let emailRecuperacion = null;

document.addEventListener("DOMContentLoaded", () => {
  const formularioEmail = document.getElementById(
    "formulario-solicitar-codigo"
  );
  const formularioCambio = document.getElementById(
    "formulario-cambiar-password"
  );

  formularioEmail.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validarEmailForm()) {
      enviarCodigoRecuperacion();
    }
  });

  formularioCambio.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validarFormularioCambio()) {
      cambiarPassword();
    }
  });

  // Validación en tiempo real de la contraseña
  const nuevaPassword = obtenerCampo("nuevaPassword");
  if (nuevaPassword) {
    nuevaPassword.addEventListener("input", function () {
      mostrarValidacionPassword(this.value);
    });
  }
});

function validarEmailForm() {
  const email = obtenerCampo("email");

  if (!esEmailValido(email.value)) {
    marcarComoInvalido(email);
    return false;
  } else {
    marcarComoValido(email);
    return true;
  }
}

function enviarCodigoRecuperacion() {
  const email = obtenerCampo("email").value.trim();

  // Verificar si el email existe en usuarios registrados
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioExiste = usuariosRegistrados.find(
    (user) => user.email === email
  );

  if (!usuarioExiste) {
    mostrarMensajeError(
      "No existe una cuenta registrada con este correo electrónico."
    );
    marcarComoInvalido(obtenerCampo("email"));
    return;
  }

  // Generar código de 6 dígitos
  codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
  emailRecuperacion = email;

  // En un sistema real, aquí se enviaría el código por email
  console.log("Código de recuperación:", codigoGenerado);

  // Guardar código temporalmente (expira en 10 minutos)
  const codigoRecuperacion = {
    email: email,
    codigo: codigoGenerado,
    timestamp: Date.now(),
    expira: Date.now() + 10 * 60 * 1000, // 10 minutos
  };
  localStorage.setItem(
    "codigoRecuperacion",
    JSON.stringify(codigoRecuperacion)
  );

  // Mostrar el siguiente paso
  document.getElementById("paso-email").style.display = "none";
  document.getElementById("paso-nueva-password").style.display = "block";

  // Simulación: mostrar el código en consola (en producción se enviaría por email)
  alert(
    `📧 Código de verificación enviado a ${email}\n\n(Modo desarrollo: ${codigoGenerado})`
  );
}

function validarFormularioCambio() {
  let esValido = true;

  const codigo = obtenerCampo("codigoVerificacion");
  const nuevaPass = obtenerCampo("nuevaPassword");
  const confirmarPass = obtenerCampo("confirmarNuevaPassword");

  // Validar código
  const codigoGuardado = JSON.parse(localStorage.getItem("codigoRecuperacion"));

  if (
    !codigoGuardado ||
    codigo.value !== codigoGuardado.codigo ||
    Date.now() > codigoGuardado.expira
  ) {
    marcarComoInvalido(codigo);
    mostrarMensajeError(
      "Código inválido o expirado. Por favor, solicita uno nuevo."
    );
    esValido = false;
  } else {
    marcarComoValido(codigo);
  }

  // Validar nueva contraseña
  const validacion = validarPasswordCompleta(nuevaPass.value);
  if (!validacion.esValida) {
    marcarComoInvalido(nuevaPass);
    esValido = false;
  } else {
    marcarComoValido(nuevaPass);
  }

  // Validar confirmación
  if (!sonIguales(nuevaPass.value, confirmarPass.value)) {
    marcarComoInvalido(confirmarPass);
    esValido = false;
  } else {
    marcarComoValido(confirmarPass);
  }

  return esValido;
}

function cambiarPassword() {
  const nuevaPassword = obtenerCampo("nuevaPassword").value;
  const codigoGuardado = JSON.parse(localStorage.getItem("codigoRecuperacion"));

  // Obtener usuarios y actualizar contraseña
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];
  const indiceUsuario = usuariosRegistrados.findIndex(
    (user) => user.email === codigoGuardado.email
  );

  if (indiceUsuario !== -1) {
    usuariosRegistrados[indiceUsuario].password = nuevaPassword;
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

    // Limpiar código de recuperación
    localStorage.removeItem("codigoRecuperacion");

    mostrarMensajeExito(
      "¡Contraseña cambiada exitosamente! Redirigiendo al inicio de sesión..."
    );

    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = "singIn.html";
    }, 2000);
  } else {
    mostrarMensajeError("Error al cambiar la contraseña. Intenta nuevamente.");
  }
}

function mostrarValidacionPassword(password) {
  const validacion = validarPasswordCompleta(password);

  actualizarCheckIcon("check-longitud-min", validacion.longitudMinima);
  actualizarCheckIcon("check-longitud-max", validacion.longitudMaxima);
  actualizarCheckIcon("check-mayusculas", validacion.mayusculas);
  actualizarCheckIcon("check-numeros", validacion.numeros);
  actualizarCheckIcon("check-especiales", validacion.caracteresEspeciales);
}

function actualizarCheckIcon(idElemento, esValido) {
  const elemento = document.getElementById(idElemento);
  if (!elemento) return;

  const icon = elemento.querySelector("i");

  if (esValido) {
    icon.className = "bi bi-check-circle text-success";
    elemento.classList.remove("text-danger");
    elemento.classList.add("text-success");
  } else {
    icon.className = "bi bi-x-circle text-danger";
    elemento.classList.remove("text-success");
    elemento.classList.add("text-danger");
  }
}
