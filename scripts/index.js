let min = 1;
let max = 151;

// Gera um número aleatório entre min e max (inclusive)
function randomNumber(min, max) {
    min = Math.ceil(min); // Garante que min seja um inteiro
    max = Math.floor(max); // Garante que max seja um inteiro
    let number = Math.floor(Math.random() * (max - min + 1)) + min; // Gera um número aleatório
    return number;
}

// Obtém informações de um Pokémon aleatório da API do Pokémon
async function getPokemons() {
    let id = await randomNumber(min, max); // Gera um ID aleatório de Pokémon
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`; // URL da API do Pokémon
    try {
        let response = await fetch(url); // Faz uma requisição para a API
        return await response.json(); // Retorna os dados da resposta como JSON
    } catch (error) {
        console.log(error); // Loga o erro se a requisição falhar
    }
}

const allAnswers = []; // Array para armazenar as respostas (Pokémons)

// Formata os dados dos Pokémons e os armazena em allAnswers
async function formatData() {
    for (let i = 0; i <= 3; i++) {
        let data = await getPokemons(); // Obtém dados de um Pokémon
        allAnswers.push([data.id, data.name, data.types]); // Adiciona os dados ao array allAnswers
    }
    return allAnswers; // Retorna o array com todas as respostas
}

const correctAnswer = []; // Array para armazenar a resposta correta

// Preenche o array correctAnswer com o ID e nome do primeiro Pokémon
async function correctAnswers() {
    correctAnswer.push(allAnswers[0][0], allAnswers[0][1]);
    return correctAnswer; // Retorna a resposta correta
}

// Exibe os dados e inicia o jogo
async function showData() {
    let format = await formatData(); // Formata os dados dos Pokémons
    selectedPokemon(); // Exibe o Pokémon correto
    correctAnswers(); // Define a resposta correta
    shuffle(); // Embaralha as respostas
    attempts(); // Cria os botões de tentativa
    score(); // Exibe a pontuação
}

// Exibe a imagem e o tipo do Pokémon correto
async function selectedPokemon() {
    let correctId = allAnswers[0][0]; // Obtém o ID do Pokémon correto
    let numberImg = '';
    // Formata o ID para o formato de imagem
    if (correctId <= 9) {
        numberImg = '00' + correctId;
    } else if (correctId <= 99) {
        numberImg = '0' + correctId;
    } else {
        numberImg = correctId;
    }
    const urlImg = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${numberImg}.png`; // URL da imagem
    document.querySelector('.imagem').src = urlImg; // Exibe a imagem do Pokémon

    let correctType = allAnswers[0][2]; // Obtém os tipos do Pokémon
    const ulType = document.querySelector('.type'); // Seleciona o elemento onde os tipos serão exibidos
    for (let i = 0; i < correctType.length; i++) {
        let liType = document.createElement("li"); // Cria um item de lista
        ulType.appendChild(liType); // Adiciona o item de lista ao elemento ul
        liType.classList.add("type-" + correctType[i].type.name); // Adiciona uma classe baseada no tipo
        liType.innerText = correctType[i].type.name; // Define o texto do item de lista
    }
}

// Embaralha as respostas
async function shuffle() {
    for (let i = allAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]]; // Troca os elementos
    }
}

// Cria botões para as respostas e os adiciona ao DOM
async function attempts() {
    const attempts = document.querySelector('.attempts'); // Seleciona o elemento onde os botões serão exibidos
    for (let i = 0; i < allAnswers.length; i++) {
        let answer = allAnswers[i][1]; // Obtém o nome do Pokémon
        let btnAnswer = document.createElement("button"); // Cria um botão
        let spanAnswer = document.createElement("span"); // Cria um span para o nome do Pokémon
        let spanNumber = document.createElement("span"); // Cria um span para o número do Pokémon
        attempts.appendChild(btnAnswer); // Adiciona o botão ao elemento attempts
        btnAnswer.setAttribute('onclick', `attemptPressed('${answer}')`); // Define o evento de clique
        btnAnswer.appendChild(spanAnswer); // Adiciona o span para o nome ao botão
        btnAnswer.appendChild(spanNumber); // Adiciona o span para o número ao botão
        spanAnswer.innerText = allAnswers[i][1]; // Define o texto do span para o nome
        spanNumber.innerText = `N° ${allAnswers[i][0]}`; // Define o texto do span para o número
    }
}

// Função chamada quando um botão é pressionado
async function attemptPressed(answer) {
    correctionAttempt(answer); // Chama a função de correção
}

// Verifica se a resposta está correta e atualiza o jogo
async function correctionAttempt(answer) {
    if (answer == correctAnswer[1]) { // Verifica se a resposta está correta
        points(); // Incrementa a pontuação
        reset(); // Reseta o estado do jogo
        start(); // Reinicia o jogo
    } else {
        resetPoints(); // Reseta a pontuação
        reset(); // Reseta o estado do jogo
        alert('Errou!!'); // Exibe uma mensagem de erro
        start(); // Reinicia o jogo
    }
}

let counter = 0; // Contador de pontos

// Exibe a pontuação atual
function score() {
    const score = document.querySelector('.score'); // Seleciona o elemento onde a pontuação será exibida
    let spanScore = document.createElement('span'); // Cria um span para o texto 'score'
    let spanPoints = document.createElement('span'); // Cria um span para a pontuação
    score.appendChild(spanScore); // Adiciona o span para o texto ao elemento score
    score.appendChild(spanPoints); // Adiciona o span para a pontuação ao elemento score
    spanPoints.classList.add('points'); // Adiciona a classe 'points' ao span da pontuação
    spanScore.innerText = 'score: '; // Define o texto do span para o texto 'score'
    spanPoints.innerText = counter; // Define o texto do span para a pontuação atual
}

// Incrementa a pontuação
function points() {
    counter++; // Incrementa o contador de pontos
    document.querySelector('.points').innerText = counter; // Atualiza o texto da pontuação
}

// Reseta a pontuação
function resetPoints() {
    counter = 0; // Zera o contador de pontos
    document.querySelector('.points').innerText = counter; // Atualiza o texto da pontuação
}

// Reseta o estado do jogo
function reset() {
    allAnswers.length = 0; // Limpa o array allAnswers
    correctAnswer.length = 0; // Limpa o array correctAnswer
    document.querySelector('.imagem').src = ''; // Remove a imagem do Pokémon
    document.querySelector('.attempts').innerHTML = ''; // Limpa os botões de tentativa
    document.querySelector('.type').innerHTML = ''; // Limpa os tipos do Pokémon
    document.querySelector('.score').innerHTML = ''; // Limpa a pontuação
}

// Inicia o jogo
async function start() {
    let format = await formatData(); // Formata os dados dos Pokémons
    selectedPokemon(); // Exibe o Pokémon correto
    correctAnswers(); // Define a resposta correta
    shuffle(); // Embaralha as respostas
    attempts(); // Cria os botões de tentativa
    score(); // Exibe a pontuação
}

// Função para simular o carregamento antes de mostrar o jogo
function loading() {
    setTimeout(showGame, 1000 * 3); // Espera 3 segundos antes de chamar showGame
}

// Mostra o jogo após o carregamento
function showGame() {
    document.querySelector('.loading').classList.add('none'); // Remove a classe 'none' do elemento de loading
    document.querySelector('.who-is-this-pokemon').classList.remove('none'); // Remove a classe 'none' do elemento do jogo
}

// Inicia a função showData para começar o jogo
showData();
