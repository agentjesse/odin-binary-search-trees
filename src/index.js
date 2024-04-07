/* Next task:
- add levelOrder(callback) function to traverse bst in level order AND provide each node as an argument to the callback to do something.
Return an array of values if no callback provided.
*/

//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, objectToString as ots } from './logger.js'; //shorthand loggers

const makeNode = (data, left = null, right = null)=> ( { data, left, right } );

//fn takes a processed (sorted/dupes cleaned) array and returns the level-0 root node
//of the BST it makes
const makeTree = (processedArr)=> {
  //base case uses slice() functionality:  Passing start / end indexes that do not
  //select anything (like 0,0 or just a start index greater than array length) to the
  //slice method of an empty array [] selects nothing and returns an empty array.
  if (!processedArr.length) return null;
  // lg(processedArr); //debugging

  //make parent node from array's middle element. Math.floor used for clarity
  const midIndex = Math.floor( processedArr.length / 2 );
  const root = makeNode( processedArr[midIndex] );
  //make left subtree of parent node
  root.left = makeTree( processedArr.slice(0, midIndex) );
  //make right subtree of parent node
  root.right = makeTree( processedArr.slice(midIndex + 1) );
  return root; //all done? return to last call, maybe it was recursive
};

//fn to process a raw (unsorted/duplicates) array for BST creation
const processArr = (rawArr)=> (
  rawArr.sort( (a, b)=> a - b ) //sort array
  //remove dupes. Filter skips keeping current value it's equal to next one
    .filter( (currentVal, currentIndex)=> !(currentVal === rawArr[currentIndex + 1]) )
);

//fn to print a binary tree. Provide level-0 root node, optional prefix like \n
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  node.right !== null && prettyPrint(node.right,`${prefix}${isLeft ? '│  ' : '   '}`,false);
  lg(`${prefix}${isLeft ? '└─ ' : '┌─ '}${node.data}`);
  node.left !== null && prettyPrint(node.left,`${prefix}${isLeft ? '   ' : '│  '}`,true);
};

//fn to wrap a BST with management methods. Pass in a BST level-0 root node
const makeManagedBST = (level0RootNode)=> {
  //management fns
  const levelOrder = (cb)=> {
    
  };

  return {
    level0RootNode,
    prettyPrintBSD: ()=> prettyPrint(level0RootNode),
  };
};

//testing
// const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testArr = [3, 1, 2];
//managed Binary Search Tree via wrapper
const pureBST = makeTree( processArr( testArr ) );
const managedBST = makeManagedBST( pureBST );
managedBST.prettyPrintBSD();
