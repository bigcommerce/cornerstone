import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';

const extractText = (strToParse) => {
    return strToParse.match('BLOG-SUMMARY-TEXT-BEGIN' + '(.*?)' + 'BLOG-SUMMARY-TEXT-END')[1];
};

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

export default class Blog extends PageManager {
    buildFeatured3() {
        api.getPage('/blog/', options, (error, response) => {
            if (error) return console.error(error);
            
            const postsJson = JSON.parse(response);
            const featuredPost = postsJson.posts.find(post => post.tags.some(tag => tag.name === 'featured'));
            const container = document.getElementById('featured-3');

            const html = `
                <section class="featured featured--featured-3">
                    [ img ]
                    <h3>tag</h3>
                    <h2>${featuredPost.title}</h2>
                    <p>${extractText(featuredPost.summary)}</p>
                </section>
            `;

            container.innerHTML = html;
        });
    }

    onReady() {
        this.buildFeatured3();
    }
}