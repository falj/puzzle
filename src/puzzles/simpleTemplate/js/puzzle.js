///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

App = {
    // To change with your actual puzzle id
    puzzleId:0,

    web3Provider: null,
    contracts: {},
    account : "",
    signer: null,
    puzzleInstance:null,
    puzzleInstanceSigned:null,
    accountSigned:false,
    contractAddress:"",
    chainId : 4,
    
    puzzle :{
    	open:false,
    	creator: null,
    	name: null,
    	description: null,
    	creation: null,
    	end: null,
    	link: null,
    	cut: "",
    	minFee: "",
    	reward: "",
    	nplayers: null,
    	winner: null,
	creatorCut:"",
	finalReward:"",
    },

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
	    return App.puzzleInfo();
    	})
    	return App.getAccount();
    },

    getAccount: function () {
    	window.ethereum.request({ method: 'eth_accounts' }).then( function(result) {
    	    accounts = result;
	    App.signer = web3Provider.getSigner();
	    App.account = accounts[0];
	    App.reloadAccount();
    	    window.ethereum.on('accountsChanged', function (result) {
    		accounts = result;
    		App.account = accounts[0];
		App.signer = web3Provider.getSigner();
	    	alert('account changed\nnow connected with '+App.account);
		App.reloadAccount();
    	    });
    	});
    },
    
    puzzleInfo: function () {
    	App.puzzleInstance.getPuzzleInfo(App.puzzleId).then((result)=>{
    	    App.puzzle.creator = result[0];
    	    App.puzzle.name = result[1];
    	    App.puzzle.description = result[4];
    	    App.puzzle.link = result[2];
    	    App.puzzle.creation = result[3][0];
    	    App.puzzle.end = result[3][1];
    	    return (result[3][1].toNumber()==0);
    	}).then( (open) => {
    	    App.puzzle.open=open;
    	    return App.puzzleInstance.getPuzzleMoreInfo(App.puzzleId);
    	}).then(function(result) {
    	    if(result[0] !=-1) {
    		App.puzzle.nplayers = result[3].toNumber();
    		if(App.puzzle.open) {
    		    App.puzzle.minFee = result[1];
    		    App.puzzle.reward = result[2];
		    return "";
    		} else {
    		    App.puzzle.creatorCut = result[4];
    		    App.puzzle.finalReward = result[5];
    		    return App.puzzleInstance.getPuzzleWinner(App.puzzleId);
    		}		    
    	    }
    	}).then( function(result) {
    	    App.puzzle.winner = result;
    	    if( App.puzzle.open ) {
    		return App.puzzleInstance.isSigned(App.account,App.puzzleId);
    	    } else {
    		return false;
    	    }
    	}).then( function(result) {
    	    App.accountSigned = result;
    	    App.show();
    	});
    },

    reloadAccount: function() {
    	App.puzzleInstanceSigned = App.puzzleInstance.connect(App.signer);
	App.puzzleInstance.isSigned(App.account,App.puzzleId).then( function(result) {
    	    App.accountSigned = result;
    	    App.show();
    	});
    },

    sign: function() {
	App.puzzleInstanceSigned.signForPuzzle(App.puzzleId,{from:App.account, value:App.puzzle.minFee}).then((tx) =>{
	    return tx.wait();
	}).then((receipt)=>{
	    return App.puzzleInfo();
    	}).then(function() {
    	    App.show();
    	}).catch(function(error) {
	    console.log(error);
	    alert('transaction aborted : '+error.error.message);
	});
    },

    answer: function() {
    	var answer0 = document.getElementById("answerInput").value;
    	App.puzzleInstanceSigned.claimPuzzle(App.puzzleId,ethers.utils.toUtf8Bytes(answer0),{from:App.account}).then((tx)=>{
	    return tx.wait();
	}).then((receipt)=>{
    	    return App.puzzleInfo();
    	}).then( function() {
    	    App.show();
    	}).catch(function(error) {
	    alert('transaction aborted : '+error.error.message);
	});
    },
    
    show: function() {
    	document.getElementById("account_title").innerHTML = App.account;
    	document.getElementById("puzzle-winning").innerHTML = "";

    	// contract address
    	document.getElementById("contract-address").innerHTML = App.contractAddress;
	
    	// show puzzle infos
    	document.getElementById('puzzle-id').innerHTML = App.puzzleId;
    	document.getElementById('panel-title').innerHTML = App.puzzle.name;
    	document.getElementById('puzzle-creator').innerHTML = App.puzzle.creator;
    	document.getElementById('puzzle-link-href').setAttribute("href",App.puzzle.link+"/index.html");
    	document.getElementById('puzzle-img').setAttribute("src","cover.png");
    	document.getElementById('puzzle-description').innerHTML = App.puzzle.description;
    	var date = new Date(App.puzzle.creation * 1000);
    	document.getElementById('puzzle-creationDate').innerHTML = date.toLocaleDateString("en-US");
    	if( App.puzzle.end == 0 ) {
    	    document.getElementById('winInfo').style.display = 'none';
    	    document.getElementById('rewardInfo').style.display = 'block';
    	    document.getElementById('puzzle-endDate').innerHTML = "open";
    	    document.getElementById('puzzle-cut').innerHTML = App.puzzle.cut+"%";
    	    document.getElementById('puzzle-minFee').innerHTML = ethers.utils.formatEther(App.puzzle.minFee)+"Ξ";
    	    document.getElementById('puzzle-reward').innerHTML = ethers.utils.formatEther(App.puzzle.reward)+"Ξ";
    	} else {
    	    document.getElementById('winInfo').style.display = 'block';
    	    document.getElementById('rewardInfo').style.display = 'none';
    	    var enddate = new Date(App.puzzle.end * 1000);
    	    document.getElementById('puzzle-endDate').innerHTML = "won on " + enddate.toLocaleDateString("en-US") + " by "+App.puzzle.winner ;
    	    document.getElementById('puzzle-creatorCut').innerHTML = ethers.utils.formatEther(App.puzzle.creatorCut)+"Ξ";
    	    document.getElementById('puzzle-finalReward').innerHTML = ethers.utils.formatEther(App.puzzle.finalReward)+"Ξ";
    	}
    	document.getElementById('puzzle-nplayers').innerHTML = App.puzzle.nplayers;

    	// handling puzzle and account status 
    	document.getElementById("btn-sign").style.display='none';
    	document.getElementById("answer-div").style.display='none';
    	if( App.puzzle.creator.toLowerCase() == App.account.toLowerCase() ) {
    	    document.getElementById("puzzle-winning").innerHTML = "You created this Puzzle !";
    	} else {
	    
    	    if( App.puzzle.open ) {
    		if( App.accountSigned ) {
    		    document.getElementById("btn-sign").style.display='none';
    		    document.getElementById("answer-div").style.display='block';
    		} else {
    		    document.getElementById("btn-sign").style.display='block';
    		    document.getElementById("answer-div").style.display='none';
    		}
    		document.getElementById("puzzle-status").innerHTML = "puzzle is open";
    	    } else {
    		document.getElementById("puzzle-status").innerHTML = "puzzle is closed";
    		if( App.puzzle.winner.toLowerCase() == App.account.toLowerCase() ) {
    		    document.getElementById("puzzle-winning").innerHTML = "You won this Puzzle !";
    		}
    	    }
    	}
    },
};


$(function() {
    $(window).load(function() {
	App.init();
    });
});
