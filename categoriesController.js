let query = require("./model.js")
let categoriesController = {};


//获取总记录
categoriesController.getCatPageCount = async (req,res) =>{
    let sql = `select count(*) as counts from category`;
    //获取查询结果
    const page = await query(sql);
    let totalPage = Math.ceil(page[0].counts / 10);//总页数
    res.json({totalPage:totalPage});
}

//获取分页数据
categoriesController.getCatPageData = async (req,res) =>{
    let page = req.query.page;//获取当前页数
    let offset = (page - 1) * 10;//获取显示记录条数
    let sql = `select * from category limit ${offset},10`;
    //获取查询结果
    const resutl = await query(sql);
    res.json({data:resutl});
}

//删除分类表数据
categoriesController.delCat = async (req,res) =>{
    let id = req.query.id;

    let sql = `delete from category where cat_id =${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//修改分类表数据
categoriesController.updCat = async (req,res)=>{
    let {id,name,className} = req.body;
    let sql = `update category set cat_name = '${name}', classname = '${className}' where cat_id = ${id}`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//新增分类表数据
categoriesController.addCat = async (req,res)=>{
    let {name,className} = req.body;
    let sql = `insert into category(cat_name,className) values('${name}','${className}')`;
    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

module.exports = categoriesController;