/**
 * 字符串相关操作
 *
 * A collection of useful static methods to deal with objects.
 * @singleton
 */
define(function(require, exports, module) {

    var ZO = require('./../base/object')
    var reFormat = /\{(\d+)\}/g
    var reNum = /^\d+$/
    var regCH = /[\u4E00-\u9FA5]+/g
    var reScript = /<script[^>]*>([\s\S]*?)<\/script>/gi
    var reTrim = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        }
    }
    entityMap.unescape = ZO.invert(entityMap.escape)

    var entityReg = {
        escape: RegExp('[' + ZO.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + ZO.keys(entityMap.unescape).join('|') + ')', 'g')
    }

    function escape(html) {
        if (typeof html !== 'string') return ''
        return html.replace(entityReg.escape, function(match) {
            return entityMap.escape[match]
        })
    }

    function unescape(str) {
        if (typeof str !== 'string') return ''
        return str.replace(entityReg.unescape, function(match) {
            return entityMap.unescape[match]
        })
    }

    /*
     * URL里的中文都encodeURIComponent下，IE低版本有时出现乱码
     * 
     * 如 http://dujia.jd.com/search?country=中国&name=冯军
     * 输出 http://dujia.jd.com/search?country=%E4%B8%AD%E5%9B%BD&name=%E5%86%AF%E5%86%9B
     */
    function encodeChinese(str) {
        var result = str.match(regCH)
        if (!result) return
        var i = 0
        var j = 0
        var len = result.length
        var chanst = []
        if (result && len) {
            while (i < len) {
                var res = result[i]
                var enc = encodeURIComponent(res)
                str = str.replace(res, enc)
                i++
            }
        }
        return str
    }


    return {
        escape: escape,
        unescape: unescape,
        trim: function(str) {
            return str.replace(reTrim, '')
        },
        isNumber: function(str) {
            return reNum.test(str)
        },
        toInt: function(str, base) {
            if (this.isNumberStr(str)) {
                return parseInt(str, base || 10)
            }
            $.error('not a number')
        },
        toFloat: function(str) {
            if (this.isNumberStr(str)) {
                return parseFloat(str)
            }
            $.error('not a number')
        },
        startsWith: function(str, prefix) {
            return str.lastIndexOf(prefix, 0) == 0;
        },
        endsWith: function(str, suffix) {
            var l = str.length - suffix.length;
            return l >= 0 && str.indexOf(suffix, l) == l;
        },
        urlAppend: function(url, str) {
            if (typeof str === 'string' && str.length) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + str
            }
            return url
        },
        stripScript: function(str) {
            return str.replace(reScript, function() {
                return ''
            })
        },
        ellipsis: function(val, len, word) {
            if (val && val.length > len) {
                if (word) {
                    var vs = val.substr(0, len - 2)
                    var i = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'))
                    if (i !== -1 && i >= (len - 15)) {
                        return vs.substr(0, i) + '...'
                    }
                }
                return val.substr(0, len - 3) + '...'
            }
            return val
        },
        format: function(str) {
            var args = sliceArgs(arguments, 1)
            return str.replace(reFormat, function(m, i) {
                return args[i]
            })
        },
        encodeChinese: encodeChinese
    }

});