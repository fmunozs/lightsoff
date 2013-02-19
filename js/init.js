
var gameOver = 0;
var numMoves = 0;
var nivel = 1;

var board = new Array(5);
var solut = new Array(5);
var borig = new Array(5);
var sorig = new Array(5);

var stepAnimate = 1;
var timerN = 0;
var randomAnimate = 0;

function init() 
{
	var l = parseInt(getParameterByName("nivel"));
	if (l < 0) {
		l = 1;
	}
	if (l > 12) {
		l = 12;
	}
	nivel = l;
	$('level').innerHTML = "Level: "+nivel;

	var px;
	var py;
	var newvalue;


	sorig = new Array(5);
	for (var id = 0; id < 5; id++) {
        	sorig[id] = "";
	        for (var id2 = 0; id2 < 5; id2++) {
                	sorig[id] += "0";
        	}
	}

	for (var no = 0; no < l; no++) {
		do {
			px = Math.floor(Math.random() * 5);
			py = Math.floor(Math.random() * 5);
			if (px >= 5) {
				px = 5 - 1;
			}
			if (py >= 5) {
				py = 5 - 1;
			}
			newvalue = sorig[px].charAt(py);
		} while (newvalue != '0');
		if (newvalue == '0') {
			newvalue = '1';
		} else {
			newvalue = '0';
		}
		sorig[px] = sorig[px].substring(0, py) + newvalue + sorig[px].substring(py + 1);
	}

	for (var id = 0; id < 5; id++) {
		borig[id] = "";
		for (var id2 = 0; id2 < 5; id2++) {
			borig[id] += "0";
		}
	}

	for (var id = 0; id < 5; id++) {
		board[id] = borig[id];
		solut[id] = sorig[id];
	}

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			if (solut[i].charAt(j) == '1') {
				clicked(i, j);
			}
		}
	}

	for (var id = 0; id < 5; id++) {
		borig[id] = board[id];
	}

	doBoardUpdate();
}

function prevLevel() 
{
	var newN = (nivel-1);
	if (newN <= 0) newN = 1;
	document.location="index.html?nivel="+newN;
}

function nextLevel() 
{
	document.location="index.html?nivel="+(nivel+1);
}

//var sorig = new Array(5);
//for (var id = 0; id < 5; id++) {
//	sorig[id] = "";
//	for (var id2 = 0; id2 < 5; id2++) {
//		sorig[id] += "0";
//	}
//}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return 1;
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function $(id){
	if (document.getElementById) {
		return document.getElementById(id);
	}
	else if (window[id]){
		return window[id];
	}
	return null;
}

function switcher(x, y) {
	if ((x >= 0) && (x < 5) && (y >= 0) && (y < 5)) {
		var newValue = board[x].charAt(y);
		if (newValue == "0") {
			newValue = "1";
		} else {
			newValue = "0";
		}
		board[x] = board[x].substring(0, y) + newValue + board[x].substring(y + 1);
	}
}

function clicked(x, y) {
	switcher(x, y);
	switcher(x - 1, y);
	switcher(x + 1, y);
	switcher(x, y - 1);
	switcher(x, y + 1);

	doBoardUpdate();
}

function updateScore() {
	$('moves').innerHTML= "Taps: "+numMoves;
}

function c(x, y) {
	if (gameOver == 1) {
		alert("Level passed!");
		return;
	}
	numMoves++;
        try {
	navigator.vibrate(1000);
        } catch(err) {
        }
	clicked(x, y);
	updateScore();

	var empty = 1;
	for (var x = 0; x < 5; x++) {
		for (var y = 0; y < 5; y++) {
			if (board[x].charAt(y) == '1') {
				empty = 0;
			}
		}
	}

	if (empty == 1) {
		randomAnimate = Math.floor((Math.random()*6)+1);
		timerN = setInterval(function(){showAnimation()}, 100);
		gameOver = 1;
	}
}

function resetBoard() {
	for (var id = 0; id < 5; id++) {
		board[id] = borig[id];
		solut[id] = sorig[id];
	}

	gameOver = 0;
	numMoves = 0;

	doBoardUpdate();
}

function doBoardUpdate() {
	var htmlCode = "";
	for (var x = 0; x < 5; x++) {
		for (var y = 0; y < 5; y++) {
			if (board[x].charAt(y) == '0') {
				htmlCode += "<img src='img/0.png' onclick='c(" + x + ", " + y + ")'>";
			} else {
				htmlCode += "<img src='img/1.png' onclick='c(" + x + ", " + y + ")'>";
			}
		}
			htmlCode += "<br/>";
	}
	$('board').innerHTML = htmlCode;
}


function switchLight(x, y, newValue)
{
    if ((x >= 0) && (x < 5) && (y >= 0) && (y < 5))
    {
		board[x] = board[x].substring(0, y) + newValue + board[x].substring(y + 1);    
	}
}


function showAnimation() {
	var ss = getAnimation(randomAnimate);
	var bb = ss.split(",");
	if (stepAnimate >= bb.length){
	    clearTimeout(timerN);
	    timerN = 0;

		alert("Congratulations!\n\nLevel finished.");
		nextLevel();
	    stepAnimate=-1;
	} else {
	    var cc = bb[stepAnimate].split(" ");
	    for (var i=0;i<cc.length;i++) {
	        var y = parseInt(i/5);
	        var x = i-(y*5);
	        switchLight(x, y, cc[i]);
	    }
	}
	doBoardUpdate();
    stepAnimate++;
}

function getAnimation(n) {
    var aa;
    switch(n) {
    case 1:
        aa = "\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 1 0 0 \
0 1 1 1 0 \
0 0 1 0 0 \
0 0 0 0 0,\
\
0 0 1 0 0 \
0 1 1 1 0 \
1 1 1 1 1 \
0 1 1 1 0 \
0 0 1 0 0,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 1 0 1 1 \
1 1 1 1 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 0 1 1 \
1 0 0 0 1 \
1 1 0 1 1 \
1 1 1 1 1,\
\
1 1 0 1 1 \
1 0 0 0 1 \
0 0 0 0 0 \
1 0 0 0 1 \
1 1 0 1 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
";
        break;
    case 2:
        aa =  "\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 1 1 1 0 \
0 1 0 1 0 \
0 1 1 1 0 \
0 0 0 0 0,\
\
1 1 1 1 1 \
1 0 0 0 1 \
1 0 0 0 1 \
1 0 0 0 1 \
1 1 1 1 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
";

        break;
    case 3:

        aa =  "\
0 0 0 0 0 \
0 0 0 0 0 \
1 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
1 0 0 0 0 \
1 1 0 0 0 \
1 0 0 0 0 \
0 0 0 0 0,\
\
1 0 0 0 0 \
1 1 0 0 0 \
1 1 1 0 0 \
1 1 0 0 0 \
1 0 0 0 0,\
\
1 1 0 0 0 \
1 1 1 0 0 \
1 1 1 1 0 \
1 1 1 0 0 \
1 1 0 0 0,\
\
1 1 1 0 0 \
1 1 1 1 0 \
1 1 1 1 1 \
1 1 1 1 0 \
1 1 1 0 0,\
\
1 1 1 1 0 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 0,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
";

        break;
    case 4:

        aa =  "\
1 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 1 1 1 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 1 1 1 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 1 1 1 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 1,\
\
1 1 1 1 1 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 1 1 1,\
\
1 1 1 1 1 \
1 0 0 0 1 \
1 0 0 0 1 \
1 0 0 0 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 0 1 \
1 0 0 0 1 \
1 0 0 0 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 0 0 1 1 \
1 0 0 0 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 0 0 1 1 \
1 0 1 1 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 1 0 1 1 \
1 1 1 1 1 \
1 1 1 1 1,\
\
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
1 1 1 1 1 \
";
        break;
case  5:

    aa =  "\
1 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
1 1 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 1 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 1 1 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 1 1 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 1 \
0 0 0 0 1 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 1 \
0 0 0 0 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 1 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 1 1 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
1 1 0 0 0,\
\
0 0 0 0 0 \
1 0 0 0 0 \
1 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
1 1 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 1 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 1 1 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 1 0 \
0 0 0 1 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 1 0 \
0 0 0 1 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 1 1 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 1 0 0 0 \
0 1 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 1 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 1 0 0 \
0 0 0 0 0 \
0 0 0 0 0 ";
    break;
case 6:
default:
    aa =  "\
1 1 0 0 0 \
1 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0,\
\
0 1 1 0 0 \
1 1 1 0 0 \
1 1 0 0 0 \
1 0 0 0 0 \
0 0 0 0 0,\
\
0 0 1 1 1 \
0 1 1 1 0 \
1 1 1 0 0 \
1 1 0 0 0 \
1 0 0 0 0,\
\
0 0 0 1 1 \
0 0 1 1 1 \
0 1 1 1 0 \
1 1 1 0 0 \
1 1 0 0 0,\
\
0 0 0 0 1 \
0 0 0 1 1 \
0 0 1 1 1 \
0 1 1 1 0 \
1 1 1 0 0,\
\
0 0 0 0 0 \
0 0 0 0 1 \
0 0 0 1 1 \
0 0 1 1 1 \
0 1 1 1 0,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 1 \
0 0 0 1 1 \
0 0 1 1 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 1 \
0 0 0 1 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 1,\
\
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
0 0 0 0 0 \
";
    break;
    }

    return aa;
}
