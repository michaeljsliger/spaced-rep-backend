class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
    }

    insertFirst(value) {
        this.head = new _Node(value, this.head);
        this.length++;
    }

    insertLast(value) {
        if (this.head === null) {
            this.insertFirst(value);
        } else {
            let tempNode = this.head;
            while (tempNode.next !== null) {
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(value, null);
            this.head = this.head.next;
        }
    }

    insertM(value, M = 1) {
        // value matches this.head, with changed CC, IC, and MVs
        
        // this will be called, no matter right or wrong
        // but right means further back in the list (higher M)
        // wrong means reset to 1
        if (this.head === null || this.head.next === null) {
            this.insertFirst(value);
        } else if (M >= this.length - 1) {
            // at the end or past the end, goes on the end
            this.insertLast(value);
        } else {
            // M > 1
            // swap values instead of inserting?
            // insertion is necessary due to in/correct incremented counters
            let prevNode = this.head;
            let currNode = this.head;
            while ((currNode !== null) && M > 0) {
                prevNode = currNode;
                currNode = currNode.next;
                M--;
            }
            prevNode.next = new _Node(value, currNode);
            this.head = this.head.next;
            // move the list along
        }
    }

    returnHead() {
        return this.head.value;
    }

    remove(value) {
        if (this.head === null) {
            return 'LL empty';
        } else {
            let prevNode = this.head;
            let currNode = this.head;
            while (currNode.value !== value) {
                prevNode = currNode;
                currNode = currNode.next;
            }
            prevNode.next = currNode.next;
        }
    }

    removeAll() {
        if (this.head === null) {
            return 'LL empty';
        } else {
            // set all to null
            let prevNode = this.head;
            let currNode = this.head;
            while (currNode.next !== null) {
                prevNode = currNode;
                currNode = currNode.next;
                prevNode = null,
                prevNode.next = null;
            }
            if (this.head !== null) this.head = null;
            this.length = 0;
            
            return this.head;
        }
    }

    removeFirst() {
        if (this.head === null) {
            return 'LL empty';
        } else {
            this.head = this.head.next;
        }
    }

}

module.exports = LinkedList;