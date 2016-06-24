"use strict";
var tab = window.open();   

myMain();

function myMain() {
  var inp, val;
  var TABMAX = 601;  // prime number
  var ht = makeHashTab(TABMAX);
  var dist = [];
  for (var i=0; i<TABMAX; i++) { dist[i] = 0; }
  
  //collectHashes(ht,dist);
  //graphDist(dist);
  //return;
  
  while(true) {
    inp = prompt("comm (q,i,r,f,s,p,x) ?");
    switch(inp) {
      case "q": return; break;
      case "i": val = prompt("val?"); alert(ht.insert(val));  break;
      case "r": val = prompt("val?"); alert(ht.remove(val)); break;
      case "f": val = prompt("val?"); alert(ht.find(val)); break;
      case "s": alert(ht.size()); break;
      case "p": ht.print(); break;
      case "x": var n = Number(prompt("how many words?")); 
           ht.fill(n); break;
      default:  alert("bad"); break;
    } 
  }
  tab.document.close();
}

function makeHashTab( tabMax ) { // constructor for a hash table
  // this version handles collisions via chaining, buckets
  var htobj = {
    table: [],
    max: tabMax,
    nelts: 0,
    
    insert: function( v ) {
      var lst;
      var hv = this.hash(v);
      if (this.table[hv] === null) { // no collision, make new list
        this.table[hv] = [v];
        this.nelts++;
        return true;
      }
      else { // collision... check list to see if its there
        lst = this.table[hv];
        for (var i=0; i<lst.length; i++) {
          if (lst[i]===v) return false;  // v is already there we didnt add
        }
        lst[i]=v;  // put v into the slot open after end of list
        this.nelts++;
        return true;
      }
    },
    
    remove: function( v ) {
      var lst = this.table[this.hash(v)];
      if (lst !== null) {
        if (lst.length===1) { // list has 1 item
          if (lst[0]===v) {
            this.table[this.hash(v)] = null;
            this.nelts--;
            return true;
          }
          return false;
        }
        else { // list has 2 or more in it, find v
          for (var i=0; i<lst.length; i++) {
            if (lst[i]===v) {
              for (var k=i+1; k<lst.length; k++) { lst[k-1] = lst[k]; }
              lst.length--; // hack for javascript... mess with array length
              this.nelts--;
              return true;
            }
          }
        }
      } 
      return false;
    },
  
    find: function( v ) {
      var lst = this.table[this.hash(v)] ;
      if ( lst !==null ) {
        for (var i=0; i<lst.length; i++) {
          if (lst[i]===v) return true;
        }
      }
      return false;
    },
    
    size: function() { return this.nelts; },
    
    hash: function(key) { 
      var hval = 0;
      for (var i=0; i<key.length; i++) {
        hval = 37 * hval + key[i].charCodeAt();
      }
      hval %= this.max;
      if (hval<0) hval += this.max;
      return hval; 
    },
    
    fill: function(n) {
      for (var i=1; i<=n; i++) {
        this.insert(genString(0)+genString(9));
      }
    },
    
    print: function() {
      var vals = [];
      for (var i=0; i<this.max; i++) {
        vals[i] = this.table[i]===null ? 0 : this.table[i].length;
      }
      graphDist(vals);
    }
  }
  
  for (var i=0; i<htobj.max; i++) { htobj.table[i] = null; }

  return htobj;   
}

//--- utility functions -----------------------------------------------

function collectHashes(htab, vals) {
  var nwords=10;
  for (var i=1; i<nwords; i++) {
    vals[htab.hash( genString(0)+genString(10) ) ]++ ;
  } 
  return vals;
}

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



