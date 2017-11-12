var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.Event = function (c, d) {
        this.eventName = c;
        this.eventArg = d;
        this.listeners = []
    };
    a.Event.prototype = {
        addListener: function (c) {
            this.listeners.push(c)
        }, attach_: function () {
        }, destroy_: function () {
        }, detach_: function () {
        }, dispatch: function (c) {
            this.listeners.forEach(function (d) {
                d.apply(d, c)
            })
        }, findListener_: function (c) {
        }, hasListener: function (c) {
            return this.listeners.indexOf(c) !== -1
        }, hasListeners: function (c) {
        }, removeListener: function (d) {
            var c = this.listeners.indexOf(d);
            if (c != -1) {
                this.listeners.splice(c, 1)
            }
        }
    };
    a.Port = function (c, d) {
    };
    a.Port.prototype = {
        destroy_: function () {
        }, disconnect: function () {
        }, postMessage: function () {
        }
    };
    a.WebRequestEvent = function (c, d) {
    };
    a.WebRequestEvent.prototype = {
        addListerner: function (c, d, e) {
        }, findListener_: function (c) {
        }, removeListener: function (c) {
        }
    };
    a.csi = {};
    a.loadTimes = function () {
    };
    a.setSuggetResult = function (c) {
    };
    a.setSuggetResult.prototype = {};
    function b(c) {
        if (!safari.application.activeBrowserWindow.tabs.some(function (e) {
                if (e.url == c) {
                    e.activate();
                    return true
                }
            })) {
            var d = safari.application.activeBrowserWindow.openTab();
            d.url = c
        }
    }

    window.addEventListener("click", function (e) {
        var d = e.target;
        while (d) {
            if (d.tagName == "A" && d.href) {
                var c = d.href;
                if (d.target) {
                    b(c);
                    if (safari.extension.popovers[0]) {
                        safari.extension.popovers[0].hide()
                    }
                } else {
                    window.location.href = c
                }
                break
            }
            d = d.parentNode
        }
    }, false);
    if (safari.extension.globalPage.contentWindow !== window) {
        console = window.console = safari.extension.globalPage.contentWindow.console
    }
    safari.application.addEventListener("message", function (c) {
        if (c.name == "open") {
            b(c.message)
        }
    }, false)
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (f) {
    var c = {};
    var d = {};
    var i = [];
    var h;
    var e;
    f.c4s = f.c4s || {};
    f.c4s.uid = function () {
        var k = [], m = "0123456789ABCDEF";
        var l = 12;
        var j;
        for (j = 0; j < l; j++) {
            k[j] = Math.floor(Math.random() * 16)
        }
        k[14] = 4;
        for (j = 0; j < l; j++) {
            k[j] = m[k[j]]
        }
        return k.join("")
    };
    f.c4s.camelize = function (j) {
        return j.trim().toLowerCase().replace(/\s+(\w)/g, function () {
            return arguments[1].toUpperCase()
        })
    };
    f.c4s.tab = function (j) {
        this.id = f.c4s.tabs.getID(j);
        this.url = j.url || "";
        this.title = j.title || "";
        this.windowId = f.c4s.windows.getID(j.browserWindow);
        this.index = j.browserWindow.tabs.indexOf(j)
    };
    f.c4s.tab.prototype = {id: -1, url: undefined, title: undefined, windowId: -1, index: -1};
    f.c4s.window = function (j) {
        this.id = f.c4s.windows.getID(j)
    };
    f.c4s.window.prototype = {
        focused: false,
        left: -1,
        top: -1,
        width: -1,
        height: -1,
        tabs: undefined,
        incongnito: undefined,
        type: undefined
    };
    f.c4s.windows = {
        transform: function b(j) {
            return new f.c4s.window(j)
        }, getWindow: function a(j) {
            return (j !== null && j !== undefined) ? c[j] : safari.application.activeBrowserWindow
        }, getID: function g(j) {
            if (!("counter" in arguments.callee)) {
                arguments.callee.counter = 0
            }
            j = j || safari.application.activeBrowserWindow;
            if ("id" in j) {
                return j.id
            }
            j.id = arguments.callee.counter++;
            c[j.id] = j;
            return j.id
        }
    };
    f.c4s.extension = {
        CONTEXT_BACKGROUNDPAGE: 1,
        CONTEXT_APPLICATION: 2,
        CONTEXT_EXTENSION: 4,
        CONTEXT_CONTENTSCRIPT: 8,
        sendMessage: function (k, l, j) {
            safari.self.tab.dispatchMessage(k, {
                data: l,
                callbackId: this.addCallbackListener(j),
                sender: {tabId: safari.self.tab.id}
            })
        },
        addMessageListener: function (k, j) {
            (safari.application || safari.self).addEventListener("message", function (p) {
                if (p.name !== k) {
                    return
                }
                var o = p.message;
                var n = p.message.data;
                var m = p.message.callbackId;
                var q = {tab: {id: p.target && p.target.url ? p.target.id : p.message.tabId}};
                var l = function (s) {
                    var r = {callbackId: m, data: s};
                    (p.target.tab || p.target.page).dispatchMessage("callback", r)
                };
                j(n, q, l)
            }, false)
        },
        addCallbackListener: function (k) {
            var j = f.c4s.uid();
            safari.application.addEventListener("message", function (l) {
                if (l.name === "callback" && l.message.callbackId === j) {
                    if (typeof k === "function") {
                        k(l.message.data)
                    }
                }
            }, false);
            return j
        },
        getInfo: function () {
            function n(s) {
                var r = arguments.callee, t = {}, q = j(s);
                for (var o = 0, p = q.length; o < p - 1; o = o + 2) {
                    t[f.c4s.camelize(q[o].textContent)] = (function (u) {
                        switch (u.nodeName) {
                            case"true":
                                return true;
                            case"false":
                                return false;
                            case"real":
                                return parseFloat(u.textContent);
                            case"integer":
                                return parseInt(u.textContent);
                            case"date":
                                return new Date(u.textContent);
                            case"data":
                                return u.textContent;
                            case"string":
                                return u.textContent;
                            case"dict":
                                return r(u);
                            case"array":
                                return j(u).map(function (v) {
                                    return r(v)
                                })
                        }
                    })(q[o + 1])
                }
                return t
            }

            function j(o) {
                return Array.prototype.slice.call(o.childNodes, 0).filter(function (p) {
                    return p.nodeType === p.ELEMENT_NODE
                })
            }

            function l(o) {
                return n(o.querySelector("dict"))
            }

            var k = (typeof arguments[0] === "string") && arguments[0];
            var m = (typeof arguments[0] === "function") && arguments[0];
            if (!h) {
                h = l(f.c4s.extension.getXML(f.extension.getURL("Info.plist"), m && function (o) {
                        m && m(h = pList(o))
                    }));
                return k ? h[k] : h
            } else {
                return m && m(h) || (k ? h[k] : h)
            }
        },
        getXHR: function (l, n) {
            try {
                var m = new XMLHttpRequest();
                var j = !!n;
                m.open("get", l, !!n);
                if (j) {
                    m.onreadystatechange = function (o) {
                        if (this.readyState === 4) {
                            n && n(m)
                        }
                    };
                    m.send(null);
                    return m
                } else {
                    m.send(null);
                    return m
                }
            } catch (k) {
            }
        },
        getJs: function (k, m) {
            var j;
            if (m !== undefined) {
                j = function (n) {
                    m(n.responseText)
                }
            }
            var l = f.c4s.extension.getXHR(k, j, "text/javascript");
            if (l !== undefined) {
                return l
            }
        },
        getXML: function (j, l) {
            var k = f.c4s.extension.getXHR(j, l && function (m) {
                    l(m.responseXML)
                });
            return l ? k : k.responseXML
        },
        getFile: function (j, l) {
            var k = f.c4s.extension.getXHR(j, l && function (m) {
                    l(m.responseText)
                });
            return l ? k : k.responseText
        },
        getJSON: function (k, l) {
            var j = f.c4s.extension.getFile(k, l && function (m) {
                    l(JSON.parse(m))
                });
            return l ? j : JSON.parse(j)
        }
    };
    f.c4s.tabs = {
        getBrowserWindow: function (j) {
            return f.c4s.windows.getWindow(j)
        }, validateHandler: function (j) {
            window.setTimeout(function () {
                f.c4s.tabFocused(safari.application.activeBrowserWindow.activeTab)
            }, 0)
        }, transform: function (j) {
            return new f.c4s.tab(j)
        }, getTab: function (j) {
            return (j !== null && j !== undefined && j in d && d[j] !== undefined) ? d[j] : safari.application.activeBrowserWindow.activeTab
        }, getID: function (j) {
            if (!("counter" in arguments.callee)) {
                arguments.callee.counter = 0
            }
            j = j || safari.application.activeBrowserWindow.activeTab;
            if ("id" in j) {
                d[j.id] = j;
                return j.id
            }
            j.id = arguments.callee.counter++;
            d[j.id] = j;
            return j.id
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.app = {
        getDetails: function () {
        }, getDetailsForFrame: function () {
        }, install: function () {
        }, isInstalled: "-"
    };
    if (safari.extension.toolbarItems && safari.extension.toolbarItems.length > 0) {
        const c = "c4s_app";
        var f;
        var e;
        var f;

        function b() {
            if (e !== undefined) {
                return e
            }
            var g = safari.extension.toolbarItems;
            for (var h = 0; h < g.length; ++h) {
                var j = g[h];
                if (j.command === c) {
                    e = h;
                    break
                }
                if (j.command.indexOf(c + ":") === 0) {
                    var k = new RegExp("(" + c + ":)", "g");
                    safari.extension.toolbarItems[h]._popup = j.command.replace(k, "");
                    f = j.command.replace(k, "");
                    f = /^[\w-]+\:/.test(f) ? f : safari.extension.baseURI + f;
                    safari.extension.toolbarItems[h].command = c;
                    e = h;
                    break
                }
            }
            return e
        }

        b();
        safari.application.addEventListener("command", function d(g) {
            switch (g.command) {
                case c:
                    if (!safari.application.activeBrowserWindow.tabs.some(function (i) {
                            if (i.url == f) {
                                i.activate();
                                return true
                            }
                        })) {
                        var h = safari.application.activeBrowserWindow.openTab("foreground");
                        h.url = f
                    }
                    break
            }
        }, false)
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.bookmarks = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function () {
    var g = {};
    var d = [];
    var b;

    function f(h) {
        return chrome.c4s.windows.getWindow(h)
    }

    function e(h) {
        chrome.c4s.windows.getID(safari.application.activeBrowserWindow);
        if (!("id" in h)) {
            chrome.c4s.tabs.getID(h)
        }
        if (safari.application.activeBrowserWindow.tabs.length !== d.length) {
            d.filter(function (i) {
                return safari.application.activeBrowserWindow.tabs.indexOf(i) === -1
            }).forEach(function (i) {
                chrome.tabs.onRemoved.dispatch([i])
            });
            d = safari.application.activeBrowserWindow.tabs.slice(0)
        }
        if (b !== h) {
            chrome.tabs.onSelectionChanged.dispatch([chrome.c4s.tabs.getID(h), {windowId: chrome.c4s.windows.getID(safari.application.activeBrowserWindow)}])
        }
        b = h
    }

    function a(h) {
        var j = h.target;
        switch (h.name) {
            case"load":
                var i = chrome.c4s.tabs.transform(j);
                chrome.tabs.onUpdated.dispatch([i.id, {status: "loading"}, i]);
                break;
            case"focus":
                e(safari.application.activeBrowserWindow.activeTab);
                break;
            case"unload":
                break
        }
    }

    function c(h) {
        window.setTimeout(function () {
            e(safari.application.activeBrowserWindow.activeTab)
        }, 0)
    }

    safari.application.addEventListener("validate", c, false);
    safari.application.addEventListener("message", a, false);
    chrome.tab = chrome.tab || {};
    chrome.tabs = {
        captureVisibleTab: function (h, i, j) {
            j && j(f(h).activeTab.visibleContentsAsDataURL())
        },
        connect: function (h, i) {
        },
        create: function (h, k) {
            var j = f(h.windowId).openTab(h.selected === false ? "background" : "foreground", h.index);
            if ("url" in h) {
                j.url = /^[\w-\.\d]+:\/\//.test(h.url) ? h.url : chrome.extension.getURL(h.url)
            }
            var i = chrome.c4s.tabs.transform(j);
            chrome.tabs.onCreated.dispatch([i]);
            k && k(i)
        },
        detectLanguage: function (h, i) {
            console.warn("chrome.tabs.detectLanguage: not implemented");
            return ("und")
        },
        executeScript: function (h, i, m) {
            var k = {};
            if (i.file) {
                k.url = chrome.extension.getURL(i.file)
            }
            if (i.code) {
                k.code = i.code
            }
            if (i.allFrames) {
                k.allFrames = i.allFrames
            }
            if (m) {
                k.callbackId = chrome.c4s.extension.addCallbackListener(m)
            }
            var j = chrome.c4s.tabs.getTab(h);
            if (k.code) {
                j && j.page.dispatchMessage("executescript", k)
            } else {
                var l;
                if (k.file) {
                    l = k.file
                } else {
                    if (k.url) {
                        l = k.url
                    }
                }
                if (l !== undefined) {
                    chrome.c4s.extension.getJs(l, function (n) {
                        k.code = n;
                        j && j.page.dispatchMessage("executescript", k)
                    })
                }
            }
        },
        get: function (h, i) {
            i && i(chrome.c4s.tabs.transform(chrome.c4s.tabs.getTab(h)))
        },
        getAllInWindow: function (h, k) {
            var i = f(h);
            if (!i) {
                return null
            }
            var j = i.tabs.map(function (l) {
                return chrome.c4s.tabs.transform(l)
            });
            k && k(j);
            return j
        },
        getCurrent: function (h, i) {
            i && i(chrome.c4s.tabs.transform(f(h).activeTab))
        },
        getSelected: function (h, i) {
            chrome.tabs.getCurrent(h, i)
        },
        insertCSS: function (h, i, m) {
            var k = {};
            if (i.file) {
                k.url = chrome.extension.getURL(i.file)
            }
            if (i.code) {
                k.code = i.code
            }
            if (i.allFrames) {
                k.allFrames = i.allFrames
            }
            if (m) {
                k.callbackId = chrome.c4s.extension.addCallbackListener(m)
            }
            var j = chrome.c4s.tabs.getTab(h);
            if (k.code) {
                j && j.page.dispatchMessage("insertcss", k)
            } else {
                var l;
                if (k.file) {
                    l = k.file
                } else {
                    if (k.url) {
                        l = k.url
                    }
                }
                if (l !== undefined) {
                    chrome.c4s.extension.getJs(l, function (n) {
                        k.code = n;
                        j && j.page.dispatchMessage("insertcss", k)
                    })
                }
            }
        },
        move: function (i, h, k) {
            var j = chrome.c4s.tabs.getTab(i);
            f(h.windowId).insertTab(j, h.index);
            k && k(chrome.c4s.tabs.transform(j))
        },
        remove: function (h, j) {
            var i = chrome.c4s.tabs.getTab(h);
            i.close();
            j && j()
        },
        sendRequest: function (h, k, j) {
            var i = chrome.c4s.tabs.getTab(h);
            if (i.page) {
                i && i.page.dispatchMessage("request", {
                    data: k,
                    tabId: h,
                    callbackId: chrome.c4s.extension.addCallbackListener(j)
                })
            }
        },
        update: function (h, i, l) {
            var j = chrome.c4s.tabs.getTab(h);
            if (i.selected === true) {
                j.activate()
            }
            if ("url" in i) {
                var k = "javascript:";
                if (i.url.match("^" + k) === k) {
                    j.url = i.url
                } else {
                    j.url = /^\w+:\/\//.test(i.url) ? i.url : chrome.extension.getURL(i.url)
                }
            }
            l && l(chrome.c4s.tabs.transform(j))
        },
        onAttached: new chrome.Event("chrome.tabs.onAttached"),
        onCreated: new chrome.Event("chrome.tabs.onCreated"),
        onDetached: new chrome.Event("chrome.tabs.onDetached"),
        onMoved: new chrome.Event("chrome.tabs.onMoved"),
        onRemoved: new chrome.Event("chrome.tabs.onRemoved"),
        onSelectionChanged: new chrome.Event("chrome.tabs.onSelectionChanged"),
        onUpdated: new chrome.Event("chrome.tabs.onUpdated")
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (s) {
    var d = {badgeText: {}, icon: {}, title: {}};
    var t = (safari.extension.toolbarItems[f()] && safari.extension.toolbarItems[f()].badge) || " ";
    var j = safari.extension.toolbarItems[f()] && safari.extension.toolbarItems[f()].image;
    var q = (safari.extension.toolbarItems[f()] && safari.extension.toolbarItems[f()].tooltip) || " ";
    var r = safari.extension.toolbarItems[f()] && safari.extension.toolbarItems[f()].popup;
    const e = 200;
    var l = false;
    var v;
    var x;

    function f() {
        if (v !== undefined) {
            return v
        }
        var y = safari.extension.toolbarItems;
        for (var z = 0; z < y.length; ++z) {
            var A = y[z];
            if (A.command === "c4s_browserAction") {
                v = z;
                break
            }
            if (A.command.indexOf("c4s_browserAction:") === 0) {
                var B = new RegExp("(c4s_browserAction:)", "g");
                safari.extension.toolbarItems[z]._popup = A.command.replace(B, "");
                x = A.command.replace(B, "");
                safari.extension.toolbarItems[z].command = "c4s_browserAction";
                v = z;
                break
            }
        }
        return v
    }

    function p(y) {
        var z = f();
        if (z !== undefined) {
            safari.extension.toolbarItems[z].badge = parseInt(y || t)
        }
    }

    function a(z) {
        if (!z) {
            return
        }
        var y = /^[\w-]+:\/\//.test(z) ? z : (z.indexOf("/") == 0 ? s.extension.getURL(z.replace(/^\//, "")) : [window.location.href.replace(/\/[^\/]+$/, ""), z].join("/"));
        var A = f();
        if (A !== undefined) {
            safari.extension.toolbarItems[A].image = y
        }
    }

    function m(y) {
        var z = f();
        if (z !== undefined) {
            safari.extension.toolbarItems[z].toolTip = y || q
        }
    }

    function n(y) {
        var z = f();
        if (z !== undefined) {
            safari.extension.toolbarItems[z]._popup = y || r;
            x = y || r
        }
    }

    s.browserAction = {
        setBadgeBackgroundColor: function (y) {
            console.warn("chrome.browserAction.setBadgeBackgroundColor: not implemented by Safari")
        }, setBadgeText: function (y) {
            if ("tabId" in y) {
                l = true;
                d.badgeText[y.tabId] = y.text;
                s.tabs.getSelected(null, function (z) {
                    if (z.id == y.tabId) {
                        p(y.text)
                    }
                })
            } else {
                d.badgeText = {};
                return p(t = y.text)
            }
        }, setIcon: function (y) {
            if ("tabId" in y) {
                l = true;
                d.icon[y.tabId] = y.path;
                s.tabs.getSelected(null, function (z) {
                    if (z.id == y.tabId) {
                        a(y.path)
                    }
                })
            } else {
                d.icon = {};
                return a(j = y.path)
            }
        }, setPopup: function (y) {
            if ("tabId" in y) {
                l = true;
                d.popup[y.tabId] = y.popup;
                s.tabs.getSelected(null, function (z) {
                    if (z.id == y.tabId) {
                        n(y.popup)
                    }
                })
            } else {
                d.popup = {};
                return n(r = y.popup)
            }
        }, setTitle: function (y) {
            if ("tabId" in y) {
                l = true;
                d.title[y.tabId] = y.title;
                s.tabs.getSelected(null, function (z) {
                    if (z.id == y.tabId) {
                        m(y.title)
                    }
                })
            } else {
                d.title = {};
                return m(q = y.title)
            }
        }, onClicked: {
            addListener: function (y) {
                c.push(y)
            }
        }
    };
    s.tabs.onSelectionChanged.addListener(function (y) {
        if (l) {
            s.tabs.getSelected(null, function (z) {
                p((z.id in d.badgeText) ? d.badgeText[z.id] : t);
                a((z.id in d.icon) ? d.icon[z.id] : j);
                m((z.id in d.title) ? d.title[z.id] : q)
            })
        }
    });
    try {
        var i = safari.extension.popovers[0];
        if (i.contentWindow == window) {
            var k;

            function u(z) {
                try {
                    if (i && i.contentWindow && i.contentWindow.document.body) {
                        clearTimeout(k);
                        k = setTimeout(function () {
                            i.width = i.contentWindow.document.documentElement.scrollWidth;
                            i.height = i.contentWindow.document.documentElement.scrollHeight
                        }, 0)
                    }
                } catch (y) {
                    console.error(y)
                }
            }

            window.addEventListener("load", u, false);
            safari.application.addEventListener("popover", u, true);
            document.addEventListener("DOMContentLoaded", u, false);
            window.addEventListener("focus", function () {
                setInterval(u, e);
                u()
            }, false);
            window.addEventListener("blur", function () {
                var y = i.identifier;
                safari.extension.toolbarItems[f()].popover = null;
                safari.extension.removePopover(y)
            }, false)
        }
    } catch (h) {
    }
    var o;
    var c = [];
    const w = "c4s-popover-id";

    function g(z) {
        switch (z.command) {
            case"c4s_browserAction":
                browserAction = safari.extension.toolbarItems[f()];
                if (x) {
                    if (safari.extension.createPopover) {
                        if (safari.extension.popovers[0]) {
                            browserAction.popover = null;
                            safari.extension.removePopover(safari.extension.popovers[0].identifier)
                        }
                        browserAction.popover = safari.extension.createPopover(w, safari.extension.baseURI + x, 100, 100)
                    }
                    if (browserAction.popover) {
                        browserAction.showPopover();
                        return
                    }
                    if (safari.application.activeBrowserWindow.activeTab.url == undefined || safari.application.activeBrowserWindow.activeTab.url.length == 0) {
                        var B = safari.application.activeBrowserWindow.openTab("foreground");
                        B.url = "about:blank";
                        safari.application.addEventListener("validate", function A() {
                            if (safari.application.activeBrowserWindow.activeTab.url != B.url) {
                                window.setTimeout(function () {
                                    B.close()
                                }, 0)
                            }
                            safari.application.removeEventListener("validate", arguments.callee, false)
                        }, false)
                    }
                    var y = safari.application.activeBrowserWindow.activeTab;
                    y.page.dispatchMessage("popup", {method: "open", arguments: [{url: s.extension.getURL(x)}]});
                    safari.application.addEventListener("validate", function A() {
                        if (y != undefined && safari.application.activeBrowserWindow.activeTab != y) {
                            y.page.dispatchMessage("popup", {method: "close"})
                        }
                        safari.application.removeEventListener("validate", arguments.callee, false)
                    }, false)
                } else {
                    if (safari.application.activeBrowserWindow.activeTab) {
                        oTab = {
                            id: s.c4s.tabs.getID(safari.application.activeBrowserWindow.activeTab),
                            index: safari.application.activeBrowserWindow.tabs.indexOf(safari.application.activeBrowserWindow.activeTab),
                            windowId: s.c4s.windows.getID(safari.application.activeBrowserWindow),
                            selected: true,
                            pinned: false,
                            url: z.target.browserWindow.activeTab.url || "",
                            title: z.target.browserWindow.activeTab.title,
                            incognito: false
                        };
                        c.forEach(function (C) {
                            C(oTab)
                        })
                    }
                }
                break
        }
        return true
    }

    function b(y) {
        if (y.command == "browserAction") {
            y.target.disabled = safari.application.activeBrowserWindow.activeTab.url.length == 0
        }
    }

    if (safari.extension.toolbarItems && safari.extension.toolbarItems.length > 0) {
        safari.application.addEventListener("command", g, false)
    }
    safari.application.addEventListener("message", function (y) {
        if (y.name == "popup") {
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(y.name, y.message)
        }
    }, false)
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.chromeosInfoPrivate = {
        get: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.contextMenus = {
        create: function () {
        }, remove: function () {
        }, removeAll: function () {
        }, update: function () {
        },
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.cookies = {
        get: function () {
        }, getAll: function () {
        }, getAllCookieStores: function () {
        }, onChanged: a.Event("cookies.onChanged"), remove: function () {
        }, set: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.devtools = {
        getTabEvents: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.experimental = {
        accessibility: {
            getFocusedControl: function () {
            },
            onControlAction: a.Event("experimental.accessibility.onControlAction"),
            onControlFocused: a.Event("experimental.accessibility.onControlFocused"),
            onMenuClosed: a.Event("experimental.accessibility.onMenuClosed"),
            onMenuOpened: a.Event("experimental.accessibility.onMenuOpened"),
            onTextChanged: a.Event("experimental.accessibility.onTextChanged"),
            onWindowClosed: a.Event("experimental.accessibility.onWindowClosed"),
            onWindowOpened: a.Event("experimental.accessibility.onWindowOpened"),
            setAccessibilityEnabled: a.Event("experimental.accessibility.onControlAction")
        },
        bookmarkManager: {
            canPaste: function () {
            },
            copy: function () {
            },
            cut: function () {
            },
            drop: function () {
            },
            getStrings: function () {
            },
            getSubtree: function () {
            },
            onDragEnter: a.Event("experimental.bookmarkManager.onDragEnter"),
            onDragLeave: a.Event("experimental.bookmarkManager.onDragLeave"),
            onDrop: a.Event("experimental.bookmarkManager.onDrop"),
            paste: function () {
            },
            sortChildren: function () {
            },
            startDrag: function () {
            }
        },
        clipboard: {
            executeCopy: function () {
            }, executeCut: function () {
            }, executePaste: function () {
            }
        },
        contentSettings: {misc: {blockThirdPartyCookies: {}, enableHyperLinkAuditing: {}, enableReferrers: {}}},
        debugger_: {
            attach: function () {
            },
            detach: function () {
            },
            onDetach: a.Event("chrome.experimental.debugger.onDetach"),
            onEvent: a.Event("chrome.experimental.debugger.onEvent"),
            sendRequest: function () {
            }
        },
        extension: {},
        infobars: {
            show: function () {
            }
        },
        input: {
            sendKeyboardEvent: function () {
            }
        },
        metrics: {
            getEnabled: function () {
            }, recordCount: function () {
            }, recordLongTime: function () {
            }, recordMediumCount: function () {
            }, recordMediumTime: function () {
            }, recordPercentage: function () {
            }, recordSmallCount: function () {
            }, recordTime: function () {
            }, recordUserAction: function () {
            }, recordValue: function () {
            }, setEnabled: function () {
            }
        },
        processes: {
            getProcessIdForTab: function () {
            }, onUpdated: a.Event("chrome.experimental.processes.onUpdated")
        },
        proxy: {onProxyError: a.Event("chrome.experimental.proxy.onProxyError"), settings: {}},
        rlz: {
            clearProductState: function () {
            }, getAccessPointRlz: function () {
            }, recordProductEvent: function () {
            }, sendFinancialPing: function () {
            }
        },
        sidebar: {
            collapse: function () {
            }, expand: function () {
            }, getState: function () {
            }, hide: function () {
            }, navigate: function () {
            }, onStateChanged: a.Event("chrome.experimental.sidebar.onStateChanged"), setBadgeText: function () {
            }, setIcon: function () {
            }, setTitle: function () {
            }, show: function () {
            }
        },
        tts: {
            isSpeaking: function () {
            },
            onSpeak: a.Event("chrome.experimental.tts.onSpeak"),
            onStop: a.Event("chrome.experimental.tts.onStop"),
            speak: function () {
            },
            speakCompleted: function () {
            },
            stop: function () {
            }
        },
        webNavigation: {
            onBeforeNavigate: a.Event("chrome.experimental.webNavigation.onBeforeNavigate"),
            onBeforeRetarget: a.Event("chrome.experimental.webNavigation.onBeforeRetarget"),
            onCommitted: a.Event("chrome.experimental.webNavigation.onCommitted"),
            onCompleted: a.Event("chrome.experimental.webNavigation.onCompleted"),
            onDOMContentLoaded: a.Event("chrome.experimental.webNavigation.onDOMContentLoaded"),
            onErrorOccured: a.Event("chrome.experimental.webNavigation.onErrorOccured")
        },
        webRequest: {
            addEventListener: function () {
            },
            eventHandled: function () {
            },
            onBeforeRedirect: a.WebRequestEvent(),
            onBeforeRequest: a.WebRequestEvent(),
            onBeforeSendHeaders: a.WebRequestEvent(),
            onCompleted: a.WebRequestEvent(),
            onErrorOccurred: a.WebRequestEvent(),
            onHeadersReceived: a.WebRequestEvent(),
            onRequestSent: a.WebRequestEvent()
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (chrome) {
    var sNamespace = "chrome4safari";
    var oManifest;
    var oInfo;

    function getBackgroundPageHandler(event) {
        if (event.name === "canLoad") {
            if (event.message.name === "getBackgroundPage") {
                var backgroundPage = {};
                for (elt in window) {
                    backgroundPage[elt] = typeof window[elt]
                }
                event.message = JSON.stringify(backgroundPage)
            } else {
                if (event.message.name === "getBackgroundPageElement") {
                    if (event.message.elements) {
                        var result_element = window;
                        for (elt in event.message.elements) {
                            result_element = result_element[event.message.elements[elt]]
                        }
                    }
                    if (typeof result_element === "function") {
                        var hop = result_element.apply(window, event.message.args);
                        event.message = JSON.stringify(hop)
                    } else {
                        var backgroundPageElement = {};
                        for (elt in result_element) {
                            backgroundPageElement[elt] = typeof result_element[elt]
                        }
                        event.message = JSON.stringify(backgroundPageElement)
                    }
                } else {
                    if (event.message.name === "getxhr") {
                        var xhr = new XMLHttpRequest();
                        xhr.open(event.message.method, event.message.url, false);
                        xhr.onreadystatechange = function (a) {
                            if ("currentTarget" in a) {
                                a = a.currentTarget
                            }
                            if (xhr.readyState == 4) {
                                data = {
                                    response: a.response,
                                    responseText: a.responseText,
                                    readyStatus: a.readyStatus,
                                    readyState: a.readyState
                                };
                                event.message = JSON.stringify(data)
                            }
                        };
                        xhr.send(null)
                    }
                }
            }
        } else {
            if (event.name === "getxhr") {
                try {
                    var xhr = new XMLHttpRequest();
                    var async = true;
                    xhr.open(event.message.method, event.message.url, async);
                    xhr.onreadystatechange = function (a) {
                        for (var i = 0; i < safari.application.browserWindows.length; i++) {
                            var browserWindow = safari.application.browserWindows[i];
                            for (var j = 0; j < browserWindow.tabs.length; j++) {
                                var tab = browserWindow.tabs[j];
                                if (tab !== undefined && tab.page !== undefined) {
                                    tab.page.dispatchMessage("callback", {
                                        data: {
                                            response: a.response,
                                            responseText: a.responseText,
                                            readyStatus: a.readyStatus,
                                            readyState: a.readyState
                                        }, sender: {}, callbackId: event.message.callbackId
                                    })
                                }
                            }
                        }
                    };
                    xhr.send(null)
                } catch (err) {
                    console.error(err, sURL)
                }
            }
        }
    }

    safari.application.addEventListener("message", getBackgroundPageHandler, true);
    chrome.c4s.extension.fireRequest = function (request, sendResponse) {
        chrome.extension.onRequest.dispatch([request, {}, sendResponse])
    };
    safari.application.addEventListener("message", function (event) {
        if (event.name === "request") {
            chrome.extension.onRequest.dispatch([event.message.data, event.message.sender, function (data) {
                for (var i = 0; i < safari.application.browserWindows.length; i++) {
                    var browserWindow = safari.application.browserWindows[i];
                    for (var j = 0; j < browserWindow.tabs.length; j++) {
                        var tab = browserWindow.tabs[j];
                        if (tab !== undefined && tab.page !== undefined) {
                            tab.page.dispatchMessage("callback", {
                                data: data,
                                sender: {},
                                callbackId: event.message.callbackId
                            })
                        }
                    }
                }
            }])
        } else {
            if (event.name === "function") {
                var tmp = function (request, send, sendResponse) {
                    var fMethod = eval(request.method);
                    request.arguments.push(function () {
                        sendResponse.apply(null, arguments)
                    });
                    fMethod.apply(null, request.arguments || [])
                };
                var oMessage = event.message;
                var oRequest = event.message.data;
                var sCallbackId = event.message.callbackId;
                var oSender = {tab: {id: event.target && event.target.url ? event.target.id : event.message.tabId}};
                var sendResponse = function (dataToSend) {
                    var oResponse = {callbackId: sCallbackId, data: dataToSend};
                    (event.target.tab || event.target.page).dispatchMessage("callback", oResponse)
                };
                tmp(oRequest, oSender, sendResponse)
            }
        }
    }, false);
    chrome.extension = {
        lastError: undefined,
        inIncognitoTab: false,
        inIncognitoContext: false,
        settings: safari.extension.settings,
        getURL: function (path) {
            return safari.extension.baseURI + ((typeof path === "string") ? (path.indexOf("/") === 0 ? path.substr(1) : path) : "")
        },
        getBackgroundPage: function () {
            return safari.extension && safari.extension.globalPage ? safari.extension.globalPage.contentWindow : null
        },
        getExtensionTabs: function () {
        },
        getTabContentses: function () {
        },
        getToolstrips: function () {
        },
        getViews: function () {
        },
        isAllowedFileSchemeAccess: function () {
        },
        isAllowedIncognitoAccess: function () {
        },
        setUpdateUrlData: function () {
        },
        sendRequest: function (request, responseCallback) {
            safari.extension.globalPage.contentWindow.chrome.c4s.extension.fireRequest(request, responseCallback)
        },
        connect: function (port_data) {
            var portUuid = "portUuid" + Math.random();
            safari.self.tab.dispatchMessage("port-create", {name: port_data.name, uuid: portUuid});
            var newPort = {
                name: port_data.name, onMessage: {
                    addListener: function (listener) {
                        safari.self.addEventListener("message", function (messageEvent) {
                            if (messageEvent.name != "port-postMessage") {
                                return
                            }
                            if (messageEvent.message.portUuid != portUuid) {
                                return
                            }
                            listener(messageEvent.message.data)
                        })
                    }
                }, onDisconnect: new chrome.Event("chrome.extension.Port.onDisconnect"), postMessage: function () {
                }
            };
            return newPort
        },
        onConnect: new chrome.Event("chrome.extension.onConnect"),
        onConnectExternal: new chrome.Event("chrome.extension.onConnect"),
        onRequest: new chrome.Event("chrome.extension.onRequest"),
        onRequestExternal: new chrome.Event("chrome.extension.onRequestExternal"),
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.fileBrowserHandler = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.fileBrowserPrivate = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.history = {
        addUrl: function () {
        },
        deleteAll: function () {
        },
        deleteRange: function () {
        },
        deleteUrl: function () {
        },
        getVisits: function () {
        },
        onVisitRemoved: new a.Event("chrome.history.onVisitRemoved"),
        onVisited: new a.Event("chrome.history.onVisited"),
        search: function () {
        }
    }
})(chrome);
(function () {
    var b;
    var e;
    const a = 15 * 1000;
    var d = true;

    function c() {
        b = new Date();
        if (!d) {
            chrome.idle.onStateChanged.dispatch(["active"])
        }
        d = true;
        clearTimeout(e);
        e = setTimeout(function () {
            d = false
        })
    }

    safari.application.addEventListener("validate", c, false);
    chrome.idle = {
        queryState: function (f, g) {
            g(new Date() - b > f ? "idle" : "active")
        }, onStateChanged: new chrome.Event("idle.onStateChanged")
    }
})();
var chrome = window.chrome = window.chrome || {};
(function (b) {
    var d = {};
    var c = b.c4s.extension.getInfo("locale") || safari.extension.settings.getItem("locale") || "en";
    var a = [c];
    a = a.concat((navigator.language.indexOf("-") == -1) ? [navigator.language] : [navigator.language.split("-")[0], navigator.language]);
    a.forEach(function (h) {
        try {
            var e = b.c4s.extension.getJSON(b.extension.getURL("/_locales/" + h + "/messages.json")) || {};
            if (!d) {
                d = e
            } else {
                var f;
                for (f in e) {
                    d[f] = e[f]
                }
            }
        } catch (g) {
        }
    });
    localStorage.setItem("messages", JSON.stringify(d));
    b.i18n = {
        getMessage: function (f, e) {
            return (f in d) && (("placeholders" in d[f]) ? d[f].message.replace(/$([^$]+)$/, d[f].placeholders[RegExp.$1].content.replace(/$([\d])/, e[RegExp.$1])) : d[f].message) || ""
        }, getAcceptLanguages: function (g) {
            var f = navigator.language;
            var e = [f].concat(/-/.test(f) ? f.split("-")[0] : []);
            if (typeof g == "function") {
                g(e)
            }
            return e
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.management = {
        get: function () {
        },
        getAll: function () {
        },
        launchApp: function () {
        },
        onDisabled: new a.Event("chrome.management.onDisabled"),
        onInstalled: new a.Event("chrome.management.onInstalled"),
        onUninstalled: new a.Event("chrome.management.onUninstalled"),
        setEnabled: function () {
        },
        uninstall: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.omnibox = {
        onInputCancelled: new a.Event("chrome.omnibox.onInputCancelled"),
        onInputChanged: new a.Event("chrome.omnibox.onInputChanged"),
        onInputEntered: new a.Event("chrome.omnibox.onInputEntered"),
        onInputStarted: new a.Event("chrome.omnibox.onInputStarted"),
        sendSuggestions: function () {
        },
        setDefaultSuggestion: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.pageAction = {
        hide: function () {
        }, onClicked: a.Event("chrome.pageAction.onClicked"), setIcon: function () {
        }, setPopup: function () {
        }, setTitle: function () {
        }, show: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.pageActions = {
        disableForTab: function () {
        }, enableForTab: function () {
        }
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.searchBox = {
        height: "-",
        oncancel: null,
        onchange: null,
        onresize: null,
        onsubmit: null,
        selectionEnd: "-",
        selectionStart: "-",
        setSuggestions: function (b) {
        },
        value: "-",
        verbatim: "-",
        width: "-",
        x: "-",
        y: "-"
    }
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.self = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.test = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.toolstrip = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    a.webstorePrivate = {}
})(chrome);
var chrome = window.chrome = window.chrome || {};
(function (a) {
    var b = {};
    a.windows = {
        WINDOW_ID_NONE: -1,
        create: function (d, e) {
            var c = safari.application.openBrowserWindow();
            if (d.url) {
                c.tabs[0].url = d.url
            }
            e && e(a.c4s.windows.transform(c))
        },
        get: function (c, d) {
            d && d(a.c4s.windows.transform(a.c4s.windows.getWindow(c)))
        },
        getAll: function (c, f) {
            var d = 0, e;
            e = safari.application.browserWindows.map(function (g) {
                return a.c4s.windows.transform(g)
            });
            if (c && c.populate) {
                e.forEach(function (g) {
                    a.tabs.getAllInWindow(g.id, (function (h) {
                        return function (i) {
                            h.tabs = i;
                            if (++d == e.length) {
                                f(e)
                            }
                        }
                    })(g))
                })
            }
            if (!c.populate) {
                f && f(e)
            }
        },
        getCurrent: function (c) {
            c && c(a.c4s.windows.transform(safari.application.activeBrowserWindow))
        },
        getLastFocused: function (c) {
            c && c(a.c4s.windows.transform(safari.application.activeBrowserWindow))
        },
        remove: function (c, d) {
            a.c4s.windows.getWindow(c).close();
            d && d()
        },
        update: function (c, d, e) {
            console.warn("chrome.window.update:not implemented");
            e && e()
        },
        onCreated: new a.Event("chrome.windows.onCreated"),
        onFocusChanged: new a.Event("chrome.windows.onFocusChanged"),
        onRemoved: new a.Event("chrome.windows.onRemoved")
    }
})(chrome);
if (safari.application) {
    function getURL(a) {
        return /^[\w-]+:/.test(a) ? a : chrome.extension.getURL(a)
    }

    const Notification = function Notification(a) {
        this._info = a;
        this._info.id = Math.random();
        this._info.name = ""
    };
    Notification.prototype = {
        show: function () {
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("notification", {
                method: "show",
                arguments: [this._info]
            })
        }, cancel: function () {
            safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("notification", {
                method: "cancel",
                arguments: [this._info]
            })
        }
    };
    webkitNotifications = {
        checkPermission: function () {
            return true
        }, createHTMLNotification: function (a) {
            return new Notification({url: getURL(a)})
        }, createNotification: function (a, c, b) {
            return new Notification({icon: getURL(a), title: c, text: b})
        }
    }
} else {
}
;