export function obtenerSesionActiva() {
  const sesionActiva = sessionStorage.getItem("sesionActiva");
  return sesionActiva ? JSON.parse(sesionActiva) : null;
}

export function esAdmin() {
  const sesion = obtenerSesionActiva();
  return sesion && sesion.rol === "admin";
}

export function esCliente() {
  const sesion = obtenerSesionActiva();
  return sesion && sesion.rol === "cliente";
}

export function requiereAutenticacion(tipoAcceso = "cliente") {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    if (tipoAcceso === "admin") {
      alert(
        "Debes iniciar sesión como administrador para acceder a esta página."
      );
      window.location.href = "adminLogin.html";
    } else {
      alert("Debes iniciar sesión para acceder a esta página.");
      window.location.href = "signIn.html";
    }
    return false;
  }

  return true;
}

export function soloAdmin() {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    alert(
      "Debes iniciar sesión como administrador para acceder a esta página."
    );
    window.location.href = "adminLogin.html";
    return false;
  }

  if (sesion.rol !== "admin") {
    alert("Acceso denegado. Esta página es solo para administradores.");
    window.location.href = "../index.html";
    return false;
  }

  return true;
}

export function soloClientes() {
  const sesion = obtenerSesionActiva();

  if (!sesion) {
    alert("Debes iniciar sesión para acceder a esta página.");
    window.location.href = "signIn.html";
    return false;
  }

  if (sesion.rol === "admin") {
    alert("Los administradores no pueden acceder a esta sección de clientes.");
    window.location.href = "adminDashboard.html";
    return false;
  }

  return true;
}

export function cerrarSesion() {
  const sesion = obtenerSesionActiva();

  sessionStorage.removeItem("sesionActiva");
  localStorage.removeItem("ultimaSesion");

  if (sesion && sesion.rol === "admin") {
    window.location.href = "adminLogin.html";
  } else {
    window.location.href = "signIn.html";
  }
}

export function prevenirnAccesoConSesion(tipoPagina = "cliente") {
  const sesion = obtenerSesionActiva();

  if (sesion) {
    if (tipoPagina === "admin" && sesion.rol === "admin") {
      window.location.href = "adminDashboard.html";
      return false;
    } else if (tipoPagina === "cliente" && sesion.rol === "cliente") {
      window.location.href = "../index.html";
      return false;
    }
  }

  return true;
}
