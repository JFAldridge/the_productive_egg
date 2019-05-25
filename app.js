let sessionLength = 25;
let breakLength = 5;
let cDown;
let paused = false;
let sessionOrBreak = 'session';
let breakFirst = false;
let newSlate = true;
let sessionCounting = false;
let breakCounting = false;
let chevronPress = false;
const firstBreak = document.querySelector('#first-break-cycle');
const onlySession = document.querySelector('#session-cycle');
const secondBreak = document.querySelector('#second-break-cycle');
const cycleDisplay = document.querySelector("#cycle-display-container");
const sessionScreen = document.querySelector("#session-screen");
const breakScreen = document.querySelector("#break-screen");
const timerScreen = document.querySelector("#timer-screen");

const chevronArr = [...document.querySelectorAll(".chevron")];
const controlsArr = [...document.querySelectorAll(".controls")]

let timerHourMinSec = {};
const sessionHourMinSec = {
  hour: 0,
  min: 25,
  sec: 0
};
const breakHourMinSec = {
  hour: 0,
  min: 5,
  sec: 0
}

function convertHourMinSec(screenType) {
  if (screenType === 'timer' && sessionCounting) {
    if (sessionHourMinSec.sec === -1) {
      sessionHourMinSec.sec = 59;
      sessionHourMinSec.min --;
      if (sessionHourMinSec.min === -1) {
        sessionHourMinSec.min = 59;
        sessionHourMinSec.hour --;
      } 
    } 
  } else if (screenType === 'timer' && breakCounting) {
    if (breakHourMinSec.sec === -1) {
      breakHourMinSec.sec = 59;
      breakHourMinSec.min --;
      if (breakHourMinSec.min === -1) {
        breakHourMinSec.min = 59;
        breakHourMinSec.hour --;
      } 
    } 
  } else if (screenType === 'session') {
    if (sessionHourMinSec.min === -1) {
      sessionHourMinSec.min = 59;
      sessionHourMinSec.hour --;
    } else if (sessionHourMinSec.min === 60) {
      sessionHourMinSec.min = 0;
      sessionHourMinSec.hour ++;
    }
  } else if (screenType === 'break') {
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
  convertHourMinSec(screenType);
  if (screenType === 'timer') {
    timerScreen.innerText = `${(timerHourMinSec.hour).toString().padStart(2, '0')}:${(timerHourMinSec.min).toString().padStart(2, '0')}:${(timerHourMinSec.sec).toString().padStart(2, '0')}`
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
}

const chevronActions = {
  'session-up'(targetBtn) {
    if (sessionCounting || paused) {
      return;
    } else {
      chevronPress = true;
      sessionLength ++;
      sessionHourMinSec.min ++;
      screenUpdate('session')
    }
  },
  'session-down'(targetBtn) {
      if (sessionCounting || sessionHourMinSec.min === 0 || paused) {
      return;
    } else {
      chevronPress = true;
      sessionLength --;
      sessionHourMinSec.min --;
      screenUpdate('session')
    }
  },
  'break-up'(targetBtn) {
    if (breakCounting || paused) {
      return;
    } else {
      chevronPress = true;
      breakLength ++;
      breakHourMinSec.min ++;
      screenUpdate('break')
    }
  },
  'break-down'(targetBtn) {
    if (breakCounting || breakHourMinSec.min === 0 || paused) {
      return;
    } else {
      chevronPress = true;
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
    timerHourMinSec = {};
  }
  if (timer === 'break' || timer === 'both'){
    breakHourMinSec.hour = 0;
    breakHourMinSec.min = sessionLength;
    breakHourMinSec.sec = 0;
    timerHourMinSec = {};
  }
}

function countDown () {
  if (sessionOrBreak === "session") {
    timerHourMinSec = sessionHourMinSec;
    cDown = setInterval(function(){
      if (sessionHourMinSec.hour || sessionHourMinSec.min || sessionHourMinSec.sec) {
        sessionHourMinSec.sec --;
        screenUpdate('timer');
      } else {
        clearInterval(cDown);
        sessionCounting = false;
        sessionOrBreak = 'break';
        onlySession.classList.add('inactive-cycle');
        secondBreak.classList.remove('inactive-cycle');
        controlActions['start']();
      }
    }, 1000)
  } else if (sessionOrBreak === 'break') {
    timerHourMinSec = breakHourMinSec;
    cDown = setInterval(function(){
      if (breakHourMinSec.hour || breakHourMinSec.min || sessionHourMinSec.sec) {
        breakHourMinSec.sec --;
        screenUpdate('timer');
      } else {
        clearInterval(cDown);
        resetTimers('break');
        if (breakFirst) {
          breakCounting = false;
          sessionOrBreak = 'session';
          firstBreak.classList.add('inactive-cycle');
          onlySession.classList.remove('inactive-cycle');
          controlActions['start']();
        }
      }
    }, 1000)
  }
}


const controlActions = {
  'start'() {
    if (!sessionCounting && !breakCounting) {
      sessionOrBreak === 'session' ? sessionCounting = true : breakCounting = true; 
      newSlate = false;
      countDown();
    }
  },
  'pause'() {
    clearInterval(cDown);
    sessionCounting = false;
    breakCounting = false;
    paused = true;
  },
  'reset'() {
    paused = false;
    if (sessionOrBreak === 'session') {
      timerHourMinSec.hour = 0;
      timerHourMinSec.min = breakLength;
      timerHourMinSec.sec = 0;
      screenUpdate('session');
    } else if (sessionOrBreak === 'break') {
      timerHourMinSec.hour = 0;
      timerHourMinSec.min = breakLength;
      timerHourMinSec.sec = 0;
      screenUpdate('break');
    }
  },
  'stop'() {
    newSlate = true;
    clearInterval(cDown);
    sessionCounting = false;
    breakCounting = false;
    resetTimers('both');
    if (!breakFirst) {
      sessionOrBreak = 'session';
      timerHourMinSec = sessionHourMinSec;
      screenUpdate('session');
    } else if (breakFirst) {
      sessionOrBreak = 'Break';
      timerHourMinSec = breakHourMinSec;
      screenUpdate('break');
    }
    if (breakFirst) {
      firstBreak.classList.remove('inactive-cycle');
      onlySession.classList.add('inactive-cycle');
      secondBreak.classList.add('inactive-cycle');
    } else {
      onlySession.classList.remove('inactive-cycle');
      secondBreak.classList.add('inactive-cycle');
    }
  }
}

controlsArr.map(control => {control.addEventListener('click', function(e) {
  controlActions[e.target.id]();
})})

function changeCycle(target) {
  if (newSlate){
    firstBreak.classList.toggle('remove-first-break');
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