let products = window.localStorage.getItem("products")

if(products) {
    let bascetCount = document.querySelectorAll(".bascet-count")
    try {
        products = JSON.parse(products)
        let count = products.reduce((a, b) => a + b.count, 0)
        for(let bascet of bascetCount) {
            bascet.textContent = count
        }
    }catch(error) {
        window.localStorage.clear()
        window.location = '/'
        console.log(error);
    }
}

;(async function () {
    const departments = await request("department", "GET")
    const categorys = await request("category", "GET")

    renderDepartmentCategorys(departments, categorys)

    if(products) {
        renderBascetProdukts(products)
    }

    ;(function ($) {
        "use strict";
        
        // Dropdown on mouse hover
        $(document).ready(function () {
            function toggleNavbarMethod() {
                if ($(window).width() > 992) {
                    $('.navbar .dropdown').on('mouseover', function () {
                        $('.dropdown-toggle', this).trigger('click')
                    }).on('mouseout', function () {
                        $('.dropdown-toggle', this).trigger('click').blur()
                    })
                } else {
                    $('.navbar .dropdown').off('mouseover').off('mouseout');
                }
            }
            toggleNavbarMethod();
            $(window).resize(toggleNavbarMethod)
        });
        
        
        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.back-to-top').fadeIn('slow')
            } else {
                $('.back-to-top').fadeOut('slow')
            }
        })
        $('.back-to-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo')
            return false;
        })
    })(jQuery)
})()
