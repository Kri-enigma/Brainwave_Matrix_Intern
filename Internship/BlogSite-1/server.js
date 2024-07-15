const express = require('express');
const fs = require('fs');
const session = require('express-session');
const cookie=require("cookie-parser");
const multer = require('multer');
const { __express } = require('ejs');
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
// let oneDay = 10 * 1000;
app.use(express.static(__dirname+'/public/post'));
app.use(express.urlencoded({extended:false}));
app.use(cookie());
app.use(session({
    saveUninitialized : false,
    resave:false,
    secret:"abc",
}));
const storage = multer.diskStorage({
    destination: function(req , res , cb){
        return cb(null , __dirname + "/public/post");
    },
    filename:function(req, file , cb){
        var name=Date.now();
        return cb(null , name.toString());
    }
})


function auth(req,res,next){
    if(req.session.email){
        if(req.session.email){

            console.log(req.session.email);
      }
        next();
    }
    else{
        res.redirect("/login");
    }
}


const uploads = multer({storage : storage});



app.get('/login'  ,(req, res)=>{
    res.render("login" ,{mass : ""})
})

app.post("/login" ,(req ,res)=>{
    const {email , pass} = req.body;
    // console.log(email,pass);
    fs.readFile(__dirname+"/user.json" , "utf-8" , (err , data)=>{
        if(err){
            console.log();
        }
        else{
            data = JSON.parse(data);
           // console.log(data);
           let flag = false;
            let result = data.filter(ele=>{
                if(ele.email == email && ele.pass == pass){
                    return ele;
                }
            })

            if(result.length != 0){
                req.session.email = result[0].email;
                req.session.role = result[0].role;
                // console.log(req.session);
                res.redirect('/');
            }
            else{
                res.render("login" ,{mass : "invalid user"})
            }
        }
    } )
})


app.get('/addpost' , auth,(req,res)=>{
    res.render("addpost");
})
app.post('/upload' , uploads.single('image') , (req , res)=>{
    const userpost = req.body;
    userpost.image = req.file.filename;
    userpost.id = Date.now();
    fs.readFile(__dirname+'/blog.json' , "utf-8" , (err , data)=>{
        data = JSON.parse(data);
        data.forEach(user=>{
            if(user.email == req.session.email){
                console.log(user.post);
                user.post.push(userpost); 
            }
        })
        fs.writeFile(__dirname+'/blog.json' , JSON.stringify(data) , (err)=>{
            if(err)
            console.log(err);
        })
        res.redirect('/addpost');
    })
})



app.get("/",(req , res)=>{
    fs.readFile(__dirname+'/blog.json' , "utf-8" , (err , data)=>{
        if(err){
            res.status(500).send('Error reading file: ' + err.message);
        }
        else{
        //    console.log(req.session);
            data = JSON.parse(data);
            // console.log(data);
            let user = {};
            // fs.readFile(__dirname+"/user.json" , "utf-8" , (err , data)=>{
            //     data = JSON.parse(data);
            //     data.forEach(ele=>{
            //         // console.log(req.session.role);
            //         if(ele.email == req.session.email){
            //             user = ele;
            //         }
            //     })
            // })
            // console.log(req.session.role);
            if(req.session.email){
                user.email = req.session.email;
                user.role = req.session.role;
            }
            // console.log(user.role);
            res.render("blog" , {blog : data , users  :user});
        }
    })
})

app.get('/delete/post/:id',auth ,(req , res )=>{
    let {id} = req.params;
    // id = parseInt(id);
    console.log(id);
    fs.readFile(__dirname+"/blog.json" , "utf-8" , (err , data)=>{
        data = JSON.parse(data);
        data.forEach(user => {
            user.post = user.post.filter(post => post.id != id);
        });
        fs.writeFile(__dirname+"/blog.json" , JSON.stringify(data) , (err)=>{
            if(err)
            console.log(err);
            else{
                console.log("delete successful!");
            }
        });
    })
})


app.get('/mypost' , auth,(req,res)=>{
    fs.readFile(__dirname+'/blog.json', "utf-8" , (err , data)=>{
        if(err){
            console.log(err);
        }
        else{
            data = JSON.parse(data);
            // console.log(data);
            data.forEach(user=>{
                if(user.email == req.session.email){
                    console.log(user.post);
                    res.render('mypost' , {userpost : user.post})  
                }
            })
        }
    })
    // res.render("mypost")
})



app.get('/logout' ,(req , res)=>{
    req.session.destroy();
    res.redirect('/');
}) 

app.get('/signup' , (req , res)=>{
    res.render("signup" , {mass : ""});
})

app.post("/signup" , (req , res)=>{
    const {email , pass } = req.body;
    fs.readFile(__dirname + "/user.json" , "utf-8" , (err, data)=>{
        data = JSON.parse(data);
        let flag = false;
        data.forEach(ele=>{
            if(ele.email == email && ele.pass == pass){
                flag = true;
            }
        })
        if(flag){
            res.render("signup" , {mass : "user allready exist"});
        }
        else{
            req.body.role = "user";
            data.push(req.body);

            fs.writeFile(__dirname + "/user.json" , JSON.stringify(data) , (err)=>{
                if(err)
                console.log(err);
                else{
                    res.render("signup" , {mass : "signup successfully"});
                }
            })
            fs.readFile(__dirname+"/blog.json" , "utf-8" , (err , data)=>{
                if(err){
                    console.log(err);
                }
                else{
                    const {email} = req.body;
                    let user = {};
                    user.email = email;
                    user.post = [];
                    user.id = Date.now();
                    // console.log(user);
                    data = JSON.parse(data);
                    data.push(user);
                    fs.writeFile(__dirname+"/blog.json" ,JSON.stringify(data),(err)=>{
                        if(err)
                        console.log(err);
                    })
                }

            })
        }

    })
})

app.listen(3000 , (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("server is running at port 3000");
    }
})
