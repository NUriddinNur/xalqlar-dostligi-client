const list = document.querySelector('.list')
 

async function renderDepartment() {
    list.textContent = null
    const {data} = await request("department", "GET")

    for(let d of data) {
        const input = document.createElement("input")
        const div = document.createElement("div")
        const editBtn = document.createElement("button")
        const deleteBtn = document.createElement("button")

        div.style.margin = "px"
        editBtn.style.margin = "1px"
        input.size = 70
        editBtn.textContent = 'edit'
        deleteBtn.textContent = 'delete'
        editBtn.style.color = "green"
        deleteBtn.style.color = "red"

        input.value = d.name
        div.append(input, editBtn, deleteBtn)
        list.append(div)

        editBtn.addEventListener('click', update(input, d.id, editBtn))
        deleteBtn.addEventListener('click', deleteDepartment(d.id, div))
        input.addEventListener('keydown', () => editBtn.style.color = 'orange')
    }
}

function update(input, id,editBtn) {
    return async () => {
        const body = JSON.stringify({name: input.value, id})
        const respons = await request("department", "PUT", body)
        console.log(respons);
        message.textContent = respons.status === 400 ? respons.message.errors[0].message : respons.message 
        editBtn.style.color = 'green'

        setTimeout(() => {
            message.textContent = null
            renderDepartment()
        }, 2000)
    }
}

function deleteDepartment(id, element) {
    return async () => {
        const respons = await request("department/" + id, "DELETE")
        element.remove()

        message.textContent = respons.message
        setTimeout(() => {
            message.textContent = null
        }, 2000)
    }
}

addDepartmentBtn.addEventListener('click', async () => {
    const body = JSON.stringify({name: addDepartmentInput.value})
        const respons = await request("department", "POST", body)
        addMessage.textContent = respons.status === 400 ? respons.message.errors[0].message : respons.message 

        setTimeout(() => {
            addMessage.textContent = null
            addDepartmentInput.value = null
            renderDepartment()
        }, 2000)
})

renderDepartment()