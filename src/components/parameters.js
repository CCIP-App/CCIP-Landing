export default function parameters() {
    return location.search.split('?').pop().split('&').map(p => {
        var ps = p.split('=');
        var o = {};
        o[ps.shift()] = ps.join('=');
        return o;
    }).reduce((a, b) => {
        var o = a;
        for(var k in b) {
            o[k] = b[k];
        }
        return o;
    });
}
