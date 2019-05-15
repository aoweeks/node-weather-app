const express = require('express');
const path = require('path');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();


const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


app.use(express.static( path.join(__dirname, '../public') ));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Adam Weeks'
    });
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Adam Weeks'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is a help message!',
        title: 'Help',
        name: 'Adam Weeks'
    })
});


app.get('/weather', (req, res) => {

    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, data) => {

        if(error){
            return res.send({
                error: 'Could not access location'
            })
        }

        forecast(data, (forecastError, forecastData) => {
            if (forecastError) {    
                return res.send({
                    error: 'Could not find forecast'
                })
            }

            res.send({
                forecast: forecastData,
                location: data.location,
                address: req.query.address
            });
        });

    });
});

app.get('/products', (req, res) => {

    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        });
    }

    res.send({
        products: []
   });
});

app.get('/help/*', (req, res) => {
    res.render('404',{
        errMsg:'Help article not found',
        title: '404',
        name: 'Adam Weeks'
    });
});

app.get('*', (req, res) => {
    res.render('404',{
        errMsg:'Page not found',
        title: '404',
        name: 'Adam Weeks'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000!');
});