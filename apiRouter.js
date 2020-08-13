let express = require("express");
let router = express.Router();
let query = require("./model.js");
let moment = require("moment");

//获取分类表数据
router.get("/api/getCategory",async (req,res)=>{
    let sql = `select * from category`;
    const result = await query(sql);
    res.json(result);
});

//获取最新发布的文章数据
router.get("/api/getArticles",async (req,res)=>{
    let sql = `select p.*,c.cat_name from posts p,category c where p.cat_id = c.cat_id order by post_id desc limit 0,5`;
    const result = await query(sql);
    result.map(v =>{
        if(v.feature){
            v.feature = "http://127.0.0.1:2333"+v.feature.replace("./","/");
        }
    })
    res.json(result);
});

//获取文章数据
router.get("/api/getCatArticle",async (req,res)=>{
    let {cat_id,page} = req.query;
    let sql = `select p.*,u.nickname from posts p,users u where p.user_id = u.user_id 
    and cat_id = ${cat_id}  limit 0,${page}`;

    let result = await query(sql);
    let sql2 = `select cat_name from category where cat_id = ${cat_id}`;

    let cat_name = await query(sql2);

    result.map(v =>{
        if(v.feature && v.feature.indexOf("http://")){
            v.feature = "http://127.0.0.1:2333"+v.feature.replace("./","/");
            v.created = moment(v.created).format("YYYY-MM-DD HH:mm:ss");
        }
    })

    res.json({
        data:result,
        cat_name:cat_name[0].cat_name
    });

})

//文章详情
router.get("/api/getArticle/:post_id",async (req,res)=>{
    let {post_id} = req.params;
    let sql = `select t1.*,t2.cat_name,t3.nickname from posts 
            t1 left join category  t2 on t1.cat_id = t2.cat_id
            left join users t3 on t1.user_id = t3.user_id
            where t1.post_id = ${post_id}`;
    let sql2 = `select count(*) as commentCount from comments where post_id = ${post_id}`;

    let result = await Promise.all([query(sql),query(sql2)]);
    obj = result[0][0];
    obj.commentCount = result[1][0].commentCount;

    res.json(obj);
});

//随机文章
router.get("/api/getPostData",async (req,res)=>{
    let sql = `select post_id from posts`;

    let result = await query(sql);
    let post_id = [];

    result.map(v=>{
        post_id.push(v.post_id);
    })
    let queryId = [];
    //获取随机出来的id
    for(let i = 0;i<5;i++){
        let id = Math.ceil(Math.random()*post_id.length);
        queryId.push(id);
    }
    //转成字符串形式
    let str = queryId.join();
    let sql2 = `select * from posts where post_id in (${str})`;
    let results = await query(sql2);

    res.json(results);

});
module.exports = router;