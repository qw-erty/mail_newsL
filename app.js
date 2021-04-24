// mailchimp APIkey = 16e01e118b63b5f3c9f3c7f6e7afc1de-us1
//mailchimp unique id = 43e60708b8

const exp = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { url } = require("inspector");
const app = exp();

app.use(bodyParser.urlencoded({extended:true}));
app.use(exp.static("public"));

app.get("/",function(request,response){
   
    response.sendFile(__dirname + "/signup.html");

});

app.post("/",function(request,res){

    console.log("post request recived");

    const fname = request.body.fname;
    const lname = request.body.lname;
    const email = request.body.email;

    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };

    const jsondata = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/43e60708b8"

    const options = {
        method:"POST",
        auth:"ab1:16e01e118b63b5f3c9f3c7f6e7afc1de-us1"
    }
    const r = https.request(url, options, function(response){

       /* if(response.statusCode == 200)
        {
            res.sendFile(__dirname + "/sucess.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }*/

        if((data.error_count) !=0)
        {
            res.sendFile(__dirname+"/failure.html");
        }
        else{
            res.sendFile(__dirname + "/sucess.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })


    r.write(jsondata);
    r.end();
    //console.log(fname , lname , email);

});

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("port started");
});