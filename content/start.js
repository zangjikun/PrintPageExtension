var oSelection;
var $hidden = $([]);
function restorePage() {
    oSelection && oSelection.destroy();
    oSelection = null;
    $hidden.show();
    $(document.documentElement).removeAttr("data-sf-selected-mode");
    document.body.scrollTop = scrollTop
}
var scrollTop = 0;
chrome.extension.onRequest.addListener(function (e, d, a) {
    const f = 100;
    if (e.command) {
        switch (e.command) {
            case"ping":
                a();
                break;
            case"select":
                scrollTop = document.body.scrollTop;
                if (!oSelection) {
                    a()
                }
                var c = $(oSelection.get());
                c.each(function () {
                    $(this).css({width: $(this).width(), height: $(this).height()})
                });
                $hidden = c.siblings().add(c.parents().siblings()).filter(":visible").hide();
                c.show().parents().show();
                c.siblings().attr("data-sf-selected-rel", "sibling");
                c.parents().attr("data-sf-selected-rel", "parent");
                c.attr("data-sf-selected-rel", "selected");
                oSelection && oSelection.stop();
                setTimeout(function () {
                    var g = c.get().map(function (h) {
                        var i = h.getBoundingClientRect();
                        return {
                            top: window.scrollY + i.top,
                            bottom: window.scrollY + i.bottom,
                            height: i.height,
                            left: window.scrollX + i.left,
                            right: window.scrollX + i.right,
                            width: i.width
                        };
                        return {
                            right: h.offsetLeft + h.offsetWidth,
                            bottom: h.offsetTop + h.offsetHeight,
                            left: h.offsetLeft,
                            top: h.offsetTop
                        }
                    });
                    a({
                        css: c.domselector().simplify(document).toCSS().trim(),
                        selections: g,
                        document: {width: document.width, height: document.height},
                        window: {height: window.innerHeight, width: window.innerWidth}
                    })
                }, 0);
                break;
            case"scroll":
                document.body.scrollTop += window.innerHeight;
                setTimeout(function () {
                    a({top: document.body.scrollTop, bottom: document.body.scrollTop + window.innerHeight})
                }, f);
                break;
            case"print":
                addEventListener("focus", function b(g) {
                    removeEventListener("focus", b, false);
                    setTimeout(a, 0)
                }, false);
                print();
                a();
                break;
            case"stop":
                restorePage();
                a();
                break;
            case"start":
                oSelection = new Sf.Classes.Selection(window);
                oSelection.start();
                a();
                break
        }
    }
});
var contentLoaded = true;