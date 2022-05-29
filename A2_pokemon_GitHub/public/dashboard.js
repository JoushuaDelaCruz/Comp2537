userId = JSON.parse(sessionStorage.getItem("user"))._id

// --- Checks if user is an admin --- //
function isUserAdmin() {
    admin = JSON.parse(sessionStorage.getItem("user")).admin

    if (!admin) {
        window.location.href = "https://ancient-plains-17873.herokuapp.com/profile"
    }
}

// --- Update User --- //
function updatingUser() {
    id = $(this).attr("id").split("-")[1]

    $("#username-" + id).prop("disabled", false)
    $("#admin-" + id).prop("disabled", false)
    $("#password-" + id).prop("disabled", false)

    $("#username-" + id)[0].classList.add("updating")
    $("#admin-" + id)[0].classList.add("updating")
    $("#password-" + id)[0].classList.add("updating")
    // disappears the update button
    $("#update-" + id)[0].style.display = "none"
    $("#save-" + id)[0].style.display = "block"
}

// --- Saves User updates --- //
function saveUpdates() {
    id = $(this).attr("id").split("-")[1]

    newUserName = $("#username-" + id).val()
    newAdmin = $("#admin-" + id).val()
    newPassword = $("#password-" + id).val()

    updateUser(id, newUserName, newPassword, newAdmin)

    $("#username-" + id)[0].classList.remove("updating")
    $("#admin-" + id)[0].classList.remove("updating")
    $("#password-" + id)[0].classList.remove("updating")

    // disappears the update button
    $("#update-" + id)[0].style.display = "block"
    $("#save-" + id)[0].style.display = "none"
}

function collapse() {
    this.classList.toggle("active-collapsible");
    content = this.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = "30vh";
    }
}

// ------------------------------------------------- //
// --- All functions for successful interactions --- //
// ------------------------------------------------- //

// --- Populating the Table --- //
async function populateTable(users) {
    let tableTemplate = $("#table-template-users")[0]
    i = 1
    await users.forEach(user => {
        id = user._id
        username = user.username
        password = user.password
        admin = user.admin

        let newrow = tableTemplate.content.cloneNode(true)

        // --- Displaying the Value --- //
        newrow.querySelector(".user-id").innerHTML = id
        newrow.querySelector(".user-number").innerHTML = i
        newrow.querySelector(".user-name").value = username
        newrow.querySelector(".user-admin").value = admin
        newrow.querySelector(".user-password").value = password

        // --- Adding the id --- //
        newrow.querySelector(".user-name").setAttribute("id", "username-" + id)
        newrow.querySelector(".user-admin").setAttribute("id", "admin-" + id)
        newrow.querySelector(".user-password").setAttribute("id", "password-" + id)
        newrow.querySelector(".save-btn").setAttribute("id", "save-" + id)
        newrow.querySelector(".update-btn").setAttribute("id", "update-" + id)
        newrow.querySelector(".delete-btn").setAttribute("id", "delete-" + id)

        $("tbody").append(newrow)
    })
}

// ---------------------------------------------------- //
// --- All Functions that Interacts with the Server --- //
// ---------------------------------------------------- //

function getUsers() {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getUsers`,
            type: "get",
            success: populateTable
        }
    )
}

// --- updating user in the database --- //
function updateUser(id, username, password, admin) {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/updateUser/${id}/${username}/${password}/${Boolean(admin)}`,
            type: "get",
            success: (message) => {
                alert(message)
            }
        }
    )
}

function addNewUser() {
    if ($("#admin-true").is(":checked") && $("#admin-false").is(":checked")) {
        alert("Cannot have both checkbox checked for Admin!")
        return;
    }

    admin = $("#admin-true").is(":checked")
    username = $("#new-user-name").val()
    password = $("#new-user-password").val()

    $.ajax(
        {   
            url: `https://ancient-plains-17873.herokuapp.com/createNewUser`,
            type: "put",
            data: {
                username: username,
                password: password,
                admin: Boolean(admin),
            },
            success: (message) => {
                alert(message)
                location.reload()
            }
        }
    )
}

// --- Removing user in the database --- //
function deleteUser() {
    id = $(this).attr("id").split("-")[1]
    if (id == userId) {
        alert("You cannot delete yourself")
        return;
    }

    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/deteleUser/${id}`,
            type: "get",
            success: (message) => {
                alert(message)
                location.reload()
            }
        }
    )
}

function setup() {
    getUsers()
    isUserAdmin()
    $('body').on('click', '.delete-btn', deleteUser);
    $('body').on('click', '.save-btn', saveUpdates);
    $('body').on('click', '.update-btn', updatingUser);
    $("body").on('click', "#add-user", collapse)
    $("body").on('click', "#add-btn", addNewUser)
}

$(document).ready(setup)