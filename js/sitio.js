/* Loseel Webs · portafolio */
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const QUIETO = !document.documentElement.classList.contains("anim");
const FINO = matchMedia("(hover:hover) and (pointer:fine)").matches;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const svgU = id => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;
const waCon = t => "https://wa.me/527821237103?text=" + encodeURIComponent(t);
const pesos = n => "$" + Math.round(n).toLocaleString("es-MX");

/* ---------- partir textos ---------- */
function letras(el, txt) { el.innerHTML = [...txt].map(c => `<span class="le">${c === " " ? "&nbsp;" : esc(c)}</span>`).join(""); }
$$(".nombre .pal").forEach(p => letras(p, p.textContent));
letras($(".correo .c1"), "loseelwebs@"); letras($(".correo .c2"), "gmail.com");
/* títulos: cada letra por separado, sin cortar palabras */
$$("[data-tit]").forEach(t => {
  const tipo = t.dataset.tit; t.setAttribute("aria-label", t.textContent);
  if (tipo === "lado" || tipo === "cortina" || tipo === "descifra") return;
  let i = 0; t.innerHTML = t.textContent.split(" ").map(w => `<span class="pw" aria-hidden="true">${[...w].map(c => `<span class="ch" style="--i:${i++}">${esc(c)}</span>`).join("")}</span>`).join(" ");
});
/* sobre mí: palabras que se pintan */
$$(".pinta").forEach(p => { p.innerHTML = p.textContent.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" "); });

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
if (!QUIETO && FINO && window.Lenis) {
  try {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    document.documentElement.classList.add("lenis");
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => { const id = a.getAttribute("href"), t = $(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: id === "#inicio" ? 0 : -70, duration: 1.3 }); }));
    new MutationObserver(() => { $$("dialog[open]").length ? lenis.stop() : lenis.start(); })
      .observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
  } catch (e) { lenis = null; }
}
$$("dialog").forEach(d => d.setAttribute("data-lenis-prevent", ""));

/* ================= 1 · PORTADA: partículas que arman el nombre =================
   Al bajar, el nombre se deshace y se vuelve a armar chico arriba a la izquierda; al subir, regresa. */
const nombre = $("#nombre"), hero = $(".hero"), capa = $("#capa"), logoMini = $("#logoMini");
letras($$(".pal", logoMini)[0], "loseel"); letras($$(".pal", logoMini)[1], "webs");
let ratonX = -9999, ratonY = -9999;
function medirLetras(cont, refTop) {
  const mc = document.createElement("canvas").getContext("2d");
  return $$(".le", cont).map(le => { const r = le.getBoundingClientRect(), cs = getComputedStyle(le), font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    mc.font = font; const m = mc.measureText(le.textContent);
    const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
    return { ch: le.textContent, font, x: r.left, base: r.top - refTop + (r.height - (fa + fd)) / 2 + fa, color: cs.color }; });
}
function intro() {
  if (QUIETO || !window.crearIntro) { nombre.classList.add("ver"); capa.style.display = "none"; return; }
  const ctx = capa.getContext("2d");
  let W, H, dpr, off, oc, motor, itemsA, itemsB, anchoAnt = 0;
  const avance = () => cl(scrollY / (hero.offsetHeight * .55));
  function armar() {
    dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; anchoAnt = W;
    capa.width = W * dpr; capa.height = H * dpr; off = document.createElement("canvas"); off.width = capa.width; off.height = capa.height; oc = off.getContext("2d");
    const hr = hero.getBoundingClientRect();
    itemsA = medirLetras(nombre, hr.top);            /* grandes: y medida desde el inicio de la página */
    itemsB = medirLetras(logoMini, 0);               /* chicas: fijas en la pantalla */
    const fs0 = parseFloat(getComputedStyle($(".le", nombre)).fontSize), paso = Math.max(2, Math.round(fs0 / (W < 700 ? 34 : 56)));
    const hH = hero.offsetHeight;
    motor = crearIntro(W, H, puntosTexto(W, Math.max(H, hH), itemsA, paso, true), puntosTexto(W, H, itemsB, 2, true), { polvo: "rgba(10,10,10,.55)", nPolvo: W < 700 ? 140 : 260 });
  }
  armar();
  const t0 = performance.now(); let prox = 0, glHasta = 0, listo = false;
  const cuadro = now => {
    const t = (now - t0) / 1000, sy = scrollY, s = avance();
    if (!listo && t < motor.FIN && s < .05) motor.formar(ctx, off, oc, t, dpr, sy, itemsA);
    else {
      if (!listo) { listo = true; if (s >= .05) motor.colocar(s, sy); }
      if (t > prox) { glHasta = s < .5 ? t + .16 : 0; prox = t + 4 + Math.random() * 4; }
      /* en reposo con el nombre chico y el cursor lejos, no hace falta redibujar */
      const lm = logoMini.getBoundingClientRect(), cerca = ratonX > lm.left - 80 && ratonX < lm.right + 80 && ratonY < lm.bottom + 80;
      if (!(s >= 1 && motor.quietud < .01 && !cerca && cuadro.sAnt >= 1)) motor.vivir(ctx, off, oc, t, dpr, s, sy, ratonX, ratonY, t < glHasta, itemsA, itemsB);
      cuadro.sAnt = s;
    }
    requestAnimationFrame(cuadro);
  };
  requestAnimationFrame(cuadro);
  addEventListener("pointermove", e => { ratonX = e.clientX; ratonY = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { ratonX = ratonY = -9999; });
  addEventListener("touchend", () => setTimeout(() => { ratonX = ratonY = -9999; }, 250), { passive: true });
  hero.addEventListener("pointerdown", e => { if (avance() < .3 && listo) motor.explotar(e.clientX, e.clientY); });
  let tR = 0; addEventListener("resize", () => { clearTimeout(tR); tR = setTimeout(() => { if (Math.abs(innerWidth - anchoAnt) < 40 && Math.abs(innerHeight - H) < 160) return; armar(); listo = true; motor.colocar(avance(), scrollY); }, 200); });
}
Promise.race([document.fonts ? Promise.all([document.fonts.load("800 100px Syne"), document.fonts.load("italic 400 100px Fraunces")]).then(() => document.fonts.ready) : Promise.resolve(), new Promise(r => setTimeout(r, 1200))])
  .then(() => requestAnimationFrame(intro));

/* ================= 2 · FRANJA ================= */
const marq = $("#marq"), rayas = $(".rayas");
marq.innerHTML = `<span>loseel webs <b></b> <em>páginas web</em> <b></b> celular y computadora <b></b> <em>a tu medida</em> <b></b></span>`.repeat(4);
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
  { nombre: "Presencia", para: "Para que te encuentren y te escriban.", min: 3500, max: 5000, tiempo: "2 a 3 semanas", mant: "desde $250/mes", incl: ["Una página con hasta 5 apartados: portada, servicios o carta, horario, ubicación y contacto", "Botón de WhatsApp con mensaje listo y mapa para llegar", "Vista previa con tu logo al compartir el enlace", "Alta en Google y candado de seguridad", "Los cambios los hago yo con el mantenimiento"] },
  { nombre: "Con panel", para: "Para cambiar precios, horarios y fotos tú mismo.", min: 6500, max: 9500, tiempo: "3 a 5 semanas", mant: "desde $350/mes", rec: true, incl: ["Todo lo de Presencia", "Panel con tu propio usuario y contraseña", "Cambias textos, precios, horarios, fotos y promociones", "Historial para regresar a una versión anterior", "Una sesión para enseñarte a usarlo"] },
  { nombre: "A la medida", para: "Reservaciones, eventos o algo especial para tu negocio.", min: 10000, max: 18000, tiempo: "5 a 8 semanas", mant: "desde $550/mes", incl: ["Todo lo de Con panel", "Un módulo hecho para tu negocio: reservaciones, citas, cartelera de eventos…", "Panel para administrarlo: confirmar, cancelar, bloquear horarios", "3 rondas de cambios durante el diseño", "Pago en tres partes"] }
];
$("#planes").innerHTML = PLANES.map((p, i) => `<article class="plan${p.rec ? " rec" : ""}" style="--d:${i * 140}ms">${p.rec ? `<span class="chip">El más completo para empezar</span>` : ""}
  <h3>${esc(p.nombre)}</h3><p class="para">${esc(p.para)}</p><div class="precio" data-min="${p.min}" data-max="${p.max}">${pesos(p.min)} – ${pesos(p.max)}</div><p class="unico">pago único</p>
  <div class="dd"><div><small>Entrega</small><b>${esc(p.tiempo)}</b></div><div><small>Después</small><b>${esc(p.mant)}</b></div></div>
  <ul>${p.incl.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
  <a class="btn ${p.rec ? "halo" : "borde"}" href="${waCon(`Hola Roberto, vi tu portafolio y me interesa el paquete ${p.nombre}. Te cuento de mi negocio:`)}" target="_blank" rel="noopener">${svgU("i-wa")}<span>Quiero este paquete</span></a></article>`).join("");
$("#f-paq").insertAdjacentHTML("beforeend", PLANES.map(p => `<option>${esc(p.nombre)} (${pesos(p.min)} – ${pesos(p.max)})</option>`).join(""));
/* los precios cuentan hacia arriba al aparecer */
function contar(el) {
  const a = +el.dataset.min, b = +el.dataset.max; if (QUIETO) return; const t0 = performance.now();
  const paso = now => { const k = cl((now - t0) / 1200), e = 1 - Math.pow(1 - k, 3); el.textContent = `${pesos(a * e)} – ${pesos(b * e)}`; if (k < 1) requestAnimationFrame(paso); };
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
      descifrar($("#q-nom"), p.nombre, 700); $("#q-txt").textContent = REC[k] + ` Va de ${pesos(p.min)} a ${pesos(p.max)} y tarda de ${p.tiempo}.`;
      $("#q-wa").href = waCon(`Hola Roberto, hice el cuestionario de tu página y me salió el paquete ${p.nombre}. ${qt ? "Sobre logo y fotos: " + qt + ". " : ""}Me gustaría platicarlo.`); } }, 260);
});

/* ================= 9 · PREGUNTAS ================= */
const FAQ = [
  ["¿Cuánto cuesta en total?", "Depende de lo que necesites: una página de presencia va de $3,500 a $5,000 y una con panel de $6,500 a $9,500. Antes de empezar te doy un precio cerrado por escrito. Aparte solo pagas tu dominio (entre $300 y $600 al año) y, si lo quieres, el mantenimiento mensual."],
  ["¿Cuánto tarda?", "Entre 2 y 8 semanas según el paquete. La mayor parte del tiempo se va en diseñar y ajustar contigo hasta que quede como quieres. Ayuda mucho que me compartas pronto tus fotos, precios y textos."],
  ["¿Qué necesito darte?", "Tu logo si tienes, fotos de tu negocio y de lo que vendes, precios, horario, dirección y tus redes. Si no tienes buenas fotos o no sabes qué escribir, te ayudo a resolverlo."],
  ["¿Puedo cambiar cosas después?", "Sí. Con el paquete Con panel cambias precios, horarios, fotos y textos tú mismo desde tu celular o computadora. Si tienes Presencia, me mandas el cambio por WhatsApp y lo hago yo con el mantenimiento."],
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
function cerrarDialogo(d) { if (!d.open || d.classList.contains("sale")) return; if (QUIETO || d.id === "visor") { d.close(); return; }
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
$$("[data-rev] span").forEach(s => { const f = s.textContent; s.parentElement.addEventListener("pointerenter", () => descifrar(s, f, 420)); });

/* ---------- cursor que acompaña ---------- */
const cursor = $(".cursor");
let cx = 0, cy = 0, ctx2 = 0, cty = 0;
if (FINO && !QUIETO) {
  addEventListener("pointermove", e => { if (!cursor.classList.contains("on")) { cx = e.clientX; cy = e.clientY; } ctx2 = e.clientX; cty = e.clientY; cursor.classList.add("on");
    const ver = e.target.closest(".fila button"), link = e.target.closest("a, button, summary, input, select, textarea, .hero");
    cursor.classList.toggle("ver", !!ver); cursor.classList.toggle("link", !ver && !!link); }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
  $("span", cursor).textContent = "ver";
}

/* ================= APARICIONES ================= */
const ob = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const el = e.target; el.classList.add("ok"); ob.unobserve(el);
  if (el.dataset.tit === "descifra") descifrar(el, el.getAttribute("aria-label"), 1100);
  if (el.classList.contains("plan")) { contar($(".precio", el)); setTimeout(() => el.classList.add("listo"), 1400); }
}), { rootMargin: "0px 0px -12% 0px" });
$$("[data-tit], .rv, .fila, .plan, .limpia, .faq details, .form").forEach(el => ob.observe(el));
$$(".limpia").forEach((el, i) => el.style.setProperty("--d", (i * 140) + "ms"));
if (QUIETO) $$("[data-tit=descifra]").forEach(el => el.textContent = el.getAttribute("aria-label"));

/* sección actual tachada en el menú, con glitch */
const nav = $(".nav"), links = $$("a", nav);
let actual = "";
const obS = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const id = ({ inicio: "", gana: "", proceso: "precios", preguntas: "precios" })[e.target.id] ?? e.target.id;
  if (id === actual) return; actual = id;
  links.forEach(a => a.classList.toggle("actual", a.getAttribute("href") === "#" + id));
  nav.classList.remove("glitch"); void nav.offsetWidth; if (!QUIETO) nav.classList.add("glitch");
}), { rootMargin: "-45% 0px -50% 0px" });
$$("#inicio, #gana, #trabajos, #precios, #proceso, #sobre-mi, #preguntas, #contacto").forEach(s => obS.observe(s));

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
const barra = $(".top"), progreso = $(".progreso i"), correoLe = $$(".correo .le"), pintas = $$(".pinta");
function bucle(now) {
  if (lenis) lenis.raf(now);
  const y = scrollY, dy = y - ultY, vh = innerHeight; ultY = y;
  progreso.style.transform = `scaleX(${cl(y / (document.documentElement.scrollHeight - vh))})`;
  if (!QUIETO) {
    /* franja: velocidad y dirección según el scroll */
    if (Math.abs(dy) > .5) mV = cl(mV + Math.sign(dy) * Math.min(Math.abs(dy), 40) * .04, -6, 6);
    mV += ((Math.sign(mV) || 1) - mV) * .04;
    const w = marq.scrollWidth / 4; mX -= mV * (innerWidth < 700 ? .9 : 1.4); if (mX < -w) mX += w; if (mX > 0) mX -= w;
    marq.style.transform = `translate3d(${mX}px,0,0) skewX(${cl(-dy * .25, -10, 10)}deg)`;
    rayX += mV * .6; rayas.style.backgroundPosition = `${rayX}px 0`;
    /* showreel: se abre desde el centro */
    const r = marco.getBoundingClientRect(), k = cl((vh - r.top) / (vh * .9)), e = 1 - Math.pow(1 - k, 3);
    marco.style.setProperty("--ci", (12 * (1 - e)).toFixed(2) + "%"); marco.style.setProperty("--cl", (22 * (1 - e)).toFixed(2) + "%");
    marco.style.setProperty("--cr", (28 - 6 * e).toFixed(1) + "px"); marco.style.setProperty("--vs", (1.25 - .25 * e).toFixed(3));
    /* hojas: la de atrás se encoge cuando llega la siguiente */
    hojas.forEach((h, i) => { const sig = hojas[i + 1]; if (!sig) return; const a = h.getBoundingClientRect(), b = sig.getBoundingClientRect();
      const p = cl(1 - (b.top - a.top) / a.height); h.style.transform = `scale(${1 - p * .07}) translateY(${-p * 10}px)`; h.style.filter = `brightness(${1 - p * .25})`; });
    /* proceso horizontal */
    if (horizontal) { const pr = proc.getBoundingClientRect(), p = cl(-pr.top / Math.max(1, proc.offsetHeight - vh));
      pista.style.transform = `translate3d(${-p * distancia}px,0,0)`; procBarra.style.transform = `scaleX(${p})`;
      const act = Math.round(p * (pasos.length - 1)); pasos.forEach((li, i) => li.classList.toggle("on", i <= act)); }
    /* sobre mí: el texto se pinta palabra por palabra */
    pintas.forEach(pi => { const r2 = pi.getBoundingClientRect(), p = cl((vh * .88 - r2.top) / (r2.height + vh * .3)), ws = pi._w || (pi._w = $$(".w", pi)), n = Math.round(p * ws.length);
      if (pi._n !== n) { ws.forEach((w, i) => w.classList.toggle("on", i < n)); pi._n = n; } });
    /* correo: las letras suben en ola */
    const rc = $(".correo").getBoundingClientRect(), pc = cl((vh - rc.top) / (vh * .7));
    correoLe.forEach((le, i) => { const q = cl(pc * 1.8 - i / correoLe.length); le.style.transform = `translateY(${(1 - q) * 70}%) rotate(${(1 - q) * 12}deg)`; le.style.opacity = .15 + q * .85; });
    /* vista previa y cursor */
    if (FINO) { vx += (vtx - vx) * .14; vy += (vty - vy) * .14; vista.style.translate = `${vx}px ${vy}px`; vista.style.rotate = `${cl((vtx - vx) * .06, -10, 10)}deg`;
      cx += (ctx2 - cx) * .2; cy += (cty - cy) * .2; cursor.style.transform = `translate(${cx}px,${cy}px)`; }
  }
  requestAnimationFrame(bucle);
}
requestAnimationFrame(bucle);

/* ================= FIGURA DE FONDO: nudo con glitch rojo y azul ================= */
(function objeto() {
  const cv = $("canvas.obj"); if (!cv) return;
  const ctx = cv.getContext("2d"), off = document.createElement("canvas"), oc = off.getContext("2d"), TAU = Math.PI * 2;
  let W = 0, H = 0, dpr = 1, px = 0, py = 0, falla = 0, prox = 4, vivo = true, tx = 0, ty = 0;
  const medir = () => { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = off.width = W * dpr | 0; cv.height = off.height = H * dpr | 0; };
  const rot = ([x, y, z], a, b) => { let t = y * Math.cos(a) - z * Math.sin(a); z = y * Math.sin(a) + z * Math.cos(a); y = t;
    t = x * Math.cos(b) + z * Math.sin(b); z = -x * Math.sin(b) + z * Math.cos(b); x = t; return [x, y, z]; };
  const NP = 200, HILOS = 6, RAD = .085, KN = .27;
  const curva = u => [(Math.sin(u) + 2 * Math.sin(2 * u)) * KN, (Math.cos(u) - 2 * Math.cos(2 * u)) * KN, -Math.sin(3 * u) * KN * 1.2];
  const BASE = Array.from({ length: NP + 1 }, (_, i) => { const u = i / NP * TAU, p = curva(u), q = curva(u + .01);
    const T = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], tl = Math.hypot(...T); T.forEach((v, j) => T[j] = v / tl);
    let N = [T[1], -T[0], 0]; const nl = Math.hypot(...N) || 1; N = N.map(v => v / nl);
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]]; return { u, p, N, B }; });
  const dibujar = now => {
    const t = now / 1000;
    tx += (px - tx) * .06; ty += (py - ty) * .06;
    const ancho = W > 900, cx3 = ancho ? W * .72 : W / 2, cy3 = H / 2 + Math.sin(t * .9) * H * .03, S = Math.min(W, H) * (ancho ? .7 : .62), sc = scrollY * .0016, ra = t * .2 + sc * .6 + ty * .9, rb = t * .28 + sc + tx * 1.1;
    oc.setTransform(dpr, 0, 0, dpr, 0, 0); oc.clearRect(0, 0, W, H); oc.lineCap = "round"; oc.lineJoin = "round";
    const G = [];
    for (let h = 0; h < HILOS; h++) { const fila = [];
      BASE.forEach(({ u, p, N, B }) => { const a = h / HILOS * TAU + u * 2 + t * .8;
        const v = [0, 1, 2].map(j => p[j] + RAD * (Math.cos(a) * N[j] + Math.sin(a) * B[j]));
        const [x, y, z] = rot(v, ra, rb), k = 2.8 / (2.8 + z); fila.push([cx3 + x * S * k, cy3 - y * S * k]); });
      G.push(fila); }
    if (!QUIETO && t > prox) { falla = .1 + Math.random() * .1; prox = t + 6 + Math.random() * 5; }
    const g = falla > 0; falla = Math.max(0, falla - 1 / 60);
    const dx = g ? 3 + Math.random() * 4 : 0;
    [["rgba(255,43,94,.45)", -dx], ["rgba(60,160,255,.5)", dx], ["rgba(10,10,10,.9)", 0]].forEach(([col, o]) => {
      if (!g && o !== 0) return;
      oc.strokeStyle = col; oc.lineWidth = 1; oc.beginPath();
      G.forEach(f => { oc.moveTo(f[0][0] + o, f[0][1]); for (let i = 1; i < f.length; i++) oc.lineTo(f[i][0] + o, f[i][1]); });
      oc.stroke(); });
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!g) ctx.drawImage(off, 0, 0);
    else { const n = 10, h = cv.height / n;
      for (let i = 0; i < n; i++) { const sh = Math.random() < .3 ? (Math.random() - .5) * 30 * dpr : 0; ctx.drawImage(off, 0, i * h, cv.width, h, sh, i * h, cv.width, h); } }
    if (!QUIETO && vivo) requestAnimationFrame(dibujar);
  };
  medir(); addEventListener("resize", medir);
  addEventListener("pointermove", e => { px = cl((e.clientX - W / 2) / W, -1, 1); py = cl((e.clientY - H / 2) / H, -1, 1); }, { passive: true });
  document.addEventListener("visibilitychange", () => { const v = !document.hidden; if (v && !vivo) { vivo = true; requestAnimationFrame(dibujar); } vivo = v; });
  requestAnimationFrame(dibujar);
})();
