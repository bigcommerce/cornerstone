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

const extractSummary = (initialSummary) => {
    return initialSummary.match('BLOG-SUMMARY-TEXT-BEGIN' + '(.*?)' + 'BLOG-SUMMARY-TEXT-END')[1];
};

const extractTag = (tags) => {
    var tagName;
    tags.forEach((tag) => {
        console.log('tag.name', tag.name);
        switch(tag.name) {
            case 'industry trend':
                tagName = 'Industry Trend';
                break;
            case 'installation':
                tagName = 'Installation';
                break;
            case 'news':
                tagName = 'News';
                break;
            case 'press release':
                tagName = 'Press Release';
                break;
            case 'service':
                tagName = 'Service';
                break;
            default:
                '';
        }
    });
    return tagName;
};

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