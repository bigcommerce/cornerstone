import {
    creditCardType, Formatters, Validators,
} from '../../../theme/common/payment-method';

describe('PaymentMethod', () => {
    describe('creditCardType', () => {
        it('should return a credit card type from the first six caracters of a given string', () => {
            expect(creditCardType('370000')).toEqual('American Express');
            expect(creditCardType('388000')).toEqual('Diners Club');
            expect(creditCardType('601100')).toEqual('Discover');
            expect(creditCardType('516300')).toEqual('Mastercard');
            expect(creditCardType('411100')).toEqual('Visa');
        });
    });

    describe('Formatters', () => {
        let $form;

        beforeEach(() => {
            $form = $(
                `<form>
                  <input name="credit_card_number" />
                  <input name="expiration" />
              '</form>`,
            );
            $form.appendTo(document.body);
        });

        afterEach(() => {
            $form.remove();
        });

        describe('setCreditCardNumberFormat', () => {
            it('should be formatting the credit card number in a corresponding credit card type format', () => {
                Formatters.setCreditCardNumberFormat('form input[name="credit_card_number"]');
                const input = $('form input[name="credit_card_number"]');

                expect(input.val('370000000000000').trigger('keyup').val()).toEqual('3700 000000 00000');
                expect(input.val('38000000000000').trigger('keyup').val()).toEqual('3800 000000 0000');
                expect(input.val('6011000000000000').trigger('keyup').val()).toEqual('6011 0000 0000 0000');
                expect(input.val('5163000000000000').trigger('keyup').val()).toEqual('5163 0000 0000 0000');
                expect(input.val('4111000000000000').trigger('keyup').val()).toEqual('4111 0000 0000 0000');
            });
        });

        describe('setExpirationFormat', () => {
            it('should be formatting the expiration as month/year', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const input = $('form input[name="expiration"]');

                expect(input.val('1120').trigger('keyup').val()).toEqual('11/20');
                expect(input.val('0120').trigger('keyup').val()).toEqual('01/20');
            });

            it('should be adding a separator after month in two digits', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const event = $.Event('keyup');
                const input = $('form input[name="expiration"]');
                input.val('11').trigger(event);

                expect(event.target.value).toEqual('11/');
            });

            it('should be removing a separator after month on delete', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const event = $.Event('keyup', { which: 8, ctrlKey: false });
                const input = $('form input[name="expiration"]');
                input.val('11/').trigger(event);

                expect(event.target.value).toEqual('11');
            });

            it('should be completing month for intergers superior to one', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const event = $.Event('keyup');
                const input = $('form input[name="expiration"]');
                input.val('2').trigger(event);

                expect(event.target.value).toEqual('02/');
            });

            it('should not have more than two separators', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const event = $.Event('keyup');
                const input = $('form input[name="expiration"]');
                input.val('11//').trigger(event);

                expect(event.target.value).toEqual('11/');
            });

            it('should not have more than two zero', () => {
                Formatters.setExpirationFormat('form input[name="expiration"]');
                const event = $.Event('keyup');
                const input = $('form input[name="expiration"]');
                input.val('00').trigger(event);

                expect(event.target.value).toEqual('0');
            });
        });
    });

    describe('Validators', () => {
        describe('setCreditCardNumberValidation', () => {
            it('should have invalid input credit card number', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '4444 3333 2222') };
                Validators.setCreditCardNumberValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(false);
            });

            it('should have valid input credit card number', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '4444 3333 2222 1111') };
                Validators.setCreditCardNumberValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(true);
            });
        });

        describe('setExpirationValidation', () => {
            it('should have invalid input expiration date', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '01/17') };
                Validators.setExpirationValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(false);
            });

            it('should have valid input expiration date', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '12/30') };
                Validators.setExpirationValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(true);
            });
        });

        describe('setNameOnCardValidation', () => {
            it('should have invalid input name on card', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '') };
                Validators.setNameOnCardValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(false);
            });

            it('should have valid input name on card', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, 'Foo Bar') };
                Validators.setNameOnCardValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(true);
            });
        });

        describe('setCvvValidation', () => {
            it('should have invalid input cvv', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '12') };
                Validators.setCvvValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(false);
            });

            it('should have valid input cvv', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '123') };
                Validators.setCvvValidation(validator, 'selector');

                expect(callback).toHaveBeenCalledWith(true);
            });

            it('should have invalid input cvv for American Express', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '123') };
                Validators.setCvvValidation(validator, 'selector', null, 'American Express');

                expect(callback).toHaveBeenCalledWith(false);
            });

            it('should have valid input cvv for American Express', () => {
                const callback = jasmine.createSpy();
                const validator = { add: ({ validate }) => validate(callback, '1234') };
                Validators.setCvvValidation(validator, 'selector', null, () => 'American Express');

                expect(callback).toHaveBeenCalledWith(true);
            });
        });
    });
});
