// Initialize Firebase
var config = {
	apiKey: "AIzaSyBDtVvPF2eKSGm8WZJyrT2X__iG7sWbLgg",
	authDomain: "meal-planner-7bef4.firebaseapp.com",
	databaseURL: "https://meal-planner-7bef4.firebaseio.com",
	storageBucket: "meal-planner-7bef4.appspot.com",
	messagingSenderId: "42836595239"
};

firebase.initializeApp(config);
// end of Firebase

var getRecipe = {};

getRecipe.key = 'd48e1baf03a4eaf282e12f018fdb7ac4';

getRecipe.init = function() {
	// code that kicks off my app
	getRecipe.getIngredients();
};

// user types in three ingredients into input field 
// user clicks on submit
getRecipe.getIngredients = function() {
	$('#input').on('submit', function(event){
		event.preventDefault();

		var userInput = $('input').val();

		getRecipe.getRecipeDetails = $.ajax({
		    url: 'http://proxy.hackeryou.com',
		    dataType: 'json',
		    method:'GET',
		    data: {
		        reqUrl: 'http://food2fork.com/api/search',
		        method: 'GET',
		        params: {
		            key: getRecipe.key,
		            q: userInput,
		            // up to five recipes are returned based on user input
		            count: 5
		        },
		        xmlToJSON: false
		    }
		}).then(function(data){
			getRecipe.getRecipeIngredients(data.recipes);
		});
	});
};

getRecipe.getRecipeIngredients = function(recipes) {
	// console.log("recipess", recipes);
	recipes = recipes.map(function(item){
		return $.ajax({
		    url: 'http://proxy.hackeryou.com',
		    dataType: 'json',
		    method:'GET',
		    data: {
		        reqUrl: 'http://food2fork.com/api/get',
		        method: 'GET',
		        params: {
		            key: getRecipe.key,
		            rId: item.recipe_id
		        },
			xmlToJSON: false
			}
		})
	})

	$.when(...recipes)
		.then(function(...ingredients) {
			ingredients = ingredients.map(function(recipe) {
				return recipe[0].recipe;
			});
			getRecipe.displayRecipes(ingredients);
		});
};

// display search results on page
getRecipe.displayRecipes = function(recipeDisplay) {
	// iterate over objects only if images are not equal to null
	$('#recipe').empty();
	recipeDisplay.forEach(function(display) {

			var title = display.title;
			var image = display.image_url;
			var ingredients = display.ingredients;			
			var link = display.source_url;

			var titleEl = $('<h2>').html(title).addClass('recTitle');
			var imageEl = $('<img>').attr('src', image).addClass('recImage');
			var linkEl = $('<p>').html("For the full recipe, including instructions, visit: <a href='"+ link + "' target='_blank'>" + link + "</a>").addClass('recLink');

			var ingredientsTitle = $('<h3>').text('Ingredients');
			var ingredientsEl = $('<ul>');
			var ingredientsSection = $('<div>').addClass('ingredSec').append(ingredientsTitle, ingredientsEl);			
			ingredients.forEach(function(ingredient){
				ingredientsEl.append('<li>' + ingredient + '</li>');
			})
			var recipePiece = $('<div>').addClass('weekday').append(titleEl, imageEl, ingredientsSection, linkEl);
			$('#recipe').append(recipePiece);	
	});
};

$(function(){
	getRecipe.init();
});

