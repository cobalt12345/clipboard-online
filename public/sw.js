if (!isAppleDevice()) {
    console.debug('Client compatible with web push');
    self.addEventListener("push", function (event) {
        const message = event.data.json();
        console.debug("Received push notification", JSON.stringify(message));
        self.registration.showNotification( message.title, { body: message.body, icon: '/favicon.ico', badge: '/mstile-150x150.png' });
    })
} else {
    console.warn('Client not compatible with web push. Skip subscription.')
}

function isAppleDevice() {
    if (navigator.appVersion.indexOf('Win') != -1) {
        console.debug('OS Windows')

        return false;
    } else if (navigator.appVersion.indexOf('Mac') != -1 && navigator.appVersion.indexOf('Chrome') != -1) {
        console.debug('Mac OS & Chrome')

        return false;
    } else {

        return true;
    }
}