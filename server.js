const express = require('express');
const fs = require('fs')
const app = express();
const port = 3000;
const YAML = require('js-yaml')

app.all("*",function(req,res,next){
  var orginList=[
      "http://localhost:5173",
  ]
  // if(orginList.includes(req.headers.origin.toLowerCase())){
      //设置允许跨域的域名，*代表允许任意域名跨域
      res.header("Access-Control-Allow-Origin",req.headers.origin);
  // }
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options')
      res.send(200);  //让options尝试请求快速结束
  else
      next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/data/:id', (req, res) => {

  const id = req.params.id;

  fs.readFile(`./storage/information/${id}.txt`, 'utf8', function(err, data){
    if(err){
        return console.log('读取失败',err)
    }
    //转换成数组
    const dataArray = data.split(/[(\r\n)\r\n]+/);
    //删除空项
    dataArray.forEach((item,index)=>{
      if(!item){
        dataArray.splice(index,1);
      }
    });
    const response = {
      testTime: '2023',
      isTargeted: dataArray[2].toLowerCase() === 'true',
      angle1: dataArray[3],
      angle2: dataArray[4],
      angle3: dataArray[5],
      angle4: dataArray[6],
      distance: dataArray[0]
    };
    res.send(response);
  });
});

app.get('/athletes', (req, res) => {
  let fileContents = fs.readFileSync('./storage/data/athletes.yaml', 'utf8');
  let data = YAML.load(fileContents);  
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

