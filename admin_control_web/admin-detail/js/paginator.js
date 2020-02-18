

/**
 * github.com/okisht
 * paginator functions
 * @namespace paginator
 */
var paginator = (function () {
    'use strict';

    /**
    * the function that creates pages dynamically
    * you can call this function when you need to change total page of your pages, and paginations parent's class
    * @function paginatorPages
    * @memberof paginator
    */
    var paginatorPages = (function (pageTotal, changedClass, selectedPage) {

        $('.jsPages').remove();
        $('.js-paginator').data({ 'pageTotal': pageTotal, 'pageSelected': 1 });
        $('.jsNavPage[data-nav="-1"]').addClass('disabled');

        if (changedClass != undefined) {
            $('.jsPagination').removeClass().addClass('jsPagination');
            $('.jsPagination').addClass('pagination jsPagination ' + changedClass)
            $('.js-paginator').data({ 'paginationClass': changedClass });
        }

        if (selectedPage < 1 || selectedPage == undefined) {
            selectedPage = 1;
        }

        var newPages = '';
        // if number of pages more than 1, this enables next page 
        if (pageTotal > 1) {
            $('.jsNavPage[data-nav="1"]').removeClass('disabled');
        } else {
            $('.jsNavPage[data-nav="1"]').addClass('disabled');
        }

        // this loop creates page buttons
        for (var i = 0; i < pageTotal; i++) {
            var pageNumber = i + 1;
            var pageClass = '';

            if (pageNumber === selectedPage) {
                // if you send selectedPage parameter this ll be add selected class to that button and css will remark the button.
                pageClass = 'selected';
            }

            newPages = newPages +
                '<li class="page-item jsPages ' + pageClass + '"><span class="page-link jsPage" data-rel="' + pageNumber + '">' + pageNumber + '</span></li>'

            if (i === 9 && pageNumber != pageTotal) {
                var lastpage = i + 1;
                lastpage = lastpage + 1;
                newPages = newPages +
                    '<li class="page-item jsPages jsNewPages"><span class="page-link jsNewPage" data-load="' + lastpage + '" >...</span></li>'
                break;
            }

        }
        $('.jspreviousPage').after(newPages);
    })

    /**
    * this will create next page bundle 
    * @function loadMorePages
    * @memberof paginator
    */
    var loadMorePages = (function () {

        $(document).on('click', '.jsNewPage', function () {

            var maxPage = $('.js-paginator').data('pageTotal');
            var isAnySelected = $('.js-paginator').data('pageSelected');

            if (isAnySelected > 0) {
                var selectedPage = isAnySelected;
            }

            var startFrom = parseInt($(this).attr('data-load'));
            var newPages = '<li class="page-item jsPages jsOldPages"><span class="page-link jsOldPage" data-load="' + startFrom + '" >...</span></li>';
            for (var i = startFrom; i < maxPage + 1; i++) {

                var selected = '';
                if (i == selectedPage) {
                    selected = 'selected';
                }
                newPages = newPages +
                    '<li class="page-item jsPages ' + selected + '"><span class="page-link jsPage" data-rel="' + i + '">' + i + '</span></li>';

                if (i === startFrom + 9 && i != maxPage) {
                    var lastpage = i + 1;
                    newPages = newPages +
                        '<li class="page-item jsPages jsNewPages"><span class="page-link jsNewPage" data-load="' + lastpage + '" >...</span></li>'
                    break;
                }
            }
            $('.jsPages').remove();
            $('.jspreviousPage').after(newPages);
        })
    })

    /**
    * this function will create previous page bundle 
    * @function loadOldPages
    * @memberof paginator
    */
    var loadOldPages = (function () {
        $(document).on('click', '.jsOldPage', function () {

            var isAnySelected = $('.js-paginator').data('pageSelected');

            if (isAnySelected > 0) {
                var selectedPage = isAnySelected;
            }
            var startFrom = parseInt($(this).attr('data-load'));
            var newPages = '';

            if (startFrom > 18) {
                var firstPage = startFrom - 10;
                newPages = '<li class="page-item jsPages jsOldPages"><span class="page-link jsOldPage" data-load="' + firstPage + '" >...</span></li>';
            }

            else if (startFrom > 11 && startFrom <= 18) {
                var firstPage = 10;
                newPages = '<li class="page-item jsPages jsOldPages"><span class="page-link jsOldPage" data-load="' + firstPage + '" >...</span></li>';
            }

            for (var i = startFrom - 10; i < startFrom; i++) {
                if (i > 0) {

                    var selected = '';
                    if (i == selectedPage) {
                        selected = 'selected';
                    }
                    newPages = newPages +
                        '<li class="page-item jsPages ' + selected + '"><span class="page-link jsPage" data-rel="' + i + '">' + i + '</span></li>';

                    if (i === startFrom - 1) {
                        var lastpage = i + 1;
                        newPages = newPages +
                            '<li class="page-item jsPages jsNewPages"><span class="page-link jsNewPage" data-load="' + lastpage + '" >...</span></li>'
                        break;
                    }
                }
            }
            $('.jsPages').remove();
            $('.jspreviousPage').after(newPages);
        })

    })

    /**
    * the function will be triggered when any page selected
    * @function pageSelection
    * @memberof paginator
    */
    var pageSelection = (function (triggerFunc) {
        $(document).on('click', '.jsPage', function (e) {
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
                var selectedPage = parseInt($(this).attr('data-rel'));
                $('.jsPages').removeClass('selected');
                $(this).parent().addClass('selected');
                $('.js-paginator').data({ 'pageSelected': selectedPage })
                pageLimitControl();
                triggerFunc();
            }
        })
    })


    /**
    * destroys paginator
    * @function destroyPaginator
    * @memberof paginator
    */
    var destroyPaginator = (function () {
        $('.js-paginator').empty();
    })


    /**
    * this will trigger function for 'next page' or 'previous page' selections
    * @function navPageSelection
    * @memberof paginator
    */
    var navPageSelection = (function () {
        $(document).on('click', '.jsNavPage', function (e) {
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
                var selectedPage = $('.js-paginator').data('pageSelected') + parseInt($(this).attr('data-nav'));
                $('.js-paginator').data({ 'pageSelected': selectedPage })

                if ($(this).data('nav') > 0) {
                    if ($('.jsNewPage').data('load') == selectedPage) {
                        $('.jsNewPage').trigger('click');
                        $('.jsPage[data-rel="' + selectedPage + '"]').trigger('click');
                    }
                    else {
                        $('.jsPage[data-rel="' + selectedPage + '"]').trigger('click');
                    }
                } else {
                    if ($('.jsOldPage').data('load') - 1 == selectedPage) {
                        $('.jsOldPage').trigger('click');
                        $('.jsPage[data-rel="' + selectedPage + '"]').trigger('click');
                    }
                    else {
                        $('.jsPage[data-rel="' + selectedPage + '"]').trigger('click');
                    }
                }
                pageLimitControl();
            }
        })
    })


    /**
    *  first and last page limit controls
    * @function pageLimitControl
    * @memberof paginator
    */
    var pageLimitControl = (function () {
        var lastPage = $('.js-paginator').data('pageTotal');
        var selectedPage = $('.js-paginator').data('pageSelected');
        if (selectedPage == 1) {
            $('.jsNavPage[data-nav="-1"]').addClass('disabled');
        } else {
            $('.jsNavPage[data-nav="-1"]').removeClass('disabled');
        }
        if (lastPage == selectedPage) {
            $('.jsNavPage[data-nav="1"]').addClass('disabled');
        } else {
            $('.jsNavPage[data-nav="1"]').removeClass('disabled');
        }
    })



    function initPaginator(data) {

        if (data.previousPage == undefined || data.previousPage == null) {
            data.previousPage = 'Previous Page'
        }

        if (data.nextPage == undefined || data.nextPage == null) {
            data.nextPage = 'Next Page'
        }

        if (data.totalPage == undefined || data.totalPage == null) {
            console.log('You should send total page number as parameter to initPaginator function')
        }

        destroyPaginator();
        var paginatorHtml = '<nav aria-label="Page navigation" class="navigation"> <ul class="pagination jsPagination"> <li class="page-item jspreviousPage"> <a class="page-link jsNavPage disabled" data-nav="-1" href="#">' + data.previousPage + '</a> </li> <li class="page-item jsNextPage"> <a class="page-link jsNavPage disabled"  data-nav="1" href="#">' + data.nextPage + '</a> </li> </ul> </nav>'
        $('.js-paginator').append(paginatorHtml);

        $('.js-paginator').data({ 'pageTotal': data.totalPage, 'pageSelected': 1, 'paginationClass': data.paginationClass })
        $('.jsPagination').addClass(data.paginationClass);
        paginatorPages(data.totalPage, data.paginationClass, data.selectedPage);
        pageSelection(data.triggerFunc);
        loadMorePages();
        loadOldPages();
        navPageSelection();
    }


    return {
        initPaginator: initPaginator,
        destroyPaginator: destroyPaginator,
        paginatorPages: paginatorPages
    }

})();

