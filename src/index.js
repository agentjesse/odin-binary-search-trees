/* Next task:
- makeTree needs to return the level-0 tree root node to its caller, the getTreeFromArr fn. build tree fully into level-0 node before returning it
*/

//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, objectToString as ots } from './logger.js'; //shorthand loggers

const makeNode = (data, left = null, right = null)=> ( { data, left, right } );

//this fn takes a sorted array and makes a parent node from the middle element. as it is recursively calling itself with a sub array (start to mid, mid to end), eventually a base condition should be reached to return null instead of a node.
const makeTree = (cleanArr)=> {
  lg(cleanArr); //debugging
  //base case below might be wrong, check....
  if ( !Array.isArray(cleanArr) ) return null;
  //make parent node from array's middle element. Math.floor is optional
  const midIndex = Math.floor( cleanArr.length / 2 );
  const root = makeNode( cleanArr[midIndex] );
  //make parent node's left subtree root...might need to check for existence
  root.left = makeTree(  );

  return root;
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
//---prettyPrint fn example ... or use JSON.stringify with '\t'
const testTree = {
  data: 4,
  left: {
    data: 2,
    left: { data: 1, left: null, right: null },
    right: { data: 3, left: null, right: null },
  },
  right: null,
};
// prettyPrint(testTree);

//testing
// const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testArr = [3, 1, 2];
lg( `level-0 tree root:\n${ ots( getTreeFromArr( testArr ) ) }` );
