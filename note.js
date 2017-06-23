var express = require("express");
var app = express();
var formidable = require("formidable");
var db = require("./model/db.js");
var ObjectID = require('mongodb').ObjectID;
var sd = require("silly-datetime");
var ejs = require("ejs");
app.set("view engine","ejs");
app.use(express.static("./public"));
app.get("/favicon.ico",function(req,res){
    return;
});
app.get("/",function(req,res){
    db.find("student",{},{"sort":{"time":-1}},function(err,result){
        var allData = result;
        //console.log(allData);
        res.render("index",{"allDatas":allData});
        res.end();
    });
    /*db.getAllCount ("student",function(count){
        //console.log(Math.ceil(count / 5));
        res.render("index",{"allPages" : Math.ceil(count / 5)});
    });*/
});
app.post("/",function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        if(err){
            throw err;
        }
        //console.log(fields);
        var title = fields.title;
        var details = fields.details;
        var time = sd.format(new Date(),'YYYY-MM-DD HH:mm:ss');
        //console.log(time);
        db.insertOne("student",{"title":title,"details":details,"time":time},function(err,result){
            res.redirect("/");
        });
    });
});
app.get("/:id",function(req,res){
    //console.log(req.url.substr(1));
    var id = req.url.substr(1);
    db.deleteMany("student",{"_id":ObjectID(id)},function(err,result){});
    res.redirect("/");
});
app.listen(3000);