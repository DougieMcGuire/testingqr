import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

let currentDocId = null;

function getQRId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadQRData() {
    const qrId = getQRId();
    
    if (!qrId) {
        alert('No QR code ID provided');
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('currentId').textContent = qrId;
    document.getElementById('viewPublicBtn').href = `q.html?id=${qrId}`;
    
    try {
        const q = query(collection(db, 'qrcodes'), where('id', '==', qrId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            alert('QR code not found');
            window.location.href = 'dashboard.html';
            return;
        }
        
        querySnapshot.forEach((document) => {
            currentDocId = document.id;
            const data = document.data();
            
            document.getElementById('title').value = data.title || '';
            document.getElementById('text').value = data.text || '';
            document.getElementById('imageUrl').value = data.imageUrl || '';
            
            updatePreview();
        });
        
    } catch (error) {
        console.error('Error loading QR data:', error);
        alert('Failed to load QR code data');
    }
}

function updatePreview() {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const imageUrl = document.getElementById('imageUrl').value;
    
    const preview = document.getElementById('previewContent');
    
    let html = '';
    
    if (title) {
        html += `<h1 style="font-size: 1.5rem; margin-bottom: 1rem;">${title}</h1>`;
    }
    
    if (imageUrl) {
        html += `<img src="${imageUrl}" alt="Content image" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem;" onerror="this.style.display='none'">`;
    }
    
    if (text) {
        html += `<p style="white-space: pre-wrap; line-height: 1.6;">${text}</p>`;
    }
    
    if (!html) {
        html = '<p style="color: #64748b;">Preview will appear here...</p>';
    }
    
    preview.innerHTML = html;
}

async function saveChanges(e) {
    e.preventDefault();
    
    if (!currentDocId) {
        alert('Document ID not found');
        return;
    }
    
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const imageUrl = document.getElementById('imageUrl').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const docRef = doc(db, 'qrcodes', currentDocId);
        await updateDoc(docRef, {
            title,
            text,
            imageUrl,
            updatedAt: serverTimestamp()
        });
        
        submitBtn.textContent = 'Saved!';
        setTimeout(() => {
            submitBtn.textContent = 'Save Changes';
            submitBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes');
        submitBtn.textContent = 'Save Changes';
        submitBtn.disabled = false;
    }
}

loadQRData();

document.getElementById('editForm').addEventListener('submit', saveChanges);
document.getElementById('title').addEventListener('input', updatePreview);
document.getElementById('text').addEventListener('input', updatePreview);
document.getElementById('imageUrl').addEventListener('input', updatePreview);
