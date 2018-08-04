var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.Symbol=function(){var a=0;return function(b){return $jscomp.SYMBOL_PREFIX+(b||"")+a++}}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();$jscomp.initSymbol();$jscomp.initSymbolIterator();var b=a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};
var gameBoard=[[0,0,0],[0,0,0],[0,0,0]],turn=1,turns=0,winner=0,mode=0,record={p1:0,p2:0,ties:0},ls=window.localStorage,saveRecord=function(){ls.setItem("record",JSON.stringify(record))},loadRecord=function(){var a=JSON.parse(ls.getItem("record"));a&&(a=$jscomp.makeIterator([a.p1,a.p2,a.ties]),record.p1=a.next().value,record.p2=a.next().value,record.ties=a.next().value)},reset=function(){gameBoard=[[0,0,0],[0,0,0],[0,0,0]];turn=1;mode=winner=turns=0;refreshDisplay();modifyEventHandlers("");document.getElementById("board").classList.add("hidden");
var a=document.getElementById("turn");a.textContent="Play as...";var b=document.createElement("div");b.id="start-buttons";var c=document.createElement("button"),h=document.createElement("button"),d=document.createElement("button"),q=document.createElement("button");c.textContent="Human vs Human";c.setAttribute("onclick","mode=1;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)');");h.textContent="Human vs CPU";h.setAttribute("onclick","mode=2;showBoard();refreshDisplay();modifyEventHandlers('getCellCoords(event)')");
d.textContent="CPU vs Human";d.setAttribute("onclick","mode=3;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(function(){play(true)},500)");q.textContent="Spectate CPU vs CPU";q.setAttribute("onclick","mode=4;showBoard();modifyEventHandlers('');refreshDisplay();setTimeout(function(){play(true)},900)");b.appendChild(c);b.appendChild(h);b.appendChild(d);b.appendChild(q);a.appendChild(b)},highlight=function(a,b){var c=Math.floor(Number(b.target.id)/3),h=Number(b.target.id)%3;a&&!gameBoard[c][h]&&
(2===mode&&1===turn||3===mode&&2===turn||1===mode)?b.target.classList.add("hover"):a||b.target.classList.remove("hover")},playSound=function(a){(new Audio(a)).play()},changeTurn=function(){1===turn?(playSound("x.webm"),turn++):(playSound("o.webm"),turn--);turns++},modifyEventHandlers=function(a){for(var b=document.getElementsByClassName("grid-item"),c=0;c<b.length;c++)b[c].setAttribute("onclick",a)},showBoard=function(){document.getElementById("board").classList.remove("hidden")},blink=function(a,
b,c){var h=1===b?"xWin":"oWin";for(b=0;b<c;b++)setTimeout(function(){document.getElementById(String(a)).classList.add(h);setTimeout(function(){document.getElementById(String(a)).classList.remove(h)},250)},500*b)},refreshDisplay=function(){var a=document.getElementById("turn"),b=document.getElementsByTagName("html")[0],c=document.getElementById("board");if(1===winner)record.p1++,a.textContent="Player 1 wins",b.style.backgroundColor="#778899",c.style.backgroundColor="#2196F3";else if(2===winner)record.p2++,
a.textContent="Player 2 wins",b.style.backgroundColor="#aa8484",c.style.backgroundColor="#f32121";else if(-1===winner)record.ties++,a.textContent="Tied game",b.style.backgroundColor="#c4fcc2",c.style.backgroundColor="#36fc2f";else if(!winner&&mode){var h=document.createElement("div");h.id="start-buttons";var d=document.createElement("button");d.textContent="Give me a hint!";d.setAttribute("onclick","play(false)");h.appendChild(d);1===turn?(b.style.backgroundColor="#778899",c.style.backgroundColor=
"#2196F3",a.textContent="Player 1's turn",2===mode&&a.appendChild(h),3===mode&&(d.disabled=!0,a.appendChild(h))):(b.style.backgroundColor="#aa8484",c.style.backgroundColor="#f32121",a.textContent="Player 2's turn",2===mode&&(d.disabled=!0,a.appendChild(h)),3===mode&&a.appendChild(h));1===mode&&a.appendChild(h)}document.getElementById("score").innerHTML="Player 1 wins: "+record.p1+"<br>Player 2 wins: "+record.p2+"<br>Ties: "+record.ties;winner&&(a=document.createElement("div"),a.id="start-buttons",
b=document.createElement("button"),b.textContent="Play again!",b.setAttribute("onclick","reset();"),a.appendChild(b),document.getElementById("turn").appendChild(a),saveRecord());for(a=0;a<gameBoard.length;a++)for(b=0;b<gameBoard[a].length;b++)c=document.getElementById(String(gameBoard.length*a+b)),1===gameBoard[a][b]?(c.textContent="X",c.classList.add("x")):2===gameBoard[a][b]?(c.textContent="O",c.classList.add("o")):(c.textContent="",c.classList.remove("x","xWin","o","oWin"))},cellCheck=function(a){return gameBoard[a.row][a.column]},
getCellCoords=function(a){updateCell({row:Math.floor(Number(a.target.id)/3),column:Math.floor(Number(a.target.id)%3),cellId:a.target.id})},updateCell=function(a){cellCheck(a)||winner||((gameBoard[a.row][a.column]=turn,blink(a.cellId,turn,1),changeTurn(),checkWinner(),refreshDisplay(),2!==mode||winner)?3!==mode||winner?4!==mode||winner||setTimeout(function(){play(!0)},900):2===turn?modifyEventHandlers("getCellCoords(event)"):1===turn&&(modifyEventHandlers(""),setTimeout(function(){play(!0)},1E3)):
1===turn?modifyEventHandlers("getCellCoords(event)"):2===turn&&(modifyEventHandlers(""),setTimeout(function(){play(!0)},1E3)))},checkWinner=function(){for(var a=[],b=[],c=!1,h=!1,d=!1,q=!1,f=function(b,a){var c,d;1===turn?d=2:2===turn&&(d=1);1===a?c=[b*gameBoard.length,b*gameBoard.length+1,b*gameBoard.length+2]:2===a?c=[b,gameBoard.length+b,2*gameBoard.length+b]:3===a?c=[0,4,8]:4===a&&(c=[2,4,6]);for(var e=0;e<c.length;e++)blink(c[e],d,6)},l=0;l<gameBoard.length;l++){var e=[],k=[],n=!1,g=!1,p=!1,
m=!1;a[a.length]=gameBoard[l][l];b[b.length]=gameBoard[l][2-l];for(var r=0;r<gameBoard[l].length;r++)e[e.length]=gameBoard[l][r],k[k.length]=gameBoard[r][l];1===e[0]&&1===e[1]&&1===e[2]&&(n=!0,f(l,1));1===k[0]&&1===k[1]&&1===k[2]&&(g=!0,f(l,2));2===e[0]&&2===e[1]&&2===e[2]&&(p=!0,f(l,1));2===k[0]&&2===k[1]&&2===k[2]&&(m=!0,f(l,2));if(n||g)winner=1;else if(p||m)winner=2}1===a[0]&&1===a[1]&&1===a[2]&&(c=!0,f(0,3,"xWin"));1===b[0]&&1===b[1]&&1===b[2]&&(h=!0,f(0,4,"xWin"));2===a[0]&&2===a[1]&&2===a[2]&&
(d=!0,f(0,3,"oWin"));2===b[0]&&2===b[1]&&2===b[2]&&(q=!0,f(0,4,"oWin"));c||h?winner=1:d||q?winner=2:9!==turns||winner||(winner=-1)},twoOutOfThree=function(a){return 1===cellCheck(a[0])&&1===cellCheck(a[1])?1:2===cellCheck(a[0])&&2===cellCheck(a[1])?2:1===cellCheck(a[0])&&2===cellCheck(a[1])||2===cellCheck(a[0])&&1===cellCheck(a[1])?-1:0},emptyLine=function(a){var b=gameBoard[a[1].row][a[1].column],c=gameBoard[a[2].row][a[2].column];return gameBoard[a[0].row][a[0].column]||b||c?!1:!0},cellsInDir=function(a,
b,c,h){var d;0===c?d=[{row:a,column:0},{row:a,column:1},{row:a,column:2}]:1===c?d=[{row:0,column:b},{row:1,column:b},{row:2,column:b}]:2===c?d=[{row:0,column:0},{row:1,column:1},{row:2,column:2}]:3===c&&(d=[{row:0,column:2},{row:1,column:1},{row:2,column:0}]);if(h)if(0===c)for(a=0;a<d.length;a++)b===d[a].column&&d.splice(a,1);else for(b=0;b<d.length;b++)a===d[b].row&&d.splice(b,1);return d},play=function(a){for(var b=[{score:0,valid:!1,diagA:!0,diagB:!1},{score:0,valid:!1,diagA:!1,diagB:!1},{score:0,
valid:!1,diagA:!1,diagB:!0},{score:0,valid:!1,diagA:!1,diagB:!1},{score:0,valid:!1,diagA:!0,diagB:!0},{score:0,valid:!1,diagA:!1,diagB:!1},{score:0,valid:!1,diagA:!1,diagB:!0},{score:0,valid:!1,diagA:!1,diagB:!1},{score:0,valid:!1,diagA:!0,diagB:!1}],c=-Infinity,h=0,d=[],q={row:0,column:0,cellId:0},f=0;f<gameBoard.length;f++)for(var l=0;l<gameBoard[f].length;l++){var e=gameBoard.length*f+l;if(0===gameBoard[f][l]){var k=cellsInDir(f,l,0,!0),n=cellsInDir(f,l,1,!0),g=void 0;g=void 0;-1===twoOutOfThree(k)?
--b[e].score:twoOutOfThree(k)!==turn&&0!==twoOutOfThree(k)?b[e].score+=3:twoOutOfThree(k)===turn&&0!==twoOutOfThree(k)&&(b[e].score+=4);-1===twoOutOfThree(n)?--b[e].score:twoOutOfThree(n)!==turn&&0!==twoOutOfThree(n)?b[e].score+=3:twoOutOfThree(n)===turn&&0!==twoOutOfThree(n)&&(b[e].score+=4);b[e].diagA&&(g=cellsInDir(f,l,2,!0),-1===twoOutOfThree(g)?--b[e].score:twoOutOfThree(g)!==turn&&0!==twoOutOfThree(g)?b[e].score+=3:twoOutOfThree(g)===turn&&0!==twoOutOfThree(g)&&(b[e].score+=4));b[e].diagB&&
(g=cellsInDir(f,l,3,!0),-1===twoOutOfThree(g)?--b[e].score:twoOutOfThree(g)!==turn&&0!==twoOutOfThree(g)?b[e].score+=3:twoOutOfThree(g)===turn&&0!==twoOutOfThree(g)&&(b[e].score+=4));if((0===f&&0===l||2===f&&2===l)&&3===turns){k=cellsInDir(0,0,0,!1);n=cellsInDir(2,2,0,!1);g=cellsInDir(0,0,1,!1);var p=cellsInDir(2,2,1,!1),m=function(a){for(var c=0;c<a.length;c++)--b[a[c].row*gameBoard.length+a[c].column].score};emptyLine(k)&&!emptyLine(n)?emptyLine(g)||emptyLine(p)?emptyLine(g)?emptyLine(p)||(m(k),
m(g)):(m(k),m(p)):m(k):!emptyLine(k)&&emptyLine(n)?emptyLine(g)||emptyLine(p)?emptyLine(g)?emptyLine(p)||(m(n),m(g)):(m(n),m(p)):m(n):emptyLine(g)&&!emptyLine(p)?emptyLine(k)||emptyLine(n)?emptyLine(k)?emptyLine(n)||(m(g),m(k)):(m(g),m(n)):m(g):!emptyLine(g)&&emptyLine(p)&&(emptyLine(k)||emptyLine(n)?emptyLine(k)?emptyLine(n)||(m(p),m(k)):(m(p),m(n)):m(p))}b[e].valid=!0}}1===turns&&(b[4].score+=420);0<turns&&(b[0].score+=2,b[2].score+=2,b[6].score+=2,b[8].score+=2);gameBoard[0][0]===gameBoard[2][2]&&
gameBoard[0][0]&&(b[1].score+=2,b[3].score+=2,b[5].score+=2,b[7].score+=2);gameBoard[0][2]===gameBoard[2][0]&&gameBoard[0][2]&&(b[1].score+=2,b[3].score+=2,b[5].score+=2,b[7].score+=2);for(f=0;f<b.length;f++)b[f].score>c&&b[f].valid?(c=b[f].score,h=f,d.length=0,d[d.length]=f):b[f].score===c&&b[f].valid&&(d[d.length]=f);1<d.length&&(h=d[Math.floor(Math.random()*d.length)]);q.row=Math.floor(h/gameBoard.length);q.column=h%gameBoard.length;q.cellId=h;console.log("Turn:",turns);console.log("Play: "+q.row+
", "+q.column);console.log(b);console.log("");if(a)updateCell(q);else for(a=0;a<d.length;a++)blink(d[a],turn,3)};window.onload=function(){loadRecord();reset()};window.ondragstart=function(){return!1};