Sf.Classes.Selection = (function () {
    var p = "selection";
    var C = undefined;
    var y = false;
    var t = false;
    var d = {window: C, selected: C, started: false, hiliter: C, accelerator: C, styleElement: C, wrappedTextNode: C};
    var j = {
        single: false,
        useGrid: false,
        autostart: false,
        extendOnClick: true,
        wrapTextNode: true,
        callback: {},
        accelerator: {
            dataset: [$.sf.options.prefix, "selection", "accelerator"].join($.sf.options.separator),
            style: {position: "absolute", backgroundColor: "orange", zIndex: $.sf.options.style.zIndex}
        },
        wrapper: {
            className: [$.sf.options.prefix, "selection", "wrapper"].join($.sf.options.separator),
            style: {position: "absolute", backgroundColor: "orange", zIndex: $.sf.options.style.zIndex}
        },
        boxify: {
            style: {backgroundColor: "transparent", opacity: 1, zIndex: $.sf.options.style.zIndex + 1},
            callback: {}
        },
        buttons: {
            style: {position: "absolute", zIndex: 1, top: "0px", right: "0px"},
            className: "sf_selection_buttons"
        },
        button: {extend: {name: "extend", text: "extend", style: {}}, cancel: {name: "cancel", text: "x", style: {}}},
        hiliter: {
            style: {backgroundColor: "#fa9c00", zIndex: $.sf.options.style.zIndex},
            size: 3,
            callback: {
                change: function () {
                    $.console.log(this, arguments)
                }
            }
        },
        curtain: {
            className: [$.sf.options.prefix, p, "curtain"].join($.sf.options.separator),
            style: {
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                opacity: 0.5,
                backgroundColor: "orange"
            }
        }
    };

    function a(E) {
        var G = $(E).data("descendance");
        if (G) {
            return G
        }
        G = $(E).find("*").not("SCRIPT,CANVAS,BR");
        $(E).data("descendance", G);
        return G;
        return $(E).find("*:not(SCRIPT):not(CANVAS):not(BR):visible");
        var F = $(E).find("*:not(SCRIPT):not(CANVAS):not(BR):visible");
        return $(F).map(function () {
            return $(this).unit()
        }).get();
        var D = [];
        F = F.filter(function () {
            var H = $([]);
            var J = "";
            $(H).each(function () {
                J += this.textContent.replace(/\s|\n|\t/g, "")
            });
            var I = this.tagName != "IMG" && this.tagName != "OBJECT" && this.tagName != "EMBED" && J == "";
            return (!I && $(this).css("visibility") != "hidden")
        });
        F.each(function () {
            var H = $.unit(this);
            if (H.width != 0 && H.height != 0) {
                D.push(H)
            }
        });
        return D
    }

    function b(D) {
        D.map(function () {
            var E = $(this).data("grid");
            $(this).removeData("grid");
            return E
        }).filter(function () {
            return !!this
        }).each(function () {
            return this.destroy()
        })
    }

    function l(D) {
        return !$(D).parent().is("html")
    }

    function e(D) {
        if ($.isFunction(this.options.filter) && !this.options.filter(D)) {
            return false
        }
        if ($(D).data("source")) {
            D = $(D).data("source")
        }
        if (this.options.single) {
            this.set(D)
        } else {
            this.add(D)
        }
        return false
    }

    function f(E) {
        var D = E.target;
        this.param.wrappedTextNode.add($(D).wrapTextNode())
    }

    function v(E) {
        var D = E.target;
        return e.call(this, D)
    }

    function n(D) {
        e.call(this, D.target);
        return false
    }

    function w(F) {
        var E = F.originalTarget;
        var D = $(E).data("grid");
        return
    }

    function k(D) {
        var E = $(this.param.allElement).inside(D);
        this.remove.call(this, $(this.param.dragged).not(E));
        this.add(E);
        this.param.dragged = E
    }

    function B(D) {
        this.param.dragging = true;
        this.param.dragged = $(this.param.allElement).inside(D);
        y && $.console.log()
    }

    function z(D) {
        this.param.dragging = false;
        y && $.console.log()
    }

    function x(E) {
        var D = this;
        E.filter(":empty").each(function () {
            var H = $(this);
            var I = $(H.data("source"));
            var F = H.createElement("div").css(D.options.buttons.style).appendTo(H);
            if (l(H.data("source"))) {
                if (D.options.extendOnClick) {
                    H.click(function () {
                        D.extend(H.data("source"));
                        return false
                    })
                } else {
                    H.createElement("button").attr("name", D.options.button.extend.name).css(D.options.button.extend.style).html(D.options.button.extend.text).appendTo(F).click(function (J) {
                        D.extend(H.data("source"));
                        return false
                    })
                }
            }
            H.createElement("button").attr("name", D.options.button.cancel.name).css(D.options.button.cancel.style).html(D.options.button.cancel.text).appendTo(F).click(function (J) {
                D.remove(H.data("source"));
                return false
            });
            var G = H.createElement("div").css(D.options.curtain.style).addClass(D.options.curtain.className).appendTo(H)
        })
    }

    return $.Class.create({
        param: null, options: null, initialize: function u(E, D) {
            y && $.console.log();
            this.options = $.extend(true, {}, j, D || {});
            $.extend(true, this.options.hiliter, {filter: this.options.filter, callback: {click: $.proxy(e, this)}});
            this.param = $.extend(true, {}, d, {
                window: E,
                selected: $([]),
                wrappedTextNode: $([]),
                hiliter: new Sf.Classes.Hiliter(E, this.options.hiliter),
                styleElement: $(E.document).createElement("style").text("body *{cursor:pointer !important}")
            });
            if (this.options.useGrid) {
                this.param.allElement = a(E.document.body)
            }
            $(window).unload($.proxy(function () {
                this.destroy()
            }, this));
            y && $.console.log(this.param);
            if (this.options.autostart) {
                this.start()
            }
            return this
        }, start: function s() {
            y && $.console.log();
            var E = this;
            var D = this.param.window.document;
            if (this.param.started) {
                return this
            }
            this.param.started = true;
            var F = this;
            this.param.hiliter.start();
            $(D.body).click($.proxy(v, this));
            $(D.body).find("A").click($.proxy(n, this));
            if (this.options.wrapTextNode) {
                $(D.body).mouseover($.proxy(f, this))
            }
            $(D.body).attrDismiss("onclick");
            var G = $(this.param.window.document.body).find("object").add($(this.param.window.document.body).find("embed").not(function () {
                return $(this).parent("object").size() > 0
            }));
            this.param.accelerator = new Sf.Classes.Accelerator(G, {callback: {click: $.proxy(e, this)}});
            this.param.accelerator.start();
            $(this.param.styleElement).appendTo($(D).find("head"));
            y && $.console.log(this.param);
            return this
        }, get: function r() {
            return this.param.selected.get()
        }, stop: function o() {
            if (!this.param.started) {
                return
            }
            this.param.started = false;
            this.reset();
            if (this.options.wrapTextNode) {
                this.param.wrappedTextNode.unwrap()
            }
            this.param.hiliter.stop();
            $(this.param.window.document.body).unbind("click", v);
            $(this.param.window.document.body).find("A").unbind("click", n);
            $(this.param.styleElement).detach();
            $(this.param.window.document.body).attrRestore("onclick");
            this.param.accelerator.stop();
            $(this.param.window.document.body).find("iframe").each(function () {
                var E = $(this);
                var D = E.data("wrapper");
                if (D) {
                    D.remove()
                }
                E.removeData("wrapper")
            });
            return this
        }, set: function g(D) {
            this.remove(this.param.selected);
            this.add(D);
            return this
        }, add: function i(F) {
            y && $.console.log("add", F, arguments.callee.caller);
            var E = this;
            var D = $(F).not(this.param.selected);
            D = D.filter(function () {
                var G = this;
                var H = false;
                $(E.param.selected).each(function () {
                    H = $.contains(this, G);
                    return !H
                });
                return !H
            });
            if (D.size() == 0) {
                return this
            }
            D.each(function () {
                var G = this;
                E.param.selected.filter(function () {
                    return $.contains(G, this)
                }).each(function () {
                    E.remove(this)
                })
            });
            this.param.selected = this.param.selected.add(D);
            this.param.boxes = D.boxify(this.options.boxify);
            x.call(this, this.param.boxes.filter(":empty"));
            if ($.isFunction(this.options.callback.change)) {
                this.options.callback.change.call(this)
            }
            if (this.options.useGrid) {
                D.each(function () {
                    var G = $(this).data("grid");
                    if (!G) {
                        G = new Sf.Classes.Grid.Dragging(E.param.window, {
                            callback: {
                                change: $.proxy(k, E),
                                dragStart: $.proxy(B, E),
                                dragEnd: $.proxy(z, E)
                            }
                        });
                        G.update($(this).realOuterDimension());
                        $(this).data("grid", G)
                    }
                    G.start()
                })
            }
            this.param.boxes.mouseover($.proxy(w, this));
            return this
        }, remove: function c(F) {
            var E = $(F);
            var D = E.boxify(false);
            y && $.console.log("remove", F, D);
            if (this.options.useGrid) {
                b.call(this, E)
            }
            this.param.selected = this.param.selected.filter(function () {
                return $.inArray(this, E) == -1
            });
            return this
        }, extend: function A(F) {
            var E = $(F);
            y && $.console.log(E);
            this.remove(F);
            var D = E.realOuterDimension();
            var G;
            E.parents().not("html").each(function () {
                var H = $(this).realOuterDimension();
                if ((H.width != D.width) || (H.height != D.height)) {
                    G = $(this);
                    return false
                }
            });
            return this.add(G)
        }, reset: function h() {
            var D = this.param.selected.boxify(false);
            if (this.options.useGrid) {
                b.call(this, this.param.selected)
            }
            return this.set([])
        }, size: function m() {
            return this.param.seleted.size()
        }, destroy: function q() {
            this.stop();
            this.param.hiliter.destroy()
        }
    })
})();