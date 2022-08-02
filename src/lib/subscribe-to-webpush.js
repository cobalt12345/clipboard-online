import ApiClient from "./ApiClient";

const config = { pushKey: process.env.REACT_APP_VAPID_PUBLIC_KEY};


/**
 * This function causes issues on Apple devices. It sends Web Push notifications - works in Google Chrome only.
 * It doesn't affect text or files transmission.
 * It's necessary to enable or disable it depending on the device.
 *
 * @param secret
 * @param apiClient
 * @returns {Promise<void>}
 */
export default async function subscribe(secret, apiClient: ApiClient, isAppleDevice) {
    if (!isAppleDevice) {
        console.debug('Web push subscribe. Secret: %s', secret);
        let swReg = await navigator.serviceWorker.register("/sw.js");
        let subscription = await swReg.pushManager.getSubscription();
        console.debug('Subscribed to Web Push', JSON.stringify(subscription));
        if (!subscription) {
            subscription = await swReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(config.pushKey)
            });

        }
        apiClient.storeWebPushSubscription(JSON.stringify(subscription), secret);
    } else {
        console.warn('Web Push notifications are not supported for Ios');
    }
}

function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
