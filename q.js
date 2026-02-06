import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBaJXCqGmUaGumvcWNE7w4FOOzTJVDH-yg",
    authDomain: "polorfriends.firebaseapp.com",
    projectId: "polorfriends",
    storageBucket: "polorfriends.firebasestorage.app",
    messagingSenderId: "328546525972",
    appId: "1:328546525972:web:a6fe0f0a45b4565a7b1801",
    measurementId: "G-07B4713DQQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getQRId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function displayContent(data) {
    const title = data.title || 'QR Content';
    const text = data.text || '';
    const imageUrl = data.imageUrl || '';
    
    document.title = title;
    document.getElementById('publicTitle').textContent = title;
    document.getElementById('publicText').textContent = text;
    
    const imageContainer = document.getElementById('publicImage');
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = title;
        img.onerror = () => img.remove();
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
    } else {
        imageContainer.innerHTML = '';
    }
    
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
}

function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
}

function loadQRContent() {
    const qrId = getQRId();
    
    if (!qrId) {
        showError();
        return;
    }
    
    try {
        const q = query(collection(db, 'qrcodes'), where('id', '==', qrId));
        
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                showError();
                return;
            }
            
            snapshot.forEach((doc) => {
                displayContent(doc.data());
            });
        }, (error) => {
            console.error('Error loading content:', error);
            showError();
        });
        
    } catch (error) {
        console.error('Error setting up listener:', error);
        showError();
    }
}

loadQRContent();
