let query = require("./model.js");

let SlidesController = {};

//保存轮播数据
SlidesController.saveSlides = async (req,res)=>{
    let {img,text,link} = req.body;

    let sql = `insert into swipe(img,text,link) values('${img}','${text}','${link}')`;

    const result = await query(sql);
    if(result.affectedRows){
        res.json({code:200});
    }
}

//获取轮播表总页数
SlidesController.getSlidesPageCount = async (req,res) =>{
    let sql = `select count(*) as counts from swipe`;
    //获取查询结果
    const page = await query(sql);
    let totalPage = Math.ceil(page[0].counts / 10);//总页数
    res.json({totalPage:totalPage});
}

//获取分页数据
SlidesController.getSlidesPageData = async (req,res)=>{
    let page = req.query.page;//获取当前页数
    let offset = (page - 1) * 10;//获取显示记录条数
    let sql = `select * from swipe limit ${offset},10`;
    //获取查询结果
    const resutl = await query(sql);
    res.json({data:resutl});
}


module.exports = SlidesController;