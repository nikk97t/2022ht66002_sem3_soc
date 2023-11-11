const express   = require('express'),
      app       = express(),
      port      = 3004,
      fs        = require('fs'),
      path      = require('path');

var bodyParser = require('body-parser');

const log = require('./LoggerConfig');
const {CONSTANTS} = require('./constants');

var dbutil = require('./dbutils');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));


app.get('/search', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);

    if (req.query.s === undefined) {
        respdata.status = false;
        respdata.statusCode = 400;
        respdata.message = "no search query provided";
        res.setHeader('Content-Type', 'application/json');
        res.status(respdata["statusCode"]).json(respdata)
    } else if (new String(req.query.s).length < 3) {
        respdata.status = false;
        respdata.statusCode = 400;
        respdata.message = "search query must have minimum of 3 characters";
        res.setHeader('Content-Type', 'application/json');
        res.status(respdata["statusCode"]).json(respdata);
    } else {
        dbutil.search_by_query(req.query.s)
            .then((resp) => {
                respdata.status = true;
                respdata.statusCode = 200;
                respdata.data = resp.data;

                // add hateos links
                for (let idx = 0; idx < respdata.data.length; idx++) {
                    const element = respdata.data[idx];
                    respdata.data[idx]["_links"] = {
                        "self": {"href": "/podcasts/" + respdata.data[idx]["podcastid"]},
                        "publisher": {"href": "/publisher/" + respdata.data[idx]["podcastpublisher"]},
                        "genre": {"href": "/genre/" + respdata.data[idx]["podcastgenre"]}
                    }
                    
                }
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

app.get('/stream', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);
    
    if (req.query.podcastid === undefined) {
        respdata.status = false;
        respdata.statusCode = 400;
        respdata.message = "podcastid not provided";
        res.setHeader('Content-Type', 'application/json');
        res.status(respdata["statusCode"]).json(respdata)
    } else {
        // considering all stream to be of same file
        const filePath = path.join(process.cwd(), 'file.mp3');
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }
});


app.get('/', (req, res) => {
    let respdata = structuredClone(CONSTANTS.REPONSE_PAYLOAD);
    respdata["message"] = "Authentication server home";


    dbutil.fetch_all()
            .then((resp) => {
                respdata.status = true;
                respdata.statusCode = 200;
                respdata.data = resp.data;

                // add hateos links
                for (let idx = 0; idx < respdata.data.length; idx++) {
                    const element = respdata.data[idx];
                    respdata.data[idx]["_links"] = {
                        "self": {"href": "/podcasts/" + respdata.data[idx]["podcastid"]},
                        "publisher": {"href": "/publisher/" + respdata.data[idx]["podcastpublisher"]},
                        "genre": {"href": "/genre/" + respdata.data[idx]["podcastgenre"]}
                    }
                    
                }
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


    // res.setHeader('Content-Type', 'application/json');
    // res.status(respdata["statusCode"]).json(respdata)
})

app.listen(port, () => {
    log.info(`APIServer listening on port ${port}`)
})