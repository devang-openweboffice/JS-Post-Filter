jQuery.noConflict();
jQuery(document).ready(function() {
    var styleFilter = [],
        finishFilter = [];

    function updateFilters() {
        let products = jQuery('.product-wrapper').toArray();
        for (let i = 0; i < products.length; i++) {
            let productStyle = jQuery(products[i]).data("style");
            let productFinish = jQuery(products[i]).data("finish");
            if (styleFilter.length > 0 && finishFilter.length === 0) {
                addAndRemoveClass(styleFilter, productStyle, products[i]);
            }
            if (finishFilter.length > 0 && styleFilter.length === 0) {
                addAndRemoveClass(finishFilter, productFinish, products[i]);
            }
            if (styleFilter.length > 0 && finishFilter.length > 0) {
                jQuery.each(styleFilter, function(k) {
                    var flag = true;
                    jQuery.each(finishFilter, function(l) {
                        if ((jQuery.inArray(styleFilter[k], productStyle)) >= 0 && (jQuery.inArray(finishFilter[l], productFinish)) >= 0) {
                            jQuery(products[i]).addClass('show');
                            jQuery(products[i]).removeClass('hide');
                            flag = false;
                            return false;
                        } else {
                            jQuery(products[i]).removeClass('show');
                            jQuery(products[i]).addClass('hide');
                        }
                    })
                    return flag;
                })
            }
            if (styleFilter.length === 0 && finishFilter.length === 0) {
                jQuery(products[i]).removeClass('hide');
                jQuery(products[i]).addClass('show');
            }
        }
        isEmpty();
    }

    function isEmpty() {
        let products = jQuery('.product-wrapper:not(.hide)').toArray();
        jQuery('.no-result').remove();
        if (products.length === 0) {
            jQuery(".category-filters").after('<p class="no-result">No products found on your matching selection!!</p>');
        } else {
            jQuery('.no-result').remove();
        }
    }

    function addAndRemoveClass(filterType, productArray, product) {
        jQuery.each(filterType, function(j) {
            if ((jQuery.inArray(filterType[j], productArray)) >= 0) {
                jQuery(product).removeClass('hide');
                jQuery(product).addClass('show');
                return false;
            } else {
                jQuery(product).removeClass('show');
                jQuery(product).addClass('hide');
            }
        });
    }

    function sortProductsPriceAscending(products) {
        products.sort(function(a, b) {
            return jQuery(a).data("price") - jQuery(b).data("price")
        });
        jQuery(".products-list").html(products);
    }

    function sortProductsPriceDescending(products) {
        products.sort(function(a, b) {
            return jQuery(b).data("price") - jQuery(a).data("price")
        });
        jQuery(".products-list").html(products);
    }

    function emptyDiv(classs) {
        jQuery(`.${classs}`).empty();
    }

    function filterDropdown(el, filterType) {
        var $el = jQuery(el)
        $el.each(function(i, element) {
            $label = jQuery(this).find('.dropdown-label'), $inputs = jQuery(this).find('.check'), $label.on('click', () => {
                jQuery(this).toggleClass('open');
            });
            $inputs.on('change', function() {
                var checked = jQuery(this).is(':checked');
                var checkedItem = jQuery(this).val();
                var products = jQuery('.product-wrapper');
                $el.removeClass('open');
                if (filterType === "styleFilter") {
                    if (checked) {
                        styleFilter.push(checkedItem);
                    } else {
                        let index = styleFilter.indexOf(checkedItem);
                        if (index >= 0) {
                            styleFilter.splice(index, 1);
                        }
                    }
                    updateFilters();
                    jQuery(".style-filter").empty();
                    if (styleFilter.length > 0) {
                        jQuery(".style-filter").append(`<span><b>Style:</b> </span>`);
                        for (var x = 0; x < styleFilter.length; x++) {
                            jQuery(".style-filter").append(`
                    <span><span class="remove_category_filter" data-val=${styleFilter[x]}><i class="fa fa-minus-circle" aria-hidden="true"></i></span>
                    <span>${styleFilter[x].replace(/-/g,' ')}</span></span>`);
                        }
                    }
                }
                if (filterType === "finishFilter") {
                    if (checked) {
                        finishFilter.push(checkedItem);
                    } else {
                        let index = finishFilter.indexOf(checkedItem);
                        if (index >= 0) {
                            finishFilter.splice(index, 1);
                        }
                    }
                    updateFilters();
                    jQuery(".finish-filter").empty();
                    if (finishFilter.length > 0) {
                        jQuery(".finish-filter").append(`<span><b>Finish:</b> </span>`);
                        for (var y = 0; y < finishFilter.length; y++) {
                            jQuery(".finish-filter").append(`
                    <span><span class="remove_category_filter" data-val=${finishFilter[y]}><i class="fa fa-minus-circle" aria-hidden="true"></i></span>
                    <span>${finishFilter[y].replace(/-/g,' ')}</span></span>`);
                        }
                    }
                }
                if (filterType === "colorSort") {
                    emptyDiv('color-filter');
                    emptyDiv('price-filter');
                    jQuery(".color-filter").append(`<span><b>Color:</b> </span>`);
                    if (checkedItem == '1') {
                        jQuery(".color-filter").append(`<span>Light to Dark</span>`);
                        products.sort(function(a, b) {
                            return jQuery(a).data("color") > jQuery(b).data("color") ? 1 : -1;
                        });
                        jQuery(".products-list").html(products);
                    } else if (checkedItem == '10') {
                        jQuery(".color-filter").append(`<span>Dark to Light</span>`);
                        products.sort(function(a, b) {
                            return jQuery(b).data("color") > jQuery(a).data("color") ? 1 : -1;
                        });
                        jQuery(".products-list").html(products);
                    }
                }
                if (filterType === "priceSort") {
                    emptyDiv('color-filter');
                    emptyDiv('price-filter');
                    jQuery(".price-filter").append(`<span><b>Price:</b> </span>`);
                    if (checkedItem == 'asc') {
                        jQuery(".price-filter").append(`<span>Lowest to Highest</span>`);
                        sortProductsPriceAscending(products);
                    } else if (checkedItem == 'desc') {
                        jQuery(".price-filter").append(`<span>Highest to Lowest</span>`);
                        sortProductsPriceDescending(products);
                    }
                }
            });
            jQuery(document).on('click touchstart', e => {
                if (!jQuery(e.target).closest(jQuery(this)).length) {
                    jQuery(this).removeClass('open');
                }
            });
        });
    };

    function removeFilter(el, filterType, filterClass, filterWrapper) {
        el.parent().remove();
        var checkedItem = el.data('val');
        let index = filterType.indexOf(checkedItem);
        if (index >= 0) {
            filterType.splice(index, 1);
        }
        updateFilters();
        if (filterType.length === 0) {
            jQuery(`.${filterClass}`).empty();
        }
        jQuery(`.${filterWrapper} #${checkedItem}`).prop('checked', false);
    }
    jQuery('.style-filter ').on('click', '.remove_category_filter', function() {
        removeFilter(jQuery(this), styleFilter, 'style-filter', 'cat-dropdown')
    })
    jQuery('.finish-filter ').on('click', '.remove_category_filter', function() {
        removeFilter(jQuery(this), finishFilter, 'finish-filter', 'finish-dropdown')
    })
    jQuery('.clear-filters').on('click', function() {
        location.reload();
    });
    filterDropdown('.cat-dropdown', 'styleFilter');
    filterDropdown('.finish-dropdown', 'finishFilter');
    filterDropdown('.color-dropdown', 'colorSort');
    filterDropdown('.price-dropdown', 'priceSort');
});