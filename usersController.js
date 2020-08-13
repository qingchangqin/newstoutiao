let query = require("./model.js");
let fs = require("fs");
let userController = {};

//上传图片
userController.uploadPhoto = (req,res)=>{
    if(req.file){
       //获取文件
       let {filename,originalname,destination} = req.file;
       //获取图片的后缀
       let ext = "."+originalname.split(".")[1];
       //原来无后缀名的文件路径
       let oldPath = `${destination}${filename}`;
       //加上后缀名的文件路径
       let newPath = `${destination}${filename}${ext}`;
       console.log(newPath);
       fs.rename(oldPath,newPath,err =>{
           if(err){throw err}
           res.json({fullPath:newPath});
       })
    }
}
//新增用户
userController.addUser = async (req,res)=>{
    let {photoAss,email,nickname,password} = req.body;

    let sql = `insert into users(email,password,nickname,photo,status) 
    values('${email}','${password}','${nickname}','${photoAss}','activated')`;

    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//获取用户表总页数
userController.getUserPageCount = async (req,res) =>{
    let sql = `select count(*) as counts from users`;
    //获取查询结果
    const page = await query(sql);
    let totalPage = Math.ceil(page[0].counts / 10);//总页数
    res.json({totalPage:totalPage});
}

//获取分页数据
userController.getUserPageData = async (req,res)=>{
    let page = req.query.page;//获取当前页数
    let offset = (page - 1) * 10;//获取显示记录条数
    let sql = `select * from users limit ${offset},10`;
    //获取查询结果
    const resutl = await query(sql);
    res.json({data:resutl});
}

//删除用户
userController.delUser = async (req,res)=>{
    let id = req.query.id;
    let sql = `delete from users where user_id = ${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//修改用户信息
userController.updUser = async (req,res)=>{
    let {id,email,nickname} = req.body;

    let sql = `update users set email = '${email}',nickname = '${nickname}' where user_id = ${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//用户登录
userController.loginUser = async (req,res)=>{
    let {email,password} = req.body;
    let sql = `select * from users where email = '${email}' and password = '${password}'`;

    let result = await query(sql);
    if(result[0]){
        //保存登录用户信息
        req.session.user_id = result[0].user_id;
        req.session.email = result[0].email;
        req.session.nickname = result[0].nickname;
        req.session.photo = result[0].photo;
        req.session.intro = result[0].intro;
        res.json({code:200});
    }else{
        res.json({code:-1});
    }
}

//退出登录
userController.loginOut = async (req,res) =>{
    req.session.destroy(function(err){
        if(err){throw err}

    })

    res.redirect("/login");
}

//修改密码
userController.savePwd = async (req,res)=>{
    let {oldPwd,newPwd,confirmPwd} = req.query;
    let user_id = req.session.user_id;

    let sql = `select * from users where password = '${oldPwd}' and user_id = ${user_id}`;

    const result = await query(sql);

    if(result[0]){
        let sql1 = `update users set password = '${newPwd}' where user_id = ${user_id}`; 
        const results = await query(sql1);
        if(results.affectedRows){
            res.json({code:200});
        }else {
            res.json({code:-2});
        }
    }else{
        res.json({code:-1});
    }

}

//更新个人信息
userController.updUserInfo = async (req,res)=>{
    let {feature,nickname,intro} = req.body;
    let id = req.session.user_id;
    let sql = `update users set nickname = '${nickname}',photo = '${feature}',intro = '${intro}' where user_id = ${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        req.session.nickname = nickname;
        req.session.photo = feature;
        res.json({code:200});
    }
}



module.exports = userController;