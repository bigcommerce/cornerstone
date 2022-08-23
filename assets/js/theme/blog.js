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

const postTypes = ['general', 'industry trend', 'installation', 'news', 'press release', 'service'];

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
                <section class="blog-feed--featured-3">
                    <a href="${featuredPost.url}" class="blog-feed__wrapper-link">
                        <div class="blog-feed__post">            
                            <div class="blog-feed__post-image">
                                ${postImg.outerHTML}
                            </div>
                            <div class="blog-feed__post-text">
                                <h3 class="blog-feed__tag">${extractTag(featuredPost.tags)}</h3>
                                <h2 class="blog-feed__title">${featuredPost.title}</h2>
                                <p class="blog-feed__summary">${extractSummary(featuredPost.summary)}</p>
                            </div>
                        </div>
                    </a>
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

        const tagsToExclude = ['story', 'spotlight-left', 'spotlight-center', 'spotlight-right', 'featured', 'hide'];
        const removeNewsAndSpotlights = (post) => {
            const postType = !post.tags.find(tag => tagsToExclude.includes(tag.name.toLowerCase()));
            return postType;
        }
        const latestBlogPosts = postsJson.posts.filter(removeNewsAndSpotlights);
        const latestPosts = latestBlogPosts.slice(0,4).map((post) => {
            const postImg = imgPaths.find(item => item.alt === post.title);
            return `
                <div class="blog-feed__post">
                    <a href="${post.url}" class="blog-feed__wrapper-link">
                        <div class="blog-feed__post-image">
                            ${postImg && postImg.outerHTML}
                        </div>
                        <div class="blog-feed__post-text">
                            <h3 class="blog-feed__tag">${extractTag(post.tags)}</h3>
                            <h2 class="blog-feed__title"  style="-webkit-box-orient: vertical">${post.title}</h2>
                            <p class="blog-feed__summary" style="-webkit-box-orient: vertical">${extractSummary(post.summary)}</p>
                        </div>
                    </a>
                </div>
            `;
        }).join('');

        const latestStoryPosts = postsJson.posts.filter(post => post.tags.some(tag => tag.name === 'story'));
        const latestStories = latestStoryPosts.slice(0,5).map((post) => {
            const postImg = imgPaths.find(item => item.alt === post.title);
            return `
                <a href="${post.url}" class="blog-feed__wrapper-link">
                    <div class="blog-feed__post">
                        <div class="blog-feed__post-text">
                            <h3 class="blog-feed__tag">${extractTag(post.tags)}</h3>
                            <h2 class="blog-feed__title">${post.title}</h2>
                        </div>
                        <div class="blog-feed__post-image">
                            ${postImg && postImg.outerHTML}
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        const container = document.getElementById('featured-4');
        const html = `
            <section class="blog-feed--featured-4">
                <div class="blog-feed__primary-container">
                    ${latestPosts}
                </div>
                <div class="blog-feed__secondary-container">
                    <h2>FEATURED STORIES</h2>
                    ${latestStories}
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

        const spotlightPositions = ['spotlight-left', 'spotlight-center', 'spotlight-right'];
        const spotlightPostsExist = spotlightPositions.every(position => postsJson.posts.find(post => post.tags.some(tag => tag.name.includes(position))));

        const spotLightBuilder = (position) => {
            const spotlightPost = postsJson.posts.find(post => post.tags.some(tag => tag.name.includes(position)));
            const spotlightImg = imgPaths.find(item => item.alt === spotlightPost.title);
            const spotlight = `
                <a href="${spotlightPost.url}" class="blog-feed__wrapper-link">
                    <div class="blog-feed__post">
                        <div class="blog-feed__post-image">
                            ${spotlightImg && spotlightImg.outerHTML}
                        </div>
                        <div class="blog-feed__post-text">
                            <h3 class="blog-feed__tag">${extractTag(spotlightPost.tags)}</h3>
                            <h2 class="blog-feed__title"  style="-webkit-box-orient: vertical">${spotlightPost.title}</h2>
                            <p class="blog-feed__summary" style="-webkit-box-orient: vertical">${extractSummary(spotlightPost.summary)}</p>
                        </div>
                    </div>
                </a>
            `;
            return spotlight;
        }

        if (spotlightPostsExist) {
            const container = document.getElementById('spotlight');
            const html = `
                <section class="blog-feed--spotlight">
                    <h2>LEARN MORE ABOUT OUR INNOVATIONS</h2>
                    <div class="blog-feed--spotlight-container">
                        <div class="spotlight-left">${spotLightBuilder('spotlight-left')}</div>
                        <div class="spotlight-center">${spotLightBuilder('spotlight-center')}</div>
                        <div class="spotlight-right">${spotLightBuilder('spotlight-right')}</div>
                    </div>
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