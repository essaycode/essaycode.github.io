/**
 *--组件类型--
 * @type 通用组件
 * @name buynum
 * @cname 购买数量
 * @author 廖艳丽
 * //咚咚
 * @dong liaoyanli5
 * @desc 购买数量加、减和输入操作，包含默认样式两套
 * @author liaoyanli
 * @param cls {string|updown}  组件样式,默认为上下结构，本组件共提供两套样式，上下结构updown，和左右结构leftright,也可自定义
 * @param num {int|1} 输入框默认值，默认值为1
 * @param maxNum {int|500} 输入框允许输入的最大值，默认值为500
 * @param onAdd {function|null} 点击加号按钮触发事件
 * @param onReduce {function|null} 点击减号按钮触发事件
 * @param onText {function|null} 输入时触发事件
 * @example 
 * $(selector).buynum({
 *      cls: 'youstyle',
 *      num: 1,
 *      maxNum: 500,
 *      onAdd: function(){},
 *      onReduce: function(){},
 *      onText: function(){}
 * })
 **/
define(function(require, exports, module) {

    $.fn.buynum = function(option, callback) {
        require('./../../css/buynum/buynum.css');
        var setting = $.extend({
            cls: 'updown',
            num: 1,
            maxNum: 500,
            onAdd: null,
            onReduce: null,
            onText: null
        }, option);

        function execute(ele) {
            var Gather = {
                //模板
                tpl: function() {
                    return '<div class="choose-amount ' + setting.cls + '">' +
                        '    <input class="text buy-num" value="' + setting.num + '">' +
                        '    <a class="btn-reduce" href="javascript:void(0)">-</a>' +
                        '    <a class="btn-add" href="javascript:void(0)">+</a>' +
                        '</div>';
                },

                //取到购买输入框数量元素
                getNumEle: function() {
                    return ele.find('.buy-num');
                },

                //取得加号元素
                getAddEle: function() {
                    return ele.find('.btn-add');
                },

                //取得减号元素
                getReduceEle: function() {
                    return ele.find('.btn-reduce');
                },

                //加1
                add: function() {
                    Gather.setNum(parseInt(Gather.getNum()) + 1);
                },

                //减1
                reduce: function() {
                    Gather.setNum(parseInt(Gather.getNum()) - 1);
                },

                //获取数量
                getNum: function() {
                    return Gather.getNumEle().val();
                },

                //填充数量
                setNum: function(num) {
                    Gather.getNumEle().val(num);
                },

                //给按钮添加禁用和删除禁用
                toggleDisable: function(num) {
                    if (setting.num - setting.maxNum == 0 || !num) {
                        Gather.getReduceEle().addClass('disabled');
                        Gather.getAddEle().addClass('disabled');
                    } else {
                        switch (parseInt(num)) {
                            case parseInt(setting.num):
                                Gather.getReduceEle().addClass('disabled');
                                Gather.getAddEle().removeClass('disabled');
                                break;
                            case parseInt(setting.maxNum):
                                Gather.getAddEle().addClass('disabled');
                                Gather.getReduceEle().removeClass('disabled');
                                break;
                            default:
                                Gather.getReduceEle().removeClass('disabled');
                                Gather.getAddEle().removeClass('disabled');
                        }
                    }
                },

                //事件监听
                control: function() {
                    //监听加号
                    Gather.getAddEle().click(function() {
                        if (!$(this).hasClass('disabled')) {
                            Gather.add();
                            Gather.toggleDisable(Gather.getNum());
                            if (setting.onAdd) setting.onAdd && setting.onAdd(ele);
                        }
                    });

                    //监听减号
                    Gather.getReduceEle().click(function() {
                        if (!$(this).hasClass('disabled')) {
                            Gather.reduce();
                            Gather.toggleDisable(Gather.getNum());
                            if (setting.onReduce) setting.onReduce && setting.onReduce(ele);
                        }
                    });

                    //监听input输入
                    Gather.getNumEle().bind('keyup focus input propertychange', function() {
                        var self = $(this);
                        //只允许输入数字
                        var num = Gather.getNum();
                        // if (!num) Gather.setNum(setting.num);
                        if (num && !/^[1-9]\d*$/.test(num)) Gather.setNum(setting.num);
                        if (num && (num - setting.maxNum > 0)) Gather.setNum(setting.maxNum);
                        Gather.toggleDisable(Gather.getNum());
                        if (setting.onText) setting.onText && setting.onText(ele);
                    });

                    //监听数值改变
                    // Gather.getNumEle().bind('input propertychange', function() {
                    //     Gather.toggleDisable(Gather.getNum());
                    // });
                }
            }

            ele.html(Gather.tpl);
            Gather.control(ele);
            Gather.toggleDisable(setting.num);
        }

        return this.each(function() {
            var self = $(this);
            execute(self);
            if (callback) callback(self)
        })
    };
});