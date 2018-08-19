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
var conString = process.env.DATABASE_URL;

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

//Groupme bot POST service
app.post('/', function(req, res){
    res.send(bot.respond);
});

app.get('/', function(req, res){
    //PG connect
    client.query('SELECT * FROM nwhs_groupme', function(err, result){
        if(err) {
            return console.error('error running query', err);
        }
        res.render('index', {nwhs_groupme: result.rows});
    });
});

// Server
port = Number(process.env.PORT || 5000);
app.listen(port, function(){
    console.log('Server Started On Port 5000');
});