const searchBar = document.querySelector(".searchBar"),
    searchButton = document.querySelector('.searchButton'),
    warningBox = document.querySelector('.warningBox'),
    warningMessage = 'Ooops! Something went wrong or we can\'t fint meal with this name. Try again!';

const Meal = {
    apiURL: 'https://www.themealdb.com/api/json/v1/1/',
    randomMealAPI: "random.php",
    searchMealAPI: "search.php?s=",
    getRandomMealObject: async function () {
        try {
            const res = await fetch(this.apiURL + this.randomMealAPI);
            let data = await res.json();
            data = data.meals[0];
            this.displayMeal(data, 'inspiration');
            console.log(data);
        }
        catch (error) {
            console.log(error);
            warningBox.innerHTML = warningMessage;
            warningBox.classList.toggle('hide');
        }

    },
    displayMeal: (data, type) => {
        document.getElementById('mealCard').classList.remove('hide');
        switch(type){
            case 'search':
                document.querySelector('.mealName').innerText = `You searched for ${data.strMeal}`;
                break;
            case 'inspiration':
                document.querySelector('.mealName').innerText = `Your inspiration is ${data.strMeal}`;
                break;
        }
        document.querySelector('.mealRegion').innerText = `${data.strArea} recipe`;
        document.querySelector('.mealImage').src = data.strMealThumb;
        document.querySelector('.mealImage').alt = `Picture of ${data.strMeal}`;
        document.querySelector('.mealInstructions').innerText = data.strInstructions;
        
        warningBox.classList.add('hide');
        const ingredientList = document.querySelector('.mealIngredients__list');
        while (ingredientList.firstElementChild) ingredientList.firstElementChild.remove();
        for (let i = 1; i < 16; i++) {
            if (!data[`strIngredient${i}`])
                break;
            let listItem = document.createElement('li');
            listItem.innerHTML = data[`strIngredient${i}`] + ' - ' + data[`strMeasure${i}`];
            ingredientList.appendChild(listItem);
        };
        document.body.style.background = `url("${data.strMealThumb}") no-repeat center center`;
        document.body.style.backgroundSize = `cover`;
    },

    searchForMeal: async function (meal) {
        if(!meal) return this.boxWarning();
        try {
            const res = await fetch(this.apiURL + this.searchMealAPI + meal);
            let data = await res.json();
            data = data.meals[0];
            this.displayMeal(data, 'search');
        }
        catch (error) {
            console.log(error);
            this.boxWarning();
        }
    },
    boxWarning:() =>{
        warningBox.innerHTML = warningMessage;
        warningBox.classList.toggle('hide');
    }
}

function searchInteraction() {
    Meal.searchForMeal(searchBar.value);
    searchBar.value = '';
}


document.querySelector(".getRandomMeal")
    .addEventListener("click", () => {
        Meal.getRandomMealObject()
    });


searchBar
    .addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
            searchInteraction();
        }
    });

searchButton.addEventListener('click', () => {
    searchInteraction();
})