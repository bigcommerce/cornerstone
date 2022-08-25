import { extractTag } from './extractTag';

const filterPosts = (posts, unfilteredPosts) => {
    const postFilters = [];

    const filterOptions = document.getElementById('blogFilters').getElementsByTagName('input');
    
    Array.from(filterOptions).forEach((filterItem) => {
        if (filterItem.checked) {
            postFilters.push(filterItem.value);
        }
    });

    const filterBy = (post) => {
        const postType = post.tags.find(tag => postFilters.includes(tag.name));
        return postType;
    }
    const filteredBlogPosts = posts.filter(filterBy);

    const filteredPosts = filteredBlogPosts.map((post) => {
        return `
            <a href="${post.url}" class="all-post">
                <div>
                    <h3>${extractTag(post.tags)}</h3>
                    <h2>${post.title}</h2>
                </div>
            </a>
        `;
    }).join('');

    const container = document.getElementById('filteredPosts');
    container.innerHTML = postFilters.length > 0 ? filteredPosts : unfilteredPosts;
}

const buildAllPosts = (posts) => {
    const unfilteredPosts = posts.map((post) => {
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
                <ul id="blogFilters">
                    <li><input type="checkbox" id="blogFilterGeneral" value="general" /> <label for="blogFilterGeneral">General</label></li>
                    <li><input type="checkbox" id="blogFilterIndustryTrend" value="industry trend" /> <label for="blogFilterIndustryTrend">Industry Trend</label></li>
                    <li><input type="checkbox" id="blogFilterInstallation" value="installation" /> <label for="blogFilterInstallation">Installation</label></li>
                    <li><input type="checkbox" id="blogFilterNews" value="news" /> <label for="blogFilterNews">News</label></li>
                    <li><input type="checkbox" id="blogFilterPressRelease" value="press release" /> <label for="blogFilterPressRelease">Press Release</label></li>
                    <li><input type="checkbox" id="blogFilterService" value="service" /> <label for="blogFilterService">Service</label></li>
                </ul>
            </nav>
            <div id="filteredPosts">${allPosts}</div>
        </section>
    `;
    container.innerHTML = html;

    const filterCheckboxes = document.querySelectorAll('input');
    filterCheckboxes.forEach((input) => {
        input.addEventListener('click', () => filterPosts(posts, unfilteredPosts));
    });
}

export { buildAllPosts };