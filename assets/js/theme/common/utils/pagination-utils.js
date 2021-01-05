const changeWishlistPaginationLinks = (wishlistUrl, ...paginationItems) => $.each(paginationItems, (_, $item) => {
    const paginationLink = $item.children('.pagination-link');

    if ($item.length && !paginationLink.attr('href').includes('page=')) {
        const pageNumber = paginationLink.attr('href');
        paginationLink.attr('href', `${wishlistUrl}page=${pageNumber}`);
    }
});

/**
 * helps to withdraw differences in structures around the stencil resource pagination
 */
export const wishlistPaginatorHelper = () => {
    const $paginationList = $('.pagination-list');

    if (!$paginationList.length) return;

    const $nextItem = $('.pagination-item--next', $paginationList);
    const $prevItem = $('.pagination-item--previous', $paginationList);
    const currentHref = $('[data-pagination-current-page-link]').attr('href');
    const partialPaginationUrl = currentHref.split('page=').shift();

    changeWishlistPaginationLinks(partialPaginationUrl, $prevItem, $nextItem);
};
