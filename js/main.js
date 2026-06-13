let gameState = { playerName: "", inventory: [], scholarsDone: 0 };
let currentQuest = "";
let currentScholar = 0;

// الأصوات
let titleAudioPlayer = new Audio();
let briefAudioPlayer = new Audio();
let audioDelayTimeout;

// ==========================================
// 1. شريط التحميل وبدء الفيديو
// ==========================================
window.onload = () => {
    let fill = document.getElementById("loading-bar-fill");
    let width = 0;
    let loadingInterval = setInterval(() => {
        width += 1.5;
        if(fill) fill.style.width = width + "%";
        
        if(width >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                switchScene('screen-loading', 'screen-video');
                let video = document.getElementById('intro-video');
                if(video) video.play().catch(e => console.log("Problème avec le chemin de la vidéo ou le navigateur empêche la lecture"));
            }, 800);
        }
    }, 50);
};

// ==========================================
// 2. التحكم في الفيديو وشاشة الترحيب
// ==========================================
document.getElementById('intro-video').addEventListener('ended', function() {
    let controls = document.getElementById('video-controls');
    if(controls) controls.classList.remove('hidden');
});

function replayVideo() {
    let video = document.getElementById("intro-video");
    video.currentTime = 0;
    video.play();
    document.getElementById('video-controls').classList.add('hidden');
}

function skipToWelcome() { 
    let video = document.getElementById("intro-video");
    if(video) video.pause();
    switchScene('screen-video', 'screen-welcome'); 
}

function switchScene(hide, show) {
    let hideEl = document.getElementById(hide);
    let showEl = document.getElementById(show);
    if(hideEl) hideEl.classList.add('hidden');
    if(showEl) showEl.classList.remove('hidden');
}

function saveName() {
    let name = document.getElementById("player-name").value;
    if(!name) return alert("Écris ton nom !");
    gameState.playerName = name;
    
    document.getElementById("anis-preview-text").innerHTML = `Bienvenue <b>${name}</b> ! Voici le papyrus endommagé. Regarde les mots manquants...`;
    
    // إظهار الشنطة
    let ui = document.getElementById('level1-ui');
    if(ui) ui.classList.remove('hidden');

    switchScene('screen-welcome', 'screen-papyrus-preview');
}

// ==========================================
// 3. LEVEL 1 (الألغاز والصوت)
// ==========================================
function openQuest(questId) {
    currentQuest = questId;
    let data = questsLevel1[questId];
    switchScene('screen-map', 'screen-quest');
    
    document.getElementById("quest-learning").classList.remove('hidden');
    document.getElementById("quest-quiz").classList.add('hidden');
    document.getElementById("feedback-box").classList.add('hidden');
    document.getElementById("quest-options").classList.remove('hidden');
    
    document.getElementById("quest-title").innerText = data.title;
    document.getElementById("quest-brief").innerText = data.brief;
    document.getElementById("quest-image").src = data.viewImage;
    
    titleAudioPlayer.src = data.audioTitle;
    briefAudioPlayer.src = data.audioBrief;
    
    clearTimeout(audioDelayTimeout);
    briefAudioPlayer.pause();
    
    titleAudioPlayer.play().catch(e=>console.log(e));
    
    titleAudioPlayer.onended = () => {
        audioDelayTimeout = setTimeout(() => {
            briefAudioPlayer.play().catch(e=>console.log(e));
        }, 2000); 
    };
}

function playTitleAudio() {
    clearTimeout(audioDelayTimeout); 
    briefAudioPlayer.pause();
    briefAudioPlayer.currentTime = 0;
    titleAudioPlayer.play();
}

function playBriefAudio() {
    clearTimeout(audioDelayTimeout);
    titleAudioPlayer.pause();
    titleAudioPlayer.currentTime = 0;
    briefAudioPlayer.play();
}

function showQuestion() {
    clearTimeout(audioDelayTimeout);
    titleAudioPlayer.pause();
    briefAudioPlayer.pause();

    let data = questsLevel1[currentQuest];
    
    document.getElementById("quest-learning").classList.add('hidden');
    document.getElementById("quest-quiz").classList.remove('hidden');
    document.getElementById("quest-question").innerText = data.question;
    
    let opts = document.getElementById("quest-options");
    opts.innerHTML = "";
    data.options.forEach(opt => {
        // السطر ده بيعالج علامة التنصيص في كلمة l'eau عشان الزرار يشتغل
        let safeOpt = opt.replace(/'/g, "\\'");
        opts.innerHTML += `<button class="btn-option" onclick="checkAnswer('${safeOpt}')">${opt}</button>`;
    });
}

function checkAnswer(ans) {
    let data = questsLevel1[currentQuest];
    let fbBox = document.getElementById("feedback-box");
    let fbText = document.getElementById("feedback-text");
    let fbBtn = document.getElementById("feedback-btn");
    let anisImg = document.getElementById("anis-reaction");
    
    document.getElementById("quest-options").classList.add('hidden'); 
    fbBox.classList.remove('hidden');

    if(ans === data.correct) {
        if(anisImg) anisImg.src = "assets/images/characters/anis-bravo.png";
        fbText.innerHTML = "<b>Bravo !</b> C'est la bonne réponse !<br>Le mot est maintenant dans ton sac à dos.";
        fbBtn.innerText = "Continuer";
        
        if(!gameState.inventory.includes(data.correct)) {
            gameState.inventory.push(data.correct);
            updateInventory();
            document.getElementById(`spot-${currentQuest}`).style.display = "none";
        }
        
        fbBtn.onclick = () => {
            switchScene('screen-quest', 'screen-map');
            if(gameState.inventory.length === 5) setTimeout(startAssembly, 1000);
        };
    } else {
        if(anisImg) anisImg.src = "assets/images/characters/anis-oops.png";
        fbText.innerHTML = "<b>Oops !</b> Ce n'est pas la bonne réponse.<br>Réfléchis bien et essaie encore !";
        fbBtn.innerText = "Réessayer";
        
        fbBtn.onclick = () => {
            fbBox.classList.add('hidden');
            document.getElementById("quest-options").classList.remove('hidden');
        };
    }
}

// ==========================================
// 4. الشنطة وتجميع البردية
// ==========================================
function toggleInventory() { document.getElementById("inventory-popup").classList.toggle('hidden'); }

function updateInventory() {
    let div = document.getElementById("inventory-items");
    div.innerHTML = gameState.inventory.map(i => `<span class="inv-item">${i}</span>`).join('');
}

// الترتيب الصحيح للكلمات (متطابق مع الإجابات الجديدة)
let correctOrder = ["l'eau", "La nature", "La protection", "Le partage", "Le blé"];
let currentBlanks = ["", "", "", "", ""];

function startAssembly() {
    switchScene('screen-map', 'screen-assembly');
    renderAssembly();
}

function renderAssembly() {
    let bankHtml = "";
    
    // بيانات الكلمات الموجودة في الشنطة
    gameState.inventory.forEach(word => {
        if(!currentBlanks.includes(word)) {
            let safeWord = word.replace(/'/g, "\\'");
            bankHtml += `<button class="btn-option" onclick="fillBlank('${safeWord}')">${word}</button>`;
        }
    });
    document.getElementById("words-bank").innerHTML = bankHtml;

    // رسم الفراغات الخمسة في البردية
    for(let i = 1; i <= 5; i++) {
        let slot = document.getElementById("blank-" + i);
        if(currentBlanks[i-1] !== "") {
            slot.innerHTML = `<span style="color: var(--nile-green);">[ ${currentBlanks[i-1]} ]</span>`;
        } else {
            slot.innerHTML = '<span style="color: var(--terra-red);">[ ??? ]</span>';
        }
    }

    // التحقق لو كل الفراغات اتملت (وهنا هيظهر أنيس)
// التحقق لو كل الفراغات اتملت (وهنا هيظهر أنيس)
    if(!currentBlanks.includes("")) {
        let isCorrect = currentBlanks.every((val, index) => val === correctOrder[index]);
        
        let feedbackBox = document.getElementById("assembly-feedback-box");
        let anisImg = document.getElementById("assembly-anis-reaction");
        let feedbackText = document.getElementById("assembly-feedback-text");
        let btnNext = document.getElementById("assembly-feedback-btn-next");
        let btnRetry = document.getElementById("assembly-feedback-btn-retry");
        let normalControls = document.getElementById("assembly-normal-controls");
        let wordsBankContainer = document.getElementById("words-bank-container");

        // إظهار صندوق أنيس وإخفاء الزراير العادية وصندوق الكلمات
        feedbackBox.classList.remove('hidden');
        normalControls.classList.add('hidden');
        wordsBankContainer.classList.add('hidden'); // 🌟 السطر السحري اللي هيحل الأزمة
        
        if(isCorrect) {
            // لو الترتيب صح
            anisImg.src = "assets/images/characters/anis-bravo.png";
            feedbackText.innerHTML = "Excellent !<br>Le papyrus est restauré avec succès !";
            btnNext.classList.remove('hidden');
            btnRetry.classList.add('hidden');
        } else {
            // لو الترتيب غلط
            anisImg.src = "assets/images/characters/anis-oops.png";
            feedbackText.innerHTML = "Oops ! L'ordre n'est pas correct.<br>Anis est confus.";
            btnNext.classList.add('hidden');
            btnRetry.classList.remove('hidden');
        }
    }
}

// الدالة دي بتشتغل لما اللاعب يدوس "Réessayer" لو رتب غلط
function closeAssemblyFeedback() {
    document.getElementById("assembly-feedback-box").classList.add('hidden');
    document.getElementById("assembly-normal-controls").classList.remove('hidden');
    document.getElementById("words-bank-container").classList.remove('hidden');
    resetAssembly(); // بتمسح البردية وترجع الكلمات للشنطة
}

function fillBlank(word) {
    let emptyIndex = currentBlanks.indexOf(""); 
    if(emptyIndex !== -1) {
        currentBlanks[emptyIndex] = word;
        renderAssembly();
    }
}

function resetAssembly() {
    currentBlanks = ["", "", "", "", ""];
    renderAssembly();
}

// ==========================================
// 5. LEVEL 2 - المحاكمة وعلماء 1798
// ==========================================
// ==========================================
// 5. LEVEL 2 - الانتقال، المحاكمة وعلماء 1798
// ==========================================

// ==========================================
// 5. LEVEL 2 - الانتقال، المحاكمة وعلماء 1798
// ==========================================

// الدالة دي بتشتغل لما اللاعب يخلص تجميع البردية ويدوس "Passer au Niveau 2"
function startLevel2() {
    let ui = document.getElementById('level1-ui');
    if(ui) ui.classList.add('hidden'); // إخفاء الشنطة بتاعة ليفل 1
    
    // الانتقال لشاشة فيديو ليفل 2
    switchScene('screen-assembly', 'screen-video-level2');
    
    let vid = document.getElementById('transition-video');
    if(vid) {
        // تشغيل الفيديو، ولو المتصفح منعه هيستنى اللاعب يدوس بلاي بنفسه
        vid.play().catch(e => console.log("Auto-play prevented"));
    }
}

// إظهار زرار الاستمرار لما فيديو الانتقال يخلص
document.getElementById('transition-video').addEventListener('ended', function() {
    let controls = document.getElementById('video2-controls');
    if(controls) controls.classList.remove('hidden');
});


// تخطي الفيديو والانتقال لشاشة ترحيب أنيس المخصصة لليفل 2
function skipToWelcomeLevel2() {
    let vid = document.getElementById('transition-video');
    if(vid) vid.pause();
    
    let textEl = document.getElementById("anis-level2-text");
    if(textEl) {
        textEl.innerHTML = `Incroyable <b>${gameState.playerName}</b> ! Le papyrus nous a fait voyager dans le temps...<br><br>Nous sommes en l'année 1798, avec les scientifiques français qui travaillaient en Égypte. Écoutons ce qu'ils ont découvert !`;
    } else {
        console.log("Erreur : Impossible de trouver l’espace texte d’Anis");
    }
    
    switchScene('screen-video-level2', 'screen-welcome-level2');
}

// الانتقال من ترحيب أنيس إلى شاشة العلماء
function goToScholars() {
    switchScene('screen-welcome-level2', 'screen-level2');
    
    // تعديل النص اللي بيظهر فوق العلماء عشان يكون توجيهي لأن الترحيب حصل خلاص
    document.getElementById("anis-level2-intro").innerText = "Choisis un scientifique pour lui parler :";
}

// باقي دوال ليفل 2 زي ما هي (openScholar, checkScholar, backToLevel2)
function openScholar(index) {
    currentScholar = index;
    let data = scholarsLevel2[index];
    switchScene('screen-level2', 'screen-scholar');
    
    let nameEl = document.getElementById("scholar-name");
    if(nameEl) nameEl.innerText = data.name;
    
    document.getElementById("scholar-dialogue").innerText = data.dialogue;
    
    // تصفير الشاشة عشان لو داخل سؤال جديد
    document.getElementById("scholar-options").classList.remove('hidden');
    document.getElementById("scholar-feedback-box").classList.add('hidden');
    
    let imgEl = document.getElementById("scholar-image");
    if(data.image && data.image !== "") {
        imgEl.src = data.image;
        imgEl.classList.remove('hidden');
    } else {
        imgEl.classList.add('hidden');
    }
    
    let opts = document.getElementById("scholar-options");
    opts.innerHTML = "";
    data.options.forEach(opt => {
        let safeOpt = opt.replace(/'/g, "\\'");
        opts.innerHTML += `<button class="btn-option" onclick="checkScholar('${safeOpt}')">${opt}</button>`;
    });
}

function checkScholar(ans) {
    let data = scholarsLevel2[currentScholar];
    let optionsDiv = document.getElementById("scholar-options");
    let feedbackBox = document.getElementById("scholar-feedback-box");
    let anisImg = document.getElementById("scholar-anis-reaction");
    let feedbackText = document.getElementById("scholar-feedback-text");
    let hiddenTextEl = document.getElementById("scholar-hidden-text");
    let feedbackBtn = document.getElementById("scholar-feedback-btn");
    
    // إخفاء الاختيارات وإظهار صندوق الرد
    optionsDiv.classList.add('hidden'); 
    feedbackBox.classList.remove('hidden');
    
    if(ans === data.correct) {
        // لو الإجابة صح
        anisImg.src = "assets/images/characters/anis-bravo.png";
        feedbackText.innerHTML = "<b>Excellent !</b> C'est exactement le mot cherché.";
        
        // إظهار الحقيقة المخفية بالتنسيق الجديد
        hiddenTextEl.innerText = data.hiddenText;
        hiddenTextEl.classList.remove('hidden');
        
        feedbackBtn.innerText = "Retour à l'équipe";
        feedbackBtn.onclick = () => {
            // تزويد العداد لو العالم ده متحلش قبل كده
            if(!data.solved) {
                gameState.scholarsDone++;
                data.solved = true; 
            }
            backToLevel2();
        };
    } else {
        // لو الإجابة غلط (بدل الـ alert المزعج)
        anisImg.src = "assets/images/characters/anis-oops.png";
        feedbackText.innerHTML = "<b>Oops !</b> Ce n'est pas tout à fait ça.<br>Les scientifiques attendent une autre réponse.";
        
        // إخفاء الحقيقة لأن الإجابة غلط
        hiddenTextEl.classList.add('hidden');
        
        feedbackBtn.innerText = "Réessayer";
        feedbackBtn.onclick = () => {
            // إخفاء الرد والرجوع للاختيارات
            feedbackBox.classList.add('hidden');
            optionsDiv.classList.remove('hidden');
        };
    }
}

function backToLevel2() {
    switchScene('screen-scholar', 'screen-level2');
    // جوه backToLevel2()
if(gameState.scholarsDone >= 3) {
    let btn = document.getElementById("btn-scale");
    btn.innerText = "Aller au Niveau 3 🚀";
    btn.onclick = () => {
        document.getElementById("player-name-l3").innerText = gameState.playerName;
        switchScene('screen-level2', 'screen-welcome-level3');
    };
    btn.classList.remove('hidden');
}
}

// ==========================================
// 6. FINALE - الميزان الختامي
// ==========================================
function showEpilogue() {
    document.getElementById("epilogue-msg").classList.remove('hidden');
    document.getElementById("anis-finale-text").innerText = `Merci, ${gameState.playerName} ! Tu es le bâtisseur de l'avenir. À la prochaine aventure !`;
}



// ==========================================
// 7. LEVEL 3 - بناء الجمل والميزان
// ==========================================
let currentL3Index = 0;
let currentSentenceBlanks = [];

function startSentenceBuilder() {
    switchScene('screen-welcome-level3', 'screen-sentence-builder');
    renderSentenceBuilder();
}

function renderSentenceBuilder() {
    let data = level3Sentences[currentL3Index];
    document.getElementById("sentence-counter").innerText = currentL3Index + 1;
    
    // تصفير الواجهة
    currentSentenceBlanks = [];
    document.getElementById("sentence-feedback").classList.add('hidden');
    document.getElementById("btn-next-sentence").classList.add('hidden');
    
    updateSentenceUI();
}

function updateSentenceUI() {
    let data = level3Sentences[currentL3Index];
    
    // رسم الكلمات المختارة
    let slotsHtml = currentSentenceBlanks.map(word => 
        `<span style="background: var(--lapis-blue); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">${word}</span>`
    ).join('');
    document.getElementById("sentence-slots").innerHTML = slotsHtml || `<span style="color: gray;">[ Les mots apparaîtront ici ]</span>`;
    
    // رسم الكلمات المتبقية
    let bankHtml = "";
    data.scrambled.forEach(word => {
        // لو الكلمة لسه متختارتش، نظهرها في البنك
        let countInScrambled = data.scrambled.filter(w => w === word).length;
        let countInBlanks = currentSentenceBlanks.filter(w => w === word).length;
        
        if(countInBlanks < countInScrambled) {
            let safeWord = word.replace(/'/g, "\\'");
            bankHtml += `<button class="btn-option" onclick="fillSentenceWord('${safeWord}')">${word}</button>`;
        }
    });
    document.getElementById("sentence-words-bank").innerHTML = bankHtml;
    
    // فحص لو الجملة اكتملت
    if(currentSentenceBlanks.length === data.correct.length) {
        checkSentenceBuilder();
    }
}

function fillSentenceWord(word) {
    currentSentenceBlanks.push(word);
    updateSentenceUI();
}

function resetCurrentSentence() {
    currentSentenceBlanks = [];
    document.getElementById("sentence-feedback").classList.add('hidden');
    
    // إخفاء زرار الإعادة عند تصفير الجملة
    let btnRetry = document.getElementById("btn-retry-sentence");
    if(btnRetry) btnRetry.classList.add('hidden');
    
    updateSentenceUI();
}

function checkSentenceBuilder() {
    let data = level3Sentences[currentL3Index];
    let isCorrect = currentSentenceBlanks.every((val, index) => val === data.correct[index]);
    
    let feedback = document.getElementById("sentence-feedback");
    let text = document.getElementById("sentence-feedback-text");
    let img = document.getElementById("sentence-anis-reaction");
    let btnRetry = document.getElementById("btn-retry-sentence");
    
    feedback.classList.remove('hidden');
    
    if(isCorrect) {
        img.src = "assets/images/characters/anis-bravo.png";
        text.innerText = "Bravo ! Phrase correcte ajoutée au sac.";
        text.style.color = "var(--nile-green)";
        document.getElementById("btn-next-sentence").classList.remove('hidden');
        document.getElementById("sentence-words-bank").innerHTML = ""; // إخفاء الأزرار المتبقية
        if(btnRetry) btnRetry.classList.add('hidden');
    } else {
        img.src = "assets/images/characters/anis-oops.png";
        text.innerText = "Oops ! L'ordre est incorrect. Essaie encore.";
        text.style.color = "var(--terra-red)";
        
        // إظهار زرار الإعادة وإلغاء الاختفاء التلقائي
        if(btnRetry) btnRetry.classList.remove('hidden');
    }
}

// التعديل هنا: بعد الجملة الأخيرة يروح للبردية بدل الميزان مباشرة
function nextSentence() {
    currentL3Index++;
    if(currentL3Index < level3Sentences.length) {
        renderSentenceBuilder();
    } else {
        // الانتقال لشاشة البردية
        switchScene('screen-sentence-builder', 'screen-papyrus-level3');
        // تشغيل الصوت تلقائياً أول ما الشاشة تفتح
        playPapyrusL3Audio();
    }
}

// التعديل هنا: دالة الانتقال للميزان من شاشة البردية
function startBalance() {
    // إيقاف الصوت لو اللاعب داس "التالي" والصوت لسه شغال
    papyrusL3Audio.pause(); 
    
    switchScene('screen-papyrus-level3', 'screen-balance');
    updateBalanceUI();
}


let papyrusL3Audio = new Audio("assets/audio/voices/الجملة الأخيرة .mp3");

function playPapyrusL3Audio() {
    papyrusL3Audio.currentTime = 0;
    papyrusL3Audio.play().catch(e => console.log("Le son ne fonctionnait pas.", e));
}


// ==========================================
// 8. ميزان العدالة (La Balance)
// ==========================================
let balancePhase = "good"; // بتبدأ بكفة 'Bien informé'
let placedGood = [];
let placedBad = [];


function updateBalanceUI() {
    let instructionText = document.getElementById("balance-instruction");

    if(balancePhase === "good") {
        document.getElementById("arrow-good").classList.remove('hidden');
        document.getElementById("arrow-bad").classList.add('hidden');
        // تحديث النص ليدل على الكفة الخضراء
        if(instructionText) instructionText.innerHTML = `Placez les phrases dans : <span style="color: var(--nile-green);">Les bonnes informations</span>`;
    } else if (balancePhase === "bad") {
        document.getElementById("arrow-good").classList.add('hidden');
        document.getElementById("arrow-bad").classList.remove('hidden');
        // تحديث النص ليدل على الكفة الحمراء
        if(instructionText) instructionText.innerHTML = `Placez les phrases dans : <span style="color: #ff9999;">Les désinformations</span>`;
    } else {
        document.getElementById("arrow-good").classList.add('hidden');
        document.getElementById("arrow-bad").classList.add('hidden');
        // تحديث النص عند الانتهاء
        if(instructionText) instructionText.innerHTML = `Toutes les phrases sont placées !`;
    }

    let bankHtml = "";
    level3Sentences.forEach(s => {
        if(!placedGood.includes(s.id) && !placedBad.includes(s.id)) {
            bankHtml += `<button class="btn-option" style="text-align: left; padding: 10px;" onclick="placeSentence('${s.id}')">${s.fullText}</button>`;
        }
    });
    document.getElementById("balance-bank").innerHTML = bankHtml;

    document.getElementById("box-good").innerHTML = placedGood.map(id => getSentenceText(id)).join('');
    document.getElementById("box-bad").innerHTML = placedBad.map(id => getSentenceText(id)).join('');

    if(placedGood.length === 2 && placedBad.length === 2) {
        document.getElementById("btn-check-balance").classList.remove('hidden');
        balancePhase = "done";
        document.getElementById("arrow-bad").classList.add('hidden');
        if(instructionText) instructionText.innerHTML = `Toutes les phrases sont placées !`;
    }
}

function getSentenceText(id) {
    let text = level3Sentences.find(s => s.id === id).fullText;
    return `<div style="background: white; color: black; padding: 10px; border-radius: 5px; font-size: 0.9rem; border: 1px solid gray;">${text}</div>`;
}

function placeSentence(id) {
    if(balancePhase === "good") {
        placedGood.push(id);
        if(placedGood.length === 2) balancePhase = "bad"; // لو حط 2، ينقل للكفة التانية
    } else if(balancePhase === "bad") {
        placedBad.push(id);
    }
    updateBalanceUI();
}

function checkBalance() {
    // التحقق من صحة التوزيع
    let goodIsCorrect = placedGood.every(id => level3Sentences.find(s => s.id === id).type === "good");
    let badIsCorrect = placedBad.every(id => level3Sentences.find(s => s.id === id).type === "bad");

    let feedback = document.getElementById("balance-feedback");
    let text = document.getElementById("balance-feedback-text");
    let img = document.getElementById("balance-anis");
    
    feedback.classList.remove('hidden');

    if(goodIsCorrect && badIsCorrect) {
        img.src = "assets/images/characters/anis-bravo.png";
        text.innerText = "Exceptionnel ! La Balance de Maât est en équilibre.";
        text.style.color = "var(--nile-green)";
        document.getElementById("btn-check-balance").classList.add('hidden');
        document.getElementById("btn-retry-balance").classList.add('hidden');
        document.getElementById("btn-epilogue").classList.remove('hidden');
    } else {
        img.src = "assets/images/characters/anis-oops.png";
        text.innerText = "Oops ! Le mal a infiltré la vérité. Anis doit vider la balance, réessaie !";
        text.style.color = "var(--terra-red)";
        
        // إظهار زرار الإعادة وإخفاء الفحص، بدون وقت تلقائي
        document.getElementById("btn-check-balance").classList.add('hidden');
        document.getElementById("btn-retry-balance").classList.remove('hidden');
    }
}

// دالة جديدة لزر الإعادة الخاص بالميزان
function resetBalance() {
    placedGood = [];
    placedBad = [];
    balancePhase = "good";
    
    document.getElementById("balance-feedback").classList.add('hidden');
    document.getElementById("btn-retry-balance").classList.add('hidden');
    
    updateBalanceUI();
}


function showEpilogue() {
    switchScene('screen-balance', 'screen-epilogue');
    document.getElementById("final-congrats").innerText = `Merci beaucoup, ${gameState.playerName} !`;
}
