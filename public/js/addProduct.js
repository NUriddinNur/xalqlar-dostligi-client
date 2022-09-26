

async function renderDepartmentCategory() {
    const { data: departments } = await request("department", "GET")

    for (let d of departments) {
        const option = document.createElement('option')
        option.textContent = d.name
        option.value = d.id
        departmentSelector.addEventListener('change', renderCategorySelector)
        departmentSelector.append(option)
    }
}

async function renderCategorySelector() {
    const { data: categories } = await request('category?departmentId=' + departmentSelector.value, 'GET')
    renderSelector(categories)
}

function renderSelector(categories) {
    let options = document.querySelectorAll('.option')
    
    for(let p of options) {
        p.remove()
    }

    if(!categories.length) {
        const option = document.createElement('option')
        option.classList.add('option')
        categorySelector.append(option)
    }

    for (let c of categories) {
        const option = document.createElement('option')
        option.textContent = c.name
        option.value = c.id
        option.classList.add('option')
        categorySelector.append(option)
    }
}


addBtn.addEventListener('click', async (event) => {
    event.preventDefault()

    const file = fileInput.files[0]
    const formData = new FormData()
    formData.append('name', nameInput.value)
    formData.append('description', descriptionInput.value)
    formData.append('departmentId', departmentSelector.value)
    formData.append('categoryId', categorySelector.value)
    formData.append('price', priceInput.value)
    formData.append('measure', measureSelector.value)
    formData.append('file', file)

    const respons = await fetchToUrl('product', 'POST', formData)

    if(respons.status === 200) {
        alert(respons.message)
        window.location = '/add-product'
    }else {
        alert(respons.message)
    }

    
})


async function fetchToUrl(root, method, body) {
    let response = await fetch(Api + root, {
        method,
        headers: {
            token: window.localStorage.getItem('token')
        },
        body: body,
    })
    return await response.json()
}


renderDepartmentCategory()