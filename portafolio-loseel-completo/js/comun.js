/* Loseel · lo que comparten todas las páginas:
   scroll suave, cursor, menú de vidrio, cambio de página con cortina, apariciones,
   secciones que se tapan, cabecera que cambia de color y pie con las barras en 3D. */
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const HTML = document.documentElement, QUIETO = !HTML.classList.contains("anim");
const FINO = matchMedia("(hover:hover) and (pointer:fine)").matches;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const waCon = t => "https://wa.me/527821237103?text=" + encodeURIComponent(t);
const LOSEEL = { cuadro: [], medir: [] };
/* computadoras de pocos recursos: se apagan desenfoques y sombras, pero se quedan las transiciones */
let LIGERO = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 4;
if (LIGERO) HTML.classList.add("ligero");
function bajarCalidad() {
  if (LIGERO) return; LIGERO = true; HTML.classList.add("ligero");
  if (lenis) { try { lenis.destroy(); } catch (e) {} lenis = null; HTML.classList.remove("lenis"); }
}

/* ---------- scroll suave ---------- */
let lenis = null;
/* solo en computadoras con buen procesador: en las demás el scroll nativo se siente más fluido */
if (!QUIETO && FINO && !LIGERO && (navigator.hardwareConcurrency || 4) >= 8 && window.Lenis) {
  try { lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true }); HTML.classList.add("lenis"); } catch (e) { lenis = null; }
}
$$("dialog").forEach(d => d.setAttribute("data-lenis-prevent", ""));
function irA(destino) {
  if (lenis) lenis.scrollTo(destino === "#top" ? 0 : destino, { duration: 1.4 });
  else if (destino === "#top") scrollTo({ top: 0, behavior: QUIETO ? "auto" : "smooth" });
  else destino.scrollIntoView({ behavior: QUIETO ? "auto" : "smooth" });
}

/* ---------- cambio de página: la cortina azul sube, se carga la otra página y baja ---------- */
function esInterno(a) {
  if (!a || a.target === "_blank" || a.hasAttribute("download")) return false;
  const u = new URL(a.href, location.href);
  if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return false;
  return !(u.pathname === location.pathname && u.search === location.search);
}
document.addEventListener("click", e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest("a[href]"); if (!a) return;
  const h = a.getAttribute("href");
  /* enlaces dentro de la misma página */
  if (h === "#top" || (h.startsWith("#") && h.length > 1) || (new URL(a.href, location.href).pathname === location.pathname && a.hash)) {
    const dest = h === "#top" ? "#top" : document.getElementById(a.hash.slice(1)); if (!dest) return;
    e.preventDefault(); if (menuD.open) cerrarMenu(() => irA(dest)); else irA(dest); return;
  }
  if (!esInterno(a) || QUIETO) return;
  e.preventDefault();
  const ir = () => { try { sessionStorage.setItem("velo", "1"); } catch (x) {} HTML.classList.add("saliendo"); setTimeout(() => { location.href = a.href; }, 560); };
  if (menuD.open) cerrarMenu(ir); else ir();
});
addEventListener("pageshow", ev => { if (ev.persisted) { HTML.classList.remove("saliendo", "llega"); } });

/* ---------- menú de vidrio ---------- */
const menuD = $("#menu"), botonM = $(".menu-b");
let menuOcupado = false;
botonM.addEventListener("click", () => {
  if (menuOcupado || menuD.open) return; menuOcupado = true;
  const abrir = () => { menuD.showModal(); botonM.setAttribute("aria-expanded", "true"); if (lenis) lenis.stop(); menuOcupado = false; };
  if (QUIETO) { abrir(); return; }
  /* las barras dan un salto y luego se abre el menú */
  botonM.classList.add("arriba"); setTimeout(abrir, 460);
});
function cerrarMenu(luego) {
  if (!menuD.open) { if (luego) luego(); return; }
  menuD.classList.add("saliendo");
  setTimeout(() => { menuD.close(); menuD.classList.remove("saliendo"); if (luego) luego(); }, QUIETO ? 0 : 330);
}
menuD.addEventListener("close", () => { botonM.setAttribute("aria-expanded", "false"); botonM.classList.remove("arriba"); if (lenis) lenis.start(); });
menuD.addEventListener("cancel", e => { e.preventDefault(); cerrarMenu(); });
menuD.addEventListener("click", e => { if (e.target === menuD || e.target.closest("[data-cerrar]")) cerrarMenu(); });

/* ---------- apariciones ---------- */
const ob = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add("ok"); ob.unobserve(e.target); }), { rootMargin: "0px 0px -10% 0px" });
$$("[data-ap], [data-sube], [data-foto]").forEach(el => ob.observe(el));
/* correo grande: letra por letra */
$$(".correo .c1, .correo .c2").forEach(s => { s.innerHTML = [...s.textContent].map(c => `<span class="le">${c}</span>`).join(""); });

/* ---------- botones magnéticos y brillo al tocar ---------- */
if (FINO && !QUIETO) $$(".mag").forEach(m => {
  m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    m.style.transform = `translate(${x * .25}px,${y * .35}px)`; $$(":scope>span,:scope>svg", m).forEach(s => s.style.transform = `translate(${x * .1}px,${y * .14}px)`); });
  m.addEventListener("pointerleave", () => { m.style.transition = "transform .6s cubic-bezier(.2,1.6,.4,1)"; m.style.transform = ""; $$(":scope>span,:scope>svg", m).forEach(s => s.style.transform = ""); setTimeout(() => m.style.transition = "", 600); });
});
document.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; const l = e.target.closest(".btn, .hero-logo"); if (!l) return; l.classList.add("toque"); clearTimeout(l._t); l._t = setTimeout(() => l.classList.remove("toque"), 900); }, { passive: true });

/* ---------- preguntas: abren suave, una a la vez ---------- */
function cerrarDet(d) { d.classList.remove("abierto"); setTimeout(() => { if (!d.classList.contains("abierto")) d.open = false; }, QUIETO ? 0 : 480); }
$$(".faq summary").forEach(s => s.addEventListener("click", e => {
  e.preventDefault(); const d = s.parentElement;
  if (d.classList.contains("abierto")) { cerrarDet(d); return; }
  $$(".faq details.abierto").forEach(cerrarDet); d.open = true; requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add("abierto")));
}));

/* ---------- formulario → WhatsApp ---------- */
const form = $("#form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form)); let falta = null;
    ["nombre", "negocio"].forEach(n => { const i = form.elements[n], mal = !String(d[n] || "").trim(); i.classList.toggle("error", mal); if (mal && !falta) falta = i; });
    if (falta) { falta.focus(); avisar(falta.name === "nombre" ? "Escribe tu nombre" : "Escribe qué negocio tienes"); return; }
    open(waCon(`Hola Roberto, soy ${d.nombre.trim()}. Tengo ${d.negocio.trim()}. Me interesa: ${d.paquete}.${String(d.mensaje || "").trim() ? " " + d.mensaje.trim() : ""}`), "_blank", "noopener");
  });
  form.addEventListener("input", e => { if (e.target.classList.contains("error") && e.target.value.trim()) e.target.classList.remove("error"); });
}
function avisar(t) { const a = $(".aviso"); a.textContent = t; a.classList.add("on"); clearTimeout(avisar.t); avisar.t = setTimeout(() => a.classList.remove("on"), 2200); }
function copiar(t) {
  const ok = () => avisar("Correo copiado");
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(t).then(ok, () => avisar(t));
  else { const i = document.createElement("textarea"); i.value = t; document.body.appendChild(i); i.select(); try { document.execCommand("copy"); ok(); } catch (e) { avisar(t); } i.remove(); }
}
const visor = $("#visor");
document.addEventListener("click", e => {
  const cp = e.target.closest("[data-copiar]"); if (cp) { copiar(cp.dataset.copiar); return; }
  const v = e.target.closest("[data-ver]"); if (v) { $("img", visor).src = v.dataset.ver; $("img", visor).alt = v.dataset.pie; $("p", visor).textContent = v.dataset.pie; visor.showModal(); return; }
  if (e.target.closest("#visor")) visor.close();
});

/* ---------- cursor propio ---------- */
const cursor = $(".cursor");
let curX = -100, curY = -100, curAnt = -100, curAng = 0;
if (FINO && !QUIETO) {
  addEventListener("pointermove", e => { curX = e.clientX; curY = e.clientY; cursor.classList.add("on");
    const t = e.target, texto = t.closest("input, textarea"), ver = t.closest(".hito a, .galeria button"), mano = t.closest("a, button, summary, label, select");
    cursor.classList.toggle("oculto", !!texto); cursor.classList.toggle("ver", !!ver); cursor.classList.toggle("mano", !!mano && !texto); }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
  addEventListener("pointerdown", () => cursor.classList.add("click")); addEventListener("pointerup", () => cursor.classList.remove("click"));
  new MutationObserver(() => HTML.classList.toggle("dlg", $$("dialog[open]").length > 0)).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["open"] });
}

/* ---------- color de fondo por sección, títulos que se arman, cabecera y pie ---------- */
const main = $("main"), pie = $(".pie"), obj = pie && $(".pie-3d", pie), FR = 13;
const secs = $$("main > section").map(el => ({ el, fondo: (el.className.match(/\bs-(clara|negra|piedra|azul)\b/) || [, "clara"])[1], top: 0, h: 0 }));
/* títulos que llegan desordenados y se acomodan al entrar */
const dispersos = $$("[data-disperso]").map(el => {
  const partes = el.innerHTML.split(/(\s+|<em>|<\/em>)/).filter(Boolean); let enEm = false, html = "", n = 0;
  for (const t of partes) {
    if (t === "<em>") { enEm = true; continue; } if (t === "</em>") { enEm = false; continue; }
    if (/^\s+$/.test(t)) { html += " "; continue; }
    const r = (k => (Math.sin(k * 91.7 + el.textContent.length) * 43758.5) % 1)(n++), r2 = (Math.sin(n * 47.3) * 9631.7) % 1;
    html += `<span class="pz" style="--dx:${(r * 260).toFixed(0)}px;--dy:${(r2 * 140 + 60).toFixed(0)}px;--rz:${(r * 24).toFixed(1)}deg">${enEm ? `<em>${t}</em>` : t}</span>`;
  }
  el.setAttribute("aria-label", el.textContent); el.innerHTML = html;
  return { el, pz: $$(".pz", el), top: 0, ult: -1 };
});
const zooms = $$("[data-zoom] .zt").map(el => ({ el, top: 0, ult: -1 }));
const docTop = el => el.getBoundingClientRect().top + scrollY;
let ys = scrollY, vh = innerHeight, mainTop = 0, mainH = 0, pieH = 1, revela = false, ultY = -1;
function medir() {
  vh = innerHeight; mainTop = docTop(main); mainH = main.offsetHeight; pieH = pie ? pie.offsetHeight : 1;
  secs.forEach(s => { s.top = docTop(s.el); s.h = s.el.offsetHeight; });
  dispersos.forEach(d => { d.top = docTop(d.el); d.ult = -1; }); zooms.forEach(z => { z.top = docTop(z.el); z.ult = -1; });
  revela = !QUIETO && !!pie && pieH <= vh + 1; HTML.classList.toggle("pie-revela", revela);
  LOSEEL.medir.forEach(f => f()); ultY = -1;
}
let cuadro = -1, mx = 0;
function verCuadro(i) { i = Math.round(cl(i, 0, FR - 1)); if (i === cuadro || !obj) return; cuadro = i; obj.style.backgroundPositionX = (i / (FR - 1) * 100).toFixed(3) + "%"; }
if (obj && FINO) pie.addEventListener("pointermove", e => { mx = (e.clientX / innerWidth - .5) * 2; ultY = -1; }, { passive: true });
if (obj) { const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { obj.classList.add("listo"); io.disconnect(); } }, { rootMargin: "120% 0px" }); io.observe(main.lastElementChild || pie); }
let fondo = null, oscura = null;
function ponerFondo(f) { if (f === fondo) return; fondo = f; HTML.dataset.fondo = f; }
function alScroll(y) {
  /* el fondo toma el color de la sección que ocupa la mitad de la pantalla */
  let f = secs.length ? secs[0].fondo : "clara";
  for (const s of secs) if (s.top - y <= vh * .5) f = s.fondo;
  if (LOSEEL.fondoForzado) f = LOSEEL.fondoForzado;
  if (!QUIETO) ponerFondo(f);
  if (!QUIETO) {
    for (const d of dispersos) {
      const k = Math.round(cl((y + vh - d.top) / (vh * .7)) * 100) / 100; if (k === d.ult) continue; d.ult = k;
      const e = 1 - Math.pow(1 - k, 3), q = 1 - e;
      d.pz.forEach(p => { p.style.transform = q ? `translate(calc(var(--dx) * ${q.toFixed(3)}),calc(var(--dy) * ${q.toFixed(3)})) rotate(calc(var(--rz) * ${q.toFixed(3)}))` : ""; p.style.opacity = (.15 + .85 * e).toFixed(2); });
      d.el.classList.toggle("listo", k >= 1);
    }
    for (const z of zooms) {
      const k = Math.round(cl((y + vh - z.top) / (vh * .9)) * 200) / 200; if (k === z.ult) continue; z.ult = k;
      const e = 1 - Math.pow(1 - k, 2); z.el.style.transform = `scale(${(.55 + .45 * e).toFixed(4)})`; z.el.style.letterSpacing = `${(.12 * (1 - e)).toFixed(3)}em`;
    }
  }
  /* cabecera clara sobre fondo oscuro */
  const mb = mainTop + mainH - y, os = mb < 50 || (QUIETO ? false : f === "negra");
  if (os !== oscura) { oscura = os; HTML.classList.toggle("cab-clara", os); }
  if (pie) {
    const q = cl((vh - mb) / pieH), ve = revela ? q > .02 : mb < vh;
    if (ve !== pie._ve) { pie._ve = ve; pie.classList.toggle("corre", ve); }
    verCuadro((QUIETO ? .5 : cl(revela ? q : (vh - mb) / vh)) * (FR - 1) * .8 + FR * .1 + mx * 2.2);
  }
}
let rt; const re = () => { clearTimeout(rt); rt = setTimeout(medir, 150); };
addEventListener("resize", re); addEventListener("load", medir);
if (window.ResizeObserver) new ResizeObserver(re).observe(main);

/* ---------- un solo ciclo para todo ---------- */
let tF = 0, nF = 0, uN = 0;
function bucle(now) {
  if (!LIGERO && uN && now > 1500 && now < 6500) { tF += now - uN; nF++; if (nF > 45 && tF / nF > 21) bajarCalidad(); }
  uN = now;
  if (lenis) lenis.raf(now);
  /* el scroll se suaviza aquí: la rueda del mouse avanza a saltos y así las animaciones lo siguen sin brincos */
  const yr = scrollY;
  if (lenis || QUIETO || Math.abs(yr - ys) < .4) ys = yr; else ys += (yr - ys) * (LIGERO ? .2 : .13);
  if (ys !== ultY) { ultY = ys; alScroll(ys); }
  LOSEEL.cuadro.forEach(f => f(ys, vh, now, yr));
  if (FINO && !QUIETO && !LIGERO) { const v = curX - curAnt; curAnt = curX; curAng += (cl(v * 1.4, -28, 28) - curAng) * .18;
    cursor.style.transform = `translate(${(curX - 4).toFixed(1)}px,${(curY - 3).toFixed(1)}px) rotate(${curAng.toFixed(1)}deg)`; }
  requestAnimationFrame(bucle);
}
medir(); requestAnimationFrame(bucle);
