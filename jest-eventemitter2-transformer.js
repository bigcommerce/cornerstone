module.exports = {
    process(src) {
        return src.replace('exports.EventEmitter2 = EventEmitter;', 'module.exports = EventEmitter;');
    },
};
