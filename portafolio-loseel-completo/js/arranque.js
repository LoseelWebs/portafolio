/* se carga antes de pintar: activa las animaciones, la cortina al llegar de otra página y salta la intro si ya se vio */
try {
  var d = document.documentElement;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    d.classList.add("anim");
    if (sessionStorage.getItem("velo")) { d.classList.add("llega", "sin-intro"); sessionStorage.removeItem("velo"); }
    if (sessionStorage.getItem("intro")) d.classList.add("sin-intro");
  }
} catch (e) {}
