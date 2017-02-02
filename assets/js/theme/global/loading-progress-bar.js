export default function () {
    require('pace').start({
        document: false,
        ajax: {
            trackMethods: ['GET', 'POST'],
        },
    });
}
