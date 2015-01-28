;(function($) {
    $.extend($.fn, {
        sSlide: function(options) {
            var defaults = {
                slideElem: 'li',   //
                minMove: 30,
                moveSpeed: 300,
                arrow: true,
                direction: 'X'  // 左右: X, 上下: Y
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
            var curIndex    = 1;
            var movement    = direction == 'X' ? bodyWidth : bodyHeight;
            var fullWidth   = direction == 'X' ? bodyWidth * (slidesLen + 2): bodyWidth;
            var fullHeight  = direction == 'X' ? bodyHeight : bodyHeight * (slidesLen + 2);

            var translateStr = function(offset) {
                var str;
                if (direction == 'X') {
                    str = "translateX(";
                } else {
                    str = "translateY(";
                }
                return str += offset + "px)";
            };
            var getPoint = function(touch) {
                return direction == 'X' ? touch.pageX : touch.pageY;
            };
            var flipPage = function(dir) {
                curIndex += dir;
                if (curIndex > slidesLen + 1) {
                    curIndex = 2;
                } else if (curIndex < 0) {
                    curIndex = slidesLen - 1;
                }
            }

            var doTransform = function(obj, offset, speed){
                sSlideObj.animate({"-webkit-transform": translateStr(offset)}, speed, 'ease', function() {
                    if (curIndex == slidesLen +　1) {
                        sSlideObj.css({"-webkit-transform": translateStr(-movement)});
                        curIndex = 1;
                    } else if (curIndex == 0) {
                        sSlideObj.css({"-webkit-transform": translateStr(-slidesLen * movement)});
                        curIndex = slidesLen;
                    }
                });
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
                    var offset = -curIndex * movement + moveSpace;
                    sSlideObj.css({'-webkit-transform': translateStr(offset), '-webkit-transition':'ms linear'});
                },
                end: function(e){
                    $(".page").find(".animated").removeClass("in");
                    if (moveSpace < -minMove){ // move down
                        flipPage(1);
                    } else if(moveSpace > minMove){ // move up
                        flipPage(-1);
                    }
                    $(".page").eq(curIndex == 0 ? slidesLen : curIndex).find(".animated").addClass("in");
                    if (curIndex == slidesLen + 1) {
                      $(".page").eq(1).find(".animated").addClass("in");
                    }
                    offset = -curIndex * movement;
                    doTransform(sSlideObj, offset, moveSpeed);
                    moveSpace = 0;
                }
            };

            // init clone
            var startPoint, nowPoint, moveSpace;
            var cloneHead = $('.page').eq(0).clone().addClass('clone');
            cloneHead.appendTo(sSlideObj.selector);
            var cloneTail = $('.page').eq(slidesLen - 1).clone().addClass('clone');
            cloneTail.prependTo(sSlideObj.selector);

            sSlideObj.css({
                "-webkit-transform": translateStr(-movement),
                position: 'relative',
                width: fullWidth,
                height: fullHeight
            });

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
                    sSlideObj.after('<img class="arrow left">');
                    sSlideObj.after('<img class="arrow right">');
                } else if (direction == 'Y') {
                    //sSlideObj.after('<img class="arrow up">');
                    sSlideObj.after('<img class="arrow down">');
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

            slides.bind('touchstart',touchEvents.start);
            slides.bind('touchmove',touchEvents.move);
            slides.bind('touchend',touchEvents.end);
        }
    });
})(Zepto);
