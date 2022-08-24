import { extractTag } from './extractTag';
import { extractSummary } from './extractSummary';

const filterPosts = (posts) => {
    
    /*
        1. make an empty array to store the tags ✅
        2. on each checkbox click,
            2a. make array of checkboxes and ✅
            2b. loop through each checkbox and ✅
            2c. detect which ones are checked ✅
        3. add the value of those to the array ✅
        4. rebuild the post array (`allPosts`) to include those tags ✅
        5. re-inject the html to `container` ✅
        6. make it so that when all checkboxes are unchecked, it goes back to showing all
        7. bonus points to make them fade in / fade out - or gray out with some kind of loader....!
    */

    
    
    console.log('posts from within!', posts);
    
    const postFilters = [];

    const filterOptions = document.getElementById('blogFilters').getElementsByTagName('input');

    console.log('filterOptions', filterOptions);

    Array.from(filterOptions).forEach((filterItem) => {
        if (filterItem.checked) {
            postFilters.push(filterItem.value);
        }
    });

    console.log('postFilters: ', postFilters);

    const filterBy = (post) => {
        const postType = post.tags.find(tag => postFilters.includes(tag.name));
        return postType;
    }
    const filteredBlogPosts = posts.filter(filterBy);

    console.log('filteredBlogPosts', filteredBlogPosts);

    const newFilteredPosts = filteredBlogPosts.map((post) => {
        // const postImg = imgPaths.find(item => item.alt === post.title);
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
    container.innerHTML = newFilteredPosts;
}

const buildAllPosts = (posts, imgPaths) => {
    console.log('posts: ', posts);
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
                <ul id="blogFilters">
                    <li><input type="checkbox" id="blogFilterGeneral" value="general" /> <label for="blogFilterGeneral">General</label></li>
                    <li><input type="checkbox" id="blogFilterIndustryTrend" value="industry trend" /> <label for="blogFilterIndustryTrend">Industry Trend</label></li>
                    <li><input type="checkbox" id="blogFilterInstallation" value="installation" /> <label for="blogFilterInstallation">Installation</label></li>
                </ul>
            </nav>
            <div id="filteredPosts">${allPosts}</div>
        </section>
    `;
    container.innerHTML = html;

    const filterCheckboxes = document.querySelectorAll('input');

    filterCheckboxes.forEach((input) => {
        input.addEventListener('click', () => filterPosts(posts));
    });
}

export { buildAllPosts };