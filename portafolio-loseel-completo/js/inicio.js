/* Loseel · página de inicio: portada con cortina azul y trabajos en ruta */
"use strict";
(() => {
  const hero = $(".hero"), heroLogo = $("#heroLogo"), logoMini = $("#logoMini");
  $(".lo", heroLogo).classList.add("le"); $(".lo", heroLogo).style.setProperty("--i", 0);

  /* ---- intro: la cortina azul se recoge en una franja y termina siendo la barra del centro del logo ---- */
  function portada() {
    const b = $(".b3d-meta", heroLogo), cort = $(".cortina", hero);
    if (QUIETO) { hero.classList.remove("pre"); return; }
    /* antes de empezar el logo ya tiene su tamaño final (solo está invisible): se mide la barra azul */
    const cr = $(".hero-fijo", hero).getBoundingClientRect(), q = b.getBoundingClientRect();
    cort.style.setProperty("--bt", (q.top - cr.top) + "px"); cort.style.setProperty("--bl", (q.left - cr.left) + "px");
    cort.style.setProperty("--br", (cr.right - q.right) + "px"); cort.style.setProperty("--bb", (cr.bottom - q.bottom) + "px");
    const tira = Math.max(26, q.width * 2.6), sl = q.left - cr.left - (tira - q.width) / 2;
    cort.style.setProperty("--sl", sl + "px"); cort.style.setProperty("--sr", (cr.width - sl - tira) + "px");
    hero.classList.remove("pre"); hero.classList.add("play");
    try { sessionStorage.setItem("intro", "1"); } catch (e) {}
  }
  const fuentes = document.fonts ? document.fonts.load("900 100px Unbounded").then(() => document.fonts.ready) : Promise.resolve();
  Promise.race([fuentes, new Promise(r => setTimeout(r, 1500))]).then(() => requestAnimationFrame(portada));

  /* ---- al bajar: se entra por la barra oscura del logo hasta que llena la pantalla de negro ---- */
  const imgs = [$(".l3a", heroLogo), $(".l3c", heroLogo), $(".l3b", heroLogo)], ZOOM = [1, 4.1602, 16.6805], NAT = [1400, 1600, 1800];
  const nom = $(".nom", heroLogo), caja3d = $(".logo3d", heroLogo);
  setTimeout(() => imgs.slice(1).forEach(i => { if (i.dataset.src) { i.src = i.dataset.src; i.removeAttribute("data-src"); } }), 2600);
  let miniOn = false, hUlt = -1, off = [], D = 300, c0x = 0, c0y = 0, sFin = 30, capa = 0, bx = 0, by = 0;
  function medirHero() {
    imgs.forEach(i => { i.style.width = i.style.height = i.style.transform = ""; });
    const r = caja3d.getBoundingClientRect(), a = imgs[0].getBoundingClientRect(), f = $(".hero-fijo", hero).getBoundingClientRect();
    off = imgs.map(i => [i.offsetLeft, i.offsetTop]); D = a.width; c0x = a.left + D / 2 - r.left; c0y = a.top + D / 2 - r.top;   /* centro de la barra oscura dentro de la caja */
    bx = r.left - f.left; by = r.top - f.top;                                   /* caja respecto a la pantalla fija */
    sFin = Math.max(f.width / (D * .161), f.height / (D * .384)) * 1.6; hUlt = -1;
  }
  medirHero(); LOSEEL.medir.push(medirHero);
  LOSEEL.cuadro.push((y, vh, now, yr = y) => {
    const m = yr > vh * .55; if (m !== miniOn) { miniOn = m; logoMini.classList.toggle("ver", m); hero.classList.toggle("fuera", m); }
    if (QUIETO) return;
    const alto = Math.max(1, hero.offsetHeight - vh), p = cl(y / alto), k = Math.round(p * 600) / 600;
    LOSEEL.fondoForzado = yr >= hero.offsetHeight - vh * .5 ? null : (k > .7 ? "negra" : (k > .02 ? "clara" : null));
    if (k === hUlt) return; hUlt = k;
    hero.classList.toggle("zoom", k > 0);
    const e = Math.pow(k, 2.3), s = 1 + e * (sFin - 1), m2 = Math.min(1, k * 1.5);
    /* la barra viaja al centro de la pantalla mientras crece */
    const fw = innerWidth, fh = vh, cx = c0x + (fw / 2 - bx - c0x) * m2, cy = c0y + (fh / 2 - by - c0y) * m2;
    const dpr = devicePixelRatio || 1, nueva = D * s / 4.1602 * dpr > NAT[1] * 1.1 ? 2 : D * s * dpr > NAT[0] * 1.1 ? 1 : 0;
    imgs.forEach((im, i) => {
      if (i > capa && i > nueva) return;
      const t = D * s / ZOOM[i];
      if (k === 0) { im.style.width = im.style.height = im.style.transform = ""; return; }
      im.style.width = im.style.height = t.toFixed(1) + "px";
      im.style.transform = `translate(${(cx - t / 2 - off[i][0]).toFixed(1)}px,${(cy - t / 2 - off[i][1]).toFixed(1)}px)`;
    });
    if (nueva !== capa) { capa = nueva; imgs[1].style.opacity = capa >= 1 ? 1 : 0; imgs[2].style.opacity = capa >= 2 ? 1 : 0; }
    /* al final la barra se funde con el negro de Trabajos: no queda ningún borde al terminar la portada */
    const fu = cl((Math.max(k, cl(yr / alto)) - .74) / .16); caja3d.style.opacity = k ? (1 - fu).toFixed(3) : "";
    nom.style.transform = k ? `translateX(${(k * 60).toFixed(2)}vw)` : ""; nom.style.opacity = k ? Math.max(0, 1 - k * 2.5).toFixed(2) : "";
  });

  /* ---- nombre de inicio: brillo y se acerca al cursor ---- */
  if (FINO && !QUIETO) { const hb = $(".barras", heroLogo), hn = $(".nom", heroLogo);
    heroLogo.addEventListener("pointermove", e => { const r = heroLogo.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      heroLogo.style.transform = `translate(${(x * 20).toFixed(1)}px,${(y * 14).toFixed(1)}px)`; hb.style.transform = `translate(${(x * 12).toFixed(1)}px,${(y * 9).toFixed(1)}px)`; hn.style.transform = `translate(${(x * 5).toFixed(1)}px,${(y * 4).toFixed(1)}px)`; });
    heroLogo.addEventListener("pointerleave", () => { [heroLogo, hb, hn].forEach(el => { el.style.transition = "transform .6s cubic-bezier(.2,1.6,.4,1)"; el.style.transform = ""; }); setTimeout(() => [heroLogo, hb, hn].forEach(el => el.style.transition = ""), 600); });
  }

  /* ---- trabajos: la línea avanza con el scroll y van apareciendo los proyectos ---- */
  const ruta = $(".ruta"), trazo = $(".ruta .trazo"), guia = $(".ruta .guia"), halos = $$(".ruta .halo1, .ruta .halo2"), punta = $(".ruta .punta"), hitos = $$(".hito");
  const CAMINOS = { pc: "M 0 235 C 200 235 330 230 355 330 S 410 525 520 505 S 665 390 685 270 S 800 120 1000 150", cel: "M 400 235 C 160 235 60 270 150 310 S 380 430 280 500 S 20 620 120 760 S 380 900 400 960" };
  const MARCAS = { pc: [.16, .48, .8], cel: [.2, .5, .8] };
  let largo = 0, marcas = [], rUlt = -1, rTop = 0, rAlto = 1, ancho = 0;
  function armarRuta() {
    const cel = innerWidth < 760, d = cel ? CAMINOS.cel : CAMINOS.pc, svg = $("svg", ruta);
    svg.setAttribute("viewBox", cel ? "0 0 400 1000" : "0 0 1000 600"); svg.setAttribute("preserveAspectRatio", "none");
    trazo.setAttribute("d", d); guia.setAttribute("d", d); halos.forEach(h => h.setAttribute("d", d)); largo = trazo.getTotalLength();
    [trazo, ...halos].forEach(t => { t.style.strokeDasharray = largo; t.style.strokeDashoffset = largo; });
    marcas = MARCAS[cel ? "cel" : "pc"]; rUlt = -1;
    let y = $("main").getBoundingClientRect().top + scrollY; for (const s of $("main").children) { if (s === ruta) break; y += s.offsetHeight; }
    rTop = y; rAlto = Math.max(1, ruta.offsetHeight - innerHeight); ancho = ruta.clientWidth;
  }
  function moverRuta(y, vh) {
    if (!largo) return; const p = QUIETO ? 1 : cl((y - rTop) / rAlto * 1.12);
    if (p <= 0 && rUlt <= 0 || Math.abs(p - rUlt) < .0005) return; rUlt = p;
    const L = largo * p, off = (largo - L).toFixed(1); trazo.style.strokeDashoffset = off; halos.forEach(h => h.style.strokeDashoffset = off);
    if (p > .005 && !ruta.classList.contains("encendida")) ruta.classList.add("encendida");
    const pt = trazo.getPointAtLength(Math.max(.1, L)), b = trazo.ownerSVGElement.viewBox.baseVal;
    punta.style.transform = `translate(${(pt.x / b.width * ancho).toFixed(1)}px,${(pt.y / b.height * vh).toFixed(1)}px)`; punta.style.opacity = p > .01 ? 1 : 0;
    hitos.forEach((h, i) => h.classList.toggle("si", p >= marcas[i] - .02));
  }
  armarRuta(); LOSEEL.medir.push(armarRuta);
  LOSEEL.cuadro.push((y, vh) => { if (y > rTop - vh && y < rTop + rAlto + vh) moverRuta(y, vh); });
  if (QUIETO) moverRuta(0, innerHeight);
})();
