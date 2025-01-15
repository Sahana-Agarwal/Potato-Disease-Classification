const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const diseaseName = document.getElementById('diseaseName');
const confidenceScore = document.getElementById('confidenceScore');
const confidenceBar = document.getElementById('confidenceBar');
const recommendations = document.getElementById('recommendations');
const recommendationText = document.getElementById('recommendationText');

// Disease recommendations database
const diseaseRecommendations = {
    'Early Blight': 'Apply fungicides containing chlorothalonil or copper-based products. Ensure proper plant spacing for good air circulation. Remove infected leaves and maintain field hygiene.',
    'Late Blight': 'Use fungicides with mancozeb or chlorothalonil. Practice crop rotation. Remove volunteer potato plants and infected plant debris. Monitor weather conditions.',
    'Healthy': 'Continue maintaining good agricultural practices. Monitor regularly for any signs of disease. Ensure proper irrigation and fertilization.',
};

// Upload handling
uploadSection.addEventListener('click', () => fileInput.click());

uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.style.borderColor = '#4299e1';
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.style.borderColor = '#cbd5e0';
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.style.borderColor = '#cbd5e0';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewSection.style.display = 'block';
        resultSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function classifyImage() {
    console.log("Classify Image function called");
    const file = fileInput.files[0];
    if (!file) return;

    loadingSection.style.display = 'block';
    previewSection.style.display = 'none';

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Classification failed');
        }

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Error:', error);
        loadingSection.style.display = 'none';
        previewSection.style.display = 'block';
    }
}

function displayResults(results) {
    loadingSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    const confidenceValue = (results.confidence * 100).toFixed(1);
    
    diseaseName.textContent = results.class;
    confidenceScore.textContent = confidenceValue;
    confidenceBar.style.width = `${confidenceValue}%`;
    
    recommendations.style.display = 'block';
    recommendationText.textContent = diseaseRecommendations[results.class];
    
    if (results.confidence > 0.9) {
        confidenceBar.style.background = '#48bb78'; // green
    } else if (results.confidence > 0.8) {
        confidenceBar.style.background = '#ecc94b'; // yellow
    } else {
        confidenceBar.style.background = '#f56565'; // red
    }
}
