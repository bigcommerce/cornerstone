const Handlebars = require("handlebars");


export default class BazaarVoice{
    constructor(id){
        this.rnrId = id;
        this.apiVersion = '5.4';
        this.passkey = 'cayvJ62u3ELqBkmuvrVNySlCyYOlhUmHOPSiz375HmRdQ';
        this.limit = 10;
        this.env = 'https://stg.api.bazaarvoice.com/';
        this.path = `${this.env}data/reviews.json?apiversion=${this.apiVersion}&passkey=${this.passkey}&ProductId=${this.rnrId}&limit=${this.limit}`;
    }

    getReviews(){

        var reviewListTemplate = `
            {{#each reviews}}
                <div>
                    <h4>{{Title}}</h4>
                    <p>{{UserNickname}}: {{ReviewText}}</p>
                </div>
            {{/each}}
        `;

        $.ajax({
            url: this.path,
            success: function(myReviews){
                console.log(myReviews);
                var renderReviews = Handlebars.compile(reviewListTemplate);
                document.getElementById('bv-reviews__list').innerHTML = renderReviews({
                    reviews: myReviews.Results,
                });
            }
        });
    }

    getReviewSummary(){
        //
    }

    openRnRModal(){
        //
    }

    validateForm(){
        //
    }

    submitForm(){
        //
    }

    sortBy(type){
        //switchcase for type
    }

}