const express = require('express')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose');
app.use(express.json())
const bodyparser = require("body-parser");

app.use(cors())

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));


app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
})

app.use(express.static("public"))

mongoose.connect("mongodb+srv://TestingPokemons:vEneJObw87q51icQ@cluster0.pi9xp.mongodb.net/TestPokemons?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true });
const pokemonSchema = new mongoose.Schema({
    text: String,
    time: String,
    hits: Number,
    name: String
});

const pokemonModel = mongoose.model("pokes", pokemonSchema);

const timelineModel = mongoose.model("timelines", pokemonSchema);

app.get("/timeline/getAllEvents", function (req, res) {
  console.log("req. has been received")

  timelineModel.find({}, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(event));
    }
    res.send(event);
  });
})

app.put("/timeline/insertEvents", function (req, res) {
  console.log(req.body)

  timelineModel.create({
    text: req.body.text,
    time: req.body.time,
    hits: req.body.hits,
  }, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + event);
    }
    res.send(event);
  });
})

app.put("/timeline/insertEvents", function (req, res) {
  console.log(req.body)

  timelineModel.create({
    text: req.body.text,
    time: req.body.time,
    hits: req.body.hits
  }, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + event);
    }
    res.send(event);
  });
})

app.get("/timeline/updateHits/:id", function (req, res) {
  console.log(req.params)

  timelineModel.updateOne({
    _id: req.params.id
  },{
    $inc: {hits: 1}
  }, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + event);
    }
    res.send("Additional Liked is added");
  });
})

app.get("/timeline/removeEvent/:id", function (req, res) {
  console.log(req.params)

  timelineModel.remove({
    _id: req.params.id
  }, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + event);
    }
    res.send("Event is removed");
  });
})

app.get("/findAllPokemons", function (req, res) {
  console.log("req. has been received")

  pokemonModel.find({}, function (err, pokemons) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(pokemons));
    }
    res.send(pokemons);
  });
})

app.post("/findPokemonByName", function (req, res) {
  console.log("req. has been received")
  pokemonModel.find({name: req.body.pokemonName}, function (err, pokemons) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(pokemons));
    }
    res.send(pokemons);
  });
})