const selectedCategory = window.localStorage.getItem('selectedCategory')
const selectedDepartment = window.localStorage.getItem('selectedDepartment')
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

    renderDepartmentCategorys(departments, categorys)

    let  {data: products} = await request(`product?departmentId=${selectedDepartment}&categoryId=${selectedCategory}&page=${1}&limit=12`, "GET")
    renderProducts(products, selectedDepartment, selectedCategory)


    let countItems = Math.ceil(products.count / 12)
    let items = []
    for (let i = 1; i <= countItems; i++) {

        let li = document.createElement("li")
        let a = document.createElement("a")
        if(i == 1) {
            li.classList.add("active")
        }

        li.classList.add("page-item")
        a.classList.add("page-link")
        a.innerHTML = i
        li.append(a)
        pagination.append(li)
        items.push(li)
    }


    for (let item of items) {
        item.addEventListener('click', async function(){
            let active = document.querySelector("#pagination li.active")
            if(active) {
                active.classList.remove("active")
            }
            this.classList.add("active")
            let pageNum = this.children[0].innerHTML
            let  {data: products} = await request(`product?departmentId=${selectedDepartment}&categoryId=${selectedCategory}&page=${pageNum}`, "GET")
            renderProducts(products, selectedDepartment, selectedCategory)

        })

    }

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
    
    })(jQuery)
}())