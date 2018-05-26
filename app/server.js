const express = require('express')
const formidable = require('express-formidable')
const fs = require('fs')
const MongoDB = require('mongodb')
// out own modules
const config = require('./config.json')
const helpers = require('./helpers.js')


const app = express()
const MongoClient = MongoDB.MongoClient

app.use(express.static('public'), formidable())
app.set('view engine', 'ejs')


var db = null
var dbuser = config["database"]["username"]
var dbpw = config["database"]["password"]
console.log('DBUser: ' + dbuser + " | DBPass: " + dbpw)
var dburl = 'mongodb://' + dbuser + ':' + dbpw + '@ds016298.mlab.com:16298/grumblr'

MongoClient.connect(dburl, {useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('grumblr')

    app.listen(3000,() => {
        console.log('Listening to 3000!')
    })
})

// landing page - login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// register page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

// profile page
app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/profile.html')
})

// timeline
app.get('/timeline', (req, res) => {
    res.sendFile(__dirname + '/timeline.html')
})

// handles the login
app.post('/handle_login', (req, res) => {
    // if succesful login
    res.sendFile(__dirname + '/profile.html')
})

// register page
app.post('/handle_registration', (req, res) => {
    res.sendFile(__dirname + '/registration_success.html')
})

app.post('/send_blog', (req, res) => {
    var utcMS = new Date().getTime()
    var username = "iamalexander"
    var text = null
    var imageJSON = null

    if (req.fields.blog_text) {
        var text = req.fields.blog_text
    }

    if (req.files.blog_image) {
        var image_name = req.files.blog_image.name
        var image_type = req.files.blog_image.type
        var image_path = req.files.blog_image.path
        var base64String = fs.readFileSync(image_path, {encoding: 'base64'})
        imageJSON = helpers.CreateImageJSON(image_name, image_type, base64String)
    } else {
        console.log('No file uploaded or detected.')
    }
    
    //let base64Image = base64String.split(';base64,').pop();
    //var utcDate = new Date(utcMS)

    var blogDocument = helpers.CreateBlogJSON(username, utcMS, text, imageJSON)
    //db.collection.insert()
    /*var writePath = 'uploaded/testImage.jpg'
    fs.writeFile(writePath, blogDocument.image.base64String, {encoding: 'base64'}, function(err) {
        console.log('File created');
    });*/
    res.render('profile.ejs', {blogPost: blogDocument})
})


// forbidden GETS
app.get('/handle_login', (req, res) => {
    // if succesful login
    res.redirect('/')
})


