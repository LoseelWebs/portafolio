/* se carga antes de pintar: activa las animaciones si la persona no pidió movimiento reducido */
try { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("anim"); } catch (e) {}
