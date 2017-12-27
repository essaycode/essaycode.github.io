/**
 * @type 通用组件
 * @name calendar
 * @cname 基本日历组件
 * @author 杨磊
 * @dong yanglei95
 *
 * **参数**
 *
 * @param startDate    {string|null} 起始日期，此前的日期不可点
 * @param endDate      {string|null} 结束日期，此后的日期不可点
 * @param choseDate    {string|当天} 当前高亮显示的日期
 * @param currCls      {string}   指定当前li的className
 * @param showDay      {boolean|false}  是否在输入框显示星期几，如“周四”
 * @param showFestival {boolean|true}  是否显示节假日
 * @param fillInputVal {boolean}  是否自动回填input的值
 * @param diffX        {number}   距离输入框X轴的位置调整
 * @param diffY        {number}   距离输入框Y轴的位置调整
 * @param fixScroll    {string}   (undefined|fix|hide) 滚动条滚动时处理方式，可选。默认不处理，fix自动调整位置，hide则隐藏
 * @param onChoose     {function} 选中后触发，包括点击选中和enter
 * @param multipleZones{Array}    指定多区间可选 [{'startTime': '2017-07-28', 'endTime': '2017-09-28'},{'startTime': '2017-10-02', 'endTime': '2018-02-28'}]"
 * @param hmsFormat    {String}   配置时分秒，当参数配置后，则会显示时分秒的配置，并根据格式化字符串来输出
 * 
 * @example 
 * $(selector).calendar({
 *      startDate: '2016-01-10',
 *      endDate: '2017-04-20',
 *      diffX: 50
 * })
 * @event showCal    手动调用该方法来显示日历（用在非点击输入框INPUT时弹出日历）
 *
 * **更新日志**
 *  2015.5.6 单日历闰年判断bug，1972年出现的天都是29天
 *
 **/
define(function(require, exports, module) {
    require('./../../css/calendar/calendar.css')
    require('./../root/root.js')
    var dateUtil = require('./../base/date.js')

    var now = new Date()
        // 一周，从周日开始
    var week = dateUtil.week
        // 月，闰年2月29天
    var months = dateUtil.month
        // 补齐数字位数
    var getTwoBit = dateUtil.getTwoBit
        // 日期字符串转成Date对象
    var date2Str = dateUtil.date2Str
        // 日期对象转成字符串
    var str2Date = dateUtil.str2Date
        // 判断是否闰年
    var isLeapYear = dateUtil.isLeapYear
        // 获取节日或节气信息
    var getFestival = dateUtil.getFestival
        // 格式化日期
    var format = dateUtil.format
        // 2014-11-09
    var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}/

    // common dom
    var $win = $(window)
    var $doc = $(document)
    var $body = $('body')

    // 设置日历的位置
    function setPosition($div, $input, diffX, diffY) {
        var posi = $input.offset()
        var outerHeight = $input.outerHeight()
        var left = (diffX ? diffX : 0) + posi.left
        var top = (diffY ? diffY : 0) + posi.top + outerHeight
        $div.css({
            position: 'absolute',
            left: left,
            top: top
        })
    }

    // 获取当前被选择的日期
    function getChoseDate($input, setting) {
        var val = $input.val()
        var res = reDate.exec(val)
            // 点击时弹出日历
        var choseDate = setting.choseDate
            // 输入框有值时以该值为选择值，否则以当天改默认选择值
        if (res) {
            choseDate = res[0]
        }
        // 初始化日历被选定天
        if (reDate.test(choseDate)) {
            choseDate = str2Date(choseDate)
        }
        return choseDate
    }
    /**
     * 是否为闫年
     * @return {Boolse} true|false
     */
    function isLeapYear(y) {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    }

    /**
     * 返回月份天数
     * @return {Number}
     */
    function getMonthDays(year, month) {
        if (/^0/.test(month)) {
            month = month.split('')[1];
        }
        return [0, 31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    /**
     * 对数据进行排序
     **/
    function sortBy(param) {
        return function(o, p) {
            var a;
            var b;
            o = date2Str(o);
            p = date2Str(p);
            if (typeof o === 'string' && typeof p === 'string' && o && p) {
                a = parseInt(o.replace(/-/g, ''), 10);
                b = parseInt(p.replace(/-/g, ''), 10);
                if (a === b) {
                    return 0;
                }

                if (param === 'asc') {
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                } else if (param === 'desc') {
                    if (typeof a === typeof b) {
                        return a < b ? 1 : -1;
                    }
                    return typeof a < typeof b ? 1 : -1;
                }
            } else {
                throw ("error");
            }
        }
    }

    function unique(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }
    /**
     * 时间比较
     * @return {Boolean}
     */
    function compareDate(date1, date2) {
        var startTime = new Date(date1.replace('-', '/').replace('-', '/'));
        var endTime = new Date(date2.replace('-', '/').replace('-', '/'));
        if (startTime >= endTime) {
            return true;
        }
        return false;
    }

    /*
     * calendar 单月日历组件
     */
    $.fn.calendar = function(option, callback) {
        var setting = $.extend({}, $.fn.calendar.defaults, option)

        // alias
        var diffX = setting.diffX
        var diffY = setting.diffY
        var showDay = setting.showDay
        var showToday = setting.showToday
        var fixScroll = setting.fixScroll
        var showFestival = setting.showFestival
        var fillInputVal = setting.fillInputVal
        var hmsFormat = setting.hmsFormat

        // date对象转成字符串格式
        setting.startDate = date2Str(setting.startDate)
        setting.endDate = date2Str(setting.endDate)
        setting.HmsArr = [{
            'time': '',
            'isEnable': false
        }, {
            'time': '',
            'isEnable': false
        }, {
            'time': '',
            'isEnable': false
        }]
        setting.proofClass = 'thh'
        setting.proofArr = ['thh', 'tmm', 'tss'];

        /*
         * 生成日历的HTML模板
         */
        function template() {
            var tableHTML = '<table cellspacing="0" cellpadding="0">'
            var theadHTML = '' + '<thead>' + '<tr class="controls"><th colspan="7">' + '<a href="javascript:;" class="prevYear ctrl-prev">«</a>' + '<a href="javascript:;" class="prevMonth ctrl-prev">‹</a>' + '<span class="selectMonth">' + '<select class="month"></select>' + '</span>' + '<span class="slecteYear">' + '<select class="year"></select>' + '</span>' + '<a href="javascript:;" class="nextYear ctrl-next">»</a>' + '<a href="javascript:;" class="nextMonth ctrl-next">›</a>' + '</th></tr>' + '<tr class="days">' + '<th class="J-sun">日</th>' + '<th class="J-mon">一</th>' + '<th class="J-tue">二</th>' + '<th class="J-wed">三</th>' + '<th class="J-thu">四</th>' + '<th class="J-fri">五</th>' + '<th class="J-sat">六</th>' + '</tr>' + '</thead>'
            var tbodyHTML = '<tbody>'
            var trHTML = '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
            var tfootHTML = ''
            var tfootHTML = showToday ? tfootHTML + '<tfoot><tr><td colspan="7"><span class="today">今天</span></td></tr></tfoot>' : tfootHTML
            if (hmsFormat) {
                tfootHTML += '<tfoot><tr><td colspan="7"><div class="hms"><span class="time">时间：&nbsp;</span>'
                if (setting.HmsArr[0].isEnable) {
                    tfootHTML += '<input class="thh" maxlength="2" value="' + setting.HmsArr[0].time + '">'
                }
                if (setting.HmsArr[1].isEnable) {
                    tfootHTML += '<input value=":" class="tm" readonly=""><input class="tmm" maxlength="2" value="' + setting.HmsArr[1].time + '">'
                }
                if (setting.HmsArr[2].isEnable) {
                    tfootHTML += '<input value=":" class="tm" readonly=""><input class="tss" maxlength="2" value="' + setting.HmsArr[2].time + '">'
                }
                tfootHTML += '<span class="proof"><i class="up"></i><i class="down"></i></span></div></td></tr></tfoot>'
            }
            var table = $(tableHTML)
            table.append(theadHTML, tbodyHTML, tfootHTML)
            for (var o = 0; o < 6; o++) {
                $('tbody', table).append(trHTML)
            }
            return $('<div class="Cal">').append(table)
        }
        /*
         * 设置年月
         */
        function setYearMonth($div, date) {
            var $table = $div.find('table')
            var $year = $table.find('.year')
            var $month = $table.find('.month')
            var month = date.getMonth()
            var year = date.getFullYear()
            $year[0].selectedIndex = $year.find('[value="' + year + '"]').attr('idx')
                // change年时保持月不变
            var $option = $month.find('[value="' + month + '"]')
            var index = $option.index()
            if ($option.length) {
                $month[0].selectedIndex = index
            } else {
                $month[0].selectedIndex = 0
            }
            $month.attr('data-val', month)
        }
        /*
         * 绘制日历
         * 1. 插入天
         * 2. 当前选择的会给一个高亮样式
         * 3. 不在起始和结束日期范围的点击无效
         */
        function fillDate($div, $input) {
            var curDate = $input.data('currDate')
            var $table = $div.find('table')
            var $tds = $table.find('tbody td').unbind().empty().removeClass()
            var cYear = $table.find('.year').val() - 0
            var cMonth = $table.find('.month').val() - 0
            var cDate = new Date(cYear, cMonth, 1)
            var week = cDate.getDay()
            var start = 0
            var hasDate = true
            var days = months[cMonth]
            var currMonthDaysArr = []
                // 闰年的2月
            if (cMonth == 1 && isLeapYear(cYear)) {
                days = 29
            }
            // 填入日期并给当前的日期添加高亮样式
            for (var i = 0; i < days; i++) {
                var $td = $tds.eq(i + week)
                var rday = i + 1
                var festival = getFestival(new Date(cYear, cMonth, rday))
                currMonthDaysArr.push(rday);
                if (showFestival && festival) {
                    $td.html('<span class="festival">' + festival + '</span>')
                } else {
                    $td.text(rday)
                }
                $td.attr('day', rday)
                if (i + 1 == curDate.getDate() && cMonth == curDate.getMonth() && cYear == curDate.getFullYear()) {
                    $td.addClass('chosen')
                }
            }
            if (!!setting.multipleZones) {
                var getRangeObj = getRangeYear()
                var yearDoubleArr = getRangeObj.yearDoubleArr
                currMonthDaysArr = $.grep(currMonthDaysArr, function(n, i) {
                    var curTime = cYear + '-' + (cMonth + 1) + '-' + (getTwoBit(n));
                    for (var i = 0; i < yearDoubleArr.length; i++) {
                        if (compareDate(curTime, yearDoubleArr[i][0]) && compareDate(yearDoubleArr[i][1], curTime)) {
                            return true;
                        }
                    }
                    return false;
                });
                if (currMonthDaysArr.length) {
                    for (var u = 0; u < currMonthDaysArr.length; u++) {

                        var $td = $tds.eq(currMonthDaysArr[u] + week - 1)
                        $td.addClass('date')
                    }
                }
            } else {
                var startDate = setting.startDate
                var endDate = setting.endDate
                if (startDate && reDate.test(startDate)) {
                    var arr = startDate.split('-')
                    var year = arr[0] - 0
                    var month = arr[1] - 1
                    var day = arr[2] - 1
                    if (cMonth == month && cYear == year) {
                        start = day
                    }
                    if (cYear < year || cMonth < month && cYear <= year) {
                        hasDate = false
                    }
                }
                if (endDate && reDate.test(endDate)) {
                    var arr = endDate.split('-')
                    var year = arr[0] - 0
                    var month = arr[1] - 1
                    if (cMonth == month && cYear == year) {
                        days = arr[2]
                    }
                    if (cYear > year || cMonth > month && cYear == year) {
                        hasDate = false
                    }
                }
                if (hasDate) {
                    for (var u = start; u < days; u++) {
                        var $td = $tds.eq(u + week)
                        $td.addClass('date')
                    }
                }
            }

            setButtonStatus($div)
        }
        /*
         * 获取起始和结束年，默认从配置参数取，如果没有配置则以当前时间向前向后推5年
         */
        function getStartEndYear() {
            var start, end, startYear, endYear
            var startStr = setting.startDate
            var endStr = setting.endDate
            if (startStr) {
                start = str2Date(startStr)
                startYear = start.getFullYear()
            } else {
                startYear = now.getFullYear() - 5
                start = new Date(startYear, 1, 1)
            }
            if (endStr) {
                end = str2Date(endStr)
                endYear = end.getFullYear()
            } else {
                endYear = now.getFullYear() + 5
                end = new Date(endYear, 12, 31)
            }
            return {
                start: start,
                end: end,
                startYear: startYear,
                endYear: endYear
            }
        }


        /*
         * 获取区间年
         */
        function getRangeYear() {
            var multipleZonesArr = setting.multipleZones
            var yearDoubleArr = []
            var startTimeAllArr = []
            var endTimeAllArr = []
            var startYearArr = []
            var endYearArr = []
            var rangeYearAllArr = []
            for (var i = 0; i < multipleZonesArr.length; i++) {
                multipleZonesArr[i].startTime = date2Str(multipleZonesArr[i].startTime)
                multipleZonesArr[i].endTime = date2Str(multipleZonesArr[i].endTime)
                var temporaryArr = [multipleZonesArr[i].startTime, multipleZonesArr[i].endTime].sort(sortBy('asc'))
                yearDoubleArr.push(temporaryArr)
                startTimeAllArr.push(temporaryArr[0])
                endTimeAllArr.push(temporaryArr[1])

                var startYear = Number(str2Date(temporaryArr[0]).getFullYear())
                var endYear = Number(str2Date(temporaryArr[1]).getFullYear())
                startYearArr.push(startYear)
                endYearArr.push(endYear)
                for (var j = startYear + 1; j < endYear; j++) {
                    rangeYearAllArr.push(j)
                }
            }

            var yearUnionArr = unique(startYearArr.concat(endYearArr).concat(rangeYearAllArr)).sort()
            return {
                yearUnionArr: yearUnionArr,
                yearDoubleArr: yearDoubleArr,
                startTimeAllArr: startTimeAllArr.sort(sortBy('asc')),
                endTimeAllArr: endTimeAllArr.sort(sortBy('asc'))
            }

        }
        /*
         * 填入年Select
         */
        function fillYearSelect($div) {
            var year, i = 0,
                str = ''
            if (!!setting.multipleZones) {
                var yearUnionArr = getRangeYear().yearUnionArr;
                for (y = 0; y < yearUnionArr.length; y++) {
                    str += '<option value="' + yearUnionArr[y] + '" idx="' + (i++) + '">' + yearUnionArr[y] + '</option>'
                }
            } else {
                var obj = getStartEndYear()
                for (year = obj.startYear; year <= obj.endYear; year++) {
                    str += '<option value="' + year + '" idx="' + (i++) + '">' + year + '</option>'
                }
            }
            $div.find('select.year').html(str)
        }
        /*
         * 填入月Select
         */
        function fillMonthSelect($div, year) {

            var month, options = ''
            var $month = $div.find('select.month')
            var val = $month.attr('data-val')

            var concat = function(m) {
                options += '<option value="' + (m - 1) + '">' + m + '月</option>'
            }

            if (!!setting.multipleZones) {
                var getRangeObj = getRangeYear()
                var yearUnionArr = getRangeObj.yearUnionArr
                var yearDoubleArr = getRangeObj.yearDoubleArr
                year = Number(year)
                if ($.inArray(year, yearUnionArr) >= 0) {
                    var currYearMonthArr = $.grep([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function(n, i) {
                        var curTime = year + '-' + (getTwoBit(n)) + '-01';
                        for (var i = 0; i < yearDoubleArr.length; i++) {
                            yearDoubleArr[i][0] = yearDoubleArr[i][0].substr(0, 7) + '-01'
                            var endSplitArr = yearDoubleArr[i][1].split('-')
                            yearDoubleArr[i][1] = yearDoubleArr[i][1].substr(0, 7) + '-' + getMonthDays(endSplitArr[0], endSplitArr[1]);
                            if (compareDate(curTime, yearDoubleArr[i][0]) && compareDate(yearDoubleArr[i][1], curTime)) {
                                return true;
                            }
                        }
                        return false;
                    });
                    for (var i = 0; i < currYearMonthArr.length; i++) {
                        concat(currYearMonthArr[i])
                    }
                    $month.html(options)
                    return
                }
            } else {
                var obj = getStartEndYear()
                var startMonth = obj.start.getMonth() + 1
                var endMonth = obj.end.getMonth() + 1
                if (year == obj.startYear && year == obj.endYear) {
                    for (month = startMonth; month <= endMonth; month++) {
                        concat(month)
                    }
                    $month.html(options)
                } else if (year == obj.startYear) {
                    for (month = startMonth; month <= 12; month++) {
                        concat(month)
                    }
                    $month.html(options)
                } else if (year == obj.endYear) {
                    for (month = 1; month <= endMonth; month++) {
                        concat(month)
                    }
                    $month.html(options)
                    return
                } else {
                    for (month = 1; month <= 12; month++) {
                        concat(month)
                    }
                    $month.html(options)
                }
            }


            var $option = $month.find('[value="' + val + '"]')
            var index = $option.index()
            if ($option.length) {
                $month[0].selectedIndex = index
            } else {
                $month[0].selectedIndex = 0
            }
            $month.attr('data-val', val)
        }
        /*
         * 激活或禁用按钮状态
         */
        function setButtonStatus($div) {
            var $prevYear = $div.find('.prevYear')
            var $prevMonth = $div.find('.prevMonth')
            var $nextYear = $div.find('.nextYear')
            var $nextMonth = $div.find('.nextMonth')
            var elYear = $div.find('select.year')[0]
            var elMonth = $div.find('select.month')[0]
            var year = elYear.value
            var month = elMonth.value
            if (!!setting.multipleZones) {
                var getRangeObj = getRangeYear()
                var start = getRangeObj.startTimeAllArr[0].split('-')
                var end = getRangeObj.endTimeAllArr.pop().split('-')
            } else {
                var start = setting.startDate.split('-')
                var end = setting.endDate.split('-')
            }
            var startYear = start[0]
            var startMonth = start[1] - 1
            var endYear = end[0]
            var endMonth = end[1] - 1

            // 第1年
            if (year == startYear) {
                $prevYear.addClass('disable')
                month == startMonth ? $prevMonth.addClass('disable') : $prevMonth.removeClass('disable')
            } else {
                $prevYear.removeClass('disable')
                $prevMonth.removeClass('disable')
            }
            // 最后1年
            if (year == endYear) {
                $nextYear.addClass('disable')
                month == endMonth ? $nextMonth.addClass('disable') : $nextMonth.removeClass('disable')
            } else {
                $nextYear.removeClass('disable')
                $nextMonth.removeClass('disable')
            }
        }
        /*
         * 日历上所有的事件，多数事件采用事件代码方式
         */

        /**
         * 补齐数字位数
         * @return {string}
         */
        function getNumTwoBit(n) {
            if (n == '0') {
                return '00';
            } else {
                if (/^0/.test(n)) {
                    n = n.split('')[1];
                }
                return (n > 9 ? '' : '0') + n;
            }

        }
        /**
         * 获取单位整数
         * @return {number}
         */
        function getNumSingle(n) {
            if (/^0/.test(n)) {
                n = n.split('')[1];
            }
            return Number(n);
        }

        function forbidTxtSelect(argument) {
            document.body.onselectstart = document.body.ondrag = function() {
                return false;
            }
        }

        function addEvent($div, $input) {
            var $prevMonthBtn = $div.find('.prevMonth')
            var $prevYearBtn = $div.find('.prevYear')
            var $nextMonthBtn = $div.find('.nextMonth')
            var $nextYearBtn = $div.find('.nextYear')
            var getRangeObj = getRangeYear()
            var start = !!setting.multipleZones ? getRangeObj.startTimeAllArr[0].split('-') : setting.startDate.split('-')
            var end = !!setting.multipleZones ? getRangeObj.endTimeAllArr.pop().split('-') : setting.endDate.split('-')
            $div.find('select.month').change(function() {
                var $select = $(this)
                var val = $select.val()
                $select.attr('data-val', val)
                fillDate($div, $input)
            })
            $div.find('select.year').change(function() {
                var year = $(this).val() - 0
                fillMonthSelect($div, year)
                fillDate($div, $input)
            })

            // 上一年
            $div.delegate('.prevYear', 'click', function() {
                //var start = setting.startDate.split('-')
                var startYear = start[0]
                var elYear = $div.find('select.year')[0]
                var yIdx = elYear.selectedIndex
                var year = elYear.value
                if (year == startYear) {
                    return
                }
                elYear.selectedIndex = --yIdx
                fillMonthSelect($div, elYear.value)
                fillDate($div, $input)
            })

            $div.delegate('.nextYear', 'click', function() {
                //var end = setting.endDate.split('-')
                var endYear = end[0]
                var elYear = $div.find('select.year')[0]
                var yIdx = elYear.selectedIndex
                var year = elYear.value
                if (year == endYear) {
                    return
                }
                elYear.selectedIndex = ++yIdx
                fillMonthSelect($div, elYear.value)
                fillDate($div, $input)
            })

            // 上一个月，到达其实月时置灰
            $div.delegate('.prevMonth', 'click', function() {
                //var start = setting.startDate.split('-')
                var startYear = start[0] - 0
                var startMonth = start[1] - 1
                var elYear = $div.find('select.year')[0]
                var elMonth = $div.find('select.month')[0]
                var yIdx = elYear.selectedIndex
                var mIdx = elMonth.selectedIndex
                var year = elYear.value
                var month = elMonth.value
                if (year == startYear && month == startMonth) {
                    return
                }
                if (month == 0) {
                    fillMonthSelect($div, --year)
                }
                if (month == 0) {
                    // 显示末位option
                    elMonth.selectedIndex = elMonth.children.length - 1
                    elYear.selectedIndex = --yIdx
                } else {
                    elMonth.selectedIndex = --mIdx
                }
                fillDate($div, $input)
            })

            // 下一个月，到达结束月时置灰
            $div.delegate('.nextMonth', 'click', function() {
                //var end = setting.endDate.split('-')
                var endYear = end[0] - 0
                var endMonth = end[1] - 1
                var elYear = $div.find('select.year')[0]
                var elMonth = $div.find('select.month')[0]
                var yIdx = elYear.selectedIndex
                var mIdx = elMonth.selectedIndex
                var year = elYear.value
                var month = elMonth.value
                if (year == endYear && month == endMonth) {
                    return
                }
                if (month == 11) {
                    fillMonthSelect($div, ++year)
                }
                if (month == 11) {
                    // 显示首位option
                    elMonth.selectedIndex = 0
                    elYear.selectedIndex = ++yIdx
                } else {
                    elMonth.selectedIndex = ++mIdx
                }
                fillDate($div, $input)
            })

            // 选定日期回填到输入框
            $div.delegate('td.date', 'click', function() {
                var $td = $(this)
                var $table = $td.closest('table')
                var year = $table.find('select.year').val()
                var month = $table.find('select.month').val()
                var day = $td.attr('day')
                var dateObj = new Date(year, month, day)
                    // $input.data('currDate', new Date(year, month, day))
                $div.hide()
                setting.proofClass = 'thh'
                $input.val(getTime(format(dateObj, showDay, week)))
                setting.onChoose([getTime(format(dateObj)), {
                    input: $input
                }])
                $div.trigger('choose', [getTime(format(dateObj)), {
                    input: $input
                }])
            })
            $div.delegate('td.date', 'mouseover', function() {
                    $(this).addClass('over')
                }).delegate('td.date', 'mouseout', function() {
                    $(this).removeClass('over')
                })
                // 今天
            $div.delegate('.today', 'click', function() {
                $input.val(format(new Date(), showDay, week))
                $div.hide()
            })
            $win.bind('resize', {
                div: $div,
                input: $input
            }, onResize)
            $doc.bind('click', {
                div: $div,
                input: $input
            }, onBody)

            // 时分秒选中
            $div.delegate('input', 'focus', function() {
                setting.proofClass = $(this).attr('class')
                $(this).select()
            })

            // 时分秒 校正时间
            $div.delegate('input', 'blur', function() {
                var defaultVal = $(this).val()
                defaultVal = !defaultVal ? '00' : defaultVal
                defaultVal = defaultVal > 59 ? 59 : defaultVal
                $(this).val(getNumTwoBit(defaultVal))
                setting.HmsArr[$.inArray(setting.proofClass, setting.proofArr)].time = getNumTwoBit(defaultVal)
            })

            // 时分秒 限制输入
            $div.delegate('input', 'keyup', function(e) {
                var defaultVal = $(this).val()
                defaultVal = defaultVal.replace(/[^\d]/g, '')
                defaultVal = defaultVal.length > 2 ? defaultVal.subStr(0, 2) : defaultVal
                $(this).val(defaultVal)
            })

            // 时间校正-递增
            $div.delegate('.up', 'click', function() {
                forbidTxtSelect()
                var $proofClass = $('.' + setting.proofClass)
                var defaultVal = getNumSingle($proofClass.val())
                if (setting.proofClass == 'thh') {
                    if (defaultVal < 24) {
                        ++defaultVal
                    }
                } else if (defaultVal < 59) {
                    var remainder = defaultVal % 5;
                    defaultVal = defaultVal + (5 - remainder);
                    if (remainder > 2) {
                        defaultVal = defaultVal + 5;
                    }
                    if (defaultVal > 59) {
                        defaultVal = 59;
                    }
                }
                $proofClass.val(getNumTwoBit(defaultVal))
                setting.HmsArr[$.inArray(setting.proofClass, setting.proofArr)].time = getNumTwoBit(defaultVal)
            })

            // 时间校正-递减

            $div.delegate('.down', 'click', function(e) {
                forbidTxtSelect()
                var $proofClass = $('.' + setting.proofClass)
                var defaultVal = getNumSingle($proofClass.val())
                if (defaultVal > 0) {
                    if (setting.proofClass == 'thh') {
                        --defaultVal
                    } else {
                        var remainder = defaultVal % 5;
                        defaultVal = defaultVal - remainder;
                        if (remainder < 3) {
                            defaultVal = defaultVal - 5;
                        }
                        if (defaultVal < 0) {
                            defaultVal = 0;
                        }
                    }
                } else if (defaultVal == 1) {
                    defaultVal = 0;
                }
                $proofClass.val(getNumTwoBit(defaultVal));
                setting.HmsArr[$.inArray(setting.proofClass, setting.proofArr)].time = getNumTwoBit(defaultVal)
            })

            // 处理滚动时效果
            switch (fixScroll) {
                case 'fix':
                    $win.bind('scroll', {
                        div: $div,
                        input: $input
                    }, onResize)
                    break
                case 'hide':
                    $win.bind('scroll', {
                        div: $div,
                        input: $input
                    }, function(ev) {
                        var $div = ev.data.div
                        var $input = ev.data.input
                        $div.hide()
                    })
                    break
                default:
                    ;
            }
        }

        function onBody(ev) {
            var $div = ev.data.div
            var $input = ev.data.input
            var $target = $(ev.target)
            if (!$target.parents('.Cal').length && $target[0] != $input[0]) {
                $div.hide()
            }
        }

        function onResize(ev) {
            var $div = ev.data.div
            var $input = ev.data.input
            setPosition($div, $input, diffX, diffY)
        }

        // 设置时分秒
        function setHms(date) {
            date = date || new Date();
            var hmsFormatArr = hmsFormat.split('hh').join(date.getHours()).split('mm').join(date.getMinutes()).split('ss').join(date.getSeconds()).split('-')
            var temporaryArr = []
            for (var i = 0; i < 3; i++) {
                var time = hmsFormatArr[i] ? getTwoBit(hmsFormatArr[i]) : ''
                temporaryArr.push({
                    'time': time,
                    'isEnable': hmsFormatArr[i] ? true : false
                })
                $('.' + setting.proofArr[i]).val(time)
            }
            setting.HmsArr = temporaryArr
        }

        //设置返回时间
        function getTime(defaultTime) {
            if (hmsFormat) {
                var temporaryArr = [];
                for (var i = 0; i < setting.HmsArr.length; i++) {
                    if (setting.HmsArr[i].time) {
                        temporaryArr.push(setting.HmsArr[i].time)
                    }
                }
                //
                if (/^hh$/.test(hmsFormat)) {
                    temporaryArr.push('00')
                }
                if (temporaryArr.length) {
                    defaultTime += ' ' + temporaryArr.join(':')
                }
            }
            return defaultTime
        }

        // 入口函数
        function bootstrap($input) {
            // 开启时分秒
            if (hmsFormat) {
                // check参数是否正确
                if (!/^hh(\-mm-ss|\-mm){0,1}$/.test(hmsFormat)) {
                    hmsFormat = 'hh-mm-ss'
                }
                setHms()
            }

            var $div = template()

            // 是否回填输入框
            var choseDate = getChoseDate($input, setting)
            if (fillInputVal) {
                $input.val(getTime(format(choseDate, showDay, week)))
            }

            // 注册到PopUI
            $input.data('calendar', $div)

            // 初始化
            function init() {
                var val = $input.val()
                var res = reDate.exec(val)
                var choseDate = getChoseDate($input, setting)
                var endDate = setting.endDate

                // 当前日期如果大于结束日期，那么以结束日期为当前日期
                if (endDate) {
                    endDate = str2Date(endDate)
                }
                if (choseDate > endDate) {
                    choseDate = endDate
                }

                // 填充年的select
                fillYearSelect($div)

                fillMonthSelect($div, choseDate.getFullYear())

                // 设置年月
                setYearMonth($div, choseDate)

                // 缓存当前日期
                $input.data('currDate', choseDate)

                // 设置日期弹层位置
                setPosition($div, $input, diffX, diffY)

                // 第一次渲染
                fillDate($div, $input)
                $div.show()
            }

            function showCal() {
                if ($input.data('hasCal')) {
                    init()
                } else {
                    init()
                    addEvent($div, $input)
                    $body.prepend($div)
                    $input.data('hasCal', 1)
                }
            }
            // method
            $div.showCal = showCal
            $div.setOption = function(option) {
                for (var a in option) {
                    setting[a] = option[a]
                }
            }
            $div.setRange = function(startDate, endDate) {
                setting.startDate = startDate
                setting.endDate = endDate
            }
            $input.click(function() {
                setHms()
                showCal()
            })
        }
        return this.each(function() {
            var $input = $(this)
            bootstrap($input)
            if ($.isFunction(callback)) callback($input)
        })
    }

    $.fn.calendar.defaults = {
        startDate: dateUtil.getDay(0),
        endDate: dateUtil.getDay(1000),
        choseDate: date2Str(now),
        showDay: false,
        showToday: false,
        showFestival: true,
        fillInputVal: false,
        diffX: 0,
        diffY: 0,
        fixScroll: '',
        hmsFormat: '',
        multipleZones: '',
        onChoose: null
    }
});