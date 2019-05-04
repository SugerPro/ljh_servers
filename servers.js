var express = require('express');
var sys_path = require('path');
var app = express();
var fs = require('fs');
const http = require('http');
var querystring=require("querystring");
var config = require('./ljh_modules/sys_config')
var date = require('./ljh_modules/sys_date/date')
var ljh = require("./ljh_modules/sys_database/database");
var sql_server = require("./ljh_modules/sys_sql_server/database");log('加载sqlserver 数据库模块')
var sql = require("./ljh_modules/sys_database/sql_data");
var cry = require("./ljh_modules/sys_crypto/crypto");
var images = require("./ljh_modules/sys_images/images");
var bodyParser = require('body-parser');
var multer = require('multer');
 // 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false});
var formidable = require('./node_modules/formidable'); //图片上传专用
app.use('/src', express.static('./src')); //将文件设置成静态
app.use('/start', express.static('./html/start')); //将文件设置成静态
//设置允许跨域的域名，*代表允许任意域名跨域
app.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type");
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	if (req.method.toLowerCase() == 'options') {
		res.send(200);
	} else {
		next();
	}
})

//检查启动
app.get('/', function(r, s) {
	s.send(sql.p80())
})


app.get('/set', function (req, res) {
   res.sendFile( __dirname + "/html/" + "set.html" );
})



app.get('/sql', function(r, s) {
	 sql_server.selectAll('dbo.sys_memu', function (err, result) {//查询所有news表的数据
    	s.send(result.recordsets)
    });
})




//检查启动
app.get('/set', function(r, s) {
	s.send(sql.p80())
})

//详情
app.get('/detial', function(r, s) {
	_b(sql.detial(r.query.id.trim()), s);
})

//详情
app.get('/sys_tenants_online', function(r, s) {
	_e(sql.sys_tenants_online(r.query.id.trim()), s);
})





//sys_tenants_online  
app.post('/sys_tenants_online',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.sys_tenants_online_post(r.body), s);
})


//pay_cost_id //按照code 获取用户的账单信息
app.post('/pay_cost_id',urlencodedParser, function(r, s) {	
	 log(r.body)
	_e(sql.pay_cost_id(r.body.id), s);
})


//pay_cost_id //按照code 获取房东的详细账单信息
app.post('/cost_fd',urlencodedParser, function(r, s) {	
	 log(r.body)
	_e(sql.cost_fd(r.body.id), s);
})


 


//fd_pay_cost_list //按照  读取所有房东账务列表
app.post('/fd_pay_cost_list',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.fd_pay_cost_list(r.body.code), s);
})


//ywy_name //按照 code 进行计算
app.post('/exe_fd_cos_pay',urlencodedParser, function(r, s) {	
	log(r.body)
	_e_j(sql.exe_fd_cos_pay(r.body.code), s);
})


//ywy_name //检索业务员姓名
app.post('/ywy_name',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.ywy_name(r.body.id), s);
})


//fd_name //检索房东姓名
app.post('/fd_name',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.fd_name(r.body.id), s);
})


//fd_name //检索房东姓名
app.post('/mph_name',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.mph_name(r.body.id), s);
})



//community_id
app.post('/community_id',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.community_id(r.body.id), s);
})

//community
app.post('/community',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.community(r.body.id), s);
})


//apartment_m
app.post('/apartment_m_id',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.apartment_m_id(r.body.id), s);
})


//apartment_m
app.post('/apartment_m',urlencodedParser, function(r, s) {	
	log(r.body)
	_e(sql.apartment_m(r.body), s);
})



//用户身份获取
app.get('/info', function(r, s) {	
	let ip = r.headers['x-forwarded-for'] || r.connection.remoteAddress;
	var l='\r\n日期:【'+date.now()+'】\n:接收收到来自'+ip+' 【身份信息】获取请求~';	
	_c(sql.info(r.query.id.trim()), s,l);
})  
 
//编辑数据  
app.post('/editHouse',urlencodedParser, function(r, s) {	
	let ip = r.headers['x-forwarded-for'] || r.connection.remoteAddress;
	var l='\r\n日期:【'+date.now()+'】\n:接收收到来自'+ip+' 【读取房源】~'+r.body.id.trim();	 
	_c(sql.editHouse(r.body.id.trim()), s,l);
})


 
//用户登入后台管理  
app.post('/user_info',urlencodedParser, function(r, s) {	
	let ip = r.headers['x-forwarded-for'] || r.connection.remoteAddress;
	var l='\r\n日期:【'+date.now()+'】\n:接收收到来自'+ip+' 【登入后台】请求~';	
	_c(sql.user_info(r.body), s,l);
})



//图片接口
app.post("/rc", function(req, res) {
	var form = new formidable.IncomingForm();
	const url='http://127.0.0.1:4567/'
	form.encoding = 'utf-8';
	form.uploadDir = url + "/src/img";
	form.keepExtensions = true;
	form.maxFieldsSize = 2 * 1024 * 1024;
	form.parse(req, function(err, fields, files) {
		var path = files.file.path,
			basename = sys_path.basename(path);
		 log(JSON.stringify(images.img_r(path, basename, res)));
	})
}); 


log = function(e) {console.log(e)}
_b = function(s, res) {(async () => {res.send(await ljh.ROW(s, ''));})()}// log(s)//不记录日志
_c = function(s, res,l) {
	(async () => {
		// log(s)//记录日志
		res.send(cry.do_encryption(await ljh.ROW(s, '')));			
		fs.appendFile('./ljh_log/'+date.today()+'.txt',l+s,'utf-8',function(err){});
	})()
}  
_e= function(s, res,l) {
	(async () => {
		var send_data={
			code:0,
			msg:'success',
			count:'77',
			data:await ljh.ROW(s, '')
		}
		res.send(send_data);			
		fs.appendFile('./ljh_log/'+date.today()+'.txt',l+s,'utf-8',function(err){});
	})()
} 
_e_j= function(s, res,l) {
	(async () => {
		var send_data={ 
			msg:'success',
			data:await ljh.ROW(s, '') 
		}
		res.send(send_data);			
		fs.appendFile('./ljh_log/'+date.today()+'.txt',l+s,'utf-8',function(err){});
	})()
} 
_post = function(r,l,s, data, path) {
	
	let ip = r.headers['x-forwarded-for'] || r.connection.remoteAddress; 
	const t='\r\n日期:【'+date.now()+'】\n:接收收到来自'+ip+l;
	fs.appendFile('./ljh_log/'+date.today()+'.txt',t+'\r\n'+data,'utf-8',function(err){});
 
	// console.log(data)
	const options = {
		hostname: config.TS_ip1,
		port: config.TS_ip1_Port,
		path: path, 
		method: 'POST',
		headers: {
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8', 
		}, 
	};
	var req = http.request(options, (res) => {  
		res.setEncoding('utf8');
		let str = ''; //用变量存储;
		res.on('data', chunk => {
		  str += chunk;
		}); 
	    res.on('end', ()=> {
		  s.send(cry.do_encryption(str)); 
		  // log(str)
	    }); 
	});
	req.write(data);	
	req.end();
}

_get = function(r,l,s, data, path) {

	let ip = r.headers['x-forwarded-for'] || r.connection.remoteAddress; 
	const t='\r\n日期:【'+date.now()+'】\n:接收收到来自'+ip+l;
	fs.appendFile('./ljh_log/'+date.today()+'.txt',t+'\r\n'+data,'utf-8',function(err){});

	var content = JSON.stringify(data);
	const options = {
		hostname: config.TS_ip1,
		port: config.TS_ip1_Port,
		path: path,
		method: 'GET',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		}
	};
	var req = http.request(options, (res) => {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			s.send(cry.do_encryption(chunk));
		});
	});
	req.write(content);
	req.end();
} 

var server = app.listen(4567, function() {
	log("==============================>>>>>>>服务启动完成 访问端口:" + server.address().port)
});

process.on('uncaughtException', function(err) {
	log('出现不可预知的错误：'+date.today()+":检测到错误 已经记录日志~"); 
	const t = '检测到错误'+err
	fs.appendFile('./ljh_log/'+date.today()+'.txt',t,'utf-8',function(err){});
});
