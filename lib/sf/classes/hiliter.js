(function () {
    var d = undefined;
    var b = {
        size: 3,
        autostart: false,
        style: {position: "absolute", zIndex: $.sf.options.style.zIndex, backgroundColor: "red",}
    };
    var c = {window: d, hilited: d, hiliter: {top: d, bottom: d, left: d, right: d,}};

    function g(i) {
        var h = $(i.target);
        if (h.is("html,[hilitable=false]") || ((typeof this.options.filter == "string") && h.is(this.options.filter)) || ($.isFunction(this.options.filter) && !this.options.filter(h.get(0)))) {
            this.hide();
            return true
        }
        this.update.call(this, h);
        this.show();
        return true
    }

    function a(i) {
        var h = i.relatedTarget;
        if (!h || !$.contains(this.param.container.get(0), h)) {
            this.hide()
        }
        return true
    }

    function e(h) {
        this.hide();
        return true
    }

    function f(h) {
        if ($.isFunction(this.options.callback.click)) {
            this.options.callback.click(this.param.hilited)
        }
    }

    Sf.Classes.Hiliter = $.Class.create({
        initialize: function (k, j) {
            var h = this;
            this.options = $.extend(true, {}, b, j || {});
            var l = $(k.document);
            this.param = $.extend(true, {}, c, {
                window: k,
                container: l.createElement("div").appendTo(l.getContainer()).hide(),
            });
            var i = l.createElement("div").css(this.options.style).click($.proxy(f, this));
            $(["top", "bottom", "left", "right"]).each(function (m, n) {
                h.param.hiliter[n] = i.clone(true).appendTo(h.param.container).css({
                    width: h.options.size,
                    height: h.options.size,
                    top: "-100px"
                })
            });
            if (this.options.autostart) {
                this.start()
            }
            $(window).unload($.proxy(function () {
                this.destroy()
            }, this));
            return this
        }, start: function () {
            if (!this.param.started) {
                $(this.param.window.document).mouseleave($.proxy(e, this));
                $(this.param.window.document.body).mouseover($.proxy(g, this)).mouseleave($.proxy(a, this));
                $(this.param.container).show();
                this.param.started = true
            }
            return this
        }, stop: function () {
            if (this.param.started) {
                $(this.param.window.document.body).unbind("mouseover", g).unbind("mouseleave", a);
                $(this.param.window.document).unbind("mouseleave", e);
                this.hide();
                this.param.started = false
            }
            return this
        }, show: function () {
            $(this.param.container).show();
            return this
        }, hide: function () {
            $(this.param.container).hide();
            return this
        }, destroy: function () {
            this.stop();
            $(this.param.container).remove()
        }, update: function (m) {
            this.param.hilited = m;
            var i = $(m);
            var p = 0;
            var l = this.param.hiliter;
            var k = this.options.size;
            var o = i.offset(), n = i.outerWidth(false), h = i.outerHeight();
            l.top.css({width: n + 2 * p + 2 * k, left: o.left - k - p, top: o.top - p - k});
            l.bottom.css({width: n + 2 * p + 2 * k, top: o.top + h + p, left: o.left - p - k});
            l.left.css({height: h + 2 * p, top: o.top - p, left: o.left - p - k});
            l.right.css({height: h + 2 * p + k, top: o.top - p, left: o.left + n + p});
            return this
        }
    })
})();