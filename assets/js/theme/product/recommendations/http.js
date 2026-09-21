export default function request(method, url, data, headers, options) {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function onReadyStateChange() {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(xhr));
            }
        };
        xhr.withCredentials = (options && options.withCredentials) || false;
        xhr.responseType = (options && options.responseType) || 'json';
        xhr.open(method, url);

        Object.keys(headers || {}).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });

        xhr.send(data);
    });
}
