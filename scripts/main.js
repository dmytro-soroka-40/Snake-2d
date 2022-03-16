import arrLang from './lang.js';

// Btns

const gameStartBtns = document.querySelectorAll('.modal__btn_start'),
  gamePauseBtn = document.getElementById('btn-pause'),
  gameContinueBtns = document.querySelectorAll('.modal__btn_continue'),
  gameRestartBtns = document.querySelectorAll('.modal__btn_restart'),
  gameExitBtns = document.querySelectorAll('.modal__btn_exit'),
  gameSettingsBtns = document.querySelectorAll('.modal__btn_settings'),
  gameModeBtns = document.querySelectorAll('.modal__btn_gamemode'),
  gameModeChangeBtns = document.querySelectorAll('.modal__btn_mode'),
  gameAboutBtns = document.querySelectorAll('.modal__btn_about');

// Modals

const modals = document.querySelectorAll('.modal'),
  modalStart = document.getElementById('modal-start'),
  modalPause = document.getElementById('modal-pause'),
  modalGameOver = document.getElementById('modal-over'),
  modalSettings = document.getElementById('modal-settings'),
  modalGameMode = document.getElementById('modal-gamemode'),
  modalGameWin = document.getElementById('modal-win'),
  modalAbout = document.getElementById('modal-about');

// Inputs

const radiosPlaceSize = document.querySelectorAll('.settings__radio_size'),
  radiosSpeed = document.querySelectorAll('.settings__radio_speed'),
  volumeInput = document.getElementById('settings-input-volume'),
  langInp = document.getElementById('lang-input'),
  volumeOutput = document.getElementById('volume-output');

// Joystick

const stick = document.getElementById('joystick');

const joystickTop = document.getElementById('joystick-top'),
  joystickRight = document.getElementById('joystick-right'),
  joystickDown = document.getElementById('joystick-down'),
  joystickLeft = document.getElementById('joystick-left');

// Audio

const eatSound = new Audio('/audio/eat-sound.mp3'),
  gameOverSound = new Audio('/audio/game-over.mp3'),
  backgroundSound = new Audio('/audio/background-sound.mp3'),
  gameWinSound = new Audio('/audio/new-record-sound.mp3');

backgroundSound.loop = true;

// Score-blocks

const modalScores = document.querySelectorAll('.modal__score'),
  scoreBlock = document.getElementById('score-count'),
  maxScoreClassic = document.getElementById('max-results-classic'),
  maxScoreTimelimited = document.getElementById('max-results-timelimited');

// Additionals

const timerWrapper = document.getElementById('timer');
const timerCount = document.getElementById('timer-count');
const transalateWords = document.querySelectorAll('.lang');

// Canvas

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Configs

let score = 0,
  time = 60,
  playGame = false;

const config = {
  step: 0,
  maxStep: 6,
  sizeCell: 16,
  sizeBerry: 16 / 4,
};

const snake = {
  x: 160,
  y: 160,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3,
};

let berry = {
  x: 0,
  y: 0,
};

const standartSettings = {
  language: 'en',
  gamePlace: 'medium',
  speed: 100,
  volume: 0.7,
  gameMode: 'classic',
};

let gameSettings = JSON.parse(localStorage.getItem('settings'));

if (!gameSettings) {
  gameSettings = standartSettings;
}

let maxScore = localStorage.getItem('maxScore');
let maxScoreTime = localStorage.getItem('maxScoreTime');

// Change settings functions

const renderSettings = () => {
  if (!maxScore) {
    maxScore = 0;
  }

  if (!maxScoreTime) {
    maxScoreTime = 0;
  }

  if (gameSettings.language == 'ua') {
    langInp.checked = true;
  } else if (gameSettings.language == 'en') {
    langInp.checked = false;
  }

  if (gameSettings.gameMode == 'classic') {
    document.getElementById('modal-btn-classic').classList.add('toggle');
  } else if (gameSettings.gameMode == 'timelimited') {
    document.getElementById('modal-btn-timelimited').classList.add('toggle');
  }

  volumeInput.value = gameSettings.volume * 100;
  animationVolumeInp();

  translate();
  getVolume();
  setPlaceSize();
  setSpeedSnake();
  drawScore();
};

const translate = () => {
  for (let transalateWord of transalateWords) {
    transalateWord.innerHTML =
      arrLang[gameSettings.language][transalateWord.dataset.key];
  }
};

const getVolume = () => {
  eatSound.volume =
    backgroundSound.volume =
    gameWinSound.volume =
    gameOverSound.volume =
      gameSettings.volume;
};

const setPlaceSize = () => {
  if (gameSettings.gamePlace == 'small') {
    canvas.width = 320;
    canvas.height = 320;

    document.querySelector('input[data-size="small"]').checked = true;
  } else if (gameSettings.gamePlace == 'medium') {
    canvas.width = 400;
    canvas.height = 400;

    document.querySelector('input[data-size="medium"]').checked = true;
  } else if (gameSettings.gamePlace == 'large') {
    canvas.width = 480;
    canvas.height = 480;

    document.querySelector('input[data-size="large"]').checked = true;
  }
};

const setSpeedSnake = () => {
  if (gameSettings.speed == 150) {
    document.querySelector('input[data-speed="150"]').checked = true;
  } else if (gameSettings.speed == 100) {
    document.querySelector('input[data-speed="100"]').checked = true;
  } else if (gameSettings.speed == 75) {
    document.querySelector('input[data-speed="75"]').checked = true;
  }
};

const drawScore = () => {
  scoreBlock.innerHTML = score;
  maxScoreClassic.innerHTML = maxScore;
  maxScoreTimelimited.innerHTML = maxScoreTime;
};

const changeSettings = () => {
  localStorage.removeItem('settings');
  localStorage.setItem('settings', JSON.stringify(gameSettings));
};

// Auxiliary functions

const drawScoreInModal = () => {
  for (let modalScore of modalScores) {
    modalScore.innerHTML = score;
  }
};

const closeModals = () => {
  for (let modal of modals) {
    modal.classList.remove('active');
  }
};

const playBackSound = () => {
  playGame ? backgroundSound.play() : backgroundSound.pause();
};

const volumeInputChange = () => {
  gameSettings.volume = volumeInput.value / 100;

  changeSettings();
  getVolume();
  animationVolumeInp();
};

const animationVolumeInp = () => {
  volumeInput.style.backgroundSize =
    ((volumeInput.value - volumeInput.min) * 100) /
      (volumeInput.max - volumeInput.min) +
    '% 100%';
  volumeOutput.value = volumeInput.value;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const toggleStick = () => {
  stick.classList.toggle('active');
};

const refreshGame = () => {
  score = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  randomPositionBerry();
};

const refreshTimer = () => {
  time = 60;
  timerCount.innerHTML = time;
};

// Timer

const timer = () => {
  const thisTimer = setInterval(() => {
    if (playGame) {
      time--;

      if (time < 10) {
        time = `0${time}`;
      }

      if (time < 1) {
        gameToggle();
        toggleStick();

        modalGameWin.classList.add('active');
        gameWinSound.play();

        if (score > maxScoreTime) {
          maxScoreTime = score;
          localStorage.setItem('maxScoreTime', maxScoreTime);
        }

        drawScoreInModal();
        time = 60;

        clearInterval(thisTimer);
      }
    } else {
      clearInterval(thisTimer);
    }

    timerCount.innerHTML = time;
  }, 1000);
};

// Gameplay

const gameToggle = () => {
  playGame ? (playGame = false) : (playGame = true);

  toggleStick();
  playBackSound();
};

const startGame = () => {
  if (gameSettings.gameMode == 'classic') {
    timerWrapper.classList.remove('active');
    gameToggle();
  } else if (gameSettings.gameMode == 'timelimited') {
    timerWrapper.classList.add('active');
    gameToggle();
    timer();
  }
};

const gameLoop = () => {
  setTimeout(() => {
    requestAnimationFrame(() => {
      if (playGame) {
        gameLoop();
      }
    });

    config.step = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
  }, gameSettings.speed);
};

const drawSnake = () => {
  snake.x += snake.dx;
  snake.y += snake.dy;

  collisionBorder();

  snake.tails.unshift({
    x: snake.x,
    y: snake.y,
  });

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach((item, index) => {
    index == 0
      ? (context.fillStyle = '#26B08F')
      : (context.fillStyle = '#27574C');

    context.fillRect(item.x, item.y, config.sizeCell, config.sizeCell);

    if (item.x === berry.x && item.y === berry.y) {
      eatSound.play();
      snake.maxTails++;
      randomPositionBerry();
      incScore();
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (item.x == snake.tails[i].x && item.y == snake.tails[i].y) {
        gameToggle();
        drawScoreInModal();

        modalGameOver.classList.add('active');
        gameOverSound.play();
      }
    }
  });
};

const randomPositionBerry = () => {
  berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
  berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
};

const drawBerry = () => {
  context.beginPath();
  context.fillstyle = '#e51d5c';
  context.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  context.fill();
};

const incScore = () => {
  score++;

  if (score > maxScore && gameSettings.gameMode == 'classic') {
    gameWinSound.play();
    maxScore = score;
    localStorage.setItem('maxScore', maxScore);
  }

  drawScore();
};

const collisionBorder = () => {
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
};

// Game controls

const moveTop = () => {
  if (snake.dy != config.sizeCell) {
    snake.dy = -config.sizeCell;
    snake.dx = 0;
  }
};

const moveRight = () => {
  if (snake.dx != -config.sizeCell) {
    snake.dx = config.sizeCell;
    snake.dy = 0;
  }
};

const moveDown = () => {
  if (snake.dy != -config.sizeCell) {
    snake.dy = config.sizeCell;
    snake.dx = 0;
  }
};

const moveLeft = () => {
  if (snake.dx != config.sizeCell) {
    snake.dx = -config.sizeCell;
    snake.dy = 0;
  }
};

document.addEventListener('keydown', (e) => {
  let keyCode = e.code;

  if (keyCode == 'KeyW' || keyCode == 'ArrowUp') {
    moveTop();
  } else if (keyCode == 'KeyA' || keyCode == 'ArrowLeft') {
    moveLeft();
  } else if (keyCode == 'KeyS' || keyCode == 'ArrowDown') {
    moveDown();
  } else if (keyCode == 'KeyD' || keyCode == 'ArrowRight') {
    moveRight();
  }

  if (keyCode == 'Escape' || keyCode == 'Space') {
    if (!playGame && modalPause.classList.contains('active')) {
      closeModals();
      gameToggle();
      requestAnimationFrame(gameLoop);
    } else {
      gameToggle();
      modalPause.classList.add('active');
    }
  }
});

joystickTop.addEventListener('click', moveTop);
joystickRight.addEventListener('click', moveRight);
joystickDown.addEventListener('click', moveDown);
joystickLeft.addEventListener('click', moveLeft);

// Menu controls

for (let gameStartBtn of gameStartBtns) {
  gameStartBtn.addEventListener('click', () => {
    closeModals();
    startGame();
    requestAnimationFrame(gameLoop);
  });
}

gamePauseBtn.addEventListener('click', () => {
  if (playGame) {
    gameToggle();
    modalPause.classList.add('active');
  } else {
    gameToggle();
    requestAnimationFrame(gameLoop);
  }
});

for (let gameContinueBtn of gameContinueBtns) {
  gameContinueBtn.addEventListener('click', () => {
    closeModals();
    gameToggle();
    requestAnimationFrame(gameLoop);

    if (gameSettings.gameMode == 'timelimited') {
      timer();
    }
  });
}

for (let gameRestartBtn of gameRestartBtns) {
  gameRestartBtn.addEventListener('click', () => {
    refreshTimer();

    closeModals();
    startGame();
    refreshGame();
    requestAnimationFrame(gameLoop);
  });
}

for (let gameExitBtn of gameExitBtns) {
  gameExitBtn.addEventListener('click', () => {
    closeModals();
    modalStart.classList.add('active');
    refreshTimer();

    refreshGame();
  });
}

for (let gameModeBtn of gameModeBtns) {
  gameModeBtn.addEventListener('click', () => {
    closeModals();
    modalGameMode.classList.add('active');
  });
}

for (let gameSettingsBtn of gameSettingsBtns) {
  gameSettingsBtn.addEventListener('click', () => {
    closeModals();
    modalSettings.classList.add('active');
  });
}

for (let gameAboutBtn of gameAboutBtns) {
  gameAboutBtn.addEventListener('click', () => {
    closeModals();
    modalAbout.classList.add('active');
  });
}

// Game mode

for (let gameModeChangeBtn of gameModeChangeBtns) {
  gameModeChangeBtn.addEventListener('click', (e) => {
    gameModeChangeBtns.forEach((item) => {
      item.classList.remove('toggle');
    });

    gameModeChangeBtn.classList.add('toggle');
    gameSettings.gameMode = e.target.dataset.mode;
    changeSettings();
  });
}

// Game settings

langInp.addEventListener('change', () => {
  langInp.checked
    ? (gameSettings.language = 'ua')
    : (gameSettings.language = 'en');
  translate();

  changeSettings();
});

for (let radioPlaceSize of radiosPlaceSize) {
  radioPlaceSize.addEventListener('change', (e) => {
    gameSettings.gamePlace = e.target.dataset.size;
    setPlaceSize();

    changeSettings();
  });
}

for (let radioSpeed of radiosSpeed) {
  radioSpeed.addEventListener('change', (e) => {
    gameSettings.speed = parseInt(e.target.dataset.speed);
    setSpeedSnake();

    changeSettings();
  });
}

volumeInput.addEventListener('input', volumeInputChange);

// Start =)

renderSettings();
