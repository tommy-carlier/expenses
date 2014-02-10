(function(){
"use strict";

var categories = [], d = document, current = -1,
  totalElement = d.getElementById('total'),
  categoriesElement = d.querySelector('#main-screen main'),
  addExpenseHeader = d.querySelector('#add-expense-screen header h1'),
  addExpenseCurrentElement = d.getElementById('add-expense-current'),
  addExpenseAmountElement = d.getElementById('add-expense-amount');

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

function parseAmount(s){
  if (/\d+(?:[.,]\d+)?/.test(s)){
    return parseFloat(s.replace(',', '.'));
  }
  return NaN;
}

function formatAmount(a){
  return a.toFixed(2);
}

function renderCategory(c){
  var item = d.createElement('LI'),
    name = d.createElement('SPAN'),
    amount = d.createElement('SPAN');
  
  name.className = 'name';
  name.appendChild(d.createTextNode(c.name));
  
  amount.className = 'amount';
  amount.appendChild(d.createTextNode(formatAmount(c.amount)));

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
    totalElement.appendChild(d.createTextNode(' (' + formatAmount(total) + ')'));
  }
}

function update(){
  renderCategories();
  save();
}

function showScreen(s){
  d.body.setAttribute('data-screen', s);
}

function getIndex(e){
  var i = 0;
  while ((e = e.previousSibling) != null){
    i += 1;
  }
  return i;
}

function showAddExpenseScreen(c){
  addExpenseHeader.firstChild.textContent = c.name;
  addExpenseCurrentElement.firstChild.textContent = formatAmount(c.amount);
  addExpenseAmountElement.value = '';
  showScreen('add-expense');
  addExpenseAmountElement.focus();
}

function onAddExpense(e){
  var t = e.target;
  if (t.tagName == 'SPAN'){
    t = t.parentElement;
  }
  if (t.tagName == 'LI'){
    current = getIndex(t);
    showAddExpenseScreen(categories[current]);
  }
}

function onAddCategory(){
  var name = prompt('What is the name of the category?');
  if (name){
    categories.push({ name: name, amount: 0.0 });
    update();
  }
}

function onEditCategories(){
  alert('Editing categories is not implemented yet. Sorry.');
}

function onClearExpenses(){
  if (confirm('Are you sure you want to clear all expenses?')){
    for (var i = 0, n = categories.length; i < n; i++){
      categories[i].amount = 0.0;
    }
    update();
  }
}

function onSubmitAddExpenseForm(e){
  e.preventDefault();
  var expense = parseAmount(addExpenseAmountElement.value);
  if (!isNaN(expense)){
    categories[current].amount += expense;
    update();
  }
  addExpenseAmountElement.blur();
  showScreen('main');
}

load();
renderCategories();

categoriesElement.addEventListener('click', onAddExpense);
d.getElementById('add-category').addEventListener('click', onAddCategory);
d.getElementById('edit-categories').addEventListener('click', onEditCategories);
d.getElementById('clear-expenses').addEventListener('click', onClearExpenses);
d.getElementById('add-expense-screen').addEventListener('submit', onSubmitAddExpenseForm);

}())