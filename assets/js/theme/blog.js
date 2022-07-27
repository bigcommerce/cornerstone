import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';

export default class Blog extends PageManager {
    getBlogPosts() {
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

        api.getPage('/blog/', options, (error, response) => {
            if (error) return console.error(error);
            const postsJson = JSON.parse(response);
            console.log(postsJson);
        });
    }

    onReady() {
        this.getBlogPosts();
    }
}