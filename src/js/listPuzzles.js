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
    contractAddress:"",
    chainId : 4,
    puzzles : [],
    
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
	    return App.getPuzzles();
	}).then(()=> {
	    App.list();
	});
    },

    puzzleInfo: async function (u) {
	var tmppuzzle = {
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
	};
	
    	App.puzzleInstance.getPuzzleInfo(u).then((result)=>{
    	    tmppuzzle.creator = result[0];
    	    tmppuzzle.name = result[1];
    	    tmppuzzle.description = result[4];
    	    tmppuzzle.link = result[2];
    	    tmppuzzle.creation = result[3][0];
    	    tmppuzzle.end = result[3][1];
    	    return (result[3][1].toNumber()==0);
    	}).then( (open) => {
    	    tmppuzzle.open=open;
    	    return App.puzzleInstance.getPuzzleMoreInfo(u);
    	}).then(function(result) {
    	    tmppuzzle.nplayers = result[3].toNumber();
    	    if(tmppuzzle.open) {
		var cut = result[0].toNumber();
    		tmppuzzle.cut = result[2]*cut/100;
    		tmppuzzle.minFee = result[1];
    		tmppuzzle.reward = result[2]-tmppuzzle.cut;
		return "";
    	    } else {
    		tmppuzzle.creatorCut = result[4];
    		tmppuzzle.finalReward = result[5];
    		return App.puzzleInstance.getPuzzleWinner(u);
    	    }		    
    	}).then( function(result) {
    	    tmppuzzle.winner = result;
	    App.puzzles[u] = tmppuzzle;
	    App.fillTemplate(u);
	    App.sort();
	    return;
    	});
    },

    fillTemplate:function(u) {
	console.log(u);
	var puzzlesRow = $('#puzzlesRow');
	var puzzleTemplate = document.querySelector('#puzzleTemplate');
	var clone = document.importNode(puzzleTemplate.content, true);
	clone.querySelector('.template-panel').setAttribute("id",u);
	clone.querySelector('.puzzle-id').textContent=u;
	clone.querySelector('.panel-title').textContent = App.puzzles[u].name;
	clone.querySelector('.puzzle-creator').textContent = App.puzzles[u].creator;
	clone.querySelector('.puzzle-link-href').setAttribute("href",App.puzzles[u].link+"/index.html");
	clone.querySelector('.puzzle-img').setAttribute("src",App.puzzles[u].link+"/cover.png");
	clone.querySelector('.puzzle-description').textContent = App.puzzles[u].description;
	var date = new Date(App.puzzles[u].creation * 1000);
	clone.querySelector('.puzzle-creationDate').textContent = date.toLocaleDateString("en-US");
	if( App.puzzles[u].end == 0 ) {
	    clone.querySelector('.winInfo').style.display = 'none';
	    clone.querySelector('.rewardInfo').style.display = 'block';
	    clone.querySelector('.puzzle-endDate').textContent = "open";
	    clone.querySelector('.puzzle-cut').textContent = ethers.utils.formatEther(App.puzzles[u].cut)+"Ξ";
	    clone.querySelector('.puzzle-minFee').textContent = ethers.utils.formatEther(App.puzzles[u].minFee)+"Ξ";
	    clone.querySelector('.puzzle-reward').textContent = ethers.utils.formatEther(App.puzzles[u].reward)+"Ξ";
	} else {
	    clone.querySelector('.winInfo').style.display = 'block';
	    clone.querySelector('.rewardInfo').style.display = 'none';
	    var enddate = new Date(App.puzzles[u].end * 1000);
	    clone.querySelector('.puzzle-endDate').textContent = "won on " + enddate.toLocaleDateString("en-US");
	    clone.querySelector('.puzzle-creatorCut').textContent = ethers.utils.formatEther(App.puzzles[u].creatorCut)+"Ξ";
    	    clone.querySelector('.puzzle-finalReward').textContent = ethers.utils.formatEther(App.puzzles[u].finalReward)+"Ξ";

	}
	clone.querySelector('.puzzle-nplayers').textContent = App.puzzles[u].nplayers;
	puzzlesRow.append(clone);
	
    },

    getPuzzles:function() {
	return App.puzzleInstance.getPuzzlesNumber().then( function(number) {
	    for( var u = number-1; u >= 0; u -- ) {
		App.puzzleInfo(u);
	    }
	});
    },
    
    list: function() {
	var puzzlesRow = $('#puzzlesRow');
	var puzzleTemplate = document.querySelector('#puzzleTemplate');
	
	document.getElementById("contract-address").innerHTML = App.contractAddress;
	return App.puzzleInstance.getPuzzlesNumber().then( function(number) {
	    for( var u = 0; u < App.puzzles.length; u ++ ) {
		App.fillTemplate(u);
	    }
	});
    },
    
    filter: function() {
	input = document.getElementById("filterInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("puzzlesRow");
	tr = table.getElementsByClassName("panel-puzzle");
	for (i = 0; i < tr.length; i++) {
	    var disp = false;
	    td = tr[i].getElementsByClassName("puzzle-creator")[0];
	    if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		    disp = true;
		}
	    }
	    td = tr[i].getElementsByClassName("panel-title")[0];
	    if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		    disp = true;
		}
	    }
	    td = tr[i].getElementsByClassName("puzzle-description")[0];
	    if (td) {
		txtValue = td.textContent || td.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		    disp = true;
		}
	    }
	    if( disp ) {
		tr[i].style.display = "block";
	    } else {
		tr[i].style.display = "none";
	    }
	}
    },

    removeFilter: function() {
	$( "#filterInput" ).val('');
	App.filter();
    },

    sort: function() {
	var list, i, switching, b, shouldSwitch;
	list = document.getElementById("puzzlesRow");
	switching = true;
	/* Make a loop that will continue until
	   no switching has been done: */
	while (switching) {
	    // start by saying: no switching is done:
	    switching = false;
	    b = list.getElementsByClassName("panel-puzzle");
	    var c = [];
	    for (i = 0; i < b.length; i++) {
		c[i] = parseInt(b[i].getElementsByClassName("puzzle-id")[0].innerText)
	    }
	    // Loop through all list-items:
	    for (i = 0; i < (c.length - 1); i++) {
		// start by saying there should be no switching:
		shouldSwitch = false;
		/* check if the next item should
		   switch place with the current item: */
		if (c[i] < c[i + 1]) {
		    /* if next item is alphabetically
		       lower than current item, mark as a switch
		       and break the loop: */
		    shouldSwitch = true;
		    break;
		}
	    }
	    if (shouldSwitch) {
		/* If a switch has been marked, make the switch
		   and mark the switch as done: */
		console.log(i,i+1);
		b[i].parentNode.insertBefore(b[i + 1], b[i]);
		switching = true;
	    }
	}
    }

    
};

$(function() {
    $(window).load(function() {
	App.init();
    });
});
