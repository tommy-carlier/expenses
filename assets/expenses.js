(function(){
"use strict";

var categories = [], d = document,
  totalElement = d.getElementById('total'),
  categoriesElement = d.getElementById('categories');

function load(){
  if (window.localStorage && window.JSON){
    var s = localStorage['expenses.categories'];
    if (s){
      try {
        categories = JSON.parse(s);
      } catch(e) { /* parsing failed */ }
    }
  }
}

function save(){
  if (window.localStorage && window.JSON){
    try {
      localStorage.setItem('expenses.categories', JSON.stringify(categories));
    } catch(e) { /* storage failed */ }
  }
}

function renderCategory(c){
  var item = d.createElement('LI'),
    name = d.createElement('SPAN'),
    amount = d.createElement('SPAN');
  
  name.className = 'name';
  name.appendChild(d.createTextNode(c.name));
  
  amount.className = 'amount';
  amount.appendChild(d.createTextNode(c.amount.toFixed(2)));

  if (!~~c.amount){ // check if c.amount is zero
    item.className = 'empty';
  }
  
  item.appendChild(name);
  item.appendChild(amount);
  
  return item;
}

function renderCategories(){
  var list = d.createElement('UL'), total = 0.0;
  for (var i = 0, n = categories.length; i < n; i++){
    var c = categories[i];
    total += c.amount;
    list.appendChild(renderCategory(c));
  }
  
  categoriesElement.replaceChild(list, categoriesElement.firstChild);
  if (totalElement.hasChildNodes()){
    totalElement.removeChild(totalElement.firstChild);
  }
  if (~~total){
    totalElement.appendChild(d.createTextNode(' (' + total.toFixed(2) + ')'));
  }
}

function update(){
  renderCategories();
  save();
}

function getIndex(e){
  var i = 0;
  while ((e = e.previousSibling) != null){
    i += 1;
  }
  return i;
}

function parseExpense(s){
  if (/\d+(?:[.,]\d+)?/.test(s)){
    return parseFloat(s.replace(',', '.'));
  }
  return NaN;
}

function onAddExpense(e){
  var t = e.target;
  if (t.tagName == 'SPAN'){
    t = t.parentElement;
  }
  if (t.tagName == 'LI'){
    var i = getIndex(t), c = categories[i];
    var expense = parseExpense(prompt(c.name + ': ' + c.amount.toString() + ' + ?'));
    if (!isNaN(expense)){
      c.amount += expense;
      update();
    }
  }
}

function onAddCategory(){
  var name = prompt('What is the name of the category?');
  if (name){
    categories.push({ name: name, amount: 0.0 });
    update();
  }
}

function onClearExpenses(){
  if (confirm('Are you sure you want to clear all expenses?')){
    for (var i = 0, n = categories.length; i < n; i++){
      categories[i].amount = 0.0;
    }
    update();
  }
}

load();
renderCategories();

categoriesElement.addEventListener('click', onAddExpense);
d.getElementById('add-category').addEventListener('click', onAddCategory);
d.getElementById('clear-expenses').addEventListener('click', onClearExpenses);

}())