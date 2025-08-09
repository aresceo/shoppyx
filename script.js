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
            // Load saved profile data after rendering
            setTimeout(() => {
                loadProfileData();
                // Force sync from server after local data is loaded
                setTimeout(() => {
                    loadProfileDataFromServer();
                }, 1000);
            }, 100);
            break;
        case 'venditore':
            content.innerHTML = getVenditorePage();
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
    
    // Try to get Telegram profile photo using the user object
    let avatarContent;
    if (user?.photo_url) {
        // Use actual Telegram profile photo if available
        avatarContent = `<img src="${user.photo_url}" alt="Profile Photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`;
    } else {
        // Fallback to user initials or default icon
        const initials = userName.substring(0, 2).toUpperCase();
        avatarContent = `<div style="width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">${initials}</div>`;
    }
    
    return `
        <div class="profile-page">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${avatarContent}
                </div>
                <h2 class="profile-name">${userName}</h2>
                <p class="profile-info">${userInfo}</p>
            </div>
            
            <div class="profile-form">
                <div class="form-section">
                    <label class="form-label">📝 Bio personale</label>
                    <textarea class="form-textarea" placeholder="Racconta qualcosa di te..." id="profileBio"></textarea>
                </div>
                
                <div class="form-section">
                    <h3 class="section-title">💰 Indirizzi Wallet</h3>
                    
                    <div class="wallet-input">
                        <div class="crypto-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f7931a">
                                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
                                <path d="M17.6 11.346c.235-1.57-.96-2.415-2.592-2.98l.53-2.124-1.293-.322-.516 2.07c-.34-.085-.688-.164-1.034-.242l.52-2.087L11.926 5.3l-.531 2.124c-.281-.064-.557-.127-.826-.196l.001-.006-1.784-.446-.344 1.381s.96.22.94.234c.524.13.619.478.603.754l-.604 2.425c.036.009.083.022.135.043l-.137-.034-.847 3.396c-.064.158-.227.396-.594.305.013.019-.94-.234-.94-.234l-.643 1.48 1.684.42c.313.078.62.16.922.237l-.536 2.152 1.293.322.53-2.126c.354.096.697.185 1.03.269l-.53 2.121 1.293.322.536-2.15c2.211.418 3.87.25 4.57-1.75.563-1.6-.028-2.523-1.186-3.124.844-.194 1.479-.751 1.649-1.898zm-2.95 4.138c-.4 1.61-3.11.74-3.99.522l.712-2.852c.88.22 3.696.653 3.278 2.33zm.4-4.16c-.365 1.464-2.62.72-3.35.538l.645-2.587c.73.182 3.089.522 2.705 2.049z" fill="white"/>
                            </svg>
                            <span>BTC</span>
                        </div>
                        <input type="text" class="form-input" placeholder="Inserisci indirizzo Bitcoin" id="btcWallet">
                    </div>
                    
                    <div class="wallet-input">
                        <div class="crypto-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#bfbbbb">
                                <circle cx="12" cy="12" r="12"/>
                                <path d="M10.427 11.92c0-1.427.877-2.5 2.073-2.5s2.073 1.073 2.073 2.5-.877 2.5-2.073 2.5-2.073-1.073-2.073-2.5zm-2.146.08c0 2.293 1.902 4.16 4.219 4.16s4.219-1.867 4.219-4.16S14.793 7.84 12.5 7.84 8.281 9.707 8.281 12zm1.146-4.84L6.854 4.587a.5.5 0 0 0-.708.708L8.72 7.867a5.963 5.963 0 0 1 3.78-1.36c1.36 0 2.627.467 3.64 1.24l2.573-2.574a.5.5 0 1 0-.707-.707l-2.427 2.427zm6.293 9.68l2.573 2.573a.5.5 0 0 0 .708-.708l-2.574-2.572a5.963 5.963 0 0 1-3.78 1.36c-1.36 0-2.627-.467-3.64-1.24L6.434 18.827a.5.5 0 1 0 .707.707l2.427-2.427z" fill="white"/>
                            </svg>
                            <span>LTC</span>
                        </div>
                        <input type="text" class="form-input" placeholder="Inserisci indirizzo Litecoin" id="ltcWallet">
                    </div>
                </div>
                
                <div class="form-section">
                    <label class="form-label">💬 Canale Feedback</label>
                    <input type="text" class="form-input" placeholder="@nomecanalefeedback" id="feedbackChannel">
                </div>
                
                <button class="save-profile-btn" onclick="saveProfileData()">
                    💾 Salva Profilo
                </button>
            </div>
            
            
        </div>
    `;
}

function getVenditorePage() {
    return `
        <div class="venditore-page">
            <div class="venditore-header">
                <div class="venditore-icon">⭐</div>
                <h2 class="venditore-title">Diventa Venditore</h2>
                <p class="venditore-subtitle">Inizia a vendere su ShoppyX</p>
            </div>
            
            <div class="coming-soon">
                <div class="coming-soon-icon">🚧</div>
                <h3>Prossimamente...</h3>
                <p>Stiamo lavorando per portarti la migliore esperienza di vendita. Questa sezione sarà disponibile molto presto!</p>
            </div>
        </div>
    `;
}

function saveProfileData() {
    try {
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id || 'guest';
        
        // Get form values
        const bio = document.getElementById('profileBio')?.value || '';
        const btcWallet = document.getElementById('btcWallet')?.value || '';
        const ltcWallet = document.getElementById('ltcWallet')?.value || '';
        const feedbackChannel = document.getElementById('feedbackChannel')?.value || '';
        
        // Save to localStorage
        localStorage.setItem(`profile_bio_${userId}`, bio);
        localStorage.setItem(`profile_btc_${userId}`, btcWallet);
        localStorage.setItem(`profile_ltc_${userId}`, ltcWallet);
        localStorage.setItem(`profile_feedback_${userId}`, feedbackChannel);
        
        // Save to server for cross-device sync
        const profileData = {
            bio: bio,
            btc_wallet: btcWallet,
            ltc_wallet: ltcWallet,
            feedback_channel: feedbackChannel
        };
        saveProfileDataToServer(profileData);
        
        // Show success message
        showSuccessMessage('Profilo salvato con successo!');
        
        // Haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }
        
    } catch (error) {
        console.error('Error saving profile data:', error);
        showError('Errore nel salvare il profilo');
    }
}

function loadProfileData() {
    try {
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id || 'guest';
        
        // Load saved data from localStorage first for immediate display
        const bio = localStorage.getItem(`profile_bio_${userId}`) || '';
        const btcWallet = localStorage.getItem(`profile_btc_${userId}`) || '';
        const ltcWallet = localStorage.getItem(`profile_ltc_${userId}`) || '';
        const feedbackChannel = localStorage.getItem(`profile_feedback_${userId}`) || '';
        
        // Populate form fields when they exist
        setTimeout(() => {
            const bioField = document.getElementById('profileBio');
            const btcField = document.getElementById('btcWallet');
            const ltcField = document.getElementById('ltcWallet');
            const feedbackField = document.getElementById('feedbackChannel');
            
            if (bioField) bioField.value = bio;
            if (btcField) btcField.value = btcWallet;
            if (ltcField) ltcField.value = ltcWallet;
            if (feedbackField) feedbackField.value = feedbackChannel;
            
            // Now sync from server to get the latest data
            loadProfileDataFromServer();
        }, 100);
        
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2ed573;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

function saveProfileDataToServer(profileData) {
    try {
        console.log('Attempting to save profile data to server:', profileData);
        
        if (tg.sendData) {
            const data = {
                action: 'update_profile_data',
                profile_data: profileData
            };
            console.log('Sending profile data to Telegram bot:', data);
            tg.sendData(JSON.stringify(data));
            console.log('Profile data sent successfully');
        } else {
            console.error('tg.sendData is not available for profile data');
        }
    } catch (error) {
        console.error('Error sending profile data to server:', error);
    }
}

async function loadProfileDataFromServer() {
    try {
        console.log('Requesting profile data from server via Telegram...');
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id;
        
        if (!userId) {
            console.log('No user ID available, skipping server sync');
            return;
        }
        
        // Request profile data from server via Telegram bot
        if (tg.sendData) {
            const requestData = {
                action: 'get_profile_data',
                user_id: userId
            };
            console.log('Requesting profile data from bot:', requestData);
            tg.sendData(JSON.stringify(requestData));
        }
        
        // Also try to fetch from the synced database file as fallback
        try {
            const timestamp = Date.now();
            const response = await fetch(`../database.json?t=${timestamp}`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            if (response.ok) {
                const database = await response.json();
                const userData = database.users[userId.toString()];
                
                if (userData) {
                    console.log('Found user data in main database:', Object.keys(userData));
                    
                    // Get server data
                    const serverData = {
                        bio: userData.bio || '',
                        btc_wallet: userData.btc_wallet || '',
                        ltc_wallet: userData.ltc_wallet || '',
                        feedback_channel: userData.feedback_channel || ''
                    };
                    
                    // Check if server data is different from localStorage
                    const currentBio = localStorage.getItem(`profile_bio_${userId}`) || '';
                    const currentBtc = localStorage.getItem(`profile_btc_${userId}`) || '';
                    const currentLtc = localStorage.getItem(`profile_ltc_${userId}`) || '';
                    const currentFeedback = localStorage.getItem(`profile_feedback_${userId}`) || '';
                    
                    const hasChanges = (
                        currentBio !== serverData.bio ||
                        currentBtc !== serverData.btc_wallet ||
                        currentLtc !== serverData.ltc_wallet ||
                        currentFeedback !== serverData.feedback_channel
                    );
                    
                    if (hasChanges) {
                        console.log('Server data differs from local, updating...');
                        
                        // Update localStorage with server data
                        localStorage.setItem(`profile_bio_${userId}`, serverData.bio);
                        localStorage.setItem(`profile_btc_${userId}`, serverData.btc_wallet);
                        localStorage.setItem(`profile_ltc_${userId}`, serverData.ltc_wallet);
                        localStorage.setItem(`profile_feedback_${userId}`, serverData.feedback_channel);
                        
                        // Update the form fields with server data
                        updateFormFieldsFromLocalStorage(userId);
                        console.log('Profile synchronized from main database');
                        
                        // Show notification that data was synced
                        showSuccessMessage('Dati sincronizzati dal database!');
                    } else {
                        console.log('Server data matches local data, no update needed');
                    }
                } else {
                    console.log('No profile data found in main database for user:', userId);
                }
            } else {
                console.log('Could not fetch main database file:', response.status);
            }
        } catch (fetchError) {
            console.log('Could not access main database file:', fetchError.message);
        }
        
    } catch (error) {
        console.error('Error loading profile data from server:', error);
    }
}

function updateFormFieldsFromLocalStorage(userId) {
    // Update form fields with synchronized data
    const bio = localStorage.getItem(`profile_bio_${userId}`) || '';
    const btcWallet = localStorage.getItem(`profile_btc_${userId}`) || '';
    const ltcWallet = localStorage.getItem(`profile_ltc_${userId}`) || '';
    const feedbackChannel = localStorage.getItem(`profile_feedback_${userId}`) || '';
    
    const bioField = document.getElementById('profileBio');
    const btcField = document.getElementById('btcWallet');
    const ltcField = document.getElementById('ltcWallet');
    const feedbackField = document.getElementById('feedbackChannel');
    
    if (bioField && bioField.value !== bio) bioField.value = bio;
    if (btcField && btcField.value !== btcWallet) btcField.value = btcWallet;
    if (ltcField && ltcField.value !== ltcWallet) ltcField.value = ltcWallet;
    if (feedbackField && feedbackField.value !== feedbackChannel) feedbackField.value = feedbackChannel;
    
    // Also update avatar if changed
    const profileImage = localStorage.getItem(`profile_image_${userId}`);
    if (profileImage) {
        const avatarImg = document.querySelector('.avatar-container img');
        if (avatarImg && avatarImg.src !== profileImage) {
            avatarImg.src = profileImage;
            avatarImg.style.display = 'block';
            const placeholderSpan = document.querySelector('.avatar-container .avatar-placeholder');
            if (placeholderSpan) placeholderSpan.style.display = 'none';
        }
    }
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







// Export functions for potential external use
window.ShoppyXApp = {
    showPage,
    showLoading,
    showError,
    initApp,
    saveProfileData,
    loadProfileData,
    saveProfileDataToServer,
    loadProfileDataFromServer,
    updateFormFieldsFromLocalStorage
};
