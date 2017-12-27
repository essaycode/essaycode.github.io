/*
 *  判断 是否是...
 */
define(function(require, exports, module) {

    var is = {};
    var toString = is.toString;
    var types = ['Object', 'String', 'Number', 'Boolean', 'Date']

    // 正则表达式变量
    var reChinese = /^[\u4e00-\u9fa5]+$/
    var reChineseName = /^[\u0026\u0023\u0031\u0038\u0033\u003b\u002e\u2022a-zA-Z\u4e00-\u9fa5]{1,15}$/
    var reIdCard = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
    var reOtherCard = /^[a-zA-Z0-9]{1,30}$/
    var reDate = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/
    var reMobile = /^(13|18|15|17|19)\d{9}$/
    var reTel = /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/
    var reEmail = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
    var reUrl = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i


    // 检查日期的是否合法
    function checkDate(year, month, day) {
        month--; // 月份需要减1
        var d = new Date(year, month, day);
        return year === d.getFullYear() && month === d.getMonth() && day === d.getDate();
    }

    // 身份证验证
    function is18IdCard(str) {
        var year = +str.substring(6, 10);
        var month = +str.substring(10, 12);
        var day = +str.substring(12, 14);

        return checkDate(year, month, day);
    }

    // isArray, isBoolean, ...
    $.each(types, function(index, name) {
        is['is' + name] = function(obj) {
            if (obj === undefined || obj === null) return false
            return toString.call(obj) === '[object ' + name + ']'
        }
    })

    // 是否是 JS 基本类型数据
    is.isPrimitive = function(obj) {
        var a = typeof obj
        return !!(obj === undefined || obj === null || a === 'boolean' || a === 'number' || a === 'string')
    }

    // 验证是否是整数的字符串
    is.isDigit = function(str) {
        return str === parseInt(str).toString()
    }

    // 是否是数字的字符串
    is.isNumericality = function(str) {
        str = Number(str)
        if ( !isFinite(str) ) {
            return false;
        }
        return true;
    }

    // 数组或字符串是否为空
    is.isEmpty = function(obj) {
        if (obj == null) return true
        if ($.isArray(obj) || is.isString(obj)) return obj.length === 0
        for (var key in obj) return false
        return true
    }

    // 是否具有length属性
    is.isArrayLike = function(obj) {
        return obj.length === +obj.length && !is.isString(obj)
    }

    is.isWindow = function(obj) {
        return obj != null && obj === obj.window
    }

    is.isDocument = function(obj) {
        return obj != null && obj.nodeType === obj.DOCUMENT_NODE
    }

    is.isElement = function(obj) {
        return obj ? obj.nodeType === 1 : false
    }

    is.isTextNode = function(obj) {
        return obj ? obj.nodeName === "#text" : false
    }

    is.isURL = function(str) {
        return reUrl.test(str)
    }

    is.isEmail = function(str) {
        return reEmail.test(str)
    }

    is.isChinese = function(str) {
        return reChinese.test(str)
    }

    is.isChineseName = function(str) {
        return reChineseName.test(str)
    }
    
    // 验证是否是身份证
    // 只支持18位身份证情况，不考虑15位身份证
    is.isIdCard = function(str) {
        if (!reIdCard.test(str)) {
            return false;
        }

        return is18IdCard(str);
    }

    is.isOtherCard = function(str) {
        return reOtherCard.test(str)
    }

    // 验证是否是日期
    // 支持 8 种类型的日期
    // 20120409 | 2012-04-09 | 2012/04/09 | 2012.04.09 | 以上各种无 0 的状况
    is.isDate = function(str) {
        var taste, d, year, month, day;

        if (!reDate.test(str)) {
            return false;
        }

        // 验证例如2015-02-31这种情况，因为2月无31号，会自动变成3月，所以比对即可
        taste = reDate.exec(str);
        year = +taste[1];
        month = +taste[3];
        day = +taste[5];

        return checkDate(year, month, day);
    }

    // 验证手机号，支持13|18|15|17这4种情况
    is.isMobile = function(str) {
        return reMobile.test(str);
    }

    // 验证座机
    // 仅中国座机支持；区号可有 3、4位数并且以0开头；电话号不以0开头，最多8位数，最少7位数
    // 但 400/800 除头开外，适应电话，电话本身是7位数
    // 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
    is.isTel = function(str) {
        return reTel.test(str)
    }    

    // 验证数据长度
    // 采用闭区间，长度可以等于min或者max
    is.checkLen = function(str, min, max) {
        var len = str.length;

        if (typeof min !== 'undefined') {
            if (len < min) {
                return false;
            }
        }

        if (typeof max !== 'undefined') {
            if (len > max) {
                return false;
            }
        }

        return true;
    }

    // 检查年龄是否在传入日期范围
    // 参数为开始日期、年龄、结束日期
    // 其中结束日期默认为当前
    // 参数日期都是Date类型
    is.checkAge = function(startDate, age, endDate) {
        endDate || (endDate = new Date());
        var yearGap = endDate.getFullYear() - startDate.getFullYear();
        if (yearGap >= age) {
            if (yearGap > age) {
                return true;
            } else {
                var monthGap = endDate.getMonth() - startDate.getMonth();
                if (monthGap >= 0) {
                    if (monthGap > 0) {
                        return true;
                    } else {
                        var dateGap = endDate.getDate() - startDate.getDate();
                        if (dateGap >= 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    };

    return is;

});