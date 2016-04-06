import nod from 'nod-validate';
import minMaxValidate from './nod-functions/min-max-validate';

// Hook our SCSS framework form field status classes into the nod validation system before use
nod.classes.errorClass = 'form-field--error';
nod.classes.successClass = 'form-field--success';
nod.classes.errorMessageClass = 'form-inlineMessage';

// Register validate functions
nod.checkFunctions['min-max'] = minMaxValidate;

export default nod;
