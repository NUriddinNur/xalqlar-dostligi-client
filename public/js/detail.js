const selectedProduct = window.localStorage.getItem('selectedProduct')
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
    const departments = await request("department", "GET")
    const categorys = await request("category", "GET")
    const {data: products} = await request("product?limit=100", "GET") 

   
    // render departments, categorys and carusel content 
    renderDepartmentCategorys(departments, categorys)
    renderOneProduct(selectedProduct) 
    renderRecomendProducts(products)

    ;(function ($) {
        "use strict"
        
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
                    $('.navbar .dropdown').off('mouseover').off('mouseout')
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
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo')
            return false;
        })

        $('.related-carousel').owlCarousel({
            loop: true,
            margin: 29,
            nav: false,
            autoplay: true,
            smartSpeed: 1000,
            responsive: {
                0:{
                    items:1
                },
                576:{
                    items:2
                },
                768:{
                    items:3
                },
                992:{
                    items:4
                }
            }
        });
    
    })(jQuery)
}())