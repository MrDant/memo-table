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
    if (window.matchMedia('(display-mode: browser)').matches) {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          const installButton = document.createElement('button');
          installButton.textContent = 'Installer l\'app';
          installButton.style.position = 'fixed';
          installButton.style.bottom = '20px';
          installButton.style.right = '20px';
          installButton.style.zIndex = '9999';
          installButton.addEventListener('click', () => {
            e.prompt();
          });
          document.body.appendChild(installButton);
        });
      }
  });
  