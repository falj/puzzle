///////////////////////////////////
//                               //
//   Created on 07/2021          //
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

const advices = ['7 digits','untouchable','half, birth year','7 digits','diabolic order']
const codes = ['',
	       '3e22785c44943ca3f03d9f8d950077def829059672d97ec4221e9d0ec6925d3d7770f1e75bbf798c1b3d9f8de44f462d47dbd348c1a8e127851e9d0ec692c0a01470f14a8d0d2a5a698b505c329dc6ac77dbd317c1a86076543c6bf015c3deef4652a319abbfa90c9a6d9f8eb34f45fc475b549640287ef6d41e6bc0c6c45d6ec67023998d3e79bd9b3d1e0e32cec6dec7dba2c8c1d9&46a3231b5c42fa8e9cc0219168d44ab3cb63d9cf46b1b6fd5af7734b9dcd97794fad2d24684d059ba7cd2b9f71dd53bcd46be1d94fb8be0763fd7b51a7e1a19058c73c33755d12aeaed932af77f35ac8db7be8ed56c2c5166911825dabe3a5925dbe3a38736111a7b3db37b17eea62cae57af4e963ccd31b7a15926abbf0b59d6cd24a42856a22b9c4ec48bf8cfa6edaf28804f571d9dd27821c9a6bc4efb99e70c95240887025b3cce447bc8efb70dbf38b04f0&46a223198f722cbfcef052c1ca35ac132dc16e62db424a90ee8706da2f5e2909e03cbdb3f6d9c659688aec5b319c137a9428&0333122d13df37e3efbde16f72dd31fec520919eb05995a25edb1051552f4e27',
	       '8136e3bb97e88bc79d1bc81aae0c25943a1eb4a00d2b5ba795b8bc2e91eb8cfff34c6633907411a629b2999c54e19640237e5aa663c27cfe1be71da6bd5dfa1779c15fc316519f42f734466fc3957e9cd086ac42871602317b5c4c1a2976838a7254e89fa6f36cc1ae06b02eacea35a61b28d390104c61a4add1bc34b3ee7d1e0231754c746d30960fd49c7870f87653466f63c96ac4981927f042b9b17d1a0088ec4abb49498374030f718da2b3a78de3aeb54eab332541a1864a3a616991ce684a31a28839839bea2f8f5bdfdc57d6264404af4f6987eeb7f00f35bf4b8012624056a597467dcaef11da6ca4338283868fc3f69030ae3794fb4c2cbd6f8c1768547394a38464c14904b7d3b0faeeae67e2daddc24fa44aa904502bd57a71358a248bd86b8dc7923f769eba0dfdfcf44af105c9d7628e66b2e1713ba09d96eeab653bf4c43fdcf5fe85d78c4523a52b5ca73acd96958f28e2ea2e6bbb4ec61d4f98788ef980742c0f23388cd08196c3b28fde197e40d3198d2c2e0cff5d5b696820cea77ade5daf8cfebb05a110058f4df2adbad818746f71c588fb8dc04fecd7114a20455ae26f197f769c19cba6fd0e9912867e7a480ed69f1d69664cc7bf5d920ca7b7138cdfcf31e156d12f67b76e63c9e34f2aa8e37e03ee0bd116682f2a365b6c90604dbb19f4bc9b9905a8873aa39fa79004672857c438df986345ff470b5d886265688e1a0d9493b1e3969e1e87b78e721d4e0d72a626fb835d31e46ef83fb24e488e7901297e80c3cd88a7087dbe7967283afe86931b1a484c77a95b4103a0930c80b5c522b043c0f64ca72f41bca42b226dc37fd1c70ea7f76a0a053561488c6127b50fc9b48467fc8a4f338366a376cd66191dc636ab9b69050174cd5faf2265834a181b4a8eb69491a1ce84c1406f33010c965e29282f617f91733fe9b588ee8ea6a227a11ebeee25a1311cb7af0b257ea687e1bc1fb0ec7f09f8475637964f13b4feb2aa7b51ef8b3b268f579e89c16d2c1bd741a8b068001368c5669b1760703d08103e7bb78b&f2bfe13114e5103b9db03f1a538c273ecc205b3811bc08ac215bc3ae35e80794fec2ed3d1fe71b46a7b149245c8c3047d41f644919c410b42963caad3df00f9c06caf54527ef234eafb9512c6494384fdc276c5121cc18bc316bd3be45f817a40ed2fc442ff72b56b7c159346c9c4057e42f745929d420c43973dbc64d001fac16da055537ff335ebfc9603374a4485fec377c6131dc28cc417be3ce550827b41ee20d5d3f073b66c7d169447cac5067f43f836039e430d44983ebd65d102fbc26ea1565470f436ecfd9714c84b4586ffc478c7141ec38dc518bf2d5651837c42ef21d6d4f174b76d7e179548cbc6077044f947949f440e45993fbe66d203fcc36fa246c571f537edfe9815c94c4687f0c579c8151fc48ec619b03ee752847d43e022d7d5f275b86e7f1885b9ccc7087145fa489590450f469a30bf67d304fdc460a3585672f638eeff9916ca4d4788f1c67ab88610c58fc71ab13fe853857e44e123d8d6f376b96f7019974acdc8097246fb4996914600479b31afd8d405fec561a4595773f739eff09a17cb4e4889f2c77bca1711c680c81bb230e954867f45e224c947f477ba60711a984bcec90a7347fc4a97924701489c32b169d506ffc662a55a5874f83ae0f19b083c4f498af3c87ccb1812c781c91cb331ea55877046e325dad8f578bb61721b994ccfca0b7448fd3b08934802499d33b26ad607f0c763a65b5975f93be1f29c19cd404a8bf4c97dcc1913c882ca1db4225b56887147e426dbd9f679bc62731c9a4dc0cb0c7549fe4c999449034a9e34b36bd708f1c864a74bca76fa3ce2f39d1ace414b8cf5ca7ecd1a14c983cb1eb533ec57897248e527dcdaf77abd63741d8abec1cc0d764aff4d9a954a044b9f35b46cd809f2c965a85d5b77fb3de3f49e1bcf424c8df6cb7fbd8b15ca84cc1fb634ed588a7349e628dddbf87bbe64751e9c4fc2cd0e774bf04e9b964b054c9036a4ddd90af3ca66a95e5c78fc3ee4f59f1cc0434d8ef7cc70cf1c16cb85cd10b735ee598b744ae729ce4cf97cbf65761f9d40c3ce0f784cf14f9c974c064d9137b66eda0bf4cb67aa5f5d79fd3fe5f6900d31444e8ff8cd71c01d17cc86ce11b836ef5a8c754be82adfddfa7db06677109e41c4cf00794df2300d984d074e9238b76fdb0cf5cc68ab505e7afe30e6f7911ec2454f80f9ce72c11e18cd87cf12b927505b8d764ce92bd0defb7eb16778119f42c5c0017a4ef3419e994e084f9339b860dc0df6cd69ac40cf7bff31e7f8921fc3464081facf73c21f19ce88c013ba38e15c8e774dea2cd1dffc7fb26879128fb3c6c1027b4ff4429f9a4f0940943ab961dd0ef7ce6aad52507cf032e8f99310c4474182fbc074b28fcbcf6a80a5bafaa1ce8f190e3c2d53902e7fc3d&&596d0d10cc300725edcf033798921c925e48075b689465c4ec536145b63436b0',
	       'b6aef307422fc280aea2bd9802a57e1d33920c41e64f282ecaae329f94a9d3e41e2f50aa5910c2553b73090c36070b22de06fcf66771dbaef90bb2d1872aad&9f24742d67b2435530f83a1eb74e00aa811b860072fee8bd891cc4649a3d4105b334&&24e06a4e446d021f80036b52d58381228e3746ed1822f4694ed8e1429771ec3b',
	       'fafff1d23557e4f8ef4f3bfb03b0cb8484233a1d44cb731ba4f904c32732f9506005ca6b6ebe4a3295e875956ae9a41ecd8da467ed49bd99073cbb3a7ea25c74037ceeef9e150176d858bea50d46b4a206cd58b441d5f6d9a789fbdaa3f610ad4321fa1b57352d30f89873d961d2d4e2a60198554d29abf9e7152006432f3c4e7c48c86892da6656b1e59993860da21be68da480ed49d6990755bb3a98a25c8e037c08ef9e2f0176f158bebe0d46cda206e658b45bd5f6f3a78915daa31010ad5c21fa3457354630f8b173d97bd2d4fca601b2554d43abf90015201f432f554e7c61c868acda6670b1e5b3938627a21b8d0ca1276c657d1904fc3b563e2159348298ae6f9bd5819298f1a265a649743bea8df1b7016eda99408cbb7387b6a9b01c87f7f4bd510696f571d9f53b38d1bc0c1d72bb4a031115c09504dfc33215cd6021476b6c5a4a3031e873126ae7211e0c0aa1a66a65fc35047b5756be1f59b480982e8b9b559d9231d5a2fe8a490d3eea26f4b79a52da32248c5476874facb0&fa0091d435bce5fc90543e5f06b66e8c88893f24e9d37a83a6fca6c729a5fc22030c9bdd3fc6ef089b5c486a11bf799494954b30f4e0858faf08b0d033af062e0e14a5e84acffa10a76854761ccc84a09da15539feea8f9bba10badb3eb811361a20b1f455dc051cb0745e7f26d68eaca8a95f4409f39aa3c61cc6e749c51c42232cbbfd5fe60f28bb7c688a31df99b4b4b56b501400a5afcf28d0f053cf264e2e34c5086aef1a30c78874963ceca4c0bdc175591e0aafbbda30dafb5ed831563a40d11475fc253cd0947e9f46f6aeccc8c97f642913bac3e63ce60769e53c62434cdb1d7f062f48db9c88aa51ffb9d4d4d58b703420c5cfef48f01073ef466e4e54e5288a0f3a50e7a894b65c0cc4e0dde195793e2acfdbfa50fa1b7ef851765a60f134951c455cf0b49ebf6616ceece8e99f844933dae3065c062789055c82636cfb3d9f264f68fbbca8ca711fd9f4f4f5ab905440e5ef0f681030930f668e6e740548aa2f5a7007c8b4d67c2ce400fd01b5995e4aeffb1a701a3b9e187196&&6cbb389bde0c942584a6e508952b20ecc98ba69aa00fe5b3fe14cfc8367acc71',
	      '79978c683e079e4b42139837506c0972f4bacb80ed1390d6bccb88e3b24d46dae6567b23aea92c3714ef08fa17dbba76df2db338d7387b6a15b35114&7a1cffb99c7ea0d2d865f8d1af7880103f352b8e87b2dd74b10b03b23fcc3c1c84260ac5a787abdde37202dab9828b1c4a3e369992abe77dbb150eaa&&4de1ee9efc006a434ac1cd02ce2b34b55a6db11fdd828c2d30655547ab70fe98']

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
	if(step == 0 ) {
	    init_0()
	} else {
	    init_2()
	}
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
	    if(step == 0 ) {
		draw_0()
	    } else {
		draw_2()
	    }
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

// 0
function init_0() {
    response = true
    frameRate(30)
    cw2 = 0.4*cw;
    N = 8;
    grid = []
    for(var u = 0; u < N; u ++ ) {
	grid[u] = []
	for(var v = 0; v < N; v ++ ) {
	    grid[u][v] = 0;
	}
    }
    grid[3][2] = 1;
    grid[4][3] = 1;
    grid[2][4] = 1;
    grid[3][4] = 1;
    grid[4][4] = 1;
    shape = []
    shapeV = []
    for(var u = 0; u < N; u ++ ) {
	for(var v = 0; v < N; v ++ ) {
	    if( grid[u][v] == 1 ) {
		shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N-0.8/(2*N),-0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N-0.8/(2*N),0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N+0.8/(2*N),-0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N+0.8/(2*N),0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N-0.8/(2*N),-0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N-0.8/(2*N),0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N+0.8/(2*N),-0.8/(2*N)]
		shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N+0.8/(2*N),0.8/(2*N)]
		shapeV[shapeV.length] = [shape.length-8,shape.length-7]
		shapeV[shapeV.length] = [shape.length-8,shape.length-6]
		shapeV[shapeV.length] = [shape.length-8,shape.length-4]
		shapeV[shapeV.length] = [shape.length-7,shape.length-5]
		shapeV[shapeV.length] = [shape.length-7,shape.length-3]
		shapeV[shapeV.length] = [shape.length-6,shape.length-5]
		shapeV[shapeV.length] = [shape.length-6,shape.length-2]
		shapeV[shapeV.length] = [shape.length-5,shape.length-1]
		shapeV[shapeV.length] = [shape.length-4,shape.length-3]
		shapeV[shapeV.length] = [shape.length-4,shape.length-2]
		shapeV[shapeV.length] = [shape.length-3,shape.length-1]
		shapeV[shapeV.length] = [shape.length-2,shape.length-1]
	    }
	}
    }
}

function update_0() {
    if( frameCount%20 == 0 ) {
	shape = []
	shapeV = []
	grid2 = []
	for(var u = 0; u < N; u ++ ) {
	    grid2[u] = []
	    for(var v = 0; v < N; v ++ ) {
		grid2[u][v] = 0
		neigbour = 0
		neigbour += grid[(u+N-1)%N][(v+N-1)%N]
		neigbour += grid[(u+N-1)%N][(v+N)%N]
		neigbour += grid[(u+N-1)%N][(v+N+1)%N]
		neigbour += grid[(u+N)%N][(v+N-1)%N]
		neigbour += grid[(u+N)%N][(v+N+1)%N]
		neigbour += grid[(u+N+1)%N][(v+N-1)%N]
		neigbour += grid[(u+N+1)%N][(v+N)%N]
		neigbour += grid[(u+N+1)%N][(v+N+1)%N]
		if( grid[u][v] == 1 ) {
		    if((neigbour == 2)|(neigbour==3)) {
			grid2[u][v] = 1
		    }
		} else {
		    if( neigbour == 3) {
			grid2[u][v] = 1
		    }
		}
	    }
	}
	for(var u = 0; u < N; u ++ ) {
	    for(var v = 0; v < N; v ++ ) {
		grid[u][v] = grid2[u][v]
    		if( grid[u][v] == 1 ) {
		    shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N-0.8/(2*N),-0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N-0.8/(2*N),0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N+0.8/(2*N),-0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N-0.8/(2*N),(v-N/2)/N+0.8/(2*N),0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N-0.8/(2*N),-0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N-0.8/(2*N),0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N+0.8/(2*N),-0.8/(2*N)]
		    shape[shape.length] = [(u-N/2)/N+0.8/(2*N),(v-N/2)/N+0.8/(2*N),0.8/(2*N)]
		    shapeV[shapeV.length] = [shape.length-8,shape.length-7]
		    shapeV[shapeV.length] = [shape.length-8,shape.length-6]
		    shapeV[shapeV.length] = [shape.length-8,shape.length-4]
		    shapeV[shapeV.length] = [shape.length-7,shape.length-5]
		    shapeV[shapeV.length] = [shape.length-7,shape.length-3]
		    shapeV[shapeV.length] = [shape.length-6,shape.length-5]
		    shapeV[shapeV.length] = [shape.length-6,shape.length-2]
		    shapeV[shapeV.length] = [shape.length-5,shape.length-1]
		    shapeV[shapeV.length] = [shape.length-4,shape.length-3]
		    shapeV[shapeV.length] = [shape.length-4,shape.length-2]
		    shapeV[shapeV.length] = [shape.length-3,shape.length-1]
		    shapeV[shapeV.length] = [shape.length-2,shape.length-1]
		}
	    }
	}
    }
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
  	shape2[u][0] = cx + (1+0.05*shape2[u][2])*shape2[u][0]* cw2
  	shape2[u][1] = cy + (1+0.05*shape2[u][2])*shape2[u][1]* cw2
    }
}

function draw_0() {
    clear();
    alph = (frameCount%20234)*TWO_PI/20234;
    beta = (frameCount%1000)*TWO_PI/1000;
    gamma = (frameCount%10343)*TWO_PI/10343;
    update_0();
    blendMode(DARKEST);
    background(100);
    stroke(0);
    strokeWeight(1);
    push()
    for( var u = 0; u < shapeV.length; u ++) {
    	stroke(20-20*(shape2[shapeV[u][0]][2]+shape2[shapeV[u][1]][2]));
    	line(shape2[shapeV[u][0]][0],shape2[shapeV[u][0]][1],shape2[shapeV[u][1]][0],shape2[shapeV[u][1]][1])
    }
    pop()
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
    code3 = new Array(hexcodes[2].length);
    for( var v = 0; v < hexcodes[2].length; v ++ ) {
	code3[v] = parseInt(hexcodes[2].slice(v,v+1),16);
    }
    sha256seed = sha256(words[(real_step+nstep-1)%nstep]);
    sha256seed2 = sha256(sha256seed);
    response = false
    if( sha256seed2 == hexcodes[3] ) {
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
    ix = [];
    for( var u = 0; u < hexcodes[0].length/6; u ++ ) {
	shape[u] = [2*decode2(3*u,code)/256-1,
		    2*decode2(3*u+1,code)/256-1,
		    2*decode2(3*u+2,code)/256-1]
    }
    for( var u = 0; u < hexcodes[1].length/4; u ++ ) {
	shapeV[u] = [decode2(2*u,code2)%shape.length,
		     decode2(2*u+1,code2)%shape.length]
    }
    for( var u = 0; u < hexcodes[2].length; u ++ ) {
	ix[u] = decode2(u,code3)*TWO_PI/256
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
	if( ix.length > 0 ) {
	    shape2[u][0] = cx + cw2*cos(theta+ix[u]) + (1+0.05*shape2[u][2])*shape2[u][0]* cw3
	    shape2[u][1] = cy + cw2*sin(theta+ix[u]) + (1+0.05*shape2[u][2])*shape2[u][1]* cw3
	} else {
	    shape2[u][0] = cx + cw2*(1+0.05*shape2[u][2])*shape2[u][0]
	    shape2[u][1] = cy + cw2*(1+0.05*shape2[u][2])*shape2[u][1]
	}
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

