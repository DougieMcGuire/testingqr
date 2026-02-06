import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 7; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

async function createQRCode() {
    const generateBtn = document.getElementById('generateBtn');
    const qrResult = document.getElementById('qrResult');
    
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    // guard: QRCode lib must be loaded
    if (typeof QRCode === 'undefined' || typeof QRCode.toCanvas !== 'function') {
        console.error('QRCode library not found. Make sure you load the qrcode script before app.js.');
        alert('QR library missing. See console for details.');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate QR Code';
        return;
    }

    try {
        const qrId = generateId();
        
        await addDoc(collection(db, 'qrcodes'), {
            id: qrId,
            title: 'New QR Code',
            text: 'Content will appear here. Click "Edit Content" to customize.',
            imageUrl: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        const qrUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}q.html?id=${qrId}`;
        const canvas = document.getElementById('qrCanvas');

        if (!canvas) {
            console.error('qrCanvas element not found.');
            alert('QR canvas missing in the page.');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate QR Code';
            return;
        }
        
        await QRCode.toCanvas(canvas, qrUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        document.getElementById('qrId').textContent = qrId;
        document.getElementById('qrUrl').textContent = qrUrl;
        qrResult.classList.remove('hidden');
        generateBtn.classList.add('hidden');
        
        document.getElementById('downloadBtn').onclick = () => downloadQR(qrId);
        document.getElementById('editBtn').onclick = () => window.location.href = `edit.html?id=${qrId}`;
        document.getElementById('createAnotherBtn').onclick = () => window.location.reload();
        
    } catch (error) {
        console.error('Error creating QR code:', error);
        alert('Failed to create QR code. Please try again.');
        if (document.getElementById('generateBtn')) {
            document.getElementById('generateBtn').disabled = false;
            document.getElementById('generateBtn').textContent = 'Generate QR Code';
        }
    }
}

function downloadQR(id) {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) {
        alert('No QR to download.');
        return;
    }
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qr-${id}.png`;
    link.href = url;
    link.click();
}

// attach handlers after DOM ready
window.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) {
        console.error('generateBtn not found in DOM.');
        return;
    }
    generateBtn.addEventListener('click', createQRCode);
});
