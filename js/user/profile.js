import { soloClientes } from "../auth/authGuard.js";

let usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
  if (!soloClientes()) {
    return;
  }

  verificarSesion();

  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", cerrarSesion);
  }
});

function verificarSesion() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");

  if (!sesionActiva) {
    // No hay sesión activa, mostrar alerta
    document.getElementById("alerta-no-sesion").style.display = "block";
    document.getElementById("card-perfil").style.display = "none";
    return;
  }

  usuarioActual = JSON.parse(sesionActiva);

  // Cargar datos del usuario
  cargarDatosUsuario();

  // Mostrar el perfil
  document.getElementById("alerta-no-sesion").style.display = "none";
  document.getElementById("card-perfil").style.display = "block";

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
    // Nombre completo
    const nombreElemento = document.getElementById("perfil-nombre");
    if (nombreElemento) {
      nombreElemento.textContent = usuarioCompleto.nombre || "Usuario";
    }

    // Nombre de usuario
    const usuarioElemento = document.getElementById("perfil-usuario");
    if (usuarioElemento) {
      usuarioElemento.textContent = `@${usuarioCompleto.usuario || "usuario"}`;
    }

    // Email
    const emailElemento = document.getElementById("perfil-email");
    if (emailElemento) {
      emailElemento.textContent = usuarioCompleto.email || "No disponible";
    }

    // Fecha de nacimiento
    const fechaElemento = document.getElementById("perfil-fecha");
    if (fechaElemento && usuarioCompleto.fechaNacimiento) {
      fechaElemento.textContent = formatearFecha(
        usuarioCompleto.fechaNacimiento
      );
    }

    // Edad
    const edadElemento = document.getElementById("perfil-edad");
    if (edadElemento && usuarioCompleto.fechaNacimiento) {
      const edad = calcularEdad(usuarioCompleto.fechaNacimiento);
      edadElemento.textContent = `${edad} años`;
    }

    // Comentarios
    if (usuarioCompleto.comentarios && usuarioCompleto.comentarios.trim()) {
      const comentariosElemento = document.getElementById("perfil-comentarios");
      const comentariosContainer = document.getElementById(
        "perfil-comentarios-container"
      );
      if (comentariosElemento && comentariosContainer) {
        comentariosElemento.textContent = usuarioCompleto.comentarios;
        comentariosContainer.style.display = "block";
      }
    }

    // Fecha de registro (si existe)
    if (usuarioCompleto.fechaRegistro) {
      const registroElemento = document.getElementById("perfil-registro");
      if (registroElemento) {
        registroElemento.textContent = formatearFechaCompleta(
          usuarioCompleto.fechaRegistro
        );
      }
    }
  }
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function formatearFecha(fecha) {
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatearFechaCompleta(fecha) {
  const date = new Date(fecha);
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("es-ES", opciones);
}

function actualizarMenuUsuario() {
  const userMenu = document.getElementById("user-menu");
  if (userMenu && usuarioActual) {
    userMenu.innerHTML = `
      <div class="dropdown ms-3">
        <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-person-circle me-1"></i>${
            usuarioActual.nombre || usuarioActual.usuario || "Usuario"
          }
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Mi Perfil</a></li>
          <li><a class="dropdown-item" href="editProfile.html"><i class="bi bi-pencil-square me-2"></i>Editar Perfil</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="menu-cerrar-sesion"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
        </ul>
      </div>
    `;

    // Agregar evento al botón de cerrar sesión del menú
    const menuCerrarSesion = document.getElementById("menu-cerrar-sesion");
    if (menuCerrarSesion) {
      menuCerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
      });
    }
  }
}

function cerrarSesion() {
  // Confirmar antes de cerrar sesión
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    // Limpiar la sesión
    sessionStorage.removeItem("sesionActiva");

    // Mostrar mensaje
    alert("Sesión cerrada exitosamente");

    // Redirigir a la página de inicio
    window.location.href = "../../index.html";
  }
}
