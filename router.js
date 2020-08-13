let express = require("express");
let router = express.Router();
let query = require("./model.js");
//文章模块
let postsController = require("./postsController.js");
//评论模块
let commentsController = require("./commentsController.js");
//轮播模块
let slidesController = require("./SlidesController.js");
//分类模块
let categoriesController = require("./categoriesController.js");

let multer = require("multer");
const userController = require("./usersController.js");
const { route } = require("./apiRouter.js");

let upload = multer({
    dest:"./public/uploads/"
})

router.get("/",async (req,res)=>{
    
    //查询文章总数
    let sql = "select count(*) as postsCount from posts";
    //查询草稿总数
    let sql2 = "select count(*) as draftedCount from posts where status = 'drafted'";
    //查询分类总数
    let sql3 = "select count(*) as cateCount from category";
    //查询评论总数
    let sql4 = "select count(*) as commentCount from comments";
    //查询待审核数量
    let sql5 = "select count(*) as heldCount from comments where status = 'held'";
    
        let result = {};


        // //文章总数
        // const postsCount = await query(sql);
        // //草稿总数
        // const draftedCount = await query(sql2);
        // //分类总数
        // const cateCount = await query(sql3);
        // //评论总数
        // const commentCount = await query(sql4);
        // //待审核数量
        // const heldCount = await query(sql5);
        //最终结果
        // const promiseArr = await Promise.all([postsCount,draftedCount,cateCount,commentCount,heldCount]);
        const promiseArr = await Promise.all([query(sql),query(sql2),query(sql3),query(sql4),query(sql5)]);
        promiseArr.map(v =>{
            Object.assign(result,v[0]);
        });
        result.nickname = req.session.nickname;
        result.photo = req.session.photo;
        res.render("index.html",result);
})

//获取总页数
router.get("/getPageCount",postsController.getPageCount);

//获取当前页数的数据
router.get("/getPageData",postsController.getPageData);

//渲染添加文章页面
router.get("/post-add",postsController.addPost);

//上传文章图片
router.post("/uploadFeature",upload.single("feature"),postsController.uploadFeature);

//添加文章
router.post("/savePost",postsController.savePost);

//删除文章
router.get("/delPost",postsController.delPosts);

//获取单偏文章信息
router.get("/getPost",postsController.getPost);

//批量删除文章
router.get("/batchDel",postsController.batchDel);

router.get('/posts',async (req,res) =>{
    let status = [
        {"key":"published","text":"发布"},
        {"key":"drafted","text":"草稿"},
        {"key":"trashed","text":"废弃"}
    ]
    let sql = "select * from category";
    let catData = await query(sql);
        
    res.render("posts.html",{
        status:status,
        catData:catData,
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})

//修改文章数据
router.post("/updPosts",postsController.updPosts);


//渲染评论页面
router.get('/comments',(req,res) =>{
    res.render("comments.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})
//获取评论总记录
router.get("/getCommentsPage",commentsController.getPageCount);
//获取分页数据
router.get("/getCommentsPageData",commentsController.getPageData);
//删除评论
router.post("/delComment",commentsController.delComment);


//渲染登录页面
router.get('/login',(req,res) =>{
    res.render("login.html");
})

//退出登录
router.get("/loginOut",userController.loginOut);


//用户表
router.get("/users",(req,res)=>{
    res.render("users.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})

//上传用户头像
router.post("/uploadPhoto",upload.single("photo"),userController.uploadPhoto);
//新增用户
router.post("/addUser",userController.addUser);
//用户表总页数
router.get("/getUserPageCount",userController.getUserPageCount);
//获取用户表分页数据
router.get("/getUserPageData",userController.getUserPageData);
//删除用户
router.get("/delUser",userController.delUser);
//修改用户信息
router.post("/updUser",userController.updUser);
//用户登录
router.post("/login",userController.loginUser);
//更新个人信息
router.post("/updUserInfo",userController.updUserInfo);

//分类表
router.get("/categories",(req,res)=>{
    res.render("categories.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})

//获取分类表分页总数
router.get("/getCatPageCount",categoriesController.getCatPageCount);
//获取分类表数据
router.get("/getCatPageData",categoriesController.getCatPageData);
//删除分类表数据
router.get("/delCat",categoriesController.delCat);
//修改分类表数据
router.post("/updCat",categoriesController.updCat);
//新增分类表数据
router.post("/addCat",categoriesController.addCat);

//登录
router.get("/login",(req,res)=>{
    res.render("login.html");
})

//个人中心
router.get("/profile",(req,res)=>{
    res.render("profile.html",{
        intro:req.session.intro,
        email:req.session.email,    
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})

//修改密码
router.get("/updPassword",(req,res)=>{
    res.render("password-reset.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
});

router.get("/savePwd",userController.savePwd);

//导航菜单
router.get("/nav-menus",(req,res)=>{
    res.render("nav-menus.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
})

//图片轮播
router.get("/slides",(req,res)=>{
    res.render("slides.html",{
        nickname:req.session.nickname,
        photo:req.session.photo
    });
});


//添加轮播表数据
router.post("/saveSlides",slidesController.saveSlides);
//获取分页总数
router.get("/getSlidesPageCount",slidesController.getSlidesPageCount);
//获取分页数据
router.get("/getSlidesPageData",slidesController.getSlidesPageData);

module.exports = router;