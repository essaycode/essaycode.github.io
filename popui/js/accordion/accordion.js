/**
 * --组件类型--
 * @type 通用组件
 * @name accordion
 * @cname 手风琴
 * @desc 用于信息的展示收起，分横向和纵向两种效果，可以自己设定过渡时间
 * 具体图标可参考 https://www.iviewui.com/components/icon
 * @iconname compose
 * @author 李林森
 * //开发者咚咚号，可供用户直接私聊你
 * @dong lilinsen
 * **参数（API）**
 * @param swiper {str|'[data-ui="item"]'} 主要内容展示节点 必填
 * @param nav {str|[data-ui="nav"]} 如果有用于获取导航的尺寸
 * @param show {srt|'x'} 手风琴展开的方向
 * @param current {str|'cur'} 当前节点的样式
 * @param event {str|'mouseenter'} 触发事件
 * @param delay {num|200} 过渡时间
 * @param hoverDelay{num|50} 触发后的延迟时间
 * @param viewWidth{num|null} 组件宽
 * @param viewHeight{num|null} 组件宽
 * @param swiperSize{num|null} 展示节点尺寸
 * @param navSize{num|null} 导航尺寸
 * @demo //page.jd.com/virtuals/popui/2.0.0/html/accordion/accordion.html
 * @example 
 * $('.box-ask').accordion();
 * $('.demo-2').accordion({
 *    show:'y',
 *    swiperSize:500,
 *    navSize:100,
 *    viewWidth:900,
 *    viewHeight:400
 * }) 
 **/
define(function(require, module, exports) {
    require('./../../css/accordion/accordion.css');
    //基于组件类别修改，与dom无关的为$.accordion,与dom相关的使用$.fn.accordion
    $.fn.accordion = function(option, callback) {

        var setting = $.extend({
            //默认节点
            swiper: '[data-ui="item"]',
            //默认标题
            nav: '[data-ui="nav"]',
            //横向||纵向
            show: 'x',
            //当前节点样式
            current: 'cur',
            //触发事件
            event: 'mouseenter',
            //过渡时间
            delay: 200,
            //添加hover延时
            hoverDelay: 50,
            //组件宽
            viewWidth: null,
            //组件高
            viewHeight: null,
            //展示节点尺寸
            swiperSize: null,
            //漏出留白尺寸
            navSize: null

        }, option);
        //component todo
        function bootstrap(dom) {
            var $swiper = dom.find(setting.swiper);
            var $nav = dom.find(setting.nav);
            //节点尺寸 高或宽
            var $swiperSize,
                //导航尺寸 高或宽
                $navSize;
            var direction;
            if (setting.show == 'x') {
                $swiperSize = setting.swiperSize || $swiper.height();
                $navSize = setting.navSize || $nav.height();
                direction = 'height';
            } else {
                $swiperSize = setting.swiperSize || $swiper.width();
                $navSize = setting.navSize || $nav.width();
                direction = 'width';
            }
            dom.css({
                'width': setting.viewWidth,
                'height': setting.viewHeight
            })
            $swiper.css(direction, $navSize);
            dom.find('.' + setting.current).css(direction, $swiperSize);
            var clearTimes = null;
            var overObj = {},
                curObj = {};
            $swiper.bind(setting.event, function() {
                clearTimeout(clearTimes);
                var $that = $(this);
                clearTimes = setTimeout(function() {
                    dom.find('.' + setting.current).removeClass(setting.current);
                    $that.addClass(setting.current);
                    overObj[direction] = $navSize;
                    curObj[direction] = $swiperSize;
                    $swiper.stop().animate(overObj, setting.delay);
                    $that.stop().animate(curObj, setting.delay);
                }, setting.hoverDelay);
            });
        };
        return this.each(function() {
            var $dom = $(this)
            bootstrap($dom)
            if ($.isFunction(callback)) callback($dom)
        });

    }
})