import minMaxValidate from '../../../../theme/common/nod-functions/min-max-validate';
import $ from 'jquery';

describe('minMaxValidate', () => {
    let $max;
    let $min;
    let validateFn;
    let callback;

    beforeEach(() => {
        $min = $('<input id="min" type="number">').appendTo(document.body);
        $max = $('<input id="max" type="number">').appendTo(document.body);
        validateFn = minMaxValidate('#min', '#max');
        callback = jasmine.createSpy();
    });

    afterEach(() => {
        $max.remove();
        $min.remove();
    });

    it('should return false to validation callback if min > max', () => {
        $min.val(100);
        $max.val(10);
        validateFn(callback);

        expect(callback).toHaveBeenCalledWith(false);
    });

    it('should return false to validation callback if min == max', () => {
        $min.val(100);
        $max.val(100);
        validateFn(callback);

        expect(callback).toHaveBeenCalledWith(false);
    });

    it('should return true to validation callback if min < max', () => {
        $min.val(10);
        $max.val(100);
        validateFn(callback);

        expect(callback).toHaveBeenCalledWith(true);
    });
});
