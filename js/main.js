/**
 * Created by Administrator on 2016/11/24 0024.
 */
(function () {
    'use strict';
    var Util = (function () {
        var prefix = 'html5_reader_';
        var StorageGetter = function (key) {
            return localStorage.getItem(prefix + key);
        };
        var StorageSetter = function (key,val) {
            return localStorage.setItem(prefix + key,val);
        };

        var getBSONP = function(url,callback){
            return $.jsonp({
                url:url,
                cache:true,
                callback:'duokan_fiction_chapter',
                success:function(result){
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            })
        };
        return{
            getBSONP:getBSONP,
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
    var readerModel;
    var readerUI;

    function main() {
        /*项目入口函数*/

        readerModel = ReaderModel();
        readerUI = ReaderBaseFrame(Dom.ReadContent);
        readerModel.init(function(data){
            readerUI(data);
        });
        EventHandler();

    }

    function ReaderModel() {
        /*实现和阅读器相关的数据交互的方法*/

        var Chapter_id;
        var ChapterTotal;
        var init = function(UIcallback){
/*            getFictionInfo(function(){
                getCurChapterContent(Chapter_id,function(data){
                    UIcallback && UIcallback(data)
                })
            })*/

            /*使用promise对象改造了异步函数，使代码结构更加清晰*/
            getFictionInfoPromise().then(function (d) {
                return getgetCurChapterContentPromise();
            }).then(function (data) {
                UIcallback && UIcallback(data);
            })
        };
        var getFictionInfo = function (callback) {
            $.get('data/chapter.json',function (data) {
                    /*获得章节信息的回调*/
                Chapter_id = Util.StorageGetter('last_chapter_id')||data.chapters[1].chapter_id;
                ChapterTotal = data.chapters.length;
                callback && callback();
            },"json");
        };

        var getFictionInfoPromise =function () {
            return new Promise(function (resolve,reject) {
                $.get('data/chapter.json',function (data) {
                    /*获得章节信息的回调*/
                    if(data.result == 0){
                        Chapter_id = Util.StorageGetter('last_chapter_id')||data.chapters[1].chapter_id;
                        ChapterTotal = data.chapters.length;
                        resolve();
                    }else {
                        reject();
                    }
                },"json");
            });
        };

        var getCurChapterContent = function (chapter_id,callback){
            $.get('data/data' + chapter_id + '.json',function(data){
                /*获得章节数据的回调*/
                if(data.result == 0){
                    var url = data.jsonp;
                    Util.getBSONP(url,function(data){
                       callback && callback(data);
                    });
                }
            },"json")
        };

        var getgetCurChapterContentPromise =function(){
            return new Promise (function (resolve,reject) {
                $.get('data/data' + Chapter_id + '.json',function(data){
                    /*获得章节数据的回调*/
                    if(data.result == 0){
                        var url = data.jsonp;
                        Util.getBSONP(url,function(data){
                            resolve(data);
                        })
                    }else {
                        reject({msg:'fail'});
                    }
                },"json")
            })
        };
        var prevChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10);
            if(Chapter_id == 1){
                alert('这已经是第一章了哦');
                return
            }
            Chapter_id-=1;

            getCurChapterContent(Chapter_id,UIcallback);
            Util.StorageSetter('last_chapter_id',Chapter_id);
        };
        var nextChapter = function(UIcallback){
            Chapter_id = parseInt(Chapter_id,10);
            if(Chapter_id == 4){
                alert('这已经是最后一章了哦');
                return;
            }else {
                Chapter_id+=1;
                getCurChapterContent(Chapter_id,UIcallback);
                Util.StorageSetter('last_chapter_id',Chapter_id);
            }


        };
        return{
            init:init,
            prevChapter:prevChapter,
            nextChapter:nextChapter
        }

    }

    function ReaderBaseFrame(container) {
        /*初始化基本的UI结构*/
        function parseChapterData(jsonData){
            var jasonObj = JSON.parse(jsonData);
            var html='<h4>' + jasonObj.t + '</h4>';
            for (var i = 0;i<jasonObj.p.length;i++){
                html+='<p>' + jasonObj.p[i] + '</p>';
            }
            return html;
        }
        return function (data) {
            container.html(parseChapterData(data));
        }
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

        });
        $('#prev_button').click(function(){
            /*获得章节的翻页数据，然后把数据进行渲染*/
            readerModel.prevChapter(function(data){
                readerUI(data)
            });
            $("html, body").animate({ scrollTop: 0 },0);
        });
        $('#next_button').click(function(){
            readerModel.nextChapter(function(data){
                readerUI(data)
            });
            $("html, body").animate({ scrollTop: 0 },0);
        });


    }

    main();

})();