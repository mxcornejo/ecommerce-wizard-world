// Gestión del menú de usuario en el navbar

document.addEventListener("DOMContentLoaded", () => {
  actualizarNavbarUsuario();
});

function actualizarNavbarUsuario() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  const userMenu = document.getElementById("user-menu");

  if (!userMenu) return;

  if (sesionActiva) {
    const usuario = JSON.parse(sesionActiva);
    mostrarMenuUsuario(usuario);
  } else {
    mostrarBotonesAcceso();
  }
}

function mostrarMenuUsuario(usuario) {
  const userMenu = document.getElementById("user-menu");
  const nombreMostrar = usuario.nombre || usuario.usuario || "Usuario";

  userMenu.innerHTML = `
    <div class="dropdown ms-3">
      <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-1"></i>${nombreMostrar}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="pages/profile.html"><i class="bi bi-person me-2"></i>Mi Perfil</a></li>
        <li><a class="dropdown-item" href="pages/editProfile.html"><i class="bi bi-gear me-2"></i>Editar Perfil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" id="navbar-cerrar-sesion"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
      </ul>
    </div>
  `;

  // Agregar evento al botón de cerrar sesión
  const btnCerrarSesion = document.getElementById("navbar-cerrar-sesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesionNavbar();
    });
  }
}

function mostrarBotonesAcceso() {
  const userMenu = document.getElementById("user-menu");

  userMenu.innerHTML = `
    <div class="ms-3">
      <a href="pages/signIn.html" class="btn btn-outline-primary me-2">
        <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar Sesión
      </a>
      <a href="pages/signUp.html" class="btn btn-primary">
        <i class="bi bi-person-plus me-1"></i>Registrarse
      </a>
    </div>
  `;
}

function cerrarSesionNavbar() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    sessionStorage.removeItem("sesionActiva");
    alert("Sesión cerrada exitosamente");
    window.location.href = "index.html";
  }
}
