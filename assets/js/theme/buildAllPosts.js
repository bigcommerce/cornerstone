import { extractTag } from './extractTag';
import { extractSummary } from './extractSummary';

let numberOfPostsToShow = 12;

const loadMoreButton = (filteredPosts) => {
    let html = '';
    if (numberOfPostsToShow >= filteredPosts && filteredPosts !== 0) {
        html = ``;
    } else if (filteredPosts > 12 || filteredPosts === 0) {
        html = `
            <div class="button-wrapper">
                <button id="loadMoreButton">LOAD MORE</button>
            </div>
        `;
    } else {
        html = ``;
    }

    const container = document.getElementById('loadMorePosts');
    container.innerHTML = html;
}

const filterPosts = (posts, imgPaths, unfilteredPosts) => {
    const postFilters = [];

    const filterOptions = document.getElementById('blogFilters').getElementsByTagName('input');
    
    Array.from(filterOptions).forEach((filterItem) => {
        if (filterItem.checked) {
            postFilters.push(filterItem.value);
        }
    });

    if (postFilters.length === 0) {
        buildAllPosts(posts, imgPaths);
        return;
    }

    const filterBy = (post) => {
        const postType = post.tags.find(tag => postFilters.includes(tag.name));
        return postType;
    }
    const filteredBlogPosts = posts.filter(filterBy);

    const filteredPosts = filteredBlogPosts.slice(0, numberOfPostsToShow).map((post) => {
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

    const container = document.getElementById('filteredPosts');
    container.innerHTML = postFilters.length > 0 ? filteredPosts : unfilteredPosts;

    loadMoreButton(filteredBlogPosts.length);

    const loadMoreButtonBtn = document.getElementById('loadMoreButton');
    loadMoreButtonBtn && loadMoreButtonBtn.addEventListener('click', () => {
        numberOfPostsToShow = numberOfPostsToShow += 12;
        filterPosts(posts, imgPaths, unfilteredPosts);
    });
}

const buildAllPosts = (posts, imgPaths) => {
    const unfilteredPosts = posts.slice(0, numberOfPostsToShow).map((post) => {
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

    const container = document.getElementById('all-posts');
    const html = `
        <section class="blog-feed--all-posts">
            <h2>ALL ARTICLES</h2>
            <div class="blog-feed__all-posts-wrapper">
                <nav class="blog-feed__filters">
                    <h3>FILTER ARTICLES</h3>
                    <div id="blogFilters">
                        <div>
                            <details open>
                                <summary>TOPIC</summary>
                                <ul>
                                    <li><input type="checkbox" id="blogFilterGeneral" value="general" /> <label for="blogFilterGeneral">General</label></li>
                                    <li><input type="checkbox" id="blogFilterIndustryTrend" value="industry trend" /> <label for="blogFilterIndustryTrend">Industry Trend</label></li>
                                    <li><input type="checkbox" id="blogFilterInstallation" value="installation" /> <label for="blogFilterInstallation">Installation</label></li>
                                    <li><input type="checkbox" id="blogFilterNews" value="news" /> <label for="blogFilterNews">News</label></li>
                                    <li><input type="checkbox" id="blogFilterPressRelease" value="press release" /> <label for="blogFilterPressRelease">Press Release</label></li>
                                    <li><input type="checkbox" id="blogFilterService" value="service" /> <label for="blogFilterService">Service</label></li>
                                </ul>
                            </details>
                        </div>
                        <div>
                            <details open>
                                <summary>PRODUCT CATEGORY</summary>
                                <ul>
                                    <li><input type="checkbox" id="blogFilterHvac" value="hvac" /> <label for="blogFilterHvac">HVAC</label></li>
                                    <li><input type="checkbox" id="blogFilterWholeHomeSolutions" value="whole home solutions" /> <label for="blogFilterWholeHomeSolutions">Whole home solutions</label></li>
                                    <li><input type="checkbox" id="blogFilterPlumbing" value="plumbing" /> <label for="blogFilterPlumbing">Plumbing</label></li>
                                </ul>
                            </details>
                        </div>
                    </div>
                </nav>
                <div class="blog-feed__all-posts">
                    <div id="filteredPosts">
                        ${unfilteredPosts}
                    </div>
                    <div id="loadMorePosts"></div>
                </div>
            </div>
        </section>
    `;
    container.innerHTML = html;

    loadMoreButton(posts.length);

    const filterCheckboxes = document.querySelectorAll('input');
    filterCheckboxes.forEach((input) => {
        input.addEventListener('click', () => {
            numberOfPostsToShow = 12;
            filterPosts(posts, imgPaths, unfilteredPosts);
        });
    });

    const loadMoreButtonBtn = document.getElementById('loadMoreButton');
    loadMoreButtonBtn && loadMoreButtonBtn.addEventListener('click', () => {
        numberOfPostsToShow = numberOfPostsToShow += 12;
        buildAllPosts(posts, imgPaths);
    });
}

export { buildAllPosts };