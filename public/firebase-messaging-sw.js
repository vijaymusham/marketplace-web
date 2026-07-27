/* eslint-disable no-undef */
/**
 * FCM background service worker.
 * Config comes from /firebase-messaging-config.js (stable URL — avoids duplicate SW handlers).
 */
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js",
);
importScripts("/firebase-messaging-config.js");

const firebaseConfig = self.__FIREBASE_CONFIG__ || {};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(async (payload) => {
    const notification = payload.notification || {};
    const data = payload.data || {};
    const title = notification.title || data.title || "Deal Market";
    const body = notification.body || data.body || "";

    // Same tag → Chrome replaces instead of stacking a second banner.
    const tag =
      data.messageId ||
      data.notificationId ||
      data.tag ||
      `dm-${title}-${body}`.slice(0, 100);

    const windowClients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    const hasVisibleClient = windowClients.some(
      (client) => client.visibilityState === "visible" || client.focused,
    );
    // Foreground tab → in-app handler only; skip OS banner.
    if (hasVisibleClient) return;

    await self.registration.showNotification(title, {
      body,
      icon: notification.icon || data.icon || "/file.svg",
      tag,
      renotify: false,
      data: {
        ...data,
        url: data.url || data.link || payload.fcmOptions?.link || "/",
      },
    });
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target =
    (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) {
              return client.navigate(target);
            }
            return undefined;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(target);
        }
        return undefined;
      }),
  );
});
