function searchString(find_word) {
    // 웹 페이지 내의 문자열과, <a href> 속성을 지닌 모든 문자열을 리스트로 불러옴
    const string_list = document.body.innerText.split(/[\s「」<>"]+/);
    const href_list = Array.from(document.querySelectorAll('a[href]')).map(element => element.href);
    
    // find_word를 인수로서 건내 받은 후, 위의 리스트에서 해당하는 부분만 남기고 나머지는 버림
    const find_href = href_list.filter(element => element.includes(find_word));
    const find_string = string_list.filter(element => element.includes(find_word));
    
    // 두 개의 리스트를 하나로 합침
    const find_list = [...find_href, ...find_string];

    // https://나 http://를 버림 (있는 것과 없는 것의 혼용을 막기 위함)
    const checked_list = find_list.map(element => element.replace(/^https?:\/\//, ""));

    // 중복 제거
    const exceptDuplication = Array.from(new Set(checked_list));
    return exceptDuplication;
}