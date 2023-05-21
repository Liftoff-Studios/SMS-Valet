//Postgres
let pg = require("pg");
let creds = {
    user: process.env['pg-user'],
    host: process.env['pg-host'],
    database: process.env['pg-db'],
    password: process.env['pg-password'],
    ssl:true
}
let pool = new pg.Pool(creds) //Pool Example

/**
 * @Miscellaneous functions
 **/

//Verifies if user exists and password is correct
let verifyUser = async(username, password)=>{
    let foo = await pool.query("SELECT * FROM accounts WHERE user_name=$1 AND password=$2",[username, password]);
    if(foo.rows[0] == undefined){
        return false;
    }else{
        return true;
    }
}

//sends user type
let verifyType = async (username)=>{
    let foo = await pool.query("SELECT * FROM accounts WHERE user_name=$1",[username]);
    try{
        return foo.rows[0].type;
    }catch{
        return "err";
    }
}


/**
 * @CRUD Functions admin
 **/
let createValet = async (username, password, email)=> {
    let exists = await pool.query("SELECT * FROM accounts WHERE email=$1 AND user_name=$2",[email,username]);
    if(exists.rows[0]!==undefined){
        return false;
    }
    await pool.query("INSERT INTO accounts(user_name, password, email, type) VALUES ($1, $2, $3, 'valet');",[username, password, email])
        .catch((e)=>{
            return false;
        })
    return true;
}
let deleteValet = async (email)=>{
    await pool.query("DELETE FROM accounts WHERE email=$1 AND type='valet'",[email])
        .catch((e)=>{
            return false;
        })
    return true;
}
let createOrder = async(orderId, cost, carNo, attendentId, time, location)=>{
    let isattendent = await verifyType(attendentId);
    if(isattendent=="err"||isattendent!=="valet"){
        return false;
    }
    await pool.query("INSERT INTO transactions(order_id, cost, car_number, attendent_id, time, pick_up_location, payment_done ) values($1, $2, $3, $4, $5, $6, 'false')",[orderId, cost, carNo, attendentId, time, location])
        .catch((e)=>{
            return false;
        })
    return true;
};
//List All orders, not complete yet
let listAllOrders = async(valet_username)=>{
    try{
        let t = await pool.query("SELECT order_id, payment_type, cost, pick_up_location, drop_location, dropped, car_number, parking_slot_id FROM transactions WHERE attendent_id=$1", [valet_username])
        return t;
    }catch{
        return false;
    }
}
let changeCarPark = async(valet, carparkid, orderId)=>{
    let t = await pool.query("UPDATE transactions SET parking_slot_id=$1 WHERE order_id=$2 AND attendent_id=$3",[carparkid, orderId, valet]);
    return true;
}
let changePayment = async(t, orderId)=>{
    let x = await pool.query("UPDATE transactions SET payment_type=$1 WHERE order_id=$2", [t, orderId]);
    if(t=="online"){
        await pool.query("UPDATE transactions SET payment_done='true' WHERE order_id=$1", [orderId]);
    }
    return true;
}

let changeDropLocation = async(t, orderId)=>{
    let x = await pool.query("UPDATE transactions SET drop_location=$1 WHERE order_id=$2", [t, orderId]);
    return true;
}

let changeDroppedYes = async(valet, orderId)=>{
    let t = await pool.query("UPDATE transactions SET dropped='true' WHERE order_id=$1 AND attendent_id=$2",[orderId, valet]);
    return true;
}

let confirmCashPayment = async(a)=>{
    await pool.query("UPDATE transactions SET payment_done='true' WHERE order_id=$1",[a]);
    return true;
}
/**
 * @CRUD Functions admin
 **/

module.exports = {pool, confirmCashPayment, verifyType, verifyUser, createValet, deleteValet, createOrder, listAllOrders, changeCarPark,changePayment,changeDropLocation, changeDroppedYes}