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

  // Detectar si estamos en una subcarpeta de pages (auth, user, products, cart, admin)
  const path = window.location.pathname;
  const isInPagesSubfolder =
    path.includes("/pages/auth/") ||
    path.includes("/pages/user/") ||
    path.includes("/pages/products/") ||
    path.includes("/pages/cart/") ||
    path.includes("/pages/admin/");

  const profilePath = isInPagesSubfolder
    ? "../user/profile.html"
    : "pages/user/profile.html";
  const editProfilePath = isInPagesSubfolder
    ? "../user/editProfile.html"
    : "pages/user/editProfile.html";

  userMenu.innerHTML = `
    <div class="dropdown ms-3">
      <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-person-circle me-1"></i>${nombreMostrar}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="${profilePath}"><i class="bi bi-person me-2"></i>Mi Perfil</a></li>
        <li><a class="dropdown-item" href="${editProfilePath}"><i class="bi bi-gear me-2"></i>Editar Perfil</a></li>
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

  // Detectar si estamos en una subcarpeta de pages (auth, user, products, cart, admin)
  const path = window.location.pathname;
  const isInPagesSubfolder =
    path.includes("/pages/auth/") ||
    path.includes("/pages/user/") ||
    path.includes("/pages/products/") ||
    path.includes("/pages/cart/") ||
    path.includes("/pages/admin/");

  const signInPath = isInPagesSubfolder
    ? "../auth/signIn.html"
    : "pages/auth/signIn.html";
  const signUpPath = isInPagesSubfolder
    ? "../auth/signUp.html"
    : "pages/auth/signUp.html";

  userMenu.innerHTML = `
    <div class="ms-3">
      <a href="${signInPath}" class="btn btn-outline-primary me-2">
        <i class="bi bi-box-arrow-in-right me-1"></i>Iniciar Sesión
      </a>
      <a href="${signUpPath}" class="btn btn-primary">
        <i class="bi bi-person-plus me-1"></i>Registrarse
      </a>
    </div>
  `;
}

function cerrarSesionNavbar() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    sessionStorage.removeItem("sesionActiva");
    alert("Sesión cerrada exitosamente");

    // Detectar si estamos en una subcarpeta de pages (auth, user, products, cart, admin) o en la raíz
    const isInPagesSubfolder =
      window.location.pathname.includes("/pages/auth/") ||
      window.location.pathname.includes("/pages/user/") ||
      window.location.pathname.includes("/pages/products/") ||
      window.location.pathname.includes("/pages/cart/") ||
      window.location.pathname.includes("/pages/admin/");
    const indexPath = isInPagesSubfolder ? "../../index.html" : "index.html";

    window.location.href = indexPath;
  }
}
