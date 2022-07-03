function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
export default function asyncIterator(source) {
    var iterator = source[Symbol.asyncIterator]();
    return _defineProperty({
        next: function next() {
            return iterator.next();
        }
    }, Symbol.asyncIterator, function() {
        return this;
    });
};
