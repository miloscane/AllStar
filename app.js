//Server
var server				=	require('express')();
var http					=	require('http').Server(server);
var httpl 				=	require('http');
var https 				= require('https');
var net						=	require('net');
var express				=	require('express');
const bodyParser				=	require('body-parser'); 
var fs						=	require('fs');   
const dotenv 			=	require('dotenv');
var io						=	require('socket.io')(http);
var axios						=	require('axios');

var baseUrl = "https://sandbox.octopos.rs/api/";
var token = "XMSaQ0GSftO+Oe5nMXZPcIWfEDejrdo/LY3DJSJJEXbGnQNAk2o1htmAbooxhiOp+vCFFmkghX6Pj0pDqYXhlTagbfhb/Y9Oy/PEwSo8Ushk/e016mfo11hNCvlH1+4vqs6inVsNwEQfaNn3aJMOedJpaeqS4N7E4q56GjLSYnY=";
var tables = "Table/Search?pageNumber=1&pageSize=30";
var tableId = "BillCumulative/OpenBills?tableId=10&tableName=10"

axios.get(baseUrl+tables, {
    headers: {
        'Accept': 'application/json',
        'Autorization':token
    }
})
.then(response => {
    for(var i=0;i<response.data.Data.Items.length;i++){
			console.log(response.data.Data.Items[i])    	
    }
    axios.get(baseUrl+tableId, {
		    headers: {
		        'Accept': 'application/json',
		        'Autorization':token
		    }
		})
		.then(response => {
			console.log(response.data)
		})
})
.catch(error => {
    console.error('Error:', error);
});


dotenv.config();
server.set('view engine','ejs');
var viewArray	=	[__dirname+'/views'];
var viewFolder	=	fs.readdirSync('views');
for(var i=0;i<viewFolder.length;i++){
	if(viewFolder[i].split(".").length==1){
		viewArray.push(__dirname+'/'+viewFolder[i])
	}
}
server.set('views', viewArray);
server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json({limit:'50mb'}));  
server.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));

http.listen(process.env.PORT, function(){
	console.log("Server Started");
});

var bucket = process.env.bucket ? process.env.bucket : "";

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
/*var tournamentJson	=	{
	round32:	["1.","2.","3.","4.","5.","6.","7.","8.","9.","10.","11.","12.","13.","14.","15.","16.","17.","18.","19.","20.","21.","22.","23.","24.","25.","26.","27.","28.","29.","30.","31.","32."],
	round16:	["2.","4.","6.","8.","10.","12.","14.","16.","18.","20.","22.","24.","26","28.","30.","32"],
	round8:		["4.","8.","12.","16.","20.","24.","28.","32."],
	round4:		["8.","16.","24.","32."],
	round2:		["16.","32."]
}*/

/*var tournamentJson	=	{
	round32:	[],
	round16:	[],
	round8:		[],
	round4:		[]
}

fs.writeFileSync("tournament.json",JSON.stringify(tournamentJson));*/



var tournamentJson = {
	round32:[[
			{
				name: "",
				score: 0,
				index: 0
			},
			{
				name: "",
				score: 0,
				index: 0
			},
			{
				name: "",
				score: 0,
				index: 0
			},
			{
				name: "",
				score: 0,
				index: 0
			},
		],[],[],[],[],[],[],[]
	],
	round16:[[],[],[],[]],
	round8:[[],[]],
	round4:[]
};

var tournamentJson = JSON.parse(fs.readFileSync("tournament.json"));


io.on('connection', function(socket){
	socket.on('tournamentCreate', function(tournamentArray,shouldShuffle){
		tournamentJson	=	{};
		tournamentJson.round32	=	[];
		tournamentJson.round16	=	[];
		tournamentJson.round8		=	[];
		tournamentJson.round4		=	[];
		if(tournamentArray[16]!=""){
			//Round 32
			if(shouldShuffle){
				tournamentArray	=	shuffle(tournamentArray);
			}
			for(var i=0;i<tournamentArray.length;i++){
				var json = {};
				json.name = tournamentArray[i];
				json.score = 0;
				json.id = i;
				json.index = 0;
				tournamentJson.round32.push(json);
			}

			for(var i=0;i<16;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round16.push(json);
			}

			for(var i=0;i<8;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round8.push(json);
			}

			for(var i=0;i<4;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round4.push(json);
			}

		}else{
			//Round 16
			tournamentArray.splice(16,17);
			if(shouldShuffle){
				tournamentArray	=	shuffle(tournamentArray);
			}
			for(var i=0;i<32;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round32.push(json);
			}

			for(var i=0;i<tournamentArray.length;i++){
				var json = {};
				json.name = tournamentArray[i];
				json.score = 0;
				json.id = i;
				json.index = 0;
				tournamentJson.round16.push(json);
			}

			for(var i=0;i<8;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round8.push(json);
			}

			for(var i=0;i<4;i++){
				var json = {};
				json.name = "";
				json.score = 0;
				json.index = 0;
				tournamentJson.round4.push(json);
			}
		} 
		fs.writeFileSync("tournament.json",JSON.stringify(tournamentJson));
		io.emit('tournamentCreated',tournamentJson);
		io.emit('tournamentUpdated',tournamentJson);
	});
 
	socket.on('tournamentUpdate',function(round,updateJson){
		if(round==32){
			tournamentJson.round32 = JSON.parse(JSON.stringify(updateJson));
			var groups = 8;
			var groupsJson	=	[];
			var allScoresInputted	=	true;
			for(var i=0;i<groups;i++){
				var groupJson = [];
				for(var j=i*4;j<i*4+4;j++){
					groupJson.push(tournamentJson.round32[j]);
					if(tournamentJson.round32[j].score==0){
						allScoresInputted = false;
					}
				}
				groupsJson.push(groupJson);
			}
			if(allScoresInputted){
				for(var i=0;i<groupsJson.length;i++){
					groupsJson[i] = groupsJson[i].sort(function(a, b) {return b.score - a.score});
				}
				tournamentJson.round16[0] = JSON.parse(JSON.stringify(groupsJson[0][0]));//A1 -00   A1
				tournamentJson.round16[1] = JSON.parse(JSON.stringify(groupsJson[1][1]));//B2 -01   B2
				tournamentJson.round16[2] = JSON.parse(JSON.stringify(groupsJson[2][0]));//C1 -10   C1
				tournamentJson.round16[3] = JSON.parse(JSON.stringify(groupsJson[3][1]));//D2 -11   D2

				tournamentJson.round16[4] = JSON.parse(JSON.stringify(groupsJson[0][1]));//A2 -20   A2
				tournamentJson.round16[5] = JSON.parse(JSON.stringify(groupsJson[1][0]));//B1 -21   B1
				tournamentJson.round16[6] = JSON.parse(JSON.stringify(groupsJson[2][1]));//C2 -30   C2
				tournamentJson.round16[7] = JSON.parse(JSON.stringify(groupsJson[3][0]));//D1 -31   D1

				tournamentJson.round16[8] = JSON.parse(JSON.stringify(groupsJson[4][0]));//E1 -40   E1
				tournamentJson.round16[9] = JSON.parse(JSON.stringify(groupsJson[5][1]));//F2 -41   F2
				tournamentJson.round16[10] = JSON.parse(JSON.stringify(groupsJson[6][0]));//G1 -50  G1
				tournamentJson.round16[11] = JSON.parse(JSON.stringify(groupsJson[7][1]));//H2 -51  H2

				tournamentJson.round16[12] = JSON.parse(JSON.stringify(groupsJson[4][1]));//E2 -60  E2
				tournamentJson.round16[13] = JSON.parse(JSON.stringify(groupsJson[5][0]));//F1 -61  F1
				tournamentJson.round16[14] = JSON.parse(JSON.stringify(groupsJson[6][1]));//G2 -70  G2
				tournamentJson.round16[15] = JSON.parse(JSON.stringify(groupsJson[7][0]));//H1 -71  H1
				for(var i=0;i<tournamentJson.round16.length;i++){
					tournamentJson.round16[i].score = 0;
					tournamentJson.round16[i].index = 0;
				}
			}

			
		}else if(round==16){
			tournamentJson.round16 = JSON.parse(JSON.stringify(updateJson));
			var groups = 4;
			var groupsJson	=	[];
			var allScoresInputted	=	true;
			for(var i=0;i<groups;i++){
				var groupJson = [];
				for(var j=i*4;j<i*4+4;j++){
					groupJson.push(tournamentJson.round16[j]);
					if(tournamentJson.round16[j].score==0){
						allScoresInputted = false;
					}
				}
				groupsJson.push(groupJson);
			}
			if(allScoresInputted){
				for(var i=0;i<groupsJson.length;i++){
					groupsJson[i] = groupsJson[i].sort(function(a, b) {return b.score - a.score});
				}
				tournamentJson.round8[0] = JSON.parse(JSON.stringify(groupsJson[0][0]));//A1 - 00   A1
				tournamentJson.round8[1] = JSON.parse(JSON.stringify(groupsJson[0][1]));//A2 - 01   C1
				tournamentJson.round8[2] = JSON.parse(JSON.stringify(groupsJson[1][0]));//B1 - 10   B2
				tournamentJson.round8[3] = JSON.parse(JSON.stringify(groupsJson[1][1]));//B2 - 11   D2

				tournamentJson.round8[4] = JSON.parse(JSON.stringify(groupsJson[2][0]));//C1 - 20   B1
				tournamentJson.round8[5] = JSON.parse(JSON.stringify(groupsJson[2][1]));//C2 - 21   D1
				tournamentJson.round8[6] = JSON.parse(JSON.stringify(groupsJson[3][0]));//D1 - 30   A2
				tournamentJson.round8[7] = JSON.parse(JSON.stringify(groupsJson[3][1]));//D2 - 31   C2
				for(var i=0;i<tournamentJson.round8.length;i++){
					tournamentJson.round8[i].score = 0;
					tournamentJson.round16[i].index = 0;
				}
			}

			
		}else if(round==8){
			tournamentJson.round8 = JSON.parse(JSON.stringify(updateJson));
			var groups = 2;
			var groupsJson	=	[];
			var allScoresInputted	=	true;
			for(var i=0;i<groups;i++){
				var groupJson = [];
				for(var j=i*4;j<i*4+4;j++){
					groupJson.push(tournamentJson.round8[j]);
					if(tournamentJson.round8[j].score==0){
						allScoresInputted = false;
					}
				}
				groupsJson.push(groupJson);
			}
			if(allScoresInputted){
				for(var i=0;i<groupsJson.length;i++){
					groupsJson[i] = groupsJson[i].sort(function(a, b) {return b.score - a.score});
				}
				tournamentJson.round4[0] = JSON.parse(JSON.stringify(groupsJson[0][0]));//A1
				tournamentJson.round4[1] = JSON.parse(JSON.stringify(groupsJson[0][1]));//A2
				tournamentJson.round4[2] = JSON.parse(JSON.stringify(groupsJson[1][0]));//B1
				tournamentJson.round4[3] = JSON.parse(JSON.stringify(groupsJson[1][1]));//B2

				for(var i=0;i<tournamentJson.round4.length;i++){
					tournamentJson.round4[i].score = 0;
				}
			}
		}else if(round==4){
			tournamentJson.round4 = JSON.parse(JSON.stringify(updateJson));
		}
		fs.writeFileSync("tournament.json",JSON.stringify(tournamentJson));
		io.emit('tournamentUpdated',tournamentJson);
	})
	
	socket.on('finalAdminUpdate',function(updateArray){
		io.emit('finalUpdate',updateArray);
	})
	
	socket.on('prihvaceno',function(brojStola){
		for(var i=0;i<aktivnePorudzbine.length;i++){
			if(aktivnePorudzbine[i].brojStola==brojStola){
				aktivnePorudzbine.splice(i,1);
			}
		}
		io.emit('prihvaceno',brojStola);
	})
})

server.get('/',function(req,res){
	var tournamentJson = JSON.parse(fs.readFileSync("tournament.json"));
	res.render("tournamentGroups",{
		tournamentJson: tournamentJson,
		bucket: bucket
	});
})

server.get('/finale',function(req,res){
	res.render("tournamentFinale",{
		tournamentJson: tournamentJson,
		bucket: bucket
	});
})

server.get('/create',function(req,res){
	res.render("tournamentCreate",{
		bucket: bucket
	});
});

server.get('/tournamentAdmin',function(req,res){
	var tournamentJson = JSON.parse(fs.readFileSync("tournament.json"));
	res.render("tournamentAdmin",{
		tournamentJson: tournamentJson,
		bucket: bucket
	});
});

server.get('/sedenje',function(req,res){
	res.render("sedenje",{});
});

var dostupniStolovi = ["T01","T02","T03","T04","T05","T06","i01","i02","i03","i04","i05","i06","i07","i08","i09","i10","i11","i12","i13","i14","F01","F02","F03","F04","P01","P02","P03","P04","P05","P06","P07","P08","P09","01","02","03","04","05","06","07","08","09","10"]

var aktivnePorudzbine = [];
//{brojStola:brojStola}

setInterval(function(){
	console.log(aktivnePorudzbine)
},10000)


server.get('/porudzbine',function(req,res){
		res.render("porudzbine",{
			bucket: bucket,
			aktivnePorudzbine: aktivnePorudzbine
		});	
});

server.get('/poruci/:broj',function(req,res){
	 res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
	if(dostupniStolovi.indexOf(req.params.broj)>=0){	
		var slobodanSto = true;
		for(var i=0;i<aktivnePorudzbine.length;i++){
			if(aktivnePorudzbine[i].brojStola==req.params.broj){
				slobodanSto = false;
				break;
			}	
		}
		if(slobodanSto){
			res.render("poruci",{
				bucket: bucket,
				brojStola: req.params.broj

			});	
		}else{
			res.render("poruceno",{
				bucket: bucket,
				brojStola: req.params.broj
			});	
		}

		
	}
});

server.get('/poruceno/:brojStola',function(req,res){
	 res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
	if(dostupniStolovi.indexOf(req.params.brojStola)>=0){	

		res.render("poruceno",{
			bucket: bucket,
			brojStola: req.params.broj
		});	
	}
});

server.post('/poruci',function(req,res){
	try{
		var sto = req.body.sto;
		res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
		if(dostupniStolovi.indexOf(sto)>=0){
	    var json = {};
	    json.brojStola = sto;
	    aktivnePorudzbine.push(json);
			io.emit("porudzbina",sto);
			res.redirect("/poruceno/"+sto);	
		}
	}catch(err){
		console.log(err)
	}
})