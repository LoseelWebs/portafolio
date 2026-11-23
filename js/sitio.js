/* Loseel Webs · portafolio */
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const QUIETO = !document.documentElement.classList.contains("anim");
const FINO = matchMedia("(hover:hover) and (pointer:fine)").matches;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const svgU = id => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;
/* computadoras de bajos recursos: menos partículas, sin figura animada de fondo ni scroll suave */
let LIGERO = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 4;
if (LIGERO) document.documentElement.classList.add("ligero");
const ajustesLigero = [];
function bajarCalidad() {
  if (LIGERO) return; LIGERO = true; document.documentElement.classList.add("ligero");
  if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; document.documentElement.classList.remove("lenis"); }
  ajustesLigero.forEach(f => f());
}
const waCon = t => "https://wa.me/527821237103?text=" + encodeURIComponent(t);
const pesos = n => "$" + Math.round(n).toLocaleString("es-MX");
const rango = (a, b) => b ? `${pesos(a)} – ${pesos(b)}` : `Desde ${pesos(a)}`;

/* ---------- partir textos ---------- */
function letras(el, txt) { el.innerHTML = [...txt].map(c => `<span class="le">${c === " " ? "&nbsp;" : esc(c)}</span>`).join(""); }
letras($(".correo .c1"), "loseelwebs@"); letras($(".correo .c2"), "gmail.com");
/* títulos: cada letra por separado, sin cortar palabras */
$$("[data-tit]").forEach(t => {
  const tipo = t.dataset.tit; t.setAttribute("aria-label", t.textContent);
  if (tipo === "lado" || tipo === "cortina" || tipo === "descifra") return;
  let i = 0; t.innerHTML = t.textContent.split(" ").map(w => `<span class="pw" aria-hidden="true">${[...w].map(c => `<span class="ch" style="--i:${i++}">${esc(c)}</span>`).join("")}</span>`).join(" ");
});
/* sobre mí: palabras que se pintan */

/* texto que se descifra */
const SIGNOS = "abcdefghijklmnñopqrstuvwxyz#%&*/<>";
function descifrar(el, final, dur = 900) {
  if (QUIETO) { el.textContent = final; return; }
  const t0 = performance.now();
  const paso = now => { const k = cl((now - t0) / dur);
    el.textContent = [...final].map((c, i) => c === " " ? " " : (i / final.length < k ? c : SIGNOS[Math.random() * SIGNOS.length | 0])).join("");
    if (k < 1) requestAnimationFrame(paso); else el.textContent = final; };
  requestAnimationFrame(paso);
}

/* ---------- desplazamiento suave ---------- */
let lenis = null;
if (!QUIETO && FINO && !LIGERO && window.Lenis) {
  try {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    document.documentElement.classList.add("lenis");
    $$('a[href^="#"]:not(.menu-links a)').forEach(a => a.addEventListener("click", e => { const id = a.getAttribute("href"), t = $(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: id === "#inicio" ? 0 : -70, duration: 1.3 }); }));
    new MutationObserver(() => { $$("dialog[open]").length ? lenis.stop() : lenis.start(); })
      .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
  } catch (e) { lenis = null; }
}
$$("dialog").forEach(d => d.setAttribute("data-lenis-prevent", ""));

/* ================= 1 · PORTADA: aparece el nombre y la cortina azul se vuelve la barra del centro =================
   Antes de empezar se mide dónde queda la barra azul en el logo final; la cortina se recorta hasta ese lugar. */
const hero = $(".hero"), logoMini = $("#logoMini"), heroLogo = $("#heroLogo");
letras($$(".pal", logoMini)[0], "loseel"); letras($$(".pal", logoMini)[1], "webs");
{ const lo = $(".lo", heroLogo); lo.innerHTML = [...lo.textContent].map((c, i) => `<span class="le" style="--i:${i}">${c}</span>`).join(""); }
function portada() {
  if (QUIETO) { hero.classList.remove("pre"); return; }
  const r = hero.getBoundingClientRect(), b = $(".barras i:nth-child(2)", heroLogo).getBoundingClientRect(), cort = $(".cortina", hero);
  cort.style.setProperty("--bt", (b.top - r.top) + "px"); cort.style.setProperty("--bl", (b.left - r.left) + "px");
  cort.style.setProperty("--br", (r.right - b.right) + "px"); cort.style.setProperty("--bb", (r.bottom - b.bottom) + "px");
  cort.style.setProperty("--tira", Math.max(18, b.width * 2.2) + "px");
  hero.classList.remove("pre"); hero.classList.add("play");
}
Promise.race([document.fonts ? Promise.all([document.fonts.load("800 100px Syne"), document.fonts.load("italic 400 100px Fraunces")]).then(() => document.fonts.ready) : Promise.resolve(), new Promise(r => setTimeout(r, 1500))])
  .then(() => requestAnimationFrame(portada));
/* logo chico arriba: aparece al salir de la portada; las barras se pausan cuando no se ven */
new IntersectionObserver(([e]) => { logoMini.classList.toggle("ver", e.intersectionRatio < .4); hero.classList.toggle("fuera", !e.isIntersecting); }, { threshold: [0, .4] }).observe(hero);

/* ================= 2 · FRANJA ================= */
const marq = $("#marq");
/* franja: cada palabra alterna texto y cambia de estilo */
const PAL = [["loseel webs", "roberto lópez"], ["páginas web", "a tu medida"], ["celular", "computadora"], ["diseño propio", "tu negocio"]];
const EST = ["e0", "e1", "e2", "e3", "e4", "e5"];
const ICO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l15 9-7 1.6L8.6 20z" fill="currentColor"/></svg>';
marq.innerHTML = `<span>${PAL.map((p, i) => `<s class="fpal" data-i="${i}"><i><u class="${EST[i % 6]}">${p[0]}</u></i></s>${i % 2 ? ICO : "<b></b>"}`).join("")}</span>`.repeat(4);
const slots = PAL.map((_, i) => [...marq.querySelectorAll(`.fpal[data-i="${i}"]`)]);
const estado = PAL.map((_, i) => ({ t: 0, e: i % 6 }));
/* cada hueco tiene ancho fijo; la palabra se escala para caber: así nunca se mueve el resto de la franja */
let MED = null, HUECO = null;
function medirFranja() {
  const u = slots[0][0].querySelector("u"), prueba = u.cloneNode(); prueba.style.cssText = "position:absolute;visibility:hidden;animation:none"; u.parentNode.appendChild(prueba);
  MED = PAL.map(p => p.map(txt => EST.map(e => { prueba.className = e; prueba.textContent = txt; return prueba.offsetWidth; })));
  prueba.remove();
  HUECO = MED.map(m => Math.ceil(Math.max(...m.map(w => w[1]))));
  slots.forEach((g, i) => g.forEach(s => { s.style.width = HUECO[i] + "px"; ponerEscala(s, i); }));
  marq._w = marq.scrollWidth / 4;
}
function ponerEscala(s, i) { const st = estado[i], w = MED[i][st.t][st.e]; s.firstChild.style.transform = `translate(-50%,-50%) scale(${Math.min(1, HUECO[i] / w).toFixed(3)})`; }
(document.fonts ? Promise.all(["800 40px Syne", "italic 400 40px Fraunces", "500 40px Outfit", "600 40px Outfit"].map(f => document.fonts.load(f))).catch(() => 0) : Promise.resolve()).then(medirFranja);
if (document.fonts) document.fonts.addEventListener("loadingdone", () => { clearTimeout(marq._rt); marq._rt = setTimeout(medirFranja, 100); });
addEventListener("resize", () => { clearTimeout(marq._rt); marq._rt = setTimeout(medirFranja, 250); });
let paso = 0;
setInterval(() => {
  if (!MED || !enVista.get(marq) || document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const i = paso++ % PAL.length, st = estado[i];
  st.e = (st.e + 1 + Math.floor(Math.random() * 4)) % 6; if (paso % 2) st.t = 1 - st.t;
  const anim = paso % 2 ? "cambiaA" : "cambiaB";
  slots[i].forEach(s => { const n = s.firstChild.firstChild; n.className = EST[st.e] + " " + anim; n.textContent = PAL[i][st.t]; ponerEscala(s, i); });
}, 700);
let mX = 0, mV = 1, ultY = scrollY, rayX = 0;

/* ================= 3 · SHOWREEL siempre reproduciendo ================= */
const reel = $("#reel"), marco = $("#reelMarco");
const seguir = () => { if (reel.paused) { const p = reel.play(); if (p && p.catch) p.catch(() => {}); } };
reel.muted = true; reel.addEventListener("pause", () => setTimeout(seguir, 50)); reel.addEventListener("ended", seguir);
reel.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("visibilitychange", () => { if (!document.hidden) seguir(); });
["pointerdown", "touchstart", "scroll"].forEach(ev => addEventListener(ev, seguir, { once: true, passive: true }));
seguir();

/* ================= 4 · HOJAS que se apilan ================= */
const hojas = $$(".hoja"); hojas.forEach((h, i) => h.style.setProperty("--k", i));

/* ================= 5 · TRABAJOS ================= */
const lista = $("#lista");
lista.innerHTML = (window.CASOS || []).map((c, i) => `<li class="fila" style="--d:${i * 110}ms"><button type="button" data-caso="${i}" data-foto="${esc(c.portada || "")}">
  <span class="n">${esc(c.cliente)}</span><span class="g">${esc(c.giro)}<i>${esc(c.anio)}</i></span><span class="fl">${svgU("i-flecha")}</span></button></li>`).join("");
const vista = $("#vista"), vImg = $("img", vista);
let vx = 0, vy = 0, vtx = 0, vty = 0, vOn = false;
if (FINO) {
  lista.addEventListener("pointermove", e => { vtx = e.clientX; vty = e.clientY; });
  $$(".fila button", lista).forEach(b => {
    b.addEventListener("pointerenter", e => { if (b.dataset.foto) vImg.src = b.dataset.foto; if (!vOn) { vx = vtx = e.clientX; vy = vty = e.clientY; } vOn = true; vista.classList.add("on"); });
    b.addEventListener("pointerleave", () => { vOn = false; vista.classList.remove("on"); });
  });
}
function abrirCaso(i) {
  const c = CASOS[i], gal = c.galeria || [];
  const tri = [["Antes", c.antes], ["El reto", c.reto], ["Lo que hice", c.solucion]].filter(x => x[1]);
  $("#caso-in").innerHTML = `<button type="button" class="cerrar" data-cerrar aria-label="Cerrar">${svgU("i-x")}</button>
    <p class="et">${esc([c.giro, c.anio].filter(Boolean).join(" · "))}</p>
    <h3 id="caso-t">${esc(c.cliente)}</h3><p class="fr">${esc(c.frase || c.resumen)}</p>
    ${c.portada ? `<div class="portada"><img src="${esc(c.portada)}" alt="${esc(c.cliente)}"></div>` : ""}
    <div class="trio">${tri.map(([a, b]) => `<div><h4>${a}</h4><p>${esc(b)}</p></div>`).join("")}</div>
    ${(c.funciones || []).length ? `<h4>Qué tiene</h4><ul class="funcs">${c.funciones.map(f => `<li><b>${esc(f.titulo)}</b><span>${esc(f.texto)}</span></li>`).join("")}</ul>` : ""}
    ${gal.length ? `<h4>Capturas</h4><div class="gal">${gal.map(g => `<button type="button" class="${g.tipo === "cel" ? "" : "ancha"}" data-ver="${esc(g.foto)}" data-pie="${esc(g.pie || "")}"><img src="${esc(g.foto)}" alt="${esc(g.pie || c.cliente)}" loading="lazy"></button>`).join("")}</div>` : ""}
    ${(c.tecnologia || []).length ? `<div class="tec">${c.tecnologia.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
    ${c.nota ? `<p class="nota">${esc(c.nota)}</p>` : ""}
    ${c.enlace ? `<a class="btn" href="${esc(c.enlace)}" target="_blank" rel="noopener"><span>Ver la página en vivo</span>${svgU("i-flecha")}</a>` : ""}`;
  $("#caso").showModal(); $("#caso-in").scrollTop = 0;
}

/* ================= 6 · PRECIOS ================= */
const PLANES = [
  { nombre: "Presencia", para: "Para que te encuentren y te escriban.", min: 4000, max: 6000, tiempo: "2 a 3 semanas", mant: "$300 al mes", incl: ["Una página con hasta 5 apartados: portada, servicios o carta, horario, ubicación y contacto", "Botón de WhatsApp con mensaje listo y mapa para llegar", "Vista previa con tu logo al compartir el enlace", "Alta en Google y candado de seguridad", "Los cambios los hago yo con el mantenimiento"] },
  { nombre: "Con panel", para: "Para cambiar precios, horarios y fotos tú mismo.", min: 7500, max: 11000, tiempo: "3 a 5 semanas", mant: "$500 al mes", rec: true, incl: ["Todo lo de Presencia", "Panel con tu usuario y contraseña, incluido mientras tengas tu plan", "Cambias textos, precios, horarios, fotos y promociones", "Historial para regresar a una versión anterior", "Una sesión para enseñarte a usarlo"] },
  { nombre: "A la medida", para: "Reservaciones, eventos o algo especial para tu negocio.", min: 14000, max: 0, tiempo: "5 a 8 semanas", mant: "desde $750 al mes", incl: ["Todo lo de Con panel", "Un módulo hecho para tu negocio: reservaciones, citas, cartelera de eventos…", "Panel para administrarlo: confirmar, cancelar, bloquear horarios", "3 rondas de cambios durante el diseño", "Pago en tres partes"] }
];
$("#planes").innerHTML = PLANES.map((p, i) => `<article class="plan${p.rec ? " rec" : ""}" style="--d:${i * 140}ms">${p.rec ? `<span class="chip">El más completo para empezar</span>` : ""}
  <h3>${esc(p.nombre)}</h3><p class="para">${esc(p.para)}</p><div class="precio" data-min="${p.min}" data-max="${p.max}">${rango(p.min, p.max)}</div><p class="unico">pago único</p>
  <div class="dd"><div><small>Entrega</small><b>${esc(p.tiempo)}</b></div><div><small>Después</small><b>${esc(p.mant)}</b></div></div>
  <ul>${p.incl.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
  <a class="btn ${p.rec ? "halo" : "borde"}" href="${waCon(`Hola Roberto, vi tu portafolio y me interesa el paquete ${p.nombre}. Te cuento de mi negocio:`)}" target="_blank" rel="noopener">${svgU("i-wa")}<span>Quiero este paquete</span></a></article>`).join("");
$("#f-paq").insertAdjacentHTML("beforeend", PLANES.map(p => `<option>${esc(p.nombre)} (${rango(p.min, p.max).replace("Desde", "desde")})</option>`).join(""));
/* los precios cuentan hacia arriba al aparecer */
function contar(el) {
  const a = +el.dataset.min, b = +el.dataset.max; if (QUIETO) return; const t0 = performance.now();
  const paso = now => { const k = cl((now - t0) / 1200), e = 1 - Math.pow(1 - k, 3); el.textContent = rango(a * e, b * e); if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}

/* cuestionario para elegir paquete */
const REC = { 1: "Con una página clara que reúna tu información y te mande clientes por WhatsApp es suficiente. Es la forma más económica de empezar.", 2: "Como cambias precios u ofertas seguido, te conviene hacerlo tú mismo desde tu celular o computadora, sin esperar a nadie.", 3: "Para que tus clientes aparten o reserven necesitas un módulo hecho para tu negocio, con un panel para administrarlo." };
let qv = [], qt = "";
function reiniciarQuiz() { qv = []; qt = ""; $$("#quiz .qp").forEach((p, i) => p.classList.toggle("on", i === 0)); $("#quiz .q-barra i").style.width = "0"; }
$("#quiz").addEventListener("click", e => {
  if (e.target.closest("#q-otra")) { reiniciarQuiz(); return; }
  const op = e.target.closest(".qo button"); if (!op) return;
  const ps = $$("#quiz .qp"), i = ps.findIndex(p => p.classList.contains("on")); qv[i] = +op.dataset.v; if (op.dataset.t) qt = op.dataset.t;
  $("#quiz .q-barra i").style.width = Math.min(100, (i + 1) / 3 * 100) + "%";
  setTimeout(() => { ps[i].classList.remove("on"); ps[i + 1].classList.add("on");
    if (i + 1 === 3) { const k = Math.max(qv[0] || 1, qv[1] || 1), p = PLANES[k - 1];
      descifrar($("#q-nom"), p.nombre, 700); $("#q-txt").textContent = REC[k] + (p.max ? ` Va de ${pesos(p.min)} a ${pesos(p.max)}` : ` Va desde ${pesos(p.min)}`) + `, tarda de ${p.tiempo} y su mantenimiento cuesta ${p.mant}.`;
      $("#q-wa").href = waCon(`Hola Roberto, hice el cuestionario de tu página y me salió el paquete ${p.nombre}. ${qt ? "Sobre logo y fotos: " + qt + ". " : ""}Me gustaría platicarlo.`); } }, 260);
});

/* ================= 9 · PREGUNTAS ================= */
const FAQ = [
  ["¿Cuánto cuesta en total?", "Depende de lo que necesites: una página de presencia va de $4,000 a $6,000, una con panel de $7,500 a $11,000 y una a la medida desde $14,000. Antes de empezar te doy un precio cerrado por escrito. Aparte pagas tu dominio (entre $300 y $600 al año) y el mantenimiento mensual, desde $300. Los cambios fuera del plan cuestan $400 la hora."],
  ["¿Cuánto tarda?", "Entre 2 y 8 semanas según el paquete. La mayor parte del tiempo se va en diseñar y ajustar contigo hasta que quede como quieres. Ayuda mucho que me compartas pronto tus fotos, precios y textos."],
  ["¿Qué necesito darte?", "Tu logo si tienes, fotos de tu negocio y de lo que vendes, precios, horario, dirección y tus redes. Si no tienes buenas fotos o no sabes qué escribir, te ayudo a resolverlo."],
  ["¿Puedo cambiar cosas después?", "Sí. Con el paquete Con panel cambias textos, precios, horarios y fotos tú mismo desde tu celular o computadora; el panel funciona mientras tengas tu plan de mantenimiento activo. Si tienes Presencia, me mandas el cambio por WhatsApp y lo hago yo con el mantenimiento. Secciones nuevas o cambios de diseño se cotizan aparte."],
  ["¿Qué pasa si cancelo el mantenimiento?", "Tu contenido y tu dominio son tuyos. Si cancelas, te entrego tu página completa sin costo; solo deja de funcionar el panel, porque depende del servicio que yo mantengo."],
  ["¿Trabajas con negocios de otras ciudades?", "Sí. Todo se puede hacer a distancia: platicamos por WhatsApp o videollamada, te comparto los avances con un enlace y lo revisas desde tu celular."],
  ["Ya tengo Facebook, ¿para qué quiero una página?", "Facebook sirve mucho para publicar, pero ahí tus horarios y precios se pierden entre publicaciones y no siempre te encuentran en Google. La página junta todo en un solo lugar, siempre al día, y desde ahí enlazas tu Facebook."],
  ["¿Haces tiendas en línea o sistemas más grandes?", "Por ahora me enfoco en páginas para negocios. Para tiendas y refaccionarias estoy desarrollando Loseel, mi propio punto de venta. Si tienes una idea más grande, platiquemos y te digo con honestidad si puedo hacerla."]
];
$("#faq").innerHTML = FAQ.map(([p, r], i) => `<details style="--d:${i * 80}ms"><summary>${esc(p)}<i aria-hidden="true"></i></summary><div class="r"><div><p>${esc(r)}</p></div></div></details>`).join("");
/* abre y cierra con altura suave; solo una abierta a la vez */
function cerrarDet(d) { d.classList.remove("abierto"); setTimeout(() => { if (!d.classList.contains("abierto")) d.open = false; }, QUIETO ? 0 : 480); }
$$("#faq summary").forEach(s => s.addEventListener("click", e => {
  e.preventDefault(); const d = s.parentElement;
  if (d.classList.contains("abierto")) { cerrarDet(d); return; }
  $$("#faq details.abierto").forEach(cerrarDet);
  d.open = true; requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add("abierto")));
}));

/* ================= 10 · CONTACTO ================= */
$$(".form .campo").forEach((c, i) => c.style.setProperty("--i", i));
$("#form").addEventListener("submit", e => {
  e.preventDefault(); const f = e.target, d = Object.fromEntries(new FormData(f)); let falta = null;
  ["nombre", "negocio"].forEach(n => { const i = f.elements[n], mal = !String(d[n] || "").trim(); i.classList.toggle("error", mal); if (mal && !falta) falta = i; });
  if (falta) { falta.focus(); avisar(falta.name === "nombre" ? "Escribe tu nombre" : "Cuéntame qué negocio tienes"); return; }
  open(waCon(`Hola Roberto, soy ${d.nombre.trim()}. Tengo ${d.negocio.trim()}. Me interesa: ${d.paquete}.${String(d.mensaje || "").trim() ? " " + d.mensaje.trim() : ""}`), "_blank", "noopener");
  avisar("Abriendo WhatsApp con tu mensaje…");
});
document.addEventListener("input", e => { if (e.target.classList && e.target.classList.contains("error") && e.target.value.trim()) e.target.classList.remove("error"); });
function avisar(t) { const a = $(".aviso"); a.textContent = t; a.classList.add("on"); clearTimeout(avisar.t); avisar.t = setTimeout(() => a.classList.remove("on"), 2200); }
function copiar(t) {
  const ok = () => avisar("Correo copiado");
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(t).then(ok, () => avisar(t));
  else { const i = document.createElement("textarea"); i.value = t; document.body.appendChild(i); i.select(); try { document.execCommand("copy"); ok(); } catch (e) { avisar(t); } i.remove(); }
}

/* ---------- ventanas con salida suave ---------- */
function cerrarDialogo(d) { if (d && d.id === "menu") { cerrarMenu(); return; } if (!d.open || d.classList.contains("sale")) return; if (QUIETO || d.id === "visor") { d.close(); return; }
  d.classList.add("sale"); setTimeout(() => { d.classList.remove("sale"); d.close(); }, 280); }
$$("dialog").forEach(d => d.addEventListener("cancel", e => { e.preventDefault(); cerrarDialogo(d); }));
document.addEventListener("click", e => {
  const b = e.target.closest("[data-caso]"); if (b) { abrirCaso(+b.dataset.caso); return; }
  if (e.target.closest("[data-abrir=quiz]")) { reiniciarQuiz(); $("#quiz").showModal(); return; }
  const v = e.target.closest("[data-ver]"); if (v) { const vi = $("#visor"); $("img", vi).src = v.dataset.ver; $("img", vi).alt = v.dataset.pie; $("p", vi).textContent = v.dataset.pie; vi.showModal(); return; }
  if (e.target.closest("#visor")) { $("#visor").close(); return; }
  const x = e.target.closest("[data-cerrar]"); if (x) { cerrarDialogo(x.closest("dialog")); return; }
  if (e.target.tagName === "DIALOG") { cerrarDialogo(e.target); return; }
  const cp = e.target.closest("[data-copiar]"); if (cp) copiar(cp.dataset.copiar);
});

/* ---------- luz que sigue al cursor en tarjetas ---------- */
$$(".plan, .tj, .form, .proc-pista li").forEach(el => { el.classList.add("fx-luz"); const l = document.createElement("span"); l.className = "luz"; l.setAttribute("aria-hidden", "true"); el.append(l); });
document.addEventListener("pointermove", e => { const l = e.target.closest(".fx-luz"); if (!l) return; const r = l.getBoundingClientRect(); l.style.setProperty("--mx", (e.clientX - r.left) + "px"); l.style.setProperty("--my", (e.clientY - r.top) + "px"); }, { passive: true });
/* en celular: la luz y el brillo aparecen al tocar */
document.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; const l = e.target.closest(".fx-luz, .btn, .via"); if (!l) return;
  const r = l.getBoundingClientRect(); l.style.setProperty("--mx", (e.clientX - r.left) + "px"); l.style.setProperty("--my", (e.clientY - r.top) + "px");
  l.classList.add("toque"); clearTimeout(l._fx); l._fx = setTimeout(() => l.classList.remove("toque"), 900); }, { passive: true });

/* ---------- inclinación 3D en precios ---------- */
if (FINO && !QUIETO) $$(".plan").forEach(p => {
  p.addEventListener("pointermove", e => { const r = p.getBoundingClientRect(); p.classList.add("listo");
    p.style.setProperty("--ry", (((e.clientX - r.left) / r.width - .5) * 8).toFixed(2) + "deg"); p.style.setProperty("--rx", ((.5 - (e.clientY - r.top) / r.height) * 7).toFixed(2) + "deg"); });
  p.addEventListener("pointerleave", () => { p.style.setProperty("--ry", "0deg"); p.style.setProperty("--rx", "0deg"); });
});

/* ---------- botones magnéticos ---------- */
if (FINO && !QUIETO) $$(".mag").forEach(m => {
  m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    m.style.transform = `translate(${x * .28}px,${y * .38}px)`; $$(":scope>span,:scope>svg", m).forEach(s => s.style.transform = `translate(${x * .12}px,${y * .16}px)`); });
  m.addEventListener("pointerleave", () => { m.style.transition = "transform .6s cubic-bezier(.2,1.6,.4,1)"; m.style.transform = ""; $$(":scope>span,:scope>svg", m).forEach(s => s.style.transform = "");
    setTimeout(() => m.style.transition = "", 600); });
});

/* ---------- menú: se descifra al pasar el mouse ---------- */

/* ---------- cursor propio: flecha que se inclina al moverte y se vuelve mano en botones ---------- */
const cursor = $(".cursor");
let curX = -100, curY = -100, curAnt = -100, curAng = 0;
if (FINO && !QUIETO) {
  addEventListener("pointermove", e => { curX = e.clientX; curY = e.clientY; cursor.classList.add("on");
    const t = e.target, texto = t.closest("input, textarea"), ver = t.closest(".fila button"), mano = t.closest("a, button, summary, label, select, [data-caso]");
    cursor.classList.toggle("oculto", !!texto); cursor.classList.toggle("ver", !!ver); cursor.classList.toggle("mano", !!mano && !texto); }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
  addEventListener("pointerdown", () => cursor.classList.add("click"));
  addEventListener("pointerup", () => cursor.classList.remove("click"));
  /* dentro de las ventanas se usa el cursor normal */
  new MutationObserver(() => document.documentElement.classList.toggle("dlg", $$("dialog[open]").length > 0))
    .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
}

/* ================= APARICIONES ================= */
const ob = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; el.classList.add("ok"); ob.unobserve(el);
  if (el.dataset.tit === "descifra") descifrar(el, el.getAttribute("aria-label"), 1100);
  if (el.classList.contains("plan")) { contar($(".precio", el)); setTimeout(() => el.classList.add("listo"), 1400); }
}), { rootMargin: "0px 0px -12% 0px" });
$$("[data-tit], .fila, .plan").forEach(el => ob.observe(el));
if (QUIETO) $$("[data-tit=descifra]").forEach(el => el.textContent = el.getAttribute("aria-label"));

/* ================= MENÚ: la L cursiva se dibuja en el botón y luego se abre ================= */
const menuD = $("#menu"), botonM = $(".menu-b");
let menuOcupado = false;
function dibujarL() { if (QUIETO) return Promise.resolve(); return new Promise(ok => { botonM.classList.remove("dibuja-l"); void botonM.offsetWidth; botonM.classList.add("dibuja-l"); setTimeout(ok, 720); }); }
function seccionActual() {
  const y = innerHeight * .35; let act = "inicio";
  $$(".menu-links a").forEach(a => { const s2 = $(a.getAttribute("href")); if (!s2) return; const r = s2.getBoundingClientRect(); if (r.top <= y && r.bottom > y) act = s2.id; });
  $$(".menu-links a").forEach(a => { const on = a.getAttribute("href") === "#" + act; a.classList.toggle("actual", on); if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
}
botonM.addEventListener("click", () => {
  if (menuOcupado || menuD.open) return; menuOcupado = true; seccionActual();
  dibujarL().then(() => { menuD.showModal(); menuD.classList.add("glitch"); setTimeout(() => menuD.classList.remove("glitch"), 700); botonM.setAttribute("aria-expanded", "true"); menuOcupado = false; });
});
function cerrarMenu(destino) {
  if (!menuD.open) return; menuD.classList.add("saliendo");
  setTimeout(() => { menuD.close(); menuD.classList.remove("saliendo");
    if (destino) { if (lenis) { lenis.start(); lenis.scrollTo(destino, { immediate: true, offset: destino.id === "inicio" ? 0 : -70 }); } else destino.scrollIntoView({ behavior: "instant" }); } }, QUIETO ? 0 : 280);
}
menuD.addEventListener("close", () => { botonM.setAttribute("aria-expanded", "false"); botonM.classList.remove("dibuja-l"); });
menuD.addEventListener("click", e => { const a = e.target.closest("a[href^='#']"); if (!a) return; e.preventDefault(); e.stopPropagation(); cerrarMenu($(a.getAttribute("href"))); });
$$(".menu-links span").forEach(sp => { const f = sp.textContent; sp.parentElement.addEventListener("pointerenter", () => descifrar(sp, f, 420)); });

/* ================= PROCESO horizontal ================= */
const proc = $("#proceso"), pista = $("#procPista"), procBarra = $("#procBarra"), pasos = $$("li", pista);
let horizontal = false, distancia = 0;
function medirProceso() {
  horizontal = !QUIETO && innerWidth > 900;
  if (!horizontal) { proc.style.height = ""; pista.style.transform = ""; return; }
  const pad = parseFloat(getComputedStyle($(".proc-fijo")).paddingLeft);
  distancia = Math.max(0, pista.scrollWidth - (innerWidth - pad * 2));
  proc.style.height = (innerHeight + distancia) + "px";
}
medirProceso(); addEventListener("resize", medirProceso);
if (!horizontal || QUIETO) { const obP = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("on", e.isIntersecting)), { rootMargin: "-40% 0px -40% 0px" }); pasos.forEach(li => obP.observe(li)); }

/* ================= BUCLE ÚNICO ================= */
const barra = $(".top"), progreso = $(".progreso i"), correoLe = $$(".correo .le"), pintas = $$(".pinta"), correo = $(".correo");
/* cada efecto solo trabaja cuando su sección está en pantalla */
const enVista = new Map();
const obV = new IntersectionObserver(es => es.forEach(e => enVista.set(e.target, e.isIntersecting)), { rootMargin: "200px 0px" });
[marq, marco, $(".pila"), proc, lista].forEach(el => { enVista.set(el, false); obV.observe(el); });
const visto = el => enVista.get(el);
let reelK = -1, tFps = 0, nFps = 0, sumFps = 0, ultNow = 0;
function bucle(now) {
  /* si los cuadros tardan mucho al inicio, baja la calidad sola */
  if (!LIGERO && ultNow && now > 1500 && now < 6500) { sumFps += now - ultNow; nFps++; if (nFps > 60 && sumFps / nFps > 26) bajarCalidad(); }
  ultNow = now;
  if (lenis) lenis.raf(now);
  const y = scrollY, dy = y - ultY, vh = innerHeight; ultY = y;
  progreso.style.transform = `scaleX(${cl(y / (document.documentElement.scrollHeight - vh))})`;
  if (!QUIETO) {
    /* franja: velocidad y dirección según el scroll */
    if (Math.abs(dy) > .5) mV = cl(mV + Math.sign(dy) * Math.min(Math.abs(dy), 40) * .04, -6, 6);
    mV += ((Math.sign(mV) || 1) - mV) * .04;
    if (visto(marq)) { const w = marq._w || (marq._w = marq.scrollWidth / 4); mX -= mV * (innerWidth < 700 ? .9 : 1.4); if (mX < -w) mX += w; if (mX > 0) mX -= w;
      marq.style.transform = `translate3d(${mX.toFixed(1)}px,0,0) skewX(${LIGERO ? 0 : cl(-dy * .25, -10, 10).toFixed(1)}deg)`;
    }
    /* showreel: se abre desde el centro (solo mientras cambia) */
    if (visto(marco)) { const r = marco.getBoundingClientRect(), k = Math.round(cl((vh - r.top) / (vh * .9)) * 200) / 200;
      if (k !== reelK) { reelK = k; const e = 1 - Math.pow(1 - k, 3);
        marco.style.transform = `scale(${(.84 + .16 * e).toFixed(4)})`; marco.style.borderRadius = (28 * (1 - e)).toFixed(1) + "px"; } }
    /* hojas: la de atrás se encoge cuando llega la siguiente */
    if (visto($(".pila")) && dy !== 0) hojas.forEach((h, i) => { const sig = hojas[i + 1]; if (!sig) return; const a = h.getBoundingClientRect(), b = sig.getBoundingClientRect();
      const p = cl(1 - (b.top - a.top) / a.height); h.style.transform = `scale(${(1 - p * .07).toFixed(4)}) translateY(${(-p * 10).toFixed(1)}px)`; h.style.opacity = (1 - p * .35).toFixed(3); });
    /* proceso horizontal */
    if (horizontal && visto(proc)) { const pr = proc.getBoundingClientRect(), p = cl(-pr.top / Math.max(1, proc.offsetHeight - vh));
      pista.style.transform = `translate3d(${-p * distancia}px,0,0)`; procBarra.style.transform = `scaleX(${p})`;
      const act = Math.round(p * (pasos.length - 1)); pasos.forEach((li, i) => li.classList.toggle("on", i <= act)); }
    /* vista previa y cursor */
    if (FINO && visto(lista)) { vx += (vtx - vx) * .14; vy += (vty - vy) * .14; vista.style.translate = `${vx}px ${vy}px`; vista.style.rotate = `${cl((vtx - vx) * .06, -10, 10)}deg`;
}
    if (FINO && !LIGERO) { const v = curX - curAnt; curAnt = curX; curAng += (cl(v * 1.4, -28, 28) - curAng) * .18;
      cursor.style.transform = `translate(${(curX - 4).toFixed(1)}px,${(curY - 3).toFixed(1)}px) rotate(${curAng.toFixed(1)}deg)`; }
  }
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);
