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
    api.getPage('/articles/', options, (error, response) => {
        if (error) return console.error(error);

        const postsJson = JSON.parse(response);

        postsJson.posts.forEach((post) => {
            const postUrl = post.url.replace('store-yefuun73xw.mybigcommerce', 'www.geappliancesairandwater');
            post.url = postUrl;
        });
        
        buildFeatured3(postsJson.posts, imgPaths);
        buildFeatured4(postsJson.posts, imgPaths);
        buildSpotlight(postsJson.posts, imgPaths);
        buildAllPosts(postsJson.posts, imgPaths);
    });
}

const closeModalProperly = () => {
    // the modal plugin isn't closing the overlay when the footer modal link is used
    const modalCloseBtn = document.querySelectorAll('button.ot-close-icon');
    modalCloseBtn[1].addEventListener('click', () => {
        document.querySelector('.onetrust-pc-dark-filter').style.display = 'none';
    });
}

// ----------------------------------------------------------------------------------------------------

export default class Blog extends PageManager {
    onReady() {
        buildFeed();
        closeModalProperly();
    }
}