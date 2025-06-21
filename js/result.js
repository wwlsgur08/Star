document.addEventListener('DOMContentLoaded', () => {
    // 2단계에서 저장한 결과 데이터를 가져옵니다.
    const savedDataJSON = localStorage.getItem('asterResultData');

    // 만약 데이터가 없으면 (예: 이 페이지로 바로 접속한 경우), 메인 페이지로 보냅니다.
    if (!savedDataJSON) {
        alert("결과 데이터가 없습니다. 별자리를 먼저 만들어주세요.");
        window.location.href = 'main.html';
        return;
    }

    const resultData = JSON.parse(savedDataJSON);
    const { userName, constellationImage, charms } = resultData;

    // --- 1. 왼쪽 카드 채우기 ---
    document.getElementById('userName').textContent = `${userName}'s`;
    document.getElementById('constellationImage').src = constellationImage;

    // --- 2. 눈동자 배경 결정 ---
    const eyeBackgroundEl = document.getElementById('eyeBackground');
    
    // 가장 레벨이 높은 매력을 찾습니다. (정렬되어 있으므로 첫 번째 아이템)
    const topCharm = charms[0]; 
    
    // ▼▼▼ [수정] 기본 눈동자 색상을 'blue'로 고정합니다. ▼▼▼
    // 새로운 시안은 모든 결과가 파란색 계열이므로 색상 분기가 필요 없어졌습니다.
    let eyeColor = 'blue';

    // 결정된 색상에 맞는 눈동자 이미지 경로를 설정합니다.
    eyeBackgroundEl.src = `images/eye-${eyeColor}.png`;
    
    // --- 3. 오른쪽 카드 (매력 목록) 채우기 ---
    const charmListEl = document.getElementById('charmList');
    
    // ▼▼▼ [수정] 오른쪽 카드는 새로운 시안에서 비어있으므로 이 부분을 주석 처리합니다. ▼▼▼
    /*
    charms.forEach(charm => {
        const listItem = document.createElement('li');
        listItem.className = 'charm-item';

        // 매력 이름
        const nameSpan = document.createElement('span');
        nameSpan.className = 'charm-name';
        nameSpan.textContent = charm.name;
        // CSS에서 색상을 제어하므로 JS에서의 색상 지정을 제거합니다.
        // nameSpan.style.color = charm.color;
        
        // 레벨과 별 아이콘
        const levelDiv = document.createElement('div');
        levelDiv.className = 'charm-level';
        // CSS에서 색상을 제어하므로 JS에서의 색상 지정을 제거합니다.
        // levelDiv.style.color = charm.color;

        const starSpan = document.createElement('span');
        starSpan.className = 'star-icon';
        starSpan.textContent = '★';

        levelDiv.appendChild(starSpan);
        levelDiv.append(document.createTextNode(` ${charm.level}`));

        listItem.appendChild(nameSpan);
        listItem.appendChild(levelDiv);
        charmListEl.appendChild(listItem);
    });
    */


    // --- 4. QR 코드 생성 ---
    const qrcodeContainer = document.getElementById('qrcode');
    // ▼▼▼ [수정] 오른쪽 카드는 새로운 시안에서 비어있으므로 이 부분을 주석 처리합니다. ▼▼▼
    /*
    new QRCode(qrcodeContainer, {
        text: window.location.href,
        width: 80,
        height: 80,
        colorDark : "#6366f1", // QR코드 색상 (강조 텍스트 색상)
        colorLight : "#f3f4f6", // 배경색 (카드 배경색과 동일하게)
        correctLevel : QRCode.CorrectLevel.H
    });
    */
});