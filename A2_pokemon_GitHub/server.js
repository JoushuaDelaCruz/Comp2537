const express = require('express')
const app = express()
const cors = require("cors")
const mongoose = require('mongoose');
app.use(express.json())
const bodyparser = require("body-parser");
var session = require('express-session');

mongoose.connect("mongodb+srv://TestingPokemons:vEneJObw87q51icQ@cluster0.pi9xp.mongodb.net/TestPokemons?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true });
const pokemonSchema = new mongoose.Schema({
  text: String,
  time: String,
  hits: Number,
  name: String,
  username: String,
  password: String,
  user: String,
  status: Boolean,
  paid: Number,
  items: [String]
});

const pokemonModel = mongoose.model("pokes", pokemonSchema);

const timelineModel = mongoose.model("timelines", pokemonSchema);

const userModel = mongoose.model("users", pokemonSchema)

const userTimelineModel = mongoose.model("usertimelines", pokemonSchema)

const userCartsModel = mongoose.model("usercarts", pokemonSchema)

app.use(session({ secret: "BornThisWay", saveUninitialized: true, resave: true }))

app.use(cors())

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

function authenticate(req, res, next) {
  if (req.session.authenticated)
    next()
  else {
    res.redirect("/login")
  }
}

app.get("/", authenticate, function (req, res) {
  res.redirect("/index.html")
})

app.get("/search", authenticate, function (req, res) {
  res.sendFile(__dirname + '/public/search.html')
})

app.get("/pokemon", authenticate, function (req, res) {
  res.sendFile(__dirname + '/public/pokemon.html')
})

app.get("/profile", authenticate, function (req, res) {
  res.sendFile(__dirname + '/public/profile.html')
})

app.get("/login", function (req, res) {
  if (req.session.authenticated) {
    res.redirect('/profile')
  } else {
    res.sendFile(__dirname + '/public/login.html')
  }
})

app.get("/cart", authenticate, function (req, res) {
  res.sendFile(__dirname + '/public/cart.html')
})

app.put("/createNewCart/:userId", async (req, res) => {
  userCartsModel.create({
    user: req.params.userId,
    status: false,
    paid: 0
  }, function (err, cart) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + cart);
    }
    console.log(cart)
    res.send(cart)
  })
})

app.get("/addToCart/:userId/:product", (req, res) => {
  userCartsModel.findOneAndUpdate({user: req.params.userId, status: false}, {$push: {items: req.params.product}}, (err, cart) => {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(cart));
    }
    res.send("Product successfully added");
  })
})

app.get("/getUnpurchasedCart/:userId", (req, res) => {
  userCartsModel.find({
    user: req.params.userId,
    status: false
  }, (err, cart) => {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(cart));
    }
    res.send(cart);
  })
})

app.get("/getCart/:cartId", (req, res) => {
  userCartsModel.find({
    _id: req.params.cartId,
  }, (err, cart) => {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(cart));
    }
    res.send(cart);
  })
})

app.get("/purchaseCart/:cartId/:total", (req, res) => {
  userCartsModel.findOneAndUpdate({_id: req.params.cartId}, {paid: parseInt(req.params.total), status: true}, (err, cart) => {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(cart));
    }
    res.send("Cart Purchased");
  })
})

app.get("/getPreviousCarts/:userId", (req, res) => {
  userCartsModel.find({
    user: req.params.userId,
    status: true
  }, (err, cart) => {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(cart));
    }
    res.send(cart);
  })
})

app.post('/login', async (req, res) => {
  await searchUser(req.body.username, req.body.password).then(user => {
    req.session.user = user
  })
  req.session.authenticated = req.session.user != null
  res.send({
    success: req.session.authenticated,
    user: req.session.user,
    message: req.session.authenticated ? "Authentication success." : "Authentication failed."
  })
})

async function searchUser(username, password) {
  const user = await userModel.find({
    username: username,
    password: password
  })
  return user[0]
}

app.listen(process.env.PORT || 5000, function (err) {
  if (err) console.log(err);
})

app.use(express.static("public"))

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

app.get("/getAllUserEvents/:userId", function (req, res) {

  userTimelineModel.find({ user: req.params.userId }, function (err, event) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(event));
    }
    res.send(event)
  });
})

app.put("/insertUserEvents", function (req, res) {

  userTimelineModel.create({
    text: req.body.text,
    time: req.body.time,
    user: req.body.user,
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
  }, {
    $inc: { hits: 1 }
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
  pokemonModel.find({ name: req.body.pokemonName }, function (err, pokemons) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(pokemons));
    }
    res.send(pokemons);
  });
})