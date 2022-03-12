import $ from 'jquery';

export default function (context) {
    jQuery(document).ready(($) => {
        $(() => {
            ParallaxScroll.init();
        });

        var ParallaxScroll = {
            /* PUBLIC VARIABLES */
            showLogs: false,
            round: 1000,

            /* PUBLIC FUNCTIONS */
            init() {
                this._log("init");
                if (this._inited) {
                    this._log("Already Inited");
                    this._inited = true;
                    return;
                }
                this._requestAnimationFrame = (function () {
                  return window.requestAnimationFrame
                          || window.webkitRequestAnimationFrame
                          || window.mozRequestAnimationFrame
                          || window.oRequestAnimationFrame
                          || window.msRequestAnimationFrame
                          || function (/* function */ callback, /* DOMElement */ element) {
                              window.setTimeout(callback, 1000 / 60);
                          };
                }());
                this._onScroll(true);
            },

            /* PRIVATE VARIABLES */
            _inited: false,
            _properties: ['x', 'y', 'z', 'rotateX', 'rotateY', 'rotateZ', 'scaleX', 'scaleY', 'scaleZ', 'scale'],
            _requestAnimationFrame: null,

            /* PRIVATE FUNCTIONS */
            _log(message) {
                if (this.showLogs) console.log(`Parallax Scroll / ${message}`);
            },
            _onScroll(noSmooth) {
                const scroll = $(document).scrollTop();
                const windowHeight = $(window).height();
                this._log(`onScroll ${scroll}`);
                $("[data-parallax]").each($.proxy(function (index, el) {
                    const $el = $(el);
                    const properties = [];
                    let applyProperties = false;
                    let style = $el.data("style");
                    if (style == undefined) {
                        style = $el.attr("style") || "";
                        $el.data("style", style);
                    }
                    const datas = [$el.data("parallax")];
                    let iData;
                    for (iData = 2; ; iData++) {
                        if ($el.data(`parallax${iData}`)) {
                            datas.push($el.data(`parallax-${iData}`));
                        } else {
                            break;
                        }
                    }
                    const datasLength = datas.length;
                    for (iData = 0; iData < datasLength; iData++) {
                        var data = datas[iData];
                        var scrollFrom = data["from-scroll"];
                        if (scrollFrom == undefined) scrollFrom = Math.max(0, $(el).offset().top - windowHeight);
                        scrollFrom |= 0;
                        let scrollDistance = data.distance;
                        var scrollTo = data["to-scroll"];
                        if (scrollDistance == undefined && scrollTo == undefined) scrollDistance = windowHeight;
                        scrollDistance = Math.max(scrollDistance | 0, 1);
                        var easing = data.easing;
                        var easingReturn = data["easing-return"];
                        if (easing == undefined || !$.easing || !$.easing[easing]) easing = null;
                        if (easingReturn == undefined || !$.easing || !$.easing[easingReturn]) easingReturn = easing;
                        if (easing) {
                            var totalTime = data.duration;
                            if (totalTime == undefined) totalTime = scrollDistance;
                            totalTime = Math.max(totalTime | 0, 1);
                            var totalTimeReturn = data["duration-return"];
                            if (totalTimeReturn == undefined) totalTimeReturn = totalTime;
                            scrollDistance = 1;
                            var currentTime = $el.data("current-time");
                            if (currentTime == undefined) currentTime = 0;
                        }
                        if (scrollTo == undefined) scrollTo = scrollFrom + scrollDistance;
                        scrollTo |= 0;
                        var smoothness = data.smoothness;
                        if (smoothness == undefined) smoothness = 30;
                        smoothness |= 0;
                        if (noSmooth || smoothness == 0) smoothness = 1;
                        smoothness |= 0;
                        var scrollCurrent = scroll;
                        scrollCurrent = Math.max(scrollCurrent, scrollFrom);
                        scrollCurrent = Math.min(scrollCurrent, scrollTo);
                        if (easing) {
                            if ($el.data("sens") == undefined) $el.data("sens", "back");
                            if (scrollCurrent > scrollFrom) {
                                if ($el.data("sens") == "back") {
                                    currentTime = 1;
                                    $el.data("sens", "go");
                                } else {
                                    currentTime++;
                                }
                            }
                            if (scrollCurrent < scrollTo) {
                                if ($el.data("sens") == "go") {
                                    currentTime = 1;
                                    $el.data("sens", "back");
                                } else {
                                    currentTime++;
                                }
                            }
                            if (noSmooth) currentTime = totalTime;
                            $el.data("current-time", currentTime);
                        }
                        this._properties.map($.proxy(function (prop) {
                            let defaultProp = 0;
                            let to = data[prop];
                            if (to == undefined) return;
                            if (prop == "scale" || prop == "scaleX" || prop == "scaleY" || prop == "scaleZ") {
                                defaultProp = 1;
                            } else {
                                to |= 0;
                            }
                            let prev = $el.data(`_${prop}`);
                            if (prev == undefined) prev = defaultProp;
                            const next = ((to - defaultProp) * ((scrollCurrent - scrollFrom) / (scrollTo - scrollFrom))) + defaultProp;
                            let val = prev + (next - prev) / smoothness;
                            if (easing && currentTime > 0 && currentTime <= totalTime) {
                                let from = defaultProp;
                                if ($el.data("sens") == "back") {
                                    from = to;
                                    to = -to;
                                    easing = easingReturn;
                                    totalTime = totalTimeReturn;
                                }
                                val = $.easing[easing](null, currentTime, from, to, totalTime);
                            }
                            val = Math.ceil(val * this.round) / this.round;
                            if (val == prev && next == to) val = to;
                            if (!properties[prop]) properties[prop] = 0;
                            properties[prop] += val;
                            if (prev != properties[prop]) {
                                $el.data(`_${prop}`, properties[prop]);
                                applyProperties = true;
                            }
                        }, this));
                    }
                    if (applyProperties) {
                        if (properties.z != undefined) {
                            let perspective = data.perspective;
                            if (perspective == undefined) perspective = 800;
                            const $parent = $el.parent();
                            if (!$parent.data("style")) $parent.data("style", $parent.attr("style") || "");
                            $parent.attr("style", `perspective:${perspective}px; -webkit-perspective:${perspective}px; ${$parent.data("style")}`);
                        }
                        if (properties.scaleX == undefined) properties.scaleX = 1;
                        if (properties.scaleY == undefined) properties.scaleY = 1;
                        if (properties.scaleZ == undefined) properties.scaleZ = 1;
                        if (properties.scale != undefined) {
                            properties.scaleX *= properties.scale;
                            properties.scaleY *= properties.scale;
                            properties.scaleZ *= properties.scale;
                        }
                        const translate3d = `translate3d(${properties.x ? properties.x : 0}px, ${properties.y ? properties.y : 0}px, ${properties.z ? properties.z : 0}px)`;
                        const rotate3d = `rotateX(${properties.rotateX ? properties.rotateX : 0}deg) rotateY(${properties.rotateY ? properties.rotateY : 0}deg) rotateZ(${properties.rotateZ ? properties.rotateZ : 0}deg)`;
                        const scale3d = `scaleX(${properties.scaleX}) scaleY(${properties.scaleY}) scaleZ(${properties.scaleZ})`;
                        const cssTransform = `${translate3d} ${rotate3d} ${scale3d};`;
                        this._log(cssTransform);
                        $el.attr("style", `transform:${cssTransform} -webkit-transform:${cssTransform} ${style}`);
                    }
                }, this));
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame($.proxy(this._onScroll, this, false));
                } else {
                    this._requestAnimationFrame($.proxy(this._onScroll, this, false));
                }
            }
        };
    });
}
