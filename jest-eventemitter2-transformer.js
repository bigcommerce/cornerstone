module.exports = {
  process(src, filename) {
    return src.replace('exports.EventEmitter2 = EventEmitter;', 'module.exports = EventEmitter;');
  },
};
