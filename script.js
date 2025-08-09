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
    
    return `
        <div class="profile-page">
            <div class="profile-header">
                <div class="profile-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9 19.1 16 17 16H7C4.9 16 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11S8 9.2 8 7 9.8 3 12 3 16 4.8 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 class="profile-name">${userName}</h2>
                <p class="profile-info">${userInfo}</p>
            </div>
            
            <div style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">👤</div>
                <h2 style="color: var(--tg-theme-text-color, #000000); margin-bottom: 10px;">Profilo in costruzione</h2>
                <p style="color: var(--tg-theme-hint-color, #666666);">Stiamo lavorando per offrirti un'area profilo completa e personalizzata!</p>
            </div>
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

// Export functions for potential external use
window.ShoppyXApp = {
    showPage,
    showLoading,
    showError,
    initApp
};
