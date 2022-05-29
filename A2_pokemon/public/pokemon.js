
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


function show_pokemon(pokemon) {
    get_pokemon_type = pokemon.types.map(type => {
        return type.type.name
    })

    abilities = pokemon.abilities.map(ability => {
        return ability.ability.name
    })

    HP = pokemon.stats.filter((obj) => {
        return obj.stat.name == "hp"
    }).map((obj) => {
        return obj.base_stat
    })

    ATTACK = pokemon.stats.filter((obj) => {
        return obj.stat.name == "attack"
    }).map((obj) => {
        return obj.base_stat
    })

    DEFENCE = pokemon.stats.filter((obj) => {
        return obj.stat.name == "defense"
    }).map((obj) => {
        return obj.base_stat
    })

    SATTACK = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-attack"
    }).map((obj) => {
        return obj.base_stat
    })

    SDEFENCE = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-defense"
    }).map((obj) => {
        return obj.base_stat
    })

    SPEED = pokemon.stats.filter((obj) => {
        return obj.stat.name == "speed"
    }).map((obj) => {
        return obj.base_stat
    })


    pid = addLeadingZeroes(pokemon.id);
    pname = capitalize(pokemon.name)
    pimg = pokemon.sprites.other["official-artwork"]["front_default"];
    ptypes = get_pokemon_type;
    pheight = pokemon.height
    pweight = pokemon.weight
    php = HP
    pattack = ATTACK
    pdefence = DEFENCE
    psattack = SATTACK
    psdefence = SDEFENCE
    pspeed = SPEED
    pabilities = abilities

    document.getElementById("pokemon-id").innerHTML = `#${pid}`
    document.getElementById("pokemon-name").innerHTML = pname
    document.getElementById("pokemon-height").innerHTML = `${pheight} cm`
    document.getElementById("pokemon-weight").innerHTML = `${pweight} kg`
    document.getElementById("hp-content").innerHTML = php
    document.getElementById("attack-content").innerHTML = pattack
    document.getElementById("defence-content").innerHTML = pdefence
    document.getElementById("special-attack-content").innerHTML = psattack
    document.getElementById("special-defence-content").innerHTML = psdefence
    document.getElementById("speed-content").innerHTML = pspeed
    document.getElementById("pokemon-img").setAttribute("src", pimg)

    ptypes.map(type => {
        pokemon_type = `<span class="type-container ${type}"> ${capitalize(type)} </span>`
        $("#pokemon-type-container").append(pokemon_type)
    })

    abilities.map(ability => {
        pokemon_ability = `<li> ${capitalize(ability)} </li>`
        $("#ability-container").append(pokemon_ability)
    })
}

function pokemon(id) {
    $.get(`https://pokeapi.co/api/v2/pokemon/${id}`, (pokemon) => {
        show_pokemon(pokemon)
    })
}

function get_id() {
    let params = new URLSearchParams(document.location.search)
    let id = params.get("id")

    pokemon(id)
}

function setup() {
    get_id()
}

$(document).ready(setup)