import React, { useState } from 'react';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'

const arrowUp = <FontAwesomeIcon icon={faAngleUp} />
const arrowDown = <FontAwesomeIcon icon={faAngleDown} />
const play = <FontAwesomeIcon icon={faPlay} />
const pause = <FontAwesomeIcon icon={faPause} /> // the icon is either play or pause depending on current state
const reset = <FontAwesomeIcon icon={faRedoAlt} />

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [inSession, setSession] = useState(true); // if in session, set to true; if in break - false
  const [timeLeft, setTimeLeft] = useState(sessionLength + ':00');
  const [running, setRunning] = useState(true);


  function breakDec() {
    if (!inSession) {
      setTimeLeft(function (state) {
        let newState = state.split(':');
        if (newState[0] > 1) {
          newState[0] = breakLength - 1;
        } if (newState[0] < 10 && newState[0][0] !== '0') {
          newState[0] = '0' + newState[0];
        }
        return newState.join(':')
      });
    }
    setBreakLength(state => state > 1 ? --state : state);
  }
  function breakInc() {
    setBreakLength(state => state < 60 ? ++state : state);
    if (!inSession) {
      setTimer();
    }
  }
  function ssDec() {
    if (inSession) {
      setTimeLeft(function (state) {
        let newState = state.split(':');
        if (newState[0] > 1) {
          newState[0] = sessionLength - 1;
        } if (newState[0] < 10 && newState[0][0] !== '0') {
          newState[0] = '0' + newState[0];
        }
        return newState.join(':')
      });
    }
    setSessionLength(function (state) {
      if (state > 1) {
        state -= 1;
      }
      return state;
    });
  }
  function ssInc() {
    setSessionLength(state => state < 60 ? ++state : state);
    setTimer();
  }

  function setTimer() {
    setTimeLeft(function (state) {
      let newState = state.split(':');
      if (inSession && newState[0] < 60) {
        newState[0] = sessionLength + 1;
      } if (!inSession && newState[0] < 60) {
        newState[0] = breakLength + 1;
      } if (newState[0] < 10) {
        newState[0] = '0' + newState[0];
      }
      return newState.join(':')
    });
  }


  function getNewTime(time) {
    if (time === '00:00') {
      if (inSession) {
        setSession(state => !state);
        return (breakLength < 10) ? '0' + breakLength + ':00' : breakLength + ':00';
      } else {
        setSession(state => !state);
        return (sessionLength < 10) ? '0' + sessionLength + ':00' : sessionLength + ':00';

      }
    }

    let minutesLeft = time.split(':')[0] * 1;
    let secondsLeft = time.split(':')[1];

    if (minutesLeft > 0) {
      if (secondsLeft === '00') {
        secondsLeft = 59;
        minutesLeft -= 1;
      } else {
        secondsLeft = secondsLeft * 1 - 1;
      }

    }

    if (minutesLeft == 0) {
      if (secondsLeft != '00') {
        secondsLeft = secondsLeft * 1 - 1;
      } if (secondsLeft == '00') {
        let beepSound = document.getElementById('beep');
        beepSound.play();
        return '00:00'
      }
    }

    let res;
    if (minutesLeft < 10) {
      minutesLeft = '0' + minutesLeft;
    }
    if (secondsLeft > 9) {
      res = minutesLeft + ':' + secondsLeft;
    } else {
      res = minutesLeft + ':0' + secondsLeft;
    }
    return res;
  }

  function start_pause() {
    if (running) {
      setRunning(stateRun => !stateRun);
      let interval = setInterval(() => { setTimeLeft(state => getNewTime(state)) }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    } else {
      setRunning(stateRun => !stateRun);
      clearInterval(localStorage.getItem("interval-id"));
    }
  }

  function resetTime() {
    let beepSound = document.getElementById('beep');
    beepSound.pause();
    beepSound.load();
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft('25:00');
    setSession(true);
    setRunning(true);
    clearInterval(localStorage.getItem("interval-id"));
  }


  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='unselectable'>Pomodoro Timer</h1>
        <div className='flex-container big'>
          <div id='break-label'>
            <h3 className='unselectable'>Break length</h3>
            <div className='flex-container small'>
              <div id='break-decrement' className='btn' onClick={breakDec}>{arrowDown}</div>
              <div className='time-setter unselectable'><span id='break-length'>{breakLength}</span>:00</div>
              <div id='break-increment' className='btn' onClick={breakInc}>{arrowUp}</div>
            </div>
          </div>
          <div id='session-label'>
            <h3 className='unselectable'>Session length</h3>
            <div className='flex-container'>
              <div id='session-decrement' className='btn' onClick={ssDec}>{arrowDown}</div>
              <div className='time-setter unselectable'><span id='session-length'>{sessionLength}</span>:00</div>
              <div id='session-increment' className='btn' onClick={ssInc}>{arrowUp}</div>
            </div>
          </div>
        </div>
        <div id='timer-label'>
          <h2 className='unselectable'>{inSession ? 'Session' : 'Break'}</h2>
          <div id='time-left' className='unselectable'>{timeLeft}</div>
        </div>
        <div className='flex-container'>
          <div id='start_stop' className='btn' onClick={start_pause}>{running ? play : pause}</div>
          <div id='reset' className='btn' onClick={resetTime}>{reset}</div>
        </div>
        <audio id="beep" preload="auto" src="https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3" />
      </header>
    </div>
  );
}

export default App;
