var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(b){return $jscomp.SYMBOL_PREFIX+(b||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();$jscomp.initSymbol();$jscomp.initSymbolIterator();var b=a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
var gameBoard=[[0,0,0],[0,0,0],[0,0,0]],turn=1,turns=0,winner=0,mode=0,record={p1:0,p2:0,ties:0},ls=window.localStorage,saveRecord=function(){ls.setItem("record",JSON.stringify(record))},loadRecord=function(){var a=JSON.parse(ls.getItem("record"));a&&(a=$jscomp.makeIterator([a.p1,a.p2,a.ties]),record.p1=a.next().value,record.p2=a.next().value,record.ties=a.next().value)},reset=function(){gameBoard=[[0,0,0],[0,0,0],[0,0,0]];turn=1;mode=winner=turns=0;refreshDisplay();modifyEventHandlers("");document.getElementById("board").classList.add("hidden");
var a=document.getElementById("turn");a.textContent="Play as...";var b=document.createElement("div");b.id="start-buttons";var c=document.createElement("button"),d=document.createElement("button"),l=document.createElement("button"),e=document.createElement("button");c.textContent="Human vs Human";c.setAttribute("onclick","mode=1;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)');");d.textContent="Human vs CPU";d.setAttribute("onclick","mode=2;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)')");
l.textContent="CPU vs Human";l.setAttribute("onclick","mode=3;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(play,1000)");e.textContent="Spectate CPU vs CPU";e.setAttribute("onclick","mode=4;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(play,1000)");b.appendChild(c);b.appendChild(d);b.appendChild(l);b.appendChild(e);a.appendChild(b)},highlight=function(a,b){var c=Math.floor(Number(b.target.id)/3),d=Number(b.target.id)%3;a&&!gameBoard[c][d]&&(2===mode&&1===turn||
3===mode&&2===turn||1===mode)?b.target.classList.add("hover"):a||b.target.classList.remove("hover")},playSound=function(a){(new Audio(a)).play()},changeTurn=function(){1===turn?(playSound("x.webm"),turn++):(playSound("o.webm"),turn--);turns++},modifyEventHandlers=function(a){for(var b=document.getElementsByClassName("grid-item"),c=0;c<b.length;c++)b[c].setAttribute("onclick",a)},showBoard=function(){document.getElementById("board").classList.remove("hidden")},refreshDisplay=function(){1===winner?
(record.p1++,document.getElementById("turn").textContent="Player 1 wins",document.getElementsByTagName("html")[0].style.backgroundColor="#778899",document.getElementById("board").style.backgroundColor="#2196F3"):2===winner?(record.p2++,document.getElementById("turn").textContent="Player 2 wins",document.getElementsByTagName("html")[0].style.backgroundColor="#aa8484",document.getElementById("board").style.backgroundColor="#f32121"):-1===winner?(record.ties++,document.getElementById("turn").textContent=
"Tied game",document.getElementsByTagName("html")[0].style.backgroundColor="#c4fcc2",document.getElementById("board").style.backgroundColor="#36fc2f"):!winner&&mode&&(1===turn?(document.getElementsByTagName("html")[0].style.backgroundColor="#778899",document.getElementById("board").style.backgroundColor="#2196F3",document.getElementById("turn").textContent="Player 1's turn"):(document.getElementsByTagName("html")[0].style.backgroundColor="#aa8484",document.getElementById("board").style.backgroundColor=
"#f32121",document.getElementById("turn").textContent="Player 2's turn"));document.getElementById("score").innerHTML="Player 1 wins: "+record.p1+"<br>Player 2 wins: "+record.p2+"<br>Ties: "+record.ties;if(winner){var a=document.createElement("div");a.id="start-buttons";var b=document.createElement("button");b.textContent="Play again!";b.setAttribute("onclick","reset();");a.appendChild(b);document.getElementById("turn").appendChild(a);saveRecord()}for(a=0;a<gameBoard.length;a++)for(b=0;b<gameBoard[a].length;b++){var c=
document.getElementById(gameBoard.length*a+b);1===gameBoard[a][b]?(c.textContent="X",c.classList.add("x")):2===gameBoard[a][b]?(c.textContent="O",c.classList.add("o")):(c.textContent="",c.classList.remove("x"),c.classList.remove("o"))}},cellCheck=function(a){return gameBoard[a.row][a.column]},getCellCoords=function(a){updateCell({row:Math.floor(Number(a.target.id)/3),column:Math.floor(Number(a.target.id)%3)})},updateCell=function(a){cellCheck(a)||winner||((gameBoard[a.row][a.column]=turn,changeTurn(),
checkWinner(),refreshDisplay(),2!==mode||winner)?3!==mode||winner?4!==mode||winner||setTimeout(function(){play()},900):2===turn?modifyEventHandlers("getCellCoords(event)"):1===turn&&(modifyEventHandlers(""),setTimeout(function(){play()},1E3)):1===turn?modifyEventHandlers("getCellCoords(event)"):2===turn&&(modifyEventHandlers(""),setTimeout(function(){play()},1E3)))},checkWinner=function(){for(var a=[],b=[],c=!0,d=!0,l=!0,e=!0,f=0;f<gameBoard.length;f++){var g=[],h=[],m=!0,n=!0,p=!0,q=!0;a[a.length]=
gameBoard[f][f];b[b.length]=gameBoard[f][2-f];for(var k=0;k<gameBoard[f].length;k++)g[g.length]=gameBoard[f][k],h[h.length]=gameBoard[k][f];for(k=0;k<gameBoard.length;k++)1!==g[k]&&(m=!1),1!==h[k]&&(n=!1),2!==g[k]&&(p=!1),2!==h[k]&&(q=!1);if(m||n)winner=1;else if(p||q)winner=2}for(f=0;f<a.length;f++)1!==a[f]&&(c=!1),1!==b[f]&&(d=!1),2!==a[f]&&(l=!1),2!==b[f]&&(e=!1);c||d?winner=1:l||e?winner=2:9!==turns||winner||(winner=-1)},twoOutOfThree=function(a){return 1===cellCheck(a[0])&&1===cellCheck(a[1])?
1:2===cellCheck(a[0])&&2===cellCheck(a[1])?2:1===cellCheck(a[0])&&2===cellCheck(a[1])||2===cellCheck(a[0])&&1===cellCheck(a[1])?-1:0},cellsInDir=function(a,b,c){var d;0===c?d=[{row:a,column:0},{row:a,column:1},{row:a,column:2}]:1===c?d=[{row:0,column:b},{row:1,column:b},{row:2,column:b}]:2===c?d=[{row:0,column:0},{row:1,column:1},{row:2,column:2}]:3===c&&(d=[{row:0,column:2},{row:1,column:1},{row:2,column:0}]);if(0===c)for(a=0;a<d.length;a++)b===d[a].column&&d.splice(a,1);else for(b=0;b<d.length;b++)a===
d[b].row&&d.splice(b,1);return d},play=function(){for(var a=[{score:2,valid:!1,diagA:!0,diagB:!1},{score:1,valid:!1,diagA:!1,diagB:!1},{score:2,valid:!1,diagA:!1,diagB:!0},{score:1,valid:!1,diagA:!1,diagB:!1},{score:2,valid:!1,diagA:!0,diagB:!0},{score:1,valid:!1,diagA:!1,diagB:!1},{score:2,valid:!1,diagA:!1,diagB:!0},{score:1,valid:!1,diagA:!1,diagB:!1},{score:2,valid:!1,diagA:!0,diagB:!1}],b=-Infinity,c=0,d=[],l={row:0,column:0},e=0;e<gameBoard.length;e++)for(var f=0;f<gameBoard[e].length;f++){var g=
gameBoard.length*e+f;if(0===gameBoard[e][f]){var h=cellsInDir(e,f,0),m=cellsInDir(e,f,1);-1===twoOutOfThree(h)?--a[g].score:0!==twoOutOfThree(h)&&(a[g].score+=2);-1===twoOutOfThree(m)?--a[g].score:0!==twoOutOfThree(m)&&(a[g].score+=2);a[g].diagA&&(h=cellsInDir(e,f,2),-1===twoOutOfThree(h)?--a[g].score:0!==twoOutOfThree(h)&&(a[g].score+=2));a[g].diagB&&(h=cellsInDir(e,f,3),-1===twoOutOfThree(h)?--a[g].score:0!==twoOutOfThree(h)&&(a[g].score+=2));a[g].valid=!0}}0<turns&&(a[4].score=420);gameBoard[0][0]===
gameBoard[2][2]&&gameBoard[0][0]&&(a[1].score+=2,a[3].score+=2,a[5].score+=2,a[7].score+=2);gameBoard[0][2]===gameBoard[2][0]&&gameBoard[0][2]&&(a[1].score+=2,a[3].score+=2,a[5].score+=2,a[7].score+=2);for(e=0;e<a.length;e++)a[e].score>b&&a[e].valid?(b=a[e].score,c=e,d.length=0,d[d.length]=e):a[e].score===b&&a[e].valid&&(d[d.length]=e);1<d.length&&(c=d[Math.floor(Math.random()*d.length)]);l.row=Math.floor(c/3);l.column=c%3;updateCell(l)};window.onload=function(){loadRecord();reset()};