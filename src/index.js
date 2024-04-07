/* Next task:
- makeTree needs to return the level-0 tree root node to its caller, the getTreeFromArr fn. build tree fully into level-0 node before returning it
*/

//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, objectToString as ots } from './logger.js'; //shorthand loggers

const makeNode = (data, left = null, right = null)=> ( { data, left, right } );

//this fn takes a sorted array and makes a parent node from the middle element. as it is recursively calling itself with a sub array (start to mid, mid to end), eventually a base condition should be reached to return null instead of a node.
const makeTree = (arr)=> {
  //base case uses slice() functionality:  Passing start / end indexes that do not
  //select anything (like 0,0 or just a start index greater than array length) to the
  //slice method of an empty array [] selects nothing and returns an empty array.
  if (!arr.length) return null;
  // lg(arr); //debugging

  //make parent node from array's middle element. Math.floor used for clarity
  const midIndex = Math.floor( arr.length / 2 );
  const root = makeNode( arr[midIndex] );
  //make left subtree of parent node
  root.left = makeTree( arr.slice(0, midIndex) );
  //make right subtree of parent node
  root.right = makeTree( arr.slice(midIndex + 1) );
  return root; //all done? return to last call, maybe it was recursive
};

//fn to clean array and return tree root node
const getTreeFromArr = (dirtyArr)=> {
  const cleanArr = dirtyArr.sort( (a, b)=> a - b ) //sort array
    //remove dupes. Filter skips keeping current value it's equal to next one
    .filter( (currentVal, currentIndex)=> !( currentVal === dirtyArr[currentIndex + 1] ) );
  return makeTree( cleanArr );
};

//fn to print a binary tree from Odin. Provide root node, optional prefix like \n
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  node.right !== null && prettyPrint(node.right,`${prefix}${isLeft ? '│  ' : '   '}`,false);
  lg(`${prefix}${isLeft ? '└─ ' : '┌─ '}${node.data}`);
  node.left !== null && prettyPrint(node.left,`${prefix}${isLeft ? '   ' : '│  '}`,true);
};

//testing
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// const testArr = [3, 1, 2];
// lg( `level-0 tree root:\n${ ots( getTreeFromArr( testArr ) ) }` );
prettyPrint( getTreeFromArr( testArr ) );
