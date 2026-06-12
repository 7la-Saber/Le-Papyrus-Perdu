// بيانات المواقع الـ 5 (الصور، الأصوات، الأسئلة، والنصوص الجديدة)
const questsLevel1 = {
    canal: {
        title: "Le Partage",
        brief: "Le canal permet le partage des marchandises. C'est bon pour la paix dans le monde !",
        audioTitle: "assets/audio/voices/التجارة.mp3",
        audioBrief: "assets/audio/voices/تعريف القناااال.mp3",
        viewImage: "assets/images/items/partage.png",
        question: "Le canal permet ...... des marchandises.",
        options: ["Le partage", "La protection", "La nation"],
        correct: "Le partage",
        icon: "assets/images/items/partage.png"
    },
    silo: {
        title: "Le Blé",
        brief: "Les Pharaons gardent le blé pour l'avenir. C'est juste pour le peuple.",
        audioTitle: "assets/audio/voices/القمح.mp3",
        audioBrief: "assets/audio/voices/تعريف صوامع الغلال .mp3",
        viewImage: "assets/images/items/ble.png",
        question: "On garde ...... pour l'avenir.",
        options: ["Le sable", "Le blé", "Le soleil"],
        correct: "Le blé",
        icon: "assets/images/items/ble.png"
    },
    nil: {
        title: "L'eau",
        brief: "Le Nilomètre mesure l'eau du Nil. C'est très important pour l'Égypte.",
        audioTitle: "assets/audio/voices/المياه.mp3",
        audioBrief: "assets/audio/voices/بريف مقياس النيل .mp3",
        viewImage: "assets/images/items/Lieu.png",
        question: "Le Nilomètre mesure quoi ?",
        options: ["La vie", "La terre", "l'eau"],
        correct: "l'eau",
        icon: "assets/images/items/Lieu.png"
    },
    champ: {
        title: "La Nature",
        brief: "Le paysan protège la nature. C'est sa terre et son travail.",
        audioTitle: "assets/audio/voices/الطبيعة.mp3",
        audioBrief: "assets/audio/voices/بريف المزرعة الملكية .mp3",
        viewImage: "assets/images/items/nature.png",
        question: "Que protège le paysan ?",
        options: ["La maison", "La nature", "Les rues"],
        correct: "La nature",
        icon: "assets/images/items/nature.png"
    },
    barrage: {
        title: "La Protection",
        brief: "Le barrage d'El-Lahun protège la terre d'Égypte. On garde l'eau pour les plantes.",
        audioTitle: "assets/audio/voices/الحماية.mp3",
        audioBrief: "assets/audio/voices/بريف لاهون جديد .mp3",
        viewImage: "assets/images/items/protection.png",
        question: "Le barrage d'El-Lahun offre quoi aux habitants ?",
        options: ["La destruction", "La production", "La protection"],
        correct: "La protection",
        icon: "assets/images/items/protection.png"
    }
};

const scholarsLevel2 = [
    {
        name: "Le Botaniste",
        dialogue: "Regardez ce dessin ! [ ...... ] donne une grande énergie pour la croissance des plantes.",
        image: "assets/images/items/sun.jpg",
        options: ["Le blé", "Le vent", "Le soleil", "Le sable"],
        correct: "Le soleil",
        hiddenText: "Le Botaniste: \"Mais les rois ont volé cette richesse, laissant le peuple dans la faim et l'obscurité.\""
    },
    {
        name: "L'Ingénieur",
        dialogue: "Le grand barrage à El-Lahun, qu'est-ce qu'il garantit?",
        image: "assets/images/items/protection.png",
        options: ["La protection", "La guerre", "La paix", "L'eau"],
        correct: "La protection",
        hiddenText: "L'Ingénieur: \"Oui, il protège... mais seulement les champs des riches. Le peuple a soif.\""
    },
    {
        name: "L'Artiste",
        dialogue: "Les Égyptiens aiment beaucoup [ ...... ] ! Ils dessinent des oiseaux partout.",
        image: "assets/images/items/nature.png",
        options: ["La nature", "La magie", "La guerre", "La tristesse"],
        correct: "La nature",
        hiddenText: "L'Artiste: \"Ils aimaient la nature, les pharaons ont dessiné beaucoup d'éléments de la nature comme : les plantes, le soleil, les animaux,...etc.\""
    }
];


// بيانات ليفل 3: الجمل وترتيبها ونوعها للميزان
const level3Sentences = [
    {
        id: "s1",
        scrambled: ["de l'eau", "a soif", "et", "Le peuple", "cherche"],
        correct: ["Le peuple", "a soif", "et", "cherche", "de l'eau"],
        fullText: "Le peuple a soif et cherche de l'eau.",
        type: "bad" // Désinformé
    },
    {
        id: "s2",
        scrambled: ["seulement", "protège", "des", "Le barrage à El-Lahun", "riches", "les champs"],
        correct: ["Le barrage à El-Lahun", "protège", "seulement", "les champs", "des", "riches"],
        fullText: "Le barrage à El-Lahun protège seulement les champs des riches.",
        type: "bad" // Désinformé
    },
    {
        id: "s3",
        scrambled: ["beaucoup", "la nature", "Les pharaons", "aimaient"],
        correct: ["Les pharaons", "aimaient", "beaucoup", "la nature"],
        fullText: "Les pharaons aimaient beaucoup la nature.",
        type: "good" // Bien informé
    },
    {
        id: "s4",
        scrambled: ["la nature", "nous", "Ensemble,", "protégeons"],
        correct: ["Ensemble,", "nous", "protégeons", "la nature"],
        fullText: "Ensemble, nous protégeons la nature.",
        type: "good" // Bien informé
    }
];
