/* Next task:
-
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

//fn to process a raw (unsorted/duplicates) array for BST creation
const processArr = (rawArr)=> (
  rawArr.sort( (a, b)=> a - b ) //sort array
  //remove dupes. Filter skips keeping current value it's equal to next one
    .filter( (currentVal, currentIndex)=> !(currentVal === rawArr[currentIndex + 1]) )
);

//fn to print a binary tree. Provide level-0 root node, optional prefix like \n
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) return;
  // eslint-disable-next-line no-unused-expressions
  node.right !== null && prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  lg(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  // eslint-disable-next-line no-unused-expressions
  node.left !== null && prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

//fn to wrap a BST with management methods. Pass in a BST level-0 root node
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
    traverseFrom();//start the recursive traversal
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
    traverseFrom(); //start the recursive traversal
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
    traverseFrom();//start the recursive traversal
    if (!callback) return result; //no callback? return result[]
  };

  //fn to check if BST has some data, and return the node if found.
  const find = (data)=> {
    //recursively check children if not in parent
    const checkAndTraverse = (node = level0RootNode)=> {
      //return node if it's null (data not in tree) or its data matches.
      if (!node || node.data === data) return node;
      //if data is less than this nodes data
      if (data < node.data) return checkAndTraverse(node.left);
      //if data greater
      return checkAndTraverse(node.right);
    };
    return checkAndTraverse();
  };
  //fn to insert data node into BST
  const insertData = (data)=> {
    //recursive fn to check node's data against new data and decide where/if to insert.
    const traverseAndInsert = (node = level0RootNode)=> {
      //edge case: if this fn was called with a null node, return a new node to
      //use for assignment to previous calls nodes subtree
      if (!node) return makeNode(data);
      //if insertion data less than node data: set data in left subtree. do a
      //recursive call with left node and wait for it to return:
      if (data < node.data) node.left = traverseAndInsert(node.left);
      //if insertion data greater than node data: set data in right subtree. do a
      //recursive call with right node and wait for it to return:
      if (data > node.data) node.right = traverseAndInsert(node.right);
      //double edge case: return the current node to the caller as it is expecting
      //a subtree. also, if this line is reached due to insertion data matching this
      //nodes data, return the unchanged node.
      return node;
    };
    traverseAndInsert(); //start the recursive traversal
  };

  //fn to delete node with matching data from BST
  const deleteData = (data)=> {
    //traversal fn. returns modified tree, even if just null node.
    const traverseAndDelete = (node = level0RootNode)=> {
      //base: if this fn is called with a null node, return it for an assignment.
      if (!node) return node;
      //compare delete data to node data, then do a recursive call with the appropriate
      //subtree to modify it.
      if (data < node.data) {
        node.left = traverseAndDelete( node.left );
      } else if (data > node.data) {
        node.right = traverseAndDelete( node.right );
      } else {
        //this conditional is reached when the nodes data matches delete data.
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
    traverseAndDelete(); //start the recursive traversal
  };

  return {
    level0RootNode,
    prettyPrintBSD: ()=> prettyPrint(level0RootNode),
    levelOrder,
    preOrder,
    inOrder,
    postOrder,
    find,
    insertData,
    deleteData
  };
};

//testing
// const testArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testArr = [3, 1, 2];
//managed Binary Search Tree via wrapper
const pureBST = makeTree( processArr( testArr ) );
const managedBST = makeManagedBST( pureBST );
managedBST.prettyPrintBSD();

//level order traversal with no callback returns data array
// lg( 'level order traversal:\b');
// lg( managedBST.levelOrder() );
//level order traversal with callback to invoke for each node
// lg( managedBST.levelOrder(lg) );

//preorder traversal with no callback returns data array
// lg( 'preorder traversal:\b');
// lg( managedBST.preOrder() );
//preorder traversal with callback to invoke for each node
// lg( managedBST.preOrder(lg) );

//inorder traversal with no callback returns data array
// lg( 'inorder traversal:\b');
// lg( managedBST.inOrder() );
//inorder traversal with callback to invoke for each node
// lg( managedBST.inOrder(lg) );

//postorder traversal with no callback returns data array
// lg( 'postorder traversal:\b');
// lg( managedBST.postOrder() );
//postorder traversal with callback to invoke for each node
// lg( managedBST.postOrder(lg) );

//return node if found in a BST
// lg( `node with search data found: ${ ots( managedBST.find(1) )}` );

//insert data node into BST
// managedBST.insertData(3);
// managedBST.prettyPrintBSD(); //see tree after insert

//delete data from BST
// managedBST.deleteData(67);
// managedBST.prettyPrintBSD(); //see tree after delete
