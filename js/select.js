// --- START OF FILE select.js ---
// [수정] select.js 파일 전체를 아래 코드로 교체해주세요.

document.addEventListener('DOMContentLoaded', () => {
    const categoryData = [
        { name: "이해심 및 공감 능력", charms: ["다정함", "공감 능력", "이해심", "배려심", "경청 능력", "위로 능력", "섬세함"], color: "#F472B6" },
        { name: "성실성 및 책임감", charms: ["성실함", "책임감", "인내심", "계획성", "세심함", "신중함", "절제력"], color: "#60A5FA" },
        { name: "지적 호기심 및 개방성", charms: ["호기심", "창의성", "열린 마음", "모험심", "비판적 사고력", "통찰력", "넓은 시야", "집중력"], color: "#FBBF24" },
        { name: "정서적 안정 및 자기 인식", charms: ["침착함", "안정감", "자기 성찰", "긍정적", "현실 감각", "자기 객관화", "자존감", "겸손"], color: "#4ADE80" },
        { name: "도덕성 및 양심", charms: ["정직함", "양심", "일관성", "원칙 준수", "진정성", "약자보호"], color: "#4F46E5" },
        { name: "유머감각 및 사교성", charms: ["유머 감각", "분위기 메이커", "다양한 친분", "타인을 편하게 해주는 능력", "연락 등 관계를 이어가는 능력", "사교적 에너지"], color: "#F97316" },
        { name: "목표 지향성 및 야망", charms: ["목표 의식", "열정", "자기 계발 의지", "리더십", "야망", "경쟁심", "전략적 사고"], color: "#EF4444" }
    ];

    const selectionGrid = document.getElementById('selectionGrid');
    const completeBtn = document.getElementById('completeBtn');

    const selectedCharms = new Set();

    function createSelectionPanel() {
        categoryData.forEach(category => {
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'category-group';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category.name;
            categoryTitle.style.borderColor = category.color;

            const charmContainer = document.createElement('div');
            charmContainer.className = 'charm-container';

            category.charms.forEach(charmName => {
                const charmEl = document.createElement('div');
                charmEl.className = 'selectable-charm';
                charmEl.textContent = charmName;
                charmEl.dataset.charm = charmName;

                charmEl.addEventListener('click', () => handleCharmClick(charmEl, charmName));
                charmContainer.appendChild(charmEl);
            });

            categoryGroup.appendChild(categoryTitle);
            categoryGroup.appendChild(charmContainer);
            selectionGrid.appendChild(categoryGroup);
        });
    }

    function handleCharmClick(element, charmName) {
        if (selectedCharms.has(charmName)) {
            selectedCharms.delete(charmName);
            element.classList.remove('selected');
        } else {
            selectedCharms.add(charmName);
            element.classList.add('selected');
        }
        updateCompleteButton();
    }

    function updateCompleteButton() {
        completeBtn.disabled = selectedCharms.size === 0;
    }

    function handleCompletion() {
        if (selectedCharms.size === 0) {
            alert('하나 이상의 매력을 선택해주세요.');
            return;
        }
        
        // [수정] 1. 선택된 매력 목록을 배열로 변환합니다.
        const charmsArray = Array.from(selectedCharms);

        // [수정] 2. 브라우저 저장소(localStorage)에 'userSelectedCharms'라는 이름으로 저장합니다.
        localStorage.setItem('userSelectedCharms', JSON.stringify(charmsArray));
        
        // [수정] 3. 404 에러를 해결하기 위해 페이지 이동 주소를 'main.html'로 정확히 지정합니다.
        window.location.href = 'main.html';
    }

    completeBtn.addEventListener('click', handleCompletion);
    createSelectionPanel();
});