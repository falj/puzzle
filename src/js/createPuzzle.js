///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

App = {
    web3Provider: null,
    contracts: {},
    account : "",
    signer: null,
    puzzleInstance:null,
    puzzleInstanceSigned:null,
    contractAddress:"",
    chainId : 4,

    init: async function() {
	if (typeof window.ethereum == 'undefined') {
	    alert('consider installing metamask or start your crypto wallet');
	} else {
	    return await App.initWeb3();
	}
    },
    
    initWeb3: async function() {
	web3Provider = new ethers.providers.Web3Provider(window.ethereum)
	ethereum.on('chainChanged', (_chainId) => window.location.reload());
	web3Provider.getNetwork().then(cid=>{
	    if(cid.chainId == App.chainId) {
    		return App.initContract();
	    } else {
		alert('please change network to Rinkeby');
	    }
	});
    },

    initContract: function() {
	$.getJSON('json/Puzzles.json', function(data) {
    	    var PuzzleABI = data['abi'];
    	    App.contractAddress = data['networks']['4']['address'];
    	    App.puzzleInstance = new ethers.Contract(App.contractAddress, PuzzleABI, web3Provider);
    	    return App.getAccount();
    	})
    },

    getAccount: function () {
    	window.ethereum.request({ method: 'eth_accounts' }).then( function(result) {
    	    accounts = result;
	    App.signer = web3Provider.getSigner();
	    App.account = accounts[0];
	    App.show();
	    window.ethereum.on('accountsChanged', function (result) {
    		accounts = result;
    		App.account = accounts[0];
		App.signer = web3Provider.getSigner();
	    	alert('account changed\nnow connected with '+App.account);
		App.show();
    	    });
    	});
    },
    
    show: function() {
	document.getElementById("account_title").innerHTML = App.account;
	document.getElementById("btn-hash").style.display='none';
	document.getElementById("btn-create").style.display='none';
    },

    getDetails: function() {
	var puzzleId = document.getElementById("puzzleIdInput").value;
	document.getElementById("puzzleIdInput").setAttribute("readonly",true);
	$('#transactionModal').modal('show');
	App.puzzleInstance.getPuzzleInfo(puzzleId).then(function(result) {
	    $( "#creatorInput" ).val(result[0]);
	    $( "#nameInput" ).val(result[1]);
	    $( "#descriptionInput" ).val(result[4]);
	    $( "#linkInput" ).val(result[2]);
	    return App.puzzleInstance.getPuzzleMoreInfo(puzzleId);
	}).then(function(result) {
	    if(result !=-1) {
		$( "#cutInput" ).val(result[0]);
		$( "#minfeeInput" ).val(ethers.utils.formatEther(result[1]));
		$( "#rewardInput" ).val(ethers.utils.formatEther(result[2]));
	    }
	    document.getElementById("puzzleIdInput").removeAttribute("readonly");

	    document.getElementById("answerInput").removeAttribute("readonly");

	    $('#transactionModal').modal('hide');
	}).catch(function(error) {
	    $('#transactionModal').modal('hide');
	    console.log(error);
	    alert('transaction aborted : '+error.error.message);
	});
    },

    createNewPuzzle:function() {
	$("#puzzleIdInput").val('');
	$("#nameInput").val('');
	$("#descriptionInput").val('');
	$("#linkInput").val('');
	$("#rewardInput").val('');
	$("#cutInput").val('');
	$("#minfeeInput").val('');
	$("#hashInput").val('');
	document.getElementById("nameInput").removeAttribute("readonly");
	document.getElementById("descriptionInput").removeAttribute("readonly");
	document.getElementById("linkInput").removeAttribute("readonly");
	document.getElementById("rewardInput").removeAttribute("readonly");
	document.getElementById("cutInput").removeAttribute("readonly");
	document.getElementById("minfeeInput").removeAttribute("readonly");
	document.getElementById("hashInput").removeAttribute("readonly");
	document.getElementById("answerInput").removeAttribute("readonly");
	document.getElementById("btn-create").style.display='block';
	document.getElementById("btn-hash").style.display='block';
	$( "#creatorInput" ).val(App.account);
    },

    handleCreatePuzzle: function() {
	App.handleHashPuzzle();
	App.signer = web3Provider.getSigner();
	App.puzzleInstanceSigned = App.puzzleInstance.connect(App.signer);
	document.getElementById("nameInput").setAttribute("readonly",true);
	document.getElementById("descriptionInput").setAttribute("readonly",true);
	document.getElementById("linkInput").setAttribute("readonly",true);
	document.getElementById("rewardInput").setAttribute("readonly",true);
	document.getElementById("cutInput").setAttribute("readonly",true);
	document.getElementById("minfeeInput").setAttribute("readonly",true);
	document.getElementById("hashInput").setAttribute("readonly",true);
	document.getElementById("answerInput").setAttribute("readonly",true);
	
	var name = document.getElementById("nameInput").value;
	var description = document.getElementById("descriptionInput").value;
	var link = document.getElementById("linkInput").value;
	var reward = document.getElementById("rewardInput").value;
	var cut = document.getElementById("cutInput").value;
	var minfee = document.getElementById("minfeeInput").value;
	var answerHash = document.getElementById("hashInput").value;
	$('#transactionModal').modal('show');
	App.puzzleInstanceSigned.createPuzzle(cut,ethers.utils.parseEther(minfee), answerHash,name,link,description,{value:ethers.utils.parseEther(reward)}).then(function(tx) {
	    return tx.wait();
	}).then((receipt)=>{
	    return App.puzzleInstance.getPuzzlesNumber();
	}).then(function(result) {
	    document.getElementById("answerInput").removeAttribute("readonly");
	    console.log(result.toNumber());
	    $("#puzzleIdInput").val(result.toNumber()-1);
	    return App.getDetails();
	}).catch(function(error) {
	    $('#transactionModal').modal('hide');
	    console.log(error);
	    alert('transaction aborted : '+error.error.message);
	});
    },

    handleHashPuzzle: function() {
	var answer = document.getElementById("answerInput").value;
	if( answer == '' ) {
	    document.getElementById("hashInput").removeAttribute("readonly");
	} else {
	    var hash = '0x'+sha256(answer);
	    $("#hashInput").val(hash);
	    document.getElementById("hashInput").setAttribute("readonly",true);
	}
    },

    
};

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




$(function() {
    $(window).load(function() {
	App.init();
    });
});
