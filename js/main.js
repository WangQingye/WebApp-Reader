/**
 * Created by Administrator on 2016/11/24 0024.
 */
(function () {
    var Util = (function () {
            var prefix = 'html5_reader_';
            var StorageGetter = function (key) {
                return localStorage.getItem(prefix + key);
            };
            var StorageSetter = function (key,val) {
                return localStorage.setItem(prefix + key,val);
            };
            return{
                StorageGetter:StorageGetter,
                StorageSetter:StorageSetter
            }
    })();

    var Dom = {
        topNav:$('#top_nav'),
        bottomNav:$('#bottom_nav'),
        Win:$(window),
        Doc:$(document),
        fontSwitch:$('#font_switch'),
        fontContainer:$('#font_container'),
        fontBg:$('.nav-panel-bk'),
        ReadContent:$('#fiction_container'),
        bk1:$('#bk_1'),
        bk2:$('#bk_2'),
        bk3:$('#bk_3'),
        bk4:$('#bk_4'),
        dayOrNight:$('#day_night'),
        moon:$('#moon'),
        sun:$('#sun')

    };

    var initFontSize = Util.StorageGetter('font-size')||14;
    initFontSize = parseInt(initFontSize);
    Dom.ReadContent.css('font-size',initFontSize);

    function main(func) {
        /*项目入口函数*/
        func();
    }

    function ReaderModel() {
        /*实现和阅读器相关的数据交互的方法*/
        var getFictionInfo = function () {
            $.get('/data/chapter.json',function () {

            },'json');
        }
    }

    function ReaderBaseFrame() {
        /*初始化基本的UI结构*/
    }

    function EventHandler() {
        /*交互的事件绑定*/
        /*不用touch和zepto tap 是因为4.0之前click有300ms延迟，现在没有了，所有click兼容性更好*/
        $('#action_mid').click(function () {
            if(Dom.topNav.css('display') == 'none') {
                Dom.topNav.show();
                Dom.bottomNav.show();
            }else {
                Dom.topNav.hide();
                Dom.bottomNav.hide();
                Dom.fontContainer.hide();
                Dom.fontBg.hide();
                Dom.fontSwitch.removeClass('nav-current')
            }
        });
        Dom.Win.scroll(function () {
            Dom.topNav.hide();
            Dom.bottomNav.hide();
            Dom.fontContainer.hide();
            Dom.fontBg.hide();
            Dom.fontSwitch.removeClass('nav-current')

        });
        Dom.fontSwitch.click(function () {
            if(Dom.fontContainer.css('display') == 'none') {
                Dom.fontContainer.show();
                Dom.fontBg.show();
                Dom.fontSwitch.addClass('nav-current')
            }else {
                Dom.fontContainer.hide();
                Dom.fontBg.hide();
                Dom.fontSwitch.removeClass('nav-current')
            }
        });
        $('#large_font').click(function () {
            if(initFontSize>20){
                return;
            }
            initFontSize+=1;
            Dom.ReadContent.css('font-size',initFontSize);
            Util.StorageSetter('font-size',initFontSize);
        });
        $('#small_font').click(function () {
            if(initFontSize<12){
                return;
            }
            initFontSize-=1;
            Dom.ReadContent.css('font-size',initFontSize);
            Util.StorageSetter('font-size',initFontSize);
        });
        $('#bk1').click(function () {
            if(!Dom.bk1.className) {
                Dom.bk1.addClass('bk-container-current');
                Dom.bk2.removeClass();
                Dom.bk3.removeClass();
                Dom.bk4.removeClass();
                document.body.style.background=$('#bk1').css('background');
            }
        });
        $('#bk2').click(function () {
            if(!Dom.bk2.className) {
                Dom.bk2.addClass('bk-container-current');
                Dom.bk1.removeClass();
                Dom.bk3.removeClass();
                Dom.bk4.removeClass();
                document.body.style.background=$('#bk2').css('background');
            }
        });
        $('#bk3').click(function () {
            if(!Dom.bk3.className) {
                Dom.bk3.addClass('bk-container-current');
                Dom.bk1.removeClass();
                Dom.bk2.removeClass();
                Dom.bk4.removeClass();
                document.body.style.background=$('#bk3').css('background');
                Dom.dayOrNight.html('白天');
                Dom.moon.hide();
                Dom.sun.show();
            }
        });
        $('#bk4').click(function () {
            if(!Dom.bk4.className) {
                Dom.bk4.addClass('bk-container-current');
                Dom.bk1.removeClass();
                Dom.bk3.removeClass();
                Dom.bk2.removeClass();
                document.body.style.background=$('#bk4').css('background');
                Dom.dayOrNight.html('夜间');
                Dom.moon.show();
                Dom.sun.hide();
            }
        });
        $('#night_day_switch').click(function () {
            if(!Dom.bk3.className) {
                Dom.bk3.addClass('bk-container-current');
                Dom.bk1.removeClass();
                Dom.bk2.removeClass();
                Dom.bk4.removeClass();
                document.body.style.background=$('#bk3').css('background');
            }
            if(Dom.dayOrNight.html()=='夜间'){
                Dom.dayOrNight.html('白天');
                Dom.moon.hide();
                Dom.sun.show();
            }else {
                if(!Dom.bk4.className) {
                    Dom.bk4.addClass('bk-container-current');
                    Dom.bk1.removeClass();
                    Dom.bk3.removeClass();
                    Dom.bk2.removeClass();
                    document.body.style.background=$('#bk4').css('background');
                }
                Dom.dayOrNight.html('夜间');
                Dom.moon.show();
                Dom.sun.hide();
            }

        })

    }

    main(EventHandler);

})();