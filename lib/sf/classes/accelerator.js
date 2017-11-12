(function () {
    var h = undefined;
    var l = false;
    var j = "accelerator";
    var f = {
        autostart: false,
        dataName: "accelerators",
        dataset: j,
        style: {position: "absolute", zIndex: $.sf.options.style.zIndex, backgroundColor: "transparent"},
        callback: {click: h, mouseover: h},
        hideOnClick: true
    };
    var k = {document: h, selected: h, handle: h};

    function i(r) {
        var n = this;
        l && $.console.log(r.type, r.currentTarget, r, arguments);
        var p = r.currentTarget;
        var m = this.param.selected.filter(function () {
            return $.contains(p, this)
        });
        if (!$(p).data(n.options.dataName)) {
            try {
                var o = m.map(function () {
                    var t = $(this);
                    var u = t.createElement("div").data("source", t).dataset(n.options.dataset, "true").css(n.options.style).show().appendTo(n.param.container);
                    if ($.isFunction(n.options.callback.create)) {
                        n.options.callback.create(t, u)
                    } else {
                        u.html('<button name="select">select</button>')
                    }
                    n.param.handle = n.param.handle.add(u.get());
                    u.trigger([$.sf.options.prefix, j + "ready"].join("."));
                    var s = t.realOuterDimension();
                    u.offset({top: s.top - u.height(), left: s.left});
                    return u.get()
                });
                if ($.isFunction(n.options.callback.click)) {
                    o.click(function () {
                        if (n.options.hideOnClick) {
                            $(this).hide()
                        }
                        n.options.callback.click($(this).data("source"), this)
                    })
                }
                if ($.isFunction(n.options.callback.mouseover)) {
                    o.mouseover(function () {
                        n.options.callback.mouseover($(this).data("source"), this)
                    })
                }
            } catch (q) {
                l && $.console.error(q)
            }
            $(p).data(n.options.dataName, o)
        }
        $(p).data(n.options.dataName).each(function () {
        });
        $(p).data(n.options.dataName).show()
    }

    function b(r) {
        l && $.console.log(r.type, r);
        var n = this;
        var q = r.currentTarget;
        var o = r.relatedTarget;
        var p = $(q).data(n.options.dataName);
        var m = $(o).closest($.expr[":"].dataset.selector(this.options.dataset));
        if (m.size() > 0 && $.inArray(m.get(), p.get())) {
        } else {
            p.hide()
        }
    }

    function d(m) {
        l && $.console.log(m.type, m);
        $(m.target).parent().trigger("mouseenter")
    }

    Sf.Classes.Accelerator = $.Class.create({
        initialize: function c(p, o) {
            var m = this;
            var n = $(p);
            l && $.console.log();
            this.options = $.extend(true, {}, f, o || {});
            var q = n.size() > 0 ? n.document() : $(document);
            this.param = $.extend(true, {}, k, {
                selected: n,
                document: q,
                container: q.createElement("div").appendTo(q.getContainer()),
                handle: $([])
            });
            if (this.options.autostart) {
                this.start()
            }
            $(window).unload($.proxy(function () {
                this.destroy()
            }, this));
            return this
        }, start: function a() {
            var m = this;
            if (!this.param.started) {
                this.param.selected.parent().hover($.proxy(i, m), $.proxy(b, m));
                this.param.selected.mousemove($.proxy(d, m));
                this.param.started = true
            }
            return this
        }, stop: function e() {
            l && $.console.log(this.param.started);
            if (this.param.started) {
                this.param.selected.unbind("mousemove", d).parent().unbind("mouseenter", i).unbind("mouseleave", b);
                this.param.started = false
            }
            return this
        }, destroy: function g() {
            this.stop();
            this.param.selected.parent().removeData(this.options.dataName);
            $(this.param.container).remove();
            return this
        }
    })
})();