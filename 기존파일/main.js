// 2중 배열 자료 구조 제작
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
const $warningEmtpyInputText = document.querySelector('.warningEmptyInputText');
const $warningEmtpyCaptionText = document.querySelector('.warningEmptyCaptionText');
const $crate = document.querySelector('.crate');
const $problem = document.querySelector('.problem');
const $problemBtn = document.querySelector('.problemBtn');
const $crateBtn = document.querySelector('.crateBtn');


// 초기 Data
let position = ['0', '0']; // 초기 좌표
let dataSheet = []; // 초기 Data
let overtext = true; // Text 입력 글자 수 제한
let matchtext = true; // Text 입력 매칭
let inputText = false; // input 빈문자 감지
let captionText = false; // caption 빈문자 감지


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


// 랜더링 함수(matrix 자료구조의 Data를 랜더링)
function rendering() {
  crateMatrix.forEach((yv, yi) => {
    yv.forEach((_, xi) => {
      const temp = document.querySelector(`.matrix > .y${yi} > .x${xi}`);
      temp.innerHTML = crateMatrix[yi][xi];
    });
  });
}


// text 초과 제어 함수
function overtextFunc() {
  if ($dirX.checked) {
    overtext = $inputBox.value.length <= crateMatrix[0].length - position[0] || false;
    $warningMaxText.textContent = overtext ? '' : `글자수를 초과하였습니다. ${crateMatrix[0].length - position[0]}자 이내로 작성해 주세요`;
  } else {
    overtext = $inputBox.value.length <= crateMatrix.length - position[1] || false;
    $warningMaxText.textContent = overtext ? '' : `글자수를 초과하였습니다. ${crateMatrix.length - position[1]}자 이내로 작성해 주세요`;
  }
}


// text match 함수
function matchtextFunc() {
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
}


// input 요소 빈문자 감지 함수
function emptyInputFunc() {
  if ($inputBox.value === '') {
    $warningEmtpyInputText.textContent = 'Text를 입력하세요';
    inputText = false;
  } else {
    $warningEmtpyInputText.textContent = '';
    inputText = true;
  }
}


// caption 요소 빈문자 감지 함수
function emptyCaptionFunc() {
  if ($caption.value === '') {
    $warningEmtpyCaptionText.textContent = 'Text를 입력하세요';
    captionText = false;
  } else {
    $warningEmtpyCaptionText.textContent = '';
    captionText = true;
  }
}


// 포커스 삭제 함수
function focusOut() {
  crateMatrix.forEach((yv, yi) => {
    yv.forEach((xv, xi) => {
      const temp = document.querySelector(`.matrix > .y${yi} > .x${xi}`);
      temp.classList.remove('choice');
    });
  });
}


// 자료구조 초기화 함수
function initialize() {
  crateMatrix = crateMatrix.map(yv => yv.map(() => ''));
  dataSheet = [];
}


// 문제 데이터 객체로 저장
function saveObjData() {
  const objData = {
    position: `${position[0]}${position[1]}`,
    direction: $dirX.checked,
    value: $inputBox.value,
    caption: $caption.value
  };
  dataSheet.push(objData);
}


// 문제 Data Matrix로 저장
function saveMatrixData() {
  const arrText = [...$inputBox.value];
  arrText.forEach((v, i) => {
    if ($dirX.checked) {
      crateMatrix[Number(position[1])][i + Number(position[0])] = v;
    } else {
      crateMatrix[i + Number(position[1])][Number(position[0])] = v;
    }
  });
}
// ---------------------------------------------------------------

// 문제풀이 버튼 이벤트
$problemBtn.onclick = () => {
  $crate.classList.add('hidden');
  $problem.classList.remove('hidden');
};

$crateBtn.onclick = () => {
  $crate.classList.remove('hidden');
  $problem.classList.add('hidden');
};

// 초기화 버튼 이벤트
$init.onclick = () => {
  initialize();
  console.log(crateMatrix);
  rendering();
};


// 매트릭스 클릭 시 좌표 취득 이벤트
$matrix.onclick = e => {
  if (!e.target.matches('.contentBox')) return;
  focusOut();

  const temp = `${e.target.className}, ${e.target.parentElement.className}`;
  position = temp.match(/[0-9]/g);
  $test.innerHTML = `X축 좌표 : ${position[0]}<br>Y축 좌표 : ${position[1]}`;

  e.target.classList.add('choice');

  dataSheet.forEach(v => {
    if (v.position === `${position[0]}${position[1]}`) console.log(v.value);
  });
};


// input Box text 제한 이벤트
$inputBox.onblur = () => {
  overtextFunc();
  if (!overtext) return;
  matchtextFunc();
  emptyInputFunc();
};

// caption text 이벤트
$caption.onblur = () => {
  emptyCaptionFunc();
};

// 데이터 저장 이벤트
$submit.onclick = () => {
  if (!overtext || !matchtext || !inputText || !captionText) return;

  saveObjData();
  saveMatrixData();
  console.log(crateMatrix);

  rendering();
  console.log(dataSheet);
  $inputBox.value = '';
  $caption.value = '';
  inputText = false;
  captionText = false;
};
