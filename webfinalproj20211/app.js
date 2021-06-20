var express = require('express')
var path = require('path')
var fs = require('fs')
var bodyParser = require('body-parser')
const {PythonShell} = require('python-shell')
const fileUpload = require('express-fileupload')
var app = express();
const parse = require('parse-url')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true    
});
const PhotoPost = require('./models/PhotoPost')
let PORT = process.env.PORT || 4000;
//if(PORT==null || PORT=="")
//{
//    PORT =4000;
//}
app.locals.pretty = true
app.use(express.urlencoded({extended:false}))
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'jade')
app.use(fileUpload())
app.use(express.static(path.join(__dirname, './public')))
//const createCsvWriter = require('csv-writer').createObjectCsvWriter
//const csvWriter = createCsvWriter({
//    path: './public/csv/1.csv',
//    header:[
//        {id:'placename', title:'PLACENAME'},
//        {id:'waitpeople', title:'WAITING'},
//    ],
//})
app.get("/",function(req,res){
    res.redirect('/maincopy');
})
sendaddPhoto = []
app.get('/index', function(req,res){
    //PhotoPost.find({location:'Daegu'},function(err,results){
    PhotoPost.find({}, function(err, results){
        if(err) return console.log(err)
        else{
            //console.log(results);
            for(var i in results){
                sendaddPhoto.push(i.name);
            }
            res.render('./index__.ejs',{photopost:results, addPhoto:sendaddPhoto,ports:String(PORT)});
        }
    });
    //res.render('./index.ejs',{photopost:results});
});
var i = 0;
var list = "";
var txtfilepath = path.resolve(__dirname, 'public/img/photopost.txt');
var list_imgName = [];
app.post('/photo/store', function(req,res){
    const locationNames = {'1':'Seoul', '2':'Gwanju'}
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/img', image.name), async(error)=>{
        await PhotoPost.create({
            name: '/img/'+image.name,
            location:'Daegu',
            category:'love',
        });
        PhotoPost.find({}, function(err, results){
            if(err) return console.log(err)
            else{
                results.forEach(function(elements){
                    //console.log(elements + ", ")
                    elements = String(elements.name);
                    list += elements+"\n";
                    //fs.writeFile(path.resolve(__dirname, 'public/img/photopost.txt'), elements+"\n", function(err){
                    fs.writeFile(txtfilepath, list, function(err){
                        if(err) throw err;
                        //console.log("get image name success!");
                        var arrays = fs.readFileSync(txtfilepath).toString().split('\n');

                        var arrays_tmp;
                        for(var i in arrays){
                            arrays_tmp = arrays[i].replace(/\r/gm,"");
                            arrays[i] = arrays_tmp;
                        }
                        
                        list_imgName = []
                        for(var i=0;i<arrays.length;i+=1){
                            list_imgName.push(arrays[i]);
                        }
                        
                    })
                })
                
            }
        })
        res.render('./showResult.ejs',{list:list_imgName,ports:String(PORT)});
        //res.redirect('/index');
        //res.write(`<b>${locationNames}</b>`);
    });
});

app.post('/idx', function(req,res){
    var color_value = req.body.color_value;
    console.log(color_value);
    res.render('./idx.ejs', {skinName:color_value});
})
app.get("/basic",function(req,res){
    res.render('./basic.ejs',{ports:String(PORT)});
})
app.get('/maincopy',function(req,res){
    port = "http://localhost:"+String(PORT)+"/index";
    //port = String(port);
    console.log(PORT);
    res.render('./maincopy.ejs',{ports:String(PORT)})
});
app.get('/indexcopy',function(req,res){
    //PhotoPost.find({location:'Daegu'},function(err,results){
    PhotoPost.find({}, function(err, results){
        if(err) return console.log(err)
        else{
            //console.log(results);
            for(var i in results){
                sendaddPhoto.push(i.name);
            }
            res.render('./indexcopy.ejs',{photopost:results, addPhoto:sendaddPhoto,ports:String(PORT)});
        }
    });
    //res.render('./index.ejs',{photopost:results});
})

app.post('/coffee/post',function(req,res){
    var coffeebtnid = req.body.coffeebtnid;
    var list = [];
    coffeebtnid.split('"');
    for(var i=0;i<2;i++){
        console.log(coffeebtnid.split('"'));
        list.push(coffeebtnid.split('"')[i]);
    }
    for(var i=0;i<2;i++){
        console.log(list[i]+",");
    }
    coffeebtnid = list[0];
    /*
    fs.writeFile(path.join(__dirname, './public/txt/coffeeid/'+Number(coffeebtnid)+'.txt'),coffeebtnid, function(err){
        if(err) throw err;
        console.log(coffeebtnid);
        //console.log(typeof coffeebtnid);//string
        console.log('success');
    })
    */
    first(coffeebtnid, function(coffeebtnid){
        //var ret = saveId();
        //console.log(coffeebtnid);
        second(coffeebtnid);
    })
    second(coffeebtnid,function(coffeebtnid,value){
        third(coffeebtnid,value);
        res.render('./backtosite.ejs',{id:coffeebtnid,pid:value,ports:String(PORT)});
    });
    //coffeebtnid = String(coffeebtnid);
    //var value =0;
    //third(coffeebtnid,value,function(coffeebtnid,value){
    //    res.render('./backtosite.ejs',{id:coffeebtnid,pid:value});
    //});
    /* first(function(value){
        console.log("hellozzhign:"+value);
    }) */
    //res.render('./backtosite.ejs',{id:coffeebtnid,pid:value});
    
})
function writeId(coffeebtnid){
    fs.writeFile(path.join(__dirname, './public/txt/coffeeid/',String(coffeebtnid)+'.txt'),coffeebtnid, function(err){
        if(err) throw err;
        //console.log(coffeebtnid);
        //console.log(typeof coffeebtnid);//string
        //console.log('success');
    })
}
function saveId(){
    var file_list_suffix = []
    var path_dir = path.resolve(__dirname, './public/txt/coffeeid');
    file_list = fs.readdirSync(path_dir);
    console.log("file_list:"+file_list);
    for(var i=0;i<file_list.length;i++){
        var file = file_list[i];
        var suffix = file.substr(file.length-5,file.length);
        console.log("suffix:"+suffix);

        /* if(suffix==='.txt'){
            fs.readFile(path_dir+'/'+file,function(err,buf){
                console.log("buf.toString():"+buf.toString());
            })
        } */
        file_list_suffix.push(suffix.split('.'));
        console.log(file_list_suffix);
    }
    return file_list_suffix[file_list_suffix.length-1][0];
    //return file_list_suffix[file_list_suffix.length-1];

}
function deleteFile(value){
    var filepath = path.join(__dirname, './public/txt/coffeeid/',value+".txt");
    console.log(filepath);
    fs.access(filepath, fs.constants.F_OK, (err)=>{
        if(err) return console.log('삭제할수없는 파일입니다.');

        fs.unlink(filepath,(err)=>err?
        //console.log(err):console.log(`${filepath}를 정상적으로 삭제했습니다.`));
        console.log(err):makeFile(filepath));
    });
}
function makeFile(filepath){
    var filemake = path.join(__dirname, './public/txt/coffeeid/0.txt');
    fs.writeFile(filemake, String(0), function(err){
        if(err) throw err;
        else    console.log(`${filepath}를 정상적으로 삭제하고 파일쓰기 완료`);
    })
}
function first(coffeebtnid,callbackFunc){
    //var value = saveId();
    writeId(coffeebtnid);
    //callback(value);
    if(callbackFunc){
        callbackFunc(coffeebtnid);
    }
    //callbackFunc(coffeebtnid);
}
function second(coffeebtnid,callbackFunc){
    var value = saveId();
    if(callbackFunc){
        callbackFunc(coffeebtnid,value);
    }
    //callbackFunc(coffeebtnid,value);
}
function third(coffeebtnid,value){
    /*
    var coffeebtnid = coffeebtnid;
    var value = String(value);
    console.log("value:"+value);
    if(callbackFunc){
        callbackFunc(coffeebtnid,value);
    }
    */
    //callbackFunc(coffeebtnid,value);
    deleteFile(value);
    //makeFile();
}
/*
function deleteFile(value){
    var filepath = path.join(__dirname, './public/txt/coffeeid/',value+".txt");
    console.log(filepath);
    fs.access(filepath, fs.constants.F_OK, (err)=>{
        if(err) return console.log('삭제할수없는 파일입니다.');

        fs.unlink(filepath,(err)=>err?
        console.log(err):console.log(`${filepath}를 정상적으로 삭제했습니다.`));
    });
}
*/


app.listen(PORT, function(req,res){
    console.log(`Connected to http://localhost:${PORT}/maincopy`)
})

