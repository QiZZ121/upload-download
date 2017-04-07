var fs = require('fs'),
    util = require('util'),
    path = 'D:/nodejs/upload/linshi';

function explorer(path) {
    fs.readdir(path, function(err, files) {
        /*err 为错误 , files 文件名列表包含文件夹与文件*/
        if (err) {
            console.log('error:\n' + err);
            return;
        }
        var data = [];
        var re;
        files.forEach(function(file) {
            fs.stat(path + '/' + file, function(err, stat) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stat.isDirectory()) {
                    /*如果是文件夹遍历*/
                    explorer(path + '/' + file);
                } else {
                    /*读出所有的文件*/
                    var item = {
                        "value": "icon/" + file,
                        "name": file,
                        "url": "../img/icon/" + file
                    };
                    data.push(item);
                    /*console.log('文件名:' + path + '/' + file);*/
                    console.log('文件名:' + file);
                }
                re = {
                    "data": data
                };
                /*console.log(JSON.stringify(re));*/
                /*写入文件*/
                fs.writeFile('D:/nodejs/upload/linshi/log.json', JSON.stringify(re), 'utf8', function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
}
explorer(path);