Sf.Class = {
    create: function () {
        function g(i) {
            return typeof i === "function"
        }

        var e = arguments.callee;
        var d = g(arguments[0]) && arguments[0] || undefined;
        var h = arguments[arguments.length - 1];
        var a = function c() {
            if (typeof this.initialize === "function") {
                this.constructor = a;
                this.initialize.apply(this, arguments);
                return this
            }
        };
        a.subClass = function () {
            var k = Array.prototype.slice.call(arguments, 0);
            var j = k.shift();
            k.unshift(a);
            var i = e.apply(null, k);
            i._name = j;
            return a[j] = i
        };
        a.extend = function (j) {
            for (var i in j) {
                a[i] = j[i]
            }
            return a
        };
        a.toString = function () {
            return "[Class:" + (a._name || "unknown") + "]"
        };
        if (d) {
            var b = function () {
            };
            b.prototype = d.prototype;
            a.prototype = new b;
            a._parent = d
        }
        a.prototype._super = function (i, k, j) {
            return k._super.apply(i, j)
        };
        for (var f in h) {
            if (d && (f in d.prototype)) {
                h[f]._super = d.prototype[f]
            }
            a.prototype[f] = h[f]
        }
        return a
    }
};