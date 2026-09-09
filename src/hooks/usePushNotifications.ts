import { useState, useEffect } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
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
        // Simulando que acabamos de receber uma notificação ao aceitar
        new Notification('Portal NAP', {
          body: 'Notificações ativadas com sucesso! Você receberá avisos sobre faturas e suporte.',
          icon: '/pwa-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const simulatePush = (title: string, body: string) => {
    if (permission === 'granted' && isSupported) {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png'
      });
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    simulatePush
  };
}
