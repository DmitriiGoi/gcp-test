let selectedSkills = [];
let showButtonNames = false;
const difficult = {
    easy: "summer",
    medium: "autumn",
    hard: "winter",
}

const lolChampions = [
    'Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Aphelios', 'Ashe', 'Aurelion Sol',
    'Azir', 'Bard', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Camille', 'Cassiopeia', 'Cho\'Gath',
    'Corki', 'Darius', 'Diana', 'Dr. Mundo', 'Draven', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks',
    'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Heimerdinger',
    'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'Kai\'Sa', 'Kalista',
    'Karma', 'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Kha\'Zix', 'Kindred', 'Kled',
    'Kog\'Maw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite',
    'Malzahar', 'Maokai', 'Master Yi', 'Miss Fortune', 'Mordekaiser', 'Morgana', 'Nami', 'Nasus', 'Nautilus',
    'Neeko', 'Nidalee', 'Nocturne', 'Nunu & Willump', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke',
    'Qiyana', 'Quinn', 'Rakan', 'Rammus', 'Rek\'Sai', 'Rell', 'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze',
    'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir',
    'Skarner', 'Sona', 'Soraka', 'Swain', 'Sylas', 'Syndra', 'Tahm Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo',
    'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne',
    'Veigar', 'Vel\'Koz', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xayah', 'Xerath',
    'Xin Zhao', 'Yasuo', 'Yone', 'Yorick', 'Yuumi', 'Zac', 'Zed', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
];


const skillAssignments = {
    "Mystic Shot": "Q",
    "Essence Flux": "W",
    "Arcane Shift": "E",
    "Trueshot Barrage": "R",
    "Parrrley": "Q",
    "Remove Scurvy": "W",
    "Powder Keg": "E",
    "Cannon Barrage": "R",
    "Boomerang Blade": "Q",
    "Ricochet": "W",
    "Spell Shield": "E",
    "Blade Waltz": "R",
    "Dark Binding": "Q",
    "Tormented Shadow": "W",
    "Black Shield": "E",
    "Soul Shackles": "R",
};

function toggleSkillAssignments() {
    showButtonNames = !showButtonNames;
    showSkillAssignments();
}

function selectSkill(cell) {
    const skillName = cell.textContent.trim();
    if (skillName) {
        if (cell.classList.contains('selected')) {
            cell.classList.remove('selected');
            selectedSkills = selectedSkills.filter(item => item !== skillName);
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerText = "Please select 4 skills first."
        } else {
            if (selectedSkills.length < 4) {
                cell.classList.add('selected');
                selectedSkills.push(skillName);
                if (selectedSkills.length === 4) {
                    checkSkills();
                }
            }
        }
    }
}

function shuffleArray() {
    const array = Object.keys(skillAssignments);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    const table = document.getElementById("skills-table");
    const cells = table.querySelectorAll("td");
    array.forEach((skill, i) => {
        const cell = cells[i];
        cell.textContent = skill;
        cell.onclick = function () {
            selectSkill(this); // Changed to 'this'
        };
    });

}

function checkSkills() {
    const resultsDiv = document.getElementById("results");
    if (selectedSkills.length < 4) {
        resultsDiv.innerText = "Please select 4 skills first.";
        return;
    }

    const championsMap = {
        "Mystic Shot": "Ezreal",
        "Essence Flux": "Ezreal",
        "Arcane Shift": "Ezreal",
        "Trueshot Barrage": "Ezreal",
        "Parrrley": "Gangplank",
        "Remove Scurvy": "Gangplank",
        "Powder Keg": "Gangplank",
        "Cannon Barrage": "Gangplank",
        "Boomerang Blade": "Sivir",
        "Ricochet": "Sivir",
        "Spell Shield": "Sivir",
        "Blade Waltz": "Sivir",
        "Dark Binding": "Morgana",
        "Tormented Shadow": "Morgana",
        "Black Shield": "Morgana",
        "Soul Shackles": "Morgana",
    };

    const uniqueChampions = new Set(selectedSkills.map(skill => championsMap[skill]));
    if (uniqueChampions.size === 1) {
        resultsDiv.innerText = `All skills belong to ${uniqueChampions.values().next().value}`;
    } else {
        resultsDiv.innerText = "The selected skills belong to different champions.";
    }
}

function showSkillAssignments() {
    const table = document.getElementById("skills-table");
    const cells = table.querySelectorAll("td");
    let index = 0;
    const skillsArray = Object.keys(skillAssignments);
    skillsArray.forEach((skill, i) => {
        const cell = cells[i];
        if (showButtonNames) {
            cell.textContent = skill + ":" + skillAssignments[skill];
        } else {
            cell.textContent = skill;
        }
        cell.classList.remove('selected'); // Clear any previous selections
        cell.onclick = function () {
            selectSkill(this); // Changed to 'this'
        };
        index++;
    });
}