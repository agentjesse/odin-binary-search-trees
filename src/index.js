/* Next task:
*/

//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, objectToString as ots } from './logger.js'; //shorthand loggers
import makeQueue from './queue.js';

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

//fn to take a raw (unsorted/duplicates) array, process it, and return processed array
//for BST creation
const processArr = (rawArr)=> (
  rawArr.sort( (a, b)=> a - b ) //sort array
  //remove dupes. Filter skips keeping current value if it's equal to next one
    .filter( (currentVal, currentIndex)=> !(currentVal === rawArr[currentIndex + 1]) )
);

//fn to print a binary tree. Provide level-0 root node, optional prefix like \n
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  node.right !== null && prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  lg(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  node.left !== null && prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

//fn to wrap a BST with management methods. Pass in a BST's level-0 root node
const makeManagedBST = (level0RootNode)=> {
  //management fns
  //fn to traverse BST in level order and return an array of each visited node's
  //data, or to invoke a callback for each node
  const levelOrder = (callback = null)=> {
    const q = makeQueue(); //make queue
    q.enqueue( level0RootNode ); //enqueue level-0 root node
    const result = []; //empty array for results
    //while q size > 0: dequeue node, read its data, enqueue its children
    while ( q.getSize() ) {
      //dequeue() returns queue node's data, which is a BST node in this case
      const dequeuedNode = q.dequeue();
      //use data, enqueue existing children
      if (callback) { //callback exists? invoke it with data
        callback( dequeuedNode.data );
      } else { //no callback? save data
        result.push( dequeuedNode.data );
      }
      if (dequeuedNode.left) q.enqueue( dequeuedNode.left );
      if (dequeuedNode.right) q.enqueue( dequeuedNode.right );
    }
    if (!callback) return result; //no callback? return result[]
  };

  //fn to traverse BST in preorder and return an array of each visited node's
  //data, or to invoke a callback for each node
  const preOrder = (callback = null)=> {
    const result = []; //empty array for results
    //recursive fn for traversal
    const traverseFrom = (node = level0RootNode)=> {
      if (!node) return; //base case, expected a node but got null
      //use data
      if (callback) { //callback exists? invoke it with data
        callback( node.data );
      } else { //no callback? save data
        result.push( node.data );
      }
      //traverse to left child recursively
      traverseFrom( node.left );
      //traverse to right child recursively
      traverseFrom( node.right );
    };
    traverseFrom();//start recursive traversal
    if (!callback) return result; //no callback? return result[]
  };

  //fn to traverse BST in inorder and return an array of each visited node's
  //data, or to invoke a callback for each node
  const inOrder = (callback = null)=> {
    const result = []; //empty array for results
    //recursive fn for traversal
    const traverseFrom = (node = level0RootNode)=> {
      if (!node) return; //base case, expected a node but got null
      //traverse to left child recursively
      traverseFrom( node.left );
      //use data
      if (callback) { //callback exists? invoke it with data
        callback( node.data );
      } else { //no callback? save data
        result.push( node.data );
      }
      //traverse to right child recursively
      traverseFrom( node.right );
    };
    traverseFrom(); //start recursive traversal
    if (!callback) return result; //no callback? return result[]
  };

  //fn to traverse BST in postorder and return an array of each visited node's
  //data, or to invoke a callback for each node
  const postOrder = (callback = null)=> {
    const result = []; //empty array for results
    //recursive fn for traversal
    const traverseFrom = (node = level0RootNode)=> {
      if (!node) return; //base case, expected a node but got null
      //traverse to left child recursively
      traverseFrom( node.left );
      //traverse to right child recursively
      traverseFrom( node.right );
      //use data
      if (callback) { //callback exists? invoke it with data
        callback( node.data );
      } else { //no callback? save data
        result.push( node.data );
      }
    };
    traverseFrom();//start recursive traversal
    if (!callback) return result; //no callback? return result[]
  };

  //fn to find node in BST from data. Returns node if found or null if not.
  const findNode = (data)=> {
    //recursively check children if not in parent
    const checkAndTraverse = (node = level0RootNode)=> {
      //return node if it's null (data not in tree) or its data matches.
      if (!node || node.data === data) return node;
      //if data is less than this node's data
      if (data < node.data) return checkAndTraverse(node.left);
      //if data greater
      return checkAndTraverse(node.right);
    };
    return checkAndTraverse();//start recursive traversal
  };

  //fn to return depth of a node or -1 if not found. pass in the node's data
  const getNodeDepth = (data)=> {
    //initialize depth return value. return depth > 0 if node is in tree
    let depth = -1;
    //traverse tree until node found and increment depth
    const traverseForDepth = (node = level0RootNode)=> {
      //edge case: fn called with null, meaning data is not in tree
      if (!node) {
        depth = -1;
        return;
      }
      depth++; //increment depth when visiting
      //traverse into tree for depth increments
      if (data < node.data) {
        traverseForDepth(node.left);
      } else if (data > node.data) {
        traverseForDepth(node.right);
      } //if the data matches, this fn now returns control to it's caller
    };
    traverseForDepth(); //start recursive traversal
    return depth;
  };

  //fn to return height of a node, or -1 if not found. pass in node itself.
  //node depth finding algorithm: Base case is to return -1 when called with an
  //empty tree. Calculate heights of the left and right subtrees recursively
  //(divide & conquer). Return height is: 1 + the max of the subtree heights.
  const heightOfNode = (node)=> {
    if (!node) return -1; //base case. eventually handles single node trees
    return 1 + Math.max( heightOfNode(node.left), heightOfNode(node.right) );
  };

  //fn to return true/false if tree is balanced.
  //recursive fn: Base case returns true when fn is called with an empty tree as it's
  //balanced by definition. Calculate heights of left/right subtrees to check if their
  //heights differ by max of 1. check both subtrees themselves are balanced and make
  //recursive calls to check all trees within them are too. Return false if condition
  //checks fail. The approach of this fn is postorder.
  const isBalanced = (node = level0RootNode)=> {
    if (!node) return true;
    //tri-conditional: max subtree height difference of 1, recursive subtree balance checks
    if ( Math.abs( heightOfNode(node.left) - heightOfNode(node.right) ) <= 1
      && isBalanced(node.left)
      && isBalanced(node.right) ) return true;
    //return false at this point, tree is not balanced.
    return false;
  };

  //fn to insert data node into BST
  const insertData = (data)=> {
    //recursive fn to check node's data against new data and decide where/if to insert.
    const traverseAndInsert = (node = level0RootNode)=> {
      //edge case: if this fn was called with a null node, return a new node to
      //use for assignment to previous calls node's subtree
      if (!node) return makeNode(data);
      //if insertion data less than node data: set data in left subtree. do a
      //recursive call with left node and wait for it to return:
      if (data < node.data) node.left = traverseAndInsert(node.left);
      //if insertion data greater than node data: set data in right subtree. do a
      //recursive call with right node and wait for it to return:
      if (data > node.data) node.right = traverseAndInsert(node.right);
      //double edge case: return the current node to the caller as it is expecting
      //a subtree. also, if this line is reached due to insertion data matching this
      //node's data, return the unchanged node.
      return node;
    };
    traverseAndInsert(); //start recursive traversal
  };

  //fn to delete node with matching data from BST
  const deleteData = (data)=> {
    //traversal fn. returns modified tree, even if just null node.
    const traverseAndDelete = (node = level0RootNode)=> {
      //base: if this fn is called with a null node, return it for subtree assignment.
      if (!node) return node;
      //compare delete data to node data, then do a recursive call with the appropriate
      //subtree to modify it.
      if (data < node.data) {
        node.left = traverseAndDelete( node.left );
      } else if (data > node.data) {
        node.right = traverseAndDelete( node.right );
      } else {
        //this conditional is reached when the node's data matches delete data.
        //delete nodes of one or no children by returning their subtree. a null
        //subtree is returned for nodes with no children, effectively deleting the node.
        if (!node.left) {
          return node.right;
        } else if (!node.right) {
          return node.left;
        } else {
          //delete nodes with two children by replacing the node's data with the smallest data in the right subtree.
          let tempNode = node.right;
          while (tempNode.left) { //get to the smallest data node
            tempNode = tempNode.left;
          }
          node.data = tempNode.data; //copy value
          //delete the smallest data node from right subtree
          data = tempNode.data; //set new delete data for recursive deletion of tempNode
          node.right = traverseAndDelete(node.right);
        }
      }
      //return modified subtree
      return node;
    };
    traverseAndDelete(); //start recursive traversal
  };

  //fn to rebalance the BST: Make new tree from inorder traversal array
  const rebalance = ()=> { level0RootNode = makeTree( inOrder() ); };

  return {
    level0RootNode,
    prettyPrintBSD: ()=> prettyPrint(level0RootNode),
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    findNode,
    insertData,
    deleteData,
    getNodeDepth,
    heightOfNode,
    isBalanced,
    rebalance
  };
};

//-driver script-
( ()=>{
  //make raw array of random numbers from interval: [0, 100]
  const randomArr = Array.from({ length: 15 }, ()=> Math.floor( Math.random() * 101 ));
  // lg( processArr(randomArr) ); //debug
  //make managed BST from processed array
  const managedBST = makeManagedBST( makeTree( processArr(randomArr) ) );

  //log tree, confirm it's balanced
  managedBST.prettyPrintBSD();
  lg( `tree balanced: ${ managedBST.isBalanced() }` );

  //print out all elements in level, preorder, inorder, postorder
  lg( 'level-order, preorder, inorder, postorder arrays(respectively):' );
  lg( managedBST.levelOrder() );
  lg( managedBST.preOrder() );
  lg( managedBST.inOrder() );
  lg( managedBST.postOrder() );

  //insert some (exact amount may decrease after processing the array) random numbers from interval: [101, 200] into BST to unbalance it:
  const randomArr2 = processArr( Array.from({ length: 5 }, ()=> Math.floor( 101 + Math.random() * 100 )) );
  randomArr2.forEach( (data)=> managedBST.insertData( data ) );
  //log tree, confirm it's unbalanced
  managedBST.prettyPrintBSD();
  lg( `tree balanced: ${ managedBST.isBalanced() }` );

  //balance tree, log it, confirm it's balanced
  managedBST.rebalance();
  managedBST.prettyPrintBSD();
  lg( `tree balanced: ${ managedBST.isBalanced() }` );

  //print out all elements in level, preorder, inorder, postorder
  lg( 'level-order, preorder, inorder, postorder arrays(respectively):' );
  lg( managedBST.levelOrder() );
  lg( managedBST.preOrder() );
  lg( managedBST.inOrder() );
  lg( managedBST.postOrder() );

} )();

//---------------------------Testing and Usage----------------------------------
// const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// const testArr = [3, 1, 2];
// const testArr = [2];

//interact with the BST via a management fn wrapper
// const baseBST = makeTree( processArr( testArr ) );
// const managedBST = makeManagedBST( baseBST );
//** to print/view the bst, run this method from the wrapper:
// managedBST.prettyPrintBSD();

//level order traversal returns node array, or invokes optional callback
// lg( managedBST.levelOrder() );
// lg( managedBST.levelOrder(lg) );

//preorder traversal returns node array, or invokes optional callback
// lg( managedBST.preOrder() );
// lg( managedBST.preOrder(lg) );

//inorder traversal returns node array, or invokes optional callback
// lg( managedBST.inOrder() );
// lg( managedBST.inOrder(lg) );

//postorder traversal returns node array, or invokes optional callback
// lg( managedBST.postOrder() );
// lg( managedBST.postOrder(lg) );

//return node if found in a BST
// lg( ots( managedBST.findNode( 1 ) ) );

//insert data node into BST
// managedBST.insertData( 3 );

//delete data from BST
// managedBST.deleteData( 67 );

//return depth of a node given it's data
// lg( `depth of node: ${ managedBST.getNodeDepth( 3 ) }` );

//return height of a node
// lg( `height of node: ${ managedBST.heightOfNode( managedBST.findNode( 2 ) ) }` );

//delete some notes to unbalance the tree...
// managedBST.deleteData( 1 );
// managedBST.deleteData( 3 );
// managedBST.deleteData( 5 );
// managedBST.deleteData( 7 );
// ...then check if tree is unbalanced
// lg( `tree balanced: ${ managedBST.isBalanced() }` );

//balance unbalanced tree...
// managedBST.rebalance();
// lg( `tree balanced: ${ managedBST.isBalanced() }` );
// managedBST.prettyPrintBSD();
