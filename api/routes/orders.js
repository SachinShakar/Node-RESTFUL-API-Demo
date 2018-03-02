const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
	Order.find().populate('productId', '_id name price').exec()
	.then(result => {
		if(result.length <=0)
			res.status(200).json({
				message : "There are no orders"
			});
		else{
			res.status(200).json({
				totalOrders: result.length,
				orders : result.map(o =>{
					return {
						id: o._id,
						productId : o.productId,
						quantity : o.quantity,
						request : {
							type: 'GET',
							url : 'http://localhost:3000/orders/' + o._id
						}
					}
				}),
			});
		}
	})
	.catch(err =>{
		console.log(err);
		res.status(200).json(err);
	});
});

router.post('/', (req, res, next) => {
	const order = new Order({
		_id : new mongoose.Types.ObjectId(),
		productId : req.body.productId,
		quantity : req.body.qty
	});

	order.save()
	.then(result => {
		console.log(result);
		res.status(201).json({
			message : "Order saved",
			_id : result._id,
			productId : result.productId,
			quantity: result.quantity,
			request : {
				type : 'GET',
				url : "http://localhost:3000/orders/" + result._id
			}
		});
	})
	.catch(err => {
		console.log(err);
		response.status(500).json(err);
	});
});


router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;

	Order.findById(id).exec()
	.then(result=>{

		res.status(200).json({
			id : result._id,
			quantity : result.quantity,
			productId : result.productId
		});
		
	})
	.catch(err=>{
		res.status(500).json(err);
	});
});


module.exports = router;