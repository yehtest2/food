import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
//載入組件
//設置數據物件,
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//回傳物件解構
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
//匯入食譜
export const loadRecipe = async function (id) {
  try {
    //獲得資料從api
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //解構並加入物件
    state.recipe = createRecipeObject(data);
    //如果有在書籤的話 標記為真 否則為否
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    //丟出ＥＲＲＯＲ
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    //設定搜尋
    state.search.query = query;
    // 獲得數據
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    //存入數據至物件
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //固定在第一頁
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};
//改變page 頁數
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};
//改變份量
export const updateServings = function (newServings) {
  //改變食譜的份量
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });
  //設置新人數
  state.recipe.servings = newServings;
};
//存入localStorage
const persistBookmarks = function () {
  // console.log(localStorage.getItem('bookmarks'));
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
//加入書籤
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};
//刪除書籤
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
//刪除所有書籤
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
//
export const uploadRecipe = async function (newRecipe) {
  try {
    //分析表單成分
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;
        // console.log(`${[quantity, unit, description]}`);

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    //送出資料,並回傳成功的資料
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //加入頁面
    // console.log(data);
    //載入組件
    state.recipe = createRecipeObject(data);
    //加入書籤
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
