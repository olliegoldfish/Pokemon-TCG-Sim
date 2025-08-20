//get references for text input and button fields
var username = document.getElementById("username")
var password = document.getElementById("password")
var jsonBtn = document.getElementById("submit")


//add click event listener, to get data when data is entered
jsonBtn.addEventListener("click", function(){
    //store data in JavaScript object
    var data = {
        "username":username.value,
        "password":password.value
    }
    console.log("Data to be sent:", data);

    fetch("http://localhost:8888/post/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            localStorage.setItem("username", username.value);
            window.location.href = "/open-pack/open-pack.html";

        } else {
            throw new Error("Network response was not ok");
        }
    })
})

