const mainSection = document.getElementById('main');
const script = document.getElementById('script');
const dishesList = document.getElementById('dishesList');
const search = document.getElementById('search');
const loader = document.getElementById('lds-ring');
const instructions = document.getElementById('instructions');
const searchIngridient = document.getElementById('searchIngridient');
let favDishes= '';
let result;
let instruction_result;


function loading(){
    loader.classList.remove('nodisplay')
    loader.classList.add('display');
    dishesList.classList.remove('display');
    dishesList.classList.add('nodisplay');
}

function stopLoading(){
    loader.classList.remove('display')
    loader.classList.add('nodisplay');
    dishesList.classList.remove('nodisplay');
    dishesList.classList.add('display');
}

function displayDishes() {
    // Looping through the result to make the UI of the dishes

    // Checking if user have searched before and if yes , we are removing the previous dishes. 
    if(document.getElementById('dishes')){
        document.getElementById('dishes').remove();
    }
    // Removing the main section
    mainSection.remove();
    // Starting the loading
    loading()
    // Stopping the loading after 4 seconds to give user a better experience while the data is being added to the UI.
    setTimeout(() => {
        return stopLoading();
    }, 4000);
    const dishes = document.createElement('div');
    dishes.setAttribute('id','dishes');
    for(let i = 0;i < result.meals.length;i++){
        // Setting the image of the dishes
        const img = document.createElement('img');
        img.setAttribute('src',result.meals[i].strMealThumb);

        const div = document.createElement('div');

        // Setting the Name of the dish
        const name = document.createElement('h3');
        name.innerText = result.meals[i].strMeal;

        // Adding heart icon to add dishes to favourites
        const heart = document.createElement('ion-icon');
        let favDish = localStorage.getItem('FavDishes');
        heart.setAttribute('name','heart-outline');
        if(favDish){
            favDish = favDish.split(',');
            favDish.map((dish) => {
                if(dish == result.meals[i].strMeal){
                    heart.setAttribute('name','heart');
                }
            });
        };
       
        heart.setAttribute('id','favourite'+i);

        // Adding the name and heart to the div
        div.appendChild(name);
        div.appendChild(heart);

        // Setting the button to read instructions
        const button = document.createElement('button');
        button.innerText = 'Read Instructions';
        button.setAttribute('id','instruction'+i);

        // Making a conatiner for a dish
        const dish = document.createElement('div');

        // Putting all the lements inside the div
        dish.appendChild(img);
        dish.appendChild(div);
        dish.appendChild(button);

        // adding design class dish 
        dish.classList.add('dish');

        // Appending the dish to the dishes
        dishes.appendChild(dish);
    }
    // Appending the dishes into our section in HTML
    dishesList.appendChild(dishes);
    // Calling the instructions function, It will set the event listener for the read instructions button 
    getInstructions();
    setFavourites()
}

async function getDishes(){
    // Here we are making the url to be fetched by combining the api with the food name .
    const api = 'https://www.themealdb.com/api/json/v1/1/filter.php?i='
    let foodName = document.getElementById('name').value;
    if(!foodName){
        foodName = document.getElementById('cta').value;
    }
    const apiUrl = api + foodName;
    // We are using try and catch to fetch the api
    try {
        // Here we are onverting the response to json and storing it in result.
        const response = await fetch(apiUrl);
        result = await response.json()
    }catch(error){
        console.log(error);
    }
    // Calling function Display Dishes
    displayDishes()
}

search.addEventListener('click',getDishes);
searchIngridient.addEventListener('click' , getDishes);

// Displayng the instructions
function displayInstructions(){
    // checking if there are instructions of another dish and if yes removing it 
    try{
        document.getElementById('currentInstruction').remove();
    }catch(err){
        console.log(err);
    }

    // console.log(instruction_result.meals[0]);

    // Making the UI for the instructions part
    const container = document.createElement('div');
    container.setAttribute('id' , 'currentInstruction');

    // Creating a link in which img will be placed and the link will take you to you tube video .
    const link = document.createElement('a');
    link.setAttribute('href',instruction_result.meals[0].strYoutube);
    link.setAttribute('target','_blank')
    const img = document.createElement('img');
    img.setAttribute('src',instruction_result.meals[0].strMealThumb);
    // Icon to show on hover effect
    const icon = document.createElement('ion-icon');
    icon.setAttribute('name','logo-youtube');
    // icon.setAttribute('id','youTube');
    icon.setAttribute('class','nodisplay');
    link.addEventListener('mouseover',() => {
        icon.classList.remove('nodisplay');
    })
    link.addEventListener('mouseout',() => {
        icon.classList.add('nodisplay');
    })

    // Adding the img and icon inside the link
    link.appendChild(icon);
    link.appendChild(img);

    const infoDiv = document.createElement('div');
    // Adding the name of the meal
    const name = document.createElement('h3');
    name.innerText = instruction_result.meals[0].strMeal;

    // Adding the steps of cooking
    const steps = document.createElement('p');
    steps.innerText = instruction_result.meals[0].strInstructions;

    // Adding the name and steps to the div 
    infoDiv.appendChild(name);
    infoDiv.appendChild(steps);

    // Adding everything inside the container
    container.appendChild(link);
    container.appendChild(infoDiv);
    // Adding the container to html 
    instructions.appendChild(container);
}

// setting add-listeners to every instruction button

function getInstructions(){
    // Passing through the array to set the instructions button
    for(let i = 0;i < result.meals.length;i++){
        // storing the button to set an event listener on it .
        const instruction = document.getElementById('instruction'+i);
        instruction.addEventListener('click', async function (){
            // setting the api to be called when the read instructions button would be pushed .
            const api = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
            const food = result.meals[i].strMeal;
            const apiURL = api + food;
            try {
                // Storing the response in the instruction result
                const response = await fetch(apiURL);
                instruction_result = await response.json();
                // calling the display instruction function to display the instructions .
                displayInstructions()
            } catch(err){
                // Logging the error if any 
                console.log(err);
            }
        });
    }
}


function setFavourites(){
    for(let i = 0;i < result.meals.length;i++){
        let count = 0;
        const favourite = document.getElementById('favourite'+i);
        favourite.addEventListener('click',() => {
                favourite.setAttribute('name','heart');
                if(!count){
                    favDishes = result.meals[i].strMeal + ',';
                } 
                let oldFavDishes = localStorage.getItem('FavDishes');
                oldFavDishes += favDishes ;
                localStorage.setItem('FavDishes',oldFavDishes);
                console.log(localStorage.getItem('FavDishes'));
        })
    }
}
