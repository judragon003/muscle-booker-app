/**
 * 肌肉書僮 PWA 支援
 * Service Worker 註冊與 PWA 功能
 */

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('此瀏覽器不支援 Service Worker');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('Service Worker 已成功註冊:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker 註冊失敗:', error);
  }
}

export function setupPWAPrompt() {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA 安裝提示已準備');
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA 已安裝到主螢幕');
    deferredPrompt = null;
  });

  return {
    canInstall: () => !!deferredPrompt,
    install: async () => {
      if (!deferredPrompt) return false;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`使用者 ${outcome === 'accepted' ? '接受' : '拒絕'} 安裝 PWA`);
      deferredPrompt = null;
      return outcome === 'accepted';
    },
  };
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function getInstallationStatus() {
  return {
    isStandalone: isStandalone(),
    isPWACapable: 'serviceWorker' in navigator && 'PushManager' in window,
    isOnline: navigator.onLine,
  };
}
