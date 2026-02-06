import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

async function loadQRCodes() {
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('emptyState');
    const qrList = document.getElementById('qrList');
    
    try {
        const q = query(collection(db, 'qrcodes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        loading.classList.add('hidden');
        
        if (querySnapshot.empty) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = createQRItem(data, doc.id);
            qrList.appendChild(item);
        });
        
    } catch (error) {
        console.error('Error loading QR codes:', error);
        loading.textContent = 'Failed to load QR codes';
    }
}

function createQRItem(data, docId) {
    const item = document.createElement('div');
    item.className = 'qr-item';
    item.onclick = () => window.location.href = `edit.html?id=${data.id}`;
    
    const title = data.title || 'Untitled';
    const text = data.text || 'No content';
    const date = formatDate(data.createdAt);
    
    item.innerHTML = `
        <div class="qr-item-header">
            <span class="qr-item-id">${data.id}</span>
            <span class="qr-item-date">${date}</span>
        </div>
        <div class="qr-item-title">${title}</div>
        <div class="qr-item-text">${text}</div>
    `;
    
    return item;
}

loadQRCodes();
