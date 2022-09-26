let products = window.localStorage.getItem("products")

if(products) {
    let bascetCount = document.querySelectorAll(".bascet-count")
    products = JSON.parse(products)
    let count = products.reduce((a, b) => a + b.count, 0)
    for(let bascet of bascetCount) {
        bascet.textContent = count
    }
}


;(async function () {
    const {data: products} = await request("product?limit=30", "GET")  
    const departments = await request("department", "GET")
    const categorys = await request("category", "GET")

   
    // render departments, categorys and carusel content 
    renderDepartmentCategorys(departments, categorys)
    renderCategorys(categorys)
    renderToCarusel(products)
    renderRecomendedProducts(products)

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







