import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        showNotification('Portal NAP', {
          body: 'Notificações ativadas com sucesso! Você receberá avisos sobre faturas e suporte.',
          icon: '/pwa-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const showNotification = async (title: string, options: NotificationOptions) => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, options);
      } else {
        // Fallback para desktop se Service Worker não suportar showNotification
        new Notification(title, options);
      }
    } catch (e) {
      // Fallback genérico
      new Notification(title, options);
    }
  };

  const simulatePush = (title: string, body: string) => {
    if (permission === 'granted' && isSupported) {
      showNotification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-maskable-512x512.png'
        
      });
    } else {
      alert(`Simulação de Push (Permissão negada ou não suportada):\n\n${title}\n${body}`);
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    simulatePush
  };
}
