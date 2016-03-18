var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');
var animalRouter = require('./routes/animal.js');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo';
}

pg.connect(connectionString, function(err, client,done){
    console.log("thinger"); //this shows up so pg.connect does run
  if (err){
    console.log('error man: ', err);
    var query = client.query(

      'CREATE TABLE IF NOT EXISTS animals(' +
      'animal_name varchar(20) NOT NULL'+ //9) took out a serial id
      'animal_quantity varchar(20) NOT NULL);');
      //1)I HAVE FIGURED OUT THAT THE PROBLEM IS SOMEWHERE AROUND HERE
      console.log(query);// 2)that does not show up.
    query.on('end',function(){
      console.log('working!');
      done();
    });
    //3)'end' doesnt run
    query.on('error', function(error){
      console.log('sandwich');// 5)this does not run so it is not this error either
      console.log(error);
      console.log('not making tables or something...');
      done();
    });
    //4)it might be over where an individual one is but no table exists yet
  }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",animalRouter);

app.set("port",(process.env.PORT || 3000));

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"./public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
