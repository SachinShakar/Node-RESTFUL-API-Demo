const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const storage = multer.diskStorage({
	destination : function(req, file, cb){
		cb(null, './uploads');
	},
	filename : function(req, file, cb){
		cb(null, file.originalname);
	}

});

const fileFilter = (req, file, cb) => {
	if(file.mimetype !== 'image/png'){
		//to reject request
		cb(null, false);
	}
	else
		cb(null, true);
}

const upload = multer({
	storage : storage, 
	limits : {
		fileSize : 1024 * 1024 * 5
	},
	fileFilter : fileFilter
});

router.get('/', (req, res, next) => {
	Product.find().select("name price _id productImg").exec()
	.then( result => {
		if(result.length > 0){
			const response = {
				count : result.length,
				products : result.map(doc => {
					return {
						name : doc.name,
						price : doc.price,
						id : doc._id,
						productImg : doc.productImg,
						request: {
							type : "GET",
							url : 'http://localhost:3000/prodcuts/' + doc._id
						}	
					} 
				})
			}
			res.status(200).json(response);
		}
		else
			res.status(200).json({message: "No products exists in the system"});
	})
	.catch(err =>{
		res.status(200).json(err);
	});
});


router.post('/', upload.single('productImg'), (req, res, next) => {
	console.log(req.file);
	const product = new Product({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		price : req.body.price,
		productImg : "http://localhost:3000/" + req.file.path
	});

	product.save()
	.then(result => {
		console.log(result);
		res.status(201).json({
			mesage : "Success",
			product : result
		});
		
	})
	.catch(err =>{
		console.log(err);
		res.status(201).json({
			mesage : "Failed"
		});
	});

	

	
});



router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;

	Product.findById(id).exec()
	.then( product => {
		console.log(product);
		if(product)
			res.status(200).json(product);
		else
			res.status(200).json({
				message : "No such ID exists"
			});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
	
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;

	Product.remove({_id : id}).exec()
	.then(result =>{
		res.status(200).json(result);
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json(err);
	});
});

router.patch('/:productId', (req, res, next)=>{
	const id = req.params.productId;
	updateValues = {};

	for (const values of req.body){
		updateValues[values.propName] = values.value;
	}

	Product.update({_id : id}, {$set : updateValues}).exec()
	.then(result => {
		res.status(200).json(result);
	})
	.catch(err =>{
		res.status(500).json(err);
		console.log(err);
	});
});

module.exports = router;