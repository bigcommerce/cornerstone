const postTypes = ['general', 'industry trend', 'installation', 'news', 'press release', 'service'];

const extractTag = (tags) => {
    const postType = tags.find(tag => postTypes.includes(tag.name.toLowerCase()));
    return postType ? postType.name : '';
}

export { extractTag };