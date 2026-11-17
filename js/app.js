{
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const WA = "527821237103";
const waCon = t => "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
const ANIM = document.documentElement.classList.contains("anim");
const QUIETO = !ANIM;
const FINO = matchMedia("(hover:hover) and (pointer:fine)").matches;
const svgU = (id, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;
function aviso(t) { const a = $(".aviso"); a.textContent = t; a.classList.add("on"); clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove("on"), 2300); }
$$("[data-wa]").forEach(a => a.href = waCon(a.dataset.wa));

/* al terminar la pantalla de carga empiezan las apariciones */
let paginaLista = !ANIM;
function arrancar() { if (paginaLista) return; paginaLista = true; $$(".rv").forEach(el => io.observe(el)); $$(".cortina").forEach(el => { el.parentElement.dataset.cort = 1; io.observe(el.parentElement); }); mezclar($(".mezcla")); }

/* ---------- apariciones y letras que se acomodan ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("ok"); if (e.target.dataset.cort) $$(".cortina", e.target).forEach(c => c.classList.add("ok")); io.unobserve(e.target); if (e.target.matches(".cifras, .cifras *")) contar(); } }), { rootMargin: "0px 0px -8% 0px", threshold: .12 });
if (!ANIM) $$(".rv,.cortina").forEach(el => el.classList.add("ok"));
const GLY = "!<>-_/[]{}=+*^?#01ABCDEFXZ";
function mezclar(el) {
  if (!el || QUIETO) return; const fin = el.textContent, t0 = performance.now(), dur = 900;
  const paso = now => { const p = Math.min(1, (now - t0) / dur), n = Math.floor(fin.length * p);
    el.textContent = fin.slice(0, n) + fin.slice(n).replace(/\S/g, () => GLY[Math.random() * GLY.length | 0]);
    if (p < 1) requestAnimationFrame(paso); else el.textContent = fin; };
  requestAnimationFrame(paso);
}
let contado = false;
function contar() {
  if (contado) return; contado = true;
  $$(".cuenta").forEach(el => { const n = +el.dataset.n, suf = el.textContent.replace(/^\d+/, ""), t0 = performance.now();
    const paso = now => { const p = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(paso); };
    QUIETO ? el.textContent = n + suf : requestAnimationFrame(paso); });
}

/* ---------- indicador que se desliza en pestañas y menú ---------- */
function bola(cont, btn) {
  const b = $(".bola", cont); if (!b || !btn) { if (b) b.style.opacity = 0; return; }
  b.style.opacity = 1; b.style.width = btn.offsetWidth + "px"; b.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
}
function pestanas(cont, alCambiar) {
  cont.addEventListener("click", e => { const b = e.target.closest("[role=tab]"); if (!b || b.getAttribute("aria-selected") === "true") return;
    $$("[role=tab]", cont).forEach(x => x.setAttribute("aria-selected", x === b)); bola(cont, b); b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: QUIETO ? "auto" : "smooth" }); alCambiar(b); });
  cont.addEventListener("keydown", e => { if (!/Arrow(Left|Right)/.test(e.key)) return; const t = $$("[role=tab]", cont), i = t.findIndex(x => x.getAttribute("aria-selected") === "true");
    const n = t[(i + (e.key === "ArrowRight" ? 1 : -1) + t.length) % t.length]; n.focus(); n.click(); });
  requestAnimationFrame(() => bola(cont, $("[aria-selected=true]", cont)));
  addEventListener("resize", () => bola(cont, $("[aria-selected=true]", cont)));
}

/* ---------- lo que logras: flechas ---------- */

/* ================= TRABAJOS ================= */
const CASOS = window.CASOS || [];
const corto = c => c.cliente.replace("Academia ", "").replace(" Río Cazones", "").replace(" · Punto de venta", "");
function tarjetaCaso(c, i) {
  const cels = (c.galeria || []).filter(g => g.tipo === "cel"), pc = c.portada || ((c.galeria || []).find(g => g.tipo !== "cel") || {}).foto;
  const tipo = c.etiqueta || (c.estado === "desarrollo" ? "En desarrollo" : "");
  return `<article class="proy rv" style="--c:${esc(c.color || "#2f5bd8")};--d:${(i % 2) * .1}s">
    <button type="button" class="proy-vis" data-caso="${i}" aria-label="Ver el caso de ${esc(c.cliente)}">
      ${pc ? `<span class="pc"><img src="${esc(pc)}" alt="" loading="lazy"></span>` : ""}
      ${cels[0] ? `<span class="mc a"><img src="${esc(cels[0].foto)}" alt="" loading="lazy"></span>` : ""}
      <span class="ver-caso">Ver el caso${svgU("i-fl")}</span>
    </button>
    <div class="proy-info">
      <div class="proy-cab"><span class="pre">${esc([c.giro, c.anio].filter(Boolean).join(" · "))}</span>${tipo ? `<span class="tipo">${esc(tipo)}</span>` : ""}</div>
      <h3>${esc(c.cliente)}</h3>
      ${c.frase ? `<p class="frase">${esc(c.frase)}</p>` : ""}
      <div class="etiquetas">${(c.capacidades || []).map(x => `<span>${esc(x)}</span>`).join("")}</div>
      <div class="acc"><button type="button" class="btn luz mag" data-caso="${i}">Ver el caso completo${svgU("i-fl", "ic fl")}</button>${c.enlace ? `<a class="btn borde mag" href="${esc(c.enlace)}" target="_blank" rel="noopener">Visitar${svgU("i-ext")}</a>` : ""}</div>
    </div></article>`;
}
$("#proyectos").innerHTML = CASOS.map(tarjetaCaso).join("");
$("#trabajos").dataset.color = (CASOS[0] || {}).color || "";
$$("#proyectos .proy").forEach((p, i) => p.addEventListener("pointerenter", () => $("#trabajos").dataset.color = CASOS[i].color || ""));
/* ventana del caso */
function abrirCaso(i) {
  const c = CASOS[i], d = $("#d-caso"), gal = (c.galeria || []);
  const tri = [["Antes", c.antes], ["El reto", c.reto], ["Lo que se hizo", c.solucion]].filter(x => x[1]);
  $("#d-caso-in").innerHTML = `<header style="--c:${esc(c.color || "#2f5bd8")}"><button type="button" class="cerrar" data-cerrar aria-label="Cerrar">${svgU("i-x")}</button>
    <span class="pre">${esc([c.giro, c.ciudad, c.anio].filter(Boolean).join(" · "))}</span><h3 id="d-caso-t">${esc(c.cliente)}</h3><p>${esc(c.resumen)}</p>
    ${c.enlace ? `<div class="acc"><a class="btn luz" href="${esc(c.enlace)}" target="_blank" rel="noopener">Ver la página en vivo${svgU("i-ext")}</a></div>` : ""}</header>
    <div class="cuerpo"><div class="sub-pest" role="tablist">
      <button type="button" role="tab" aria-selected="true" data-sp="historia">La historia</button>
      ${(c.funciones || []).length ? `<button type="button" role="tab" aria-selected="false" data-sp="funciones">Qué tiene</button>` : ""}
      ${gal.length ? `<button type="button" role="tab" aria-selected="false" data-sp="fotos">Capturas (${gal.length})</button>` : ""}</div>
      <div class="sp on" data-sp="historia"><div class="tres">${tri.map(([a, b]) => `<div><b>${a}</b><p>${esc(b)}</p></div>`).join("")}</div>
        ${(c.tecnologia || []).length ? `<div class="tec">${c.tecnologia.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}${c.nota ? `<p class="nota">${esc(c.nota)}</p>` : ""}</div>
      <div class="sp" data-sp="funciones"><div class="funcs">${(c.funciones || []).map(f => `<div><b>${esc(f.titulo)}</b><p>${esc(f.texto)}</p></div>`).join("")}</div></div>
      <div class="sp" data-sp="fotos"><div class="gal">${gal.map(g => `<button type="button" class="${g.tipo === "cel" ? "" : "pcg"}" data-ver="${esc(g.foto)}" data-pie="${esc(g.pie || "")}"><img src="${esc(g.foto)}" alt="${esc(g.pie || c.cliente)}" loading="lazy"><span>${esc(g.pie || "")}</span></button>`).join("")}</div></div>
    </div>`;
  d.showModal(); $(".in", d).scrollTop = 0;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-caso]"); if (b) { abrirCaso(+b.dataset.caso); return; }
  const sp = e.target.closest("[data-sp][role=tab]");
  if (sp) { const d = sp.closest(".cuerpo"); $$("[role=tab]", d).forEach(x => x.setAttribute("aria-selected", x === sp)); $$(".sp", d).forEach(p => p.classList.toggle("on", p.dataset.sp === sp.dataset.sp)); return; }
  const v = e.target.closest("[data-ver]"); if (v) { const vi = $("#visor"); $("img", vi).src = v.dataset.ver; $("img", vi).alt = v.dataset.pie; $("p", vi).textContent = v.dataset.pie; vi.showModal(); return; }
  if (e.target.closest("#visor")) { $("#visor").close(); return; }
  const x = e.target.closest("[data-cerrar]"); if (x) { x.closest("dialog").close(); return; }
  if (e.target.tagName === "DIALOG") e.target.close();
  const ab = e.target.closest("[data-abrir=quiz]"); if (ab) { reiniciarQuiz(); $("#d-quiz").showModal(); }
});

/* ================= PAQUETES ================= */
const PLANES = [
  { nombre: "Presencia", para: "Para que te encuentren y te escriban.", min: 3500, max: 5000, tiempo: "2 a 3 semanas", mant: "desde $250/mes", incl: ["Una página con hasta 5 apartados: portada, servicios o carta, horario, ubicación y contacto", "Botón de WhatsApp con mensaje listo y mapa para llegar", "Vista previa con tu logo al compartir el enlace", "Alta en Google y candado de seguridad", "Los cambios los hago yo con el mantenimiento"] },
  { nombre: "Con panel", para: "Para cambiar precios, horarios y fotos tú mismo.", min: 6500, max: 9500, tiempo: "3 a 5 semanas", mant: "desde $350/mes", rec: true, incl: ["Todo lo de Presencia", "Panel con tu propio usuario y contraseña", "Cambias textos, precios, horarios, fotos y promociones", "Historial para regresar a una versión anterior", "Una sesión para enseñarte a usarlo"] },
  { nombre: "A la medida", para: "Reservaciones, eventos o algo especial para tu negocio.", min: 10000, max: 18000, tiempo: "5 a 8 semanas", mant: "desde $550/mes", incl: ["Todo lo de Con panel", "Un módulo hecho para tu negocio: reservaciones, citas, cartelera de eventos…", "Panel para administrarlo: confirmar, cancelar, bloquear horarios", "3 rondas de cambios durante el diseño", "Pago en tres partes"] }
];
const pesos = n => "$" + Math.round(n).toLocaleString("es-MX");
$("#p-pest").insertAdjacentHTML("beforeend", PLANES.map((p, i) => `<button type="button" role="tab" aria-selected="${i === 1}" data-i="${i}">${esc(p.nombre)}</button>`).join(""));
$("#f-paq").insertAdjacentHTML("beforeend", PLANES.map(p => `<option>${esc(p.nombre)} (${pesos(p.min)} – ${pesos(p.max)})</option>`).join(""));
let planAct = 1;
function pintarPlan(i) {
  const p = PLANES[i], antes = PLANES[planAct], el = $("#p-plan");
  el.innerHTML = `<span class="pre" style="color:var(--n-mute)">${["i", "ii", "iii"][i]}.${p.rec ? " · el más completo para empezar" : ""}</span><h3>${esc(p.nombre)}</h3><p class="para">${esc(p.para)}</p>
    <div class="precio"><b id="p-num">${pesos(p.min)} – ${pesos(p.max)}</b><span>pago único</span></div>
    <div class="dd"><div><small>Tiempo de entrega</small><b>${esc(p.tiempo)}</b></div><div><small>Después</small><b>${esc(p.mant)}</b></div></div>
    <ul class="incl">${p.incl.map((x, k) => `<li style="--i:${k}">${svgU("i-ok")}${esc(x)}</li>`).join("")}</ul>
    <div class="acc"><a class="btn luz mag" href="${waCon(`Hola Roberto, vi tu portafolio y me interesa el paquete ${p.nombre}. Te cuento de mi negocio:`)}" target="_blank" rel="noopener">${svgU("i-wa")}Quiero este paquete</a></div>`;
  if (!QUIETO && antes !== p) { const n = $("#p-num"), t0 = performance.now();
    const paso = now => { const k = Math.min(1, (now - t0) / 650), e = 1 - Math.pow(1 - k, 3); n.textContent = pesos(antes.min + (p.min - antes.min) * e) + " – " + pesos(antes.max + (p.max - antes.max) * e); if (k < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso); }
  planAct = i;
}
pestanas($("#p-pest"), b => pintarPlan(+b.dataset.i));
pintarPlan(1);
$("#tabla").innerHTML = `<table><thead><tr><th></th>${PLANES.map(p => `<th>${esc(p.nombre)}</th>`).join("")}</tr></thead><tbody>
  <tr><td>Precio</td>${PLANES.map(p => `<td>${pesos(p.min)} – ${pesos(p.max)}</td>`).join("")}</tr>
  <tr><td>Tiempo</td>${PLANES.map(p => `<td>${esc(p.tiempo)}</td>`).join("")}</tr>
  <tr><td>Mantenimiento</td>${PLANES.map(p => `<td>${esc(p.mant)}</td>`).join("")}</tr>
  <tr><td>Tú cambias precios y fotos</td><td>No, los hago yo</td><td>Sí, con tu panel</td><td>Sí, con tu panel</td></tr>
  <tr><td>Reservaciones o módulo especial</td><td>No</td><td>No</td><td>Sí</td></tr></tbody></table>`;
$("#ver-tabla").addEventListener("click", e => { const t = $("#tabla"), on = t.classList.toggle("on"); e.currentTarget.setAttribute("aria-expanded", on); e.currentTarget.textContent = on ? "Ocultar la comparación" : "Comparar los tres paquetes"; });

/* cuestionario */
const REC = { 1: "Con una página clara que reúna tu información y te mande clientes por WhatsApp es suficiente. Es la forma más económica de empezar.", 2: "Como cambias precios u ofertas seguido, te conviene hacerlo tú mismo desde el celular, sin esperar a nadie.", 3: "Para que tus clientes aparten o reserven necesitas un módulo hecho para tu negocio, con un panel para administrarlo." };
let qv = [], qt = "";
function reiniciarQuiz() { qv = []; qt = ""; $$("#d-quiz .qp").forEach((p, i) => p.classList.toggle("on", i === 0)); $("#d-quiz .q-barra i").style.width = "0"; }
$("#d-quiz").addEventListener("click", e => {
  if (e.target.closest("#q-otra")) { reiniciarQuiz(); return; }
  const op = e.target.closest(".qo button"); if (!op) return;
  const ps = $$("#d-quiz .qp"), i = ps.findIndex(p => p.classList.contains("on")); qv[i] = +op.dataset.v; if (op.dataset.t) qt = op.dataset.t;
  $("#d-quiz .q-barra i").style.width = Math.min(100, (i + 1) / 3 * 100) + "%";
  setTimeout(() => { ps[i].classList.remove("on"); ps[i + 1].classList.add("on");
    if (i + 1 === 3) { const k = Math.max(qv[0] || 1, qv[1] || 1), p = PLANES[k - 1];
      $("#q-nom").textContent = p.nombre; $("#q-txt").textContent = REC[k] + ` Va de ${pesos(p.min)} a ${pesos(p.max)} y tarda de ${p.tiempo}.`;
      $("#q-wa").href = waCon(`Hola Roberto, hice el cuestionario de tu página y me salió el paquete ${p.nombre}. ${qt ? "Sobre logo y fotos: " + qt + ". " : ""}Me gustaría platicarlo.`); } }, 260);
});

/* ================= CONÓCEME ================= */
let pasoT = null;
pestanas($("#c-pest"), b => { $$("#conoceme .panel-t").forEach(p => p.classList.toggle("on", p.dataset.panel === b.dataset.p)); if (b.dataset.p === "como") recorrerPasos(); else clearInterval(pasoT);  });
function recorrerPasos() {
  clearInterval(pasoT); const li = $$("#pasos li"); let i = 0; li.forEach((x, k) => x.classList.toggle("on", k === 0)); if (QUIETO) { li.forEach(x => x.classList.add("on")); return; }
  pasoT = setInterval(() => { i++; if (i >= li.length) { clearInterval(pasoT); return; } li[i].classList.add("on"); }, 900);
}
if (FINO && !QUIETO) { const m = $("#mono"); m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); m.style.setProperty("--ry", (((e.clientX - r.left) / r.width - .5) * 10).toFixed(1) + "deg"); m.style.setProperty("--rx", ((.5 - (e.clientY - r.top) / r.height) * 8).toFixed(1) + "deg"); }); m.addEventListener("pointerleave", () => { m.style.setProperty("--ry", "0deg"); m.style.setProperty("--rx", "0deg"); }); }


/* ================= PREGUNTAS ================= */
const FAQ = [
  ["¿Cuánto cuesta en total?", "Depende de lo que necesites: una página de presencia va de $3,500 a $5,000 y una con panel de $6,500 a $9,500. Antes de empezar te doy un precio cerrado por escrito. Aparte solo pagas tu dominio (entre $300 y $600 al año) y, si lo quieres, el mantenimiento mensual."],
  ["¿Cuánto tarda?", "Entre 2 y 8 semanas según el paquete. La mayor parte del tiempo se va en diseñar y ajustar contigo hasta que quede como quieres. Ayuda mucho que me compartas pronto tus fotos, precios y textos."],
  ["¿Qué necesito darte?", "Tu logo si tienes, fotos de tu negocio y de lo que vendes, precios, horario, dirección y tus redes. Si no tienes buenas fotos o no sabes qué escribir, te ayudo a resolverlo."],
  ["¿Puedo cambiar cosas después?", "Sí. Con el paquete Con panel cambias precios, horarios, fotos y textos tú mismo desde tu celular. Si tienes Presencia, me mandas el cambio por WhatsApp y lo hago yo con el mantenimiento."],
  ["Ya tengo Facebook, ¿para qué quiero una página?", "Facebook sirve mucho para publicar, pero ahí tus horarios y precios se pierden entre publicaciones y no siempre te encuentran en Google. La página junta todo en un solo lugar, siempre al día, y desde ahí enlazas tu Facebook."],
  ["¿Haces tiendas en línea o sistemas más grandes?", "Por ahora me enfoco en páginas para negocios locales. Para tiendas y refaccionarias estoy desarrollando Loseel, mi propio punto de venta. Si tienes una idea más grande, platiquemos y te digo con honestidad si puedo hacerla."]
];
$("#faq").innerHTML = [FAQ.slice(0, 3), FAQ.slice(3)].map(col => `<div>${col.map(([p, r]) => `<details class="rv"><summary>${esc(p)}<i aria-hidden="true"></i></summary><div class="r"><div><p>${esc(r)}</p></div></div></details>`).join("")}</div>`).join("");
document.addEventListener("toggle", e => { const d = e.target; if (d.tagName === "DETAILS" && d.open) $$("#faq details[open]").forEach(x => { if (x !== d) x.open = false; }); }, true);

/* ================= CONTACTO ================= */
document.addEventListener("click", e => { const b = e.target.closest("[data-copiar]"); if (!b) return;
  const ok = () => { b.textContent = "Copiado"; aviso("Copiado: " + b.dataset.copiar); setTimeout(() => b.textContent = "Copiar", 1600); };
  try { navigator.clipboard.writeText(b.dataset.copiar).then(ok, () => aviso(b.dataset.copiar)); } catch (err) { aviso(b.dataset.copiar); } });
$("#form").addEventListener("submit", e => {
  e.preventDefault(); const f = e.target, d = Object.fromEntries(new FormData(f)); let falta = null;
  ["nombre", "negocio"].forEach(n => { const i = f.elements[n], mal = !String(d[n] || "").trim(); i.classList.toggle("error", mal); if (mal && !falta) falta = i; });
  if (falta) { falta.focus(); aviso(falta.name === "nombre" ? "Escribe tu nombre" : "Cuéntame qué negocio tienes"); return; }
  const a = document.createElement("a"); a.href = waCon(`Hola Roberto, soy ${d.nombre.trim()}. Tengo ${d.negocio.trim()}. Me interesa: ${d.paquete}.${String(d.mensaje || "").trim() ? " " + d.mensaje.trim() : ""}`);
  a.target = "_blank"; a.rel = "noopener"; document.body.append(a); a.click(); a.remove(); aviso("Abriendo WhatsApp con tu mensaje…");
});
document.addEventListener("input", e => { if (e.target.classList && e.target.classList.contains("error") && e.target.value.trim()) e.target.classList.remove("error"); });



/* el destello de número y correo arranca en un punto, velocidad y sentido distintos cada vez */
function azar(v) { v.style.setProperty("--ini", (Math.random() * 360 | 0) + "deg"); v.style.setProperty("--dur", (1.6 + Math.random() * 1.6).toFixed(2) + "s"); v.style.setProperty("--sen", Math.random() < .5 ? "normal" : "reverse"); }
$$(".via").forEach(v => { v.addEventListener("pointerenter", () => azar(v)); v.addEventListener("focusin", () => azar(v)); v.addEventListener("animationiteration", () => { if (Math.random() < .35) v.style.setProperty("--dur", (1.6 + Math.random() * 1.6).toFixed(2) + "s"); }); });

/* ================= MENÚ ================= */
const menuD = $("#menu"), botonM = $(".menu-b");
let ocupado = false;
/* al presionar, la L cursiva se dibuja dentro del botón y luego abre el menú */
function dibujarL() {
  if (QUIETO) return Promise.resolve();
  return new Promise(ok => { botonM.classList.remove("listo-l"); void botonM.offsetWidth; botonM.classList.add("dibuja-l"); setTimeout(ok, 720); });
}
function actualTachado() {
  const y = innerHeight * .35; let act = "inicio";
  $$(".menu-links a").forEach(a => { const s = $(a.getAttribute("href")); if (!s) return; const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) act = s.id; });
  $$(".menu-links a").forEach(a => { const on = a.getAttribute("href") === "#" + act; a.classList.toggle("actual", on); if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
}
function abrirMenu() {
  if (ocupado || menuD.open) return; ocupado = true; actualTachado();
  dibujarL().then(() => { menuD.showModal(); menuD.classList.add("glitch"); setTimeout(() => menuD.classList.remove("glitch"), 700); $$("[data-menu]").forEach(x => x.setAttribute("aria-expanded", "true")); ocupado = false; });
}
$$("[data-menu]").forEach(b => b.addEventListener("click", abrirMenu));
menuD.addEventListener("close", () => { $$("[data-menu]").forEach(x => x.setAttribute("aria-expanded", "false")); botonM.classList.remove("dibuja-l"); });
menuD.addEventListener("click", e => {
  const a = e.target.closest("a[href^='#']"); if (!a) return; e.preventDefault(); if (ocupado) return; ocupado = true;
  const t = $(a.getAttribute("href"));
  menuD.classList.add("saliendo");
  setTimeout(() => { menuD.close(); menuD.classList.remove("saliendo"); if (t) t.scrollIntoView({ behavior: "instant" }); ocupado = false; }, QUIETO ? 0 : 280);
});

/* ================= GENERAL ================= */
let ultY = scrollY, tic = false;
function alMover() {
  tic = false; const y = scrollY, top = $(".top");
  top.classList.toggle("solido", y > 20); ultY = y;
  const bajo = $$(".noche").some(n => { const r = n.getBoundingClientRect(); return r.top < 40 && r.bottom > 40; }); top.classList.toggle("sobre-noche", bajo);
  const hero = $("#inicio").getBoundingClientRect().bottom, cont = $("#contacto").getBoundingClientRect().top;
  $(".flota").classList.toggle("on", hero < 0 && cont > innerHeight * .6);
}
addEventListener("scroll", () => { if (!tic) { tic = true; requestAnimationFrame(alMover); } }, { passive: true });
/* cursor, luz del fondo, botones magnéticos y ondas al tocar */
if (FINO && !QUIETO) {
  const cur = $(".cursor");
  addEventListener("pointermove", e => {
    cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; cur.classList.add("on");
    cur.classList.toggle("sobre", !!e.target.closest("a,button,summary,input,select,textarea,[role=tab]"));
    const m = e.target.closest(".mag");
    $$(".mag.iman").forEach(x => { if (x !== m) { x.classList.remove("iman"); x.style.transform = ""; } });
    if (m) { const r = m.getBoundingClientRect(); m.classList.add("iman"); m.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 12}px,${((e.clientY - r.top) / r.height - .5) * 10}px)`; }
  }, { passive: true });
  document.addEventListener("pointerleave", () => cur.classList.remove("on"));
}
/* en celular el destello aparece al tocar */
document.addEventListener("pointerdown", e => {
  const t = e.target.closest(".via, .btn.luz, .btn"); if (t && e.pointerType !== "mouse" && !QUIETO) { t.classList.add("toque"); clearTimeout(t._tq); t._tq = setTimeout(() => t.classList.remove("toque"), 2400); }
});
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn"); if (!b || QUIETO) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, o = document.createElement("span");
  o.className = "onda"; o.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.append(o); setTimeout(() => o.remove(), 650);
});
alMover();
/* ---------- pantalla de carga: la misma de la versión anterior ---------- */
(function intro() {
  const ov = document.getElementById("intro"); if (!ov) return;
  if (!ANIM) { ov.remove(); return; }
  const cv = document.getElementById("intro-cv"), ctx = cv.getContext("2d");
  let W, H, dpr, t0 = 0, salida = 0, raf = 0, hecho = false;
  const capa = document.createElement("canvas"), sombraR = document.createElement("canvas"), sombraA = document.createElement("canvas");
  /* el nombre se dibuja limpio y grande; el glitch son solo dos sombras de color que tiemblan poco */
  const preparar = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr | 0; cv.height = H * dpr | 0;
    const mx = capa.getContext("2d"); mx.font = '800 100px Syne, "Arial Black", sans-serif';
    const fs = Math.min(140, 100 * W * (W < 700 ? .84 : .56) / mx.measureText("loseel/webs").width);
    [[capa, null], [sombraR, "#ff2b5e"], [sombraA, "#1fb8ff"]].forEach(([c, col]) => { c.width = cv.width; c.height = cv.height; const x = c.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.font = `800 ${fs}px Syne, "Arial Black", sans-serif`; x.textBaseline = "middle";
      const a = "loseel", b = "/webs", wa = x.measureText(a).width, wb = x.measureText(b).width, x0 = (W - wa - wb) / 2;
      x.fillStyle = col || "#0d1326"; x.fillText(a, x0, H / 2); x.fillStyle = col || "#99a2b8"; x.fillText(b, x0 + wa, H / 2); });
  };
  const N = 16, franjas = Array.from({ length: N }, () => ({ fin: .1 + Math.random() * .6, dx: (Math.random() < .5 ? -1 : 1) * (40 + Math.random() * 120) }));
  const frame = now => {
    if (!t0) t0 = now; const se = salida ? (now - salida) / 1000 : 0;
    if (salida && se > .55) { terminar(); return; }
    const c = ctx, cw = cv.width, ch = cv.height, hb = ch / N, temblor = Math.random() < .25;
    c.clearRect(0, 0, cw, ch);
    for (let i = 0; i < N; i++) {
      const f = franjas[i], y = i * hb; let mover = 0;
      if (salida) { const p = (se - f.fin * .5) / .2; if (p >= 1) continue; if (p > 0) mover = f.dx * p * p; }
      const sh = (temblor && Math.random() < .3 ? (Math.random() - .5) * 14 : 0) + mover, sep = temblor ? 2 + Math.random() * 3 : 1.5;
      c.globalAlpha = 1; c.fillStyle = "#f1f4fa"; c.fillRect(mover * dpr, y, cw, hb + 1);
      c.globalAlpha = .55; c.drawImage(sombraR, 0, y, cw, hb, (sh - sep) * dpr, y, cw, hb); c.drawImage(sombraA, 0, y, cw, hb, (sh + sep) * dpr, y, cw, hb);
      c.globalAlpha = 1; c.drawImage(capa, 0, y, cw, hb, sh * dpr, y, cw, hb);
    }
    raf = requestAnimationFrame(frame);
  };
  const terminar = () => { if (hecho) return; hecho = true; cancelAnimationFrame(raf); ov.remove(); };
  const salir = () => { if (salida) return; salida = performance.now(); ov.classList.add("sale"); ov.style.pointerEvents = "none"; setTimeout(arrancar, 150); };
  const empezar = () => { preparar(); raf = requestAnimationFrame(frame); setTimeout(salir, 500); };
  addEventListener("resize", () => { if (!salida) preparar(); });
  ov.addEventListener("click", salir);
  Promise.race([document.fonts ? document.fonts.load('800 100px "Syne"') : Promise.resolve(), new Promise(r => setTimeout(r, 300))]).then(empezar, empezar);
  setTimeout(() => { salir(); setTimeout(terminar, 800); }, 2500);
})();
/* ---------- figura de fondo: el nudo en movimiento de la versión anterior ---------- */
let objStop = null;
function objeto() {
  if (objStop) { objStop(); objStop = null; }
  const cv = document.querySelector("canvas.obj"); if (!cv) return;
  let tono = [47, 91, 216];
  const ctx = cv.getContext("2d"), off = document.createElement("canvas"), oc = off.getContext("2d");
  const quieto = !document.documentElement.classList.contains("anim"), TAU = Math.PI * 2;
  let W = 0, H = 0, dpr = 1, px = 0, py = 0, falla = 0, prox = 1.5, vivo = true, raf = 0;
  const medir = () => { dpr = Math.min(2, devicePixelRatio || 1); const r = cv.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = off.width = Math.max(1, W * dpr | 0); cv.height = off.height = Math.max(1, H * dpr | 0); };
  const rot = ([x, y, z], a, b) => { let t = y * Math.cos(a) - z * Math.sin(a); z = y * Math.sin(a) + z * Math.cos(a); y = t;
    t = x * Math.cos(b) + z * Math.sin(b); z = -x * Math.sin(b) + z * Math.cos(b); x = t; return [x, y, z]; };
  /* nudo de tres vueltas hecho como un tubo de hilos que se van enroscando */
  const NP = 240, HILOS = 6, RAD = .085, KN = .27;
  const curva = u => [(Math.sin(u) + 2 * Math.sin(2 * u)) * KN, (Math.cos(u) - 2 * Math.cos(2 * u)) * KN, -Math.sin(3 * u) * KN * 1.2];
  const BASE = Array.from({ length: NP + 1 }, (_, i) => { const u = i / NP * TAU, p = curva(u), q = curva(u + .01);
    const T = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], tl = Math.hypot(...T); T.forEach((v, j) => T[j] = v / tl);
    let N = [T[1], -T[0], 0]; const nl = Math.hypot(...N) || 1; N = N.map(v => v / nl);
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]]; return { u, p, N, B }; });
  let tx = 0, ty = 0;
  const dibujar = now => {
    const t = now / 1000;
    tx += (px - tx) * .06; ty += (py - ty) * .06; /* se inclina hacia el mouse o el dedo */
    const cx = W / 2, cy = H / 2 + Math.sin(t * .9) * H * .03, S = Math.min(W, H) * .56, sc = scrollY * .0016, ra = t * .2 + sc * .6 + ty * .9, rb = t * .28 + sc + tx * 1.1;
    /* toma el color del proyecto que estás viendo */
    const ac = getComputedStyle(document.documentElement).getPropertyValue("--acc").trim().match(/^#([0-9a-f]{6})$/i);
    let meta = ac ? [0, 2, 4].map(k => parseInt(ac[1].slice(k, k + 2), 16)) : [143, 178, 255]; const mid = innerHeight / 2;
    const tr = document.getElementById("trabajos"); if (tr) { const r = tr.getBoundingClientRect(); if (r.top < mid && r.bottom > mid) { const m = String(tr.dataset.color || "").match(/^#([0-9a-f]{6})$/i); if (m) meta = [0, 2, 4].map(k => parseInt(m[1].slice(k, k + 2), 16)); } }
    tono = tono.map((v, k) => v + (meta[k] - v) * .05);
    const G = [];
    for (let h = 0; h < HILOS; h++) { const fila = [];
      BASE.forEach(({ u, p, N, B }) => { const a = h / HILOS * TAU + u * 2 + t * .8;
        const v = [0, 1, 2].map(j => p[j] + RAD * (Math.cos(a) * N[j] + Math.sin(a) * B[j]));
        const [x, y, z] = rot(v, ra, rb), k = 2.8 / (2.8 + z); fila.push([cx + x * S * k, cy - y * S * k]); });
      G.push(fila); }
    if (!quieto && t > prox) { falla = .1 + Math.random() * .1; prox = t + 6 + Math.random() * 5; }
    const g = falla > 0; falla = Math.max(0, falla - 1 / 60);
    oc.setTransform(dpr, 0, 0, dpr, 0, 0); oc.clearRect(0, 0, W, H); oc.globalCompositeOperation = "source-over"; oc.lineCap = "round"; oc.lineJoin = "round";
    const dx = g ? 3 + Math.random() * 4 : 1;
    [["rgba(255,43,94,.35)", -dx], ["rgba(34,190,255,.35)", dx], [`rgba(${tono.map(v => v | 0).join(",")},.9)`, 0]].forEach(([col, o]) => {
      oc.strokeStyle = col; oc.lineWidth = 1; oc.beginPath();
      G.forEach(f => { oc.moveTo(f[0][0] + o, f[0][1]); for (let i = 1; i < f.length; i++) oc.lineTo(f[i][0] + o, f[i][1]); });
      oc.stroke(); });
    oc.globalCompositeOperation = "source-over";
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!g) ctx.drawImage(off, 0, 0);
    else { const n = 10, h = cv.height / n;
      for (let i = 0; i < n; i++) { const sh = Math.random() < .3 ? (Math.random() - .5) * 30 * dpr : 0; ctx.drawImage(off, 0, i * h, cv.width, h, sh, i * h, cv.width, h); } }
    if (!quieto && vivo) raf = requestAnimationFrame(dibujar);
  };
  /* el mouse o el dedo inclinan el nudo hacia su lado */
  const mover = e => { const r = cv.getBoundingClientRect(); px = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / r.width));
    py = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / r.height)); };
  const soltar = () => { px = 0; py = 0; };
  const tocar = e => { mover(e); const r = cv.getBoundingClientRect(); if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) falla = .3; };
  medir(); addEventListener("resize", medir); addEventListener("pointermove", mover, { passive: true }); addEventListener("pointerdown", tocar, { passive: true });
  document.addEventListener("pointerleave", soltar); addEventListener("pointerup", e => { if (e.pointerType !== "mouse") setTimeout(soltar, 900); });
  const ob = new IntersectionObserver(([e]) => { const v = e.isIntersecting; if (v && !vivo) { vivo = true; raf = requestAnimationFrame(dibujar); } vivo = v; });
  ob.observe(cv);
  raf = requestAnimationFrame(dibujar);
  objStop = () => { cancelAnimationFrame(raf); ob.disconnect(); removeEventListener("resize", medir); removeEventListener("pointermove", mover); removeEventListener("pointerdown", tocar); document.removeEventListener("pointerleave", soltar); };
}

objeto();
if (!ANIM) arrancar();
}
