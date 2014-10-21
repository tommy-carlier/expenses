(function(){
"use strict";

var d = document, current = -1,
  totalElement = d.getElementById('total'),
  categoriesElement = d.querySelector('#main-screen main'),
  editCategoriesElement = d.querySelector('#edit-categories-screen main'),
  addExpenseHeader = d.querySelector('#add-expense-screen header h1'),
  addExpenseCurrentElement = d.getElementById('add-expense-current'),
  addExpenseAmountElement = d.getElementById('add-expense-amount'),
  addExpenseDescriptionElement = d.getElementById('add-expense-description'),
  addExpenseHistoryElement = d.getElementById('add-expense-history');

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
  for (var i=0, n=data.categoryCount(); i<n; i++){
    var c = data.getCategory(i);
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
  addExpenseDescriptionElement.value = '';
  
  while (addExpenseHistoryElement.hasChildNodes()){
    addExpenseHistoryElement.removeChild(addExpenseHistoryElement.firstChild);
  }
  
  var details = c.details;
  if (details.length){
    var f = d.createDocumentFragment();
    for (var i = 0, n = details.length; i < n; i++){
      var e = d.createElement('SMALL');
      e.appendChild(d.createTextNode(details[i]));
      f.appendChild(e);
    }
    addExpenseHistoryElement.appendChild(f);
  }
  
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
    showAddExpenseScreen(data.getCategory(current));
  }
}

function onAddCategory(){
  var name = prompt('What is the name of the category?');
  if (name){
    data.addCategory(name);
    renderCategories();
  }
}

function renderEditCategory(c){
  var item = d.createElement('LI'),
    name = d.createElement('INPUT'),
    deleteButton = d.createElement('BUTTON');
  
  name.value = c.name;
  
  deleteButton.className = 'delete';
  deleteButton.appendChild(d.createTextNode('Delete'));
  
  item.appendChild(name);
  item.appendChild(deleteButton);
  
  return item;
}

function renderEditCategories(){
  var list = d.createElement('UL');
  for (var i=0, n=data.categoryCount(); i<n; i++){
    var c = data.getCategory(i);
    list.appendChild(renderEditCategory(c));
  }
  
  editCategoriesElement.replaceChild(list, editCategoriesElement.firstChild);
}

function onEditCategories(){
  renderEditCategories();
  showScreen('edit-categories');
}

function onDeleteCategory(e){
  var t = e.target;
  if (t.tagName == 'BUTTON' && t.className == 'delete' && !t.disabled){
    e.preventDefault();
    t.disabled = true;
    t = t.parentElement; // LI
    t.className = 'deleted';
    t = t.getElementsByTagName('INPUT')[0];
    t.readOnly = true;
  }
}

function onClearExpenses(){
  if (confirm('Are you sure you want to clear all expenses?')){
    data.clearExpenses();
    renderCategories();
  }
}

function onSubmitAddExpenseForm(e){
  e.preventDefault();
  var expense = parseAmount(addExpenseAmountElement.value);
  if (!isNaN(expense)){
    var description = addExpenseDescriptionElement.value;
    if (description.length){
      description += ' (' + formatAmount(expense) + ')';
    }
    
    data.addExpense(current, expense, description);
    renderCategories();
  }
  d.activeElement.blur();
  showScreen('main');
}

function onSubmitEditCategoriesForm(e){
  e.preventDefault();
  data.beginBatch();
  try{
    var items = editCategoriesElement.getElementsByTagName('LI');
    for (var i = items.length; i--; ) {
      var item = items[i];
      if (item.className == 'deleted') {
        data.removeCategory(i);
      } else {
        var name = item.getElementsByTagName('INPUT')[0].value;
        if (name.length > 0) {
          data.renameCategory(i, name);
        }
      }
    }
  } finally {
    data.endBatch();
    renderCategories();
    d.activeElement.blur();
    showScreen('main');
  }
}

function onBackToMainScreen(e){
  e.preventDefault();
  showScreen('main');
}

renderCategories();

// enables CSS active pseudo-class styles on buttons
d.addEventListener('touchstart', function(){}, false);

// event handlers
categoriesElement.addEventListener('click', onAddExpense);
editCategoriesElement.addEventListener('click', onDeleteCategory);

d.getElementById('add-category').addEventListener('click', onAddCategory);
d.getElementById('edit-categories').addEventListener('click', onEditCategories);
d.getElementById('clear-expenses').addEventListener('click', onClearExpenses);

d.getElementById('add-expense-screen').addEventListener('submit', onSubmitAddExpenseForm);
d.querySelector('#add-expense-screen button.back').addEventListener('click', onBackToMainScreen);

d.getElementById('edit-categories-screen').addEventListener('submit', onSubmitEditCategoriesForm);
d.querySelector('#edit-categories-screen button.back').addEventListener('click', onBackToMainScreen);
  
showScreen('main');

}())