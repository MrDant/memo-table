// plugins/pwa.client.ts
export default defineNuxtPlugin(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {

          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  });
  