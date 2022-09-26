

async function renderProducts() {
    const { data: products } = await request("product", "GET")
    render(products.rows)
}

// Render products
function render(products) {
    for (let p of products) {
        const tr = document.createElement('tr')
        const th = document.createElement('th')
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const a = document.createElement('a')
        const i = document.createElement('i')
        const img = document.createElement('img')

        th.setAttribute("scope", 'row')
        td1.classList.add("tm-product-name")
        a.classList.add("tm-product-delete-link")
        i.classList.add("far", "fa-trash-alt", "tm-product-delete-icon")

        img.src = p.img
        td1.textContent = p.name
        td2.textContent = p.price + "  ₩ / 1" + p.measure 
        td3.textContent = p.department.name
        td4.textContent = p.category.name
        th.append(img)
        a.append(i)
        td5.append(a)
        tr.append(th, td1, td2, td3, td4, td5)
        productList.append(tr)

        a.addEventListener('click', deleteProduct(p.id, tr, p.name))

        td1.addEventListener('click', () => {
            window.localStorage.setItem("editProductId", p.id )
            window.location.href = "/edit-product";
        })
    }
}


function deleteProduct(id, element, productName) {
    return async () => {
        const resultat = confirm(productName + "ni o'chirishni xoxlaysizmi")
        if(resultat) {
            const respons = await request("product/" + id, "DELETE")
            alert(respons.message)
            element.remove()
        }
    }
}


renderProducts()