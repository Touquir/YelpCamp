require("dotenv").config();
var express=require("express"),
	app=express(),
 	bodyParser= require("body-parser"),
    mongoose=require("mongoose"),
    Campground=require("./models/campground"),
    seedDB=require("./seeds"),
    flash=require("connect-flash"),
    Comment=require("./models/comment"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    User=require("./models/user")
    methodOverride=require("method-override");

var commentRoutes=require("./routes/comments"),
	campgroundRoutes=require("./routes/campgrounds"),
	indexRoutes=require("./routes/index");

const pass=process.env.PASSWORD;

mongoose.connect(`mongodb+srv://touquir:${pass}@cluster0.0yhpg.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
}).then(()=>{
  console.log("DB started");
}).catch(err=>{
  console.log(err.message);
});


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATIONS

app.use(require("express-session")({
	secret:"this is the secret",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});