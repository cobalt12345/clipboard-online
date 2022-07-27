const isAppleDevice = () => {
    if (navigator.appVersion.indexOf('Win') !== -1) {
        console.debug('OS Windows')

        return false;
    } else if (navigator.appVersion.indexOf('Mac') !== -1 && navigator.appVersion.indexOf('Chrome') !== -1) {
        console.debug('Mac OS & Chrome')

        return false;
    } else {

        return true;
    }
}

export default isAppleDevice;