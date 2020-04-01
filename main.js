// 배열 자료 구조 제작
let crateMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));

// DOM 참조
const $matrix = document.querySelector('.matrix');
const $test = document.querySelector('.test');
const $inputBox = document.querySelector('.inputBox');
const $submit = document.querySelector('.submit');
const $init = document.querySelector('.init');
const $dirX = document.getElementById('dirX');
const $caption = document.querySelector('.caption');
const $warningMaxText = document.querySelector('.warningMaxText');
const $warningMacthText = document.querySelector('.warningMacthText');


// 초기 Data
let position = ['0', '0']; // 초기 좌표
let dataSheet = []; // 초기 Data
let overtext = true; // Text 입력 글자 수 제한
let matchtext = true; // Text 입력 매칭


// 초기 랜더링 즉시 실행 함수
(function firstRender() {
  crateMatrix.forEach((yv, yi) => {
    $matrix.innerHTML += `<div class="y${yi}"></div>`;
    const $yAxis = document.querySelector(`.y${yi}`);

    yv.forEach((_, xi) => {
      $yAxis.innerHTML += `<div class="x${xi} contentBox">${''}</div>`;
    });
  });
}());


// 랜더링 함수(자료구조의 Data를 랜더링)
function rendering() {
  crateMatrix.forEach((yv, yi) => {
    yv.forEach((_, xi) => {
      const temp = document.querySelector(`.matrix > .y${yi} > .x${xi}`);
      temp.innerHTML = crateMatrix[yi][xi];
    });
  });
}


// 자료구조 초기화 함수
function initialize() {
  crateMatrix = crateMatrix.map(yv => yv.map(() => ''));
  dataSheet = [];
}


// 초기화 실험용
$init.onclick = () => {
  initialize();
  console.log(crateMatrix);
  rendering();
};

// 포커스 삭제 함수
function focusOut() {
  crateMatrix.forEach((yv, yi) => {
    yv.forEach((xv, xi) => {
      const temp = document.querySelector(`.matrix > .y${yi} > .x${xi}`);
      temp.classList.remove('choice');
    });
  });
}


// 좌표 취득 logic
$matrix.onclick = e => {
  if (!e.target.matches('.contentBox')) return;
  focusOut();

  const temp = `${e.target.className}, ${e.target.parentElement.className}`;
  position = temp.match(/[0-9]/g);
  $test.innerHTML = `X축 좌표 : ${position[0]}<br>Y축 좌표 : ${position[1]}`;

  e.target.classList.add('choice');
};


// input Box text 제한 logic
$inputBox.onblur = () => {
  if ($dirX.checked) {
    overtext = $inputBox.value.length <= crateMatrix[0].length - position[0] || false;
    $warningMaxText.textContent = overtext ? '' : `글자수를 초과하였습니다. ${crateMatrix[0].length - position[0]}자 이내로 작성해 주세요`;
  } else {
    overtext = $inputBox.value.length <= crateMatrix.length - position[1] || false;
    $warningMaxText.textContent = overtext ? '' : `글자수를 초과하였습니다. ${crateMatrix.length - position[1]}자 이내로 작성해 주세요`;
  }
  if (!overtext) return;

  const arrText = [...$inputBox.value];
  const tempMatrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ''));

  arrText.forEach((v, i) => {
    if ($dirX.checked) {
      tempMatrix[Number(position[1])][i + Number(position[0])] = v;
    } else {
      tempMatrix[i + Number(position[1])][Number(position[0])] = v;
    }
  });

  let warningText = '';
  let warningCount = 0;

  tempMatrix.forEach((yv, yi) => {
    yv.forEach((xv, xi) => {
      if (crateMatrix[yi][xi] !== '') {
        if (crateMatrix[yi][xi] !== xv && xv !== '') {
          warningCount += 1;
          warningText = `동일하지 않은 문자가 ${warningCount}개 존재합니다`;
        }
      }
    });
  });
  matchtext = warningCount === 0 || false;
  $warningMacthText.textContent = warningText;
};


// 데이터를 저장 logic
$submit.onclick = () => {
  if (!overtext || !matchtext) return;

  const dir = $dirX.checked ? 1 : 0;
  const arrText = [...$inputBox.value];

  const objData = {
    X: `${position[0]}`,
    Y: `${position[1]}`,
    direction: dir,
    value: $inputBox.value,
    caption: $caption.value
  };
  dataSheet.push(objData);

  arrText.forEach((v, i) => {
    if ($dirX.checked) {
      crateMatrix[Number(position[1])][i + Number(position[0])] = v;
    } else {
      crateMatrix[i + Number(position[1])][Number(position[0])] = v;
    }
  });
  console.log(crateMatrix);

  rendering();
  console.log(dataSheet);
  $inputBox.value = '';
  $caption.value = '';
};

console.dir($dirX);
