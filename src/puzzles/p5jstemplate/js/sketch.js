///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

let fsshow;
let step = 0;
let real_step = 0;
let nstep;
let puzzleId = 0;
let step_to_sign = 2;
let waitForTransaction = false;
let xs,ys;

const advices = ['faces','faces','faces','faces','faces']
const codes = ['14c380ee4d4814ecaa787f37&1d513cc06807e5ee67080e3b&cd372fb85148700fa88095e3492d3f9f5beb43e555e5ff26d95f5a6adc36f8e6',
	       'b5de89892c22e139e49177b0b79ce3fd4c2ede2c03cd734f&b5df898b2c27e23de5967ab4baa2e6055034e33308d57a57&033c339a7975542785be7423a5b32fa8047813689726214143cdd7939747709c',
	       '188ac0ef0912f348b34df52c6931281103fe&190c40f28996734e34cff6afeab52a968502ec4ff1cc89a6&9e259b7f6b4c741937a96a9617b3e6b84e166ff6e925e414e7b72936f5a2a51f',
	       '05cfefff64fc10571f9def139d2767ce27c1d822a6681838a7f1c01121541c5d841ebe1d32de5f883dec21f54ff68580a6730904f59a99ea26419091&d4a9bedd3341e691f5782855d000370ff7050c5d77a84c7d2afa139f2517a068d8abc2df3838e496f37c274ed5023c11fefc145f81a75879370421a4&8f0703d406fdb0ea8011d5de342c3aca62214758a8a2b5b8a4e9f1c8c6c42462',
	       '157d2b4fefa3011de3c26334d761a191281f6e4b7a92f56f99669010d476576863afac00&95b12cd321a981f4e44c33370c6724ca2ba84057fc66f7f69fedcc185e505ef39db834d42aa885f5e8433b350f6d27c433a03f54fe67f9f7a0f0cc13&ab2e30bf75636a9c97e05099d9ccc9b623c17a44f629e7ce7206dba683028db1',
	      '0ab255ba5bec2992758bebc8764418a5f36e8d95c454876b9b9cacfedab4f39e77714475cb8eb77e47675b8b3db3c9a9dee1754dae7972fff484752f&0b37c80bb9632b190bdd4b62d5508f433ee9eda35ef3d40990dc27cd6733e9e01541d317c46c362416ea556bdf5a9a4f49f2f8ae69ecde129ae632c5&daf22915f12ba58cc39b49d23780d76732966e4ef68eee56b33b996eefcbfff0']

function preload() {
    App.init();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    fsshow = new fsButton(255,255,255);
    fsshow.setButton();
    words = [];
    nstep = codes.length;
    init();
}

function init() {
    cw = min(width,height);
    cx = width/2;
    cy = height/2;
    if( step % 2 == 1 ) {
	init_keyboard()
    } else {
	init_2()
    }
    //transacting();
    waitForTransaction = false;
    fsshow.setButton();
}

function draw() {
    background(color(100));
    if( waitForTransaction ) {
	draw_wait();
    } else {
	if( step % 2 == 1 ) {
	    draw_keyboard()
	} else {
	    draw_2()
	}
	noStroke();
	fill(0);
	textAlign(LEFT,BOTTOM);
	textSize(cw/40);
	if( App.accountIsWinner ) {
	    text("winner "+App.account,cw/20,cw/20)
	} else {
	    text(App.account,cw/20,cw/20)
	}
	draw_steps();
    } 
}

function draw_wait() {
    clear();
    background(color(100));
    blendMode(DARKEST);
    noStroke();
    fill(0);
    for( var u = 0; u < xs.length; u ++ ) {
	circle(xs[u],
	       ys[u],
	       cw/100);
    }

    for( var u = 0; u < xs.length; u ++ ) {
    	for( var v = 0; v < xs.length; v ++ ) {
    	    if( u != v ) {
		
    		stroke(255*((u+1)*(v+1)/400)**(fc/500));
    		line(xs[u],ys[u],xs[v],ys[v]);
    	    }
    	}
    }
    noStroke();
    textAlign(CENTER,CENTER);
    textSize(ww/20)
    text(transaction_info,cx,cy-cw/4)
    fc ++;
}

function draw_steps() {
    stroke(0);
    for( var u = 0; u < nstep-1; u ++ ) {
	if( u <= real_step ) {
	    fill(0);
	} else {
	    fill(100);
	}
	circle(cx - 0.4*cw + 0.8*u*cw/(nstep-2),
	       cy - 0.4*cw,
	       cw/100);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);   
    frameRate(30);
    init();
}

function next_step() {
    if( real_step < step_to_sign ) {
	next_step_ok();
    } else {
	if( App.puzzle.open ) {
	    if( App.accountSigned ) {
		if( step == 2*nstep-3 ) {
		    transacting("claim reward");
		    App.answer(words.join('')).then(()=>{
			next_step_ok();
		    });
		} else {
		    next_step_ok();
		}
	    } else {
		if( real_step == step_to_sign ) {
		    transacting("signing in");
		    App.sign().then((result)=>{
			next_step_ok();
		    });
		} else {
		    step = 0;
		}
	    }
	} else {
	    next_step_ok();
	    console.log("puzzle closed");
	}
    }
}

function transacting(info) {
    transaction_info = info
    waitForTransaction = true;
    xs = [];
    ys = [];
    for(var u = 0; u < 20; u ++ ) {
	xs[u] = random(cx-0.4*cw/2,cx+0.4*cw)
	ys[u] = random(cy-0.4*cw/2,cy+0.4*cw)
    }
    fc = 0;
}

function next_step_ok() {
    step = (step+1)%(2*nstep-1)
    real_step = floor(step/2)
    init();
}

function previous_step() {
    step = (step+2*nstep-2)%(2*nstep-1)
    real_step = floor(step/2)
    init();
}

function mousePressed() {
    if (mouseX > fsshow.x && mouseY > fsshow.y) {
	let fs = fullscreen();
	fullscreen(!fs);
    } else {
	if( step % 2 == 0 ) {
	    if(response) {
		if( mouseX > cx ) {
		    next_step()
		} else {
		    if( step > 0 ) {
			previous_step()
		    }
		}
	    } else {
		previous_step()
		previous_step()
	    }
	} else {
	    keyp = false
	    for(var v = 0; v < fsk.letters_cap.length; v ++ ) {
		if (mouseX > fsk.letters_cap[v].x && mouseX < fsk.letters_cap[v].x+fsk.letters_cap[v].w && mouseY > fsk.letters_cap[v].y && mouseY < fsk.letters_cap[v].y+fsk.letters_cap[v].w) {
		    if( fsk.letters_cap[v].letter == 'X' ) {
			words[real_step] = '';
		    } else {
			words[real_step] = join([words[real_step],fsk.letters_cap[v].letter],'')
		    }
		    fsk.letters_cap[v].color = 220;
		    redraw()
		    keyp = true
		}
	    }
	    if( !keyp ) {
		if( mouseX < cx ) {
		    previous_step()
		} else {
          	    next_step()
		}
	    }
	}
    }
}

class fsButton {
    constructor(r,g,b) {
	this.r = r;
	this.g = g;
	this.b = b;
    }
    setButton() {
	this.a = max(10,min(50,0.1*max(width,height)))
	this.x = width-this.a;
	this.y = height-this.a;
	this.r = 0.8*this.a
    }
}

// keyboard
function init_keyboard() {
    ww = min(height/2,width)
    advice = advices[real_step]
    var letters = ["123","456","789","X0."]
    fsk = new fskeyboard(letters);
    if( words.length <= real_step ) {
	words[real_step] = ''
    }
    frameRate(2);
    redraw();
}

function draw_keyboard() {
    clear()
    blendMode(BLEND);
    noStroke()
    background(100);
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(cw/10);
    text(words[real_step],cx,cy-cw/10)
    textSize(ww/20)
    text(advice,cx,cy-cw/4)
    fsk.display();
}

class fskeyboard {
    constructor(letters) {
	this.letters_cap = []
	var c = 0;
	for(var u = 0; u < letters.length; u ++ ) {
	    for(var v = 0; v < letters[u].length; v ++ ) {
		this.letters_cap[c] = new letter(letters[u].slice(v,v+1),cx-(letters[u].length/2-v)*ww/5,height - (letters.length+1-u)*ww/5,ww/5)
		c++;
	    }
	}
    }
    display = function() {
	for(var v = 0; v < this.letters_cap.length; v ++ ) {
	    this.letters_cap[v].display()
	}
    }
}

class letter {
    constructor(l,x,y,w) {
	this.letter = l;
	this.color = 150;
	this.x = x
	this.y = y
	this.w = w
    }
    display = function() {
	push()
	noStroke()
	fill(this.color)
	square(this.x,this.y,this.w)
	fill(230)
	textAlign(CENTER,CENTER);
        textSize(ww/20);
	text(this.letter,this.x+this.w/2,this.y+this.w/2)
	pop();
	this.color = 150;
    }
}


// init_2
function init_2() {
    frameRate(30);
    hexcodes = codes[real_step].split('&')
    code = new Array(hexcodes[0].length);
    for( var v = 0; v < hexcodes[0].length; v ++ ) {
	code[v] = parseInt(hexcodes[0].slice(v,v+1),16);
    }
    code2 = new Array(hexcodes[1].length);
    for( var v = 0; v < hexcodes[1].length; v ++ ) {
	code2[v] = parseInt(hexcodes[1].slice(v,v+1),16);
    }
    if( step == 0 ) {
	sha256seed = sha256('');
    } else {
	sha256seed = sha256(words[(real_step+nstep-1)%nstep]);
    }
    sha256seed2 = sha256(sha256seed);
    response = false
    if( sha256seed2 == hexcodes[2] ) {
	response = true
    }
    gene = new Array(64);
    for( var v = 0; v < 64; v ++ ) {
	gene[v] = parseInt(sha256seed.slice(v,v+1),16);
	gene[v] = (gene[v]%16+16)%16;
    }
    shape = [];
    shape2 = [];
    shapeV = [];
    for( var u = 0; u < hexcodes[0].length/6; u ++ ) {
	shape[u] = [2*decode2(3*u,code)/256-1,
		    2*decode2(3*u+1,code)/256-1,
		    2*decode2(3*u+2,code)/256-1]
    }
    for( var u = 0; u < hexcodes[1].length/4; u ++ ) {
	shapeV[u] = [decode2(2*u,code2)%shape.length,
		     decode2(2*u+1,code2)%shape.length]
    }
    cw2 = 0.2*cw;
    cw3 = 0.2*cw2;
}

function update_2() {
    yaw = [[ cos(alph),-sin(alph),0],
	   [ sin(alph),cos(alph),0],
	   [ 0,0,1]]
    pitch = [[ cos(beta),0,-sin(beta)],
	     [ 0,1,0],
	     [ sin(beta),0,cos(beta)]]
    roll = [[ 1,0,0],
	    [ 0,cos(gamma),-sin(gamma)],
	    [ 0,sin(gamma),cos(gamma)]]
    shape2 = multiply(shape,multiply(multiply(roll,yaw),pitch));
    for(var u = 0; u < shape2.length; u ++) {
	shape2[u][0] = cx + cw2*(1+0.05*shape2[u][2])*shape2[u][0]
	shape2[u][1] = cy + cw2*(1+0.05*shape2[u][2])*shape2[u][1]
    }
}

function draw_2() {
    clear();
    alph = PI + (frameCount%20234)*TWO_PI/20234;
    beta = (frameCount%1000)*TWO_PI/1000;
    gamma = PI/2+(frameCount%10343)*TWO_PI/10343;
    theta = (frameCount%1517)*TWO_PI/1517;
    update_2();
    blendMode(DARKEST);
    background(100);
    stroke(0);
    strokeWeight(1);
    push()
    for( var u = 0; u < shapeV.length; u ++) {
	stroke(20-20*(shape2[shapeV[u][0]][2]+shape2[shapeV[u][1]][2]));
	line(shape2[shapeV[u][0]][0],shape2[shapeV[u][0]][1],shape2[shapeV[u][1]][0],shape2[shapeV[u][1]][1])
    }
}

// utils
function multiply(a, b) {
    let aRows = a.length;
    let aCols = a[0].length;
    let bCols = b[0].length;
    let result = new Array(aRows); 
    for (let r = 0; r < aRows; ++r) {
        const row = new Array(bCols);
        result[r] = row;
        const ar = a[r];
        for (let c = 0; c < bCols; ++c) {
	    let sum = 0.;     
	    for (let i = 0; i < aCols; ++i) {
                sum += ar[i] * b[i][c];
	    }
	    row[c] = sum;  
        }
    }
    return result;
}

function decode(ig,code) {
    return (((gene[ig%gene.length] + code[ig%code.length])%16+16)%16)/16.0;
}

function decode2(ig,code2) {
    return (((gene[(2*ig)%gene.length]*16 + gene[(2*ig+1)%gene.length] + 16*code2[(2*ig)%code2.length] + code2[(2*ig+1)%code2.length])%256+256)%256);
}

var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j;
    var result = ''
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
	    for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
	    }
	    hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
	    k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    ascii += '\x80'
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00'
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return;
	words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
	var oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
	    var i2 = i + j;
	    var w15 = w[i - 15], w2 = w[i - 2];
	    var a = hash[0], e = hash[4];
	    var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
		    w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                )|0
                  );
	    var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
	    hash = [(temp1 + temp2)|0].concat(hash);
	    hash[4] = (hash[4] + temp1)|0;
        }
        for (i = 0; i < 8; i++) {
	    hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
	    var b = (hash[i]>>(j*8))&255;
	    result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

