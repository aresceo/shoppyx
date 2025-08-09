// Telegram WebApp initialization
let tg = window.Telegram.WebApp;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupNavigation();
    
    // Set default page
    showPage('market');
});

function initApp() {
    // Initialize Telegram WebApp
    tg.ready();
    
    // Expand to full height
    tg.expand();
    
    // Set header color
    tg.setHeaderColor('#ffffff');
    
    // Apply Telegram theme
    applyTelegramTheme();
    
    console.log('ShoppyX Mini App initialized');
}

function applyTelegramTheme() {
    // Apply Telegram theme variables if available
    if (tg.themeParams) {
        const theme = tg.themeParams;
        const root = document.documentElement;
        
        if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
        if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color);
        if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
        if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color);
        if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
        if (theme.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Haptic feedback if available
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });
}

function showPage(pageName) {
    const content = document.getElementById('content');
    
    switch(pageName) {
        case 'market':
            content.innerHTML = getMarketPage();
            break;
        case 'profilo':
            content.innerHTML = getProfilePage();
            break;
        default:
            content.innerHTML = getWelcomePage();
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.getAttribute('data-page') === pageName) {
            nav.classList.add('active');
        }
    });
}

function getWelcomePage() {
    return `
        <div class="welcome-screen">
            <h1 class="welcome-title">Benvenuto in ShoppyX</h1>
            <p class="welcome-subtitle">La tua app di shopping preferita</p>
        </div>
    `;
}

function getMarketPage() {
    return `
        <div class="market-page">
            <div class="market-header">
                <h1 class="market-title">Market</h1>
                <p class="market-subtitle">Esplora i prodotti disponibili</p>
            </div>
            
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">🛍️</div>
                <h2 style="color: var(--tg-theme-text-color, #000000); margin-bottom: 10px;">Market in arrivo</h2>
                <p style="color: var(--tg-theme-hint-color, #666666);">Stiamo preparando una fantastica esperienza di shopping per te!</p>
            </div>
        </div>
    `;
}

function getProfilePage() {
    // Get user info from Telegram if available
    const user = tg.initDataUnsafe?.user;
    const userName = user?.first_name || 'Utente';
    const userInfo = user?.username ? `@${user.username}` : 'Utente ShoppyX';
    const userId = user?.id || 'guest';
    
    // Check if user has a saved profile image
    const savedImage = localStorage.getItem(`profile_image_${userId}`);
    
    let avatarContent;
    if (savedImage) {
        try {
            const avatarData = JSON.parse(savedImage);
            if (avatarData.type === 'emoji') {
                // Emoji avatar
                avatarContent = `<div style="background-color: ${avatarData.color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">${avatarData.emoji}</div>`;
            } else {
                // Custom image
                avatarContent = `<img src="${savedImage}" alt="Profile" />`;
            }
        } catch (e) {
            // Fallback for old format or custom image
            avatarContent = `<img src="${savedImage}" alt="Profile" />`;
        }
    } else {
        // Default avatar
        avatarContent = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9 19.1 16 17 16H7C4.9 16 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7 9.8 3 12 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
    
    return `
        <div class="profile-page">
            <div class="profile-header">
                <div class="profile-avatar" onclick="openAvatarSelector()">
                    ${avatarContent}
                    <div class="avatar-edit-button">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </div>
                </div>
                <h2 class="profile-name">${userName}</h2>
                <p class="profile-info">${userInfo}</p>
            </div>
            
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">👤</div>
                <h2 style="color: var(--tg-theme-text-color, #000000); margin-bottom: 10px;">Profilo in costruzione</h2>
                <p style="color: var(--tg-theme-hint-color, #666666);">Stiamo lavorando per offrirti un'area profilo completa e personalizzata!</p>
            </div>
            
            <!-- Avatar Selection Modal -->
            <div id="avatarModal" class="avatar-modal">
                <div class="avatar-modal-content">
                    <div class="avatar-modal-header">
                        <h3 class="avatar-modal-title">Scegli Avatar</h3>
                        <p class="avatar-modal-subtitle">Seleziona un'immagine per il tuo profilo</p>
                    </div>
                    
                    <div class="avatar-options">
                        <div class="avatar-option" style="background-color: #ff4757;" onclick="selectAvatar('#ff4757', '👤')">
                            👤
                        </div>
                        <div class="avatar-option" style="background-color: #5352ed;" onclick="selectAvatar('#5352ed', '🛍️')">
                            🛍️
                        </div>
                        <div class="avatar-option" style="background-color: #ff6b35;" onclick="selectAvatar('#ff6b35', '🎯')">
                            🎯
                        </div>
                        <div class="avatar-option" style="background-color: #26de81;" onclick="selectAvatar('#26de81', '⭐')">
                            ⭐
                        </div>
                        <div class="avatar-option" style="background-color: #fed330;" onclick="selectAvatar('#fed330', '🎨')">
                            🎨
                        </div>
                        <div class="avatar-option" style="background-color: #fd79a8;" onclick="selectAvatar('#fd79a8', '💎')">
                            💎
                        </div>
                        <div class="avatar-option" style="background-color: #00b894;" onclick="selectAvatar('#00b894', '🚀')">
                            🚀
                        </div>
                        <div class="avatar-option" style="background-color: #6c5ce7;" onclick="selectAvatar('#6c5ce7', '🎭')">
                            🎭
                        </div>
                        <div class="avatar-option" style="background-color: #fd79a8;" onclick="selectAvatar('#fd79a8', '🎪')">
                            🎪
                        </div>
                    </div>
                    
                    <div class="avatar-actions">
                        <button class="modal-button primary" onclick="uploadCustomImage()">
                            📸 Carica foto personalizzata
                        </button>
                        <button class="modal-button secondary" onclick="closeAvatarSelector()">
                            Annulla
                        </button>
                        <button class="modal-button danger" onclick="removeAvatar()">
                            🗑️ Rimuovi avatar
                        </button>
                    </div>
                </div>
            </div>
            
            <input type="file" id="avatarFileInput" class="avatar-file-input" accept="image/*" onchange="handleAvatarChange(event)">
        </div>
    `;
}

// Utility functions
function showLoading() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
    `;
}

function showError(message) {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h2 style="color: var(--tg-theme-text-color, #000000); margin-bottom: 10px;">Errore</h2>
            <p style="color: var(--tg-theme-hint-color, #666666);">${message}</p>
        </div>
    `;
}

// Handle back button if needed
tg.onEvent('backButtonClicked', function() {
    // Handle back navigation
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav && activeNav.getAttribute('data-page') !== 'market') {
        showPage('market');
    }
});

// Avatar editing functions
function openAvatarSelector() {
    const modal = document.getElementById('avatarModal');
    modal.classList.add('show');
    
    // Haptic feedback if available
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function closeAvatarSelector() {
    const modal = document.getElementById('avatarModal');
    modal.classList.remove('show');
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function selectAvatar(color, emoji) {
    const user = tg.initDataUnsafe?.user;
    const userId = user?.id || 'guest';
    
    // Create avatar data
    const avatarData = {
        type: 'emoji',
        color: color,
        emoji: emoji
    };
    
    // Save to localStorage
    localStorage.setItem(`profile_image_${userId}`, JSON.stringify(avatarData));
    
    // Close modal and refresh profile
    closeAvatarSelector();
    showPage('profilo');
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

function uploadCustomImage() {
    const fileInput = document.getElementById('avatarFileInput');
    fileInput.click();
    closeAvatarSelector();
}

function removeAvatar() {
    const user = tg.initDataUnsafe?.user;
    const userId = user?.id || 'guest';
    
    localStorage.removeItem(`profile_image_${userId}`);
    closeAvatarSelector();
    showPage('profilo');
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Per favore seleziona un file immagine valido.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('L\'immagine è troppo grande. Massimo 5MB.');
        return;
    }
    
    showLoading();
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Get user ID for storage
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id || 'guest';
        
        // Save image to localStorage (as raw data for custom images)
        try {
            localStorage.setItem(`profile_image_${userId}`, imageData);
            
            // Refresh the profile page to show new avatar
            showPage('profilo');
            
            // Show success message
            setTimeout(() => {
                if (tg.HapticFeedback) {
                    tg.HapticFeedback.notificationOccurred('success');
                }
            }, 500);
            
        } catch (error) {
            console.error('Error saving profile image:', error);
            showError('Errore nel salvare l\'immagine. Riprova con un\'immagine più piccola.');
        }
    };
    
    reader.onerror = function() {
        showError('Errore nel leggere il file immagine.');
    };
    
    reader.readAsDataURL(file);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('avatarModal');
    if (modal && event.target === modal) {
        closeAvatarSelector();
    }
});

// Export functions for potential external use
window.ShoppyXApp = {
    showPage,
    showLoading,
    showError,
    initApp,
    openAvatarSelector,
    closeAvatarSelector,
    selectAvatar,
    uploadCustomImage,
    removeAvatar,
    handleAvatarChange
};
