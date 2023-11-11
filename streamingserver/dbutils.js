
var pg = require('pg'),
fs = require('fs'),
log = require('./LoggerConfig'),
constants = require('./constants');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const client = new pg.Client(config.database.url);

client.connect();

function fetch_all() {
    var ret_data = structuredClone(constants.CONSTANTS.RESP_DATA);
    return new Promise((resolve, reject) => {
        let sqlstmt = "SELECT * FROM tbl_podcasts limit 5";
        client.query(sqlstmt, function(err, res) {
            if (err) {
                ret_data.status = false
                ret_data.data.error = err
                reject(ret_data);
            } else {
                ret_data.status = true;
                ret_data.data = res.rows;
                resolve(ret_data);
            }
        });
    })
}

function search_by_query(query) {
    var ret_data = structuredClone(constants.CONSTANTS.RESP_DATA);
    return new Promise((resolve, reject) => {
        let sqlstmt = "SELECT * FROM tbl_podcasts where podcasttitle LIKE '%" + query + "%' OR podcastid='" + query + "' OR podcastpublisher LIKE '%" + query + "%'";
        client.query(sqlstmt, function(err, res) {
            if (err) {
                ret_data.status = false
                ret_data.data.error = err
                reject(ret_data);
            } else {
                ret_data.status = true;
                ret_data.data = res.rows;
                resolve(ret_data);
            }
        });
    })
}

module.exports.search_by_query = search_by_query;
module.exports.fetch_all = fetch_all;