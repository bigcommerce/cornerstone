import { extractTag } from './extractTag';
import { extractSummary } from './extractSummary';

const buildFeatured3 = (posts, imgPaths) => {
    const featuredPost = posts.find(post => post.tags.some(tag => tag.name === 'featured'));

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
}

export { buildFeatured3 };