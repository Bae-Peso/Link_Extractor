const form = document.getElementById('search-form');
const findWordInput = document.getElementById('find-word');
const statusText = document.getElementById('status');
const resultArea = document.getElementById('result');
let currentLinks = [];
let checkwarning = false;

// TODO 1: extract 버튼 (form submit) (완료)
//   - event.preventDefault()로 폼 새로고침 막기
//   - 현재 탭에 검색어 넘기고 extract.js 주입 (browser.tabs.executeScript)
//   - 결과 배열을 한 줄씩 resultArea에, 건수를 statusText에
document.querySelector("#extract-btn").addEventListener("click", async function (event) {
  event.preventDefault();

  // findWordInput의 앞뒤 공백을 제거 후 무언가의 입력을 확인 후 없으면 리스트 초기화 후 정지 (혹시나 하는 오작동 방지)
  if (findWordInput.value.trim() === '') {
    statusText.textContent = "Please input string";
    resultArea.value = '';
    currentLinks = [];
  } else {
    // 변수 초기화 및 서식 초기화
    checkwarning = false;
    statusText.classList.remove('warning');

    //  extract.js 의 searchString()을 실행하여 결과적으로 currentLinks에 링크를 리스트로서 저장
    try {
      await browser.tabs.executeScript({
        file: 'extract.js',
      });
      const results = await browser.tabs.executeScript({
        code: 'searchString(' + JSON.stringify(findWordInput.value.trim()) + ')',
      });
      const links = results[0];
      currentLinks = links;
      // 리스트 길이 확인 후 찾은 개수 반환
      if (links.length === 0) {
        resultArea.value = '';
        statusText.textContent = "No links detected";
      } else {
        resultArea.value = links.join('\n');
        statusText.textContent = `Found ${links.length} links`;
      };
    }
    catch (e) {
      // 사용할 수 없는 페이지에서 에러 반환
      statusText.textContent = "Error : This page is not supported";
      resultArea.value = '';
      currentLinks = [];
    }
  }
});

// TODO 2: txt저장 버튼 => 폐기, 사유 : 사용처가 현저히 적거나 필요 없을 기능임

// TODO 3: Open, 모두 새 탭에서 열기 버튼 (완료)
document.querySelector("#open-btn").addEventListener("click", async function (event) {
  event.preventDefault();
  let a = 0
  // 10개가 넘을 시, 재차 확인을 위해 경고 메시지 반환
  if (currentLinks.length > 10 && checkwarning === false) {
    checkwarning = true;
    statusText.classList.add('warning')
    statusText.textContent = "Warning : Found more than 10 links. If you want to continue, press 'Open' one more time.";
    return;
  }
  statusText.classList.remove('warning');
  
  // currentLinks에서 하나씩 불러와 하나씩 링크를 열어서 새창으로 보냄
  if (currentLinks.length !== 0) {
    for (const link of currentLinks) {
      // 429 에러 방지용 150ms 대기
      await new Promise(resolve =>
        setTimeout(resolve, 150));
      await browser.tabs.create({
        active: false,
        url: "https://" + link,
      });
      statusText.textContent = `Opened ${++a} of ${currentLinks.length} links`;
    };
    statusText.textContent = `Complete opening ${currentLinks.length} links`;
  };
  checkwarning = false;
});

// TODO 4: Close 버튼 → window.close() (완료)
document.querySelector("#close-btn").addEventListener("click", async function (event) {
  window.close();
});