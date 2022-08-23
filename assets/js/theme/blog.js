import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';
import { buildFeatured3 } from './buildFeatured3';
import { buildFeatured4 } from './buildFeatured4';
import { buildSpotlight } from './buildSpotlight';
import { buildAllPosts } from './buildAllPosts';

// ----------------------------------------------------------------------------------------------------

const options = {
    template: 'blog/blog-json',
    config: {
        blog: {
            posts: {
                limit: 500,
                summary: 500
            },
        },
    },
};

const imgPaths = Array.from(document.querySelectorAll('.blog-thumbnail img'));

// ----------------------------------------------------------------------------------------------------

const buildFeed = () => {
    api.getPage('/blog/', options, (error, response) => {
        if (error) return console.error(error);

        const postsJson = JSON.parse(response);
        
        buildFeatured3(postsJson.posts, imgPaths);
        buildFeatured4(postsJson.posts, imgPaths);
        buildSpotlight(postsJson.posts, imgPaths);
        buildAllPosts(postsJson.posts, imgPaths);
    });
}

// ----------------------------------------------------------------------------------------------------

export default class Blog extends PageManager {
    onReady() {
        buildFeed();
    }
}