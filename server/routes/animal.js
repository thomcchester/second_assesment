var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo';//6) this was named wrong
}

router.post("/animal", function(req,res){
  console.log("Attempting to post to animal");
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(300).send(err);
    }else{
      console.log('yum yum');//7) from this I have discovered where the problem is likely to be:
      var result = [];

      var query = client.query('INSERT INTO animals (animal_name,animal_quantity) VALUES ($1, $2 ) ', [req.body.animal_name, req.body.animal_quantity]);//8)fixed this, got different error, that is cool. 10) I removed one item from the insert to coorespond to removing id
      //11) FINALLY SENDING TO THE ZOO. however not the quantity, so time to go back to that.
      //12) if have figured out that it is sending the quantity to the the server, server is not putting it on the DB
      console.log(req.body.animal_name);
      query.on('row', function(row){
        result.push(row);
        console.log("something");
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

router.get("/oldAnimal", function(req,res){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("not writing to db");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM animals');
      query.on('row', function(row){
        result.push(row);
        done();
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});

module.exports = router;
