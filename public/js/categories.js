const list = document.querySelector('#list')


async function renderCategories() {
    list.textContent = null
    const { data: departments } = await request("department", "GET")
    renderSelector(departments)

    for (let d of departments) {
        const { data: categories } = await request("category?departmentId=" + d.id, "GET")

        const div = document.createElement("div")
        const messageElement = document.createElement("div")
        const h3 = document.createElement("h3")
        h3.textContent = d.name
        div.append(h3, messageElement)
        list.append(div)
        messageElement.style.padding = '10px'
        messageElement.style.color = 'green'

        if (categories.length === 0) {
            const divContext = document.createElement("div")
            divContext.textContent = "Categorya qo'shilmagan"
            div.append(divContext)
            messageElement.remove()
        }

        for (let c of categories) {
            const divContext = document.createElement("div")
            const input = document.createElement("input")
            const editBtn = document.createElement("button")
            const deleteBtn = document.createElement("button")

            div.style.margin = "px"
            editBtn.style.margin = "1px"
            input.size = 70
            editBtn.textContent = 'edit'
            deleteBtn.textContent = 'delete'
            editBtn.style.color = "green"
            deleteBtn.style.color = "red"

            input.value = c.name
            divContext.append(input, editBtn, deleteBtn)
            div.append(divContext)
            editBtn.addEventListener('click', updateCategory(input, c.id, editBtn, messageElement))
            deleteBtn.addEventListener('click', deleteCategory(c.id, divContext, messageElement))
            input.addEventListener('keydown', () => editBtn.style.color = 'orange')
        }
    }
}

// Update category
function updateCategory(input, id, editBtn, messageElement) {
    return async () => {
        if(!input.value.length) return 

        const body = JSON.stringify({ name: input.value, id })
        const respons = await request("category", "PUT", body)
        messageElement.textContent = respons.status === 400 ? respons.message.errors[0].message : respons.message
        editBtn.style.color = 'green'

        setTimeout(() => {
            messageElement.textContent = null
            renderCategories()
        }, 2000)
    }
}

// Delete Category
function deleteCategory(id, element, messageElement) {
    return async () => {
        const respons = await request("category/" + id, "DELETE")
        element.remove()

        messageElement.textContent = respons.message
        setTimeout(() => {
            messageElement.textContent = null
        }, 2000)
    }

}

function renderSelector(departments) {
    let options = document.querySelectorAll('.option')
    
    for(let p of options) {
        p.remove()
    }

    for (let d of departments) {
        const options = document.createElement('option')
        options.textContent = d.name;
        options.setAttribute("value", d.id)
        options.classList.add('option')
        selecktor.appendChild(options)
    }
}

addCategoryBtn.addEventListener('click', async () => {
    const body = JSON.stringify({ departmentId: selecktor.value, name: addCategoryInput.value })
    if(!addCategoryInput.value.length) return
    const respons = await request("category", "POST", body)
    addMessage.textContent = respons.status === 400 ? respons.message.errors[0].message : respons.message

    setTimeout(() => {
        addMessage.textContent = null
        addCategoryInput.value = null
        renderCategories()
    }, 2000)
})


renderCategories()