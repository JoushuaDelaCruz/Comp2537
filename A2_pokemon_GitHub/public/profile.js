userId = JSON.parse(sessionStorage.getItem("user"))._id

function displayTimeline(data) {
    data = data.slice(data.length - 2, data.length)

    // ----------------------- //
    // - Important Variables - //
    // ----------------------- //
    mostRecentLogin = document.querySelector('.most-recent-login')
    lastRecentLogin = document.querySelector(".last-login")

    mostRecentLogin.innerHTML = `You logged-in today at: ${data[1].time}`
    lastRecentLogin.innerHTML = `The last time you logged was at: ${data[0].time}`
}

// ---------------------------------------- //
// - Functions for Timeline and Greetings - //
// ---------------------------------------- //

function getTimeline() {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getAllUserEvents/${userId}`,
            type: "get",
            success: displayTimeline
        }
    )
}

function greetings() {

    // ----------------------- //
    // - Important Variables - //
    // ----------------------- //
    greetTag = document.querySelector(".greetings")
    greetTag.innerHTML = `Hello, ${JSON.parse(sessionStorage.getItem("user")).username}`
}

// ------------------------------ //
// - Functions for Current Cart - //
// ------------------------------ //

// ---------------------------------- //
// - All Functions for Current Cart - //
// ---------------------------------- //

subtotalTag = document.querySelector(".subtotal")
gstTag = document.querySelector(".gst")
pstTag = document.querySelector(".pst")
totalTag = document.querySelector(".total")
purchaseBtn = document.querySelector(".purchase-btn")

async function displayCart(cart) {
    countProducts = 0
    await cart[0].items.map(item => {
        product = `<span class="product"> <h5 class="pokemon"> ${item} </h5> <h5 class="Price"> 30 </h5> </span>`
        countProducts++
        $(".added-items").append(product)
    })
    subtotal = 30 * countProducts
    gst = subtotal * 0.05
    pst = subtotal * 0.07
    total = subtotal + gst + pst

    subtotalTag.innerHTML = subtotal
    gstTag.innerHTML = gst
    pstTag.innerHTML = pst
    totalTag.innerHTML = total
    totalTag.setAttribute("id", total)
    purchaseBtn.setAttribute("id", cart[0]._id)
}

function createCart() {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/createNewCart/${userId}`,
            type: "put",
        }
    )
}

function checkCart(cart) {
    if (cart.length == 0) {
        createCart()
    } else {
        displayCart(cart)
    }
}

function getUnpurchasedCart() {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getUnpurchasedCart/${userId}`,
            type: "get",
            success: checkCart
        }
    )
}

purchaseBtn.addEventListener("click", (event) => {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/purchaseCart/${event.target.id}/${$(".total").attr("id")}`,
            type: "get",
            success: (message) => {
                console.log(message)
            }
        }
    )
})
function purchaseCart() {
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getUnpurchasedCart/${userId}`,
            type: ""
        }
    )
}

// ----------------------------------- //
// - All Functions for Previous Cart - //
// ----------------------------------- //

function displayAllPreviousCarts(carts){
    let cardTemplate = document.getElementById("previous-cart-template")

    carts.forEach(cart => {
        paid = cart.paid
        cartNumber = cart._id

        let newcart = cardTemplate.content.cloneNode(true)

        newcart.querySelector(".purchase-number").innerHTML = `Purchase Number: ${cartNumber}`
        newcart.querySelector(".total-purchased").innerHTML = `Total Amount: $${paid}`
        newcart.querySelector(".previous-cart-link").setAttribute("href", `https://ancient-plains-17873.herokuapp.com/cart?id=${cartNumber}`)

        document.getElementById("history").append(newcart)
    })
}

function getPuchasedCart(){
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getPreviousCarts/${userId}`,
            type: "get",
            success: displayAllPreviousCarts
        }
    )
}

function setup() {
    greetings()
    getTimeline()
    getUnpurchasedCart()
    getPuchasedCart()
}

$(document).ready(setup)