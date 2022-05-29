const express = require('express');
const res = require('express/lib/response');
const app = express()
const cors = require('cors');
app.use(cors());

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 5000, (err) => {
    if (err) console.log(err);
})

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/TestPokemons",
 {useNewUrlParser: true, useUnifiedTopology: true});
const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String,
});
const pokemonModel = mongoose.model("Pokemon", pokemonSchema);

app.use(express.static("./public"))

app.get("/findPokemonsById", function (req, res) {
    console.log("req. has been received")
    console.log(pokemonModel)
    console.log(req.body.id)
  
    pokemonModel.find({}, function (err, pokemons) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Data " + JSON.stringify(pokemons));
      }
      res.send(JSON.stringify(pokemons));
    });
  })

