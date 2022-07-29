import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';

// ----------------------------------------------------------------------------------------------------

const options = {
    template: 'blog/blog-json',
    config: {
        blog: {
            posts: {
                limit: 20,
                summary: 500
            },
        },
    },
};

const postTypes = ['industry trend', 'installation', 'news', 'press release', 'service'];

// ----------------------------------------------------------------------------------------------------

const extractSummary = (initialSummary) => {
    return initialSummary.match('BLOG-SUMMARY-TEXT-BEGIN' + '(.*?)' + 'BLOG-SUMMARY-TEXT-END')[1];
};

const extractTag = (tags) => {
    const postType = tags.filter(tag => postTypes.includes(tag.name.toLowerCase()));
    return postType.length ? postType[0].name : '';
}

// ----------------------------------------------------------------------------------------------------

const buildFeatured3 = () => {
    api.getPage('/blog/', options, (error, response) => {
        if (error) return console.error(error);
        
        const postsJson = JSON.parse(response);
        const featuredPost = postsJson.posts.find(post => post.tags.some(tag => tag.name === 'featured'));

        if (featuredPost) {
            const container = document.getElementById('featured-3');
            const html = `
                <section class="featured featured--featured-3">
                    [ img ]
                    <h3>${extractTag(featuredPost.tags)}</h3>
                    <h2>${featuredPost.title}</h2>
                    <p>${extractSummary(featuredPost.summary)}</p>
                </section>
            `;
            container.innerHTML = html;
        }
    });
}

// ----------------------------------------------------------------------------------------------------

export default class Blog extends PageManager {
    onReady() {
        buildFeatured3();
    }
}