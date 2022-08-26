import { extractTag } from './extractTag';

const loadMore = () => {

    /*
        1. restrict posts to show only 12
        2. detect if more than 12 posts, if so show LOAD MORE button
        3. when button clicked, show another 12
        4. when button clicked, update the button so *next time* it's clicked it shows 36, then 48, and so on
        5. hide button when all posts are revealed
    */

}

let numberOfPostsToShow = 12;

const loadMoreButton = (filteredPosts) => {
    console.log('filteredPosts', filteredPosts);

    /*
        1. get the number of posts (filtered or unfiltered) in total
        2. slice 'em so they only show 12
        3. if total is more than 12
    */
    
    let html = '';
    if (numberOfPostsToShow >= filteredPosts) {
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

    loadMoreButton(filteredBlogPosts.length);
}

const buildAllPosts = (posts) => {
    posts = [
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": null,
            "title": "filter test 12",
            "url": "/filter-test-12"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 11",
            "url": "/filter-test-11"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 12",
            "url": "/filter-test-12"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 06",
            "url": "/filter-test-06"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 11",
            "url": "/filter-test-11"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 06",
            "url": "/filter-test-06"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhen summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properlyBLOG-SUMMARY-TEXT-END\n\n\n\n  When summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properly.\nWant to keep your customers cool during the summer months? In addition to specific tips and t",
            "tags": [
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Surprising Tip to Keep Your Customers Cool in the Summer",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/surprising-tips-to-keep-your-customers-cool.jpg?t=1660664382"
            },
            "title": "The Surprising Tip to Keep Your Customers Cool in the Summer",
            "url": "/the-surprising-tip-to-keep-your-customers-cool-in-the-summer"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 12",
            "url": "/filter-test-12"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 11",
            "url": "/filter-test-11"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 06",
            "url": "/filter-test-06"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 05",
            "url": "/filter-test-05"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhen summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properlyBLOG-SUMMARY-TEXT-END\n\n\n\n  When summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properly.\nWant to keep your customers cool during the summer months? In addition to specific tips and t",
            "tags": [
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Surprising Tip to Keep Your Customers Cool in the Summer",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/surprising-tips-to-keep-your-customers-cool.jpg?t=1660664382"
            },
            "title": "The Surprising Tip to Keep Your Customers Cool in the Summer",
            "url": "/the-surprising-tip-to-keep-your-customers-cool-in-the-summer"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 12",
            "url": "/filter-test-12"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 11",
            "url": "/filter-test-11"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 06",
            "url": "/filter-test-06"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 05",
            "url": "/filter-test-05"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhen summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properlyBLOG-SUMMARY-TEXT-END\n\n\n\n  When summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properly.\nWant to keep your customers cool during the summer months? In addition to specific tips and t",
            "tags": [
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Surprising Tip to Keep Your Customers Cool in the Summer",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/surprising-tips-to-keep-your-customers-cool.jpg?t=1660664382"
            },
            "title": "The Surprising Tip to Keep Your Customers Cool in the Summer",
            "url": "/the-surprising-tip-to-keep-your-customers-cool-in-the-summer"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in augue efficitur sapien feugiat molestie ut at turpis. Aliquam lobortis, massa at vehicula vulputate, arcu massa egestas urna, non efficitur lacus est non est. Pellentesque eu orci lacus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/temp-blog-thumbnail-01.jpg?t=1659455135"
            },
            "title": "AIR & WATER SPOTLIGHT: BRITTNEY ZELLER, COMMERCIAL DIRECTOR, COMMERCIAL HVAC",
            "url": "/air-water-spotlight-brittney-zeller-commercial-director-commercial-hvac"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 12",
            "url": "/filter-test-12"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 11",
            "url": "/filter-test-11"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 10",
            "url": "/filter-test-10"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 09",
            "url": "/filter-test-09"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 08",
            "url": "/filter-test-08"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 07",
            "url": "/filter-test-07"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "press release",
                    "url": "/blog/tag/press+release"
                }
            ],
            "thumbnail": null,
            "title": "filter test 06",
            "url": "/filter-test-06"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                }
            ],
            "thumbnail": null,
            "title": "filter test 05",
            "url": "/filter-test-05"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": null,
            "title": "filter test 04",
            "url": "/filter-test-04"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": null,
            "title": "filter test 03",
            "url": "/filter-test-03"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                }
            ],
            "thumbnail": null,
            "title": "filter test 02",
            "url": "/filter-test-02"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 23rd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINLorem ipsum dolor sit amet consetetur lorem ipsum dolor lorem ipsum dolor ipsum dolor sit amet consetetur lorem ipsum sit ametBLOG-SUMMARY-TEXT-END\n\n\n\n  Blog post main body will go here.",
            "tags": [
                {
                    "name": "hide",
                    "url": "/blog/tag/hide"
                },
                {
                    "name": "news",
                    "url": "/blog/tag/news"
                }
            ],
            "thumbnail": null,
            "title": "filter test 01",
            "url": "/filter-test-01"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINFor years, GE Appliances Air & Water Solutions has been offering total property solutions and first-class service to our clients. With a robust portfolio and industry-leading expertise, we want to be the most trusted name in the air and water industries — as well as a trusted partner to your businessBLOG-SUMMARY-TEXT-END\n\n\n\n  For years, GE Appliances Air &amp; Water Solutions has been offering total property solutions and first-class service to our clients. With a",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "featured",
                    "url": "/blog/tag/featured"
                }
            ],
            "thumbnail": {
                "alt": "Who is GE Appliances Air & Water Solutions?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/who-is-ge-appliances-air-water.jpg?t=1660332917"
            },
            "title": "Who is GE Appliances Air & Water Solutions?",
            "url": "/who-is-ge-appliances-air-water-solutions"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIn 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decadesBLOG-SUMMARY-TEXT-END\n\n\n\n  In 2021, of the nearly 10 million water heaters sold in the United States, 52% of them were gas and 48% were electric, continuing a small yet consistent trend in favor of gas water heaters throughout the past two decades.",
            "tags": [
                {
                    "name": "plumbing",
                    "url": "/blog/tag/plumbing"
                },
                {
                    "name": "installation",
                    "url": "/blog/tag/installation"
                }
            ],
            "thumbnail": {
                "alt": "Should you install a gas or electric water heater?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/should-you-install-a-gas-or-electric-water-heater.jpeg?t=1660317059"
            },
            "title": "Should you install a gas or electric water heater?",
            "url": "/should-you-install-a-gas-or-electric-water-heater"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 22nd 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINBesides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structures — such as multifamily homes, hotels, motels and assisted living facilities — Single Package Vertical Units excelBLOG-SUMMARY-TEXT-END\n\n\n\n  Besides keeping a room cool, air conditioners should also promote high interior air quality in a structure. When it comes to different spaces in multiroom structur",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-center",
                    "url": "/blog/tag/spotlight-center"
                }
            ],
            "thumbnail": {
                "alt": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality.jpg?t=1660749924"
            },
            "title": "How GE Zoneline® UltimateV12™ Benefits Indoor Air Quality and More",
            "url": "/how-ge-zoneline-ultimatev12-benefits-indoor-air-quality-and-more"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solutionBLOG-SUMMARY-TEXT-END\n\n\n\n  If a home does not have central air, or if the current air-conditioning system does not provide the desired level of comfort in certain rooms inside the home, the ductless mini-split system is an efficient solution. \nWhile ther",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "spotlight-right",
                    "url": "/blog/tag/spotlight-right"
                }
            ],
            "thumbnail": {
                "alt": "Everything You Need to Know About Ductless Mini-Split Systems",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/everything-you-need-to-know-about-ductless-mini-split.jpg?t=1660940822"
            },
            "title": "Everything You Need to Know About Ductless Mini-Split Systems",
            "url": "/everything-you-need-to-know-about-ductless-mini-split-systems"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINA quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home's water supplyBLOG-SUMMARY-TEXT-END\n\n\n\n  A quality point-of-entry whole-house water filtration system is the first line of defense to pull out particulates, sediment and lead* from a home&rsquo;s water supply. Not only does this system tackle every tap, but it protects anyone or anything that consumes water. \nUnfortunat",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                },
                {
                    "name": "spotlight-left",
                    "url": "/blog/tag/spotlight-left"
                }
            ],
            "thumbnail": {
                "alt": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system.jpg?t=1660676956"
            },
            "title": "5 Traits of a High-Quality ​​Point of Entry Whole-House Water Filtration System",
            "url": "/5-traits-of-a-high-quality-point-of-entry-whole-house-water-filtration-system"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINIf you’re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to considerBLOG-SUMMARY-TEXT-END\n\n\n\n  If you&rsquo;re looking for an efficient cooling option that is neither seen nor heard by your guests or residents, the vertical terminal air conditioning unit, or VTAC, is an option you will want to consider.\nA VTAC is essentially the ver",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                },
                {
                    "name": "story",
                    "url": "/blog/tag/story"
                }
            ],
            "thumbnail": {
                "alt": "What is a VTAC unit?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-is-a-vtac-unit.jpg?t=1660339950"
            },
            "title": "What is a VTAC unit?",
            "url": "/what-is-a-vtac-unit"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINTechnology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry — especially in hospitality managementBLOG-SUMMARY-TEXT-END\n\n\n\n  Technology and consumer demands constantly evolve, so it can be challenging to keep up with the latest news and updates in the HVAC industry &mdash; especially in hospitality management.\nAs we keep our eyes on the future, we want to highlight some of the most in",
            "tags": [
                {
                    "name": "industry trend",
                    "url": "/blog/tag/industry+trend"
                }
            ],
            "thumbnail": {
                "alt": "What are the latest HVAC trends in the hospitality industry?",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/what-are-the-latest-hvac-hospitality-trends.jpg?t=1660579200"
            },
            "title": "What are the latest HVAC trends in the hospitality industry?",
            "url": "/what-are-the-latest-hvac-trends-in-the-hospitality-industry-"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhen summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properlyBLOG-SUMMARY-TEXT-END\n\n\n\n  When summer heats up and customers are ready for their air conditioners to kick into high gear, they may find a hot and sticky surprise if their unit is not working properly.\nWant to keep your customers cool during the summer months? In addition to specific tips and t",
            "tags": [
                {
                    "name": "service",
                    "url": "/blog/tag/service"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Surprising Tip to Keep Your Customers Cool in the Summer",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/surprising-tips-to-keep-your-customers-cool.jpg?t=1660664382"
            },
            "title": "The Surprising Tip to Keep Your Customers Cool in the Summer",
            "url": "/the-surprising-tip-to-keep-your-customers-cool-in-the-summer"
        },
        {
            "author": "sam.reid@geappliances.com BigCommerce",
            "date_published": "Aug 19th 2022",
            "show_read_more": true,
            "summary": "BLOG-SUMMARY-TEXT-BEGINWhether you’re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air & Water Solutions built this glossary for youBLOG-SUMMARY-TEXT-END\n\n\n\n  Whether you&rsquo;re a seasoned air and water category professional who could use a refresher or an industry newcomer, GE Appliances Air &amp; Water Solutions built this glossary for you.\nWe recognize this business can be complex at times, so we want to simplify it",
            "tags": [
                {
                    "name": "general",
                    "url": "/blog/tag/general"
                },
                {
                    "name": "hvac",
                    "url": "/blog/tag/hvac"
                }
            ],
            "thumbnail": {
                "alt": "The Only Air and Water Dictionary You'll Ever Need",
                "data": "https://cdn11.bigcommerce.com/s-yefuun73xw/images/stencil/{:size}/uploaded_images/the-only-air-and-water-dictionary-youll-ever-need.jpg?t=1660662162"
            },
            "title": "The Only Air and Water Dictionary You'll Ever Need",
            "url": "/the-only-air-and-water-dictionary-you-ll-ever-need"
        }
    ]

    console.log('numberOfPostsToShow', numberOfPostsToShow);
    
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
        input.addEventListener('click', () => filterPosts(posts, unfilteredPosts));
    });

    const loadMoreButtonBtn = document.getElementById('loadMoreButton');
    loadMoreButtonBtn && loadMoreButtonBtn.addEventListener('click', () => {
        numberOfPostsToShow = numberOfPostsToShow += 12;
        buildAllPosts();
    });
}

export { buildAllPosts };