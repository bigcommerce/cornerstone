import { ScriptLoader, StylesheetLoader } from '@bigcommerce/script-loader';

import { loadPaymentMethods } from '../../common/requests';

export default class Adyenv2 {
    constructor(options) {
        this.options = options;
        this._stylesheetLoader = new StylesheetLoader();
        this._scriptLoader = new ScriptLoader();
    }
    _initialize() {
        return Promise.all([
            this._stylesheetLoader.loadStylesheet('https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.10.1/adyen.css'),
            this._scriptLoader.loadScript('https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.10.1/adyen.js'),
        ])
            .then(loadPaymentMethods)
            .then(response => {
                console.log({ response });
                const configuration = {
                    locale: 'en_US', // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/online-payments/components-web/localization-components.
                    environment: response.body[0].initializationData.environment, // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/online-payments/components-web#testing-your-integration.
                    originKey: response.body[0].initializationData.originKey,
                    paymentMethodsResponse: response.body[0].initializationData.paymentMethodsResponse,
                    showPayButton: false,
                };
                if (!window.AdyenCheckout) {
                    throw new Error('Error!!');
                }
                return new window.AdyenCheckout(configuration);
            });
    }

    render(widgetStyles) {
        this._initialize()
            .then(checkout => {
                checkout.create('card', {
                    styles: {
                        ...widgetStyles,
                    },
                }).mount('#component-container');
            });
    }
};
