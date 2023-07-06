"use strict";
var isNoviBuilder = window.xMode;
(function() {
    var userAgent = navigator.userAgent.toLowerCase(),
        initialDate = new Date(),
        $document = $(document),
        $window = $(window),
        $html = $("html"),
        $body = $('body'),
        isDesktop = $html.hasClass("desktop"),
        isRtl = $html.attr("dir") === "rtl",
        isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouch = "ontouchstart" in window,
        onloadCaptchaCallback, plugins = {
            pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
            bootstrapTooltip: $("[data-toggle='tooltip']"),
            bootstrapModalDialog: $('.modal'),
            bootstrapTabs: $(".tabs-custom-init"),
            rdNavbar: $(".rd-navbar"),
            materialParallax: $(".parallax-container"),
            maps: $('.google-map-container'),
            rdMailForm: $(".rd-mailform"),
            rdInputLabel: $(".form-label"),
            regula: $("[data-constraints]"),
            owl: $(".owl-carousel"),
            swiper: $(".swiper-slider"),
            search: $(".rd-search"),
            searchResults: $('.rd-search-results'),
            statefulButton: $('.btn-stateful'),
            isotope: $(".isotope"),
            popover: $('[data-toggle="popover"]'),
            viewAnimate: $('.view-animate'),
            radio: $("input[type='radio']"),
            checkbox: $("input[type='checkbox']"),
            customToggle: $("[data-custom-toggle]"),
            facebookWidget: $('#fb-root'),
            counter: $(".counter"),
            progressLinear: $(".progress-linear"),
            circleProgress: $(".progress-bar-circle"),
            dateCountdown: $('.DateCountdown'),
            pageLoader: $(".page-loader"),
            selectFilter: $("select"),
            captcha: $('.recaptcha'),
            scroller: $(".scroll-wrap"),
            lightGallery: $('[data-lightgallery="group"]'),
            lightGalleryItem: $('[data-lightgallery="item"]'),
            lightDynamicGalleryItem: $('[data-lightgallery="dynamic"]'),
            mailchimp: $('.mailchimp-mailform'),
            campaignMonitor: $('.campaign-mailform'),
            copyrightYear: $(".copyright-year"),
            cdScheduleWrap: $(".cd-schedule-wrap"),
            slick: $('.slick-slider')
        };

    function isScrolledIntoView(elem) {
        if (isNoviBuilder) return true;
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }

    function lazyInit(element, func) {
        var scrollHandler = function() {
            if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                func.call();
                element.addClass('lazy-loaded');
            }
        };
        scrollHandler();
        $window.on('scroll', scrollHandler);
    }
    $window.on('load', function() {
        if (plugins.counter.length) {
            for (var i = 0; i < plugins.counter.length; i++) {
                var
                    counter = $(plugins.counter[i]),
                    initCount = function() {
                        var counter = $(this);
                        if (!counter.hasClass("animated-first") && isScrolledIntoView(counter)) {
                            counter.countTo({
                                refreshInterval: 40,
                                speed: counter.attr("data-speed") || 1000,
                                from: 0,
                                to: parseInt(counter.text(), 10)
                            });
                            counter.addClass('animated-first');
                        }
                    };
                $.proxy(initCount, counter)();
                $window.on("scroll", $.proxy(initCount, counter));
            }
        }
        if (plugins.progressLinear.length) {
            for (var i = 0; i < plugins.progressLinear.length; i++) {
                var
                    bar = $(plugins.progressLinear[i]),
                    initProgress = function() {
                        var
                            bar = $(this),
                            end = parseInt($(this).find('.progress-value').text(), 10);
                        if (!bar.hasClass("animated-first") && isScrolledIntoView(bar)) {
                            bar.find('.progress-bar-linear').css({
                                width: end + '%'
                            });
                            bar.find('.progress-value').countTo({
                                refreshInterval: 40,
                                from: 0,
                                to: end,
                                speed: 1000
                            });
                            bar.addClass('animated-first');
                        }
                    };
                $.proxy(initProgress, bar)();
                $window.on("scroll", $.proxy(initProgress, bar));
            }
        }
        if (plugins.circleProgress.length) {
            for (var i = 0; i < plugins.circleProgress.length; i++) {
                var circle = $(plugins.circleProgress[i]);
                circle.circleProgress({
                    value: circle.attr('data-value'),
                    size: circle.attr('data-size') ? circle.attr('data-size') : 175,
                    fill: {
                        gradient: circle.attr('data-gradient').split(","),
                        gradientAngle: Math.PI / 4
                    },
                    startAngle: -Math.PI / 4 * 2,
                    emptyFill: circle.attr('data-empty-fill') ? circle.attr('data-empty-fill') : "rgb(245,245,245)"
                }).on('circle-animation-progress', function(event, progress, stepValue) {
                    $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
                });
                if (isScrolledIntoView(circle)) circle.addClass('animated-first');
                $window.on('scroll', $.proxy(function() {
                    var circle = $(this);
                    if (!circle.hasClass("animated-first") && isScrolledIntoView(circle)) {
                        circle.circleProgress('redraw');
                        circle.addClass('animated-first');
                    }
                }, circle));
            }
        }
    });
    $document.ready(function() {
        function getLatLngObject(str, marker, map, callback) {
            var coordinates = {};
            try {
                coordinates = JSON.parse(str);
                callback(new google.maps.LatLng(coordinates.lat, coordinates.lng), marker, map)
            } catch (e) {
                map.geocoder.geocode({
                    'address': str
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();
                        callback(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)), marker, map)
                    }
                })
            }
        }

        function initMaps() {
            var key;
            for (var i = 0; i < plugins.maps.length; i++) {
                if (plugins.maps[i].hasAttribute("data-key")) {
                    key = plugins.maps[i].getAttribute("data-key");
                    break;
                }
            }
            $.getScript('//maps.google.com/maps/api/js?' + (key ? 'key=' + key + '&' : '') + 'sensor=false&libraries=geometry,places&v=quarterly', function() {
                var head = document.getElementsByTagName('head')[0],
                    insertBefore = head.insertBefore;
                head.insertBefore = function(newElement, referenceElement) {
                    if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
                        return;
                    }
                    insertBefore.call(head, newElement, referenceElement);
                };
                var geocoder = new google.maps.Geocoder;
                for (var i = 0; i < plugins.maps.length; i++) {
                    var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
                    var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
                    var center = plugins.maps[i].getAttribute("data-center") || "New York";
                    var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
                        zoom: zoom,
                        styles: styles,
                        scrollwheel: false,
                        center: {
                            lat: 0,
                            lng: 0
                        }
                    });
                    plugins.maps[i].map = map;
                    plugins.maps[i].geocoder = geocoder;
                    plugins.maps[i].keySupported = true;
                    plugins.maps[i].google = google;
                    getLatLngObject(center, null, plugins.maps[i], function(location, markerElement, mapElement) {
                        mapElement.map.setCenter(location);
                    });
                    var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");
                    if (markerItems.length) {
                        var markers = [];
                        for (var j = 0; j < markerItems.length; j++) {
                            var markerElement = markerItems[j];
                            getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement) {
                                var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                                var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                                var info = markerElement.getAttribute("data-description") || "";
                                var infoWindow = new google.maps.InfoWindow({
                                    content: info
                                });
                                markerElement.infoWindow = infoWindow;
                                var markerData = {
                                    position: location,
                                    map: mapElement.map
                                }
                                if (icon) {
                                    markerData.icon = icon;
                                }
                                var marker = new google.maps.Marker(markerData);
                                markerElement.gmarker = marker;
                                markers.push({
                                    markerElement: markerElement,
                                    infoWindow: infoWindow
                                });
                                marker.isActive = false;
                                google.maps.event.addListener(infoWindow, 'closeclick', (function(markerElement, mapElement) {
                                    var markerIcon = null;
                                    markerElement.gmarker.isActive = false;
                                    markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                                    markerElement.gmarker.setIcon(markerIcon);
                                }).bind(this, markerElement, mapElement));
                                google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
                                    if (markerElement.infoWindow.getContent().length === 0) return;
                                    var gMarker, currentMarker = markerElement.gmarker,
                                        currentInfoWindow;
                                    for (var k = 0; k < markers.length; k++) {
                                        var markerIcon;
                                        if (markers[k].markerElement === markerElement) {
                                            currentInfoWindow = markers[k].infoWindow;
                                        }
                                        gMarker = markers[k].markerElement.gmarker;
                                        if (gMarker.isActive && markers[k].markerElement !== markerElement) {
                                            gMarker.isActive = false;
                                            markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
                                            gMarker.setIcon(markerIcon);
                                            markers[k].infoWindow.close();
                                        }
                                    }
                                    currentMarker.isActive = !currentMarker.isActive;
                                    if (currentMarker.isActive) {
                                        if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
                                            currentMarker.setIcon(markerIcon);
                                        }
                                        currentInfoWindow.open(map, marker);
                                    } else {
                                        if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
                                            currentMarker.setIcon(markerIcon);
                                        }
                                        currentInfoWindow.close();
                                    }
                                }).bind(this, markerElement, mapElement))
                            })
                        }
                    }
                }
            });
        }

        function getSwiperHeight(object, attr) {
            var val = object.attr("data-" + attr),
                dim;
            if (!val) {
                return undefined;
            }
            dim = val.match(/(px)|(%)|(vh)$/i);
            if (dim.length) {
                switch (dim[0]) {
                    case "px":
                        return parseFloat(val);
                    case "vh":
                        return $window.height() * (parseFloat(val) / 100);
                    case "%":
                        return object.width() * (parseFloat(val) / 100);
                }
            } else {
                return undefined;
            }
        }

        function toggleSwiperInnerVideos(swiper) {
            var prevSlide = $(swiper.slides[swiper.previousIndex]),
                nextSlide = $(swiper.slides[swiper.activeIndex]),
                videos, videoItems = prevSlide.find("video");
            for (i = 0; i < videoItems.length; i++) {
                videoItems[i].pause();
            }
            videos = nextSlide.find("video");
            if (videos.length) {
                videos.get(0).play();
            }
        }

        function toggleSwiperCaptionAnimation(swiper) {
            var prevSlide = $(swiper.container).find("[data-caption-animate]"),
                nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
                delay, duration, nextSlideItem, prevSlideItem;
            for (i = 0; i < prevSlide.length; i++) {
                prevSlideItem = $(prevSlide[i]);
                prevSlideItem.removeClass("animated").removeClass(prevSlideItem.attr("data-caption-animate")).addClass("not-animated");
            }
            for (i = 0; i < nextSlide.length; i++) {
                nextSlideItem = $(nextSlide[i]);
                delay = nextSlideItem.attr("data-caption-delay");
                duration = nextSlideItem.attr('data-caption-duration');
                var tempFunction = function(nextSlideItem, duration) {
                    return function() {
                        nextSlideItem.removeClass("not-animated").addClass(nextSlideItem.attr("data-caption-animate")).addClass("animated");
                        if (duration) {
                            nextSlideItem.css('animation-duration', duration + 'ms');
                        }
                    };
                };
                setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
            }
        }

        function initOwlCarousel(c) {
            var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-"],
                values = [0, 480, 768, 992, 1200, 1475],
                responsive = {},
                j, k;
            for (j = 0; j < values.length; j++) {
                responsive[values[j]] = {};
                for (k = j; k >= -1; k--) {
                    if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                        responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
                    }
                    if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                        responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
                    }
                    if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                        responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
                    }
                }
            }
            if (c.attr('data-dots-custom')) {
                c.on("initialized.owl.carousel", function(event) {
                    var carousel = $(event.currentTarget),
                        customPag = $(carousel.attr("data-dots-custom")),
                        active = 0;
                    if (carousel.attr('data-active')) {
                        active = parseInt(carousel.attr('data-active'), 10);
                    }
                    carousel.trigger('to.owl.carousel', [active, 300, true]);
                    customPag.find("[data-owl-item='" + active + "']").addClass("active");
                    customPag.find("[data-owl-item]").on('click', function(e) {
                        e.preventDefault();
                        carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item")), 300, true]);
                    });
                    carousel.on("translate.owl.carousel", function(event) {
                        customPag.find(".active").removeClass("active");
                        customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
                    });
                });
            }
            if (c.attr('data-nav-custom')) {
                c.on("initialized.owl.carousel", function(event) {
                    var carousel = $(event.currentTarget),
                        customNav = $(carousel.attr("data-nav-custom"));
                    customNav.find(".owl-arrow-next").click(function(e) {
                        e.preventDefault();
                        carousel.trigger('next.owl.carousel');
                    });
                    customNav.find(".owl-arrow-prev").click(function(e) {
                        e.preventDefault();
                        carousel.trigger('prev.owl.carousel');
                    });
                });
            }
            c.on("initialized.owl.carousel", function(event) {
                initLightGallery($(c).parent(), 'lightGallery-in-carousel');
            });
            c.owlCarousel({
                autoplay: c.attr("data-autoplay") === "true",
                loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
                items: 1,
                rtl: isRtl,
                dotsContainer: c.attr("data-pagination-class") || false,
                autoplayHoverPause: true,
                navContainer: c.attr("data-navigation-class") || false,
                mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
                nav: c.attr("data-nav") === "true",
                dots: c.attr("data-dots") === "true",
                dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
                animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
                animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
                responsive: responsive,
                navText: $.parseJSON(c.attr("data-nav-text")) || [],
                navClass: $.parseJSON(c.attr("data-nav-class")) || ['owl-prev', 'owl-next'],
            });
        }

        function liveSearch(options) {
            options.live.removeClass('cleared').html();
            options.current++;
            options.spin.addClass('loading');
            $.get(handler, {
                s: decodeURI(options.term),
                liveSearch: options.element.attr('data-search-live'),
                dataType: "html",
                liveCount: options.liveCount,
                filter: options.filter,
                template: options.template
            }, function(data) {
                options.processed++;
                var live = options.live;
                if (options.processed == options.current && !live.hasClass('cleared')) {
                    live.find('> #search-results').removeClass('active');
                    live.html(data);
                    setTimeout(function() {
                        live.find('> #search-results').addClass('active');
                    }, 50);
                }
                options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
            })
        }

        function attachFormValidator(elements) {
            for (var i = 0; i < elements.length; i++) {
                var o = $(elements[i]),
                    v;
                o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
                v = o.parent().find(".form-validation");
                if (v.is(":last-child")) {
                    o.addClass("form-control-last-child");
                }
            }
            elements.on('input change propertychange blur', function(e) {
                var $this = $(this),
                    results;
                if (e.type != "blur") {
                    if (!$this.parent().hasClass("has-error")) {
                        return;
                    }
                }
                if ($this.parents('.rd-mailform').hasClass('success')) {
                    return;
                }
                if ((results = $this.regula('validate')).length) {
                    for (i = 0; i < results.length; i++) {
                        $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
                    }
                } else {
                    $this.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }).regula('bind');
            var regularConstraintsMessages = [{
                type: regula.Constraint.Required,
                newMessage: "Preencha corretamente este campo."
            }, {
                type: regula.Constraint.Email,
                newMessage: "Este e-mail não é válido."
            }, {
                type: regula.Constraint.Numeric,
                newMessage: "Somente números."
            }, {
                type: regula.Constraint.Selected,
                newMessage: "Por favor, selecione uma opção."
            }];
            for (var i = 0; i < regularConstraintsMessages.length; i++) {
                var regularConstraint = regularConstraintsMessages[i];
                regula.override({
                    constraintType: regularConstraint.type,
                    defaultMessage: regularConstraint.newMessage
                });
            }
        }

        function isValidated(elements, captcha) {
            var results, errors = 0;
            if (elements.length) {
                for (j = 0; j < elements.length; j++) {
                    var $input = $(elements[j]);
                    if ((results = $input.regula('validate')).length) {
                        for (k = 0; k < results.length; k++) {
                            errors++;
                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                        }
                    } else {
                        $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                    }
                }
                if (captcha) {
                    if (captcha.length) {
                        return validateReCaptcha(captcha) && errors == 0
                    }
                }
                return errors == 0;
            }
            return true;
        }

        function initBootstrapTooltip(tooltipPlacement) {
            if (window.innerWidth < 599) {
                plugins.bootstrapTooltip.tooltip('destroy');
                plugins.bootstrapTooltip.tooltip({
                    placement: 'bottom'
                });
            } else {
                plugins.bootstrapTooltip.tooltip('destroy');
                plugins.bootstrapTooltip.tooltip();
            }
        }
        if (plugins.copyrightYear.length) {
            plugins.copyrightYear.text(initialDate.getFullYear());
        }
        if (plugins.maps.length) {
            lazyInit(plugins.maps, initMaps);
        }
        if (plugins.pageLoader.length > 0) {
            setTimeout(function() {
                plugins.pageLoader.addClass("loaded");
                $window.trigger("resize");
            }, 200);
        }

        function validateReCaptcha(captcha) {
            var $captchaToken = captcha.find('.g-recaptcha-response').val();
            if ($captchaToken == '') {
                captcha.siblings('.form-validation').html('Please, prove that you are not robot.').addClass('active');
                captcha.closest('.form-group').addClass('has-error');
                captcha.on('propertychange', function() {
                    var $this = $(this),
                        $captchaToken = $this.find('.g-recaptcha-response').val();
                    if ($captchaToken != '') {
                        $this.closest('.form-group').removeClass('has-error');
                        $this.siblings('.form-validation').removeClass('active').html('');
                        $this.off('propertychange');
                    }
                });
                return false;
            }
            return true;
        }
        window.onloadCaptchaCallback = function() {
            for (i = 0; i < plugins.captcha.length; i++) {
                var $capthcaItem = $(plugins.captcha[i]);
                grecaptcha.render($capthcaItem.attr('id'), {
                    sitekey: $capthcaItem.attr('data-sitekey'),
                    size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
                    theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
                    callback: function(e) {
                        $('.recaptcha').trigger('propertychange');
                    }
                });
                $capthcaItem.after("<span class='form-validation'></span>");
            }
        };
        if (plugins.captcha.length) {
            $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
        }
        if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");
        if (isIE) {
            if (isIE < 10) {
                $html.addClass("lt-ie-10");
            }
            if (isIE < 11) {
                if (plugins.pointerEvents) {
                    $.getScript(plugins.pointerEvents).done(function() {
                        $html.addClass("ie-10");
                        PointerEventsPolyfill.initialize({});
                    });
                }
            }
            if (isIE === 11) {
                $("html").addClass("ie-11");
            }
            if (isIE === 12) {
                $("html").addClass("ie-edge");
            }
        }
        if (plugins.bootstrapTooltip.length) {
            var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
            initBootstrapTooltip(tooltipPlacement);
            $window.on('resize orientationchange', function() {
                initBootstrapTooltip(tooltipPlacement);
            })
        }
        if (plugins.bootstrapModalDialog.length > 0) {
            var i = 0;
            for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
                var modalItem = $(plugins.bootstrapModalDialog[i]);
                modalItem.on('hidden.bs.modal', $.proxy(function() {
                    var activeModal = $(this),
                        rdVideoInside = activeModal.find('video'),
                        youTubeVideoInside = activeModal.find('iframe');
                    if (rdVideoInside.length) {
                        rdVideoInside[0].pause();
                    }
                    if (youTubeVideoInside.length) {
                        var videoUrl = youTubeVideoInside.attr('src');
                        youTubeVideoInside.attr('src', '').attr('src', videoUrl);
                    }
                }, modalItem))
            }
        }
        if (plugins.scroller.length) {
            var i;
            for (i = 0; i < plugins.scroller.length; i++) {
                var scrollerItem = $(plugins.scroller[i]);
                scrollerItem.mCustomScrollbar({
                    theme: scrollerItem.attr('data-theme') ? scrollerItem.attr('data-theme') : 'minimal',
                    scrollInertia: 100,
                    scrollButtons: {
                        enable: false
                    }
                });
            }
        }
        if (plugins.facebookWidget.length) {
            lazyInit(plugins.facebookWidget, function() {
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.5";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            });
        }
        if (plugins.radio.length) {
            var i;
            for (i = 0; i < plugins.radio.length; i++) {
                var $this = $(plugins.radio[i]);
                $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
            }
        }
        if (plugins.checkbox.length) {
            var i;
            for (i = 0; i < plugins.checkbox.length; i++) {
                var $this = $(plugins.checkbox[i]);
                $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
            }
        }
        if (plugins.popover.length) {
            if (window.innerWidth < 767) {
                plugins.popover.attr('data-placement', 'bottom');
                plugins.popover.popover();
            } else {
                plugins.popover.popover();
            }
        }
        if (plugins.statefulButton.length) {
            $(plugins.statefulButton).on('click', function() {
                var statefulButtonLoading = $(this).button('loading');
                setTimeout(function() {
                    statefulButtonLoading.button('reset')
                }, 2000);
            })
        }
        if (isDesktop && !isNoviBuilder) {
            $().UItoTop({
                easingType: 'easeOutQuart',
                containerClass: 'ui-to-top fa fa-angle-up'
            });
        }
        if (plugins.rdNavbar.length) {
            plugins.rdNavbar.RDNavbar({
                anchorNav: !isNoviBuilder,
                stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
                responsive: {
                    0: {
                        stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
                    },
                    768: {
                        stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
                    },
                    992: {
                        stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
                    },
                    1200: {
                        stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
                    }
                },
                callbacks: {
                    onStuck: function() {
                        var navbarSearch = this.$element.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                        }
                    },
                    onDropdownOver: function() {
                        return !isNoviBuilder;
                    },
                    onUnstuck: function() {
                        if (this.$clone === null)
                            return;
                        var navbarSearch = this.$clone.find('.rd-search input');
                        if (navbarSearch) {
                            navbarSearch.val('').trigger('propertychange');
                            navbarSearch.trigger('blur');
                        }
                    }
                }
            });
            if (plugins.rdNavbar.attr("data-body-class")) {
                document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
            }
            var topPanelHeight = plugins.rdNavbar.find('.rd-navbar-top-panel').innerHeight();
            plugins.rdNavbar.find('.rd-navbar-top-panel').css({
                'max-height': topPanelHeight
            });
        }
        if (plugins.search.length || plugins.searchResults) {
            var handler = "bat/rd-search.php";
            var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
                '<p>...#{token}...</p>' +
                '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
            var defaultFilter = '*.html';
            if (plugins.search.length) {
                plugins.search = $('.' + plugins.search[0].className);
                for (i = 0; i < plugins.search.length; i++) {
                    var searchItem = $(plugins.search[i]),
                        options = {
                            element: searchItem,
                            filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
                            template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
                            live: (searchItem.attr('data-search-live')) ? (searchItem.find('.' + searchItem.attr('data-search-live'))) : false,
                            liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
                            current: 0,
                            processed: 0,
                            timer: {}
                        };
                    if ($('.rd-navbar-search-toggle').length) {
                        var toggle = $('.rd-navbar-search-toggle');
                        toggle.on('click', function() {
                            $html.addClass('rd-search-active');
                            if (!($(this).hasClass('active'))) {
                                searchItem.find('input').val('').trigger('propertychange');
                            }
                        });
                    }
                    if ($('.rd-search-form-close').length) {
                        var toggle = $('.rd-search-form-close');
                        toggle.on('click', function() {
                            $html.removeClass('rd-search-active');
                            $('.rd-navbar-search').removeClass('active').find($('.rd-navbar-search-toggle')).removeClass('active');
                        })
                    }
                    if (options.live) {
                        options.clearHandler = false;
                        searchItem.find('input').on("keyup input propertychange", $.proxy(function() {
                            var ctx = this;
                            this.term = this.element.find('input').val().trim();
                            this.spin = this.element.find('.input-group-addon');
                            clearTimeout(ctx.timer);
                            if (ctx.term.length > 2) {
                                ctx.timer = setTimeout(liveSearch(ctx), 200);
                                if (ctx.clearHandler == false) {
                                    ctx.clearHandler = true;
                                    $("body").on("click", function(e) {
                                        if ($(e.toElement).parents('.rd-search').length == 0) {
                                            ctx.live.addClass('cleared').html('');
                                        }
                                    })
                                }
                            } else if (ctx.term.length == 0) {
                                ctx.live.addClass('cleared').html('');
                            }
                        }, options, this));
                    }
                    searchItem.on('submit', $.proxy(function() {
                        $('<input />').attr('type', 'hidden').attr('name', "filter").attr('value', this.filter).appendTo(this.element);
                        return true;
                    }, options, this))
                }
            }
            if (plugins.searchResults.length) {
                var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
                var match = regExp.exec(location.search);
                if (match != null) {
                    $.get(handler, {
                        s: decodeURI(match[1]),
                        dataType: "html",
                        filter: match[2],
                        template: defaultTemplate,
                        live: ''
                    }, function(data) {
                        plugins.searchResults.html(data);
                    })
                }
            }
        }
        if (plugins.viewAnimate.length) {
            var i;
            for (i = 0; i < plugins.viewAnimate.length; i++) {
                var $view = $(plugins.viewAnimate[i]).not('.active');
                $document.on("scroll", $.proxy(function() {
                    if (isScrolledIntoView(this)) {
                        this.addClass("active");
                    }
                }, $view)).trigger("scroll");
            }
        }
        if (plugins.swiper.length) {
            var i;
            for (i = 0; i < plugins.swiper.length; i++) {
                var s = $(plugins.swiper[i]);
                var pag = s.find(".swiper-pagination").length > 0 ? s.find(".swiper-pagination") : $(s.attr('data-custom-pagination')),
                    next = s.find(".swiper-button-next"),
                    prev = s.find(".swiper-button-prev"),
                    bar = s.find(".swiper-scrollbar"),
                    swiperSlide = s.find(".swiper-slide"),
                    autoplay = false;
                for (j = 0; j < swiperSlide.length; j++) {
                    var $this = $(swiperSlide[j]),
                        url;
                    if (url = $this.attr("data-slide-bg")) {
                        $this.css({
                            "background-image": "url(" + url + ")",
                            "background-size": "cover"
                        })
                    }
                }
                swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end().swiper({
                    autoplay: isNoviBuilder ? null : s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
                    direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                    effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                    speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                    keyboardControl: s.attr('data-keyboard') === "true",
                    mousewheelControl: s.attr('data-mousewheel') === "true",
                    mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
                    nextButton: next.length ? next.get(0) : null,
                    prevButton: prev.length ? prev.get(0) : null,
                    pagination: pag.length ? pag.get(0) : null,
                    paginationClickable: pag.length ? s.attr("data-clickable") !== "false" : true,
                    paginationBulletRender: pag.length ? s.attr("data-index-bullet") === "true" ? function(swiper, index, className) {
                        return '<span class="' + className + '">' + (index + 1) + '</span>';
                    } : null : null,
                    scrollbar: bar.length ? bar.get(0) : null,
                    scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                    scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
                    loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
                    simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
                    onTransitionStart: function(swiper) {
                        toggleSwiperInnerVideos(swiper);
                    },
                    onTransitionEnd: function(swiper) {
                        toggleSwiperCaptionAnimation(swiper);
                    },
                    onInit: function(swiper) {
                        toggleSwiperInnerVideos(swiper);
                        toggleSwiperCaptionAnimation(swiper);
                        initLightGallery($(swiper.container).parent(), 'lightGallery-in-carousel');
                        $window.on('resize', function() {
                            swiper.update(true);
                        })
                    }
                });
                $window.on("resize", function() {
                    var mh = getSwiperHeight(s, "min-height"),
                        h = getSwiperHeight(s, "height");
                    if (h) {
                        s.css("height", mh ? mh > h ? mh : h : h);
                    }
                }).trigger("resize");
            }
        }
        if (plugins.owl.length) {
            var i;
            for (i = 0; i < plugins.owl.length; i++) {
                var c = $(plugins.owl[i]);
                if (!c.parents('.tab-content').length) {
                    initOwlCarousel(c);
                }
            }
        }
        if (plugins.isotope.length) {
            var i, isogroup = [];
            for (i = 0; i < plugins.isotope.length; i++) {
                var isotopeItem = plugins.isotope[i],
                    iso = new Isotope(isotopeItem, {
                        itemSelector: '.isotope-item',
                        layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
                        filter: '*'
                    });
                isogroup.push(iso);
            }
            $window.on('load', function() {
                setTimeout(function() {
                    var i;
                    for (i = 0; i < isogroup.length; i++) {
                        isogroup[i].element.className += " isotope--loaded";
                        isogroup[i].layout();
                    }
                }, 600);
            });
            var resizeTimout, isotopeFilter = $("[data-isotope-filter]");
            isotopeFilter.on("click", function(e) {
                e.preventDefault();
                var filter = $(this);
                clearTimeout(resizeTimout);
                filter.parents(".isotope-filters").find('.active').removeClass("active");
                filter.addClass("active");
                var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
                iso.isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
                    filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
                });
            }).eq(0).trigger("click")
        }
        if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
            new WOW({
                boxClass: 'wow',
                animateClass: 'animated',
                offset: 0,
                mobile: false,
                live: true
            }).init();
        }
        if (plugins.bootstrapTabs.length) {
            var i;
            for (i = 0; i < plugins.bootstrapTabs.length; i++) {
                var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);
                if (bootstrapTabsItem.find('.owl-carousel').length) {
                    var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');
                    initOwlCarousel(carouselObj);
                    bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function() {
                        var $this = $(this);
                        $this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
                        $this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();
                        setTimeout(function() {
                            var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');
                            if (carouselObj.length) {
                                for (var j = 0; j < carouselObj.length; j++) {
                                    var carouselItem = $(carouselObj[j]);
                                    initOwlCarousel(carouselItem);
                                }
                            }
                        }, isNoviBuilder ? 1500 : 300);
                    }, bootstrapTabsItem));
                }
                if (bootstrapTabsItem.find('.slick-slider').length) {
                    bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function() {
                        var $this = $(this);
                        var setTimeOutTime = isNoviBuilder ? 1500 : 300;
                        setTimeout(function() {
                            $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
                        }, setTimeOutTime);
                    }, bootstrapTabsItem));
                }
            }
        }
        if (plugins.rdInputLabel.length) {
            plugins.rdInputLabel.RDInputLabel();
        }
        if (plugins.regula.length) {
            attachFormValidator(plugins.regula);
        }
        if (plugins.mailchimp.length) {
            for (i = 0; i < plugins.mailchimp.length; i++) {
                var $mailchimpItem = $(plugins.mailchimp[i]),
                    $email = $mailchimpItem.find('input[type="email"]');
                $mailchimpItem.attr('novalidate', 'true');
                $email.attr('name', 'EMAIL');
                $mailchimpItem.on('submit', $.proxy(function(e) {
                    e.preventDefault();
                    var $this = this;
                    var data = {},
                        url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
                        dataArray = $this.serializeArray(),
                        $output = $("#" + $this.attr("data-form-output"));
                    for (i = 0; i < dataArray.length; i++) {
                        data[dataArray[i].name] = dataArray[i].value;
                    }
                    $.ajax({
                        data: data,
                        url: url,
                        dataType: 'jsonp',
                        error: function(resp, text) {
                            $output.html('Server error: ' + text);
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 4000);
                        },
                        success: function(resp) {
                            $output.html(resp.msg).addClass('active');
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 6000);
                        },
                        beforeSend: function(data) {
                            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                                return false;
                            $output.html('Submitting...').addClass('active');
                        }
                    });
                    return false;
                }, $mailchimpItem));
            }
        }
        if (plugins.campaignMonitor.length) {
            for (i = 0; i < plugins.campaignMonitor.length; i++) {
                var $campaignItem = $(plugins.campaignMonitor[i]);
                $campaignItem.on('submit', $.proxy(function(e) {
                    var data = {},
                        url = this.attr('action'),
                        dataArray = this.serializeArray(),
                        $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
                        $this = $(this);
                    for (i = 0; i < dataArray.length; i++) {
                        data[dataArray[i].name] = dataArray[i].value;
                    }
                    $.ajax({
                        data: data,
                        url: url,
                        dataType: 'jsonp',
                        error: function(resp, text) {
                            $output.html('Server error: ' + text);
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 4000);
                        },
                        success: function(resp) {
                            $output.html(resp.Message).addClass('active');
                            setTimeout(function() {
                                $output.removeClass("active");
                            }, 6000);
                        },
                        beforeSend: function(data) {
                            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                                return false;
                            $output.html('Submitting...').addClass('active');
                        }
                    });
                    return false;
                }, $campaignItem));
            }
        }
        if (plugins.rdMailForm.length) {
            var i, j, k, msg = {
                'MF000': 'Sucesso, logo entraremos em contato com você.',
                'MF001': 'Recipients are not set!',
                'MF002': 'Form will not work locally!',
                'MF003': 'Please, define email field in your form!',
                'MF004': 'Please, define type of your form!',
                'MF254': 'Something went wrong with PHPMailer!',
                'MF255': 'Aw, snap! Something went wrong.'
            };
            for (i = 0; i < plugins.rdMailForm.length; i++) {
                var $form = $(plugins.rdMailForm[i]),
                    formHasCaptcha = false;
                $form.attr('novalidate', 'novalidate').ajaxForm({
                    data: {
                        "form-type": $form.attr("data-form-type") || "contact",
                        "counter": i
                    },
                    beforeSubmit: function(arr, $form, options) {
                        if (isNoviBuilder)
                            return;
                        var form = $(plugins.rdMailForm[this.extraData.counter]),
                            inputs = form.find("[data-constraints]"),
                            output = $("#" + form.attr("data-form-output")),
                            captcha = form.find('.recaptcha'),
                            captchaFlag = true;
                        output.removeClass("active error success");
                        if (isValidated(inputs, captcha)) {
                            if (captcha.length) {
                                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                                    captchaMsg = {
                                        'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                                        'CPT002': 'Something wrong with google reCaptcha'
                                    };
                                formHasCaptcha = true;
                                $.ajax({
                                    method: "POST",
                                    url: "bat/reCaptcha.php",
                                    data: {
                                        'g-recaptcha-response': captchaToken
                                    },
                                    async: false
                                }).done(function(responceCode) {
                                    if (responceCode !== 'CPT000') {
                                        if (output.hasClass("snackbars")) {
                                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')
                                            setTimeout(function() {
                                                output.removeClass("active");
                                            }, 3500);
                                            captchaFlag = false;
                                        } else {
                                            output.html(captchaMsg[responceCode]);
                                        }
                                        output.addClass("active");
                                    }
                                });
                            }
                            if (!captchaFlag) {
                                return false;
                            }
                            form.addClass('form-in-process');
                            if (output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                                output.addClass("active");
                            }
                        } else {
                            return false;
                        }
                    },
                    error: function(result) {
                        if (isNoviBuilder)
                            return;
                        var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
                            form = $(plugins.rdMailForm[this.extraData.counter]);
                        output.text(msg[result]);
                        form.removeClass('form-in-process');
                        if (formHasCaptcha) {
                            grecaptcha.reset();
                        }
                    },
                    success: function(result) {
                        if (isNoviBuilder)
                            return;
                        var form = $(plugins.rdMailForm[this.extraData.counter]),
                            output = $("#" + form.attr("data-form-output")),
                            select = form.find('select');
                        form.addClass('success').removeClass('form-in-process');
                        if (formHasCaptcha) {
                            grecaptcha.reset();
                        }
                        result = result.length === 5 ? result : 'MF255';
                        output.text(msg[result]);
                        if (result === "MF000") {
                            if (output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("active success");
                            }
                        } else {
                            if (output.hasClass("snackbars")) {
                                output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("active error");
                            }
                        }
                        form.clearForm();
                        if (select.length) {
                            select.select2("val", "");
                        }
                        form.find('input, textarea').trigger('blur');
                        setTimeout(function() {
                            output.removeClass("active error success");
                            form.removeClass('success');
                        }, 3500);
                    }
                });
            }
        }

        function initLightGallery(itemsToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemsToInit).lightGallery({
                    thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                    selector: "[data-lightgallery='item']",
                    autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                    pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                    addClass: addClass,
                    mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                    loop: $(itemsToInit).attr("data-lg-loop") !== "false"
                });
            }
        }

        function initDynamicLightGallery(itemsToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemsToInit).on("click", function() {
                    $(itemsToInit).lightGallery({
                        thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                        selector: "[data-lightgallery='item']",
                        autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                        pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                        addClass: addClass,
                        mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                        loop: $(itemsToInit).attr("data-lg-loop") !== "false",
                        dynamic: true,
                        dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
                    });
                });
            }
        }

        function initLightGalleryItem(itemToInit, addClass) {
            if (!isNoviBuilder) {
                $(itemToInit).lightGallery({
                    selector: "this",
                    addClass: addClass,
                    counter: false,
                    youtubePlayerParams: {
                        modestbranding: 1,
                        showinfo: 0,
                        rel: 0,
                        controls: 0
                    },
                    vimeoPlayerParams: {
                        byline: 0,
                        portrait: 0
                    }
                });
            }
        }
        if (plugins.lightGallery.length) {
            for (var i = 0; i < plugins.lightGallery.length; i++) {
                initLightGallery(plugins.lightGallery[i]);
            }
        }
        if (plugins.lightGalleryItem.length) {
            var notCarouselItems = [];
            for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
                if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
                    notCarouselItems.push(plugins.lightGalleryItem[z]);
                }
            }
            plugins.lightGalleryItem = notCarouselItems;
            for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
                initLightGalleryItem(plugins.lightGalleryItem[i]);
            }
        }
        if (plugins.lightDynamicGalleryItem.length) {
            for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
                initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
            }
        }
        if (plugins.customToggle.length) {
            var i;
            for (i = 0; i < plugins.customToggle.length; i++) {
                var $this = $(plugins.customToggle[i]);
                $this.on('click', $.proxy(function(event) {
                    event.preventDefault();
                    var $ctx = $(this);
                    $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
                }, $this));
                if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
                    $("body").on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length && e.data.find($(e.target)).length == 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
                if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                    $("body").on("click", $this, function(e) {
                        if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
                            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                        }
                    })
                }
            }
        }
        if (plugins.slick.length) {
            var i;
            for (i = 0; i < plugins.slick.length; i++) {
                var $slickItem = $(plugins.slick[i]);
                $slickItem.slick({
                    slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
                    asNavFor: $slickItem.attr('data-for') || false,
                    speed: $slickItem.attr("data-speed") ? $slickItem.attr("data-speed") : 600,
                    dots: $slickItem.attr("data-dots") === "true",
                    infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
                    focusOnSelect: true,
                    arrows: $slickItem.attr("data-arrows") === "true",
                    swipe: $slickItem.attr("data-swipe") === "true",
                    autoplay: $slickItem.attr("data-autoplay") === "true",
                    vertical: $slickItem.attr("data-vertical") === "true",
                    centerMode: $slickItem.attr("data-center-mode") === "true",
                    centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
                    mobileFirst: true,
                    rtl: isRtl,
                    responsive: [{
                        breakpoint: 0,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-xs-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1
                        }
                    }, {
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1
                        }
                    }]
                }).on('afterChange', function(event, slick, currentSlide, nextSlide) {
                    var $this = $(this),
                        childCarousel = $this.attr('data-child');
                    if (childCarousel) {
                        $(childCarousel + ' .slick-slide').removeClass('slick-current');
                        $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                    }
                });
            }
        }
        if (plugins.selectFilter.length) {
            var i;
            for (i = 0; i < plugins.selectFilter.length; i++) {
                var select = $(plugins.selectFilter[i]);
                var selectStyle = 'html-' + select.attr('data-style') + '-select';
                $html.addClass(selectStyle);
                select.select2({
                    placeholder: select.attr("data-placeholder") ? select.attr("data-placeholder") : false,
                    minimumResultsForSearch: select.attr("data-minimum-results-search") ? select.attr("data-minimum-results-search") : -1,
                    maximumSelectionSize: 3
                });
            }
        }
        if (plugins.materialParallax.length) {
            var i;
            if (!isNoviBuilder && !isIE && !isMobile) {
                plugins.materialParallax.parallax();
                if (!isMobile) {
                    $window.scroll(function() {
                        var transfromY = 1 - $window.scrollTop() / 250;
                        $('.breadcrumb-wrapper').find('.parallax-content').css({
                            'opacity': 1 - $window.scrollTop() / 250,
                            'top': 1 + $window.scrollTop() / 3,
                        });
                    });
                }
            } else {
                for (i = 0; i < plugins.materialParallax.length; i++) {
                    var parallax = $(plugins.materialParallax[i]),
                        imgPath = parallax.data("parallax-img");
                    parallax.css({
                        "background-image": 'url(' + imgPath + ')',
                        "background-attachment": "scroll",
                        "background-size": "cover"
                    });
                }
            }
        };

        function minHeightElement(element) {
            $window.on('resize orientationchange change', function() {
                var currElement = element;
                var elementArr = [];
                var i;
                var maxElement = 0;
                currElement.css('min-height', '0');
                for (i = 0; i < currElement.length; i++) {
                    var o = $(currElement[i]);
                    elementArr.push(o.innerHeight());
                    if (maxElement <= elementArr[i]) {
                        maxElement = elementArr[i];
                    }
                }
                currElement.css('min-height', maxElement);
            });
        }
        minHeightElement($('.block-info'));

        function SchedulePlan(element) {
            this.element = element;
            this.timeline = this.element.find('.timeline');
            this.timelineItems = this.timeline.find('li');
            this.timelineItemsNumber = this.timelineItems.length;
            this.timelineStart = getScheduleTimestamp(this.timelineItems.eq(0).text());
            this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems.eq(1).text()) - getScheduleTimestamp(this.timelineItems.eq(0).text());
            this.eventsWrapper = this.element.find('.events');
            this.eventsGroup = this.eventsWrapper.find('.events-group');
            this.singleEvents = this.eventsGroup.find('.single-event');
            this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
            this.modal = this.element.find('.event-modal');
            this.modalHeader = this.modal.find('.header');
            this.modalHeaderBg = this.modal.find('.header-bg');
            this.modalBody = this.modal.find('.body');
            this.modalBodyBg = this.modal.find('.body-bg');
            this.modalMaxWidth = 800;
            this.modalMaxHeight = 480;
            this.animating = false;
            this.initSchedule();
        }

        function checkResize() {
            objSchedulesPlan.forEach(function(element) {
                element.scheduleReset();
            });
            windowResize = false;
        }

        function getScheduleTimestamp(time) {
            time = time.replace(/ /g, '');
            var timeArray = time.split(':');
            var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
            return timeStamp;
        }

        function transformElement(element, value) {
            element.css({
                '-moz-transform': value,
                '-webkit-transform': value,
                '-ms-transform': value,
                '-o-transform': value,
                'transform': value
            });
        }
        if (plugins.cdScheduleWrap.length) {
            var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
            var transitionsSupported = ($('.csstransitions').length > 0);
            if (!transitionsSupported) transitionEnd = 'noTransition';
            SchedulePlan.prototype.initSchedule = function() {
                this.scheduleReset();
                this.initEvents();
            };
            SchedulePlan.prototype.scheduleReset = function() {
                var mq = this.mq();
                if (mq == 'desktop' && !this.element.hasClass('js-full')) {
                    this.eventSlotHeight = this.eventsGroup.eq(0).children('.top-info').outerHeight();
                    this.element.addClass('js-full');
                    this.placeEvents();
                    this.element.hasClass('modal-is-open') && this.checkEventModal();
                } else if (mq == 'mobile' && this.element.hasClass('js-full')) {
                    this.element.removeClass('js-full loading');
                    this.eventsGroup.children('ul').add(this.singleEvents).removeAttr('style');
                    this.eventsWrapper.children('.grid-line').remove();
                    this.element.hasClass('modal-is-open') && this.checkEventModal();
                } else if (mq == 'desktop' && this.element.hasClass('modal-is-open')) {
                    this.checkEventModal('desktop');
                    this.element.removeClass('loading');
                } else {
                    this.element.removeClass('loading');
                }
            };
            SchedulePlan.prototype.initEvents = function() {
                var self = this;
                this.singleEvents.each(function() {
                    var durationLabel = '<span class="event-date">' + $(this).data('start') + ' - ' + $(this).data('end') + '</span>';
                    $(this).find('.this-time').prepend($(durationLabel));
                    $(this).on('click', 'a', function(event) {
                        event.preventDefault();
                        if (!self.animating) self.openModal($(this));
                    });
                });
                this.modal.on('click', '.close', function(event) {
                    event.preventDefault();
                    if (!self.animating) self.closeModal(self.eventsGroup.find('.selected-event'));
                });
                this.element.on('click', '.cover-layer', function(event) {
                    if (!self.animating && self.element.hasClass('modal-is-open')) self.closeModal(self.eventsGroup.find('.selected-event'));
                });
            };
            SchedulePlan.prototype.placeEvents = function() {
                var self = this;
                this.singleEvents.each(function() {
                    var start = getScheduleTimestamp($(this).attr('data-start')),
                        duration = getScheduleTimestamp($(this).attr('data-end')) - start;
                    var eventTop = self.eventSlotHeight * (start - self.timelineStart) / self.timelineUnitDuration,
                        eventHeight = self.eventSlotHeight * duration / self.timelineUnitDuration;
                    $(this).css({
                        top: (eventTop - 1) + 'px',
                        height: (eventHeight + 1) + 'px'
                    });
                });
                this.element.removeClass('loading');
            };
            SchedulePlan.prototype.openModal = function(event) {
                var self = this;
                var mq = self.mq();
                this.animating = true;
                this.modalHeader.find('.event-name').text(event.find('.event-name').text());
                this.modalHeader.find('.event-place').text(event.find('.event-place').text());
                this.modalHeader.find('.event-date').text(event.find('.event-date').text());
                this.modalHeader.find('.event-content').text(event.find('.event-content').text());
                this.modal.attr('data-event', event.parent().attr('data-event'));
                this.modalBody.find('.event-info').text(event.find('.event-info').text()).addClass('content-loaded');
                self.element.addClass('content-loaded');
                this.element.addClass('modal-is-open');
                setTimeout(function() {
                    event.parent('li').addClass('selected-event');
                }, 10);
                if (mq == 'mobile') {
                    self.modal.one(transitionEnd, function() {
                        self.modal.off(transitionEnd);
                        self.animating = false;
                    });
                } else {
                    var eventTop = event.offset().top - $(window).scrollTop(),
                        eventLeft = event.offset().left,
                        eventHeight = event.innerHeight(),
                        eventWidth = event.innerWidth();
                    var windowWidth = $(window).width(),
                        windowHeight = $(window).height();
                    var modalWidth = (windowWidth * .8 > self.modalMaxWidth) ? self.modalMaxWidth : windowWidth * .8,
                        modalHeight = (windowHeight * .8 > self.modalMaxHeight) ? self.modalMaxHeight : windowHeight * .8;
                    var modalTranslateX = parseInt((windowWidth - modalWidth) / 2 - eventLeft),
                        modalTranslateY = parseInt((windowHeight - modalHeight) / 2 - eventTop);
                    var HeaderBgScaleY = modalHeight / eventHeight,
                        BodyBgScaleX = (modalWidth - eventWidth);
                    self.modal.css({
                        top: eventTop + 'px',
                        left: eventLeft + 'px',
                        height: modalHeight + 'px',
                        width: modalWidth + 'px',
                    });
                    transformElement(self.modal, 'translateY(' + modalTranslateY + 'px) translateX(' + modalTranslateX + 'px)');
                    self.modalHeader.css({
                        width: eventWidth + 'px',
                    });
                    self.modalBody.css({
                        marginLeft: eventWidth + 'px',
                    });
                    self.modalBodyBg.css({
                        height: eventHeight + 'px',
                        width: '1px',
                    });
                    transformElement(self.modalBodyBg, 'scaleY(' + HeaderBgScaleY + ') scaleX(' + BodyBgScaleX + ')');
                    self.modalHeaderBg.css({
                        height: eventHeight + 'px',
                        width: eventWidth + 'px',
                    });
                    transformElement(self.modalHeaderBg, 'scaleY(' + HeaderBgScaleY + ')');
                    self.modalHeaderBg.one(transitionEnd, function() {
                        self.modalHeaderBg.off(transitionEnd);
                        self.animating = false;
                        self.element.addClass('animation-completed');
                    });
                }
                if (!transitionsSupported) self.modal.add(self.modalHeaderBg).trigger(transitionEnd);
            };
            SchedulePlan.prototype.closeModal = function(event) {
                var self = this;
                var mq = self.mq();
                this.animating = true;
                if (mq == 'mobile') {
                    this.element.removeClass('modal-is-open');
                    this.modal.one(transitionEnd, function() {
                        self.modal.off(transitionEnd);
                        self.animating = false;
                        self.element.removeClass('content-loaded');
                        event.removeClass('selected-event');
                    });
                } else {
                    var eventTop = event.offset().top - $(window).scrollTop(),
                        eventLeft = event.offset().left,
                        eventHeight = event.innerHeight(),
                        eventWidth = event.innerWidth();
                    var modalTop = Number(self.modal.css('top').replace('px', '')),
                        modalLeft = Number(self.modal.css('left').replace('px', ''));
                    var modalTranslateX = eventLeft - modalLeft,
                        modalTranslateY = eventTop - modalTop;
                    self.element.removeClass('animation-completed modal-is-open');
                    this.modal.css({
                        width: eventWidth + 'px',
                        height: eventHeight + 'px'
                    });
                    transformElement(self.modal, 'translateX(' + modalTranslateX + 'px) translateY(' + modalTranslateY + 'px)');
                    transformElement(self.modalBodyBg, 'scaleX(0) scaleY(1)');
                    transformElement(self.modalHeaderBg, 'scaleY(1)');
                    this.modalHeaderBg.one(transitionEnd, function() {
                        self.modalHeaderBg.off(transitionEnd);
                        self.modal.addClass('no-transition');
                        setTimeout(function() {
                            self.modal.add(self.modalHeader).add(self.modalBody).add(self.modalHeaderBg).add(self.modalBodyBg).attr('style', '');
                        }, 10);
                        setTimeout(function() {
                            self.modal.removeClass('no-transition');
                        }, 20);
                        self.animating = false;
                        self.element.removeClass('content-loaded');
                        event.removeClass('selected-event');
                    });
                }
                if (!transitionsSupported) self.modal.add(self.modalHeaderBg).trigger(transitionEnd);
            }
            SchedulePlan.prototype.mq = function() {
                var self = this;
                return window.getComputedStyle(this.element.get(0), '::before').getPropertyValue('content').replace(/["']/g, '');
            };
            SchedulePlan.prototype.checkEventModal = function(device) {
                this.animating = true;
                var self = this;
                var mq = this.mq();
                if (mq == 'mobile') {
                    self.modal.add(self.modalHeader).add(self.modalHeaderBg).add(self.modalBody).add(self.modalBodyBg).attr('style', '');
                    self.modal.removeClass('no-transition');
                    self.animating = false;
                } else if (mq == 'desktop' && self.element.hasClass('modal-is-open')) {
                    self.modal.addClass('no-transition');
                    self.element.addClass('animation-completed');
                    var event = self.eventsGroup.find('.selected-event');
                    var eventTop = event.offset().top - $(window).scrollTop(),
                        eventLeft = event.offset().left,
                        eventHeight = event.innerHeight(),
                        eventWidth = event.innerWidth();
                    var windowWidth = $(window).width(),
                        windowHeight = $(window).height();
                    var modalWidth = (windowWidth * .8 > self.modalMaxWidth) ? self.modalMaxWidth : windowWidth * .8,
                        modalHeight = (windowHeight * .8 > self.modalMaxHeight) ? self.modalMaxHeight : windowHeight * .8;
                    var HeaderBgScaleY = modalHeight / eventHeight,
                        BodyBgScaleX = (modalWidth - eventWidth);
                    setTimeout(function() {
                        self.modal.css({
                            width: modalWidth + 'px',
                            height: modalHeight + 'px',
                            top: (windowHeight / 2 - modalHeight / 2) + 'px',
                            left: (windowWidth / 2 - modalWidth / 2) + 'px',
                        });
                        transformElement(self.modal, 'translateY(0) translateX(0)');
                        self.modalBodyBg.css({
                            height: modalHeight + 'px',
                            width: '1px',
                        });
                        transformElement(self.modalBodyBg, 'scaleX(' + BodyBgScaleX + ')');
                        self.modalHeader.css({
                            width: eventWidth + 'px',
                        });
                        self.modalBody.css({
                            marginLeft: eventWidth + 'px',
                        });
                        self.modalHeaderBg.css({
                            height: eventHeight + 'px',
                            width: eventWidth + 'px',
                        });
                        transformElement(self.modalHeaderBg, 'scaleY(' + HeaderBgScaleY + ')');
                    }, 10);
                    setTimeout(function() {
                        self.modal.removeClass('no-transition');
                        self.animating = false;
                    }, 20);
                }
            };
            var schedules = $('.cd-schedule');
            var objSchedulesPlan = [],
                windowResize = false;
            if (schedules.length > 0) {
                schedules.each(function() {
                    objSchedulesPlan.push(new SchedulePlan($(this)));
                });
            }
            $(window).on('resize', function() {
                if (!windowResize) {
                    windowResize = true;
                    (!window.requestAnimationFrame) ? setTimeout(checkResize): window.requestAnimationFrame(checkResize);
                }
            });
            $(window).keyup(function(event) {
                if (event.keyCode == 27) {
                    objSchedulesPlan.forEach(function(element) {
                        element.closeModal(element.eventsGroup.find('.selected-event'));
                    });
                }
            });
            var timeLineWrap = $('.cd-schedule-wrap'),
                timeLineDataClasesArr = [],
                timeLineList = $('.timeline-list'),
                timeLineListItem = $('.timeline-list li'),
                timeListNav = $('.timeline-list-nav');
            timeLineList.find('li').each(function() {
                timeLineDataClasesArr.push(($(this).attr('data-event')));
            });
            timeLineList.find('li').click(function() {
                $(this).parents('.time-table-header').removeClass('active');
                timeLineListItem.removeClass('active');
                $(this).addClass('active');
                var dataHref = $(this).attr('data-event');
                timeLineWrap.removeClass(function() {
                    for (var i = 0; i < timeLineDataClasesArr.length; i++) {
                        $(this).removeClass(timeLineDataClasesArr[i]);
                    }
                });
                timeLineWrap.addClass(dataHref);
            });
            timeListNav.find('.prev').click(function() {
                timeLineListItem.each(function(index) {
                    if ($(this).hasClass('active') && index >= 1) {
                        $(this).removeClass('active');
                        var prevElement = $(this).prev();
                        var dataHrefPrevElement = $(this).prev().attr('data-event');
                        prevElement.addClass('active');
                        timeLineWrap.removeClass(function() {
                            for (var i = 0; i < timeLineDataClasesArr.length; i++) {
                                $(this).removeClass(timeLineDataClasesArr[i]);
                            }
                        });
                        timeLineWrap.addClass(dataHrefPrevElement);
                    }
                })
            });
            var timneListArr = [];
            var nextIndex;
            var dataNextHref;
            timeLineListItem.each(function(index, value) {
                timneListArr.push(value);
            });
            timeListNav.find('.next').click(function() {
                timeLineListItem.each(function(index) {
                    if ($(this).hasClass('active')) {
                        nextIndex = index + 1;
                    }
                });
                dataNextHref = $(timneListArr[nextIndex]).attr('data-event');
                if (nextIndex < timneListArr.length) {
                    timeLineListItem.removeClass('active');
                    $(timneListArr[nextIndex]).addClass('active');
                    timeLineWrap.removeClass(function() {
                        for (var i = 0; i < timeLineDataClasesArr.length; i++) {
                            $(this).removeClass(timeLineDataClasesArr[i]);
                        }
                    });
                    timeLineWrap.addClass(dataNextHref);
                }
            });
        };
        $window.on('resize', function() {
            var dividerHead = $('.heading-with-aside-divider');
            var bodyLineHieght = parseInt(dividerHead.css('line-height'), 10);
            bodyLineHieght = (bodyLineHieght / 2);
            dividerHead.find('.divider').css({
                'position': 'relative',
                'top': bodyLineHieght
            });
        });
    });
    if (isIE) {
        $('.button').each(function() {
            var crrHeight = $(this).innerHeight();
            $(this).css({
                height: crrHeight
            })
        })
    }
    if ($('.list-marked')) {
        $('.link-default').each(function() {
            $(this).hover(function() {
                $(this).parent().css({
                    'left': '6px'
                })
            }, function() {
                $(this).parent().css({
                    'left': '0px'
                })
            })
        })
    }
    if (plugins.dateCountdown.length) {
        for (var i = 0; i < plugins.dateCountdown.length; i++) {
            var
                dateCountdownItem = $(plugins.dateCountdown[i]),
                countdownRender = function() {
                    dateCountdownItem.TimeCircles({
                        time: {
                            Seconds: {
                                show: !(window.innerWidth < 768),
                            }
                        }
                    }).rebuild();
                };
            dateCountdownItem.TimeCircles({
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
                animation: "smooth",
                bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 0.6,
                circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
                fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.03,
                time: {
                    Days: {
                        text: "Days",
                        show: true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    Hours: {
                        text: "Hours",
                        show: true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    Minutes: {
                        text: "Minutes",
                        show: true,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    },
                    Seconds: {
                        text: "Seconds",
                        show: false,
                        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
                    }
                }
            });
            countdownRender();
            window.addEventListener('resize', countdownRender);
        }
    }
}());