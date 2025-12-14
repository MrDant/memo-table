<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        Tableau Mémoire - Association Chiffres & Icônes
      </h1>
      
      <MemoTable />
    </div>
  </div>
</template>

<script setup>
// Dans un composant ou un plugin
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

</script>
