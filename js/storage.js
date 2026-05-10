
const TASKS_KEY = 'tasques';
const CATEGORIES_KEY = 'categories';

function getTasques() {
  return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
}

function saveTasques(tasques) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasques));
}

function getCategories() {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
