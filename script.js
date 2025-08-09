// Telegram WebApp initialization
let tg = window.Telegram.WebApp;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupNavigation();
    loadProfileImageFromServer();
    
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
            loadProfileData();
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
        console.log('Attempting to load profile data from server database...');
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id;
        
        if (!userId) {
            console.log('No user ID available, skipping server sync');
            return;
        }
        
        // Try to fetch database.json from the server
        try {
            const response = await fetch('./database.json');
            if (response.ok) {
                const database = await response.json();
                const userData = database.users[userId.toString()];
                
                if (userData) {
                    console.log('Found user data on server:', Object.keys(userData));
                    
                    // Update localStorage with server data
                    if (userData.bio !== undefined) {
                        localStorage.setItem(`profile_bio_${userId}`, userData.bio);
                    }
                    if (userData.btc_wallet !== undefined) {
                        localStorage.setItem(`profile_btc_${userId}`, userData.btc_wallet);
                    }
                    if (userData.ltc_wallet !== undefined) {
                        localStorage.setItem(`profile_ltc_${userId}`, userData.ltc_wallet);
                    }
                    if (userData.feedback_channel !== undefined) {
                        localStorage.setItem(`profile_feedback_${userId}`, userData.feedback_channel);
                    }
                    if (userData.profile_image !== undefined) {
                        localStorage.setItem(`profile_image_${userId}`, userData.profile_image);
                    }
                    
                    // Update the form fields with server data
                    updateFormFieldsFromLocalStorage(userId);
                    console.log('Profile synchronized from server database');
                } else {
                    console.log('No profile data found on server for user:', userId);
                }
            } else {
                console.log('Could not fetch database from server');
            }
        } catch (fetchError) {
            console.log('Database sync not available (normal in production):', fetchError.message);
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
    
    // Save to localStorage first (for immediate feedback)
    localStorage.setItem(`profile_image_${userId}`, JSON.stringify(avatarData));
    
    // Save to server for cross-device sync
    saveProfileImageToServer(avatarData);
    
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
    
    // Remove from localStorage
    localStorage.removeItem(`profile_image_${userId}`);
    
    // Remove from server
    saveProfileImageToServer(null);
    
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
            
            // Save to server for cross-device sync
            saveProfileImageToServer(imageData);
            
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

// Profile image synchronization functions
function saveProfileImageToServer(imageData) {
    try {
        console.log('Attempting to save profile image to server:', {
            hasImageData: !!imageData,
            imageDataType: typeof imageData,
            hasSendData: !!tg.sendData,
            user: tg.initDataUnsafe?.user
        });
        
        if (tg.sendData) {
            const data = {
                action: 'update_profile_image',
                image_data: imageData
            };
            console.log('Sending data to Telegram bot:', data);
            tg.sendData(JSON.stringify(data));
            console.log('Data sent successfully');
        } else {
            console.error('tg.sendData is not available');
        }
    } catch (error) {
        console.error('Error sending profile image to server:', error);
    }
}

function loadProfileImageFromServer() {
    try {
        const user = tg.initDataUnsafe?.user;
        const userId = user?.id || 'guest';
        
        console.log('Loading profile image for user:', userId);
        
        // Check if we already have a local copy first
        const localImage = localStorage.getItem(`profile_image_${userId}`);
        if (localImage) {
            console.log('Using local profile image');
            return; // Use local version for now
        }
        
        // For now, we'll use a simpler approach - check if bot has profile data
        // In a real implementation, this would make an HTTP request to the bot's API
        console.log('No local profile image found');
        
    } catch (error) {
        console.error('Error loading profile image from server:', error);
    }
}

// Function to sync profile from server response
function syncProfileFromServer(profileData) {
    if (!profileData) return;
    
    const user = tg.initDataUnsafe?.user;
    const userId = user?.id || 'guest';
    
    // Save server data to localStorage for offline use
    if (profileData.profile_image) {
        localStorage.setItem(`profile_image_${userId}`, profileData.profile_image);
        
        // Refresh profile page if we're currently viewing it
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav && activeNav.getAttribute('data-page') === 'profilo') {
            showPage('profilo');
        }
    }
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
    handleAvatarChange,
    saveProfileImageToServer,
    loadProfileImageFromServer,
    syncProfileFromServer,
    saveProfileData,
    loadProfileData,
    saveProfileDataToServer,
    loadProfileDataFromServer,
    updateFormFieldsFromLocalStorage
};
