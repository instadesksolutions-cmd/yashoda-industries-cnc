// ==========================================================================
// YASHODA INDUSTRIES - MAIN JAVASCRIPT & FIREBASE INTEGRATION
// ==========================================================================

// --- 1. FIREBASE SETUP (ES6 MODULES) ---
// Dhyan rahe: Isko chalane ke liye index.html me <script type="module" src="script.js"></script> likhna zaroori hai.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Niche apni Yashoda Industries ke naye Firebase project ki config dalo
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// --- 2. MOBILE MENU TOGGLE ---
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Icon change from hamburger to cross (optional)
        const icon = mobileMenuBtn.querySelector('i');
        if(navLinks.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}


// --- 3. FILE DRAG & DROP UI LOGIC ---
const fileDropArea = document.getElementById('file-drop-area');
const fileInput = document.getElementById('drawingFile');
const fileMsg = document.querySelector('.file-msg');

if (fileInput && fileDropArea) {
    // Jab user button dabakar file select kare
    fileInput.addEventListener('change', () => {
        updateFileName(fileInput.files);
    });

    // Jab user file ko box ke upar drag kare
    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = "var(--primary-color)";
        fileDropArea.style.background = "rgba(0, 210, 255, 0.05)";
    });

    // Jab user file ko box se bahar le jaye
    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.style.borderColor = "var(--border-color)";
        fileDropArea.style.background = "rgba(0,0,0,0.2)";
    });

    // Jab user file drop kare
    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.style.borderColor = "var(--border-color)";
        fileDropArea.style.background = "rgba(0,0,0,0.2)";
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFileName(e.dataTransfer.files);
        }
    });

    // File ka naam update karne ka function
    function updateFileName(files) {
        if (files.length > 0) {
            fileMsg.innerHTML = `<strong>Selected:</strong> ${files[0].name}`;
            fileMsg.style.color = "var(--primary-color)";
        } else {
            fileMsg.innerText = "Drag & drop your file here or click to browse";
            fileMsg.style.color = "var(--text-muted)";
        }
    }
}


// --- 4. FORM SUBMISSION & FIREBASE SAVE ---
const inquiryForm = document.getElementById('cnc-inquiry-form');
const submitBtn = document.getElementById('submit-btn');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Page refresh hone se rokna
        
        // Button ko "Processing..." state me dalna
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Processing RFQ...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Form se data nikalna
        const companyName = document.getElementById('companyName').value.trim();
        const contactPerson = document.getElementById('contactPerson').value.trim();
        const email = document.getElementById('email').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const jobType = document.getElementById('jobType').value;
        const partName = document.getElementById('partName').value.trim();
        const material = document.getElementById('material').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // File details (Aage chalkar yahan Firebase Storage ya Cloudinary ka code dal sakte ho)
        const file = fileInput.files.length > 0 ? fileInput.files[0] : null;
        let fileName = file ? file.name : "No file attached";

        try {
            // Data ko Firebase "inquiries" collection me save karna
            await addDoc(collection(db, "inquiries"), {
                companyName: companyName,
                contactPerson: contactPerson,
                email: email,
                whatsapp: whatsapp,
                jobType: jobType,
                partName: partName,
                material: material,
                quantity: quantity,
                message: message,
                attachedFileName: fileName, // File ka sirf naam save kar rahe hain abhi
                status: "New", // Admin panel ke liye status
                timestamp: serverTimestamp()
            });

            // Success Alert & Reset
            alert("✅ RFQ Submitted Successfully! Yashoda Industries engineering team will contact you shortly.");
            inquiryForm.reset();
            fileMsg.innerText = "Drag & drop your file here or click to browse";
            fileMsg.style.color = "var(--text-muted)";

        } catch (error) {
            console.error("Error saving inquiry: ", error);
            alert("❌ Oops! Something went wrong. Please try again or contact directly via WhatsApp.");
        } finally {
            // Button ko wapas normal karna
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.disabled = false;
        }
    });
          }
