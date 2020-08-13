let query = require("./model.js")
let commentsController = {};


//获取总记录
commentsController.getPageCount = async (req,res) =>{
    let sql = `select count(*) as counts from comments`;
    //获取查询结果
    const page = await query(sql);
    let totalPage = Math.ceil(page[0].counts / 10);//总页数
    res.json({totalPage:totalPage});
}

//获取分页数据
commentsController.getPageData = async (req,res) =>{
    let page = req.query.page;//获取当前页数
    let offset = (page - 1) * 10;//获取显示记录条数
    
    let sql = `select c.comment_id,c.author,c.content,p.title,c.created,c.status from comments c,posts p where c.post_id = p.post_id limit ${offset},10`;
    //获取查询结果
    const resutl = await query(sql);
    res.json({data:resutl});
}

commentsController.delComment = async (req,res)=>{
    let id = req.body.id;
    let sql = `delete from comments where comment_id = ${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}


module.exports = commentsController;