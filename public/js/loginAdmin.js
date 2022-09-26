loginBtn.onclick = async (event) => {
    event.preventDefault()

    const username = usernameInput.value?.trim() 
    const password = passwordInput.value?.trim()

    if(!username || !password) return

    const formData = new FormData()
    formData.append("username", username)
    formData.append("password", password)

    let respons = await request("user/login/admin", "POST", JSON.stringify({username, password}))
    message.textContent = respons.message

    if(respons.status === 200){
        message.style.backgroundColor = "green"
    }else {
        message.style.backgroundColor = "red"
    }

    setTimeout(() => {
        message.textContent = null
        message.removeAttribute("style")
        if(respons.status === 200) {
            window.localStorage.setItem("token", respons.token)
            window.location = '/adminPanel'
        }
    }, 2000)
}