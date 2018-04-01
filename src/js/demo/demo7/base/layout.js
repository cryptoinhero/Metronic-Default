var mLayout = function() {
    var horMenu;
    var asideMenu;
    var asideMenuOffcanvas;
    var horMenuOffcanvas;

    //== Header
    var initStickyHeader = function() {
        var tmp;
        var headerEl = mUtil.get('m_header');
        var options = {
            offset: {},
            minimize:{}       
        };

        if (mUtil.attr(headerEl, 'm-minimize-mobile') == 'hide') {
            options.minimize.mobile = {};
            options.minimize.mobile.on = 'm-header--hide';
            options.minimize.mobile.off = 'm-header--show';
        } else {
            options.minimize.mobile = false;
        }

        if (mUtil.attr(headerEl, 'm-minimize') == 'hide') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--hide';
            options.minimize.desktop.off = 'm-header--show';
        } else {
            options.minimize.desktop = false;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-offset')) {
            options.offset.desktop = tmp;
        }

        if (tmp = mUtil.attr(headerEl, 'm-minimize-mobile-offset')) {
            options.offset.mobile = tmp;
        }        

        header = new mHeader('m_header', options);
    }

    //== Hor menu
    var initHorMenu = function() { 
        // init aside left offcanvas
        horMenuOffcanvas = new mOffcanvas('m_header_menu', {
            overlay: true,
            baseClass: 'm-aside-header-menu-mobile',
            closeBy: 'm_aside_header_menu_mobile_close_btn',
            toggleBy: {
                target: 'm_aside_header_menu_mobile_toggle',
                state: 'm-brand__toggler--active'
            }            
        });
        
        horMenu = new mMenu('m_header_menu', {
            submenu: {
                desktop: 'dropdown',
                tablet: 'accordion',
                mobile: 'accordion'
            },
            accordion: {   
                slideSpeed: 200,  // accordion toggle slide speed in milliseconds
                autoScroll: true, // enable auto scrolling(focus) to the clicked menu item
                expandAll: false   // allow having multiple expanded accordions in the menu
            }
        });
    }

    // handle vertical menu
    var initLeftAsideMenu = function() {
        // init aside menu
        var menu = $('#m_ver_menu');
        var menuDesktopMode = (menu.data('m-menu-dropdown') === '1' ? 'dropdown' : 'accordion');

        asideMenu = new mMenu('m_ver_menu', {
            // submenu setup
            submenu: {
                desktop: {
                    // by default the menu mode set to accordion in desktop mode
                    default: menuDesktopMode,
                    // whenever body has this class switch the menu mode to dropdown
                    state: {
                        body: 'm-aside-left--minimize',  
                        mode: 'dropdown'
                    }
                },
                tablet: 'accordion', // menu set to accordion in tablet mode
                mobile: 'accordion'  // menu set to accordion in mobile mode
            },

            //accordion setup
            accordion: {
                autoScroll: true,
                expandAll: false
            }            
        });
    }

    // handle vertical menu
    var initLeftAside = function() {
        // init aside left offcanvas
        var asideLeft = mUtil.get('m_aside_left');
        var asideOffcanvasClass = mUtil.hasClass(asideLeft, 'm-aside-left--offcanvas-default') ? 'm-aside-left--offcanvas-default' : 'm-aside-left';

        asideMenuOffcanvas = new mOffcanvas('m_aside_left', {
            baseClass: asideOffcanvasClass,
            overlay: true,
            closeBy: 'm_aside_left_close_btn',
            toggleBy: {
                target: 'm_aside_left_offcanvas_toggle',
                state: 'm-brand__toggler--active'                
            }            
        });    

        $('#m_aside_left').find('.m-menu__item--submenu-fullheight').each(function() {
            var obj = $(this).find('> .m-menu__submenu > .m-menu__wrapper');

            if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                // destroy if the instance was previously created
                mApp.destroyScroller(obj);
                return;
            }

            var height = mUtil.getViewPort().height;

            alert(height);

            // create/re-create a new instance
            mApp.initScroller(obj, {height: height}, true);
        });   
    }

    //== Topbar
    var initTopbar = function() {
        $('#m_aside_header_topbar_mobile_toggle').click(function() {
            $('body').toggleClass('m-topbar--on');
        });                                  

        // Animated Notification Icon 
        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').addClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').addClass('m-animate-blink');
        }, 3000);

        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').removeClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').removeClass('m-animate-blink');
        }, 6000);
    }

    //== Quicksearch
    var initQuicksearch = function() {
        if ($('#m_quicksearch').length === 0 ) {
            return;
        }

        quicksearch = new mQuicksearch('m_quicksearch', {
            mode: mUtil.attr( 'm_quicksearch', 'm-quicksearch-mode' ), // quick search type
            minLength: 1
        });    

        //<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">Something went wrong</div></div>

        quicksearch.on('search', function(the) {
            the.showProgress();  
                      
            $.ajax({
                url: 'inc/api/quick_search.php',
                data: {query: the.query},
                dataType: 'html',
                success: function(res) {
                    the.hideProgress();
                    the.showResult(res);                     
                },
                error: function(res) {
                    alert(22);
                    the.hideProgress();
                    the.showError('Connection error. Pleae try again later.');      
                }
            });
        });  
    }

    //== Scrolltop
    var initScrollTop = function() {
        var scrollTop = new mScrollTop('m_scroll_top', {
            offset: 300,
            speed: 600
        });
    }


    return {
        init: function() {  
            this.initHeader();
            this.initAside();
        },

        initHeader: function() {
            initStickyHeader();
            initHorMenu();
            initTopbar();
            initQuicksearch();
            initScrollTop();
        },

        initAside: function() {
            initLeftAside();
            initLeftAsideMenu();     
        },

        getAsideMenu: function() {
            return asideMenu;
        },

        closeMobileAsideMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                asideMenuOffcanvas.hide();
            }
        },

        closeMobileHorMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                horMenuOffcanvas.hide();
            }
        }
    };
}();

$(document).ready(function() {
    if (mUtil.isAngularVersion() === false) {
        mLayout.init();
    }
});
