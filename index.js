require("dotenv").config()

//Import libs
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let {pool,confirmCashPayment, changeDroppedYes,changeDropLocation,changePayment,verifyUser,verifyType,createValet,deleteValet, createOrder, listAllOrders,changeCarPark} = require("./db.js");

//Twilio part
const accountSid = 'AC8ed3f5f49fb7145a7325188548f02c74';
const authToken = process.env['twilioAuth'];
const client = require('twilio')(accountSid, authToken);


//Bring all the client side to the web front-end
app.use(bodyParser.json())
app.use("/",express.static("customer"));
app.use("/admin",express.static("admin"));
app.use("/valet",express.static("attendent"));

//Valet Parts
app.post("/attendant-login",async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "valet"){
			res.send(JSON.stringify({success:true,username:req.body.username,password:req.body.password}))
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});
app.post("/attendant-orders",async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "valet"){
			let orders = await listAllOrders(req.body.username);

			res.send(JSON.stringify({
				history:orders.rows,
				success:true
			}))
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});
app.post("/changecarpark",async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "valet"){
			let orders = await changeCarPark(req.body.username, req.body.parkCode, req.body.orderId);

			res.send(JSON.stringify({
				success:orders
			}))
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});
app.post("/changedroppedyes",async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "valet"){
			let orders = await changeDroppedYes(req.body.username, req.body.orderId);

			res.send(JSON.stringify({
				success:orders
			}))
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});


//Admin Parts
app.post("/admin-login",async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			res.send(JSON.stringify({success:true,username:req.body.username,password:req.body.password}))
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});
app.post("/create-valet", async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			let done = await createValet(req.body.valetUsername, req.body.valetPassword, req.body.valetEmail);
			if(done){
				res.send(JSON.stringify({success:true}))
			}else{
				res.send(JSON.stringify({success:false, error:"Failed to create valet user"}))
			}
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
});
app.post("/delete-valet", async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			let done = await deleteValet(req.body.valetEmail);
			if(done){
				res.send(JSON.stringify({success:true}))
			}else{
				res.send(JSON.stringify({success:false, error:"Failed to delete valet user"}))
			}
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
})
app.post("/add-order", async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			let done = await createOrder(req.body.orderId, req.body.cost, req.body.carNo, req.body.attendentId, req.body.timeP, req.body.location);
			if(done){
				res.send(JSON.stringify({success:true}))
			}else{
				res.send(JSON.stringify({success:false, error:"Failed to add order"}))
			}
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
})
app.post("/confirm-cash-success", async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			let done = await confirmCashPayment(req.body.orderId);
			if(done){
				res.send(JSON.stringify({success:true}))
			}else{
				res.send(JSON.stringify({success:false, error:"Failed to add order"}))
			}
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
})
app.post("/send-sms", async(req,res)=>{
	let isUser = await verifyUser(req.body.username, req.body.password);
	if(isUser){
		let isAdmin = await verifyType(req.body.username);
		if(isAdmin == "admin"){
			client.messages
				.create({
					body:
`Welcome to GreenEats Valet Service!
Click on the above link to request your car back
http://localhost:3000/?orderId=${req.body.orderId}
Thank you!`,
					from: '+12544142241',
					to:`${req.body.number}`
				})
				.then(message =>{
					res.send(JSON.stringify({success:true}))
				})
		}else{
			res.send(JSON.stringify({success:false, error:"Unauthorised"}))
		}
	}else{
		res.send(JSON.stringify({success:false,error:"Not a user"}))
	}
})


//Customer Parts
app.post("/changepayment",async(req,res)=>{
	let t = await changePayment(req.body.paymentType, req.body.orderId);
	if(t){
		res.send(JSON.stringify({success:true}))
	}else{
		res.send(JSON.stringify({success:false}))
	}
})
app.post("/changedroplocation",async(req,res)=>{
	let t = await changeDropLocation(req.body.dropLocation, req.body.orderId);
	if(t){
		res.send(JSON.stringify({success:true}))
	}else{
		res.send(JSON.stringify({success:false}))
	}
})

app.listen(3000,()=>{
	pool.query(`CREATE TABLE IF NOT EXISTS transactions(
 		id SERIAL PRIMARY KEY, 
   		order_id text,
	    payment_type text,
	 	cost numeric,
	 	payment_done text,
		pick_up_location text,
  		dropped BOOLEAN,
		drop_location text,
		time text,
  		attendent_id text,
		car_number text,
  		parking_slot_id text
	)`);

	/**
	 * @types-
	 * type: "admin", "valet"
	 */
	pool.query(`CREATE TABLE IF NOT EXISTS accounts(
 		id SERIAL PRIMARY KEY,
   		user_name text,
	 	type text,
   		password text,
		email text
 	)`);

	console.log("listening")
})