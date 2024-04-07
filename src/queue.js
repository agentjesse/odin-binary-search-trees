//simple queue data structure (based off linked list)

import { logToConsole as lg, objectToString as ots } from './logger.js'; //shorthand loggers

//node object maker
const makeNode = (data, next = null)=> ( { data, next } );

//queue object maker
const makeQueue = ()=> {
  let head = null; let tail = null; let length = 0;
  //management fns

  //fn to add new node to queue as tail
  const enqueue = (data)=> {
    //handle empty queue
    if (!head) {
      head = makeNode(data);
      tail = head;
    } else { //handle non-empty queue
      tail.next = makeNode(data);
      tail = tail.next;
    }
    length++;
  };

  //fn to remove head of queue and return data
  const dequeue = ()=> {
    //handle empty queue
    if (!head) return null;
    //dequeue head
    const dequeuedNode = head;
    head = head.next;
    length--;
    //clear tail if last node is removed
    if (!head) tail = null;
    return dequeuedNode.data;
  };

  return {
    enqueue,
    dequeue,
    getLength: ()=> length,
    getHead: ()=> head,
    getTail: ()=> tail
  };
};
export default makeQueue;

//queue data structure testing. no need to comment out since not exported
const q = makeQueue();
q.dequeue(); //error test handlng
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
q.enqueue(4);
q.enqueue(5);
lg( `queue length: ${q.getLength()}` );
lg( ots( q.getHead() ) ); //ots used since node truncates long strings
lg( q.getTail() );
