const NUMBER = '[NUMBER]';
const integerRegExp = /[0-9]+/;
const lastIntegerRegExp = /(\d+)(?!.*\d)/;

export default (textForChange, slideNumber, slideCount) => {
    const valueToReplace = textForChange.includes(NUMBER) ? NUMBER : integerRegExp;

    return textForChange
        .replace(valueToReplace, slideNumber)
        .replace(lastIntegerRegExp, slideCount);
};
