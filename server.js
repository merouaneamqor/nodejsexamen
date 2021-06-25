var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MerouanEamqor%1998',
    database: 'nodejsexamen'
});

// INIT
var app = express();
// Init Session 

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});


app.get('/login', (req, res) => {
    // Login Code 
    var login = req.query.login;
    var password = req.query.password;

    if (login && password) {
        connection.query('SELECT * FROM comptes WHERE login = ? AND password = ?', [login, password], function(error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.login = login;
                res.redirect('/home');
            } else {
                res.send('Incorrect login and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter login and Password!');
        res.end();
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.sendFile(__dirname + '/static/home.html');

    } else {
        response.send('<h1>Please <a href="/">login</a> to view this page! </h1>');
    }

});

app.get('/logout', function(request, response) {
    if (request.session.loggedin) {
        request.session.destroy();
        response.redirect('/');

    } else {
        response.send('<h1>Please <a href="/">login</a> to use this! </h1>');

    }
    response.end();
});
app.get('/search', function(req, res) {
    fs.appendFile('mynewfile1.txt', req.query.req + ',', function(err) {
        if (err) throw err;
        console.log('Saved!');
    });
    connection.query('SELECT * FROM Questions_Reponses WHERE question LIKE "%' + req.query.req + '%"',
        function(err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (i = 0; i < rows.length; i++) {
                data.push(rows[i].reponse);
            }
            res.end(JSON.stringify(data));
        });
});

const port = 8080
app.listen(port, () => console.log(`This app is listening on port ${port}`));