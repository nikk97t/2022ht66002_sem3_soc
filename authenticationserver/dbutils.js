
var pg = require('pg'),
fs = require('fs'),
log = require('./LoggerConfig'),
constants = require('./constants'),
{ v4: uuidv4 } = require('uuid');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const client = new pg.Client(config.database.url);

client.connect();

function validate_user_by_email(useremail, userpassword) {
    var ret_data = structuredClone(constants.CONSTANTS.RESP_DATA);
    return new Promise((resolve, reject) => {
        let sqlstmt = "SELECT userid from tbl_users where useremail='" + useremail + "' AND userpassword='" + userpassword + "' LIMIT 1";
        client.query(sqlstmt, function(err, res) {
            if (err) {
                ret_data.status = false
                ret_data.data.error = err
                reject(ret_data);
            } else {
                ret_data.data.usersdata = res.rows;
                if (res.rows.length === 0) {
                    ret_data.status = false;
                    ret_data.message = "Invalid credentials"
                } else {
                    ret_data.status = true;
                    ret_data.message = "Successfully validated credentials"
                }
                resolve(ret_data);
            }
        });
    })
}

function fetch_user_details_by_email(useremail) {
    var ret_data = structuredClone(constants.CONSTANTS.RESP_DATA);
    return new Promise((resolve, reject) => {
        let sqlstmt = "SELECT * FROM tbl_users where useremail='" + useremail + "' LIMIT 1"
        client.query(sqlstmt, function(err, res) {
            if (err) {
                ret_data.status = false
                ret_data.data.error = err
                reject(ret_data);
            } else {
                ret_data.status = true;
                ret_data.data.usersdata = res.rows;
                ret_data.data.present = (res.rows.length === 0 ? false : true)
                resolve(ret_data);
            }
        });
    })
}

function create_new_user(username, useremail, userpassword) {
    var ret_data = structuredClone(constants.CONSTANTS.RESP_DATA);
    return new Promise((resolve, reject) => {
        fetch_user_details_by_email(useremail)
            .then((existingcheck_resp) => {
                if (existingcheck_resp.data.present) {
                    ret_data["status"] = false;
                    ret_data["data"] = existingcheck_resp["data"]["usersdata"]
                    ret_data["message"] = "User already exist with email: " + useremail
                    reject(ret_data);
                } else {
                    // user not present, so create one
                    // just clear data
                    let newuserid = uuidv4();
                    let sqlstmt = "INSERT INTO tbl_users (userid, username, useremail, userpassword) VALUES('" + newuserid + "', '" + username + "', '" + useremail + "', '" + userpassword + "');"
                    client.query(sqlstmt, function(err, res) {
                        if (err) {
                            ret_data.status = false
                            ret_data.data.error = err
                            reject(ret_data);
                        } else {
                            ret_data.status = true;
                            ret_data.data["userid"] = newuserid;
                            ret_data.data["useremail"] = useremail;
                            resolve(ret_data);
                        }
                    })
                }
            }).catch((existingcheck_err) => {
                ret_data["status"] = false;
                ret_data["data"]["error"] = existingcheck_err.data.error
                reject(ret_data);
            })
    })
    
}

module.exports.create_new_user = create_new_user;
module.exports.fetch_user_details_by_email = fetch_user_details_by_email;
module.exports.validate_user_by_email = validate_user_by_email;