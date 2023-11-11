const express   = require('express'),
      app       = express(),
      port      = 3002,
      fs        = require('fs');

var bodyParser = require('body-parser');

const log = require('./LoggerConfig');
const {CONSTANTS} = require('./constants');

var dbutil = require('./dbutils');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.post('/authenticate', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);

    if (req.body.useremail === undefined || req.body.userpassword === undefined) {
        respdata.status = false;
        respdata.statusCode = 400;

        if (req.body.useremail === undefined) {
            respdata.message = "useremail not provided";
        } else if (req.body.userpassword === undefined) {
            respdata.message = "userpassword not provided";
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(respdata["statusCode"]).json(respdata)
    } else {
        dbutil.validate_user_by_email(req.body.useremail, req.body.userpassword)
            .then((resp) => {
                if (resp.status) {
                    // valid
                    respdata.status = true;
                    respdata.statusCode = 200;
                    respdata.data = resp.data.usersdata[0];
                } else {
                    //invalid
                    respdata.status = false;
                    respdata.statusCode = 401;
                    respdata.data = resp.data.usersdata;
                }
                respdata.message = resp.message;
            })
            .catch((errresp) => {
                respdata.status = false;
                respdata.statusCode = 500;
                respdata.message = errresp.message;
            })
            .finally(() => {
                res.setHeader('Content-Type', 'application/json');
                res.status(respdata["statusCode"]).json(respdata)
            });
    }

});

app.post('/users', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);

    if (req.body.useremail === undefined || req.body.username === undefined || req.body.userpassword === undefined) {
        respdata.status = false;
        respdata.statusCode = 400;

        if (req.body.useremail === undefined) {
            respdata.message = "useremail not provided";
        } else if (req.body.username === undefined) {
            respdata.message = "username not provided";
        } else if (req.body.userpassword === undefined) {
            respdata.message = "userpassword not provided";
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(respdata["statusCode"]).json(respdata)
    } else {
        dbutil.create_new_user(req.body.username, req.body.useremail, req.body.userpassword)
            .then((resp) => {
                respdata.status = true;
                respdata.statusCode = 201;
                respdata.data = resp.data;
            })
            .catch((errresp) => {
                respdata.status = false;
                respdata.statusCode = 500;
                respdata.message = errresp.message;
            })
            .finally(() => {
                res.setHeader('Content-Type', 'application/json');
                res.status(respdata["statusCode"]).json(respdata)
            });
    }

});


app.get('/', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);
    respdata["message"] = "Authentication server home";

    res.setHeader('Content-Type', 'application/json');
    res.status(respdata["statusCode"]).json(respdata)
})

app.listen(port, () => {
    log.info(`APIServer listening on port ${port}`)
})