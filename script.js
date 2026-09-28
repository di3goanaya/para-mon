// ============================================================
// Para ti, Mon — lógica de la página
// ============================================================

// MODO DE PRUEBA (solo para el autor).
// true  = la página se comporta como si ya fuera 7 de octubre de 2026.
// false = comportamiento real (cuenta regresiva y desbloqueo por fecha).
// IMPORTANTE: déjalo en false antes de mandarle el enlace a Mon.
const TEST_MODE = true;

// La fecha/hora de desbloqueo: 7 de octubre de 2026, 00:00, hora de
// Ciudad de México. Desde 2022 México ya no cambia de horario, así
// que Ciudad de México se queda todo el año en UTC-6. Por eso el
// objetivo se puede fijar directamente en UTC así:
const FECHA_DESBLOQUEO_UTC = new Date('2026-10-07T06:00:00Z');

// Mensajes de la cuenta regresiva, según el día en Ciudad de México.
// La llave es la fecha local en formato YYYY-MM-DD.
const MENSAJES_POR_DIA = {
  '2026-09-27': 'Faltan 10 días…\n\nTal vez todavía falte un poquito, pero quería empezar a contar los días para algo que hice pensando completamente en ti. ❤️',
  '2026-09-28': 'Faltan 9 días…\n\nEntre tantas cosas que pasan durante el día, siempre hay un momento en el que termino pensando en ti. Bueno… siendo sincero, son muchos momentos. ❤️',
  '2026-09-29': 'Faltan 8 días…\n\nOjalá pudiera enseñarte todo lo que tengo preparado, pero tendrás que esperar un poquito más. Prometo que la espera tendrá su recompensa. 🤭❤️',
  '2026-09-30': 'Falta 1 semana…\n\nUna semana para que descubras algo que hice con muchísimo cariño. Y sí, me está costando bastante guardar el secreto. 🥹',
  '2026-10-01': 'Faltan 6 días…\n\nHay muchas cosas que quisiera decirte todos los días, pero creo que esta vez voy a dejar que lo que preparé hable por mí. ❤️',
  '2026-10-02': 'Faltan 5 días…\n\nYa estamos más cerca. Y mientras pasan los días, yo solamente puedo pensar en tu reacción cuando finalmente puedas abrir todo esto. 🥺❤️',
  '2026-10-03': 'Faltan 4 días…\n\nCuatro días para recordarte de una manera diferente todo lo que hemos vivido, todo lo que me haces sentir y lo mucho que te quiero. ❤️',
  '2026-10-04': 'Faltan 3 días…\n\nYa casi, amor. Después de tantos días sin verte, creo que no hay mejor manera de decirte cuánto te extraño que dejarte un pedacito de mí aquí. ❤️',
  '2026-10-05': 'Faltan 2 días…\n\nCada vez falta menos para que veas todo lo que preparé para ti. Solo te voy a pedir una cosa: cuando llegue el momento, léelo todo con calma. Lo hice pensando en ti. ❤️',
  '2026-10-06': 'Mañana es el día…\n\nDespués de esperar tanto, mañana por fin vas a poder descubrirlo todo. Espero que cuando lo hagas puedas sentir, aunque sea un poquito, todo el amor que puse en cada parte de esto. Te amo, Mon. ❤️',
};
const PRIMER_MENSAJE = MENSAJES_POR_DIA['2026-09-27'];

// ------------------------------------------------------------
// Utilidades de fecha en zona horaria de Ciudad de México
// ------------------------------------------------------------
const OFFSET_MEXICO_MS = 6 * 60 * 60 * 1000; // UTC-6 todo el año

function fechaLocalMexico(fechaUtc){
  return new Date(fechaUtc.getTime() - OFFSET_MEXICO_MS);
}

function claveDia(fechaUtc){
  const local = fechaLocalMexico(fechaUtc);
  const y = local.getUTCFullYear();
  const m = String(local.getUTCMonth() + 1).padStart(2, '0');
  const d = String(local.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function mensajeParaHoy(ahora){
  const clave = claveDia(ahora);
  if (MENSAJES_POR_DIA[clave]) return MENSAJES_POR_DIA[clave];
  if (clave < '2026-09-27') return PRIMER_MENSAJE;
  // Si por alguna razón cae fuera del rango pero antes del desbloqueo,
  // usamos el último mensaje disponible como respaldo.
  return MENSAJES_POR_DIA['2026-10-06'];
}

// ------------------------------------------------------------
// Referencias
// ------------------------------------------------------------
const pantallaEspera = document.getElementById('pantalla-espera');
const pantallaDesbloqueo = document.getElementById('pantalla-desbloqueo');
const pantallaExperiencia = document.getElementById('pantalla-experiencia');
const navDiscreta = document.getElementById('nav-discreta');

const textoMensajeDia = document.getElementById('texto-mensaje-dia');
const elDias = document.getElementById('reloj-dias');
const elHoras = document.getElementById('reloj-horas');
const elMinutos = document.getElementById('reloj-minutos');
const elSegundos = document.getElementById('reloj-segundos');

let intervaloReloj = null;
let secuenciaIniciada = false;

// ------------------------------------------------------------
// Estado inicial: mostrar la pantalla correcta desde el arranque
// ------------------------------------------------------------
function iniciar(){
  navDiscreta.classList.add('oculto');
  const ahora = new Date();

  if (TEST_MODE || ahora.getTime() >= FECHA_DESBLOQUEO_UTC.getTime()){
    // Ya es 7 de octubre o después: mostramos directamente el
    // desbloqueo (con su animación) y luego la experiencia.
    mostrarPantalla(pantallaDesbloqueo);
    iniciarSecuenciaDesbloqueo();
  } else {
    mostrarPantalla(pantallaEspera);
    textoMensajeDia.textContent = mensajeParaHoy(ahora);
    actualizarReloj();
    intervaloReloj = setInterval(actualizarReloj, 1000);
  }
}

function mostrarPantalla(pantalla){
  [pantallaEspera, pantallaDesbloqueo, pantallaExperiencia].forEach(p => p.classList.remove('activa'));
  pantalla.classList.add('activa');
}

function actualizarReloj(){
  const ahora = new Date();
  const restante = FECHA_DESBLOQUEO_UTC.getTime() - ahora.getTime();

  if (restante <= 0){
    clearInterval(intervaloReloj);
    mostrarPantalla(pantallaDesbloqueo);
    iniciarSecuenciaDesbloqueo();
    return;
  }

  const segTotales = Math.floor(restante / 1000);
  const dias = Math.floor(segTotales / 86400);
  const horas = Math.floor((segTotales % 86400) / 3600);
  const minutos = Math.floor((segTotales % 3600) / 60);
  const segundos = segTotales % 60;

  elDias.textContent = String(dias).padStart(2, '0');
  elHoras.textContent = String(horas).padStart(2, '0');
  elMinutos.textContent = String(minutos).padStart(2, '0');
  elSegundos.textContent = String(segundos).padStart(2, '0');

  // El mensaje del día se revisa cada minuto por si cruzamos la
  // medianoche mientras Mon tiene la página abierta.
  if (segundos === 0) {
    textoMensajeDia.textContent = mensajeParaHoy(ahora);
  }
}

// ------------------------------------------------------------
// Secuencia de desbloqueo
// ------------------------------------------------------------
function iniciarSecuenciaDesbloqueo(){
  if (secuenciaIniciada) return;
  secuenciaIniciada = true;

  const linea1 = document.getElementById('linea-desbloqueo-1');
  const linea2 = document.getElementById('linea-desbloqueo-2');
  const boton = document.getElementById('boton-abrir');

  linea1.classList.remove('oculto');
  linea2.classList.remove('oculto');
  boton.classList.remove('oculto');

  setTimeout(() => linea1.classList.add('mostrar'), 200);
  setTimeout(() => linea2.classList.add('mostrar'), 1600);
  setTimeout(() => boton.classList.add('mostrar'), 2800);

  boton.addEventListener('click', abrirExperiencia, { once: true });
}

function abrirExperiencia(){
  mostrarPantalla(pantallaExperiencia);
  navDiscreta.classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'instant' });
  observarApariciones();
  observarMensajeFinal();
}

// ------------------------------------------------------------
// Animación de aparición al hacer scroll
// ------------------------------------------------------------
function observarApariciones(){
  const elementos = document.querySelectorAll('.aparece');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting){
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observador.observe(el));
}

// ------------------------------------------------------------
// Sobre / carta
// ------------------------------------------------------------
const sobre = document.getElementById('sobre');
const hojaCarta = document.getElementById('hoja-carta');
if (sobre){
  sobre.addEventListener('click', () => {
    const abierto = sobre.getAttribute('aria-expanded') === 'true';
    sobre.setAttribute('aria-expanded', String(!abierto));
    if (!abierto){
      setTimeout(() => hojaCarta.classList.remove('oculto'), 350);
    } else {
      hojaCarta.classList.add('oculto');
    }
  });
}

// ------------------------------------------------------------
// Lightbox para la galería de fotos extra
// ------------------------------------------------------------
const lightbox = document.getElementById('lightbox');
const lightboxImagen = document.getElementById('lightbox-imagen');
const lightboxCerrar = document.getElementById('lightbox-cerrar');

document.querySelectorAll('.tarjeta-extra').forEach(tarjeta => {
  tarjeta.addEventListener('click', () => {
    lightboxImagen.src = tarjeta.dataset.full;
    lightboxImagen.alt = tarjeta.querySelector('img').alt;
    lightbox.classList.remove('oculto');
  });
});

function cerrarLightbox(){
  lightbox.classList.add('oculto');
  lightboxImagen.src = '';
}
lightboxCerrar.addEventListener('click', cerrarLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) cerrarLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarLightbox(); });

// ------------------------------------------------------------
// Mostrar / ocultar con animación suave (usado por los secretos)
// ------------------------------------------------------------
const temporizadoresOcultar = new WeakMap();

function mostrarSuave(elemento){
  clearTimeout(temporizadoresOcultar.get(elemento));
  elemento.classList.remove('oculto');
  void elemento.offsetWidth; // fuerza el reflujo para que la transición se ejecute
  elemento.classList.add('abierto');
}

function ocultarSuave(elemento, duracionMs){
  elemento.classList.remove('abierto');
  temporizadoresOcultar.set(elemento, setTimeout(() => elemento.classList.add('oculto'), duracionMs));
}

// ------------------------------------------------------------
// Secreto 1: mensaje oculto al mantener presionado el sello del sobre
// ------------------------------------------------------------
const DURACION_RETENCION_MS = 10000;
const MOVIMIENTO_MAXIMO_PX = 20;

const sello = document.querySelector('.sobre-sello');
const secretoUno = document.getElementById('secreto-uno');
const secretoUnoCerrar = document.getElementById('secreto-uno-cerrar');

let temporizadorRetencion = null;
let puntoInicialRetencion = null;
let retencionCompletada = false;
let momentoAperturaSecretoUno = 0;

function cancelarRetencion(){
  clearTimeout(temporizadorRetencion);
  temporizadorRetencion = null;
  sello.classList.remove('reteniendo');
}

function abrirSecretoUno(){
  momentoAperturaSecretoUno = Date.now();
  if (navigator.vibrate) navigator.vibrate(40);
  mostrarSuave(secretoUno);
}

function cerrarSecretoUno(){
  ocultarSuave(secretoUno, 700);
}

// Si por alguna razón falta el HTML del secreto, el resto de la página sigue funcionando.
if (sello && secretoUno && secretoUnoCerrar){
  sello.addEventListener('pointerdown', (e) => {
    puntoInicialRetencion = { x: e.clientX, y: e.clientY };
    retencionCompletada = false;
    sello.classList.add('reteniendo');
    if (sello.setPointerCapture){
      try { sello.setPointerCapture(e.pointerId); } catch (_) { /* no crítico */ }
    }
    temporizadorRetencion = setTimeout(() => {
      temporizadorRetencion = null;
      retencionCompletada = true;
      sello.classList.remove('reteniendo');
      abrirSecretoUno();
    }, DURACION_RETENCION_MS);
  });

  sello.addEventListener('pointermove', (e) => {
    if (!temporizadorRetencion) return;
    const desplazamiento = Math.hypot(e.clientX - puntoInicialRetencion.x, e.clientY - puntoInicialRetencion.y);
    if (desplazamiento > MOVIMIENTO_MAXIMO_PX) cancelarRetencion();
  });

  ['pointerup', 'pointerleave', 'pointercancel'].forEach(tipo => sello.addEventListener(tipo, cancelarRetencion));
  ['contextmenu', 'selectstart', 'dragstart'].forEach(tipo => sello.addEventListener(tipo, (e) => e.preventDefault()));

  // Al soltar después de abrir el secreto no debe abrirse/cerrarse el sobre.
  sello.addEventListener('click', (e) => {
    if (retencionCompletada){
      e.stopPropagation();
      retencionCompletada = false;
    }
  });

  secretoUno.addEventListener('click', (e) => {
    if (e.target !== secretoUno) return;
    if (Date.now() - momentoAperturaSecretoUno < 800) return; // ignora el "soltar" del dedo
    cerrarSecretoUno();
  });
  secretoUnoCerrar.addEventListener('click', cerrarSecretoUno);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !secretoUno.classList.contains('oculto')) cerrarSecretoUno();
  });
}

// ------------------------------------------------------------
// Secreto 2: aparece solo después de quedarse en el mensaje final
// ------------------------------------------------------------
const ESPERA_ANTES_DEL_PSST_MS = 7000;
const ESPERA_ANTES_DE_LA_TARJETA_MS = 4500;
const ESPERA_ANTES_DE_PODER_CERRAR_MS = 6000;

const psstFinal = document.getElementById('psst-final');
const secretoFinal = document.getElementById('secreto-final');

let secretoFinalIniciado = false;
let momentoAperturaSecretoFinal = 0;

function iniciarSecretoFinal(){
  secretoFinalIniciado = true;
  mostrarSuave(psstFinal);
  setTimeout(() => {
    ocultarSuave(psstFinal, 1800);
    momentoAperturaSecretoFinal = Date.now();
    mostrarSuave(secretoFinal);
  }, ESPERA_ANTES_DE_LA_TARJETA_MS);
}

// Se llama al abrir la experiencia. La cuenta solo corre mientras la frase
// final está bien visible en pantalla; si Mon se va, se cancela.
function observarMensajeFinal(){
  const fraseFinal = document.querySelector('.frase-final');
  if (!fraseFinal || !psstFinal || !secretoFinal) return;
  let espera = null;
  const observador = new IntersectionObserver((entradas) => {
    if (secretoFinalIniciado){ observador.disconnect(); return; }
    const visible = entradas[entradas.length - 1].intersectionRatio >= 0.6;
    if (visible && !espera){
      espera = setTimeout(iniciarSecretoFinal, ESPERA_ANTES_DEL_PSST_MS);
    } else if (!visible){
      clearTimeout(espera);
      espera = null;
    }
  }, { threshold: 0.6 });
  observador.observe(fraseFinal);
}

if (secretoFinal){
  secretoFinal.addEventListener('click', () => {
    if (Date.now() - momentoAperturaSecretoFinal < ESPERA_ANTES_DE_PODER_CERRAR_MS) return;
    ocultarSuave(secretoFinal, 2000);
  });
}

// ------------------------------------------------------------
// Arranque
// ------------------------------------------------------------
iniciar();
