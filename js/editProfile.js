// Formulario de edición de perfil

import {
  esEmailValido,
  esMayorDe13,
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

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay sesión activa
  verificarSesion();

  const formulario = document.getElementById("formulario-editar-perfil");

  if (formulario) {
    formulario.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validarFormulario()) {
        guardarCambios();
      }
    });
  }

  // Validación en tiempo real de la nueva contraseña
  const passwordNueva = obtenerCampo("passwordNueva");
  if (passwordNueva) {
    passwordNueva.addEventListener("input", function () {
      if (this.value.length > 0) {
        document.getElementById("password-checks").style.display = "block";
        mostrarValidacionPassword(this.value);
      } else {
        document.getElementById("password-checks").style.display = "none";
      }
    });
  }

  // Botón cerrar sesión
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", cerrarSesion);
  }
});

function verificarSesion() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");

  if (!sesionActiva) {
    // No hay sesión activa
    document.getElementById("alerta-no-sesion").style.display = "block";
    document.getElementById("card-perfil").style.display = "none";
    return;
  }

  usuarioActual = JSON.parse(sesionActiva);

  // Cargar datos del usuario
  cargarDatosUsuario();

  // Mostrar botón de cerrar sesión
  document.getElementById("btn-cerrar-sesion").style.display = "block";

  // Mostrar nombre de usuario en el menú
  actualizarMenuUsuario();
}

function cargarDatosUsuario() {
  // Obtener datos completos del usuario desde localStorage
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioCompleto = usuariosRegistrados.find(
    (user) => user.email === usuarioActual.email
  );

  if (usuarioCompleto) {
    obtenerCampo("nombre").value = usuarioCompleto.nombre || "";
    obtenerCampo("usuario").value = usuarioCompleto.usuario || "";
    obtenerCampo("email").value = usuarioCompleto.email || "";
    obtenerCampo("fechaNacimiento").value =
      usuarioCompleto.fechaNacimiento || "";
    obtenerCampo("comentarios").value = usuarioCompleto.comentarios || "";
  }
}

function actualizarMenuUsuario() {
  const userMenu = document.getElementById("user-menu");
  if (userMenu && usuarioActual) {
    userMenu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle me-1"></i>${usuarioActual.usuario}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUser">
          <li><a class="dropdown-item" href="editarPerfil.html"><i class="bi bi-gear me-2"></i>Editar perfil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="menu-cerrar-sesion"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    // Agregar evento al botón de cerrar sesión del menú
    document
      .getElementById("menu-cerrar-sesion")
      .addEventListener("click", function (e) {
        e.preventDefault();
        cerrarSesion();
      });
  }
}

function validarFormulario() {
  let esValido = true;

  // Validar campos básicos
  esValido &= validarCampoVacio("nombre");
  esValido &= validarCampoVacio("usuario");
  esValido &= validarEmail("email");
  esValido &= validarFechaNacimiento("fechaNacimiento");

  // Validar contraseña solo si se está intentando cambiar
  const passwordActual = obtenerCampo("passwordActual").value;
  const passwordNueva = obtenerCampo("passwordNueva").value;
  const passwordConfirmar = obtenerCampo("passwordConfirmar").value;

  if (passwordActual || passwordNueva || passwordConfirmar) {
    esValido &= validarCambioPassword(
      passwordActual,
      passwordNueva,
      passwordConfirmar
    );
  }

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

function validarCambioPassword(
  passwordActual,
  passwordNueva,
  passwordConfirmar
) {
  let valido = true;

  // Obtener contraseña actual del usuario
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuariosRegistrados.find(
    (user) => user.email === usuarioActual.email
  );

  // Verificar contraseña actual
  if (passwordActual !== usuario.password) {
    marcarComoInvalido(obtenerCampo("passwordActual"));
    mostrarMensajeError("La contraseña actual es incorrecta.");
    valido = false;
  } else {
    marcarComoValido(obtenerCampo("passwordActual"));
  }

  // Validar nueva contraseña
  const validacion = validarPasswordCompleta(passwordNueva);
  if (!validacion.esValida) {
    marcarComoInvalido(obtenerCampo("passwordNueva"));
    valido = false;
  } else {
    marcarComoValido(obtenerCampo("passwordNueva"));
  }

  // Validar confirmación
  if (!sonIguales(passwordNueva, passwordConfirmar)) {
    marcarComoInvalido(obtenerCampo("passwordConfirmar"));
    valido = false;
  } else {
    marcarComoValido(obtenerCampo("passwordConfirmar"));
  }

  return valido;
}

function guardarCambios() {
  const nombre = obtenerCampo("nombre").value.trim();
  const usuario = obtenerCampo("usuario").value.trim();
  const email = obtenerCampo("email").value.trim();
  const fechaNacimiento = obtenerCampo("fechaNacimiento").value;
  const comentarios = obtenerCampo("comentarios").value.trim();
  const passwordNueva = obtenerCampo("passwordNueva").value;

  // Obtener usuarios registrados
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];
  const indiceUsuario = usuariosRegistrados.findIndex(
    (user) => user.email === usuarioActual.email
  );

  if (indiceUsuario !== -1) {
    // Actualizar datos
    usuariosRegistrados[indiceUsuario].nombre = nombre;
    usuariosRegistrados[indiceUsuario].usuario = usuario;
    usuariosRegistrados[indiceUsuario].email = email;
    usuariosRegistrados[indiceUsuario].fechaNacimiento = fechaNacimiento;
    usuariosRegistrados[indiceUsuario].comentarios = comentarios;

    // Actualizar contraseña si se proporcionó una nueva
    if (passwordNueva) {
      usuariosRegistrados[indiceUsuario].password = passwordNueva;
    }

    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

    // Actualizar sesión activa
    const sesionActualizada = {
      ...usuarioActual,
      nombre: nombre,
      usuario: usuario,
      email: email,
    };
    sessionStorage.setItem("sesionActiva", JSON.stringify(sesionActualizada));

    mostrarMensajeExito("¡Perfil actualizado exitosamente! 🎉");

    // Recargar datos
    usuarioActual = sesionActualizada;
    actualizarMenuUsuario();

    // Limpiar campos de contraseña
    obtenerCampo("passwordActual").value = "";
    obtenerCampo("passwordNueva").value = "";
    obtenerCampo("passwordConfirmar").value = "";
    document.getElementById("password-checks").style.display = "none";
  } else {
    mostrarMensajeError("Error al actualizar el perfil. Intenta nuevamente.");
  }
}

function cerrarSesion() {
  const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");

  if (confirmar) {
    sessionStorage.removeItem("sesionActiva");
    localStorage.removeItem("ultimaSesion");
    mostrarMensajeExito("Sesión cerrada correctamente. ¡Hasta pronto! 👋");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);
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
