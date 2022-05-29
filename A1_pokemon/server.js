const express = require('express');
const { render } = require('express/lib/response');
const res = require('express/lib/response');
const app = express()
const https = require("https")
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const bodyparser = require("body-parser");

app.set('view engine', 'ejs')

// app.listen(process.env.PORT || 4000, (err) => {
//     if (err) console.log(err);
// })

app.listen(process.env.PORT || 4000, (err) => {
  if (err) console.log(err);
})

app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(express.static("./public"))

mongoose.connect("mongodb://localhost:27017/TestPokemons",
 {useNewUrlParser: true, useUnifiedTopology: true});
const pokemonSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    timeline: String,
});


const pokemonModel = mongoose.model("Pokemons", pokemonSchema);

app.get('/findPokemonsById', function(req, res) {
    console.log(req.body.pokemonId)
    pokemonModel.find({}, function(err, pokemons){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ JSON.stringify(pokemons));
        }
        res.send(JSON.stringify(pokemons));
    });
  })


// app.get('/profile/:id', (req, res) => {
//     const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

//     https.get(url, function (https_res) {
//         data = '';
//         https_res.on("data", function (chunk) {
//             // console.log(chunk);
//             data += chunk
//         })

//         https_res.on('end', function () {
//             data = JSON.parse(data)

//             hp_stats = data.stats.filter((obj) => {
//                 return obj.stat.name == "hp"
//             }).map((obj) => {
//                 return obj.base_stat
//             })
//             res.render("profile.ejs", {
//                 "id": req.params.id,
//                 "name": data.name,
//                 "img_path": data.sprites.other["official-artwork"]["front_default"],
//                 "hp": hp_stats,
//             })
//         })
//     })
// })

