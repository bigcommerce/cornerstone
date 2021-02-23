/**
 * This function parses HTML entities in strings
 * @param str: String
 * @returns String
*/
export const safeString = (str) => {
    const d = new DOMParser();
    return d.parseFromString(str, 'text/html').body.textContent;
};
