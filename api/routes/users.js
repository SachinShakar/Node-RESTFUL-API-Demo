const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


router.post('/signup', (req, res, next) => {

	User.find({email : req.body.email}).exec()
	.then( result => {
		if(result.length >0)
			return res.status(409).json({
				message : 'User already exists'
			})
		else{
			bcrypt.hash( req.body.password, 10, (err, hash) => {
				if(err){
					return res.status(500).json({
						error : err
					});
				}
				else{
					const user = new User({
						_id : mongoose.Types.ObjectId(),
						email : req.body.email,
						password : hash
					});

					user
					.save()
					.then( (result) => {
						res.status(200).json({
							message : 'User created successfully'
						});
						console.log(result);
					})
					.catch( (err) => {
						res.status(200).json({
							error : err
						});
						console.log(err);
					});
				}
			} );

		}
	});
	
});


router.post('/login', (req, res, next) => {
	User.find({email : req.body.email}).exec()
	.then( user =>{
		if(user.length == 0)
			return res.status(401).json({
				message : 'Authentication failed'
			});
		bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
			if(err)
				return res.status(401).json({
					error : err
				});

			if(!result) 
				return res.status(401).json({
					message : 'Authentication failed'
				});

			const token = jwt.sign(
				{email : user[0].email, userId : user[0]._id}, 
				"secretkey", 
				{
					expiresIn : '1h'
				});

			res.status(201).json({
				message : 'Authentication successful',
				token : token
			});

		})
	})
	.catch( err => {
		res.status(200).json({
			error : err
		});
		console.log(err);
	});

});

module.exports = router;