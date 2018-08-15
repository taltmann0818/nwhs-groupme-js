// local variables
var HTTPS = require('https');
// const { Client } = require('pg');

// const client = new Client({
//  connectionString: process.env.DATABASE_URL,
//  ssl: true,
// });

// client.connect();

// client.query('SELECT public,nwhs_groupme FROM information_schema.tables;', (err, res) => {
//  if (err) throw err;
//  for (let row of res.rows) {
//    console.log(JSON.stringify(row));
//  }
//  client.end();
// });


// global variables
var botID = process.env.BOT_ID;

// listens for chat's messages
function respond() {
      request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/test$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
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
