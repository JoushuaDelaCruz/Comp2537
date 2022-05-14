function displayCard(events) {
    let cardTemplate = document.getElementById("cardTemplate")
    events.forEach(event => {
        text = event.text
        time = event.time
        hits = event.hits
        id = event._id

        newcard = cardTemplate.content.cloneNode(true);
        newcard.querySelector(".event-info").innerHTML = text
        newcard.querySelector(".event-time").innerHTML = time
        newcard.querySelector(".event-repeatition").innerHTML = hits
        newcard.querySelector(".liked-btn").setAttribute("id", "like-"+id)
        newcard.querySelector(".delete-btn").setAttribute("id", "remove-"+id)

        $("main").append(newcard);
    });
}

function eventLiked(event){
    id = event.target.id.split("-")
    $.ajax({
        url: `https://ancient-plains-17873.herokuapp.com/timeline/updateHits/${id[1]}`,
        type: "get",
        success: (message) => {
            alert(message)
        }
    })
}

function eventRemoved(event){
    id = event.target.id.split("-")
    $.ajax({
        url: `https://ancient-plains-17873.herokuapp.com/timeline/removeEvent/${id[1]}`,
        type: "get",
        success: (message) => {
            alert(message)
        }
    })
}

function showEvents() {
    $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/timeline/getAllEvents",
        type: "get",
        success: displayCard
    })
}



function setup() {
    showEvents()
}

$(document).ready(setup)