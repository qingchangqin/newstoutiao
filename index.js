//引入模块
let express = require("express");
let mysql = require("mysql");
let database = require("./config/database.js");
let artTemplate = require("art-template");
let expressArtTemplate = require("express-art-template");
let session = require("express-session");
let router = require("./router.js");
let apiRouter = require("./apiRouter.js");
let app = express();

//托管静态资源
app.use("/public",express.static(__dirname + "/public/"));

let connection = mysql.createConnection(database);

//连接数据库
connection.connect((err) =>{
    if(err){throw err}
});

//设置跨域
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

//接收post数据
app.use(express.json());
app.use(express.urlencoded({extended:true}))
//初始化session
//使用session中间件
//通过app.use中间件设置session的参数
app.use(session({
    name:'SESSIONID',  // session会话名称在cookie中的值
    secret:'%#%￥#……%￥', // 必填项，用户session会话加密（防止用户篡改cookie）
    cookie:{  //设置session在cookie中的其他选项配置
      path:'/',
      secure:false,  //默认为false, true 只针对于域名https协议
      maxAge:60000*24,  //设置有效期为24分钟，说明：24分钟内，不访问就会过期，如果24分钟内访问了。则有效期重新初始化为24分钟。
    }
}));
//前台路由
app.use(apiRouter);
//设置中间件，判断用户是否有session信息
app.use(function(req,res,next){
    // 不需要做session验证的路由
    var noCheckSession =  ['/login','/loginOut'];
    var path = req.path.toLowerCase();
    //是否在数组中存在
    if(noCheckSession.includes(path)){
        //放行
        next();
    }else {
        // session检测
        if(req.session.user_id){
            next();
        }else{
            res.redirect('/login')
        }
    }
})

//设置模板
app.set("views",__dirname+"/views/");
app.engine("html",expressArtTemplate);
app.set("view engine","html");

//渲染主页
app.use(router);


app.listen(2333,()=>{
    console.log("服务器连接成功");
});