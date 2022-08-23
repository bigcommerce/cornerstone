import { extractTag } from './extractTag';
import { extractSummary } from './extractSummary';

const buildSpotlight = (posts, imgPaths) => {
    const spotlightPositions = ['spotlight-left', 'spotlight-center', 'spotlight-right'];
    const spotlightPostsExist = spotlightPositions.every(position => posts.find(post => post.tags.some(tag => tag.name.includes(position))));

    const spotLightBuilder = (position) => {
        const spotlightPost = posts.find(post => post.tags.some(tag => tag.name.includes(position)));
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
}

export { buildSpotlight };