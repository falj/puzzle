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
    puzzleInstance:null,
    contractAddress:"0xA6FcF3B78E97d7f86ADF8927232a20EC589a68cD",

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
	    App.list();
	});
    },

    fillTemplate:function(u) {
	var id = u;
	var puzzlesRow = $('#puzzlesRow');
	var puzzleTemplate = document.querySelector('#puzzleTemplate');
	var clone = document.importNode(puzzleTemplate.content, true);
	App.puzzleInstance.puzzleIsChecked(u).then(function(result) {
	    if( result ) {
		App.puzzleInstance.getPuzzleInfo(u).then(function(result) {
		    clone.querySelector('.puzzle-id').textContent=id;
		    clone.querySelector('.panel-title').textContent = result[1];
		    clone.querySelector('.puzzle-creator').textContent = result[0];
		    clone.querySelector('.puzzle-link-href').setAttribute("href",result[2]+"/index.html");
		    clone.querySelector('.puzzle-img').setAttribute("src",result[2]+"/cover.png");
		    clone.querySelector('.puzzle-description').textContent = result[4];
		    var date = new Date(result[3][0] * 1000);
		    clone.querySelector('.puzzle-creationDate').textContent = date.toLocaleDateString("en-US");
		    if( result[3][1] == 0 ) {
	    		clone.querySelector('.puzzle-endDate').textContent = "open";
			
		    } else {
	    		var enddate = new Date(result[3][1] * 1000);
	    		clone.querySelector('.puzzle-endDate').textContent = "won on " + enddate.toLocaleDateString("en-US");
		    }
		    App.puzzleInstance.getPuzzleMoreInfo(id).then(function(result) {
	    		clone.querySelector('.puzzle-cut').textContent = result[0].toNumber()+"%";
	    		clone.querySelector('.puzzle-minFee').textContent = ethers.utils.formatEther(result[1])+"Ξ";
	    		clone.querySelector('.puzzle-reward').textContent = ethers.utils.formatEther(result[2])+"Ξ";
			clone.querySelector('.puzzle-nplayers').textContent = result[3];
			puzzlesRow.append(clone);
		    });
		});
	    }
	});
    },
    
    list: function() {
	var puzzlesRow = $('#puzzlesRow');
	var puzzleTemplate = document.querySelector('#puzzleTemplate');
	
	document.getElementById("contract-address").innerHTML = App.contractAddress;
	return App.puzzleInstance.getPuzzlesNumber().then( function(number) {
	    for( var u = number-1; u >= 0; u -- ) {
		App.fillTemplate(u);
	    }
	});
    },
};

$(function() {
    $(window).load(function() {
	App.init();
    });
});
