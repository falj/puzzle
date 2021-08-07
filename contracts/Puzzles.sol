///////////////////////////////////
//                               //
//   Created on 08/2021          //
//   @author: falj               //
//   @site: mathgames.falj.net   //
//                               //
///////////////////////////////////

pragma solidity ^0.5.16;

contract Puzzles {

  struct Puzzle {
    string name;
    address payable creator;
    uint[6] number_info; //[cut(0-100),min_fee,reward,n_players,creator_cut,final_reward];
    mapping(address => bool) players;
    bytes32 hash_response;
    address payable winner;
    uint[2] timestamps;
    string link;
    string description;
  }

  address public owner;
  mapping(uint => Puzzle) public puzzles ;
  uint public puzzle_number;

  event PuzzleEnded(uint _id, address winner);
  event PuzzleOpen(uint _id);
  
  modifier puzzleExists(uint _id) {
    require( _id < puzzle_number, "no puzzle" );
    _;
  }

  modifier puzzleOpen(uint _id) {
    require( puzzles[_id].timestamps[1] == 0, "puzzle open" );
    _;
  }

  modifier puzzleClosed(uint _id) {
    require( puzzles[_id].timestamps[1] != 0, "puzzle closed" );
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'only owner');
    _;
  }
  
  constructor() public {
    owner = msg.sender;    
  }

  function createPuzzle(uint _cut,uint _min_fee, bytes32 _hash_response, string memory _name, string memory _link, string memory _description) public payable returns (uint) {
    require(msg.value > 0,"reward positive");
    require(_cut < 100);
    require(_cut >= 0);
    puzzles[puzzle_number].creator = msg.sender;
    puzzles[puzzle_number].number_info[0] = _cut;
    puzzles[puzzle_number].number_info[1] = _min_fee;
    puzzles[puzzle_number].number_info[2] = msg.value;
    puzzles[puzzle_number].hash_response = _hash_response;
    puzzles[puzzle_number].name = _name;
    puzzles[puzzle_number].timestamps[0] = block.timestamp;
    puzzles[puzzle_number].link = _link;
    puzzles[puzzle_number].description = _description;
    emit PuzzleOpen(puzzle_number);
    puzzle_number ++;
    return puzzle_number-1;
  }

  function signForPuzzle(uint _id) public payable puzzleExists(_id) puzzleOpen(_id)  {
    require( msg.value >= puzzles[_id].number_info[1], "Minimum entry fee required" );
    require( msg.sender != puzzles[_id].creator, "creator not entering");
    puzzles[_id].number_info[2] += msg.value;
    puzzles[_id].players[msg.sender] = true;
    puzzles[_id].number_info[3] ++;
  }

  function claimPuzzle(uint _id, bytes memory _response ) public payable puzzleExists(_id) puzzleOpen(_id) returns (bool) {
    require(puzzles[_id].players[msg.sender],"sender not in competition");
    bytes32 hash = sha256(_response);
    if( hash == puzzles[_id].hash_response ) {
      puzzles[_id].number_info[4] = puzzles[_id].number_info[0]*puzzles[_id].number_info[2]/100;
      puzzles[_id].number_info[5] = puzzles[_id].number_info[2] - puzzles[_id].number_info[4];
      puzzles[_id].creator.transfer(puzzles[_id].number_info[4]);
      puzzles[_id].winner = msg.sender;
      puzzles[_id].winner.transfer(puzzles[_id].number_info[5]);
      puzzles[_id].timestamps[1] = block.timestamp;
      emit PuzzleEnded(_id,puzzles[_id].winner);
      return true;
    }
    return false;
  }

  function isSigned(address _address, uint _id) public puzzleExists(_id) view returns (bool) {
    return puzzles[_id].players[_address];
  }

  function getPuzzleInfo( uint _id ) public puzzleExists(_id) view returns( address,
									    string memory,
									    string memory,
									    uint[2] memory,
									    string memory ) {
    return ( puzzles[_id].creator,
  	     puzzles[_id].name,
	     puzzles[_id].link,
	     puzzles[_id].timestamps,
	     puzzles[_id].description);
  }
  
  function getPuzzleMoreInfo(uint _id) public puzzleExists(_id) view returns(uint[6] memory) {
    return puzzles[_id].number_info;
  }
  function getPuzzleWinner(uint _id) public puzzleExists(_id) puzzleClosed(_id) view returns(address ) {
    return puzzles[_id].winner;
  }

  function getPuzzlesNumber() public  view returns( uint ) {
    return puzzle_number;
  }

  function getLastPuzzleByCreator(address _address) public view returns(uint) {
    uint x = puzzle_number-1;
    uint result=puzzle_number;
    while((x >= 0) && (result == puzzle_number))
      {
  	if( puzzles[x].creator == _address ) {
  	  result = x;
  	}
  	x--;
      }
    return result;
  }
}
