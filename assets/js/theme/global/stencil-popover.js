export default class Popover {
    constructor(element, trigger, options) {
    this.options = {
        position: Popover.BOTTOM
    };
    this.element = element;
    this.trigger = trigger;
    this._isOpen = false;
    Object.assign(this.options, options);
    this.events();
    this.initialPosition();
    }

    events() {
        this.trigger.addEventListener('click', this.toggle.bind(this));
    }

initialPosition() {
    let triggerRect = this.trigger.getBoundingClientRect();

    this.element.style.display = 'none';
    this.element.style.top = triggerRect.top + 'px';
    this.element.style.left = triggerRect.left + 'px';
}

toggle(e) {
    e.stopPropagation();
    if (this._isOpen) {
    this.close(e);
    } else {
    this.element.style.display = 'block';
    this._isOpen = true;
    this.outsideClick();
    this.position();
    }
}

targetIsInsideElement(e) {
    let target = e.target;

    if (target) {
        do {
            if (target === this.element) {
                return true;
            }
        } while (target = target.parentNode);
    }
    return false;
}

close(e) {
    if (!this.targetIsInsideElement(e)) {
        this.element.style.display = 'none';
        this._isOpen = false;
        this.killOutSideClick();
    }
}

position(overridePosition) {
    let triggerRect = this.trigger.getBoundingClientRect(),
    elementRect = this.element.getBoundingClientRect(),
    position = overridePosition || this.options.position;
    this.element.classList.remove(Popover.TOP, Popover.BOTTOM, Popover.LEFT, Popover.RIGHT); // remove all possible values
    this.element.classList.add(position);

    if (position.indexOf(Popover.BOTTOM) !== -1) {
        this.element.style.left = ~~triggerRect.left + ~~((triggerRect.width / 2) - ~~(elementRect.width / 2)) + 'px';
        this.element.style.top = ~~triggerRect.bottom + 10 + 'px';
    } else if (position.indexOf(Popover.TOP) !== -1) {
        this.element.style.left = ~~triggerRect.left + ~~((triggerRect.width / 2) - ~~(elementRect.width / 2)) + 'px';
        this.element.style.top = ~~(triggerRect.top - elementRect.height) + 'px';
    } else if (position.indexOf(Popover.LEFT) !== -1) {
        this.element.style.top = ~~((triggerRect.top + triggerRect.height / 2) - ~~(elementRect.height / 2)) + 'px';
        this.element.style.left = ~~(triggerRect.left - elementRect.width) + 'px';
    } else {
        this.element.style.top = ~~((triggerRect.top + triggerRect.height / 2) - ~~(elementRect.height / 2)) + 'px';
        this.element.style.left = ~~triggerRect.right + 'px';
    }
}

outsideClick() {
    document.addEventListener('click', this.close.bind(this));
}

killOutSideClick() {
    document.removeEventListener('click', this.close.bind(this));
}

isOpen() {
    return this._isOpen;
}
}

Popover.TOP = 'top';
Popover.RIGHT = 'right';
Popover.BOTTOM = 'bottom';
Popover.LEFT = 'left';
