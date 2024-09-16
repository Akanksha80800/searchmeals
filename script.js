const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const resultHeading = document.getElementById("meal-result-heading");
const mealEl = document.getElementById("meals");
const single_mealEl = document.getElementById("single-meal-container");

function findMeal(e) {
    e.preventDefault();
    const item = search.value;
    if (item.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                resultHeading.innerHTML = `Search Results for "${item}"`;
                if (data.meals === null) {
                    resultHeading.innerHTML = `Oops! No result for meal "${item}"`;
                    mealEl.innerHTML = ""; // Clear any previous results
                } else {
                    mealEl.innerHTML = data.meals
                        .map(
                            (meal) => `
              <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info" data-mealid="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
              `
                        )
                        .join("");
                }
            });
        search.value = "";
    } else {
        alert("Please enter a meal name");
    }
}

// Function to get meal by ID
function getsingleItemID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// Function to get random meal
function getRandomMeal() {
    mealEl.innerHTML = "";
    resultHeading.innerHTML = "Random Meal";
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}

// Function to add meal details to DOM in a modal
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    // Get the modal and the modal content elements
    const modal = document.getElementById('mealModal');
    const modalContent = document.getElementById('modal-meal-content');

    // Populate modal with meal info
    modalContent.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="main">
      <h2>Ingredients:</h2>
      <ul>
        ${ingredients.map((values) => `<li>${values}</li>`).join("")}
      </ul>
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
    </div>
  </div>`;

    // Show the modal
    modal.style.display = "block";

    // Close modal when user clicks on 'x'
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Close modal when user clicks outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Event listeners
submit.addEventListener("click", findMeal);
random.addEventListener("click", getRandomMeal);

// Event listener for single meal click
mealEl.addEventListener("click", (e) => {
    const mealInfo = e.composedPath().find((single_item) => {
        if (single_item.classList) {
            return single_item.classList.contains("meal-info");
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid");
        getsingleItemID(mealID);
    }
});
