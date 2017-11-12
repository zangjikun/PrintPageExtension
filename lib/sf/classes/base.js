Sf.Classes = Sf.Classes || Sf.Class.create({
        initialize: function (a, b) {
            this.options = $.extend(true, {}, this.constructor.options || {}, a || {});
            this.param = $.extend(true, {}, this.constructor.param || {}, b || {})
        }, log: function () {
            if (this.options.debug) {
                Array.prototype.unshift.call(arguments, this.toString());
                window.console && console.log.apply(console, arguments)
            }
            return this
        }, toString: function () {
            return "<instance:" + (this.constructor._name || "unknown") + ">"
        }
    });
Sf.Classes.Base = Sf.Classes;