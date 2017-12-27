/**
 * 日期相关的工具函数
 *
 * A collection of useful static methods to deal with date.
 * @singleton
 */
define(function(require, exports, module) {

    // 一周，从周日开始
    var WEEK1 = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    var WEEK2 = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

    // 月，闰年2月29天
    var MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    var sTermInfo = [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];

    // 阳历节日
    var SOLAR_FESTIVAL = {
        '0101': '元旦',
        // '0405': '清明',
        '0501': '五一',
        '1001': '国庆'
    }
        //农历节日
    var LUNAR_FESTIVAL = {
        '0100': '除夕',
        '0101': '春节',
        '0505': '端午',
        '0815': '中秋'
    }

    // 2014-11-09 
    var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}/

    /*
     * 补齐数字位数
     * @param {number|string} n 需要补齐的数字
     * @return {string} 补齐两位后的字符
     */
    function getTwoBit(n) {
        return (n > 9 ? '' : '0') + n
    }

    /*
     * 返回某年的第n个节气为几日(从0小寒起算)
     * @param {number|string} n 需要补齐的数字
     * @return {string} 补齐两位后的字符
     */    
    function getTerm(y, n) {
        var offDate = new Date((31556925974.7 * (y - 1900) + sTermInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5))
        return (offDate.getUTCDate())
    }

    /*
     * 设置当年清明节
     */
    function setQingming(year) {
        var day = getTerm(year, 6)
        var str = '040' + day
        // 先清掉可能清明节存在的三天
        delete SOLAR_FESTIVAL['0404']
        delete SOLAR_FESTIVAL['0405']
        delete SOLAR_FESTIVAL['0406']        
        SOLAR_FESTIVAL[str] = '清明'
    }

    /*
     * 农历数据表
     * lunarInfo
     * 从 1900 - 2100，16 进制前 12 表示对应年份 12 个月的大小，大月为 1，小月为 0
     * 最后4位表示是否闰年闰哪个月，或下一年闰的月是大月还是小月，仅当为 0xf 时表示大月
     */
    var LUNAR_INFO = [
        0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0,
        0x55d2, 0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd295, 0xb54f, 0xd6a0, 0xada2,
        0x95b0, 0x4977, 0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f,
        0x9570, 0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60,
        0x86e3, 0x92ef, 0xc8d7, 0xc95f, 0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4,
        0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557, 0x6ca0, 0xb550, 0x5355, 0x4daf,
        0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60,
        0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0, 0x96d0, 0x4dd5,
        0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6, 0x95bf,
        0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570,
        0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5,
        0x92e0, 0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0,
        0x92d0, 0xcab5, 0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0,
        0x5176, 0x52bf, 0xa930, 0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6,
        0xa4e0, 0xd260, 0xea65, 0xd530, 0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0,
        0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45, 0xb5a0, 0x56d0, 0x55b2, 0x49b0,
        0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0, 0x4b63, 0x937f, 0x49f8,
        0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef, 0x92e0, 0xd2e3,
        0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4, 0x52d0,
        0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0,
        0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4,
        0xd260, 0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0,
        0xd150, 0xf252, 0xd520
    ]

    /*
     * 日期字符串转成Date对象
     * @param {String} str
     *   "2014-12-31"
     *   "2014/12/31"
     * @return {Date}
     */
    function str2Date(str) {
        if (reDate.test(str)) {
            str = str.replace(/-/g, '/')
        }
        return new Date(str)
    }

    /*
     * 日期对象转成字符串
     * @param {Date} new Date()
     * @return {string} "2014-12-31"
     */
    function date2Str(date, split) {
        if (typeof date == 'string') return date
        split = split || '-'
        var y = date.getFullYear()
        var m = getTwoBit(date.getMonth() + 1)
        var d = getTwoBit(date.getDate())
        return [y, m, d].join(split)
    }

    /*
     * 返回日期格式字符串
     * @param {Number} 0返回今天的日期、1返回明天的日期，2返回后天得日期，依次类推
     * @return {string} '2014-12-31'
     */
    function getDay(i) {
        i = i || 0
        var date = new Date
        var diff = i * (1000 * 60 * 60 * 24)
        date = new Date(date.getTime() + diff)
        return date2Str(date)
    }

    /*
     * 返回明天日期字符串
     * @param  {String} '2014-12-30'
     * @return {String} '2014-12-31'
     */
    function getAfterDay(str) {
        var curr = str2Date(str)
        var next = curr.getTime() + (1000 * 60 * 60 * 24)
        next = new Date(next)
        return date2Str(next)
    }

    /*
     * 根据Date对象获取周几
     * @param date {Date|String} 如 '2014-12-22'
     * @return '周一' 或 '星期一'
     */
    function getWeekByDate(date, isFormal) {
        var obj = null
        if (typeof date == 'string') {
            obj = str2Date(date)
        } else if (date instanceof Date) {
            obj = date
        }
        var num = obj.getDay()
        return isFormal ? WEEK2[num] : WEEK1[num]
    }

    /*
     * 比较两个时间字符串，比如 compareDate('2014-05-18', '2014-05-10') 返回false
     * 1 hotel 入住时间不能大于退房时间
     * 2 dujia 搜索页 开始时间不能大于结束时间
     */
    function compareDate(date1, date2) {
        var a1 = date1.split('-')
        var a2 = date2.split('-')
            // year
        if (a1[0] > a2[0]) {
            return false
        } else if (a1[0] < a2[0]) {
            return true
        }
        // month
        if (a1[1] > a2[1]) {
            return false
        } else if (a1[1] < a2[1]) {
            return true
        }
        // day
        if (a1[2] > a2[2]) return false
        return true
    }

    /*
     * 判断是否闰年
     * @param {number} year 年
     * @return {boolean}
     */
    function isLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
    }

    /*
     * 获取节日或节气信息
     * @param {Date} date 阳历日期对象
     * @return {String} 节日或节气信息
     */
    function getFestival(date) {
        var lunar = getLunarInfo(date)
        return getLunarFestival(lunar) || getSolarFestival(date)
    }

    /*
     * 获取阳历节日
     * @param {Date} date 阳历日期对象
     * @return {Object} 阳历节日
     */
    function getSolarFestival(date) {
        setQingming(date.getFullYear())
        var text = SOLAR_FESTIVAL[getTwoBit(date.getMonth() + 1) + getTwoBit(date.getDate())]
        return text ? text : null
    }

    /*
     * 获取农历节日
     * @param {Object} lunar 农历日期信息
     * @return {Object} 农历节日
     */
    function getLunarFestival(lunar) {
        // 处理除夕
        if (lunar.month == 11 && lunar.day > 28) {
            var next = new Date(lunar.solar.getTime() + 1000 * 60 * 60 * 24)
            next = getLunarInfo(next)
            if (next.day === 1) {
                lunar.month = 0
                lunar.day = 0
            }
        }
        var text = lunar.leap ? '' : LUNAR_FESTIVAL[getTwoBit(lunar.month + 1) + getTwoBit(lunar.day)] || ''

        return text ? text : null
    }

    /*
     * 获取阳历对应的农历信息
     * @param {Date} date 阳历日期对象
     * @return {Object} 农历信息
     */
    function getLunarInfo(date) {
        var i = 0
        var leap = 0
        var temp = 0
        var offset = (
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900, 0, 31)
        ) / 86400000

        for (i = 1900; i < 2100 && offset > 0; i++) {
            temp = lYearDays(i)
            offset -= temp
        }
        if (offset < 0) {
            offset += temp
            i--
        }

        var year = i
        leap = leapMonth(i) //闰哪个月
        var isLeap = false
        for (i = 1; i < 13 && offset > 0; i++) {
            // 闰月
            if (leap > 0 && i === leap + 1 && !isLeap) {
                --i
                isLeap = true
                temp = leapDays(year)
            } else {
                temp = monthDays(year, i)
            }
            // 解除闰月
            if (isLeap && i === leap + 1) {
                isLeap = false
            }
            offset -= temp
        }
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false
            } else {
                isLeap = true
                    --i
            }
        }
        if (offset < 0) {
            offset += temp
                --i
        }
        return {
            year: year,
            month: i - 1,
            day: offset + 1,
            leap: isLeap,
            solar: date
        }
    }

    /*
     * 返回农历 y 年的总天数
     * @param {Number} y 年份
     * @return {Number} y 年的总天数
     */
    function lYearDays(y) {
        var days = 348 + (LUNAR_INFO[y - 1900] >> 4).toString(2).replace(/0/g, '').length
        return days + leapDays(y)
    }

    /*
     * 返回农历 y 年闰月的天数
     * @param {Number} y 年份
     * @return {Number} 闰月的天数（大月30，小月29，无闰月0）
     */
    function leapDays(y) {
        return leapMonth(y) ? (LUNAR_INFO[y - 1899] & 0xf) === 0xf ? 30 : 29 : 0
    }

    /*
     * 返回农历 y 年闰哪个月 1-12 , 没闰返回 0**
     * @param {Number} y 年份
     * @return {Number} 闰月月份，0为不闰
     */
    function leapMonth(y) {
        var lm = LUNAR_INFO[y - 1900] & 0xf
        return lm === 0xf ? 0 : lm
    }

    /*
     * 返回农历 y 年 m 月的总天数
     * @param {Number} y 年份
     * @param {Number} m 月份
     * @return {Number} 农历 y 年 m 月的天数（大月30，小月29）
     */
    function monthDays(y, m) {
        return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29
    }

    /*
     * 格式化日期对象为字符串类型
     * @param {Date}
     * @param {Boolean} 是否带上 “星期几”
     * @return {String} "2014-11-25" or "2014-11-25 星期二"
     */
    function format(date, hasDay, week) {
        var arr, m, d, day
        if (typeof date === 'string') {
            date = str2Date(date)
        }
        var mo = getTwoBit(date.getMonth() + 1)
        var da = getTwoBit(date.getDate())
        var str = date.getFullYear() + '-' + mo + '-' + da
        if (hasDay) {
            day = week[date.getDay()]
            str += ' ' + day
        }
        return str
    }

    return {
        week: WEEK1,
        month: MONTH,
        format: format,
        str2Date: str2Date,
        date2Str: date2Str,
        getDay: getDay,
        getAfterDay: getAfterDay,
        getWeekByDate: getWeekByDate,
        compareDate: compareDate,
        getTwoBit: getTwoBit,
        isLeapYear: isLeapYear,
        getFestival: getFestival
    }

});