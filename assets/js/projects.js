const words = ["Inspire", "Innovate", "Engage", "Empower", "Challenge"];
let index = 0;

function typeWord(word) {
    const target = document.getElementById("project-hero-word");
    let current = "";
    const interval = setInterval(() => {
        current += word[index];
        target.innerText = current;
        index++;
        if (index === word.length) {
            clearInterval(interval);
            setTimeout(() => {
                eraseWord(word);
            }, 1500); // Adjust the duration before erasing
        }
    }, 50); // Adjust the typing speed
}

function eraseWord(word) {
    const target = document.getElementById("project-hero-word");
    let current = word;
    const interval = setInterval(() => {
        current = current.slice(0, -1);
        target.innerText = current;
        if (current === "") {
            clearInterval(interval);
            index = 0;
            setTimeout(() => {
                const nextWord = words[Math.floor(Math.random() * words.length)];
                typeWord(nextWord);
            }, 500); // Adjust the duration before typing the next word
        }
    }, 25); // Adjust the erasing speed
}

typeWord(words[Math.floor(Math.random() * words.length)]);


// Get all project cards
const projectCards = document.querySelectorAll('.project-card');

// Function to update gradient degree based on mouse position
function updateGradientDegree(event, card) {
    const rect = card.getBoundingClientRect(); // Get the position of the card relative to the viewport
    const offsetX = event.clientX - rect.left; // Calculate the horizontal distance from the left edge of the card
    const offsetY = event.clientY - rect.top; // Calculate the vertical distance from the top edge of the card
    const xPercent = (offsetX / rect.width) * 100; // Convert horizontal distance to percentage
    const yPercent = (offsetY / rect.height) * 100; // Convert vertical distance to percentage
    const gradientDegree = 135 + (xPercent / 2) + (yPercent / 2); // Calculate the gradient degree based on mouse position
    card.style.setProperty('--gradient-degree', `${gradientDegree}deg`); // Set CSS variable value
}

// Function to handle mousemove event on each card
function handleMouseMove(event) {
    const card = this; // 'this' refers to the current card being hovered over
    updateGradientDegree(event, card);
}

// Function to handle mouseleave event on each card
function handleMouseLeave() {
    const card = this; // 'this' refers to the current card
    card.style.removeProperty('--gradient-degree');
}

// Add mousemove and mouseleave event listeners to each project card
projectCards.forEach(card => {
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
});

