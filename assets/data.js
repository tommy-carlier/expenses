var data = (function(){
"use strict";

var categories = [], batchCount = 0, load, save;

if (window.localStorage && window.JSON){
  load = function(){
    var s = localStorage['expenses.categories'];
    if (s){
      try{
        categories = JSON.parse(s);
        
        // make sure each category has details (upgrade)
        for(var i=0, n=categories.length; i<n; i++){
          var c = categories[i];
          if (!('details' in c)){
            c.details = [];
          }
        }        
      } catch(e) { /* parsing failed */ }
    }
  };
  
  save = function(){
    if (batchCount == 0){
      try{
        localStorage.setItem('expenses.categories', JSON.stringify(categories));
      } catch(e) { /* storage failed */ }
    }
  };
} else { // local storage or JSON not supported
  load = function(){};
  save = function(){};
}

function categoryCount(){
  return categories.length;
}

function getCategory(categoryIndex){
  return categories[categoryIndex];
}

function beginBatch(){
  batchCount += 1;
}

function endBatch(){
  if (batchCount > 0){
    batchCount -= 1;
    if (batchCount == 0){
      save();
    }
  }
}

function addCategory(name){
  categories.push({ name:name, amount:0.0, details:[] });
  save();
}

function removeCategory(categoryIndex){
  categories.splice(categoryIndex, 1);
  save();
}

function renameCategory(categoryIndex, name){
  categories[categoryIndex].name = name;
  save();
}

function clearExpenses(){
  for(var i=0, n=categories.length; i<n; i++){
    var c = categories[i];
    c.amount = 0.0;
    c.details = [];
  }
  save();
}

function addExpense(categoryIndex, amount, description){
  var c = categories[categoryIndex];
  c.amount += amount;
  if (description.length){
    c.details.push(description);
  }
  save();
}

load();

return {
  categoryCount: categoryCount,
  getCategory: getCategory,
  beginBatch: beginBatch,
  endBatch: endBatch,
  addCategory: addCategory,
  removeCategory: removeCategory,
  renameCategory: renameCategory,
  clearExpenses: clearExpenses,
  addExpense: addExpense
};

}());