var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

function randomNumber(min, max){
return Math.floor(Math.random() * (1 + max - min) + min);
}

module.exports=randomNumber;
