const extractSummary = (initialSummary) => {
    return initialSummary.match('BLOG-SUMMARY-TEXT-BEGIN' + '(.*?)' + 'BLOG-SUMMARY-TEXT-END')[1];
};

export { extractSummary };