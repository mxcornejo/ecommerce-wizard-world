// Módulo de validaciones reutilizables

export function esEmailValido(email) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email.trim());
}

// Valida contraseña: mínimo 8 caracteres, una mayúscula y un número
export function esPasswordSegura(password) {
  const regexSegura = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regexSegura.test(password);
}

// Valida que la edad sea mayor o igual a 13 años
export function esMayorDe13(fechaString) {
  const fecha = new Date(fechaString);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fecha.getFullYear();

  const mesNacimiento = fecha.getMonth();
  const diaNacimiento = fecha.getDate();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  let edadReal = edad;
  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edadReal--;
  }

  return edadReal >= 13;
}

export function noEstaVacio(texto) {
  return texto.trim() !== "";
}

export function sonIguales(texto1, texto2) {
  return texto1 === texto2;
}
