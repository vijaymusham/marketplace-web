/* eslint-disable no-undef */
/**
 * FCM background service worker.
 * Config comes from /firebase-messaging-config.js (stable URL — avoids duplicate SW handlers).
 *
 * IMPORTANT: Server sends both `notification` + `data`. Chrome already displays
 * the `notification` payload. Calling showNotification again causes TWO banners.
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

        // Chrome/FCM already shows system tray UI when `notification` is present.
        // Showing again = duplicate message. Only handle data-only pushes here.
        if (notification.title || notification.body) {
            return;
        }

        const title = data.title || "Deal Market";
        const body = data.body || "";
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
        if (hasVisibleClient) return;

        // Collapse any leftover notification with the same tag.
        const existing = await self.registration.getNotifications({ tag });
        for (const n of existing) n.close();

        await self.registration.showNotification(title, {
            body,
            icon: data.icon || "/file.svg",
            tag,
            renotify: false,
            data: {
                ...data,
                url: data.url || data.link || payload.fcmOptions?.link || "/chats",
            },
        });
    });
}

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    console.log(data);
    const target =
        data.url ||
        (data.conversationId ? `/chats/${data?.conversationId}` : "/chats");

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
