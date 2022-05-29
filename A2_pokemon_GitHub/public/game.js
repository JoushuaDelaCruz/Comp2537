var today = new Date();
var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes()
var userId = JSON.parse(sessionStorage.getItem("user"))._id

// ---------------------------- //
// --- Populatings the Game --- //
// ---------------------------- //
function populateGame(data) {
    cardTemplate = $("#card-game-template")[0]

    for (i = 1; i <= numPokemons; i++) {
        random_number = Math.floor((Math.random() * data.length))

        pId = data[random_number].pokeId
        pName = data[random_number].pokeName
        pImage = data[random_number].pokeImage
        data[random_number].numUsed++
        pPlace = ""

        if (data[random_number].numUsed == 1) {
            pPlace = "first-" + pId
        } else {
            pPlace = "second-" + pId
        }

        let newCard = cardTemplate.content.cloneNode(true)

        newCard.querySelector(".poke-image").setAttribute("id", pPlace)
        newCard.querySelector(".poke-image").setAttribute("src", pImage)
        newCard.querySelector(".poke-name").innerHTML = pName

        if (data[random_number].numUsed == 2) {
            data.splice(random_number, 1)
        }
        $("main").append(newCard)
    }
    $(".container").on("click", flipCard)
}

// --------------------------------------- //
// -- Getting the Pokemons from the API -- //
// --------------------------------------- //
function modifyGrid(perRows){

    $("main").removeAttr("class")

    if (perRows != "three" || perRows != "two"){
        $("main").addClass("six-to-four")
    } else {
        $("main").addClass("three-to-two")
    }

    document.querySelectorAll(".container").forEach(container => {
        container.classList.add(perRows + "-per-row")
    })
}


async function showCards() {
    createNewGameEvent()
    pokemons = []
    pickedNumbers = []
    $("main").empty()
    numPokemons = parseInt($("#num-cards").val())
    perRows = $("#num-cards-per-row").val()

    for (i = 1; i <= numPokemons / 2; i++) {
        random_pokemon = Math.floor((Math.random() * 898) + 1);
        duplicate = pickedNumbers.includes(random_pokemon)
        if (duplicate) {
            i--
        } else {
            await $.ajax(
                {
                    url: `https://pokeapi.co/api/v2/pokemon/${random_pokemon}`,
                }
            ).then((pokemon) => {
                pokemons.push
                    (
                        {
                            pokeId: pokemon.id,
                            pokeImage: pokemon.sprites.other["official-artwork"]["front_default"],
                            pokeName: pokemon.name,
                            numUsed: 0
                        }
                    )
                pickedNumbers.push(random_pokemon)
            })
        }
    }
    populateGame(pokemons)
    modifyGrid(perRows)
}

// ------------------------------------------ //
// --- Flips the Card and Checks the Card --- //
// ------------------------------------------ //

async function flipCard() {
    if (lockBoard) {
        return;
    }
    if (firstCard === $(this).find(".poke-image")[0]) {
        console.log("Cannot click the same card twice")
        return;
    }

    $(this).toggleClass("flip")
    // Checks if the number of cards flipped is 2
    if (!flippedCards) {
        firstCard = $(this).find(".poke-image")[0]
        flippedCards = true
    } else {
        secondCard = $(this).find(".poke-image")[0]

        if ($(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")) {
            $(`#${firstCard.id}`).parent().parent().off("click")
            $(`#${secondCard.id}`).parent().parent().off("click")
            firstCard = undefined
            secondCard = undefined
            flippedCards = false
            numFlippedCards++
        } else {
            lockBoard = true
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().parent().removeClass("flip")
                $(`#${secondCard.id}`).parent().parent().removeClass("flip")
                console.log("Not Match")
                firstCard = undefined
                secondCard = undefined
                flippedCards = false
                lockBoard = false
            }, 750)
        }
    }

    if (numFlippedCards == parseInt(numPokemons) / 2){
        alert("You have won!")
        createWonGameEvent()
        ShowCurrentWins()
    } 
}

// ----------------- //
// -- Game Events -- //
// ----------------- //

// --- Display Functions --- //
function displayEvents(logs){
    logs.forEach(log => {
        newlog = `<div class = "log-container"> <h2> ${log.text} <h2> <h3> at ${log.time} <h3> </div>`

        $(".event-logs").prepend(newlog)
    })
}

async function getAllEvents(){
    await $.ajax({
        type: "GET",
        url: `https://ancient-plains-17873.herokuapp.com/getAllUsersGameEvents/${userId}`,
        success: displayEvents
    })
}

async function ShowCurrentWins(){
    await $.ajax({
        type: "GET",
        url: `https://ancient-plains-17873.herokuapp.com/getUsersWonGames/${userId}`,
        success: (user) => {
            $("#number-wins").html(user.game)
        }
    })
}

// -- Requests -- //
async function createNewGameEvent(){
    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/insertStartGame",
        type: "put",
        data: {
            text: "You started a game",
            time: `${date}, ${time}`,
            user: userId
        }
    })
}

async function createWonGameEvent(){
    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/insertUserWon",
        type: "put",
        data: {
            text: "You have won",
            time: `${date}, ${time}`,
            user: userId
        }
    }).then(async () => {
        await $.ajax({
            url: `https://ancient-plains-17873.herokuapp.com/addGameWon/${userId}`,
            success: (message) => {
                console.log(message)
            }
        })
    })
}

function setup() {
    getAllEvents()
    ShowCurrentWins()
    lockBoard = undefined
    flippedCards = false
    firstCard = undefined
    secondCard = undefined
    numFlippedCards = 0

    numPokemons = "8"
    perRows = "three"
    $("#game-btn").on("click", showCards)
}

$(document).ready(setup)