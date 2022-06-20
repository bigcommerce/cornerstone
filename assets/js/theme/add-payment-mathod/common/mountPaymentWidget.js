import { Adyenv2 } from '../providers';

const mountPaymentWidget = ({
    submitButtonClassNames,
    submitButtonContent,
    widgetStyles,
}) => {
    const searchParams = new URLSearchParams(window.location.search);
    const provider = searchParams.get('provider');

    const widgetArea = document.getElementById('vaulting-widget');
    const paymentWidget = document.createElement('div');
    paymentWidget.setAttribute('id', 'component-container');
    widgetArea.appendChild(paymentWidget);

    const saveButton = document.createElement('button');
    saveButton.setAttribute('id', 'saveButton');
    saveButton.setAttribute('class', submitButtonClassNames || 'button button--small button--primary');
    saveButton.textContent = submitButtonContent || 'Save';
    widgetArea.appendChild(saveButton);

    let widget;
    if (provider === 'adyenv2') {
        widget = new Adyenv2();
    }

    // widget = new DefaultProvider();

    widget.render(widgetStyles);

    saveButton.addEventListener('click', () => {
        // sent form data to server
        // widget.execute();
    });
};

export default mountPaymentWidget;
