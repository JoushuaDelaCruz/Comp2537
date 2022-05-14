async function append_types(types, id) {
    types.map(type => {
        pokemon_type = `<span class="type-container ${type}"> ${capitalize(type)} </span>`
        $("#" + id + "-type-container").append(pokemon_type)
    })
}

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

async function display_pokemon(pokemon) {
    get_pokemon_type = pokemon.types.map(type => {
        return type.type.name
    })

    pid = addLeadingZeroes(pokemon.id)
    pname = capitalize(pokemon.name)
    pimg = pokemon.sprites.other["official-artwork"]["front_default"]
    ptypes = get_pokemon_type


    newcard = `<a class="pokemon-link" href="pokemon.html?id=${pokemon.id}"><div class="pokemon-card">
        <h1 class="pokemon-id"> #${pid} </h1>
        <img src="${pimg}" alt="${pname} Image" class="pokemon-img" width="300">
        <h2 class="pokemon-name"> ${pname} </h2>
        <div class="pokemon-type-container" id="${pid}-type-container"> </div>
        </div>`

    $("main").append(newcard)

    await append_types(ptypes, pid)
}

async function getPokemonfromMongo() {
    await $.ajax(
        {
            url: `https://ancient-plains-17873.herokuapp.com/findAllPokemons`,
            type: "GET",
            success: showcase
        })
}

async function showcase(data) {
    for (_ = 1; _ <= 9; _++) {
        number = Math.floor((Math.random() * 300) + 0)
        await $.get(data[number].url, (pokemon) => {
            display_pokemon(pokemon)
        })
    }
}

function setup() {
    getPokemonfromMongo()
}

$(document).ready(setup)