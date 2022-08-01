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

const imgPaths = Array.from(document.querySelectorAll('.blog-thumbnail img'));

// ----------------------------------------------------------------------------------------------------

const extractSummary = (initialSummary) => {
    return initialSummary.match('BLOG-SUMMARY-TEXT-BEGIN' + '(.*?)' + 'BLOG-SUMMARY-TEXT-END')[1];
};

const extractTag = (tags) => {
    const postType = tags.find(tag => postTypes.includes(tag.name.toLowerCase()));
    return postType ? postType.name : '';
}

// ----------------------------------------------------------------------------------------------------

const buildFeatured3 = () => {
    api.getPage('/blog/', options, (error, response) => {
        if (error) return console.error(error);
        
        const postsJson = JSON.parse(response);
        const featuredPost = postsJson.posts.find(post => post.tags.some(tag => tag.name === 'featured'));

        if (featuredPost) {
            const postImg = imgPaths.find(item => item.alt === featuredPost.title);
            const container = document.getElementById('featured-3');
            const html = `
                <section class="featured featured--featured-3">
                    ${postImg.outerHTML}
                    <h3>${extractTag(featuredPost.tags)}</h3>
                    <h2>${featuredPost.title}</h2>
                    <p>${extractSummary(featuredPost.summary)}</p>
                </section>
            `;
            container.innerHTML = html;
        }
    });
}

const buildFeatured4 = () => {
    api.getPage('/blog/', options, (error, response) => {
        if (error) return console.error(error);
        
        const postsJson = JSON.parse(response);

        const latestNewsPosts = postsJson.posts.filter(post => post.tags.some(tag => tag.name === 'news'));
        const latestNews = latestNewsPosts.slice(0,5).map((post) => {
            const postImg = imgPaths.find(item => item.alt === post.title);
            return `
                <div>
                    <div style="width: 200px;">${postImg && postImg.outerHTML}</div>
                    <h3>${extractTag(post.tags)}</h3>
                    <h2>${post.title}</h2>
                    <p>${extractSummary(post.summary)}</p>
                </div>
            `;
        }).join('');

        const latestBlogPosts = postsJson.posts.filter(post => post.tags.some(tag => tag.name !== 'news'));
        const latestPosts = latestBlogPosts.slice(0,4).map((post) => {
            const postImg = imgPaths.find(item => item.alt === post.title);
            return `
                <div>
                    <div style="width: 200px;">${postImg && postImg.outerHTML}</div>
                    <h3>${extractTag(post.tags)}</h3>
                    <h2>${post.title}</h2>
                    <p>${extractSummary(post.summary)}</p>
                </div>
            `;
        }).join('');

        const container = document.getElementById('featured-4');
        const html = `
            <section class="featured featured--featured-4">
                <div class="latest-posts">${latestPosts}</div>
                <div class="latest-news">
                    <h2>TRENDING ARTICLES</h2>
                    ${latestNews}
                </div>
            </section>
        `;
        container.innerHTML = html;
    });
}

const buildSpotlight = () => {
    api.getPage('/blog/', options, (error, response) => {
        if (error) return console.error(error);
        
        const postsJson = JSON.parse(response);

        const spotlightLeftPost = postsJson.posts.find(post => post.tags.some(tag => tag.name.includes('spotlight-left')));
        const spotlightLeftImg = imgPaths.find(item => item.alt === spotlightLeftPost.title);
        const spotlightLeft = `
            <div>
                ${spotlightLeftImg.outerHTML}
                <h3>${extractTag(spotlightLeftPost.tags)}</h3>
                <h2>${spotlightLeftPost.title}</h2>
                <p>${extractSummary(spotlightLeftPost.summary)}</p>
            </div>
        `;

        const spotlightCenterPost = postsJson.posts.find(post => post.tags.some(tag => tag.name.includes('spotlight-center')));
        const spotlightCenterImg = imgPaths.find(item => item.alt === spotlightCenterPost.title);
        const spotlightCenter = `
            <div>
                ${spotlightCenterImg.outerHTML}
                <h3>${extractTag(spotlightCenterPost.tags)}</h3>
                <h2>${spotlightCenterPost.title}</h2>
                <p>${extractSummary(spotlightCenterPost.summary)}</p>
            </div>
        `;

        const spotlightRightPost = postsJson.posts.find(post => post.tags.some(tag => tag.name.includes('spotlight-right')));
        const spotlightRightImg = imgPaths.find(item => item.alt === spotlightRightPost.title);
        const spotlightRight = `
            <div>
                ${spotlightRightImg.outerHTML}
                <h3>${extractTag(spotlightRightPost.tags)}</h3>
                <h2>${spotlightRightPost.title}</h2>
                <p>${extractSummary(spotlightRightPost.summary)}</p>
            </div>
        `;

        if (spotlightLeftPost && spotlightCenterPost && spotlightRightPost) {
            const container = document.getElementById('spotlight');
            const html = `
                <section class="featured featured--spotlight">
                    <div class="spotlight-left">${spotlightLeft}</div>
                    <div class="spotlight-center">${spotlightCenter}</div>
                    <div class="spotlight-right">${spotlightRight}</div>
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
        buildFeatured4();
        buildSpotlight();
    }
}