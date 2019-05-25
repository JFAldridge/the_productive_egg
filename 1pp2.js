let sessionLength = 25;
let breakLength = 5;
let cDown;
let paused = false;
let sessionOrBreak = 'session';
let breakFirst = false;
let newSlate = true;
let counting = false;
let timerCount = 2;
let timerCountDown = 2;

const tCountPlus = document.querySelector('#timer-count-plus');
const tCount = document.querySelector('#timer-count');
const tCountMinus = document.querySelector('#timer-count-minus');
const onlySession = document.querySelector('#session-cycle');
const onlyBreak = document.querySelector('#break-cycle');
const cycleDisplay = document.querySelector("#cycle-display-container");
const sessionScreen = document.querySelector("#session-screen");
const breakScreen = document.querySelector("#break-screen");
const timerScreen = document.querySelector("#timer-screen");

const chevronArr = [...document.querySelectorAll(".chevron")];
const controlsArr = [...document.querySelectorAll(".controls")];

const sessionHourMinSec = {
    hour: 0,
    min: 25,
    sec: 0
};
const breakHourMinSec = {
    hour: 0,
    min: 5,
    sec: 0
};

function convertHourMinSec(whichTimer) {
    if (whichTimer === 'session') {
        if (counting) {
            if (sessionHourMinSec.sec === -1) {
                sessionHourMinSec.sec = 59;
                sessionHourMinSec.min --;
            }
        }
        if (sessionHourMinSec.min === -1) {
            sessionHourMinSec.min = 59;
            sessionHourMinSec.hour --;
        } else if (sessionHourMinSec.min === 60) {
            sessionHourMinSec.min = 0;
            sessionHourMinSec.hour ++;
        }
    } else if (whichTimer === 'break') {
        if (counting) {
            if (breakHourMinSec.sec === -1) {
                breakHourMinSec.sec = 59;
                breakHourMinSec.min --;
            }
        }
        if (breakHourMinSec.min === -1) {
            breakHourMinSec.min = 59;
            breakHourMinSec.hour --;
        } else if (breakHourMinSec.min === 60) {
            breakHourMinSec.min = 0;
            breakHourMinSec.hour ++;
        }
    }
}

function screenUpdate(screenType) {
    let whichTimer;
    if (screenType === 'timer') {
        whichTimer = sessionOrBreak;
    } else {
        whichTimer = screenType;
    }
    convertHourMinSec(whichTimer);
    
    if (screenType === 'timer') {
        if (sessionOrBreak === 'session'){
            timerScreen.innerText = `${(sessionHourMinSec.hour).toString().padStart(2, '0')}:${(sessionHourMinSec.min).toString().padStart(2, '0')}:${(sessionHourMinSec.sec).toString().padStart(2, '0')}`
        } else if (sessionOrBreak === 'break') {
            timerScreen.innerText = `${(breakHourMinSec.hour).toString().padStart(2, '0')}:${(breakHourMinSec.min).toString().padStart(2, '0')}:${(breakHourMinSec.sec).toString().padStart(2, '0')}`
        }
    } else if (screenType === 'session') {
        sessionScreen.innerText = sessionLength.toString();
        if (sessionOrBreak === 'session'){
            timerScreen.innerText = `${(sessionHourMinSec.hour).toString().padStart(2, '0')}:${(sessionHourMinSec.min).toString().padStart(2, '0')}:${(sessionHourMinSec.sec).toString().padStart(2, '0')}`
        }
    } else if (screenType === 'break') {
    breakScreen.innerText = breakLength.toString();
    if (sessionOrBreak === 'break') {
        timerScreen.innerText = `${(breakHourMinSec.hour).toString().padStart(2, '0')}:${(breakHourMinSec.min).toString().padStart(2, '0')}:${(breakHourMinSec.sec).toString().padStart(2, '0')}`
        }
    }

    if (screenType === 'tCount') {
        if (counting) {
            tCount.innerText = timerCountDown;
        } else {
            tCount.innerText = timerCount;
        }
    }
}

const chevronActions = {
    'session-up'(targetBtn) {
    if (paused || counting && sessionOrBreak === 'session') {
        return;
    } else {
        sessionLength ++;
        sessionHourMinSec.min ++;
        screenUpdate('session')
    }
    },
    'session-down'(targetBtn) {
        if (paused || sessionHourMinSec.min === 0 || counting && sessionOrBreak === 'session') {
        return;
    } else {
        sessionLength --;
        sessionHourMinSec.min --;
        screenUpdate('session')
    }
    },
    'break-up'(targetBtn) {
    if (paused || counting && sessionOrBreak === 'break') {
        return;
    } else {
        breakLength ++;
        breakHourMinSec.min ++;
        screenUpdate('break')
    }
    },
    'break-down'(targetBtn) {
    if (paused || breakHourMinSec.min === 0 || counting && sessionOrBreak === 'break') {
        return;
    } else {
        breakLength --;
        breakHourMinSec.min --;
        screenUpdate('break')
    }
    }
}

chevronArr.map(chevron => {chevron.addEventListener('mousedown', function(e) {
    chevronActions[e.target.id](e.target);
})})
chevronArr.map(chevron => {chevron.addEventListener('mouseup', function(e) {

})})

chevronArr.map(chevron => {chevron.addEventListener('mouseout', function(e) {

})})


function resetTimers(timer) {

    if (timer === 'session' || timer === 'both'){
    sessionHourMinSec.hour = 0;
    sessionHourMinSec.min = sessionLength;
    sessionHourMinSec.sec = 0;
    }
    if (timer === 'break' || timer === 'both'){
    breakHourMinSec.hour = 0;
    breakHourMinSec.min = breakLength;
    breakHourMinSec.sec = 0;
    }
}

function countDown () {
    if (sessionOrBreak === "session") {
    cDown = setInterval(function(){
        if (sessionHourMinSec.hour || sessionHourMinSec.min || sessionHourMinSec.sec) {
        sessionHourMinSec.sec --;
        screenUpdate('timer');
        } else {
        clearInterval(cDown);
        timerCountDown--;
        screenUpdate('tCount');
        counting = false;
        sessionOrBreak = 'break';
        onlySession.classList.add('inactive-cycle');
        onlyBreak.classList.remove('inactive-cycle');
        resetTimers('session')
        if (timerCountDown) {
            controlActions['start']();
        } else {
            setTimeout(function(){
                controlActions['stop']();
            },2000)
        }
        }
    }, 1000)
    } else if (sessionOrBreak === 'break') {
    cDown = setInterval(function(){
        if (breakHourMinSec.hour || breakHourMinSec.min || breakHourMinSec.sec) {
        breakHourMinSec.sec --;
        screenUpdate('timer');
        } else {
        clearInterval(cDown);
        timerCountDown--;
        screenUpdate('tCount');
        counting = false;
        sessionOrBreak = 'session';
        onlyBreak.classList.add('inactive-cycle');
        onlySession.classList.remove('inactive-cycle');
        resetTimers('session')
        if (timerCountDown) {
            controlActions['start']();
        } else {
            setTimeout(function(){
                controlActions['stop']();
            },2000)
        }
        }
    }, 1000)
    }
}

const controlActions = {
    'start'() {
    if (!counting) {
        counting = true; 
        newSlate = false;
        paused = false;
        countDown();
    }
    },
    'pause'() {
    clearInterval(cDown);
    counting = false;
    paused = true;
    },
    'reset'() {
        if (sessionOrBreak === 'session') {
            sessionHourMinSec.hour = 0;
            sessionHourMinSec.min = sessionLength;
            sessionHourMinSec.sec = 0;
            screenUpdate('session');
        } else if (sessionOrBreak === 'break') {
            breakHourMinSec.hour = 0;
            breakHourMinSec.min = breakLength;
            breakHourMinSec.sec = 0;
            screenUpdate('break');
    }
    },
    'stop'() {
        paused = false;
        newSlate = true;
        clearInterval(cDown);
        counting = false;
        timerCountDown = timerCount;
        screenUpdate("tCount");
        resetTimers('both');
        if (!breakFirst) {
            sessionOrBreak = 'session';
            onlySession.classList.remove('inactive-cycle');
            onlyBreak.classList.add('inactive-cycle');
            screenUpdate('timer');
        } else if (breakFirst) {
            sessionOrBreak = 'break';
            onlyBreak.classList.remove('inactive-cycle');
            onlySession.classList.add('inactive-cycle');        
            screenUpdate('timer');
        }
    }
}

controlsArr.map(control => {control.addEventListener('click', function(e) {
    controlActions[e.target.id]();
})})

function changeCycle(target) {
    if (newSlate){
    onlyBreak.classList.toggle('inactive-cycle');
    onlySession.classList.toggle('inactive-cycle');
    if (sessionOrBreak === 'session'){
        sessionOrBreak = 'break';
        breakFirst = true;
        screenUpdate('break');
    } else {
        breakFirst = false;
        sessionOrBreak = 'session';
        screenUpdate('session');
    }
    }
}

cycleDisplay.addEventListener('click', function(e) {
    changeCycle(e.target)
});

tCountPlus.addEventListener('click', function(){
    timerCount++;
    timerCountDown++;
    screenUpdate('tCount');
});

tCountMinus.addEventListener('click', function(){
    timerCount--;
    timerCountDown--;
    screenUpdate('tCount');
})