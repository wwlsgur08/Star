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

    const themeMap = {
        "이해심 및 공감 능력":     { eye: "pink",    main: "#F64DC6", secondary: "#b0308f", bg: "#fdf2f8", bodyStart: "#86198f", bodyEnd: "#581c87" },
        "성실성 및 책임감":         { eye: "skyblue", main: "#2DB6F6", secondary: "#0284c7", bg: "#f0f9ff", bodyStart: "#0369a1", bodyEnd: "#0c4a6e" },
        "지적 호기심 및 개방성":  { eye: "yellow",  main: "#FBCA06", secondary: "#ca8a04", bg: "#fefce8", bodyStart: "#a16207", bodyEnd: "#713f12" },
        "정서적 안정 및 자기 인식": { eye: "green",   main: "#2ABB53", secondary: "#16a34a", bg: "#f0fdf4", bodyStart: "#15803d", bodyEnd: "#14532d" },
        "도덕성 및 양심":           { eye: "blue",    main: "#4D77F6", secondary: "#2563eb", bg: "#eef2ff", bodyStart: "#312e81", bodyEnd: "#1e1b4b" },
        "유머감각 및 사교성":      { eye: "orange",  main: "#F68E4D", secondary: "#f97316", bg: "#fff7ed", bodyStart: "#c2410c", bodyEnd: "#7c2d12" },
        "목표 지향성 및 야망":     { eye: "red",     main: "#F64D4D", secondary: "#ef4444", bg: "#fef2f2", bodyStart: "#b91c1c", bodyEnd: "#7f1d1d" }
    };
    
    const topCharm = charms[0];
    const defaultTheme = themeMap["도덕성 및 양심"];
    const theme = topCharm && themeMap[topCharm.category] ? themeMap[topCharm.category] : defaultTheme;

    root.style.setProperty('--color-text-main', theme.main);
    root.style.setProperty('--color-text-secondary', theme.secondary);
    root.style.setProperty('--color-card-bg', theme.bg);
    root.style.setProperty('--color-body-bg-start', theme.bodyStart);
    root.style.setProperty('--color-body-bg-end', theme.bodyEnd);
    document.getElementById('eyeBackground').src = `images/eye-${theme.eye}.png`;
    document.getElementById('logo-front').src = `images/logo-${theme.eye}.png`;
    document.getElementById('logo-back').src = `images/logo-${theme.eye}.png`;

    document.getElementById('userName').textContent = `${userName}'s`;
    document.getElementById('constellationImage').src = constellationImage;

    const charmListEl = document.getElementById('charmList');
    charmListEl.innerHTML = '';
    const topCharms = charms.slice(0, 13);
    topCharms.forEach(charm => {
        const listItem = document.createElement('li');
        listItem.className = 'charm-item';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'charm-name';
        nameSpan.textContent = charm.name;
        const levelDiv = document.createElement('div');
        levelDiv.className = 'charm-level';
        nameSpan.style.color = charm.color;
        levelDiv.style.color = charm.color;
        const starSpan = document.createElement('span');
        starSpan.className = 'star-icon';
        starSpan.textContent = '★';
        levelDiv.appendChild(starSpan);
        levelDiv.append(document.createTextNode(` ${charm.level}`));
        listItem.appendChild(nameSpan);
        listItem.appendChild(levelDiv);
        charmListEl.appendChild(listItem);
    });

    // --- 공통 캡처 함수 ---
    async function captureCard(button, processingText) {
        button.disabled = true;
        button.textContent = processingText;

        const captureTarget = document.getElementById('capture-target');
        const visibleContainer = document.getElementById('visible-card-container');
        const captureElement = captureTarget.querySelector('.card-container');
        
        captureElement.innerHTML = visibleContainer.innerHTML;

        // ▼▼▼ [핵심 수정] 캡처 전 너비를 고정하고, 끝난 후 복원 ▼▼▼
        captureElement.style.width = '660px'; // 카드 2장(320*2) + 간격(20)

        try {
            const canvas = await html2canvas(captureElement, {
                backgroundColor: null,
                useCORS: true
            });
            return canvas;
        } catch (error) {
            console.error('캡처 오류:', error);
            alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
            return null;
        } finally {
            captureElement.style.width = ''; // 너비 고정 해제
        }
    }

    // --- 공유 기능 ---
    const shareBtn = document.getElementById('share-btn');
    if(shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const canvas = await captureCard(shareBtn, '공유 파일 생성 중...');
            if (!canvas) {
                shareBtn.disabled = false;
                shareBtn.textContent = '결과 공유하기 📲';
                return;
            }

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'aster-result.png', { type: 'image/png' });
            
            const shareData = {
                title: 'Aster: 나의 별자리 카드',
                text: '나만의 별자리를 만들고, 내 안의 매력을 발견해보세요!',
                url: window.location.origin, // 서비스 주소
                files: [file]
            };

            if (navigator.share && navigator.canShare && navigator.canShare({ files: shareData.files })) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.url);
                alert('결과 페이지 링크가 복사되었습니다. 친구에게 공유해보세요!');
            }
            shareBtn.disabled = false;
            shareBtn.textContent = '결과 공유하기 📲';
        });
    }

    // --- 저장 기능 ---
    const saveBtn = document.getElementById('save-btn');
    if(saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const canvas = await captureCard(saveBtn, '이미지 저장 중...');
            if (!canvas) {
                saveBtn.disabled = false;
                saveBtn.textContent = '이미지로 저장하기 📥';
                return;
            }

            const link = document.createElement('a');
            link.download = 'My_Aster_Card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            saveBtn.disabled = false;
            saveBtn.textContent = '이미지로 저장하기 📥';
        });
    }
});