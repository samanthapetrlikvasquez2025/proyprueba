"use strict";

/*
 * IMPORTANTE: AUTENTICACIÓN SIMULADA EXCLUSIVAMENTE DIDÁCTICA.
 * Las credenciales están visibles en el código fuente del navegador.
 * Esto NO constituye un mecanismo seguro de autenticación.
 * Una aplicación real debe autenticar en un servidor seguro (HTTPS),
 * almacenar hashes de contraseñas y gestionar sesiones protegidas.
 */
const DEMO_EMAIL = "demo@ejemplo.com";
const DEMO_PASSWORD = "Demo1234!";
const REMEMBER_KEY = "aulaDigital.rememberedEmail";

// 1. Acceder a los elementos HTML mediante el DOM.
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const rememberEmail = document.querySelector("#remember-email");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formMessage = document.querySelector("#form-message");
const togglePassword = document.querySelector("#toggle-password");
const fillDemo = document.querySelector("#fill-demo");
const forgotPassword = document.querySelector("#forgot-password");

// 2. Expresión regular sencilla para revisar el formato general del correo.
// No pretende comprobar que el buzón de correo exista realmente.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(input, errorElement, message) {
  input.setAttribute("aria-invalid", String(Boolean(message)));
  errorElement.textContent = message;
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

// 3. Validaciones específicas por campo.
function validateEmail() {
  const value = email.value.trim();
  let error = "";
  if (!value) error = "Ingresa tu correo electrónico.";
  else if (!emailPattern.test(value)) error = "Escribe un correo válido, por ejemplo nombre@ejemplo.com.";
  showFieldError(email, emailError, error);
  return !error;
}

function validatePassword() {
  const value = password.value;
  let error = "";
  if (!value) error = "Ingresa tu contraseña.";
  else if (value.length < 8) error = "La contraseña debe tener al menos 8 caracteres.";
  showFieldError(password, passwordError, error);
  return !error;
}

// 4. Guardar SOLO el correo si se marca «Recordar mi correo».
// localStorage nunca recibe la contraseña.
function saveRememberedEmail() {
  try {
    if (rememberEmail.checked) localStorage.setItem(REMEMBER_KEY, email.value.trim());
    else localStorage.removeItem(REMEMBER_KEY);
  } catch (error) {
    // El navegador puede bloquear almacenamiento local; el Login sigue funcionando.
    console.info("No se pudo utilizar el almacenamiento local.");
  }
}

function loadRememberedEmail() {
  try {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);
    if (savedEmail) {
      email.value = savedEmail;
      rememberEmail.checked = true;
    }
  } catch (error) {
    console.info("Almacenamiento local no disponible.");
  }
}

// 5. Evitar la navegación y validar antes de simular el inicio de sesión.
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Impide el envío y la recarga de la página.
  clearMessage();

  // Se validan AMBOS campos, aunque el primero ya tenga errores.
  const emailValid = validateEmail();
  const passwordValid = validatePassword();

  if (!emailValid || !passwordValid) {
    showMessage("Revisa los campos señalados e inténtalo nuevamente.", "error");
    if (!emailValid) email.focus();
    else password.focus();
    return;
  }

  // Este guardado concierne únicamente al correo, no a las credenciales.
  saveRememberedEmail();

  // Comparación en frontend: demostración educativa, NO seguridad real.
  if (email.value.trim().toLowerCase() === DEMO_EMAIL && password.value === DEMO_PASSWORD) {
    showMessage("¡Bienvenido a Aula Digital! Inicio de sesión de demostración exitoso.", "success");
    password.value = ""; // Evita conservar la contraseña visible en el formulario.
  } else {
    showMessage("Credenciales incorrectas. Verifica el correo y la contraseña de demostración.", "error");
  }
});

// 6. Interacción para visualizar u ocultar la contraseña.
togglePassword.addEventListener("click", () => {
  const isVisible = password.type === "text";
  password.type = isVisible ? "password" : "text";
  togglePassword.setAttribute("aria-pressed", String(!isVisible));
  togglePassword.setAttribute("aria-label", isVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  togglePassword.title = isVisible ? "Mostrar contraseña" : "Ocultar contraseña";
});

// 7. Validación progresiva y limpieza de mensajes al editar.
email.addEventListener("input", () => {
  if (email.getAttribute("aria-invalid") === "true") validateEmail();
  clearMessage();
});
password.addEventListener("input", () => {
  if (password.getAttribute("aria-invalid") === "true") validatePassword();
  clearMessage();
});
email.addEventListener("blur", validateEmail);
password.addEventListener("blur", validatePassword);

rememberEmail.addEventListener("change", () => {
  // Si el usuario desmarca la opción, elimina inmediatamente el correo guardado.
  if (!rememberEmail.checked) {
    try { localStorage.removeItem(REMEMBER_KEY); } catch (error) { /* Bloqueo de almacenamiento. */ }
  } else if (email.value.trim()) {
    saveRememberedEmail();
  }
});

// Si el usuario modificó un correo recordado, actualizarlo solo si eligió recordarlo.
email.addEventListener("change", () => {
  if (rememberEmail.checked) saveRememberedEmail();
});

// Botón auxiliar educativo para probar el flujo de autenticación.
fillDemo.addEventListener("click", () => {
  email.value = DEMO_EMAIL;
  password.value = DEMO_PASSWORD;
  showFieldError(email, emailError, "");
  showFieldError(password, passwordError, "");
  clearMessage();
  email.focus();
});

// No existe una recuperación de contraseñas sin un servidor y servicio de correo.
forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();
  showMessage("Esta demostración no incluye recuperación de contraseña. En una aplicación real se implementa desde el servidor.", "info");
});

loadRememberedEmail();
