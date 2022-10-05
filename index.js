const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 2;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sounds/error.wav');
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
    }

    // Inicia el Simon
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    // Comienza el juego
    startGame() {
        this.display.startButton.disabled = true; 
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

// //actualiza la ronda y el tablero
updateRound(value) {
    this.round = value;
    this.display.round.textContent = `Round ${this.round}`;
}

// //crea un array aleatorio de botones
createSequence() {
    return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());

}
// //devuelve un numero al azar entre 0 y 3
getRandomColor() {
    return Math.floor(Math.random() * 4);
}

//Ejecuta una funcion cuando se hace click en un boton
buttonClick(value) {
    !this.blockedButtons && this.validateChosenColor(value);//si los botones no estan bloqueados,entonces validamos que el usuario elijio bien el color
}


// //Valida si el boton que toca el usuario corresponde al valor de la secuenta
validateChosenColor(value) {
    if(this.sequence[this.userPosition] === value) {// si el valor de la secuencia no coincide con el valor que toco, se confundio y perdio 
        this.buttonSounds[value].play();//si toco bien, llamamos al audio que corresponda asi suena el boton
        if(this.round === this.userPosition) {//Si el round a la posisicion del usuario, cambiamos de round
            this.updateRound(this.round + 1);
            this.speed /= 1.02;//hacemos que la velocidad de cambio de color sea mas rapida
            this.isGameOver();//validamos si la partida termino
        } else {
            this.userPosition++;
        }
    } else {
        this.gameLost();
    }
}

// //verifica que no haya acabado el juego
isGameOver() {
    if (this.round === this.totalRounds) {// si la ronda es igual al total de rondas, la partida finaliza si no, continua
        this.gameWon();
    }else{//sino hacemos que la posisicion sea cero y vuelve a mostrarse la secuencia
        this.userPosition = 0;
        this.showSequence();
    };
}


//  //muestra la secuencia de botones que va a tener que tocar el usuario
showSequence() {
    this.blockedButtons = true; //bloquamos los botones para que mientras se muestra la secuencia, el usuario no pueda tocar nada
    let sequenceIndex = 0; // guardamos en que moemnto de la secuencia estamos con sequenceIndex
    let timer = setInterval(() => {
        const button = this.buttons[this.sequence[sequenceIndex]];//la funciin llama al boton que debe pintar, elegimos la sequenca el lugar en el que estamos.
        this.buttonSounds[this.sequence[sequenceIndex]].play();//nos paramos en donde estamos en la secuencia y le damos play 
        this.toggleButtonStyle(button)//cambiamos el estilo del boton para que se aclare
        setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)//esperamos la mitad del tiempo y volvemos a despintar el boton
        sequenceIndex++;
        if (sequenceIndex > this.round) {//si secuence es mayor al raund
            this.blockedButtons = false;//desbloeamos los botones para que el usuario siga jugando
            clearInterval(timer);
        }
    }, this.speed);
}

//  // Pinta los botones para cuando se esta mostrando la secuencia
    toggleButtonStyle(button) {
        button.classList.toggle('active');//le agregamos la clase active
    } 


//  //actualiza el simon cuando el usuario pierde

gameLost() {
    this.errorSound.play();
    this.display.startButton.disabled = false; //sacamos el disable para que el jugador pueda volver a iniciar el juego
    this.blockedButtons = true;
}

// //muestra la animacion de triunfo y actualiza el simon cuando el jugador gana
gameWon() {
    this.display.startButton.disabled = false; 
    this.blockedButtons = true;
    this.buttons.forEach(element =>{
        element.classList.add('winner');
    });
    this.updateRound('🏆');
}
}



const simon = new Simon (simonButtons, startButton, round);
simon.init()
