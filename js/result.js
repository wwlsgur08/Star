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

    // --- 5. QR 코드 생성 (복원) ---
  
});