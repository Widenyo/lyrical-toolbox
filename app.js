require("dotenv").config();
const express = require("express");
const fs = require('fs');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const router = require('./routes/index.router')


const app = require('express')();


//motor de plantillas
app.set('view engine', 'ejs');
//usar carpeta para static files
app.use("/public", express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());






//router

app.use('/', router)


app.listen(process.env.PORT,  async () => {
  async function destruccion(){
    const files = fs.readdirSync(`${__dirname}/musica`)
    for (const file of files) {
      if(file !== '.gitkeep')fs.unlink(`${__dirname}/musica/${file}`, err =>{
        if(err) console.log(err)
      })
    }
    await delay(300000)
    destruccion()
  }
  destruccion()
  console.log(`Listening on port ${process.env.PORT}`);

});