let query = require("./model.js");

let postsController = {};
let fs = require("fs");

//获取总页数
postsController.getPageCount = async (req,res)=>{
    

    // let sql = "select count(*) as counts from posts";
    var {cat_id,status} = req.query;

    // where 1=1 代表查询条件为真，主要为了防止后面没有查询条件而出现报错。
    var where = `1=1`; 
    
    if(cat_id){
        where += ` and cat_id=${cat_id}`
    }
    if(status){
        where += ` and status='${status}'`
    }
    var sql = `
        select count(*) as counts from posts 
            where ${where}
    `;
    const page = await query(sql);
    let totalPage = Math.ceil(page[0].counts / 10);//总页数
    res.json({totalPage:totalPage});
}

postsController.getPageData = async (req,res)=>{

    var {cat_id,status} = req.query;
    // where 1=1 代表查询条件为真，主要为了防止后面没有查询条件而出现报错。
    var where = `and 1=1`; 
    if(cat_id){
        where += ` and p.cat_id=${cat_id}`
    }
    if(status){
        where += ` and  p.status='${status}'`
    }

    let page = req.query.page; //获取当前页数
    let offset = (page - 1)*10; //获取显示的记录条数
    let sql = `select p.post_id,p.title,u.nickname,c.cat_name,p.created,p.status from posts as p,users as u,category as c where p.user_id = u.user_id and p.cat_id = c.cat_id ${where} limit ${offset},10;`
    const result = await query(sql);
    //数据转换
    res.json({data:result});
}

//修改文章数据
postsController.updPosts = async (req,res) =>{
    //获取参数
    let {editId,editPhoto,editTitle,editCat_id,editStatus,editContent} = req.body;
    
    let sql = `update posts set title = '${editTitle}', content = '${editContent}'
    ,feature = '${editPhoto}',cat_id = '${editCat_id}',status = '${editStatus}' where post_id = ${editId}`;
    const result = await query(sql);
    if(result.affectedRows > 0){
        res.json({code:200});
    }
}

//删除文章
postsController.delPosts = async(req,res) =>{
    let id = req.query.id;
    let sql = `delete from posts where post_id = ${id}`;
    const result = await query(sql);

    res.json({code:200});
}

//上传文章图片
postsController.uploadFeature = (req,res) =>{
    if(req.file){
        //获取文件
        let {filename,originalname,destination} = req.file;
        //获取图片的后缀
        let ext = "."+originalname.split(".")[1];
        //原来无后缀名的文件路径
        let oldPath = `${destination}${filename}`;
        //加上后缀名的文件路径
        let newPath = `${destination}${filename}${ext}`;
        
        fs.rename(oldPath,newPath,err =>{
            if(err){throw err}
            res.json({fullPath:newPath});
        })
    }
}

//保存文章
postsController.savePost = async (req,res) =>{
    let {title,content,category,created,status,feature} = req.body;
    let sql = `insert into posts(title,content,cat_id,created,status,feature,user_id) 
    values('${title}','${content}',${category},'${created}','${status}','${feature}',1)`;
    let result = await query(sql);
    res.json({code:200});
}

postsController.addPost = async (req,res)=>{
    let status = [
        {"key":"published","text":"发布"},
        {"key":"drafted","text":"草稿"},
        {"key":"trashed","text":"废弃"}
    ]
    let sql = "select * from category";
    let catData = await query(sql);
    let nickname = req.session.nickname;
    let photo = req.session.photo;
    res.render("post-add.html",{
        status:status,
        catData:catData,
        nickname:nickname,
        photo:photo
    });
}

postsController.getPost = async (req,res)=>{
    let id = req.query.id;

    let sql = `select * from posts where post_id = ${id}`;

    const result = await query(sql);

    res.json(result[0]);
}

postsController.batchDel = async (req,res)=>{
    let str = req.query.str;


    let sql = `delete from posts where post_id in (${str})`;

    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

module.exports = postsController;