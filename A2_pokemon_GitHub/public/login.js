var today = new Date();
var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes()

function checkAuthentication(data){
    if (data.success){
        window.sessionStorage.setItem("user", JSON.stringify(data.user))
        createEvent(data.user)
        if (data.user.admin){
            window.location.href = "/dashboard"
        } else {
            window.location.href = "/profile"
        }
    } else {
        document.getElementById("incorrect").style.display = "block"
    }
}

function login(){
    username = $("#username").val()
    password = $("#password").val()
    
    $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/login",
        type: "POST",
        data: {
            "username": username,
            "password": password
        },
        success: checkAuthentication
    })
}

async function createEvent(data){
    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/insertUserEvents",
        type: "put",
        data: {
            text: `You logged-in`,
            time: `${date}, ${time}`,
            user: data._id
        }
    })
}

btn = document.getElementById("login")

btn.addEventListener("click", login)