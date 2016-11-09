import Pace from 'pace';

export default function () {
    // eslint-disable-next-line
    Pace.start({
        document: false,
        ajax: {
            trackMethods: ['GET', 'POST'],
        },
    });
}
