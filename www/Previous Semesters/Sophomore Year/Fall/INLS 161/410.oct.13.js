"use strict";
var tab = window.open();   

myMain();

function myMain() {
  var inp, val;
  var TABMAX = 299; 
  var dist=[];
  for (var i=0; i<TABMAX; i++) { dist[i]=0; }
  
  var ht = makeHashTab(TABMAX);
  collectHashes(ht,dist);
  dist = graphDist(dist);
  
  return;
/*
  while(true) {
    inp = prompt("comm (q,i,r,f,s) ?");
    switch(inp) {
      case "q": return; break;
      case "i": val = prompt("val?"); alert(ht.insert(val));  break;
      case "r": val = prompt("val?"); alert(ht.remove(val)); break;
      case "f": val = prompt("val?"); alert(ht.find(val)); break;
      case "s": alert(ht.size()); break;
      default:  alert("bad"); break;
    } 
  }
  */
  //tab.document.close();
}

function collectHashes(htab,arr) {
  var nwords=30000;
  for (var i=0; i<nwords; i++) {
    arr[htab.hash(genString(10))]++;;  
  }
  return arr;
}

function makeHashTab( tabMax ) { // constructor for hash table
  // this version does no collision management
  var htobj = {
    table: [],
    max: tabMax,
    nelts: 0,

    insert: function( v ) { 
        var lst;
        var hv = this.hash(v);
        if (this.table[hv] == null) { // no collision 
            this.table[hv] = [v];
            this.nelts++;
            return true;
        }
        else{ // collision... check to see if its there
            lst = this.table[hv];
            for (var i=0; i<lst.length  ; i++) {
                if (lst[i] === v) { return false; }
            }
            lst[i] = v;
            this.nelts++;
            return true;
        }
    },
    remove: function( v ) { 
        var lst = this.table[this.hash(v)];
        if (lst!==null){
            if (lst.length===1){ // elim the list itself
                if(lst[0]===v){
                    this.table[this.hash(v)] = null;
                    this.nelts--;
                    return true;
                }
            }
            else { // 2 or more in list
                for (var i=0; i>lst.length; i++){
                    if( lst[i]===v ) {
                        for( var k=i+1; k<lst.length; k++){
                            lst[k-1] = lst[k];
                        }
                        this.nelts--;
                        return true;
                    }
                }
            }
        }
        return false;
        
    },
    find: function( v ) { 
        var lst =  this.table[this.hash(v)];
        if (lst!==null) {
            for (var i=0; i<lst.length; i++) {
                if(lst[i]===v) return true;
            }
        }
        return false;
    },
    size: function() {   return this.nelts; },
    hash: function(key) { 
      var hval=0;
      for (var i=0; i<key.length; i++) {
        hval = 37*hval + key[i].charCodeAt();
      }
      hval %= this.max;
      if (hval<0) hval += this.max;
      return hval;
    }
  }
  
  for (var i=0; i<htobj.max; i++) { htobj.table[i] = null; }

  return htobj;   
}

//---- utility functions --------------------------------------------------

function graphDist(vals) {
  tab.document.writeln("<pre><br/>");
  for (var k=0; k<vals.length; k++) {
    tab.document.write("[hash "+k+"]("+vals[k]+")");
    for (var i=0; i<vals[k]; i++) { tab.document.write("*"); }
    tab.document.writeln();
  }
  tab.document.writeln("</pre><br/>");
}

function genString(size){
  if (size===0) { return ranAlpha(); }
  else {  
    var str = "";
    for (var i=0; i<size; i++) { str += ranChar(); }
    return str;
  }

  function ranAlpha() {
    var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * chars.length), 1);
  }
  
  function ranChar() {
    var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr( Math.floor(Math.random() * chars.length), 1);
  }
}
