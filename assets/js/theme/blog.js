import PageManager from './page-manager';
import { api } from '@bigcommerce/stencil-utils';

const extractText = (strToParse, strStart, strFinish) => {
    return strToParse.match(strStart + "(.*?)" + strFinish)[1];
};

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

export default class Blog extends PageManager {
    getBlogPosts() {
        api.getPage('/blog/', options, (error, response) => {
            if (error) return console.error(error);
            const postsJson = JSON.parse(response);
            console.log(postsJson);
        });
    }

    extractSummaryText() {
        api.getPage('/blog/', options, (error, response) => {
            if (error) return console.error(error);
            const postsJson = JSON.parse(response);
            
            const summaryTextContainers = document.querySelectorAll('.summary-text');
            summaryTextContainers.forEach((summary) => {
                const summaryText = summary.innerText;
                summary.textContent = extractText(summaryText, 'BLOG-SUMMARY-TEXT-BEGIN', 'BLOG-SUMMARY-TEXT-END');
            });
        });
    }

    onReady() {
        this.getBlogPosts();
        this.extractSummaryText();
    }
}