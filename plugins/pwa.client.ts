// plugins/pwa.client.ts
export default defineNuxtPlugin(() => {
  if ('serviceWorker' in navigator) {
    let refreshing = false;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré');

          // Vérifie aussi quand l'utilisateur revient sur l'app
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              registration.update();
            }
          });

          // Détecte quand un nouveau SW est disponible
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                afficherNotificationMAJ(newWorker);
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ ServiceWorker registration failed:', error);
        });
    });

    // Recharge la page quand le nouveau SW prend le contrôle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  // Notification de mise à jour
  function afficherNotificationMAJ(worker: ServiceWorker) {
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 90%;
      animation: slideUp 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <style>
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        #update-btn:hover {
          background: #48bb78 !important;
          transform: scale(1.05);
        }
      </style>
      <div style="text-align: center;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
          🎉 Nouvelle version disponible !
        </div>
        <button id="update-btn" style="
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        ">Mettre à jour maintenant</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('update-btn')?.addEventListener('click', () => {
      worker.postMessage({ action: 'skipWaiting' });
      notification.remove();
    });
  }

  // 🎨 Bouton d'installation stylé
  if (window.matchMedia('(display-mode: browser)').matches) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      
      // Conteneur principal avec animation d'entrée
      const installContainer = document.createElement('div');
      installContainer.id = 'install-container';
      installContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9998;
        animation: slideInRight 0.5s ease-out;
      `;

      installContainer.innerHTML = `
        <style>
          @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          #install-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 320px;
          }
          #install-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            transition: all 0.2s;
          }
          #install-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
          }
          #install-btn-main {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
            margin-top: 12px;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          #install-btn-main:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            animation: pulse 1s infinite;
          }
          .install-icon {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 12px;
          }
          .install-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .install-desc {
            font-size: 13px;
            opacity: 0.95;
            line-height: 1.4;
          }
        </style>
        
        <div id="install-card">
          <button id="install-close" aria-label="Fermer">×</button>
          
          <div class="install-icon">📱</div>
          
          <div class="install-title">
            Installer l'application
          </div>
          
          <div class="install-desc">
            Accédez rapidement à Tableau Mémoire depuis votre écran d'accueil !
          </div>
          
          <button id="install-btn-main">
            ⬇️ Installer maintenant
          </button>
        </div>
      `;

      document.body.appendChild(installContainer);

      // Bouton d'installation
      const installBtn = document.getElementById('install-btn-main');
      installBtn?.addEventListener('click', async () => {
        (e as any).prompt();
        const { outcome } = await (e as any).userChoice;
        
        if (outcome === 'accepted') {
          console.log('✅ PWA installée');
        }
        
        installContainer.remove();
      });

      // Bouton de fermeture
      const closeBtn = document.getElementById('install-close');
      closeBtn?.addEventListener('click', () => {
        installContainer.style.animation = 'slideInRight 0.3s ease-in reverse';
        setTimeout(() => installContainer.remove(), 300);
      });
    });
  }
});