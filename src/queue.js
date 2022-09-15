


class QUEUE{
    QUEUE_DEFAULT_LENGTH = 32;
    
    queueData;
    queueSize;
    queueLength;
    topPointer;
    bottomPointer;
    


    constructor(start_length) {
        //setting startLength to a default value if not inputed
        const startLength = start_length || this.QUEUE_DEFAULT_LENGTH;
        
        //initializing values
        this.queueData = new Array(startLength);
        this.queueSize = 0;
        this.queueLength = startLength;
        this.topPointer = 0;
        this.bottomPointer = 0;
    }
    
    dequeue() {
        //check if queue is empty
        if (this.queueSize === 0) {
            throw new Error("queue is empty");
        }
        //get output
        const output = this.queueData[this.bottomPointer];
        
        //shrink queue
        this.bottomPointer = (this.bottomPointer+1)%this.queueLength;
        this.queueSize--;

        return output;
    }


    enqueue(value) {
        //check if queue is full
        if (this.queueSize === this.queueLength) {
            //resize if full
            this.resizeQueue();
        }
        //add item to queue
        this.queueData[this.topPointer] = value;

        //enlarge queue
        this.queueSize++;
        this.topPointer = (this.topPointer+1) % this.queueLength;

        return this.getQueue();
    }

    /**
     * returns size of the queue
     * @returns queue size
     */
    size() {
        return this.queueSize;
    }

    /**
     * returns a copy of the queue's data from first in to last in
     * @returns queue data copy
     */
    getQueue() {
        let output = new Array(this.queueSize);
        let printingPointer = this.bottomPointer;
        for (let index = 0; index < this.queueSize; index++){
            output[index] = this.queueData[printingPointer];
            printingPointer = (printingPointer+1)%this.queueLength;
        }
        return output;
    }

    
    /**
     * a function that doubles the size of the queue for when it is full
     * must be called when queue is full only
     */
    resizeQueue() {
        if (this.queueSize !== this.queueLength){
            throw new Error("queue is not full");
        }


        //create a new queue of double the size
        const newLength = this.queueLength * 2;
        let newQueueData = new Array(newLength);

        //copy data from all queue to the new queue
        for (let index = 0; index < this.queueLength; index++) {
            newQueueData[index] = this.queueData[this.bottomPointer];

            this.bottomPointer = (this.bottomPointer+1) % this.queueLength;

        }
        
        //reset top and bottom pointers
        this.topPointer = this.queueSize
        this.bottomPointer = 0; 

        this.queueLength = newLength; // set queue to a new length
        this.queueData = newQueueData; // in C I would have freed the memory, but in typescript we leave this to the GC
    }

    fromQueueData(data) {
        this.queueData = data.queueData;
        this.queueSize = data.queueSize;
        this.queueLength = data.queueLength;
        this.topPointer = data.topPointer;
        this.bottomPointer = data.bottomPointer;
    }

    getQueueData() {
        return {
            queueData: this.queueData,
            queueSize: this.queueSize,
            queueLength: this.queueLength,
            topPointer: this.topPointer, 
            bottomPointer: this.bottomPointer,
        }
    }

}

class STACK{
    
    stackData;
    stackSize;
    stackLength;



    constructor(){
        this.stackData = [];
        this.stackSize = 0;
        this.stackLength = 0;
        
    }

    enqueue(value) {
        //check if stack is full
        if (this.stackSize === this.stackLength) {
            this.stackLength++;
            this.stackSize++;
            this.stackData.push(value)
            
        } else{
            
            this.stackData[this.stackSize] = value;
            this.stackSize++;
        }
        
        return this.getQueue();
    }

    dequeue() {
        if (this.stackSize === 0) {
            throw new Error("stack is empty");
        }
        
        this.stackSize--;

        const output = this.stackData[this.stackSize];        

        return output;
    }
    getQueue() {
        return this.stackData.slice(0, this.stackSize);
    }
    size() {
        return this.stackSize;
    }

}

module.exports = {QUEUE, STACK}