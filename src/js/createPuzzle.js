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
    contractAddress:"0xA6FcF3B78E97d7f86ADF8927232a20EC589a68cD",
    chainId : 4,

    init: async function() {
	return await App.initWeb3();
    },
    
    initWeb3: async function() {
	web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    	return App.initContract();
    },

    initContract: function() {
	$.getJSON('json/Puzzles-abi.json', function(data) {
    	    var PuzzleABI = data;
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
	document.getElementById("btn-check").style.display='none';;
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
	    return App.puzzleInstance.puzzleIsChecked(puzzleId);
	}).then(function(result) {
	    if( result ) {
		return App.puzzleInstance.getPuzzleMoreInfo(puzzleId);
	    } else {
		document.getElementById("responseInput").removeAttribute("readonly");
		document.getElementById("btn-check").style.display='block';
		return [-1];
	    }
	}).then(function(result) {
	    if(result !=-1) {
		$( "#cutInput" ).val(result[0]);
		$( "#minfeeInput" ).val(ethers.utils.formatEther(result[1]));
		$( "#rewardInput" ).val(ethers.utils.formatEther(result[2]));
		$( "#puzzleCheckInput" ).val("true");
	    }
	    document.getElementById("puzzleIdInput").removeAttribute("readonly");

	    document.getElementById("responseInput").removeAttribute("readonly");
	    document.getElementById("btn-check").style.display='block';

	    $('#transactionModal').modal('hide');
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
	$( "#puzzleCheckInput" ).val("");
	document.getElementById("nameInput").removeAttribute("readonly");
	document.getElementById("descriptionInput").removeAttribute("readonly");
	document.getElementById("linkInput").removeAttribute("readonly");
	document.getElementById("rewardInput").removeAttribute("readonly");
	document.getElementById("cutInput").removeAttribute("readonly");
	document.getElementById("minfeeInput").removeAttribute("readonly");
	document.getElementById("hashInput").removeAttribute("readonly");
	document.getElementById("btn-create").style.display='block';
	$( "#creatorInput" ).val(App.account);
    },

    handleCreatePuzzle: function() {
	App.signer = web3Provider.getSigner();
	App.puzzleInstanceSigned = App.puzzleInstance.connect(App.signer);
	document.getElementById("nameInput").setAttribute("readonly",true);
	document.getElementById("descriptionInput").setAttribute("readonly",true);
	document.getElementById("linkInput").setAttribute("readonly",true);
	document.getElementById("rewardInput").setAttribute("readonly",true);
	document.getElementById("cutInput").setAttribute("readonly",true);
	document.getElementById("minfeeInput").setAttribute("readonly",true);
	document.getElementById("hashInput").setAttribute("readonly",true);
	
	var name = document.getElementById("nameInput").value;
	var description = document.getElementById("descriptionInput").value;
	var link = document.getElementById("linkInput").value;
	var reward = document.getElementById("rewardInput").value;
	var cut = document.getElementById("cutInput").value;
	var minfee = document.getElementById("minfeeInput").value;
	var responseHash = document.getElementById("hashInput").value;
	$('#transactionModal').modal('show');
	App.puzzleInstanceSigned.createPuzzle(cut,ethers.utils.parseEther(minfee), responseHash,name,link,description,{value:ethers.utils.parseEther(reward)}).then(function(tx) {
	    return tx.wait();
	}).then((receipt)=>{
	    return App.puzzleInstance.getPuzzlesNumber();
	}).then(function(result) {
		document.getElementById("responseInput").removeAttribute("readonly");
		console.log(result.toNumber());
		$("#puzzleIdInput").val(result.toNumber()-1);
	    return App.getDetails();
	}).catch(function(error) {
	    $('#transactionModal').modal('hide');
	    alert('transaction aborted : '+error.error.message);
	});
    },

    handleCheckPuzzle: function() {
	App.signer = web3Provider.getSigner();
	App.puzzleInstanceSigned = App.puzzleInstance.connect(App.signer);
	document.getElementById("responseInput").setAttribute("readonly",true);
	var response = document.getElementById("responseInput").value;
	var puzzleId = document.getElementById("puzzleIdInput").value;
	$('#transactionModal').modal('show');
	App.puzzleInstanceSigned.checkPuzzle(puzzleId,ethers.utils.toUtf8Bytes(response)).then(function(tx) {
	    return tx.wait();
	}).then((receipt)=>{
	    return App.getDetails();
	}).catch(function(error) {
	    $('#transactionModal').modal('hide');
	    alert('transaction aborted : '+error.error.message);
	});
    }
};


$(function() {
    $(window).load(function() {
	App.init();
    });
});
