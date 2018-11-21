// local variables
var HTTPS = require('https');
const {Client} = require('pg');

// global variables
var botID = process.env.BOT_ID;
var conString = process.env.DATABASE_URL;

//connect to Postgres SQL database
const client = new Client({
  connectionString: conString,
  ssl: true,
});
client.connect();

// listens for chat's messages
function respond() {
      request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/test$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    client.query('INSERT INTO nwhs_groupme(name, message, id) VALUES($1, $2, $3)', [request.name.toString(), request.text.toString()]);
    console.log(request.name.toString() + ": " + request.text.toString());
    this.res.writeHead(200);
    this.res.end();
  }
}

// responds to user message
function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = "The bot is working";

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse,

  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });

  botReq.end(JSON.stringify(body));
}

exports.respond = respond;
