const express = require('express');
const { render } = require('express/lib/response');
const res = require('express/lib/response');
const app = express()
const https = require("https")
const cors = require('cors');
app.use(cors());

app.set('view engine', 'ejs')

app.listen(process.env.PORT || 4000, (err) => {
    if (err) console.log(err);
})

app.use(express.static("./public"))

app.get('/profile/:id', (req, res) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    https.get(url, function (https_res) {
        data = '';
        https_res.on("data", function (chunk) {
            // console.log(chunk);
            data += chunk
        })

        https_res.on('end', function () {
            data = JSON.parse(data)

            hp_stats = data.stats.filter((obj) => {
                return obj.stat.name == "hp"
            }).map((obj) => {
                return obj.base_stat
            })
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "img_path": data.sprites.other["official-artwork"]["front_default"],
                "hp": hp_stats,
            })
        })
    })
})

