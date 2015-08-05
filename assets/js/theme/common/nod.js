import nod from 'casperin/nod';

// Hook our SCSS framework form field status classes into the nod validation system before use
nod.classes.errorClass = 'form-field--error';
nod.classes.successClass = 'form-field--success';
nod.classes.errorMessageClass = 'form-inlineMessage';

export default nod;
