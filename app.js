/**
 * Created by Administrator on 2017/3/24.
 */
//导入express库
var express = require('express');
var app = express();
//导入文件系统库
var fs = require('fs'),
    util = require('util');
//之前用的是connect-multiparty,但是文件重命名有问题所以改用这个库
var multiparty=require("multiparty");




//获取内网ip
var os = require('os');

function getLocalIP() {
    var map = [];
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        if (dev.indexOf('本地连接') != -1) {
            return ifaces[dev][1].address;
        }
    }
    return map;
}
console.log(getLocalIP());
//获取内网ip结束


// app.use(multipart({uploadDir:'/Program Files (x86)/Apache Software Foundation/Apache2.2/htdocs/test'}));//設置上传文件存放的地址


//设置http服务监听的端口号。
app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'),getLocalIP(),function (){
    console.log('server running at http://'+getLocalIP()+':3000');
});
//端口设置完成

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// ,multipartMiddeware
//这是接受form表单请求的接口路径，请求方式为post。上传
app.post('/upload',function (req,res) {
    //这里打印可以看到接收到文件的信息。

    /*//do something
     * 成功接受到浏览器传来的文件，我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。
     *
     *
     * */

    var multiparty = require('multiparty');
    var form = new multiparty.Form();
    //设置字符格式
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.keepExtensions = true;
    form.uploadDir = "/Program Files (x86)/Apache Software Foundation/Apache2.2/htdocs/test/";
    //设置单文件大小限制
    form.maxFieldsSize = 2*1024*1024;
    form.maxFilesSize = 20 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和
    form.parse(req, function(err, fields, files) {
        if(err){
            console.log(err);
            var u={"error" :1,"message":'文件大小超出限制'};
            res.end(JSON.stringify(u));
            return false;
        }

        console.log(files);//文件信息
        var originalFilename =files.logo[0]['originalFilename'];
        var path = files.logo[0]['path'];

        console.log(originalFilename);
        console.log(path);
        //同步重命名文件名
        fs.rename(path, form.uploadDir+originalFilename,function(err){
            if(err){
                throw err;
            };
        });

        res.writeHead(200, {'content-type': 'text/plain'});
        res.end();
    });


});
//上传结束
//下载部分开始


app.get('/download', function(req, res){
        fs.readdir('/Program Files (x86)/Apache Software Foundation/Apache2.2/htdocs/test', function (err, files) {//读取文件夹下文件
           debugger;
            var count = files.length,
                results =new Array() ;
            //遍历文件夹下的文件
            files.forEach(function (filename) {
                fs.readFile(filename, function () {
                    var tmpResult={};
                    tmpResult["name"]=filename;
                    tmpResult["fileUrl"] = 'http://'+getLocalIP()+':8080/test/'+filename;
                    results[count-1]=tmpResult ;//倒序
                    count--;
                    if (count <= 0) {
                        console.log(results);
                        res.send(results);
                        res.end();//向客户端传送服务器文件信息（json数据格式）
                    }
                });
            });
        });
    });
//下载部分结束
