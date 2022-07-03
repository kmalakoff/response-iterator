var hasIterator = typeof Symbol !== "undefined" && Symbol.asyncIterator;
/* c8 ignore start */ export default function readerIterator(reader) {
    var iterator = {
        next: function next() {
            return reader.read();
        }
    };
    if (hasIterator) {
        iterator[Symbol.asyncIterator] = function() {
            return this;
        };
    }
    return iterator;
}; /* c8 ignore stop */ 
