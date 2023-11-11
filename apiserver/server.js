const express   = require('express'),
      app       = express(),
      port      = 3000;

var bodyParser = require('body-parser')

const log = require('./LoggerConfig');
const {CONSTANTS} = require('../utils/utils');


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.post('/users', (req, res) => {
    let respdata = CONSTANTS.REPONSE_PAYLOAD;

    console.log(req.body);

    res.setHeader('Content-Type', 'application/json');
    res.status(respdata["statusCode"]).json(respdata)

});


app.get('/', (req, res) => {
    let respdata = CONSTANTS.REPONSE_PAYLOAD;
    respdata["message"] = "API Server home";

    res.setHeader('Content-Type', 'application/json');
    res.status(respdata["statusCode"]).json(respdata)
})

app.listen(port, () => {
    log.info(`APIServer listening on port ${port}`)
})