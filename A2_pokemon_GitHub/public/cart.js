subtotalTag = document.querySelector(".subtotal")
gstTag = document.querySelector(".gst")
pstTag = document.querySelector(".pst")
totalTag = document.querySelector(".total")

async function displayCart(cart) {
    console.log(cart)
    countProducts = 0
    await cart[0].items.map(item => {
        product = `<span class="product"> <h5 class="pokemon"> ${item} </h5> <h5 class="Price"> 30 </h5> </span>`
        countProducts++
        $(".added-items").append(product)
    })
    subtotal = 30 * countProducts
    gst = subtotal * 0.05
    pst = subtotal * 0.07
    paidTotal = cart[0].paid

    subtotalTag.innerHTML = subtotal
    gstTag.innerHTML = gst
    pstTag.innerHTML = pst
    totalTag.innerHTML = paidTotal
}

function getCart() {
    let params = new URLSearchParams(document.location.search)
    let cartId = params.get("id")
    $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/getCart/${cartId}`,
            type: "get",
            success: displayCart
        }
    )
}

function setup() {
    getCart()
}

$(document).ready(setup)