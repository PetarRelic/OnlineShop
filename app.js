// Build-in modules
const path = require('path');

//Third party modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Import
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

//Configuration of view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5ce2809b1deead3bfc0f529c')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://petar:1234@cluster0-vsy5e.mongodb.net/shop?retryWrites=true', { useNewUrlParser: true })
    .then(result => {
        User.findOne().then(user=>{
            if(!user) {
                const user = new User({
                    name: 'Petar',
                    email: 'petar@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });