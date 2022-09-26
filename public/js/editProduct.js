const idProduct = window.localStorage.getItem("editProductId")


async function editProduct() {
    const {data: product} = await request('product/' + idProduct, 'GET')
    editName.value = product.name
    editDescription.value = product.description
    editPrice.value = product.price
    editMeasure.label = product.measure
    editProductEmige.src = product.img
}


editBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    const file = fileInput.files[0]
    const formData = new FormData()

    formData.append('productId', idProduct)
    formData.append('name', editName.value)
    formData.append('description', editDescription.value)
    formData.append('price', editPrice.value)
    formData.append('measure', editSelector.value)
    formData.append('file', file)

    const respons = await fetchToUrl('product', 'PUT', formData)
    alert(respons.message)
    editProduct()
})


async function fetchToUrl(root, method, body) {
    let response = await fetch(Api + root, {
        method,
        headers: {
            token: window.localStorage.getItem('token')
        },
        body: body,
    })

    if (response.status === 401) {
        document.location = '/'
    }
    return await response.json()
}



editProduct()