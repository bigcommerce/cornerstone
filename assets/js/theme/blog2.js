import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';

export default class Blog extends PageManager {
    
    onReady() {
        this.getFeaturedPosts();
    }

    getFeaturedPosts() {
        
        const options = {
            template: 'blog/blog-json',
            config: {
                blog: {
                    posts: {
                        limit: 100,
                        summary: 250,
                    },
                },
            },
        };

        api.getPage('/blog/', options, (error, response) => {
            
            if (error) return console.error(error);
            
            const blogJson = JSON.parse(response);
            
            // Check for any posts tagged with "featured"
            const featuredPosts = blogJson.posts.filter(post => post.tags.some(tag => tag.name === 'featured'));
            
            featuredPosts.forEach(featuredPost => {
                const imageSize = '640x300';
                const html = `
                    <article class=”blog”>
                        <div class=”blog-post-figure”>
                            <figure class=”blog-thumbnail”>
                                <a href=”${featuredPost.url}”>
                                    <img src=”${featuredPost.thumbnail.data.replace('{:size}', imageSize)}” alt=”${featuredPost.thumbnail.alt}” />
                                </a>
                            </figure>
                        </div>
                        <div class=”blog-post-body”>
                            <header class=”blog-header”>
                                <h2 class=”blog-title”>
                                    <a href=”${featuredPost.url}”>${featuredPost.title}</a>
                                </h2>
                                <p class=”blog-date”>Posted by ${featuredPost.author} on ${featuredPost.date_published}</p>
                            </header>
                            <div class=”blog-post”>
                                ${featuredPost.summary}
                                &hellip; <a href=”${featuredPost.url}”>Read More</a>
                            </div>
                        </div>
                    </article>
                `;
                $('[data-featured-posts]').append(html);
            });
        });

    }

}