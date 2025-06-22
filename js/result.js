document.addEventListener('DOMContentLoaded', () => {
    const savedDataJSON = localStorage.getItem('asterResultData');

    if (!savedDataJSON) {
        alert("결과 데이터가 없습니다. 별자리를 먼저 만들어주세요.");
        window.location.href = 'main.html';
        return;
    }

    const resultData = JSON.parse(savedDataJSON);
    const { userName, constellationImage, charms } = resultData;
    const root = document.documentElement;

    // 카테고리별 테마 정보 (시안 기반)
        const themeMap = {
        "이해심 및 공감 능력":     { eye: "pink",    main: "#F64DC6", secondary: "#b0308f", bg: "#fdf2f8", bodyStart: "#86198f", bodyEnd: "#581c87" },
        "성실성 및 책임감":         { eye: "skyblue", main: "#2DB6F6", secondary: "#0284c7", bg: "#f0f9ff", bodyStart: "#0369a1", bodyEnd: "#0c4a6e" },
        "지적 호기심 및 개방성":  { eye: "yellow",  main: "#FBCA06", secondary: "#ca8a04", bg: "#fefce8", bodyStart: "#a16207", bodyEnd: "#713f12" },
        "정서적 안정 및 자기 인식": { eye: "green",   main: "#2ABB53", secondary: "#16a34a", bg: "#f0fdf4", bodyStart: "#15803d", bodyEnd: "#14532d" },
        "도덕성 및 양심":           { eye: "blue",    main: "#4D77F6", secondary: "#2563eb", bg: "#eef2ff", bodyStart: "#312e81", bodyEnd: "#1e1b4b" },
        "유머감각 및 사교성":      { eye: "orange",  main: "#F68E4D", secondary: "#f97316", bg: "#fff7ed", bodyStart: "#c2410c", bodyEnd: "#7c2d12" },
        "목표 지향성 및 야망":     { eye: "red",     main: "#F64D4D", secondary: "#ef4444", bg: "#fef2f2", bodyStart: "#b91c1c", bodyEnd: "#7f1d1d" }
    };
    
    // --- 1. 핵심 매력 카테고리를 찾아 테마 결정 ---
    const topCharm = charms[0];
    const defaultTheme = themeMap["도덕성 및 양심"]; // 데이터에 문제가 있을 경우 기본값
    const theme = topCharm && themeMap[topCharm.category] ? themeMap[topCharm.category] : defaultTheme;

    // --- 2. 결정된 테마를 화면에 적용 ---
    root.style.setProperty('--color-text-main', theme.main);
    root.style.setProperty('--color-text-secondary', theme.secondary);
    root.style.setProperty('--color-card-bg', theme.bg);
    root.style.setProperty('--color-body-bg-start', theme.bodyStart);
    root.style.setProperty('--color-body-bg-end', theme.bodyEnd);
    document.getElementById('eyeBackground').src = `images/eye-${theme.eye}.png`;
document.getElementById('logo-front').src = `images/logo-${theme.eye}.png`;
    document.getElementById('logo-back').src = `images/logo-${theme.eye}.png`;
    // --- 3. 왼쪽 카드 내용 채우기 ---
    document.getElementById('userName').textContent = `${userName}'s`;
    document.getElementById('constellationImage').src = constellationImage;

    // --- 4. 오른쪽 카드 (매력 목록) 채우기 (복원) ---
    const charmListEl = document.getElementById('charmList');
    charmListEl.innerHTML = ''; // 기존 목록 초기화

    // ▼▼▼ [핵심 수정] 상위 13개의 매력만 선택합니다. ▼▼▼
    const topCharms = charms.slice(0, 13);

        topCharms.forEach(charm => { // 이제 'charms' 대신 'topCharms'를 사용합니다.
        const listItem = document.createElement('li');
        listItem.className = 'charm-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'charm-name';
        nameSpan.textContent = charm.name;
        
        const levelDiv = document.createElement('div');
        levelDiv.className = 'charm-level';

        // ▼▼▼ [핵심 수정] 매력별 고유 색상을 적용합니다. ▼▼▼
        nameSpan.style.color = charm.color; // 매력 이름에 색상 적용
        levelDiv.style.color = charm.color; // 별과 숫자에 색상 적용
        // ▲▲▲ 여기까지 수정 ▲▲▲

        const starSpan = document.createElement('span');
        starSpan.className = 'star-icon';
        starSpan.textContent = '★';

        levelDiv.appendChild(starSpan);
        levelDiv.append(document.createTextNode(` ${charm.level}`));

        listItem.appendChild(nameSpan);
        listItem.appendChild(levelDiv);
        charmListEl.appendChild(listItem);
    });

      // --- 6. [신규] 공유 기능 구현 ---
    const shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', async () => {
            shareBtn.disabled = true;
            shareBtn.textContent = '이미지 생성 중...';

            try {
                // 공유할 영역을 선택 (카드 두장을 감싸는 컨테이너)
                const cardContainer = document.querySelector('.card-container');
                const canvas = await html2canvas(cardContainer, {
                    backgroundColor: null, // 배경을 투명하게 캡처
                    useCORS: true
                });

                // 캔버스를 파일 형태로 변환
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'aster-result.png', { type: 'image/png' });
                
                // 공유할 데이터 준비
                const shareData = {
                    title: 'Aster: 나의 별자리 카드',
                    text: '나만의 별자리를 만들고, 내 안의 매력을 발견해보세요!',
                    url: `${window.location.origin}/select.html`, // 서비스 첫 페이지 주소
                    files: [file]
                };

                // Web Share API를 지원하는지 확인 (주로 모바일)
                if (navigator.share && navigator.canShare && navigator.canShare({ files: shareData.files })) {
                    await navigator.share(shareData);
                    shareBtn.textContent = '공유 완료!';
                } else {
                    // PC 등 API 미지원 환경에서는 링크 복사 기능으로 대체
                    navigator.clipboard.writeText(shareData.url);
                    alert('결과 페이지 링크가 복사되었습니다. 친구에게 공유해보세요!');
                    shareBtn.textContent = '링크 복사 완료!';
                }

            } catch (error) {
                console.error('공유 기능 오류:', error);
                alert('공유에 실패했습니다. 다시 시도해주세요.');
            } finally {
                // 2초 후 버튼을 원래 상태로 복구
                setTimeout(() => {
                    shareBtn.disabled = false;
                    shareBtn.textContent = '결과 공유하기 📲';
                }, 2000);
            }
        });
    }
  
});