// let escapeHtml = function (string) {
//     return String(string).replace(/[&<>"'`=\/]/g, function (s) {
//         return entityMap[s];
//     });
// };

// String.prototype.replaceAll = function(search, replacement) {
//     let target = this;
//     return target.replace(new RegExp(search, 'g'), replacement);
// };

// let newLineInP = function (string) {
//     return String(string).replaceAll("\n", "<br>");
// }

// module.exports = escapeHtml();
//
// module.exports = String.prototype.replaceAll();
//
// module.exports = newLineInP();

module.exports = {
    escapeHtml : function (string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    },
    newLineInP : function (string) {
        return String(string).replaceAll("\n", "<br>");
    }
};