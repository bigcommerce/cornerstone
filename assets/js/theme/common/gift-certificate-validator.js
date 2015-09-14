export default function (cert) {
    if (typeof cert !== 'string') {
        return false;
    }

    return /^[A-Z0-9]{3}\-[A-Z0-9]{3}\-[A-Z0-9]{3}\-[A-Z0-9]{3}$/.exec(cert);
}
