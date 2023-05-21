function changePage(a){
    let pages = document.getElementsByClassName("scene-page");

    for(let i =0; i<pages.length;i++){
        pages[i].style.display = "none";
    }

    pages[a].style.display = "initial";
}
changePage(0);

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

//Get Transactions
let getTransactions = ()=>{
    let [username, password] = getCookie("auth").split(" ");
    fetch("/attendant-orders",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    }).then(d=>d.json())
        .then(d=>{
            if(d.success){
                let dones = [];
                let pickups = [];
                let drops = [];

                for(let i = 0; i<d.history.length;i++){
                    if(d.history[i].parking_slot_id==null){
                        pickups.push(d.history[i])
                    }else if(d.history[i].dropped == null){
                        drops.push(d.history[i])
                    }else{
                        dones.push(d.history[i])
                    }
                }

                let d_table = document.querySelector("#drop_table tbody");
                d_table.innerHTML = "";
                for(let i = 0; i<drops.length;i++){
                    d_table.innerHTML += `
                    <tr>
                      <td>${drops[i].order_id}</td>
                      <td>${drops[i].drop_location}</td>
                      <td>${drops[i].parking_slot_id}</td>
                      <td>${drops[i].payment_type=="online"?"No":"Yes"}</td>
                      <td>${drops[i].cost}</td>
                      <td>
                        <button class="btn btn-warning" type="button" onclick="openCarDroppedPrompt('${drops[i].order_id}')">Dropped Car?</button>
                      </td>
                    </tr>`
                }

                let h_table = document.querySelector("#history-table tbody");
                h_table.innerHTML = "";
                for(let i = 0; i<dones.length;i++){
                    h_table.innerHTML += `
                        <tr>
                            <td>${dones[i].order_id}</td>
                            <td>${dones[i].parking_slot_id}</td>
                            <td>${dones[i].car_number}</td>
                        </tr>
                    `
                }

                let p_table = document.querySelector("#pick_up_table tbody");
                p_table.innerHTML = "";
                for(let i = 0; i<pickups.length;i++){
                    p_table.innerHTML += `
                    <tr>
                      <td>${pickups[i].order_id}</td>
                      <td>${pickups[i].pick_up_location}</td>
                      <td>${pickups[i].cost}</td>
                      <td>${pickups[i].payment_type==null?"Undecided":pickups[i].payment_type}</td>
                      <td>${pickups[i].car_number}</td>
                      <td>
                        <button class="btn btn-warning" type="button" onclick="openCarParkedPrompt('${pickups[i].order_id}')">Picked up Car?</button>
                      </td>
                    </tr>`
                }
            }else{
                alert("Error while getting list")
            }
        })
}
try{
    getTransactions();
}catch{
    console.log("")
}
function openCarParkedPrompt(a){
    document.getElementById("pick_up_modal").classList.remove("hide");
    document.getElementById("pick_up_modal").classList.add("show");
    document.getElementById("pick_up_modal").style.zIndex = "100";
    document.getElementById("confirm_pickup").onclick = ()=>{
        let [username,password] = getCookie("auth").split(" ")
        fetch("/changecarpark",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                username:username,
                password:password,
                orderId:a,
                parkCode:document.getElementById("parking_slot_prompt").value
            })
        }).then(d=>d.json()).then(d=>{
            if(d.success){
                alert("Successfully posted parking to database")
            }else{
                alert("Failed to post parking")
            }
            document.getElementById('pick_up_modal').classList.remove('show');document.getElementById('pick_up_modal').classList.add('hide');document.getElementById('pick_up_modal').style.zIndex = '-2'
        })
    }
}

function openCarDroppedPrompt(a){
    let [username, password] = getCookie("auth").split(" ")
    if(window.confirm("Are you sure you have dropped the car?")){
        fetch("/changedroppedyes",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                username: username,
                password: password,
                orderId:a
            })
        }).then(d=>d.json()).then(d=>{
            if(d.success){
                window.location.reload();
            }else{
                alert("Failed to confirm drop, please reload and try again")
            }
        })
    }
}
//Login
let login = ()=>{
    if(getCookie("auth") == false){
        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;

        fetch("/attendant-login",{
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

//Logs in at the start :)
if(getCookie("auth")==false){
    document.getElementById("login").style.display = "flex";
    document.querySelector("main").style.display = "none";
}
else if(getCookie("auth")!==undefined){
    document.getElementById("login").style.display = "none";
}

let forms = document.querySelectorAll("form");
for(let i = 0; i<forms.length;i++){
    forms[i].onsubmit = (e)=>{
        e.preventDefault()
    }
}