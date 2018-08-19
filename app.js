//include modules
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    bot = require('./bot.js'),
    app = express()

const {Client} = require('pg');

// DB connecion string
var conString = 'postgres://msyywltsommhgb:a3f503ad7a1179aa1a6c2ad0f781bafc80821b9722189128f15960eb2d5bf6de@ec2-23-23-216-40.compute-1.amazonaws.com:5432/de8bd2k0oj2g58'

//Connect to pg client
const client = new Client({
    connectionString: conString,
    ssl: true,
});
client.connect();

//Assign dust engine to .dust files
app.engine('dust', cons.dust);

//Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
    //PG connect
    client.query('SELECT * FROM nwhs_groupme', function(err, result){
        if(err) {
            return console.error('error running query', err);
        }
        res.render('index', {nwhs_groupme: result.rows});
    });
});

//Groupme bot POST service
app.post('/', function(req, res){
    res.send(bot.respond)
});

// Server
app.listen(3000, function(){
    console.log('Server Started On Port 3000');
});