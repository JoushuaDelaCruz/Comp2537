pokemonType = "all"
pokemonRegion = [1, 152]

function pokemonregion_reader() {
    chosen_region = $(this).val()
    if (chosen_region === "kanto") {
        pokemonRegion = [0, 151]
    } else if (chosen_region === "johnto") {
        pokemonRegion = [152, 251]
    } else if (chosen_region === "hoenn") {
        pokemonRegion = [252, 386]
    } else if (chosen_region === "sinnoh") {
        pokemonRegion = [387, 494]
    } else if (chosen_region === "unova") {
        pokemonRegion = [495, 649]
    } else if (chosen_region === "kalos") {
        pokemonRegion = [650, 721]
    } else if (chosen_region === "alola") {
        pokemonRegion = [722, 809]
    } else if (chosen_region === "galar") {
        pokemonRegion = [810, 898]
    }
    $("#pokemon-body").empty()
    getPokemon()
}

function pokemon_type_reader() {
    pokemonType = $(this).val()
    $("#pokemon-body").empty()
    getPokemon()
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
            getPokemon()
        } else {
            search_pokemon(pokemon)
        }
    }
})


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
        newcard = `<a class="pokemon-link" href="pokemon.html?id=${pokemon.id}"><div class="pokemon-card">
        <h1 class="pokemon-id"> #${pid} </h1>
        <img src="${pimg}" alt="${pname} Image" class="pokemon-img" width="300">
        <h2 class="pokemon-name"> ${pname} </h2>
        <div class="pokemon-type-container" id="${pid}-type-container"> </div>
        </div>`

        $("#pokemon-body").append(newcard)

        await append_types(ptypes, pid)
    }
}


async function getPokemon() {
    for (i = pokemonRegion[0]; i <= pokemonRegion[1]; i++) {
        await $.get(`http://localhost:5000/findPokemonById`, (pokemon) => {
            display_pokemon(pokemon)
        })
    }
}

function search_pokemon(pokemon_name) {
    $.get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`, (pokemon) => {
        display_pokemon(pokemon, true)
    })
}

function setup() {
    getPokemon()
    document.getElementById("region").addEventListener("change", pokemonregion_reader)
    document.getElementById("type").addEventListener("change", pokemon_type_reader)
}


$(document).ready(setup)