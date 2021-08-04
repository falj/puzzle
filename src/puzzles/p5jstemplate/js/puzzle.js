///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

App = {
    // To change with your actual puzzle id
    puzzleId:7,

    web3Provider: null,
    contracts: {},
    account : "",
    signer: null,
    puzzleInstance:null,
    puzzleInstanceSigned:null,
    accountSigned:false,
    accountIsWinner:true,
    contractAddress:"0xA6FcF3B78E97d7f86ADF8927232a20EC589a68cD",
    chainId : 4,
    
    puzzle :{
    	open:false,
    	creator: null,
    	name: null,
    	description: null,
    	creation: null,
    	end: null,
    	link: null,
    	checked: false,
    	cut: "",
    	minFee: "",
    	reward: "",
    	nplayers: null,
    	winner: "",
	creatorCut:"",
	finalReward:"",
    },

    init: async function() {
	if (typeof window.ethereum == 'undefined') {
	    alert('consider installing metamask');
	} else {
	    return await App.initWeb3();
	}
    },
    
    initWeb3: async function() {
	web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    	return App.initContract();
    },
    
    initContract: function() {
    	$.getJSON('json/Puzzles-abi.json', function(data) {
    	    var PuzzleABI = data;
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
    	    return App.puzzleInstance.puzzleIsChecked(App.puzzleId);
    	}).then(function(result) {
    	    App.puzzle.checked = result;
    	    if( App.puzzle.checked ) {
    		return App.puzzleInstance.getPuzzleMoreInfo(App.puzzleId);
    	    } else {
    		return [-1];
    	    }
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
	    if( App.puzzle.winner.toLowerCase() == App.account.toLowerCase() ) {
		App.accountIsWinner = true;
	    }
    	    if( App.puzzle.checked & App.puzzle.open ) {
    		return App.puzzleInstance.isSigned(App.account,App.puzzleId);
    	    } else {
    		return false;
    	    }
    	}).then( function(result) {
    	    App.accountSigned = result;
    	});
    },

    reloadAccount: function() {
	if( App.puzzle.winner.toLowerCase() == App.account.toLowerCase() ) {
	    App.accountIsWinner = true;
	}
    	App.puzzleInstanceSigned = App.puzzleInstance.connect(App.signer);
	App.puzzleInstance.isSigned(App.account,App.puzzleId).then( function(result) {
    	    App.accountSigned = result;
    	});
    },

    sign: function() {
	return App.puzzleInstanceSigned.signForPuzzle(App.puzzleId,{from:App.account, value:App.puzzle.minFee}).then((tx) =>{
	    return tx.wait();
	}).then((receipt)=>{
	    return App.puzzleInfo();
	}).catch(function(error) {
	    console.log(error);
	    alert('transaction aborted : '+error.error.message);
	    return false;
	});
    },

    answer: function(answer0) {
    	return App.puzzleInstanceSigned.claimPuzzle(App.puzzleId,ethers.utils.toUtf8Bytes(answer0),{from:App.account}).then((tx)=>{
	    return tx.wait();
	}).then((receipt)=>{
    	    return App.puzzleInfo();
    	}).catch(function(error) {
	    console.log(error);
	    alert('transaction aborted : '+error.error.message);
	    return false;
	});
    },
    
};


$(function() {
    $(window).load(function() {
	App.init();
    });
});
