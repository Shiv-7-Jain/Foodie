let favDishes = localStorage.getItem('FavDishes');
try {
    favDishes = favDishes.split(',');
}
catch(err){
    console.log(err);
}
const Favourites = document.getElementById('Favourites');
const container = document.createElement('div');
container.setAttribute('id','currentFav');
displayFavDishes();
let result;
let instruction_result;
console.log(localStorage.getItem('FavDishes'));
const instructions = document.getElementById('instructions');

async function displayFavDishes(){
    for(let i = 0;i < favDishes.length-1;i++){
        const api = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        const food = favDishes[i];
        const apiURL = api + food;
        try {
            const response = await fetch(apiURL);
            result = await response.json();
        } catch (err){
            console.log(err);
        }
        const div = document.createElement('div')
        // Making Ui for every favourite element 
        const img = document.createElement('img');
        img.setAttribute('src',result.meals[0].strMealThumb);

        const info = document.createElement('div');

        const name = document.createElement('h3');
        name.innerText = result.meals[0].strMeal;

        // Adding heart icon to add dishes to favourites
        const delete_icon = document.createElement('ion-icon');
        delete_icon.setAttribute('name','trash-outline');
        delete_icon.setAttribute('id','delete'+i);

        // Adding the name and heart to the div
        info.appendChild(name);
        info.appendChild(delete_icon);

        const button = document.createElement('button');
        button.innerText = 'Read Instructions';
        button.setAttribute('id','instruction'+i);

        div.appendChild(img);
        div.appendChild(info);
        div.appendChild(button);
        div.classList.add('dish')

        container.appendChild(div);
        Favourites.appendChild(container);
    }
    getInstructions();
    getDeleteButton();
}

function getInstructions(){
    // Passing through the array to set the instructions button
    for(let i = 0;i < favDishes.length-1;i++){
        // storing the button to set an event listener on it .
        const instruction = document.getElementById('instruction'+i);
        instruction.addEventListener('click', async function (){
            // setting the api to be called when the read instructions button would be pushed .
            const api = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
            const food = favDishes[i];
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

//  Making the delete function 
 function getDeleteButton(){
    for(let i = 0;i < favDishes.length-1;i++){
        const delete_button = document.getElementById('delete'+i);
        delete_button.addEventListener('click',() => {
            const favDish = delete_button.parentElement.getElementsByTagName('h3')[0].innerText;
            favDishes = favDishes.filter((dish) => dish !== favDish);
            delete_button.parentElement.parentElement.remove();
            let newFavDishes = '';
            favDishes.forEach((dish) => {
                newFavDishes += dish +',';
            })
            newFavDishes = newFavDishes.slice(0,-1);
            localStorage.setItem('FavDishes',newFavDishes);
        });
    }
 }