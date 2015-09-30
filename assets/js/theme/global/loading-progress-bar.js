import 'hubspot/pace';

export default function() {
    Pace.start({
        document: false,
        ajax: {
            trackMethods: ['GET', 'POST'],
        },
    });
}
