"use strict";

myMain();

function myMain() {
    var nums = [];
    alert("before: "+nums);
    var hh = makeNewHeap();
    for (var i=0; i<nums.length; i++){
        hh.insert(nums[i]);
    }
    hh.print();
    alert("min: "+hh.getMin());
    hh.delMin();
    hh.print();
    
    var hh2 = makeNewHeap();
    hh2.build(nums);
    hh2.print();
}

function makeNewHeap() {
    // constructor for new heap
    var heap{
        elts:[-Infinity],   // load bignum int elt 0, slot 0 not used
        root:1,             // slot 1 is always root
        last:0,             // 
            
        LC: function (n) { },
        
        
        
    }
}

    insert: function (val) {
        this.last++; this.elts[this.last]=val;
        var n = this.last;
        var p = this.PN(n); //????
        var temp;
        while((p!=0) && val<this.PRV(n)){
            temp = this.elts[n];
            this.elts[n] = this.PRV(n);
            this.elts[p] = temp;
            n=p;
            p = this.PN(n);
        }
    },
        
    delMin: function() {
        if (this.size()===0) {return;}
        if (this.size===1) {this.elts[1]=Infinity;this.last--;return; }
        // you have at least two elements
        // move last val to root
        this.elts[this.root] = this.elts[this.last];
        this.elts[this.last] = Infinity; this.last--;
        // bubble down from root
        var temp, done=false;
        var n=this.root; c=0;
        while(!done) {
            if (this.isLeaf(n)) { done=true; }
            else{
                if (this.hasOnlyLC(n)) { c=this.LC(n); }   
            }
            if (this.elts[n]>this.elts[c]){
                temp=this.elts[c]; this.elts[c]=this.elts[n]; this.elts[n]=temp;
                n=c;
            }
            else{ done=true; }
        }
    },
    
    build: function(vals) {
        // create structural property
        for (var i=0; i<vals.length; i++) {
            this.elts[i+1] = vals[i];
        }
        this.last = 1;
        var sn = this.PN(this.last);
        for (var k=sn; k>0;  k--) {
            // bubble down node k
            var temp, done=false;
            var n=this.root; c=0;
            while(!done) {
                if (this.isLeaf(n)) { done=true; }
                else{
                    if (this.hasOnlyLC(n)) { c=this.LC(n); }   
                }
                if (this.elts[n]>this.elts[c]){
                    temp=this.elts[c]; this.elts[c]=this.elts[n]; this.elts[n]=temp;
                    n=c;
                }
                else{ done=true; }
            } // end while
        } // end for
    }, // end build
        
    isLeaf:     function (n) {return { this.LC(n)>this.last && this.RC(n)>this.last ); },
    hasOnlyLC:  function (n) { return { this.RC(n)>this.last && this.LC(n)<=this.last ); }
                             } // needs opening bracket
    return heap;
                              
                             