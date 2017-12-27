define(function(require, exports, module) {

    var px = 'px'
    var empty = []
    var slice = empty.slice

    // root dom
    var win = window
    var doc = win.document
    var body = doc.body
    var docElem = doc.documentElement
    var $win = $(win)
    var $doc = $(doc)

    // global
    var popui = $.popui = {}

    /*
     * 获取浏览器窗口的可视尺寸
     */
    $.getViewSize = function() {
        return {
            width: win['innerWidth'] || docElem.clientWidth,
            height: win['innerHeight'] || docElem.clientHeight
        }
    }

    /*
     * 获取浏览器窗口的实际尺寸，包含滚动条
     */
    $.getRealView = function() {
        return {
            width: Math.max(docElem.clientWidth, body.scrollWidth, docElem.scrollWidth),
            height: Math.max(docElem.clientHeight, body.scrollHeight, docElem.scrollHeight)
        }
    }

    /*
     * 判断一个元素是否显示在视图窗口指定位置
     * **参数（API）**
     * @param space  {int|0} 滚动差值，距离元素上方
     * **返回函数 **
     * @aboveOrPortion:元素是否在视图窗口中或之上, portion:元素是否部分在视图窗口中, entire:不传指整个元素是否在视图窗口中
     */

    $.isInViewport = function(elem, space) {
        var outerHeight = $(elem).outerHeight();
        var scrollTop = $doc.scrollTop();
        var winHeight = $win.height();
        var offsetTop = null;
        var overlap = {
            aboveOrPortion: function() {
                offsetTop = $(elem).offset().top;
                return (offsetTop > 0 && offsetTop < (scrollTop + winHeight + space));
            },
            portion: function(space) {
                space = space || 0;
                offsetTop = $(elem).offset().top;
                return (offsetTop > 0 && offsetTop < (scrollTop + winHeight + space) && offsetTop > (scrollTop - outerHeight));
            },
            entire: function() {
                var rect = elem.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (win.innerHeight || docElem.clientHeight) &&
                    rect.right <= (win.innerWidth || docElem.clientWidth)
                )
            }
        };
        return overlap;
    }

    /*
     * 浏览器判断对象
     *
     * 示例
     *   $.ie, $.ie6, $.ie7, $.ie8, $.ie9, $.ie10
     *   $.firefox
     *   $.chrome
     *   $.safari
     *   $.opera
     *   $.sogou
     */
    var browser = function(ua) {
        var brow = {
            sogou: /se/.test(ua),
            opera: /opera/.test(ua),
            chrome: /chrome/.test(ua),
            firefox: /firefox/.test(ua),
            maxthon: /maxthon/.test(ua),
            tt: /TencentTraveler/.test(ua),
            ie: /msie/.test(ua) && !/opera/.test(ua),
            safari: /webkit/.test(ua) && !/chrome/.test(ua)
        }
        var mark = ''
        for (var i in brow) {
            if (brow[i]) {
                mark = 'safari' == i ? 'version' : i
                break
            }
        }
        var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
        brow.version = mark && reg.test(ua) ? RegExp.$1 : '0'

        var iv = parseInt(brow.version, 10)
        for (var i = 6; i < 11; i++) {
            brow['ie' + i] = iv === i
        }
        return brow
    }(navigator.userAgent.toLowerCase())

    // exports to $
    $.extend($, browser)

    function delay(func, wait) {
        var args = slice.call(arguments, 2)
        return setTimeout(function() {
            return func.apply(null, args)
        }, wait)
    }

    $.dalay = delay

    /*
     * 函数节流，控制间隔时间
     */
    $.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result
        var later = function() {
            var last = $.now() - timestamp
            if (last < wait && last > 0) {
                timeout = delay(later, wait - last)
            } else {
                timeout = null
                if (!immediate) {
                    result = func.apply(context, args)
                    context = args = null
                }
            }
        }
        return function() {
            context = this
            args = arguments
            timestamp = $.now()
            var callNow = immediate && !timeout
            if (!timeout) timeout = delay(later, wait)
            if (callNow) {
                result = func.apply(context, args)
                context = args = null
            }

            return result
        }
    }

    /*
     * 函数节流，控制执行频率
     */
    $.throttle = function(func, wait, options) {
        var context, args, result
        var timeout = null
        var previous = 0
        if (!options) options = {}
        var later = function() {
            previous = options.leading === false ? 0 : $.now()
            timeout = null
            result = func.apply(context, args)
            context = args = null
        }
        return function() {
            var now = $.now()
            if (!previous && options.leading === false) {
                previous = now
            }
            var remaining = wait - (now - previous)
            context = this
            args = arguments
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout)
                timeout = null
                previous = now
                result = func.apply(context, args)
                context = args = null
            } else if (!timeout && options.trailing !== false) {
                timeout = delay(later, remaining)
            }
            return result
        }
    }

    /*
     * 解析URL各部分的通用方法
     */
    $.parseURL = function(url) {
        var a = document.createElement('a')
        a.href = url
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var s, ret = {}
                var seg = a.search.replace(/^\?/, '').split('&')
                var len = seg.length
                for (var i = 0; i < len; i++) {
                    if (!seg[i]) continue
                    s = seg[i].split('=')
                    ret[s[0]] = s[1]
                }
                return ret
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        }
    }

    /*
     * HTTP请求，POST方式提交，返回JSON格式
     *
     *  **参数**
     *   url     {string} 请求地址
     *   data    {string/object} 参数
     *   success {function} 成功的回调函数
     */
    $.postJSON = function(url, data, success) {
        return $.ajax({
            type: 'POST',
            dataType: 'json',
            url: url,
            data: data,
            success: success
        })
    }

    /*
     * 让任意元素水平居中
     */
    $.fn.center = function(option, callback) {
        var setting = $.extend({}, option)
        var position = setting.position || 'fixed'

        function fixIE6($el) {
            $el[0].style.position = 'absolute'
            $win.scroll(function() {
                move($el)
            })
        }

        function move($that) {
            var that = $that[0]
            var size = $.getViewSize()
            var x = (size.width) / 2 - (that.clientWidth) / 2
            var y = (size.height) / 2 - (that.clientHeight) / 2
            if ($.ie6) {
                var scrollTop = docElem.scrollTop || body.scrollTop
                y += scrollTop
            }
            $that.css({
                top: y + px,
                left: x + px
            })
        }

        function init($that, option) {
            $that.css({
                    position: position
                }).show()
                // ie6 don't support position 'fixed'
            if (position === 'fixed' && $.ie6) {
                fixIE6($that)
            }
            move($that)
        }
        return this.each(function() {
            var $that = $(this)
            init($that, option)
            if (callback) callback($that)
        })
    }

    /*
     * 获取POPUI的组件对象，为一个jq对象
     */
    $.fn.getPopUI = function(name) {
        return this.data(name)
    }

    /*
     * 返回主机名
     */
    $.getHost = function() {
        return '//' + location.host + '/'
    }

    /*
     * 将光标焦点置入输入域
     */
    $.fn.focusing = function() {
        return this.each(function() {
            var $el = $(this)
            if ($el.is('input') || $el.is('textarea')) {
                delay(function() {
                    $el[0].focus()
                }, 100)
            }
        })
    }

    /*
     * 解析data-ui的属性值
     */
    $.uiParse = function(action) {
        var arr = action.split('|').slice(1)
        var len = arr.length
        var res = [],
            exs
        var boo = /^(true|false)$/
        for (var i = 0; i < len; i++) {
            var item = arr[i]
            if (item == '&') {
                item = undefined
            } else if (exs = item.match(boo)) {
                item = exs[0] == 'true' ? true : false
            }
            res[i] = item
        }
        return res
    }

    /*
     * 删除指定DOM元素的所有子元素的事件，做组件销毁时有用
     * 注意：性能问题，慎重使用，对于子元素的数量调用者需心中有底
     *
     * **参数**
     *  containSelf {boolean} 是否包含容器自身
     */
    $.fn.unbindAll = function(containSelf) {
        this.each(function() {
            var $container = $(this)
            if (containSelf) {
                $container.unbind()
            }
            $container.find('*').unbind()
        })
    }

    /*
     *  页面滚动到达元素位置时触发，比如楼层 HTML/CSS/JS/IMG 资源懒加载
     *
     * **参数**
     *  callback($el) 到达元素位置时触发回调函数
     *  diff 偏移位置，比如离元素还有 100px 时触发，可以设为 100，提前触发回调，可选，默认为 0
     *  throttle 事件节流时间间隔，默认为20，可选，多数时候可不设
     */
    $.fn.arrive = function(callback, diff, throttle) {
        var diff = diff || 0
        var wait = throttle || 20
        return this.each(function() {
            var overlap = $.isInViewport(this, diff)
            var scrollFn = function() {
                if (overlap.aboveOrPortion()) {
                    $win.unbind('scroll.arrive', scrollFn)
                    callback($el)
                }
            }
            scrollFn = $.throttle(scrollFn, wait)
            $win.bind('scroll.arrive', scrollFn)
        })
    }

});