pokemonType = "all"
pokemonRegion = [0, 50]
var today = new Date();
var date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes()
var UserId = JSON.parse(sessionStorage.getItem("user"))._id
console.log(UserId)

function addLeadingZeroes(num, totalLength = 3) {
    if (num < 0) {
        const withoutMinus = String(num).slice(1);
        return '-' + withoutMinus.padStart(totalLength, '0');
    }

    return String(num).padStart(totalLength, '0');
}

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

async function pokemonregion_reader() {
    chosen_region = $(this).val()

    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/timeline/insertEvents",
        type: "put",
        data: {
            text: `User is searching for pokemons in ${capitalize(chosen_region)}`,
            time: `It was first hit on ${date} at ${time}`,
            hits: 1
        }
    })

    if (chosen_region === "kanto") {
        pokemonRegion = [0, 50]
    } else if (chosen_region === "johnto") {
        pokemonRegion = [51, 75]
    } else if (chosen_region === "hoenn") {
        pokemonRegion = [76, 100]
    } else if (chosen_region === "sinnoh") {
        pokemonRegion = [101, 125]
    } else if (chosen_region === "unova") {
        pokemonRegion = [126, 173]
    } else if (chosen_region === "kalos") {
        pokemonRegion = [174, 230]
    } else if (chosen_region === "alola") {
        pokemonRegion = [231, 260]
    } else if (chosen_region === "galar") {
        pokemonRegion = [261, 330]
    }
    $("#pokemon-body").empty()
    getPokemonfromMongo()
}

async function pokemon_type_reader() {
    pokemonType = $(this).val()
    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/timeline/insertEvents",
        type: "put",
        data: {
            text: `User is searching for ${capitalize(pokemonType)} pokemons`,
            time: `It was first hit on ${date} at ${time}`,
            hits: 1
        }
    })
    $("#pokemon-body").empty()
    getPokemonfromMongo()
}

async function append_types(types, id) {
    types.map(type => {
        pokemon_type = `<span class="type-container ${type}"> ${capitalize(type)} </span>`
        $("#" + id + "-type-container").append(pokemon_type)
    })
}

input = document.getElementById("pokemon-search");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        pokemon = $("#pokemon-search").val()
        $("#pokemon-body").empty()
        if (pokemon.length === 0) {
            getPokemonfromMongo()
        } else {
            getPokemonNamefromMongo(pokemon)
        }
    }
})

async function display_pokemon(pokemon, search = false) {

    get_pokemon_type = pokemon.types.map(type => {
        return type.type.name
    })

    pid = addLeadingZeroes(pokemon.id)
    pname = capitalize(pokemon.name)
    pimg = pokemon.sprites.other["official-artwork"]["front_default"]
    ptypes = get_pokemon_type

    pokemonInType = ptypes.includes(pokemonType)


    if (pokemonType === "all" || pokemonInType || search) {
        newcard = `<div class="pokemon-card">
        <a class="pokemon-link" href="pokemon.html?id=${pokemon.id}">
            <h1 class="pokemon-id"> #${pid} </h1>
            <img src="${pimg}" alt="${pname} Image" class="pokemon-img" width="300">
            <h2 class="pokemon-name"> ${pname} </h2>
            <div class="pokemon-type-container" id="${pid}-type-container"> </div>
            </a>
            <button type="button" onclick="addToCart(this.id)" id=${pname}> Add to Cart </button>
            </div>`

        $("#pokemon-body").append(newcard)

        append_types(ptypes, pid)
    }
}

async function addToCart(id){
    await $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/addToCart/${UserId}/${id}`,
            type: "get",
            success: (message => {
                console.log(message)
            })
        })
}

async function getPokemon(data) {
    for (i = pokemonRegion[0]; i < pokemonRegion[1]; i++) {
        await $.get(data[i].url, (pokemon) => {
            display_pokemon(pokemon)
        })
    }
}

async function getPokemonfromMongo() {
    await $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/findAllPokemons`,
            type: "GET",
            success: getPokemon
        })
}

async function getPokemonNamefromMongo(pokemonName) {
    await $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/findPokemonByName`,
            type: "POST",
            data: {
                "pokemonName": pokemonName,
            },
            success: search_pokemon,
        })
}

async function search_pokemon(pokemon_name) {
    await $.ajax({
        url: "https://ancient-plains-17873.herokuapp.com/timeline/insertEvents",
        type: "put",
        data: {
            text: `User is searching ${capitalize(pokemon_name[0].name)}`,
            time: `It was first hit on ${date} at ${time}`,
            hits: 1
        }
    })
    $.get(pokemon_name[0].url, (pokemon) => {
        display_pokemon(pokemon, true)
    })
}

function setup() {
    getPokemonfromMongo()
    document.getElementById("region").addEventListener("change", pokemonregion_reader)
    document.getElementById("type").addEventListener("change", pokemon_type_reader)
}


$(document).ready(setup)