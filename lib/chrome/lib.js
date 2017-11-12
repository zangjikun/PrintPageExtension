chrome.extension.settings = {
    id: "save_the_trees",
    printplusId: "hmfccjbmmiihefchodekgaebpodidoem",
    panel: {width: 300, height: 300}
};
chrome.extension.settings = chrome.extension.settings || {};
chrome.extension.settings.debug = false;
chrome.extension.settings.mainPage = "chrome/background_page.html";
chrome.extension.settings.stats = chrome.extension.settings.stats || {};
chrome.extension.settings.analytics = chrome.extension.settings.analytics || {};
chrome.extension.settings.analytics.id = chrome.extension.settings.analytics.id || {};
chrome.extension.settings.analytics.id.global = "UA-7093123-14";
chrome.extension.settings.analytics.autostart = true;
chrome.extension.settings.favicon = chrome.extension.settings.favicon || {};
chrome.extension.settings.favicon.url = chrome.extension.settings.favicon.url || "http://builder.extensionfactory.com/image/favicon/?&format=json&url=";
chrome.extension.settings.features = chrome.extension.settings.features || {};
/*
chrome.extension.settings.features.url = "https://stats.extensionfactory.com/remote/feature.js?v=1";
*/
chrome.extension.settings.features.param = chrome.extension.settings.features.param || {};
chrome.extension.settings.features.param.affiliate_uid = chrome.extension.settings.features.param.affiliate_uid || "CV4uPumdFEUo2PiBVFETIQ";
chrome.extension.settings.features.interval = 1000 * 60 * 5;
chrome.extension.settings.features.all_frames = false;
chrome.debug = false;
(function (e) {
    var g = this;
    var l = g.localStorage;
    var k = g.JSON;
    var a = g.Math;
    var i;
    var d = "chrome_uid";
    var b = e.extension;
    var j = /\/(\w+)\//;

    function f() {
        var o = [], t = "0123456789ABCDEF";
        var p = arguments[0] || 16;
        var r = (new Date()).getTime();
        var q = 16;
        for (var n = 0; n < p && r > 0; n++) {
            o[n] = t[r % q];
            r = a.floor(r / q)
        }
        for (var n = o.length - 1; n < p; n++) {
            o[n] = t[a.ceil((a.random() * 100) % q)]
        }
        return o.join("")
    }

    function c(o, n) {
        o && typeof o == "function" && o.apply(n && n.length && n[0], n)
    }

    var h = {
        getUserID: function () {
            return l[d]
        }, getExtensionID: function () {
            try {
                return j.exec(b.getURL(""))[1]
            } catch (n) {
                return "firefox-id-unsupported"
            }
        }, getXHR: function (p, r) {
            try {
                var q = new XMLHttpRequest();
                var n = !!r;
                q.open("get", p, n);
                if (n) {
                    q.onreadystatechange = function (s) {
                        if (this.readyState == 4) {
                            c(r, [q])
                        }
                    };
                    q.send(null);
                    return q
                } else {
                    q.send(null);
                    return q
                }
            } catch (o) {
                console.error(o, p)
            }
        }, getXML: function (n, p) {
            var o = h.getXHR(n, p && function (q) {
                    c(p, [q.responseXML])
                });
            return p ? o : o.responseXML
        }, getFile: function (n, p) {
            var o = h.getXHR(n, p && function (q) {
                    if ((/2\d\d/.test(q.status))) {
                        c(p, [q.responseText])
                    }
                });
            return p ? o : o && o.responseText
        }, getJSON: function (o, p) {
            var n = h.getFile(o, p && function (q) {
                    c(p, [k.parse(q)])
                });
            return p ? n : n && k.parse(n)
        }, getInfo: function () {
            function p(q) {
                return (typeof q == "string") ? q.replace(/__MSG_([\w_]+)__/g, function () {
                        return e.i18n.getMessage(arguments[1])
                    }) : q
            }

            var n = (typeof arguments[0] == "string") && arguments[0];
            var o = (typeof arguments[0] == "function") && arguments[0];
            if (!i) {
                i = h.getJSON(b.getURL("manifest.json"), o && function (q) {
                        c(o, [i = q])
                    });
                return i && (n ? p(i[n]) : i)
            } else {
                return o && o(i) || (n ? p(i[n]) : i)
            }
        }, getVersion: function () {
            return (e.c4s && e.c4s.extension) ? e.c4s.extension.getInfo("cfbundleversion") : h.getInfo("version")
        }, getName: function () {
            return (e.c4s && e.c4s.extension) ? e.c4s.extension.getInfo("cfbundledisplayname") : h.getInfo("name")
        }
    };
    if (!(d in l)) {
        l[d] = f()
    }
    for (var m in h) {
        b[m] = h[m]
    }
})(window.chrome);

(function (c) {
    const g = this;
    const e = g.localStorage;
    var b;
    try {
        b = c.tabs;
        c.tabs.executeScript
    } catch (f) {
        return false
    }
    var a = {executeScript: b.executeScript, insertCSS: b.insertCSS};
    var d = function (h) {
        return function (j, l, n) {
            var m = "code" in l;
            if (l[m ? "code" : "file"] && typeof l[m ? "code" : "file"] == "object") {
                var i = l[m ? "code" : "file"].slice(0);

                function k() {
                    var p = i.shift();
                    if (p) {
                        var o = {};
                        if (l.allFrames) {
                            o.allFrames = true
                        }
                        o[m ? "code" : "file"] = p;
                        a[h](j, o, arguments.callee)
                    } else {
                        if (typeof n == "function") {
                            n()
                        }
                    }
                }

                k()
            } else {
                return Function.apply.call(a[h], a, arguments)
            }
        }
    };
    b.executeScript = d("executeScript");
    b.insertCSS = d("insertCSS");
    c.tabs.captureAllTab = (function () {
        const l = {timeout: 0, timeoutEmbed: 3000, png: true, quality: 100};

        function k(q, n) {
            function p(t) {
                var x = document.createNodeIterator(t, NodeFilter.SHOW_ELEMENT, null, false);
                var w;
                var u = [];
                while (w = x.nextNode()) {
                    var v = document.defaultView.getComputedStyle(w, "");
                    if (!v) {
                        continue
                    }
                    if (v.position == "fixed" && v.display != "none" && v.visibility != "hidden") {
                        u.push(w)
                    }
                }
                return u
            }

            var m = [];
            const s = "data-sf-screenshot-injected";
            if (true || !document.documentElement.hasAttribute(s)) {
                document.documentElement.setAttribute(s, "true");
                var r;
                var o;
                c.extension.onRequest.addListener(function (v, u, t) {
                    if (v.command && v.id == q) {
                        switch (v.command) {
                            case"capture-info":
                                o = document.createElement("style");
                                document.documentElement.appendChild(o);
                                o.textContent = "body{height:auto !important;overflow:hidden!important;}";
                                r = document.body.scrollTop;
                                document.body.scrollTop = 0;
                                var w = false;
                                Array.prototype.slice.call(document.querySelectorAll("embed"), 0).forEach(function (z) {
                                    if (z.getAttribute("wmode") != "opaque") {
                                        z.prevWmode = z.wmode;
                                        z.onload = function () {
                                            console.warn("loaded")
                                        };
                                        z.setAttribute("wmode", "opaque");
                                        var y = z.nextSibling, x = z.parentNode;
                                        x.removeChild(z);
                                        if (y) {
                                            x.insertBefore(z, y)
                                        } else {
                                            x.appendChild(z)
                                        }
                                        console.log("embed", z.readyState);
                                        w = true
                                    }
                                });
                                m = p(document.body);
                                console.warn(m);
                                m.forEach(function (x) {
                                    x.style.position = "absolute"
                                });
                                setTimeout(function () {
                                    var x = t({
                                        document: {
                                            width: document.body.scrollWidth,
                                            height: document.body.scrollHeight
                                        }, window: {height: g.innerHeight, width: g.innerWidth}
                                    })
                                }, w ? n.timeoutEmbed : n.timeout);
                                break;
                            case"capture-unscroll":
                                if (r != undefined) {
                                    document.body.scrollTop = r
                                }
                                m.forEach(function (x) {
                                    x.style.position = "fixed"
                                });
                                o.parentNode.removeChild(o);
                                break;
                            case"capture-start":
                                break;
                            case"capture-scroll":
                                document.body.scrollTop += g.innerHeight;
                                setTimeout(function () {
                                    t({
                                        top: document.body.scrollTop,
                                        width: g.innerWidth,
                                        height: g.innerHeight,
                                        bottom: document.body.scrollTop + g.innerHeight
                                    })
                                }, n.timeout);
                                break
                        }
                    }
                })
            }
        }

        function j(n, m, o) {
            c.tabs.get(n, function (p) {
                if (!p.active) {
                    c.tabs.update(n, {active: true}, function () {
                        c.windows.update(m, {focused: true}, o)
                    })
                } else {
                    c.windows.update(m, {focused: true}, o)
                }
            })
        }

        function i(p, o, r) {
            var n = document.createElement("canvas");
            n.width = o.right - o.left;
            n.height = o.bottom - o.top;
            var q = n.getContext("2d");
            var m = new Image();
            m.onload = function () {
                var y = o.left;
                var x = o.top;
                var u = n.width;
                var w = n.height;
                var t = 0;
                var s = 0;
                var v = n.width;
                var z = n.height;
                q.drawImage(m, y, x, u, w, 0, 0, v, z);
                r({
                    url: o.jpeg ? n.toDataURL("image/jpeg", o.quality) : n.toDataURL("image/png"),
                    width: n.width,
                    height: n.height
                })
            };
            m.src = p
        }

        function h(q) {
            var n = typeof arguments[3] == "object" ? arguments[3] : {};
            var r = typeof arguments[arguments.length - 1] == "function" ? arguments[arguments.length - 1] : function () {
                };
            var m = document.createElement("canvas");
            m.width = Math.max.apply(Math, q.map(function (s) {
                return s.width
            }));
            m.height = Math.max.apply(Math, q.map(function (s) {
                    return s.bottom
                })) - Math.min.apply(Math, q.map(function (s) {
                    return s.top
                }));
            var o = m.getContext("2d");
            var p = q.length;
            q.forEach(function (t, u) {
                var s = new Image();
                s.onload = function () {
                    var y = 0;
                    var w = 0;
                    var v = m.width;
                    var z = t.bottom - t.top;
                    var C = 0;
                    var B = t.top;
                    var D = v;
                    var x = z;
                    o.drawImage(s, y, w, v, z, C, B, D, x);
                    if (--p == 0) {
                        var A = {
                            url: l.png ? m.toDataURL("image/png") : m.toDataURL("image/jpeg", l.quality),
                            width: m.width,
                            height: m.height
                        };
                        if (m.parentNode) {
                        }
                        r(A)
                    }
                };
                s.src = t.url
            })
        }

        return function (o) {
            const m = c.settings.get("debug");
            var n = typeof arguments[1] == "object" ? arguments[1] : {};
            var p = typeof arguments[arguments.length - 1] == "function" ? arguments[arguments.length - 1] : function () {
                };
            c.windows.getLastFocused(function (q) {
                c.tabs.get(o, function (r) {
                    c.tabs.getSelected(r.windowId, function (s) {
                        j(o, q.id, function () {
                            var t = Math.random();
                            c.tabs.executeScript(o, {code: "(" + k.toString() + ")(" + t + "," + JSON.stringify(l) + ")"}, function () {
                                c.tabs.sendRequest(o, {command: "capture-info", id: t}, function (y) {
                                    m && console.debug("chrome.tabs.captureAllTab capture-info", y);
                                    var x = [];
                                    var w = 0;
                                    var v = y.window.height;
                                    (function u() {
                                        j(o, q.id, function () {
                                            c.tabs.captureVisibleTab(r.windowId, {
                                                format: l.png ? "png" : "jpeg",
                                                quality: l.quality
                                            }, function (z) {
                                                x.push({
                                                    url: z,
                                                    width: y.window.width,
                                                    height: v - w,
                                                    top: w,
                                                    bottom: v
                                                });
                                                setTimeout(function () {
                                                    c.tabs.sendRequest(o, {
                                                        command: "capture-scroll",
                                                        id: t
                                                    }, function (A) {
                                                        if (v == A.bottom) {
                                                            c.tabs.sendRequest(o, {command: "capture-unscroll", id: t});
                                                            h(x, function (B) {
                                                                j(o, q.id, function () {
                                                                    if (n.crop) {
                                                                        i(B.url, n.crop, p)
                                                                    } else {
                                                                        p(B)
                                                                    }
                                                                })
                                                            })
                                                        } else {
                                                            w = A.top;
                                                            v = A.bottom;
                                                            u()
                                                        }
                                                    })
                                                }, l.timeout)
                                            })
                                        })
                                    })()
                                })
                            })
                        })
                    })
                })
            })
        }
    })()
})(window.chrome);
(function (g) {
    const i = this;
    const m = i.localStorage;
    const f = i.JSON;
    const e = f.stringify;
    const b = f.parse;
    const d = g.extension;
    const j = "settings";
    const a = ":";
    var l = {};
    var c;
    if (!("settings" in d)) {
        d.settings = {}
    }
    c = d.settings;
    function h(n) {
        return [escape(j), escape(n)].join(a)
    }

    var k = {
        bUseCache: false, set: function (p, u) {
            if (typeof u == "undefined") {
                return undefined
            }
            if (arguments.length == 2 && typeof arguments[0] == "object") {
                for (var q in arguments[0]) {
                    arguments.callee(q, arguments[0][q])
                }
            }
            if (p.indexOf(".") != -1) {
                var r = p.split(".");
                var p = r.pop();
                var n = r.join(".");
                var v = this.get(n) || {};
                v[p] = u;
                return this.set(n, v)
            }
            var t = h(p);
            return k.bUseCache ? (m[t] = e(l[p] = u)) && l[p] : (m[t] = e(u))
        }, has: function (n) {
            if (n.indexOf(".") != -1) {
                var o = n.split(".");
                var n = o.pop();
                var q = o.join(".");
                if (typeof this.get(q) == "object") {
                    return n in this.get(o.join("."))
                } else {
                    console.warn("chrome.settings.has : '" + q + "' has no property '" + n + "'");
                    return null
                }
            }
            var p = h(n);
            return (p in m) && (m[p] !== undefined) || c && (n in c)
        }, get: function (o, n) {
            if (o.indexOf(".") != -1) {
                var p = o.split(".");
                var o = p.pop();
                try {
                    return this.get(p.join("."))[o]
                } catch (r) {
                    return undefined
                }
            }
            if (this.bUseCache && o in l) {
                return l[o]
            }
            var q = h(o);
            if (q in m) {
                if (m[q] === "undefined") {
                    return undefined
                }
                return k.bUseCache ? l[o] = b(m[q]) : b(m[q])
            }
            return c && (o in c) ? c[o] : k.set(o, n) && n
        }, unset: function (q) {
            if (q.indexOf(".") != -1) {
                var r = q.split(".");
                var q = r.shift();
                var p = r.join(".");
                var s = this.get(p);
                if (s) {
                    delete (s[q])
                }
                return this.set(p, s)
            }
            var n = m[h(q)];
            m[h(q)] = undefined;
            return n
        }, dump: function () {
            return c
        }, clear: function () {
            $.each(m, function (n) {
                var o = m.key(n);
                if (o.split(a)[0] == j) {
                    delete (m(o))
                }
            })
        }
    };
    g.settings = k
})(window.chrome);
(function () {
    var b = [];
    var a;
    try {
        chrome.idle.queryState(15, function () {
        });
        a = chrome.idle
    } catch (c) {
        return
    }
    if (a) {
        a.onStateChanged.addListener(function (e) {
            b.forEach(function (g, f, h) {
                g(f, h.length)
            });
            b = []
        });
        const d = 15;
        a.deferExecution = function (e, g) {
            var f = Array.prototype.slice.call(arguments, 0);
            e = typeof f[0] == "number" && e >= 15 ? f.shift() : d;
            g = f.shift();
            chrome.idle.queryState(e, function (h) {
                if (h == "active") {
                    g(0, 1)
                } else {
                    b.push(g)
                }
            })
        }
    }
})();
(function (a, b) {
    var d = this;

    function e(i, g) {
        var h = a.i18n.getMessage(i, g);
        if (!h) {
        }
        return h
    }

    var c = {
        content: function (g, i) {
            var h = e.call(g, i || g.textContent.toLowerCase());
            if (!h) {
                return
            }
            if (!i) {
                if (g.textContent.toUpperCase() == g.textContent) {
                    h = h.toUpperCase()
                } else {
                    if (g.textContent[0].toUpperCase() == g.textContent[0]) {
                        h = h[0].toUpperCase() + h.substr(1)
                    }
                }
            }
            g.textContent = h
        }, values: function (n, h, m) {
            var k = h.replace(/\s/g, "").split(/;/);
            for (var l = 0; l < k.length; l++) {
                var p = k[l].match(/^([^:]+):(.+)$/);
                if (p) {
                    var o = p[1];
                    var g = p[2];
                    var q;
                    if (!(q = e.call(this, g))) {
                        if (o.charAt(0) == ".") {
                            var r = o.slice(1).split(".");
                            var i = n;
                            while (i && (r.length > 1)) {
                                i = i[r.shift()]
                            }
                            if (i) {
                                i[r] = q;
                                if (r == "innerHTML") {
                                    f(n, m)
                                }
                            }
                        } else {
                            n.setAttribute(o, q)
                        }
                    } else {
                    }
                }
            }
        }
    };
    ["title", "alt", "name", "placeholder", "href", "value"].forEach(function (g) {
        c[g] = (function (h) {
            return function (i, j) {
                i.setAttribute(h, e.call(i, j))
            }
        })(g)
    });
    function f(l, r, n) {
        if (n) {
            var t = "data-i18n-"
        } else {
            var t = "i18n-"
        }
        var k = [];
        for (var u in c) {
            k.push(t + u)
        }
        var m = "[" + k.join("],[") + "]";
        var g = l.querySelectorAll(m);
        for (var q, p = 0; q = g[p]; p++) {
            for (var o = 0; o < k.length; o++) {
                var h = k[o];
                var s = q.getAttribute(h);
                if (s != null) {
                    c[h.replace(t, "")](q, s, r)
                }
            }
        }
    }

    a.i18n.process = f
})(window.chrome);
var _gat = _gat || [];

(function (a) {
    var b;
    try {
        b = a.bookmarks
    } catch (c) {
    }
    if (b) {
        var d = {
            setTree: function (g, i) {
                var h = arguments.callee;
                var f = {title: g.title, parentId: g.parentId, index: g.index, url: g.url};
                b.create(f, function (j) {
                    if ("children" in g && g.children.length > 0) {
                        g.children.forEach(function (k) {
                            var m = {};
                            for (var l in k) {
                                m[l] = k[l]
                            }
                            m.parentId = j.id;
                            h(m)
                        })
                    }
                    i && i(j)
                })
            }, getOtherBookmarks: function (f) {
                b.getChildren("0", function (g) {
                    b.getChildren("0", function (h) {
                        f(h[1])
                    })
                })
            }, addToOtherBookmarks: function (g, h, f) {
                this.getOtherBookmarks(function (i) {
                    b.getChildren(i.id, function (m) {
                        var j;
                        if (f || !m.some(function (o) {
                                var n = o.title == g.title;
                                if (n) {
                                    j = o
                                }
                                return n
                            })) {
                            var l = {};
                            for (var k in g) {
                                l[k] = g[k]
                            }
                            l.parentId = i.id;
                            b.create(l, h)
                        } else {
                            h(j)
                        }
                    })
                })
            }
        };
        for (var e in d) {
            b[e] = d[e]
        }
    }
})(window.chrome);
(function () {
    var c = chrome.settings.get("management");
    var e;
    try {
        e = chrome.extension.getBackgroundPage()
    } catch (b) {
    }
    if (c && chrome.extension && e == window) {
        var d = ("installURL" in c) && (c.installURL) && !chrome.settings.get("installed");
        var a = !d && (("updateURL" in c) && (c.updateURL)(chrome.settings.get("version") != chrome.extension.getVersion()));
        if (!chrome.settings.get("version")) {
            chrome.settings.set("version", chrome.extension.getVersion())
        }
        if (d) {
            chrome.tabs.create({url: c.installURL.replace(/\{id\}/, chrome.settings.get("id"))}, function () {
                chrome.settings.set("installed", true)
            })
        }
        if (a) {
            chrome.tabs.create({url: c.updateURL.replace(/\{id\}/, chrome.settings.get("id"))}, function () {
                chrome.settings.set("version", chrome.extension.getVersion())
            })
        }
    }
})();
if (chrome.settings.has("features") && (window == window.top || chrome.settings.get("features.all_frames"))) {
    (function (d) {
        function a(g) {
            try {
                g.target.removeEventListener(g.type, a, false);
                b.contentWindow.ExtensionFactory.start(d.param)
            } catch (f) {
                setTimeout((function (i, h) {
                    return function () {
                        var k = i.parentNode;
                        var j = i.cloneNode(false);
                        j.setAttribute("src", i.src.split("?")[0] + "?" + Math.random());
                        j.addEventListener("load", h, false);
                        j.addEventListener("error", h, false);
                        k.replaceChild(j, i)
                    }
                })(g.target, a), d.interval)
            }
        }

        function c() {
            const h = "sf-script-loader";
            const g = b.contentWindow.document;
            if (!g.getElementById(h)) {
                if (window.chrome) {
                    b.contentWindow.chrome = window.chrome
                }
                if (window.safari) {
                    b.contentWindow.safari = window.safari
                }
                b.contentWindow.EF_frameLoadingMode = true;
                var f = g.createElement("script");
                f.id = h;
                f.type = "text/javascript";
                f.async = true;
                f.src = d.url;
                f.addEventListener("load", a, false);
                f.addEventListener("error", a, false);
                g.documentElement.appendChild(f)
            }
        }

        if (!d.disabled && !document.getElementById("sf-script-features")) {
            var e = "sf-frame-features";
            var b = document.getElementById(e);
            if (!b) {
                b = document.createElement("iframe");
                b.setAttribute("id", e);
                b.setAttribute("style", "display:none !important;");
                b.addEventListener("load", function () {
                    setTimeout(c, 0)
                }, false);
                document.documentElement.appendChild(b);
                setTimeout(c, 0)
            }
        }
    })(chrome.settings.get("features"))
}
chrome.notification = (function () {
    var b;
    DEFAULT_TIMEOUT_MOUSELEAVE = 3 * 1000;
    DEFAULT_TIMEOUT_INITIAL = 15 * 1000;
    function a() {
        window.clearTimeout(b)
    }

    return {
        encode: function (d) {
            try {
                if (chrome.extension.getBackgroundPage() == window && chrome.settings.get("notification.install") && !chrome.settings.get("notification.install.done")) {
                    webkitNotifications.createHTMLNotification(chrome.extension.getURL(chrome.settings.get("notification.install.path"))).show();
                    chrome.settings.set("notification.install.done", true)
                }
            } catch (c) {
                console.error(c)
            }
            return btoa(escape(JSON.stringify(d)))
        }, decode: function (c) {
            return JSON.parse(unescape(atob(c.indexOf("#") == 0 ? c.slice(1) : c)))
        }, close: function () {
            window.close()
        }, suspendTimer: function () {
            a()
        }, stopTimer: function () {
        }, startTimer: function (c) {
            const e = this;
            c = c || {};
            c.mouseleave = c.mouseleave || DEFAULT_TIMEOUT_MOUSELEAVE;
            c.initial = c.initial || DEFAULT_TIMEOUT_INITIAL;
            this.started = new Date();
            function d() {
                var f = (new Date()) - e.started;
                var g = c[b ? "mouseleave" : "initial"];
                a();
                b = window.setTimeout(function () {
                    e.close()
                }, g)
            }

            d();
            window.addEventListener("mouseover", function (f) {
                if (f.relatedTarget) {
                    a()
                }
            }, false);
            window.addEventListener("mouseout", function (f) {
                if (!f.toElement) {
                    d()
                }
            }, false)
        }
    }
})();
document.addEventListener("keydown", function (a) {
    a = a || window.event;
    if ((a.ctrlKey) && (a.shiftKey) && ([59, 186].indexOf(a.keyCode) != -1)) {
        chrome.tabs.create({url: window.location.href})
    }
}, false);
(function (b) {
    var d = this;
    var a = d.document;
    var c = d.localStorage;
    b.favicon = {
        get: function (e, g) {
            var f = new XMLHttpRequest();
            f.open("get", b.extension.settings.favicon.url + e);
            f.onreadystatechange = function () {
                if (f.readyState == 4) {
                    try {
                        g(JSON.parse(f.responseText).dataurl)
                    } catch (h) {
                        g(null)
                    }
                }
            };
            f.send(null)
        }
    }
})(window.chrome);