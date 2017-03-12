const Express = require('express');
const app = Express();
const bodyparser = require('body-parser');
const fetch = require('node-fetch');
// For portability and ease of review I left the KEY here, normally I would place
// in ENV variables to remove direct access from code.
const key = '5e562d947f0fb77549cb73938cf1bec320ebe37e';

const PORT = process.env.PORT || 8000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
// Serve the html page assets
app.use(Express.static('static', {extensions: ['html', 'htm']}));

// Moved API call to server to remove exposure of API key and CORS
function getCensusInfo(stateCode, response) {
  const url ="https://api.census.gov/data/2015/pep/population?get=POP,GEONAME&key=" + key + "&for=state:" + stateCode;
  fetch(url)
  .then(res => res.json())
  .then(data => {
    response.status(200).send(data);
  })
  .then(function(err){
    console.throw(err);
  })
}

// Initial call to serve HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/static/codeFixed.html');
})

// Handle request for each state data
app.get("/census/:state", (req, res) => {
  let state = req.params.state;
  getCensusInfo(state, res);
})

app.listen(PORT, () => {
  console.log("Census App Server Listening on Port: ", PORT);
})
