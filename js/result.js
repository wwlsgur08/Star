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
        "이해심 및 공감 능력":     { eye: "pink",    main: "#db2777", secondary: "#831843", bg: "#fce7f3", bodyStart: "#581c87", bodyEnd: "#3b0764" },
        "성실성 및 책임감":         { eye: "skyblue", main: "#2563eb", secondary: "#1e3a8a", bg: "#dbeafe", bodyStart: "#1e3a8a", bodyEnd: "#1e1b4b" },
        "지적 호기심 및 개방성":  { eye: "yellow",  main: "#d97706", secondary: "#78350f", bg: "#fef3c7", bodyStart: "#7c2d12", bodyEnd: "#451a03" },
        "정서적 안정 및 자기 인식": { eye: "green",   main: "#16a34a", secondary: "#14532d", bg: "#dcfce7", bodyStart: "#064e3b", bodyEnd: "#062f23" },
        "도덕성 및 양심":           { eye: "blue",    main: "#4f46e5", secondary: "#312e81", bg: "#e0e7ff", bodyStart: "#312e81", bodyEnd: "#1e1b4b" },
        "유머감각 및 사교성":      { eye: "orange",  main: "#ea580c", secondary: "#7c2d12", bg: "#ffedd5", bodyStart: "#7f1d1d", bodyEnd: "#450a0a" },
        "목표 지향성 및 야망":     { eye: "red",     main: "#dc2626", secondary: "#7f1d1d", bg: "#fee2e2", bodyStart: "#5f2120", bodyEnd: "#4c0519" }
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