const Api = "http://165.22.66.59:3001/api/"


async function request(root, method, body) {
    let response = await fetch(Api + root, {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            token: window.localStorage.getItem('token')
        },
        body: body,
    })

    if (response.status === 401) {
        document.location = '/'
    }
    return await response.json()
}


function selctOneProduct(id) {
    return () => {
        window.localStorage.setItem("selectedProduct", id)
        window.location = '/detail'
    }
}

function selectDepartment(id) {
    return () => {
        window.localStorage.setItem('selectedDepartment', id)
        window.localStorage.setItem('selectedCategory', "")
        window.location = '/shop'
    }
}

function selectCategory(id) {
    return () => {
        window.localStorage.setItem('selectedCategory', id)
        window.localStorage.setItem("selectedDepartment", "")
        window.location = '/shop'
    }
}

function minutBtn(id, element, total, product) {
    return () => {
        if (element.value > 1 && element.value != 0) {
            element.value = element.value - 1
            totalSum.textContent = totalSum.textContent - product.data.price
            total.textContent = total.textContent - product.data.price
            

            products.map(e => {
                if (e.id === id) {
                    e.count--
                    window.localStorage.setItem("products", JSON.stringify(products))
                    let bascet = document.querySelectorAll(".bascet-count")
                    for (let b of bascet) {
                        b.textContent--
                    }
                }
            })
        }
    }
}

function plusBtn(id, element, total, product) {
    return () => {
        element.value = +element.value + 1
        totalSum.textContent = +totalSum.textContent + +product.data.price
        total.textContent = +total.textContent + +product.data.price

        products.map(e => {
            if (e.id === id) {
                e.count++
                window.localStorage.setItem("products", JSON.stringify(products))
                let bascet = document.querySelectorAll(".bascet-count")
                for (let b of bascet) {
                    b.textContent++
                }
            }
        })
    }
}


function deleteInBascet(id) {
    return () => {
        let products = window.localStorage.getItem("products")
        products = JSON.parse(products)
        products = products.filter(e => e.id !== id)
        window.localStorage.setItem("products", JSON.stringify(products))
        window.location = "/cart"
    }
}


async function renderBascetProdukts(products) {
    let sum = 0
    for (let product of products) {
        let response = await request(`product/${product.id}`)
        const tr = document.createElement("tr")
        const td1 = document.createElement("td")
        const td2 = document.createElement("td")
        const td3 = document.createElement("td")
        const td4 = document.createElement("td")
        const td5 = document.createElement("td")
        const img = document.createElement("img")
        const div1 = document.createElement("div")
        const div2 = document.createElement("div")
        const div3 = document.createElement("div")
        const button1 = document.createElement("button")
        const button2 = document.createElement("button")
        const button3 = document.createElement("button")
        const i1 = document.createElement("i")
        const i2 = document.createElement("i")
        const i3 = document.createElement("i")
        const input = document.createElement("input")
        const div = document.createElement("div")

        td1.classList.add("align-middle")
        td2.classList.add("align-middle")
        td3.classList.add("align-middle")
        td4.classList.add("align-middle")
        td5.classList.add("align-middle")
        img.style.width = "50px"
        div1.classList.add("input-group", "quantity", "mx-auto")
        div2.classList.add("input-group-btn")
        div3.classList.add("input-group-btn")
        button1.classList.add("btn", "btn-sm", "btn-primary", "btn-minus")
        button2.classList.add("btn", "btn-sm", "btn-primary", "btn-plus")
        button3.classList.add("btn", "btn-sm", "btn-danger")
        input.classList.add("form-control", "form-control-sm", "g-secondary", "border-0", "text-center")
        i1.classList.add("fa", "fa-minus")
        i2.classList.add("fa", "fa-plus")
        i3.classList.add("fa", "fa-times")
        div1.style.width = "100px"
        input.type = "text"


        img.src = response.data.img
        td2.textContent = "₩ " + response.data.price
        input.value = product.count
        td1.appendChild(img)
        td4.textContent = response.data.price * product.count
        div.append(response.data.name)
        td1.appendChild(div)
        td3.append(div1)
        div1.append(div2, input, div3)
        div2.append(button1)
        button1.append(i1)
        div3.append(button2)
        button2.append(i2)
        button3.append(i3)
        td5.append(button3)
        tr.append(td1, td2, td3, td4, td5)
        orderList.append(tr)


        button3.addEventListener("click", deleteInBascet(product.id))
        button1.addEventListener("click", minutBtn(product.id, input, td4, response))
        button2.addEventListener("click", plusBtn(product.id, input, td4, response))

        sum += response.data.price * product.count
    }
    totalSum.textContent = sum
}

async function renderProducts(products, departmentId, categoryId) {
    categoryBtn.innerHTML = ""

    if (departmentId) {
        const { data } = await request("department/" + departmentId, "GET")
        breadcrumb.textContent = data.name

        for (let c of data.categories) {
            const button = document.createElement("button")
            const i = document.createElement("i")

            button.classList.add("btn", "btn-sm", "btn-light", "ml-2")
            i.classList.add("fa")
            button.addEventListener("click", selectCategory(c.id))
            i.textContent = c.name
            button.append(i)
            categoryBtn.append(button)
        }
    }
    if (categoryId) {
        const { data } = await request("category/" + categoryId, "GET")
        const response = await request("department/" + data.departmentId, "GET")
        breadcrumb.textContent = data.name

        for (let c of response.data.categories) {
            const button = document.createElement("button")
            const i = document.createElement("i")

            button.classList.add("btn", "btn-sm", "btn-light", "ml-2")
            i.classList.add("fa")
            button.addEventListener("click", selectCategory(c.id))
            i.textContent = c.name
            button.append(i)
            categoryBtn.append(button)
        }
    }

    productList.innerHTML = null

    for (let p of products.rows) {
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const div3 = document.createElement('div')
        const div4 = document.createElement('div')
        const div5 = document.createElement('div')
        const img = document.createElement('img')
        const a = document.createElement('a')
        const h5 = document.createElement('h5')

        div1.classList.add("col-lg-3", "col-md-6", "col-sm-6", "pb-1")
        div2.classList.add("product-item", "bg-light", "mb-4")
        div3.classList.add("product-img", "position-relative", "overflow-hidden")
        div4.classList.add("text-center", "py-4")
        div5.classList.add("d-flex", "align-items-center", "justify-content-center", "mt-2")
        img.classList.add("img-fluid", "w-100")
        a.classList.add("h6", "text-decoration-none", "text-truncate")
        div1.addEventListener('click', selctOneProduct(p.id))
        img.style.height = "290px"

        img.src = p.img
        h5.textContent = p.price + " ₩ / 1" + p.measure
        a.text = p.name

        div1.append(div2)
        div2.append(div3, div4)
        div3.append(img)
        div4.append(a, div5)
        div5.append(h5)
        productList.append(div1)
    }
}


function renderDepartmentCategorys(departments, categorys) {
    for (let d of departments.data) {
        const div1 = document.createElement('div')
        const a = document.createElement('a')
        const i = document.createElement('i')

        div1.classList.add("nav-item", "dropdown", "dropright")
        a.classList.add("nav-link", "dropdown-toggle")
        a.setAttribute("data-toggle", "dropdown")
        i.classList.add("fa", "fa-angle-right", "float-right", "mt-1")
        a.textContent = d.name

        a.append(i)
        div1.append(a)
        a.addEventListener("click", selectDepartment(d.id))

        const div2 = document.createElement('div')
        div2.classList.add("dropdown-menu", "position-absolute", "rounded-0", "m-0")

        for (let c of categorys.data) {
            if (c.departmentId === d.id) {
                const a = document.createElement('a')

                a.classList.add("dropdown-item")
                a.textContent = c.name
                div2.append(a)
                div1.append(div2)
                a.addEventListener("click", selectCategory(c.id))
            }
        }
        departmentList.append(div1)
    }

}

async function renderCategorys(categorys) {
    for (let e of categorys.data) {
        const products = await request("product?categoryId=" + e.id, "GET")
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const div3 = document.createElement('div')
        const div4 = document.createElement('div')
        const a = document.createElement('a')
        const img = document.createElement('img')
        const h6 = document.createElement('h6')
        const small = document.createElement('small')

        div1.classList.add("col-lg-3", "col-md-4", "col-sm-6", "pb-1")
        a.classList.add("text-decoration-none")
        div2.classList.add("cat-item", "d-flex", "align-items-center", "mb-4")
        div3.classList.add("overflow-hidden")
        div3.style.width = '100px'
        div3.style.height = '100px'
        img.classList.add("img-fluid")
        div4.classList.add("flex-fill", "pl-3")
        small.classList.add("text-body")
        img.style.height = "100%"
        div1.addEventListener('click', selectCategory(e.id))

        h6.textContent = e.name
        small.textContent = products.data.count + " Products"
        img.src = products.data.rows[0]?.img ? products.data.rows[0].img : "img/default.png"

        div4.append(h6, small)
        div3.append(img)
        div2.append(div3, div4)
        a.append(div2)
        div1.append(a)
        categoryList.append(div1)
    }
}

function renderToCarusel(products) {
    const bannerTexts = document.getElementsByClassName('bannerText')
    const buttonShop = document.getElementsByClassName('buttonShop')
    const descriptions = document.getElementsByClassName('desc')
    const carusels = document.getElementsByClassName('carusel')
    let unique
    products = products.rows.filter(p => p.department.name !== "Ichimliklar")
    
    if(products.length) {
        for (let i = 0; i < 3; i++) {
            let r = Math.floor(Math.random() * products.length)
            if (unique == r) {
                --i
                continue
            }
            carusels[i].src = products[r]?.img
            bannerTexts[i].textContent = products[r]?.name
            descriptions[i].textContent = products[r]?.description
            buttonShop[i].addEventListener('click', selctOneProduct(products[r]?.id))
            unique = r
        }
    }
}

// Render recomended product to main page
function renderRecomendedProducts({ rows: products }) {
    let numbers = randomNumbers(products.length, 8)

    for (let p of numbers) {
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const div3 = document.createElement('div')
        const div4 = document.createElement('div')
        const div5 = document.createElement('div')
        const img = document.createElement('img')
        const a = document.createElement('a')
        const h5 = document.createElement('h5')

        div1.classList.add("col-lg-3", "col-md-4", "col-sm-6", "pb-1")
        div2.classList.add("product-item", "bg-light", "mb-4")
        div3.classList.add("product-img", "position-relative", "overflow-hidden")
        img.classList.add("img-fluid", "w-100")
        div4.classList.add("text-center", "py-4")
        a.classList.add("h6", "text-decoration-none", "text-truncate")
        div5.classList.add("d-flex", "align-items-center", "justify-content-center", "mt-2")
        img.style.height = "290px"

        img.src = products[p].img
        a.textContent = products[p].name
        h5.textContent = products[p].price + " ₩ / 1" + products[p].measure
        div1.addEventListener('click', selctOneProduct(products[p].id))

        div3.append(img)
        div2.append(div3)
        div5.append(h5)
        div4.append(a)
        div4.append(div5)
        div2.append(div4)
        div1.append(div2)
        recomendedProducts.append(div1)
    }
}

// Render recomended product to product page
function renderRecomendProducts({ rows: products }) {
    let numbers = randomNumbers(products.length, products.length)

    for (let p of numbers) {
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        const div3 = document.createElement('div')
        const div4 = document.createElement('div')
        const img = document.createElement('img')
        const a = document.createElement('a')
        const h5 = document.createElement('h5')

        div1.classList.add("product-item", "bg-light")
        div2.classList.add("product-img", "position-relative", "overflow-hidden")
        img.classList.add("img-fluid", "w-100")
        div3.classList.add("text-center", "py-4")
        a.classList.add("h6", "text-decoration-none", "text-truncate")
        div4.classList.add("d-flex", "align-items-center", "justify-content-center", "mt-2")
        img.style.height = "290px"

        img.src = products[p].img
        a.textContent = products[p].name
        h5.textContent = products[p].price + " ₩ / 1" + products[p].measure
        div1.addEventListener('click', selctOneProduct(products[p].id))

        div1.append(div2, div3)
        div2.append(img)
        div3.append(a, div4)
        div4.append(h5)
        recomendProducts.append(div1)
    }
}

async function renderOneProduct(idProduct) {
    const product = await request('product/' + idProduct, "GET")

    const button1 = document.createElement('button')
    const button2 = document.createElement('button')
    const button3 = document.createElement('button')
    const strong = document.createElement('strong')
    const input = document.createElement('input')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const div3 = document.createElement('div')
    const div4 = document.createElement('div')
    const div5 = document.createElement('div')
    const div6 = document.createElement('div')
    const div7 = document.createElement('div')
    const div8 = document.createElement('div')
    const div9 = document.createElement('div')
    const div10 = document.createElement('div')
    const img = document.createElement('img')
    const h31 = document.createElement('h3')
    const h32 = document.createElement('h3')
    const i1 = document.createElement('i')
    const i2 = document.createElement('i')
    const i3 = document.createElement('i')
    const i4 = document.createElement('i')
    const i5 = document.createElement('i')
    const a1 = document.createElement('a')
    const a2 = document.createElement('a')
    const p = document.createElement('p')

    input.classList.add("form-control", "bg-secondary", "border-0", "text-center")
    div5.classList.add("d-flex", "align-items-center", "mb-4", "pt-2")
    button1.classList.add("btn", "btn-primary", "btn-minus")
    button2.classList.add("btn", "btn-primary", "btn-plus")
    div6.classList.add("input-group", "quantity", "mr-3")
    button3.classList.add("btn", "btn-primary", "px-3")
    h32.classList.add("font-weight-semi-bold", "mb-4")
    i3.classList.add("fa", "fa-shopping-cart", "mr-1")
    div3.classList.add("col-lg-7", "h-auto", "mb-30")
    div4.classList.add("h-100", "bg-light", "p-30")
    strong.classList.add("text-dark", "mr-2")
    div2.classList.add("col-lg-5", "mb-30")
    i4.classList.add("fab", "fa-instagram")
    i5.classList.add("fab", "fa-telegram")
    div7.classList.add("input-group-btn")
    div8.classList.add("input-group-btn")
    a1.classList.add("text-dark", "px-2")
    a2.classList.add("text-dark", "px-2")
    div1.classList.add("row", "px-xl-5")
    div9.classList.add("d-flex", "pt-2")
    div10.classList.add("d-inline-flex")
    img.classList.add("w-100", "h-100")
    i1.classList.add("fa", "fa-minus")
    i2.classList.add("fa", "fa-plus")
    div6.style.width = "130px"
    p.classList.add("mb-4")
    input.type = "text"
    input.value = 1
    input.style.width = "25px"

    a1.href = "https://www.instagram.com/xalqlar_dostligi"
    a2.href = "https://t.me/xalqlardostligiasia"
    button3.textContent = "Savatga Qo'shish"
    strong.textContent = "Share on:"
    input.id = "productCount"
    button3.addEventListener("click", addToBascet(product.data.id))

    p.textContent = product.data.description
    h32.textContent = product.data.price + " ₩ / 1" + product.data.measure
    h31.textContent = product.data.name
    img.src = product.data.img

    div4.append(h31, h32, p, div5)
    div6.append(div7, input, div8)
    div5.append(div6, button3)
    div9.append(strong, div10)
    productInfo.append(div1)
    div1.append(div2, div3)
    div8.append(button2)
    div7.append(button1)
    div10.append(a1, a2)
    button1.append(i1)
    button2.append(i2)
    button3.append(i3)
    div3.append(div4)
    div4.append(div9)
    div2.append(img)
    a1.append(i4)
    a2.append(i5)

    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val()
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1
            } else {
                newVal = 0
            }
        }
        button.parent().parent().find('input').val(newVal)
    })
}

function addToBascet(id) {
    return () => {
        alert(productCount.value + "ta mahsulot savatga qo'shildi")

        if (+productCount.value > 0) {
            const basketCount = document.querySelectorAll(".bascet-count")
            for (let bascet of basketCount) {
                bascet.textContent = +bascet.textContent + +productCount.value
            }
            let products = window.localStorage.getItem("products")

            if (!products) {
                products = [{ id, count: +productCount.value }]

                products = JSON.stringify(products)
                window.localStorage.setItem("products", products)
            } else {
                products = JSON?.parse(products)

                let index = products.find(product => product.id == id)

                if (index) {
                    index.count += +productCount.value
                } else {
                    products.push({ id, count: +productCount.value })
                }
                products = JSON.stringify(products)
                window.localStorage.setItem("products", products)
            }
        }
    }
}


function randomNumbers(num, item) {
    let nums = []
    let count = 0
    item = num < item ? num : item
    
    while (nums.length != item) {
        if(num > item) {
            nums.push(Math.floor(Math.random() * num))
            nums = new Set(nums)
            nums = Array.from(nums)
        }else {
            nums.push(count++)
        }
    }
    return nums
}