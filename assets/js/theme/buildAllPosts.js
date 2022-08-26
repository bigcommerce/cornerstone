import { extractTag } from './extractTag';

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

const filterPosts = (posts, unfilteredPosts) => {
    const postFilters = [];

    const filterOptions = document.getElementById('blogFilters').getElementsByTagName('input');
    
    Array.from(filterOptions).forEach((filterItem) => {
        if (filterItem.checked) {
            postFilters.push(filterItem.value);
        }
    });

    if (postFilters.length === 0) {
        buildAllPosts(posts);
        return;
    }

    const filterBy = (post) => {
        const postType = post.tags.find(tag => postFilters.includes(tag.name));
        return postType;
    }
    const filteredBlogPosts = posts.filter(filterBy);

    const filteredPosts = filteredBlogPosts.slice(0, numberOfPostsToShow).map((post) => {
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

    loadMoreButton(filteredBlogPosts.length);

    const loadMoreButtonBtn = document.getElementById('loadMoreButton');
    loadMoreButtonBtn && loadMoreButtonBtn.addEventListener('click', () => {
        numberOfPostsToShow = numberOfPostsToShow += 12;
        filterPosts(posts, unfilteredPosts);
    });
}

const buildAllPosts = (posts) => {
    const unfilteredPosts = posts.slice(0, numberOfPostsToShow).map((post) => {
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
                    <li><input type="checkbox" id="blogFilterHvac" value="hvac" /> <label for="blogFilterHvac">HVAC</label></li>
                </ul>
            </nav>
            <div class="posts-wrapper">
                <div id="filteredPosts">
                    ${unfilteredPosts}
                </div>
                <div id="loadMorePosts"></div>
            </div>
        </section>
    `;
    container.innerHTML = html;

    loadMoreButton(posts.length);

    const filterCheckboxes = document.querySelectorAll('input');
    filterCheckboxes.forEach((input) => {
        input.addEventListener('click', () => {
            numberOfPostsToShow = 12;
            filterPosts(posts, unfilteredPosts);
        });
    });

    const loadMoreButtonBtn = document.getElementById('loadMoreButton');
    loadMoreButtonBtn && loadMoreButtonBtn.addEventListener('click', () => {
        numberOfPostsToShow = numberOfPostsToShow += 12;
        buildAllPosts(posts);
    });
}

export { buildAllPosts };