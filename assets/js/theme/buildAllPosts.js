import { extractTag } from './extractTag';
import { extractSummary } from './extractSummary';

const buildAllPosts = (posts, imgPaths) => {
    const allPosts = posts.map((post) => {
        const postImg = imgPaths.find(item => item.alt === post.title);
        return `
            <a href="${post.url}" class="all-post">
                <div>
                    <h3>${extractTag(post.tags)}</h3>
                    <h2>${post.title}</h2>
                </div>
            </a>
        `;
    }).join('');

    const container = document.getElementById('all-posts');
    const html = `
        <section class="all-posts-wrapper">
            <nav>
                <ul>
                    <li><input type="checkbox" /> General</li>
                    <li><input type="checkbox" /> Industry Trend</li>
                    <li><input type="checkbox" /> Installation</li>
                </ul>
            </nav>
            <div>${allPosts}</div>
        </section>
    `;
    container.innerHTML = html;
}

export { buildAllPosts };