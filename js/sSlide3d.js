;(function($) {
    $.extend($.fn, {
        sSlide: function(options) {
            var defaults = {
                slideElem: 'li',   //
                minMove: 30,
                moveSpeed: 300,
                arrow: true,
                direction: 'X',  // 左右: X, 上下: Y
                loop: false,
                angle: 60
            };
            var bodyWidth = document.documentElement.clientWidth;
            var bodyHeight = document.documentElement.clientHeight;
            var settings    = $.extend(defaults, options);
            var sSlideObj   = $(this.selector);
            var slides      = sSlideObj.children(settings.slideElem);
            var slidesLen   = slides.length;
            var minMove     = settings.minMove; //最小移动距离，超出才执行滑动
            var moveSpeed   = settings.moveSpeed;
            var direction   = settings.direction;
            var arrow       = settings.arrow;
            var loop        = settings.loop;
            var angle       = settings.angle;
            var movement    = direction == 'X' ? bodyWidth : bodyHeight;
            var fullWidth   = direction == 'X' ? bodyWidth * (slidesLen + (loop ? 2 : 0)): bodyWidth;
            var fullHeight  = direction == 'X' ? bodyHeight : bodyHeight * (slidesLen + (loop ? 2 : 0));
            var curIndex    = loop ? 1 : 0;
            var per = 0,offset;

            var translateStr = function(offset) {
                var str;
                if (direction == 'X') {
                    str = "translateX(";
                } else {
                    str = "translateY(";
                }
                return str += offset + "%)";
            };
            var rotateStr = function(rotate) {
                var str;
                if (direction == 'X') {
                    str = "rotateY(";
                    return str += rotate + "deg)";
                } else {
                    str = "rotateX(";
                    return str += -rotate + "deg)";
                }
            };
            var getPoint = function(touch) {
                return direction == 'X' ? touch.pageX : touch.pageY;
            };
            var flipPage = function(dir) {
                curIndex += dir;
                if (curIndex > slidesLen) {
                    curIndex = 0;
                } else if (curIndex < 1) {
                    curIndex = loop ? slidesLen : 0;
                } else if (curIndex == slidesLen) {
                    curIndex = loop ? curIndex : curIndex - dir;
                }
            }


            var doTransform = function(obj, offset, rotate, time, opacity, bezier){
                var bezier = bezier ? bezier : "linear";
                obj.css({
                    "-webkit-transform": translateStr(offset) +rotateStr(rotate),
                    "transform": translateStr(offset) +rotateStr(rotate),
                    "-webkit-transition": time+'ms '+bezier,
                    "transition": time+'ms '+bezier,
                    'opacity': opacity});
            };
            var touchEvents = {
                start: function(e){
                    if ( $(e.target).is('a[href]') ) {
                       window.location.href = $(e.target).attr('href');
                    } else {
                        startPoint = getPoint(e.touches[0]);
                        curIndex = $(this).index();
                    }
                    startPoint = getPoint(e.touches[0]);
                    curIndex = $(this).index();
                },
                move: function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    nowPoint   = getPoint(e.touches[0]);
                    moveSpace  = nowPoint - startPoint;
                    per = direction == 'X' ? moveSpace/bodyWidth : moveSpace/bodyHeight;
                    offset = (1-Math.abs(per))*100;

                    if(moveSpace > 0) { //move prev
                        if (!loop && curIndex == 0 ) {
                            return false;
                        } else {
                            $(".page_next").removeClass("page_active");
                            $(".page_prev").addClass("page_active");
                            $(".page_mid").removeClass("page_prev").addClass("page_next");
                            doTransform($(".page_prev"),-offset,-angle*(1-per),0);
                            doTransform($(".page_mid"),per*100,angle*per,0);
                        }
                    } else if(moveSpace < 0) { //move next
                        if (!loop && curIndex == slidesLen-1 ) {
                            return false;
                        } else {
                            $(".page_prev").removeClass("page_active");
                            $(".page_next").addClass("page_active");
                            $(".page_mid").removeClass("page_next").addClass("page_prev");
                            doTransform($(".page_next"),offset,angle*(1+per),0);
                            doTransform($(".page_mid"),per*100,angle*per,0);
                        }
                    }

                },
                end: function(e){
                    var oldIndex = curIndex;
                        if(Math.abs(moveSpace) > minMove){


                            if (moveSpace < -minMove) { // move down
                                lastPage = loop ? slidesLen + 1 : slidesLen - 1;
                                if (curIndex < lastPage) {
                                    flipPage(1);
                                    doTransform($(".page_next"),0,0,moveSpeed);
                                    doTransform($(".page_mid"),-100,-angle,moveSpeed,0);
                                };

                            } else if(moveSpace > minMove){ // move up
                                if (curIndex > 0) {
                                    flipPage(-1);
                                    doTransform($(".page_prev"),0,0,moveSpeed);
                                    doTransform($(".page_mid"),100,angle,moveSpeed,0);
                                };
                            }
                            if (loop) {
                                console.log(curIndex)
                                slides.find(".animated").removeClass("in");
                                slides.eq(curIndex == 0 ? 0 : curIndex - 1).find(".animated").addClass("in");
                                if (curIndex == slidesLen + 1) {
                                    slides.eq(0).find(".animated").addClass("in");
                                }
                            } else {
                                slides.find(".animated").removeClass("in");
                                slides.eq(curIndex).find(".animated").addClass("in");
                            }
                            setTimeout(function(){
                                slides.removeClass("page_mid").removeClass("page_prev").removeClass("page_next").removeClass("page_active");
                                if (curIndex == 0) {
                                    slides.eq(0).addClass("page_mid");
                                    slides.eq(1).addClass("page_next");
                                    slides.eq(slidesLen-1).addClass("page_prev");
                                } else if (curIndex == slidesLen ) {

                                    slides.eq(slidesLen-1).addClass("page_mid");
                                    slides.eq(0).addClass("page_next");
                                    slides.eq(slidesLen-2).addClass("page_prev");

                                } else {
                                    if(loop){
                                        slides.eq(curIndex-1).addClass("page_mid");
                                        slides.eq(curIndex).addClass("page_next");
                                        slides.eq(curIndex-2).addClass("page_prev");
                                    } else {
                                        slides.eq(curIndex).addClass("page_mid");
                                        slides.eq(curIndex+1).addClass("page_next");
                                        slides.eq(curIndex-1).addClass("page_prev");
                                    }
                                };
                            },moveSpeed)
                        } else { //返回原位
                            if(moveSpace > 0 && curIndex > 0){ //鼠标往右滑
                                doTransform($(".page_prev"),-100,-angle,moveSpeed/2);
                            }else if(curIndex<slidesLen-1){ //鼠标往左滑
                                doTransform($(".page_next"),100,angle,moveSpeed/2);
                            }
                            doTransform($(".page_mid"),0,0,moveSpeed/2);
                        }

                    moveSpace = 0;
                    //hide arrow
                    if (!loop) {
                        if (curIndex==slidesLen - 1) {
                            $(".arrow").hide();
                        } else {
                            $(".arrow").show();
                        };
                    };

                }
            };

            if (loop) {
                // init clone
                var startPoint, nowPoint, moveSpace;
                var cloneHead = $('.page').eq(0).clone().addClass('clone');
                cloneHead.appendTo(sSlideObj.selector);
                var cloneTail = $('.page').eq(slidesLen - 1).clone().addClass('clone');
                cloneTail.prependTo(sSlideObj.selector);
            }


            sSlideObj.wrap('<div class="sslide-wrapper"></div>').parent().css({
                width: bodyWidth,
                height: bodyHeight,
                overflow: 'hidden'
            });

            sSlideObj.children(settings.slideElem).css({
                height: bodyHeight,
                width: bodyWidth
            }).addClass(direction == 'X' ? 'x' : '');

            if (arrow) {
                if (direction == 'X') {
                    //sSlideObj.after('<img class="arrow left">');
                    sSlideObj.after('<img class="arrow right">');
                } else if (direction == 'Y') {
                    //sSlideObj.after('<img class="arrow up">');
                    sSlideObj.after('<img src="img/down_arrow.png" class="arrow down">');
                }
            }

            $('.arrow', '.sslide-wrapper').on('click', function(a,b,c) {
                var arrow = $(this);
                if (arrow.hasClass('right') || arrow.hasClass('down')) {
                    flipPage(1);
                } else if (arrow.hasClass('left') || arrow.hasClass('up')) {
                    flipPage(-1);
                }
                var offset = -curIndex * movement;
                doTransform(sSlideObj, offset, moveSpeed);
            });
            slides.eq(slidesLen-1).addClass("page_prev");
            slides.eq(0).addClass("page_mid");
            slides.eq(1).addClass("page_next");
            slides.bind('touchstart',touchEvents.start);
            slides.bind('touchmove',touchEvents.move);
            slides.bind('touchend',touchEvents.end);
            $("#slideList li").eq(curIndex).find(".animated").addClass("in");
        }
    });
})(Zepto);
