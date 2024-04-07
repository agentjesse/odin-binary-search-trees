/* Next task:
- makeTreeMidNode needs to return the level-0 tree root node to its caller, the getTreeFromArr fn. build tree fully from objects attached to root node before returning it
*/

//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, tableToConsole as tb } from './logger.js'; //shorthand loggers

const makeNode = (data, left = null, right = null)=> ({ data, left, right });

const makeTreeMidNode = (cleanArr)=> {
  if ( !Array.isArray(cleanArr) ) return null;
  lg(cleanArr);

  return 'testData, return level-0 tree root to getTreeFromArr fn...';
};

//fn to clean array and return tree root node
const getTreeFromArr = (dirtyArr)=> {
  const cleanArr = dirtyArr.sort( (a, b)=> a - b ) //sort array
    //remove dupes. Filter skips keeping current value it's equal to next one
    .filter( (currentVal, currentIndex)=> !( currentVal === dirtyArr[currentIndex + 1] ) );
  return makeTreeMidNode( cleanArr );
};

//fn to print a binary tree from Odin. Provide root node, optional prefix like \n
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  node.right !== null && prettyPrint(node.right,`${prefix}${isLeft ? '│  ' : '   '}`,false);
  lg(`${prefix}${isLeft ? '└─ ' : '┌─ '}${node.data}`);
  node.left !== null && prettyPrint(node.left,`${prefix}${isLeft ? '   ' : '│  '}`,true);
};
//---prettyPrint fn example
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
const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
lg( getTreeFromArr( testArr ) );
