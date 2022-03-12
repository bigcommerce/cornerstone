import { Validators } from '../../../theme/common/utils/form-utils';

describe('Validators', () => {
    let validator;

    beforeEach(() => {
        validator = {
            add: jest.fn(),
            configure: jest.fn(),
            setMessageOptions: jest.fn()
        };
    });

    describe('setMinMaxPriceValidation', () => {
        let selectors;
        const priceValidationErrorTexts = { 
            onMinPriceError: jasmine.any(String), 
            onMaxPriceError: jasmine.any(String), 
            minPriceNotEntered: jasmine.any(String), 
            maxPriceNotEntered: jasmine.any(String),  
            onInvalidPrice: jasmine.any(String), 
        };

        beforeEach(() => {
            selectors = {
                errorSelector: 'errorSelector',
                fieldsetSelector: 'fieldsetSelector',
                formSelector: 'formSelector',
                maxPriceSelector: 'maxPriceSelector',
                minPriceSelector: 'minPriceSelector',
            };
        });

        it('should add min-max validator to min price input', () => {
            Validators.setMinMaxPriceValidation(validator, selectors, priceValidationErrorTexts);

            expect(validator.add).toHaveBeenCalledWith({
                errorMessage: jasmine.any(String),
                selector: selectors.minPriceSelector,
                validate: `min-max:${selectors.minPriceSelector}:${selectors.maxPriceSelector}`,
            });
        });

        it('should add presence validator to max price input', () => {
            Validators.setMinMaxPriceValidation(validator, selectors, priceValidationErrorTexts);

            expect(validator.add).toHaveBeenCalledWith({
                errorMessage: jasmine.any(String),
                selector: selectors.maxPriceSelector,
                validate: 'presence',
            });
        });

        it('should add presence validator to max price input', () => {
            Validators.setMinMaxPriceValidation(validator, selectors, priceValidationErrorTexts);

            expect(validator.add).toHaveBeenCalledWith({
                errorMessage: jasmine.any(String),
                selector: selectors.maxPriceSelector,
                validate: 'presence',
            });
        });

        it('should add min-number validator to max/min price inputs', () => {
            Validators.setMinMaxPriceValidation(validator, selectors, priceValidationErrorTexts);

            expect(validator.add).toHaveBeenCalledWith({
                errorMessage: jasmine.any(String),
                selector: [selectors.minPriceSelector, selectors.maxPriceSelector],
                validate: 'min-number:0',
            });
        });
    });
});
