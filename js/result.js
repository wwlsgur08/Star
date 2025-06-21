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

    // --- 3. 왼쪽 카드 내용 채우기 ---
    document.getElementById('userName').textContent = `${userName}'s`;
    document.getElementById('constellationImage').src = constellationImage;

    // --- 4. 오른쪽 카드 (매력 목록) 채우기 (복원) ---
    const charmListEl = document.getElementById('charmList');
    charmListEl.innerHTML = ''; // 기존 목록 초기화
    charms.forEach(charm => {
        const listItem = document.createElement('li');
        listItem.className = 'charm-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'charm-name';
        nameSpan.textContent = charm.name;
        
        const levelDiv = document.createElement('div');
        levelDiv.className = 'charm-level';

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
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = ''; // 기존 QR 코드 초기화
    new QRCode(qrcodeContainer, {
        text: window.location.href,
        width: 80,
        height: 80,
        colorDark : theme.main,      // QR코드 색상을 동적으로 변경
        colorLight : theme.bg,       // 배경색을 카드 배경과 동일하게
        correctLevel : QRCode.CorrectLevel.H
    });
});