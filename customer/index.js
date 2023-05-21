let params = new URLSearchParams(document.location.search);
if(params.get("orderId")==null){
    alert("Enter correct link")
}

function changePage(a){
    let pages = document.getElementsByClassName("scene-page");

    for(let i =0; i<pages.length;i++){
        pages[i].style.display = "none";
    }
    pages[a].style.display = "initial";
}
changePage(0)

function changePaymentMode(a){
    let orderId = params.get("orderId");
    fetch("/changepayment",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            paymentType:a,
            orderId:orderId
        })
    }).then(d=>d.json()).then((d)=>{
        if(d.success){
            alert("Managed to change Payment Method");
            changePage(1);
        }else{
            alert("Failed to choose payment method, please reload the website")
        }
    })
}

function changeDropLocation(){
    let orderId = params.get("orderId");
    let a = document.getElementById("location_dropdown").value;
    fetch("/changedroplocation",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            dropLocation:a,
            orderId:orderId
        })
    }).then(d=>d.json()).then((d)=>{
        if(d.success){
            alert("Set car drop spot, please wait for your valet to arrive");
            changePage(2);
            document.getElementById("code-order").innerHTML = `Code: ${orderId}`
        }else{
            alert("Failed to choose set car drop location, please reload the website")
        }
    })
}