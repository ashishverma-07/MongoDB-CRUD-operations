
'use strict';

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
 
var url = 'mongodb://localhost:27017/test_db';



//used to build a mapper function for the update op.  Returns a
//function F = arg => body.  Subsequently, the invocation,
//F.call(null, value) can be used to map value to its updated value.
function newMapper(arg, body) {

  return new (Function.prototype.bind.call(Function, Function, arg, body));
}

//print msg on stderr and exit.
function error(msg) {
  console.error(msg);
  process.exit(1);
}

//export error() so that it can be used externally.
module.exports.error = error;


function dbOp(url, op) {
 
  MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server."); 
  var opJson = JSON.parse(op);
  if(opJson["op"] === "create"){
  
  db.createCollection(opJson["collection"]) ;

  db.collection(opJson["collection"]).insertMany( [{ "a": 1 },
    { "b": 2 },
    { "c": 3 }],function(err,res){
  	if(err){
  		console.log("error");
  	}
  	else{
  	console.log("Document Successfully inserted");
  }
  })
 } 
 else if(opJson["op"]==="read" ){
 
 	if(opJson["args"]){

 	 db.collection(opJson["collection"]).find(opJson["args"]).toArray(function(err, res){
 		
 	 	
  	if(err){
  		console.log("error");
  	}
  	else{
  		console.log(res);
  	}
  	
  })
 	}

 	else{
 		
 		db.collection(opJson["collection"]).find({}).toArray(function(err, res){	
 	 	
  	if(err){

  		console.log("error");
  	}
  	else{
  		console.log(res);
  	}
  	
  })
 	}
 }

 else if(opJson["op"]==="delete" ){
 
 	if(opJson["args"]){

 	 db.collection(opJson["collection"]).deleteOne(opJson["args"],function(err, res){
 	 	
  	if(err){
  		console.log("error");
  	}
  	else{
  		console.log("Document Deleted");
  	}
  	
  })
 	
}
 else{
 		
  db.dropCollection(opJson["collection"], function(err, res) {
    if(err){
  		console.log("error");
  	}
  	else {

  		if (res)
  		 console.log("Collection deleted");
  	}
   
   
  });
 	 }
 }
else if(opJson["op"]==="update"){

	var argUpdate = opJson.fn["0"];
	
	var bodyUpdate = opJson.fn["1"];
	
	var mapper = newMapper(argUpdate,  bodyUpdate);

	var d = opJson["args"];

	var updateValue = mapper.call(null,d);
	
	if(opJson["args"]){
 	 db.collection(opJson["collection"]).updateOne(d,updateValue,function(err, res){
 	 	
  	if(err){
  		console.log("error");
  	}
  	else{
  		console.log("Value Updated");
  	}
  	
  })
 	
}
}


});

}

module.exports.dbOp = dbOp;