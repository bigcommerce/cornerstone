export default function (cert) {
    if (typeof cert !== 'string') {
        return false;
    }

    // Add any custom gift certificate validation logic here
    return true;
}
