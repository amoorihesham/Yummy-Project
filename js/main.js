const mainContentArea = document.querySelector(".mainContent .container .row");
const nameInput = document.getElementById("searchByName");
const letterInput = document.getElementById("searchByFirstLetter");
$(document).ready(() => {
  $(".loading").fadeOut(500, () => {
    $("body").css({
      overflow: "auto",
    });
  });
  $(".menuIcon").click(() => {
    if ($(".menuIcon svg").hasClass("fa-bars")) {
      OpenNavbar();
      $(".links li").css({
        top: "0",
      });
      //   $(".searchArea").slideUp(300);
    } else {
      CloseNavbar();
      $(".links li").css({
        top: "400px",
      });
      $(".searchArea").slideUp(300);
    }
  });
  $(".search").click(() => {
    $(".searchArea").slideToggle(300);
  });
  $(".category").click(async () => {
    $(".loading").fadeIn(300);
    const request = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const response = await request.json();
    const allCategories = response.categories;
    displayAllCategorycards(allCategories);
    CloseNavbar();
    $(".loading").fadeOut(300);
  });
  $(".ingredients").click(async () => {
    $(".loading").fadeIn(300);
    const request = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    const response = await request.json();
    const allIngrediants = response.meals;
    displayAllIngrediantsCards(allIngrediants);
    CloseNavbar();
    $(".loading").fadeOut(300);
  });
  $(".area").click(async () => {
    $(".loading").fadeIn(300);
    const request = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const response = await request.json();
    const allAreas = response.meals;
    displayAllAreasCards(allAreas);
    CloseNavbar();
    $(".loading").fadeOut(300);
  });

  async function initFetch() {
    const request = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const response = await request.json();
    const data = response.meals;
    displayCategoryMeals(data);
  }
  initFetch();
});

// All category Part handlers
function displayAllCategorycards(categories) {
  let cartoona = ``;
  categories.map((card) => {
    return (cartoona += `<div class="col-md-4 col-xl-3 col-xxl-3">
              <div class="box rounded overflow-hidden position-relative" onclick="getMealsByCategory('${card.strCategory}')">
                <img
                  src=${card.strCategoryThumb}
                  class="img-fluid"
                  loading="lazy"
                />
                <div class="info position-absolute bg-white">
                  <h3>${card.strCategory}</h3>
                  <p class="text-trncate-me">${card.strCategoryDescription}</p>
                </div>
              </div>
            </div>`);
  });
  mainContentArea.innerHTML = cartoona;
}
function displayCategoryMeals(allMeals) {
  let cartoons = ``;
  let newDisplayed = allMeals?.slice(0, 20);
  if (!newDisplayed) {
    cartoons = `<div class="alert alert-warning w-50 mx-auto" role="alert">
    No results matched Your Search value.
  </div>`;
  }
  for (let i = 0; i < newDisplayed?.length; i++) {
    cartoons += `<div class="col-md-4 col-xl-3 col-xxl-3">
            <div class="box rounded overflow-hidden position-relative text-center" onclick="getMealDetails('${newDisplayed[i].idMeal}')">
                <img src=${newDisplayed[i].strMealThumb} loading="lazy" class="img-fluid" alt="Sample Photo">
              <div class="info position-absolute bg-white">
                <h3>${newDisplayed[i].strMeal}</h3>
              </div>
            </div>
          </div>`;
  }

  return (mainContentArea.innerHTML = cartoons);
}
async function getMealsByCategory(cateName) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cateName}`
  );
  const response = await request.json();
  const allCategoryMeals = response.meals;
  displayCategoryMeals(allCategoryMeals);
  $(".loading").fadeOut(300);
}
async function getMealDetails(mealId) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const response = await request.json();
  const mealDetails = response.meals[0];
  displayMealDetailsPage(mealDetails);
  $(".loading").fadeOut(300);
}
function displayMealDetailsPage(meal) {
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) {
    tags = ["No Tags For This Meal"];
  }
  let tagsUi = ``;
  for (let i = 0; i < tags.length; i++) {
    tagsUi += `<span class="d-inline-block me-2 p-1 mt-2 bg-info fw-bold rounded tags">${tags[i]}</span>`;
  }
  let uiCartonna = `<div class="col-md-12 col-xl-4 col-xxl-4">
            <div class="imgBox">
                <img src=${meal.strMealThumb} class="img-fluid" alt=${meal.strMeal}>
                <h2 class="mt-3 text-white">${meal.strMeal}</h2>
            </div>
            
        </div>
        <div class="col-md-12 col-xl-8 col-xxl-8">
            <div class="infoBox text-white">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h5 class="fw-bold">Area: ${meal.strArea}</h5>
                <h5 class="fw-bold">Category: ${meal.strCategory}</h5>
                <ul class="recips list-unstyled m-0 p-0 d-flex flex-wrap">
                    ${ingredients}
                </ul>
                <div class="tags">
                    <h4 class="fw-bold">Tags:</h4>
                    ${tagsUi}
                </div>
                <div class="links mt-4">
                    <a class="bg-success me-2 text-decoration-none text-white d-inline-block p-2  rounded" href=${meal.strSource} target="_blank">Source</a>
                    <a class="bg-danger text-decoration-none text-white d-inline-block p-2  rounded" href=${meal.strYoutube} target="_blank">Youtube</a>
                </div>
            </div>
        </div>`;

  mainContentArea.innerHTML = uiCartonna;
}

// All ingrediants part handlers
function displayAllIngrediantsCards(ingrediants) {
  let cartoona = ``;
  let newDisplayed = ingrediants.slice(0, 20);
  for (let i = 0; i < newDisplayed.length; i++) {
    cartoona += `<div class="col-md-6 col-xl-3 col-xxl-3">
          <div class="box rounded overflow-hidden position-relative text-center"  onclick="getMealsByMainIngrediants('${ingrediants[i].strIngredient}')">
              <img src="../imgs/ingrediants.jpg" loading="lazy" class="img-fluid" alt="Sample Photo">
            <div class="info position-absolute bg-white">
              <h3>${ingrediants[i].strIngredient}</h3>
            </div>
          </div>
        </div>`;
  }

  mainContentArea.innerHTML = cartoona;
}
async function getMealsByMainIngrediants(mainIngrediant) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngrediant}`
  );
  const response = await request.json();
  const data = response.meals;
  displayCategoryMeals(data);
  $(".loading").fadeOut(300);
}

// All areas part handlers
function displayAllAreasCards(areas) {
  let cartoona = ``;
  let newDisplayed = areas.slice(0, 20);
  for (let i = 0; i < newDisplayed.length; i++) {
    cartoona += `<div class="col-md-6 col-xl-3 col-xxl-3">
            <div class="box rounded overflow-hidden position-relative text-center" onclick="getMealsByAreaName('${areas[i].strArea}')">
                <img src="../imgs/earthplanet.svg" loading="lazy" class="img-fluid" alt="Sample Photo">
              <div class="info position-absolute bg-white">
                <h3>${areas[i].strArea}</h3>
              </div>
            </div>
          </div>`;
  }

  mainContentArea.innerHTML = cartoona;
}
async function getMealsByAreaName(areaName) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  const response = await request.json();
  const data = response.meals;
  console.log(data);
  displayCategoryMeals(data);
  $(".loading").fadeOut(300);
}

// All Search handlers
async function searchByName(value) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const response = await request.json();
  const data = response.meals;
  displayCategoryMeals(data);
  $(".loading").fadeOut(300);
}

async function searchByFirstLetter(value) {
  $(".loading").fadeIn(300);
  const request = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`
  );
  const response = await request.json();
  const data = response.meals;
  displayCategoryMeals(data);
  $(".loading").fadeOut(300);
}
// Global Handlers
function CloseNavbar() {
  $(".aside").animate({
    left: "-220",
  });
  $(".menuIcon svg").addClass("fa-bars");
  $(".menuIcon svg").removeClass("fa-x");
  $(".slider .links li").removeClass("show");
}

function OpenNavbar() {
  $(".aside").animate({
    left: "0",
  });
  $(".menuIcon svg").addClass("fa-x");
  $(".menuIcon svg").removeClass("fa-bars");
  $(".slider .links li").addClass("show");
}
