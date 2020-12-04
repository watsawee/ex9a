var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/weather', function(req, res) {
  
  	console.log("test weather!!!!!");
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("admin");
	  	//dbo.collection("weather").findOne({}, function(err, result) {
	  	//dbo.collection("weather").find({}).toArray(function(err, result) {

	  	var query = { area: "LND" };
	  	//var query = { temp: { $gt: 25 } };
	  	//var query = { temp: { $lt: 25 } };
	  	//var query = { $and: [ { temp: { $lte: 25 } }, { wind: { $gte: 15 } } ] }
	  	
	  	dbo.collection("weather").find(query).toArray(function(err, result) {


	  	//var mysort = {wind: 1 };
	  	//dbo.collection("weather").find({}).sort(mysort).limit(3).toArray(function(err, result) {

	    if (err) throw err;
	    //console.log(result.area + " : "+ result.temp);//findOne
	    //console.log(result);//findAll

	    var myResult = "";
	    for(i=0; i<result.length; i++){
	    	myResult += result[i].area + " : "+ result[i].temp+"<br>";
	    	//console.log(result[i].area + " : "+ result[i].temp);
	    }

	    db.close();
	    //res.send(JSON.stringify(result));
	    res.send(myResult);
	  });
	});

});

router.get('/books', function(req, res) {
  
  	console.log("test weather!!!");
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("admin");
	  	var query = { pageCount: { $gte: 500 } };
	  	dbo.collection("books").find(query).toArray(function(err, result) {

	    if (err) throw err;

	    db.close();
	    res.send(JSON.stringify(result));
	  });
	});

});


router.get('/convert/:area_code/:unit', function(req, res) {
  
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;

	  var area_code = req.params.area_code;
	  var unit = req.params.unit;

	  var dbo = db.db("admin");

	  var query = {area: area_code};
	  dbo.collection("weather").find(query).toArray(function(err, result) {
	   		if (err) throw err;

	   		var t;
	   		var u;

	   		if(unit == "F"){
	   			t = ((result[0].temp/5)*9)+32;
	   			u = "Fahrenheit";
	   			console.log("F");
	   		}else if(unit == "K"){
	   			t = result[0].temp + 273.15;
	   			u = "Kelvin";
	   			console.log("K");
	   		}else if(unit == "R"){
	   			t = (result[0].temp * 4)/5;
	   			u = "Reaumur";
	   			console.log("R");
	   		}else{//C
	   			t = result[0].temp;
	   			u = "Celsius";
	   			console.log("C");
	   		}
	   		var output = {"temp":t,"unit":u};
 			res.send(output);

	    	db.close();
	  });
	});

});



module.exports = router;
