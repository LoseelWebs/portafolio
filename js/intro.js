/* Partículas que arman "loseel webs".
   - formar(t): entrada, depende solo del tiempo.
   - vivir(): después de armarse, cada partícula va a su letra con resortes, se aparta del cursor
     y, conforme bajas, viaja del nombre grande al nombre chico de arriba a la izquierda. */
(function () {
  "use strict";
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const h1 = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  /* A: letras grandes (y en coordenadas de página). B: letras chicas (coordenadas de pantalla). */
  window.crearIntro = function (W, H, A, B, op) {
    op = Object.assign({ rojo: "rgba(255,43,94,.6)", azul: "rgba(40,150,255,.65)", polvo: "rgba(10,10,10,.5)", nPolvo: 260 }, op || {});
    const nL = A.length, S = Math.min(W, H), VIAJE = 1.15, P = [], porLetra = A.map(() => []);
    A.forEach((le, li) => {
      const chicos = B ? B[li].pts : null;
      le.pts.forEach((tp, k) => {
        const s = h1(li * 1000 + k * 1.37), s2 = h1(k * 7.7 + li * 3.1), s3 = h1(k * 2.3 + li * 9.9), ang = h1(k * 4.1 + li) * 6.283;
        const b = chicos && chicos.length ? chicos[Math.min(chicos.length - 1, (k / le.pts.length * chicos.length) | 0)] : tp;
        const p = { li, tx: tp[0], ty: tp[1], bx: b[0], by: b[1], ox: s2 * W, oy: s3 * H, s, dx: Math.cos(ang), dy: Math.sin(ang), c: le.color, rA: le.r, rB: B ? B[li].r : le.r,
          sale: .7 + li * .1 + s * .3, x: 0, y: 0, vx: 0, vy: 0, q: 0, a: 0, r: le.r };
        P.push(p); porLetra[li].push(p);
      });
    });
    const POLVO = Array.from({ length: op.nPolvo }, (_, k) => ({ ox: h1(k * 5.1 + 1) * W, oy: h1(k * 3.3 + 2) * H, s: h1(k * 9.7 + 3), r: .8 + h1(k) * 1.4 }));
    const FIN = .7 + (nL - 1) * .1 + .3 + VIAJE + .15;
    const glitches = [[.5, .14]].concat(A.map((_, i) => [.7 + i * .1 + .3 + VIAJE - .05, .16]));
    const suelta = (ox, oy, s, t) => {
      const a = t * (.35 + s * .4) + s * 6.28, rr = 18 + s * 40, cx = W / 2, cy = H / 2, dx = ox - cx, dy = oy - cy, gi = t * .12 * (s - .5);
      return [cx + dx * Math.cos(gi) - dy * Math.sin(gi) + Math.cos(a) * rr, cy + dx * Math.sin(gi) + dy * Math.cos(gi) + Math.sin(a * 1.3) * rr];
    };
    let modo = "formar", sAct = 0, quietud = 0;
    const desp = new Float32Array(nL);
    function formar(t, sy) {
      P.forEach(p => {
        const [sx, sy2] = suelta(p.ox, p.oy, p.s, t), q = eio(cl((t - p.sale) / VIAJE)), arco = Math.sin(q * Math.PI) * S * .09 * (p.s - .5), ty = p.ty - sy;
        p.x = sx + (p.tx - sx) * q + arco; p.y = sy2 + (ty - sy2) * q - arco * .7; p.q = q; p.a = cl(t / .5); p.vx = p.vy = 0; p.r = p.rA;
      });
    }
    /* destino según el avance del scroll: s = 0 nombre grande, s = 1 nombre chico */
    function destino(p, s, sy) {
      const si = eio(cl((s - p.s * .35) / .65)), esp = Math.sin(si * Math.PI) * S * .28 * (.4 + p.s);
      return [p.tx + (p.bx - p.tx) * si + p.dx * esp, (p.ty - sy) + (p.by - (p.ty - sy)) * si + p.dy * esp, si];
    }
    function vivir(s, sy, mx, my) {
      sAct = s; desp.fill(0); let mov = 0;
      const R = 110 - 80 * s, R2 = R * R;
      P.forEach(p => {
        const [gx, gy, si] = destino(p, s, sy);
        let ax = (gx - p.x) * .085, ay = (gy - p.y) * .085;
        if (mx > -999) { const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < R2) { const d = Math.sqrt(d2) + .01, f = (1 - d2 / R2) * (9 - 6 * s); ax += dx / d * f; ay += dy / d * f; } }
        p.vx = (p.vx + ax) * .8; p.vy = (p.vy + ay) * .8; p.x += p.vx; p.y += p.vy; p.q = 1; p.a = 1;
        p.r = p.rA + (p.rB - p.rA) * si;
        const dd = Math.abs(gx - p.x) + Math.abs(gy - p.y); desp[p.li] += dd; mov += Math.abs(p.vx) + Math.abs(p.vy);
      });
      porLetra.forEach((l, i) => desp[i] /= (l.length || 1));
      quietud = mov / (P.length || 1);
    }
    function colocar(s, sy) { P.forEach(p => { const [gx, gy, si] = destino(p, s, sy); p.x = gx; p.y = gy; p.q = 1; p.a = 1; p.r = p.rA + (p.rB - p.rA) * si; p.vx = p.vy = 0; }); modo = "vivir"; }
    function explotar(cx, cy) {
      P.forEach(p => { const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) + 1, f = 30 + p.s * 40; p.vx += dx / d * f * (200 / (d + 120)); p.vy += dy / d * f * (200 / (d + 120)); });
    }
    /* letras sólidas: cuando una letra está quieta se dibuja con su forma limpia encima */
    function letraLimpia(oc, it, dy, alfa) { if (alfa <= .01) return; oc.globalAlpha = alfa; oc.font = it.font; oc.fillStyle = it.color; oc.textBaseline = "alphabetic"; oc.fillText(it.ch, it.x, it.base - dy); }
    function dibujar(ctx, off, oc, t, dpr, gl, sy, itemsA, itemsB) {
      if (modo === "formar") glitches.forEach(([a, d]) => { if (t >= a && t < a + d) gl = true; });
      const fr = Math.floor(t * 30);
      oc.setTransform(dpr, 0, 0, dpr, 0, 0); oc.clearRect(0, 0, W, H);
      const fp = modo === "vivir" ? 1 : cl((t - FIN + .6) / .6);
      oc.fillStyle = op.polvo;
      POLVO.forEach(d => { const [x, y] = suelta(d.ox, d.oy, d.s, t); const al = (1 - fp * .7) * cl(t / .5) * (.35 + d.s * .5) * (1 - sAct); if (al <= .01) return; oc.globalAlpha = al; oc.fillRect(x - d.r, y - d.r - (modo === "vivir" ? sy * .3 : 0), d.r * 2, d.r * 2); });
      oc.globalAlpha = 1;
      const vuelo = P.filter(p => (p.q > 0 && p.q < 1) || (modo === "vivir" && Math.abs(p.vx) + Math.abs(p.vy) > 1.2));
      if (vuelo.length) [[op.rojo, -2.2], [op.azul, 2.2]].forEach(([c, o]) => { oc.fillStyle = c; vuelo.forEach(p => oc.fillRect(p.x - p.r + o, p.y - p.r, p.r * 2, p.r * 2)); });
      /* qué tan "limpia" está cada letra: quieta = se dibuja con su forma lisa y las partículas se ocultan */
      const limpia = new Float32Array(nL), sa = 1 - cl(sAct * 8), sb = cl((sAct - .92) / .08);
      if (modo === "vivir" && itemsA) for (let i = 0; i < nL; i++) limpia[i] = cl(1 - (desp[i] - .3) / 2) * Math.max(sa, itemsB ? sb : 0);
      else if (modo === "formar" && itemsA && t > FIN - .25) limpia.fill(cl((t - FIN + .25) / .25));
      P.forEach(p => { const al = (p.q > 0 ? 1 : p.a * (.45 + p.s * .45)) * (1 - limpia[p.li]); if (al <= .01) return; oc.globalAlpha = al; oc.fillStyle = p.c; const r = p.q > 0 ? p.r : p.r * .6; oc.fillRect(p.x - r, p.y - r, r * 2, r * 2); });
      for (let i = 0; i < nL && itemsA; i++) { if (limpia[i] <= .01) continue;
        if (modo === "formar" || sa > 0) letraLimpia(oc, itemsA[i], sy, limpia[i]);
        else if (itemsB) letraLimpia(oc, itemsB[i], 0, limpia[i]); }
      oc.globalAlpha = 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (!gl) ctx.drawImage(off, 0, 0);
      else { const n = 12, h = off.height / n;
        for (let i = 0; i < n; i++) { const sh = h1(fr * 13 + i) < .5 ? (h1(fr * 7 + i * 3) - .5) * 60 * dpr : 0; ctx.drawImage(off, 0, i * h, off.width, h, sh, i * h, off.width, h); } }
    }
    return {
      FIN,
      get quietud() { return quietud; },
      render(ctx, off, oc, t, dpr) { modo = "formar"; formar(t, 0); dibujar(ctx, off, oc, t, dpr, false, 0); },
      formar(ctx, off, oc, t, dpr, sy, itemsA) { modo = "formar"; formar(t, sy); dibujar(ctx, off, oc, t, dpr, false, sy, itemsA); },
      vivir(ctx, off, oc, t, dpr, s, sy, mx, my, gl, itemsA, itemsB) { modo = "vivir"; vivir(s, sy, mx, my); dibujar(ctx, off, oc, t, dpr, gl, sy, itemsA, itemsB); },
      colocar, explotar
    };
  };

  window.puntosTexto = function (W, H, items, paso, solido) {
    const c = document.createElement("canvas"); c.width = Math.ceil(W); c.height = Math.ceil(H);
    const x = c.getContext("2d", { willReadFrequently: true }), out = [];
    items.forEach(it => {
      x.clearRect(0, 0, c.width, c.height); x.fillStyle = "#000"; x.font = it.font; x.textBaseline = "alphabetic"; x.fillText(it.ch, it.x, it.base);
      const m = x.measureText(it.ch), x0 = Math.max(0, it.x - 10 | 0), y0 = Math.max(0, it.base - m.actualBoundingBoxAscent - 10 | 0);
      const w = Math.min(c.width - x0, m.width + 40 | 0), h = Math.min(c.height - y0, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent + 20 | 0);
      const pts = []; if (w > 0 && h > 0) { const d = x.getImageData(x0, y0, w, h).data;
        for (let yy = 0; yy < h; yy += paso) for (let xx = 0; xx < w; xx += paso) if (d[(yy * w + xx) * 4 + 3] > 128) pts.push([x0 + xx + paso / 2, y0 + yy + paso / 2]); }
      out.push({ pts, color: it.color, r: solido ? paso * .5 + .35 : Math.max(1.1, paso * .44) });
    });
    return out;
  };
})();
