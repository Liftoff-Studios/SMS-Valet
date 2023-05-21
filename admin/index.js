/**
 * @cookie-format: "Username Password"
 * @auth-response: success: true || false
 * **/


function changePage(a){
	let pages = document.getElementsByClassName("scene-page");

	for(let i =0; i<pages.length;i++){
		pages[i].style.display = "none";
	}
	console.log(pages[2].style.display)
	pages[a].style.display = "initial";
}
changePage(0)


let login = ()=>{
	if(getCookie("auth") == false){
		let username = document.getElementById("login-username").value;
		let password = document.getElementById("login-password").value;

		fetch("/admin-login",{
			method:"POST",
			headers:{
				"content-type":"application/json"
			},
			body:JSON.stringify({
				username:username,
				password:password
			})
		}).then(d=>d.json()).then((d)=>{
			if(!d.success){
				alert("Invalid Password");
			}else{
				document.cookie = `auth=${d.username} ${d.password};`
				alert("Logged in successfully");
				document.getElementById("login").style.display = "none";
				document.querySelector("main").style.display = "flex";
				window.location.reload();
			}
		})

	}else{
		return getCookie("auth").split(" ")
	}
}

//Gets the authentication
let getCookie = (param)=>{
	let c = document.cookie.split(";").filter((e)=>{
		return e.split("=")[0].trim() == param;
	})[0];
	if(c==undefined || c.length==0 ){
		return false;
	}
	return c.split("=")[1];
}

//Logs in at the start :)
if(getCookie("auth")==false){
	document.getElementById("login").style.display = "flex";
	document.querySelector("main").style.display = "none";
}
else if(getCookie("auth")!==undefined){
	document.getElementById("login").style.display = "none";
}

function createValet(){
	let u = document.getElementById("add-valet-username").value;
	let t = document.getElementById("add-valet-password").value;
	let e = document.getElementById("add-valet-email").value;
	let [username, password] = getCookie("auth").split(" ");

	fetch("/create-valet",{
		method:"POST",
		headers:{
			"content-type":"application/json"
		},
		body:JSON.stringify({
			username:username,
			password:password,
			valetUsername:u,
			valetPassword:t,
			valetEmail:e
		})
	}).then(d=>d.json()).then(d=>{
		if(d.success){
			alert("Created valet user")
		}else{
			alert("Failed to create valet")
		}
	})
}

function deleteValet(){
	let e = document.getElementById("delete-valet-email").value;
	let [username, password] = getCookie("auth").split(" ");

	fetch("/delete-valet",{
		method:"POST",
		headers:{
			"content-type":"application/json"
		},
		body:JSON.stringify({
			username:username,
			password:password,
			valetEmail:e
		})
	}).then(d=>d.json()).then(d=>{
		if(d.success){
			alert("Deleted valet user")
		}else{
			alert("Failed to Delete valet")
		}
	})
}
function addOrder(){
	let o = document.getElementById("order_id").value,
		c = document.getElementById("cost").value,
		cn = document.getElementById("car_number").value,
		a = document.getElementById("attendant_id").value,
		t = document.getElementById("time").value,
		l = document.getElementById("location").value;

	let [username, password] = getCookie("auth").split(" ");

	fetch("/add-order",{
		method:"POST",
		headers:{
			"content-type":"application/json"
		},
		body:JSON.stringify({
			username:username,
			password:password,
			orderId: o,
			cost: c,
			carNo: cn,
			attendentId:a,
			timeP: t,
			location:l
		})
	}).then(d=>d.json()).then(d=>{
		if(d.success){
			alert("Added Order")
		}else{
			alert("Failed to add order")
		}
	})
}

function confirmCashPaymentSuccess(){
	let t = document.getElementById("edit-order-id").value;
	let [username, password] = getCookie("auth").split(" ")
	fetch("/confirm-cash-success", {
		method:"POST",
		headers:{
			"content-type":"application/json"
		},
		body:JSON.stringify({
			username:username,
			password:password,
			orderId:t
		})
	}).then(d=>d.json()).then(d=>{
		if(d.success){
			alert("Changed payment to successful")
		}else{
			alert("Failed")
		}
	})
}

function sendSMS(){
	let o = document.getElementById("order-sms").value;
	let n = document.getElementById("sms-number").value;
	let [username, password] = getCookie("auth").split(" ")
	fetch("/send-sms",{
		method:"POST",
		headers:{
			"content-type":"application/json"
		},
		body:JSON.stringify({
			username:username,
			password:password,
			orderId:o,
			number:n
		})
	})
}

let forms = document.querySelectorAll("form");
for(let i = 0; i<forms.length;i++){
	forms[i].onsubmit = (e)=>{
		e.preventDefault()
	}
}
