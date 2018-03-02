const express = require('express');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');


mongoose.connect('mongodb://admin:admin@node-project-shard-00-00-ncdai.mongodb.net:27017,node-project-shard-00-01-ncdai.mongodb.net:27017,node-project-shard-00-02-ncdai.mongodb.net:27017/test?ssl=true&replicaSet=node-project-shard-0&authSource=admin');



app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//To handle CORS (Cross Doamin Resource Sharing)
app.use( (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

	if(req.method === "OPTIONS"){
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}

	next();
});

//to make uploads public
app.use('/uploads', express.static('uploads'));

app.use('/products', productRoutes);

app.use('/orders', orderRoutes);



//for error hanling

app.use( (req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;

	next(error);
});

app.use( (error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error : {
			message : error.message
		}
	});
});



module.exports = app;