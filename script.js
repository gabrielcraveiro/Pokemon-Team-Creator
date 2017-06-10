'use strict'

const fetchOption = {
	headers: {
		'Content-Type': 'application/json'
	},
	mode: 'cors'
};

$('form').on('submit', function (e) {
	e.preventDefault();
	document.querySelector('.poke-container').innerHTML = '';

	let types = $('input[type=text]').val().replace(/\s/g, '');
	types = types.split(',');

	let trainerTypeCalls = types.map(elem => {
		return fetch(`https://pokeapi.co/api/v2/type/${elem}/`, fetchOption)
	});

	getPromiseData(trainerTypeCalls)
		.then(result => {
			console.log(result);
			getDoubleDamagePokemon(result);
		});

	let p = document.createElement('p');
	p.innerHTML = "Aguarde um instante <br>";
	p.className = 'deletar';
	document.querySelector('.poke-container').appendChild(p);

});

function getDoubleDamagePokemon(pokemonTypes) {

	pokemonTypes = pokemonTypes
		.map(types => {
			return types.damage_relations.double_damage_from
		})
		.reduce(flatten, [])
		.map(type => {
			return fetch(type.url, fetchOption)
		});

	getPromiseData(pokemonTypes)
		.then(results => {
			console.log(results);
			buildTeam(results);
		});


}

function buildTeam(pokemons) {
	let team = [];
	pokemons = pokemons.map(pokemon => {
		return pokemon.pokemon;
	})
		.reduce(flatten, [])
		.map(pokemon => pokemon.pokemon);

	for (let i = 0; i < 6; i++) {
		team.push(getRandomPokemon(pokemons));
	}

	team = team.map(pokemon => {
		return fetch(pokemon.url, fetchOption);
	});

	getPromiseData(team)
		.then(pokemonData => {
			displayPokemon(pokemonData);
		});

	document.querySelector('.deletar').innerHTML = '';

}

function getRandomPokemon(pokemonArray) {
	return pokemonArray[Math.floor(Math.random() * pokemonArray.length)];
}

const flatten = (a, b) => [...a, ...b];

function getPromiseData(promisesArray) {
	return new Promise((resolve, reject) => {
		Promise.all(promisesArray)
			.then(res => {
				return res.map(type => type.json());
			})
			.then(res => {
				Promise.all(res)
					.then(resolve);
			})
			.catch(reject);
	});
}

function displayPokemon(pokemon) {
	pokemon.forEach(poke => {
		var $container = $('<div>').addClass('pokemon');
		var $image = $('<img>').attr('src', `http://pokeapi.co/media/img/${poke.id}.png`);
		var $title = $('<h2>').text(poke.name);
		$container.append($image, $title);
		$('.poke-container').append($container);
	});
}














