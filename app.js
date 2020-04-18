let registration;
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    registration = await navigator.serviceWorker
      .register("serviceWorker.js")
      .then((reg) => reg);
  });
}
