// All Variables 
let coutnOfQuestions = document.querySelector('.quiz-info .count span');
let bulletsSpans = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let countDownElement = document.querySelector('.countdown');
let failAudio = document.querySelector('.fail');
let successAudio = document.querySelector('.success');
let done = document.querySelector('.done');
let fullMark = document.querySelector('.full-mark');
let zeroDone = document.querySelector('.zero-done');

// Set Settings
let currentIndex = 0;
let randomAry;
let rightAnswers = 0;
let countDownInterval;



// Ajax to get questions 
function getQuesrtion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      createBullets(qCount);
      // Generate Array From 0 to qCount
      randomAry = [ ...Array(qCount).keys() ];
      shuffle(randomAry, qCount);

      // Add Random Question and Answers
      addQuestionsData(questionsObject[ randomAry[ currentIndex ] ], qCount);

      // Count Down 
      countDown(6, qCount);

      // Handle When Click On Submit Button
      submitButton.addEventListener("click", () => {
        // Get the right answer
        let theRightAnswer = questionsObject[ randomAry[ currentIndex ] ].right_answer;
        // Increment currentIndex
        currentIndex++;
        // Stop The previous interval
        clearInterval(countDownInterval);
        // Start Count Down 
        countDown(6, qCount);
        // Check if the Checked answer is true or false
        checkAnswer(theRightAnswer, qCount);
        // remove old question and answers
        quizArea.innerHTML = '';
        answersArea.innerHTML = '';
        // ### Random Add the next question and Answers ###
        addQuestionsData(questionsObject[ randomAry[ currentIndex ] ], qCount);
        // handle bullets
        if (currentIndex < qCount) {
          bulletsSpans.children[ currentIndex ].className = 'on';
        }
        // show result 
        showResult(qCount);
      });
    }
  }

  myRequest.open('GET', "html_questions.json", true);
  myRequest.send();
}

getQuesrtion();

function createBullets(num) {
  coutnOfQuestions.innerText = num;

  for (let index = 0; index < num; index++) {
    // create span  
    let span = document.createElement('span');
    // Check if first span
    if (index == 0) {
      span.classList.add('on');
    }
    // append span to bulletsSpans
    bulletsSpans.appendChild(span);
  }
}



function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement('h2');

    let question = document.createTextNode(obj[ 'title' ]);

    questionTitle.appendChild(question);

    quizArea.appendChild(questionTitle);

    // Create All Answers 
    for (let index = 1; index <= 4; index++) {
      let div = document.createElement('div');
      div.className = 'answer';
      let input = document.createElement('input');
      input.name = 'questions';
      input.id = `answer_${index}`;
      input.type = 'radio';
      input.dataset.answer = obj[ `answer_${index}` ];
      if (index === 1) {
        input.setAttribute('checked', 'checked');
      }
      let label = document.createElement('label');
      label.setAttribute('for', `answer_${index}`);
      let answer = document.createTextNode(obj[ `answer_${index}` ]);
      label.appendChild(answer);

      // Append the radio and label for div answer
      div.appendChild(input);
      div.appendChild(label);

      // Append div answer to answersArea
      answersArea.appendChild(div);
    }
  } else {
    submitButton.classList.add('stop-submit-button');
  }
}

// Function To Check If Answer Is True Or False 
function checkAnswer(rAnswer, count) {
  let allAnswers = document.getElementsByName('questions');
  let checkedAnswer;

  for (let index = 0; index < allAnswers.length; index++) {
    if (allAnswers[ index ].checked) {
      checkedAnswer = allAnswers[ index ].dataset.answer;
    }
  }
  if (rAnswer === checkedAnswer) {
    rightAnswers++;
    (currentIndex < count) ? successAudio.play() : '';
  } else {
    (currentIndex < count) ? failAudio.play() : '';
  }
}

function showResult(qcount) {
  if (currentIndex >= qcount) {
    console.log('done')
    // remove element and show Done msg
    answersArea.remove();
    quizArea.textContent = 'Done 😉';
    quizArea.style.fontWeight = 'bold';
    quizArea.style.fontSize = '30px';

    // ### Handle Result ###
    let result = document.querySelector('.results');
    let span = document.createElement('span');
    let status = (rightAnswers == qcount) ? 'perfect' : (rightAnswers > qcount / 2) ? 'good' : 'bad';
    let rate = document.createTextNode(status);
    span.className = status;
    span.appendChild(rate);

    result.appendChild(span);
    let msg;
    if (rightAnswers === 0) {
      zeroDone.play();
      msg = document.createTextNode(` you are zebala and you have to tobezzz 🤸🏼‍♂️, You answered ${rightAnswers} from ${qcount}`);
    } else {
      (rightAnswers === qcount) ? fullMark.play() : done.play();
      msg = document.createTextNode(` You answered ${rightAnswers} from ${qcount}`);
    }
    let msgSpan = document.createElement('span');
    msgSpan.appendChild(msg);
    result.appendChild(msgSpan);
    result.classList.add('show-results');
  }
}

function countDown(duration, qcount) {
  if (currentIndex < qcount) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      countDownElement.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}


/*   shuffle function   */
function shuffle(array, current) {
  let temp, random;
  while (current > 0) {
    // Get Random Element
    random = Math.floor(Math.random() * current);
    // Decrease Length By One
    current--;
    // save current element in [stash] = [temp]
    temp = array[ current ];
    // current element = random element[Get By index]
    array[ current ] = array[ random ];
    // random element = Get element from [stash] = [temp]
    array[ random ] = temp;
  }
  //return array;
}