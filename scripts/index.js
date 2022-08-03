let min = 1;
let max = 151;
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let number = Math.floor(Math.random() * (max - min)) + min;
    return number;
}

async function getPokemons() {
    let id = await randomNumber(min, max);
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

const allAnswers = [];
async function formatData() {
    for (let i = 0; i <= 3; i++) {
        let data = await getPokemons();
        allAnswers.push([data.id, data.name, data.types])
    }
    return allAnswers;
}

const correctAnswer = [];
async function correctAnswers() {
    correctAnswer.push(allAnswers[0][0], allAnswers[0][1])
    return correctAnswer;
}

async function showData() {
    let format = await formatData();
    selectedPokemon()
    correctAnswers()
    shuffle()
    attempts()
    score()
}

async function selectedPokemon() {
    let correctId = allAnswers[0][0];
    let numberImg = '';
    if (correctId <= 9) {
        numberImg = '00' + correctId;
    } else if (correctId <= 99) {
        numberImg = '0' + correctId;
    } else {
        numberImg = correctId;
    }
    const urlImg = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numberImg}.png`;
    document.querySelector('.imagem').src = urlImg;

    let correctType = allAnswers[0][2];
    const ulType = document.querySelector('.type');
    for (let i = 0; i < correctType.length; i++) {
        let liType = document.createElement("li");
        ulType.appendChild(liType);
        liType.classList.add("type-" + correctType[i].type.name);
        liType.innerText = correctType[i].type.name;
    }
}

async function shuffle() {
    for (let i = allAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
}

async function attempts() {
    const attempts = document.querySelector('.attempts');
    for (let i = 0; i < allAnswers.length; i++) {
        let answer = allAnswers[i][1];
        let btnAnswer = document.createElement("button");
        let spanAnswer = document.createElement("span");
        let spanNumber = document.createElement("span");
        attempts.appendChild(btnAnswer);
        btnAnswer.setAttribute('onclick', `attemptPressed('${answer}')`);
        btnAnswer.appendChild(spanAnswer);
        btnAnswer.appendChild(spanNumber);
        spanAnswer.innerText = allAnswers[i][1];
        spanNumber.innerText = `N° ${allAnswers[i][0]}`;
    }
}

async function attemptPressed(answer) {
    correctionAttempt(answer)
}

async function correctionAttempt(answer) {
    if (answer == correctAnswer[1]) {
        points()
        reset()
        start()
    } else {
        resetPoints()
        reset()
        alert('Errou!!');
        start()
    }
}

let counter = 0;
function score() {
    const score = document.querySelector('.score');
    let spanScore = document.createElement('span');
    let spanPoints = document.createElement('span');
    score.appendChild(spanScore);
    score.appendChild(spanPoints);
    spanPoints.classList.add('points');
    spanScore.innerText = 'score: ';
    spanPoints.innerText = counter;
}

function points() {
    counter++;
    document.querySelector('.points').innerText = counter;
}

function resetPoints() {
    counter = 0;
    document.querySelector('.points').innerText = counter;
}

function reset() {
    allAnswers.length = 0;
    correctAnswer.length = 0;
    document.querySelector('.imagem').src = '';
    document.querySelector('.attempts').innerHTML = '';
    document.querySelector('.type').innerHTML = '';
    document.querySelector('.score').innerHTML = '';
}

async function start() {
    let format = await formatData();
    selectedPokemon()
    correctAnswers()
    shuffle()
    attempts()
    score()
}

function loading() {
    setTimeout(showGame, 1000 * 3);
}

function showGame() {
    document.querySelector('.loading').classList.add('none');
    document.querySelector('.who-is-this-pokemon').classList.remove('none');
}

showData()
