import $ from 'jquery';
import '../../../theme/global/jquery-migrate';
//import { api } from '@bigcommerce/stencil-utils';
jest.mock('@bigcommerce/stencil-utils');
import utils from '@bigcommerce/stencil-utils';
const api = utils.api;
import modalFactory, { alertModal } from '../../../theme/global/modal';
import foundation from '../../../theme/global/foundation';
import stateCountry from '../../../theme/common/state-country';

//console.log(utils);
//jest.mock('api.country');

describe('StateCountry', () => {
    let $countryElement, $stateElement;

    beforeEach(() => {
        $countryElement = $(`
            <select class="form-select" id="shipping-country" name="shipping-country" data-field-type="Country">
                <option>Country</option>
                <option value="1">Peace Land</option>
                <option value="2">Serenityville</option>
                <option value="3">Moon Place</option>
            </select>
        `);
        $stateElement = $(`
            <select class="form-select" id="shipping-state" name="shipping-state" data-field-type="State">
                <option>State/province</option>
            </select>
        `);
        $countryElement.appendTo(document.body);
        $stateElement.appendTo(document.body);
    }); 

    afterEach(() => {
        $countryElement.remove();
        $stateElement.remove();
    });

    describe('on error', () => {
        let $modalElement, modal;

        beforeEach(() => {
            $modalElement = $(`
                <div id="alert-modal" class="modal modal--alert" data-reveal>
                    <div class="modal-content"></div>
                    <div class="loadingOverlay"></div>
                </div>
            `)
            $modalElement.appendTo(document.body);
            modal = alertModal();

            api.country.getByName.mockImplementation((countryName, callback) => {
                callback(new Error(countryName + 'missing'), null);
            });
            jest.spyOn(modal, 'open');
        });

        afterEach(() => {
            $modalElement.remove();
            $('body').removeClass();
        });

        it('should show modal', (done) => {
            stateCountry($stateElement, {state_error: 'Missing'}, {}, (err) => {
                expect(modal.open).toHaveBeenCalled();
                done();
            });

            $countryElement.val('1').trigger('change');
        });
    });

    describe('on change', () => {
        beforeEach(() => {
            api.country.getByName.mockImplementation((countryName, callback) => {
                let states = [];
                switch(countryName) {
                    case '1': break;
                    case '3':
                        states = [
                            {id: '1', name: 'Kepler'},
                            {id: '2', name: 'Grimaldi'},
                            {id: '3', name: 'Byrgius'}
                        ];
                    break;
                }

                callback(null, {data: {states}});
            });
        });

        it('should update states', (done) => {
            stateCountry($stateElement, {}, {}, (err) => {
                $stateElement.remove();
                $stateElement = $('[data-field-type="State"]');
                expect($stateElement.find('option').length).toEqual(4);

                const names = $stateElement.find('option').map(function() {
                    return $(this).text();
                }).get();
                expect(names).toEqual(['undefined', 'Kepler', 'Grimaldi', 'Byrgius']);

                done();
            });

            $countryElement.val('3').trigger('change');
        });

        it('should erase existing', (done) => {
            $countryElement.val('3').trigger('change');
            $countryElement.val('1').trigger('change');
            done();
        });
    });
});
