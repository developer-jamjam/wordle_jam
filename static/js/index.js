let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const gameClear = (result) => {
    window.removeEventListener("keydown", handleKeyDown);
    const div = document.createElement("div");
    div.style =
      "display: flex; justify-content: center; align-items: center; position:absolute; top: 40vh; left:45vw; width:200px;height:100px;font-weight:bold;background-color:white";
    document.body.appendChild(div);
    clearInterval(timer);
    if (result === "clear") {
      div.innerText = "★정답★ GAME CLEAR ★";
    } else {
      div.innerText = "◈ GAME OVER ◈";
    }
  };
  const nextLine = () => {
    attempts += 1;
    index = 0;
    if (attempts === 6) {
      gameClear("over");
      return;
    }
  };
  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };
  const handleEnterKey = async () => {
    //정답확인 로직
    let successCount = 0;
    const response = await fetch("/answer");
    const answer = await response.json(); //javascript object notation

    console.log(answer);

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const inputText = block.innerText;
      const answerText = answer[i];
      if (inputText === answerText) {
        //위치 & 글자 다 맞았을 때
        block.style.background = "#5ded96";
        successCount += 1;
      } else if (answer.includes(inputText)) {
        //위치는 틀리지만 들어간 글자가 맞았을 때
        block.style.background = "#f2f211";
      } else {
        //아예 틀릴 때
        block.style.background = "#78899a";
      }
      block.style.color = "white";
      block.style.fontWeight = "bold";
    }

    if (successCount === 5) {
      gameClear("clear");
    } else {
      nextLine();
    }
  };
  const handleKeyDown = (e) => {
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    console.log(index);
    if (e.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (e.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1; //index = index + 1 과 같은 표현 , index++로도 가능
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);

      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0"); // 문자열로 변경 .toString()
      const timeH1 = document.querySelector("#time");
      timeH1.innerText = `${분} : ${초}`; //백틱 , padStart
    }

    timer = setInterval(setTime, 1000);
  };
  startTimer();
  window.addEventListener("keydown", handleKeyDown);
  //addEventListener 안에 있는 함수는 암묵적으로 event 전달된다.
}

appStart();
