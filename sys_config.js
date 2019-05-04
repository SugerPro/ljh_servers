/*ip服务管理站点 配置 Ather:King.M */ 

const ljh={ 
	//========================mysql===========================>
      host     : '148.70.61.142', //主服务器
     // host     : '106.14.122.202', //主服务器
    // host     : '192.168.0.133',  //测试服务器
    port     :  3308,
    user     : 'root',
    password : 'ljh', 
    database : 'libai',
    useConnectionPooling: true, //连接池  
    //========================java============================>
	TS_ip1:'192.168.0.177', //中转服务器ip地址1号
	TS_ip1_Port:'8080',

	TS_ip2:'127.0.0.1', //中转服务器ip地址2号
	TS_ip2_Port:'8080',
	
    img_url:'http://www.libaizufang.com:7899/',//图片下载地址
	SecretKey:'ljh102030'	//对称加密密钥
	//========================================================>
    //
} 



module.exports=ljh 