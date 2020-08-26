import { ariaKeyCodes } from './constants';

const setCheckedRadioItem = (itemCollection, itemIdx) => {
    itemCollection.each((idx, item) => {
        const $item = $(item);
        if (idx !== itemIdx) {
            $item.attr('aria-checked', false).prop('checked', false);
            return;
        }

        $item.attr('aria-checked', true).prop('checked', true).focus();
    });
};

const calculateTargetItemPosition = (lastItemIdx, currentIdx) => {
    switch (true) {
    case currentIdx > lastItemIdx: return 0;
    case currentIdx < 0: return lastItemIdx;
    default: return currentIdx;
    }
};

const handleItemKeyDown = itemCollection => e => {
    const { keyCode } = e;
    const itemIdx = itemCollection.index(e.currentTarget);
    const lastCollectionItemIdx = itemCollection.length - 1;

    if (Object.values(ariaKeyCodes).includes(keyCode)) {
        e.preventDefault();
        e.stopPropagation();
    }

    switch (keyCode) {
    case ariaKeyCodes.RETURN:
    case ariaKeyCodes.SPACE: {
        setCheckedRadioItem(itemCollection, itemIdx);
        break;
    }
    case ariaKeyCodes.LEFT:
    case ariaKeyCodes.UP: {
        const prevItemIdx = calculateTargetItemPosition(lastCollectionItemIdx, itemIdx - 1);
        itemCollection.get(prevItemIdx).focus();
        break;
    }
    case ariaKeyCodes.RIGHT:
    case ariaKeyCodes.DOWN: {
        const nextItemIdx = calculateTargetItemPosition(lastCollectionItemIdx, itemIdx + 1);
        itemCollection.get(nextItemIdx).focus();
        break;
    }

    default: break;
    }
};

export default ($container, itemSelector) => {
    const $itemCollection = $container.find(itemSelector);

    $container.on('keydown', itemSelector, handleItemKeyDown($itemCollection));
};
