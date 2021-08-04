///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

const Puzzles = artifacts.require("Puzzles");

contract("Puzzles", (accounts) => {

    it("should create a puzzle", () => {
	let puzzle;
	const account_one = accounts[0];
	const account_two = accounts[1];
	console.log(account_one);
	return Puzzles.deployed()
	    .then(instance => {
		console.log(web3.version)
		puzzle = instance;
		return puzzle.createPuzzle(10,web3.utils.toWei('0.1', 'ether'), "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08","puzzleName","http://link","@description",{from:account_one,value:web3.utils.toWei('1', 'ether'),gas:250000});
	    })
	    .then(() => {
		return puzzle.getPuzzlesNumber();
	    })
	    .then(result => {
		assert(result,1,"1 puzzle");
		return puzzle.puzzleIsChecked(0);
	    })
	    .then(result => {
		assert.equal( result,false,"puzzle not checked");
		return puzzle.getPuzzleInfo(0);
	    })
	    .then(result => {
		assert.equal( result[0],account_one,"puzzle creator");
		assert.equal( result[1],"puzzleName","name");
		assert.equal( result[2],"http://link","link");
		assert.equal( result[3][1].toNumber(),0,"puzzle on");
		assert.equal( result[4],"@description","description");
		return puzzle.checkPuzzle(0,web3.utils.asciiToHex("test"),{from:account_one});
	    })
	    .then(result => {
		assert(result,true,"checked puzzle");
		return puzzle.puzzleIsChecked(0);
	    })
	    .then(result => {
		assert.equal( result,true,"puzzle checked");
		return puzzle.getPuzzleInfo(0);
	    })
	    .then(result => {
		assert.equal( result[0],account_one,"puzzle creator");
		assert.equal( result[1],"puzzleName","name");
		assert.equal( result[2],"http://link","link");
		assert.equal( result[3][1].toNumber(),0,"puzzle on");
		assert.equal( result[4],"@description","description");
		return puzzle.getPuzzleMoreInfo(0);
	    })
	    .then(result => {
		assert.equal( result[0].toNumber(),10,"puzzle cut");
		assert.equal( result[1],web3.utils.toWei('0.1', 'ether'),"min fee");
		assert.equal( result[2],web3.utils.toWei('1', 'ether'),"reward");
		return web3.eth.getBalance(puzzle.address);
	    })
	    .then((balance) => {
		assert.equal( balance,1e18);
	    });
    });

    it("should create a puzzle and account entering the puzzle", () => {
    	let puzzle;
    	let account_two_balance;
    	let account_one_balance;
	let fee;
    	const account_one = accounts[0];
    	const account_two = accounts[1];
    	return Puzzles.deployed()
    	    .then(instance => {
    		puzzle = instance;
    	    	return web3.eth.getBalance(account_one);
    	    })
    	    .then((balance) => {
    		account_one_balance = balance;
    	    	return web3.eth.getBalance(account_two);
    	    })
    	    .then((balance) => {
    		account_two_balance = balance;
    		return puzzle.createPuzzle(10,web3.utils.toWei('0.1', 'ether'), "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08","puzzleName","http://link2","@description2 obsession",{from:account_one,value:web3.utils.toWei('1', 'ether')});
    	    })
    	    .then(() => {
    		return web3.eth.getBalance(puzzle.address);
    	    })
    	    .then((balance) => {
    		assert.equal( balance,web3.utils.toWei('2', 'ether'));
		return puzzle.getPuzzlesNumber();
	    })
	    .then(result => {
		assert(result,2,"2 puzzles");
		return puzzle.checkPuzzle(1,web3.utils.asciiToHex("test"),{from:account_one});
	    })
	    .then(result => {
		assert(result,true,"puzzle checked");
		return puzzle.puzzleIsChecked(1);
	    })
	    .then(result => {
		assert.equal( result,true,"puzzle checked");
		return puzzle.getPuzzleInfo(1);
	    })
	    .then(result => {
		assert.equal( result[0],account_one,"puzzle creator");
		assert.equal( result[1],"puzzleName","name");
		assert.equal( result[2],"http://link2","link");
		assert.equal( result[3][1].toNumber(),0,"puzzle on");
		assert.equal( result[4],"@description2 obsession","description");
		return puzzle.getPuzzleMoreInfo(1);
    	    })
    	    .then(result => {
		fee = result[1];
    		assert.equal( result[0].toNumber(),10,"puzzle cut");
    		assert.equal( result[1],web3.utils.toWei('0.1', 'ether'),"min fee");
    		assert.equal( result[2],web3.utils.toWei('1', 'ether'),"reward");
		return puzzle.getLastPuzzleByCreator(account_one);
    	    })
	    .then(result => {
		assert.equal( result.toNumber(),1,"puzzles");
    		return puzzle.signForPuzzle(1,{from:account_two,value:fee});
    	    })
    	    .then(result => {
    		return puzzle.isSigned(account_two,1);
    	    })
    	    .then(result => {
    		assert.equal( result,true,"account-two signed");
		return puzzle.getPuzzleInfo(1);
	    })
	    .then(result => {
		assert.equal( result[3][1].toNumber(),0,"puzzle on");
    		return puzzle.getPuzzleMoreInfo(1);
    	    })
    	    .then(result => {
    		assert.equal( result[0].toNumber(),10,"puzzle cut");
    		assert.equal( result[1],web3.utils.toWei('0.1', 'ether'),"min fee");
    		assert.equal( result[2],web3.utils.toWei('1.1', 'ether'),"reward");
    		return web3.eth.getBalance(puzzle.address);
    	    })
    	    .then((balance) => {
    		assert.equal( balance,2.1e18);
    		return web3.eth.getBalance(account_two);
    	    })
    	    .then((balance) => {
    		console.log("after signing, b2 : ",(balance - account_two_balance)/1e18);
    	    })
    	    .then(() => {
    		return puzzle.isSigned(account_two,1);
    	    })
    	    .then(result => {
    		assert.equal( result,true,"account-two signed");
    	    })
    	    .then(() => {
    		return puzzle.claimPuzzle(1,web3.utils.asciiToHex("test"),{from:account_two,gas:500000});
    	    })
    	    .then( (result) => {
    	    	return web3.eth.getBalance(account_two);
    	    })
    	    .then((balance) => {
    		console.log("after claiming b2 : ",(balance - account_two_balance)/1e18);
    	    	return puzzle.getPuzzleInfo(1);
	    })
	    .then(result => {
		assert.equal( result[3][1].toNumber()>0,true,"puzzle off");
	    })
    	    .then(() => {
    		return puzzle.getPuzzleMoreInfo(1);
    	    })
    	    .then(result => {
    		assert.equal( result[0].toNumber(),10,"puzzle cut");
    		assert.equal( result[1],web3.utils.toWei('0.1', 'ether'),"min fee");
    		assert.equal( result[2],web3.utils.toWei('1.1', 'ether'),"reward");
    		assert.equal( result[3].toNumber(),1,"n players");
    		assert.equal( result[4],web3.utils.toWei('0.11', 'ether'),"creatorcut");
    		assert.equal( result[5],web3.utils.toWei('0.99', 'ether'),"finalreward");
    	    })
    	    .then(() => {
    		return puzzle.getPuzzleWinner(1);
    	    })
    	    .then(result => {
    		assert.equal( result,account_two,"winner");
    		return web3.eth.getBalance(puzzle.address);
    	    })
    	    .then((balance) => {
    		assert.equal( balance,1e18);
    		return web3.eth.getBalance(account_two);
    	    })
    	    .then((balance) => {
    		console.log("account 2 history");
		console.log(balance/1e18);
    		console.log((account_two_balance)/1e18);
    		console.log((balance - account_two_balance)/1e18);
    		return web3.eth.getBalance(account_one);
    	    })
    	    .then((balance) => {
    		console.log("account 1 history");
		console.log(balance/1e18);
    		console.log(account_one_balance/1e18);
    		console.log((balance - account_one_balance)/1e18);
    	    })
    });
});

