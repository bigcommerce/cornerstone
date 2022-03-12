import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';

export default function (context) {
	const galleryPerPage = context.themeSettings.webpage_gallerys_per_page;

	window.theme = window.theme || {};

	theme.Pagination = function () {
		let _;
		function Pagination() {
			_ = this;
			_.total = $('.image-gallery-item').length;
			_.init();
			$(document).on('click', '.pagination-link', function (e) {
				if ($(this).data('page')) {
					_.current_page = parseInt($(this).data('page'));
					_.show_pagination(_.current_page);

					const end = _.current_page * _.per_page;
						const start = end - _.per_page;
						_.show_item(start, end);
				}
			});
		}

		Pagination.prototype = $.extend({}, Pagination.prototype, {
			per_page: galleryPerPage,
			total: 0,
			total_page: 0,
			current_page: 0,
			init() {
				_.total_page = parseInt(_.total / _.per_page) + (_.total % _.per_page > 0 ? 1 : 0);
				if (_.total_page > 0) {
					_.current_page = 1;
					_.show_pagination(_.current_page);
				}

				if (_.current_page == 1) {
					_.show_item(0, galleryPerPage);
				}
			},
			show_item(start, end) {
				$('.image-gallery-item').addClass('hide');
				$('.image-gallery-item').each((i, el) => {
					if (i >= start && i < end) $(el).removeClass('hide');
				});
			},
			show_pagination(current_page) {
				$('.themevale-pagination .pagination-list').html('');
				for (let i = 0; i < _.total_page; i++) {
					if (i + 1 == current_page) {
						$('.themevale-pagination .pagination-list').append(`<li class="pagination-item pagination-item--current"><a class="pagination-link"><span>${current_page}</span></a></li>`);
					} else {
						$('.themevale-pagination .pagination-list').append(`<li class="pagination-item"><a class="pagination-link" data-page="${i + 1}"><span>${i + 1}</span></a></li>`);
					}
				}
				if (_.total_page >= 2) {
					if (current_page < _.total_page) {
						$('.themevale-pagination .pagination-list').append(`<li class="pagination-item pagination-item--next"><a class="pagination-link" data-page="${current_page + 1}"><span>Next</span> <i class="icon" aria-hidden="true"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-chevron-right"></use></svg></i></a></li>`);
					}
					if (current_page <= _.total_page) {
						if (current_page > 1) {
							$('.themevale-pagination .pagination-list').prepend(`<li class="pagination-item pagination-item--previous"><a class="pagination-link" data-page="${current_page - 1}"><i class="icon" aria-hidden="true"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-chevron-left"></use></svg></i> <span>Prev</span></a></li>`);
						}
					}
				}
			}
		});
		theme.Pagination = new Pagination();
	};
	$(() => {
	  	theme.Pagination();
	});
}
