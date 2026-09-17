/* ==========================================================================
   QUOTE GENERATOR - APPLICATION LOGIC (app.js)
   Authenticated Quote Discovery & Favourites System
   ========================================================================== */

(function () {
  'use strict';

  // --- Category Definitions & Accents ---
  const CATEGORIES_CONFIG = {
    all: { name: 'All Categories', icon: '✨', accent: '#6b21a8', rgb: '107, 33, 168' },
    motivation: { name: 'Motivation', icon: '🚀', accent: '#7c3aed', rgb: '124, 58, 237' },
    success: { name: 'Success', icon: '🏆', accent: '#0d9488', rgb: '13, 148, 136' },
    life: { name: 'Life', icon: '🌱', accent: '#047857', rgb: '4, 120, 87' },
    love: { name: 'Love', icon: '❤️', accent: '#be123c', rgb: '190, 18, 60' },
    wisdom: { name: 'Wisdom', icon: '💡', accent: '#b45309', rgb: '180, 83, 9' },
    happiness: { name: 'Happiness', icon: '😊', accent: '#c026d3', rgb: '192, 38, 211' },
    leadership: { name: 'Leadership', icon: '👑', accent: '#4338ca', rgb: '67, 56, 202' }
  };

  // --- App State ---
  let activeView = 'home-view';
  let currentCategory = 'all';
  let currentQuote = null;
  let recentQuoteIds = [];
  let isSpeaking = false;
  let speechUtterance = null;
  let pendingFavoriteQuote = null;

  // --- Web Crypto Authentication Service ---
  const AuthService = {
    USERS_KEY: 'quoteverse_users_v2',
    SESSION_KEY: 'quoteverse_session_v2',

    async hashPassword(password, salt) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    generateSalt() {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    getUsers() {
      try {
        const stored = localStorage.getItem(this.USERS_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    },

    saveUsers(users) {
      try {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      } catch (e) {
        console.error('Failed to save users database:', e);
      }
    },

    getCurrentUser() {
      try {
        const sessionStr = localStorage.getItem(this.SESSION_KEY);
        if (!sessionStr) return null;
        const session = JSON.parse(sessionStr);
        const users = this.getUsers();
        return users[session.email] || null;
      } catch (e) {
        return null;
      }
    },

    async register(name, email, password, confirmPassword) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim();

      if (!cleanName) throw new Error('Please enter your full name.');
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please re-enter.');
      }

      const users = this.getUsers();
      if (users[cleanEmail]) {
        throw new Error('An account with this email address already exists.');
      }

      const salt = this.generateSalt();
      const passwordHash = await this.hashPassword(password, salt);
      const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      const newUser = {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        salt: salt,
        passwordHash: passwordHash,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      users[cleanEmail] = newUser;
      this.saveUsers(users);

      this.setSession(cleanEmail);
      return newUser;
    },

    async login(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        throw new Error('Please enter both your email address and password.');
      }

      const users = this.getUsers();
      const user = users[cleanEmail];

      if (!user) {
        throw new Error("We couldn't sign you in. Please check your email and password and try again.");
      }

      const hashAttempt = await this.hashPassword(password, user.salt);
      if (hashAttempt !== user.passwordHash) {
        throw new Error("We couldn't sign you in. Please check your email and password and try again.");
      }

      this.setSession(cleanEmail);
      return user;
    },

    setSession(email) {
      try {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify({ email: email, loginTime: Date.now() }));
      } catch (e) {}
    },

    logout() {
      try {
        localStorage.removeItem(this.SESSION_KEY);
      } catch (e) {}
    }
  };

  // --- Favourites Management Service ---
  const FavouritesService = {
    getStorageKey(userId) {
      return `quoteverse_favs_${userId}`;
    },

    getUserFavorites(userId) {
      if (!userId) return [];
      try {
        const stored = localStorage.getItem(this.getStorageKey(userId));
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    },

    saveUserFavorites(userId, favorites) {
      if (!userId) return;
      try {
        localStorage.setItem(this.getStorageKey(userId), JSON.stringify(favorites));
      } catch (e) {}
    },

    toggleFavorite(userId, quote) {
      if (!userId || !quote) return { isFav: false, count: 0 };

      let favorites = this.getUserFavorites(userId);
      const index = favorites.findIndex(f => f.id === quote.id);
      let isFav = false;

      if (index > -1) {
        favorites.splice(index, 1);
        isFav = false;
      } else {
        favorites.unshift(quote);
        isFav = true;
      }

      this.saveUserFavorites(userId, favorites);
      return { isFav: isFav, count: favorites.length };
    },

    isFavorite(userId, quoteId) {
      if (!userId || !quoteId) return false;
      const favorites = this.getUserFavorites(userId);
      return favorites.some(f => f.id === quoteId);
    }
  };

  // --- DOM Element References ---
  const navAuthBtn = document.getElementById('nav-auth-btn');
  const navAuthText = document.getElementById('nav-auth-text');
  const favCountBadge = document.getElementById('fav-count-badge');
  const brandLogo = document.getElementById('brand-logo');

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navList = document.getElementById('nav-list');

  // Views
  const views = document.querySelectorAll('.app-view');

  // Quote Card & Controls Elements
  const categorySelect = document.getElementById('category-select');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteCategoryTag = document.getElementById('quote-category-tag');
  const quoteLengthBadge = document.getElementById('quote-length-badge');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyIcon = document.getElementById('copy-icon');
  const checkIcon = document.getElementById('check-icon');
  const copyBtnText = document.getElementById('copy-btn-text');
  const speakBtn = document.getElementById('speak-btn');
  const speakBtnText = document.getElementById('speak-btn-text');
  const favoriteBtn = document.getElementById('favorite-btn');
  const favBtnText = document.getElementById('fav-btn-text');
  const shareBtn = document.getElementById('share-btn');

  // Favourites Gallery Elements
  const favoritesGalleryContainer = document.getElementById('favorites-gallery-container');
  const favGalleryCount = document.getElementById('fav-gallery-count');

  // Auth Forms Elements
  const authTabSignin = document.getElementById('auth-tab-signin');
  const authTabSignup = document.getElementById('auth-tab-signup');
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');
  const signinError = document.getElementById('signin-error');
  const signupError = document.getElementById('signup-error');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToSignin = document.getElementById('switch-to-signin');
  const forgotPasswordLink = document.getElementById('forgot-password-link');

  // Account Card Elements
  const accountAvatarInitials = document.getElementById('account-avatar-initials');
  const accountUserName = document.getElementById('account-user-name');
  const accountUserEmail = document.getElementById('account-user-email');
  const accountFavCount = document.getElementById('account-fav-count');
  const accountMemberSince = document.getElementById('account-member-since');
  const accountViewFavsBtn = document.getElementById('account-view-favs-btn');
  const accountSignoutBtn = document.getElementById('account-signout-btn');

  // Modals
  const authPromptModal = document.getElementById('auth-prompt-modal');
  const closeAuthPromptBtn = document.getElementById('close-auth-prompt-btn');
  const promptSigninBtn = document.getElementById('prompt-signin-btn');
  const promptSignupBtn = document.getElementById('prompt-signup-btn');

  const forgotPasswordModal = document.getElementById('forgot-password-modal');
  const closeForgotModalBtn = document.getElementById('close-forgot-modal-btn');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const toastContainer = document.getElementById('toast-container');

  // --- Initialization ---
  function init() {
    setupEventListeners();
    updateAuthUIState();
    generateNewQuote(false);
  }

  // --- View Navigation & Routing ---
  function switchView(targetViewId) {
    const currentUser = AuthService.getCurrentUser();

    // Protected Route Check for Favourites and Account
    if ((targetViewId === 'favorites-view' || targetViewId === 'account-view') && !currentUser) {
      if (targetViewId === 'favorites-view') {
        openAuthPromptModal('Sign in to view and manage your saved favourite quotes.');
        return;
      }
      targetViewId = 'auth-view';
    }

    // Update active state in views
    views.forEach(v => {
      if (v.id === targetViewId) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    activeView = targetViewId;

    // Update navigation link active highlights
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const viewAttr = link.getAttribute('data-view');
      if (viewAttr === targetViewId || (viewAttr === 'auth-view' && targetViewId === 'account-view')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile nav drawer if open
    navList.classList.remove('mobile-open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');

    // Trigger view specific re-renders
    if (targetViewId === 'favorites-view') {
      renderFavoritesGallery();
    } else if (targetViewId === 'account-view') {
      renderAccountPage();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Quotes Generator Core Logic ---
  function getFilteredQuotes(category) {
    const data = window.QUOTES_DATA || [];
    if (!category || category === 'all') {
      return data;
    }
    return data.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  function getRandomQuote(category) {
    const availableQuotes = getFilteredQuotes(category);
    if (!availableQuotes.length) return null;
    if (availableQuotes.length === 1) return availableQuotes[0];

    let pool = availableQuotes.filter(q => !recentQuoteIds.includes(q.id));
    if (pool.length === 0) {
      pool = availableQuotes;
      recentQuoteIds = [];
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    recentQuoteIds.push(selected.id);
    if (recentQuoteIds.length > 5) {
      recentQuoteIds.shift();
    }

    return selected;
  }

  function generateNewQuote(animate = true) {
    stopSpeech();

    const quote = getRandomQuote(currentCategory);
    if (!quote) return;

    currentQuote = quote;

    if (animate) {
      newQuoteBtn.classList.add('spinning');
      quoteText.classList.add('fade-out');
      quoteAuthor.style.opacity = '0';

      setTimeout(() => {
        renderQuote(quote);
        quoteText.classList.remove('fade-out');
        quoteText.classList.add('fade-in');
        quoteAuthor.style.opacity = '1';
        newQuoteBtn.classList.remove('spinning');

        setTimeout(() => {
          quoteText.classList.remove('fade-in');
        }, 350);
      }, 200);
    } else {
      renderQuote(quote);
    }
  }

  function renderQuote(quote) {
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = quote.author;
    quoteCategoryTag.textContent = quote.category.toUpperCase();

    const wordCount = quote.text.trim().split(/\s+/).length;
    quoteLengthBadge.textContent = `${wordCount} words`;

    // Apply category accent styling
    const catConfig = CATEGORIES_CONFIG[quote.category.toLowerCase()] || CATEGORIES_CONFIG.all;
    document.documentElement.style.setProperty('--current-accent', catConfig.accent);
    document.documentElement.style.setProperty('--current-accent-rgb', catConfig.rgb);

    updateFavoriteButtonState();
  }

  // --- Category Management ---
  function handleCategoryChange(e) {
    const selectedCat = e.target.value;
    currentCategory = selectedCat.toLowerCase();

    if (activeView !== 'home-view') {
      switchView('home-view');
    }

    generateNewQuote(true);
  }

  // --- Favourites Management ---
  function handleFavoriteToggle() {
    if (!currentQuote) return;
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      pendingFavoriteQuote = currentQuote;
      openAuthPromptModal('Create an account or sign in to save your favourite quotes.');
      return;
    }

    const result = FavouritesService.toggleFavorite(currentUser.id, currentQuote);
    updateFavoriteButtonState();
    updateFavoritesBadge();

    if (result.isFav) {
      showToast('Saved to favourites!', '❤️');
    } else {
      showToast('Removed from favourites', '💔');
    }
  }

  function updateFavoriteButtonState() {
    if (!currentQuote) return;
    const currentUser = AuthService.getCurrentUser();

    const isFav = currentUser ? FavouritesService.isFavorite(currentUser.id, currentQuote.id) : false;

    if (isFav) {
      favoriteBtn.classList.add('is-favorite');
      favBtnText.textContent = 'Saved to Favourites';
    } else {
      favoriteBtn.classList.remove('is-favorite');
      favBtnText.textContent = 'Add to Favourites';
    }
  }

  function updateFavoritesBadge() {
    const currentUser = AuthService.getCurrentUser();
    const count = currentUser ? FavouritesService.getUserFavorites(currentUser.id).length : 0;
    favCountBadge.textContent = count;
  }

  function renderFavoritesGallery() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      favoritesGalleryContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <h3>Sign in to view your favourites</h3>
          <p>Create an account to save quotes and access them anytime.</p>
          <button class="btn-primary" id="gallery-signin-btn">Sign In / Register</button>
        </div>
      `;
      document.getElementById('gallery-signin-btn')?.addEventListener('click', () => switchView('auth-view'));
      favGalleryCount.textContent = '0 quotes';
      return;
    }

    const favs = FavouritesService.getUserFavorites(currentUser.id);
    favGalleryCount.textContent = `${favs.length} quote${favs.length === 1 ? '' : 's'}`;

    if (!favs.length) {
      favoritesGalleryContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          <h3>No favourites yet</h3>
          <p>When you find a quote that speaks to you, save it here to build your collection.</p>
          <button class="btn-primary" id="explore-quotes-btn">Explore Quotes</button>
        </div>
      `;
      document.getElementById('explore-quotes-btn')?.addEventListener('click', () => switchView('home-view'));
      return;
    }

    favoritesGalleryContainer.innerHTML = `
      <div class="favorites-grid">
        ${favs.map(q => `
          <div class="fav-card" data-id="${q.id}">
            <div class="fav-card-header">
              <span class="fav-card-tag">${q.category}</span>
            </div>
            <p class="fav-card-quote">"${q.text}"</p>
            <p class="fav-card-author">— ${q.author}</p>
            <div class="fav-card-actions">
              <button class="fav-card-btn copy-fav-card-btn" data-id="${q.id}">📋 Copy</button>
              <button class="fav-card-btn use-fav-card-btn" data-id="${q.id}">✨ View</button>
              <button class="fav-card-btn remove-btn remove-fav-card-btn" data-id="${q.id}">🗑️ Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    favoritesGalleryContainer.querySelectorAll('.copy-fav-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const q = favs.find(item => item.id === id);
        if (q) {
          navigator.clipboard.writeText(`"${q.text}" — ${q.author}`);
          showToast('Quote copied to clipboard!', '📋');
        }
      });
    });

    favoritesGalleryContainer.querySelectorAll('.use-fav-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const q = favs.find(item => item.id === id);
        if (q) {
          currentQuote = q;
          renderQuote(q);
          switchView('home-view');
        }
      });
    });

    favoritesGalleryContainer.querySelectorAll('.remove-fav-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const q = favs.find(item => item.id === id);
        if (q) {
          FavouritesService.toggleFavorite(currentUser.id, q);
          renderFavoritesGallery();
          updateFavoritesBadge();
          updateFavoriteButtonState();
          showToast('Removed from favourites', '💔');
        }
      });
    });
  }

  // --- Auth UI Management ---
  function updateAuthUIState() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      navAuthText.textContent = currentUser.name.split(' ')[0] || 'Account';
      navAuthBtn.setAttribute('data-view', 'account-view');
    } else {
      navAuthText.textContent = 'Sign In';
      navAuthBtn.setAttribute('data-view', 'auth-view');
    }

    updateFavoritesBadge();
    updateFavoriteButtonState();
  }

  function setAuthTab(tab) {
    if (tab === 'signin') {
      authTabSignin.classList.add('active');
      authTabSignin.setAttribute('aria-selected', 'true');
      authTabSignup.classList.remove('active');
      authTabSignup.setAttribute('aria-selected', 'false');

      signinForm.style.display = 'flex';
      signupForm.style.display = 'none';
      signinError.style.display = 'none';
    } else {
      authTabSignup.classList.add('active');
      authTabSignup.setAttribute('aria-selected', 'true');
      authTabSignin.classList.remove('active');
      authTabSignin.setAttribute('aria-selected', 'false');

      signupForm.style.display = 'flex';
      signinForm.style.display = 'none';
      signupError.style.display = 'none';
    }
  }

  async function handleSigninSubmit(e) {
    e.preventDefault();
    signinError.style.display = 'none';

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const submitBtn = document.getElementById('signin-submit-btn');

    submitBtn.classList.add('spinning');
    submitBtn.disabled = true;

    try {
      const user = await AuthService.login(email, password);
      showToast(`Welcome back, ${user.name}!`, '✨');
      updateAuthUIState();

      if (pendingFavoriteQuote) {
        FavouritesService.toggleFavorite(user.id, pendingFavoriteQuote);
        pendingFavoriteQuote = null;
        updateFavoriteButtonState();
        updateFavoritesBadge();
        showToast('Quote saved to favourites!', '❤️');
      }

      switchView('home-view');
      signinForm.reset();
    } catch (err) {
      signinError.textContent = err.message;
      signinError.style.display = 'block';
    } finally {
      submitBtn.classList.remove('spinning');
      submitBtn.disabled = false;
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    signupError.style.display = 'none';

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const submitBtn = document.getElementById('signup-submit-btn');

    submitBtn.classList.add('spinning');
    submitBtn.disabled = true;

    try {
      const user = await AuthService.register(name, email, password, confirmPassword);
      showToast(`Account created! Welcome, ${user.name}.`, '🎉');
      updateAuthUIState();

      if (pendingFavoriteQuote) {
        FavouritesService.toggleFavorite(user.id, pendingFavoriteQuote);
        pendingFavoriteQuote = null;
        updateFavoriteButtonState();
        updateFavoritesBadge();
        showToast('Quote saved to favourites!', '❤️');
      }

      switchView('home-view');
      signupForm.reset();
    } catch (err) {
      signupError.textContent = err.message;
      signupError.style.display = 'block';
    } finally {
      submitBtn.classList.remove('spinning');
      submitBtn.disabled = false;
    }
  }

  function renderAccountPage() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      switchView('auth-view');
      return;
    }

    const favs = FavouritesService.getUserFavorites(currentUser.id);
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2) || 'U';

    accountAvatarInitials.textContent = initials;
    accountUserName.textContent = currentUser.name;
    accountUserEmail.textContent = currentUser.email;
    accountFavCount.textContent = favs.length;
    accountMemberSince.textContent = currentUser.createdAt || 'Member';
  }

  function handleSignout() {
    AuthService.logout();
    updateAuthUIState();
    showToast('Signed out securely', '🔒');
    switchView('home-view');
  }

  // --- Modals ---
  function openAuthPromptModal(description) {
    if (description) {
      const descEl = authPromptModal.querySelector('.prompt-description');
      if (descEl) descEl.textContent = description;
    }
    authPromptModal.showModal();
  }

  // --- Utility Actions ---
  function copyQuoteToClipboard() {
    if (!currentQuote) return;
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(handleCopySuccess).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      handleCopySuccess();
    } catch (e) {
      showToast('Failed to copy quote', '❌');
    }
    document.body.removeChild(ta);
  }

  function handleCopySuccess() {
    copyIcon.style.display = 'none';
    checkIcon.style.display = 'inline-block';
    copyBtnText.textContent = 'Copied!';
    showToast('Quote copied to clipboard!', '📋');

    setTimeout(() => {
      copyIcon.style.display = 'inline-block';
      checkIcon.style.display = 'none';
      copyBtnText.textContent = 'Copy';
    }, 2000);
  }

  function toggleSpeech() {
    if (!currentQuote) return;
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis not supported in browser', '⚠️');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
    } else {
      speakQuote();
    }
  }

  function speakQuote() {
    window.speechSynthesis.cancel();
    speechUtterance = new SpeechSynthesisUtterance(`${currentQuote.text} by ${currentQuote.author}`);
    speechUtterance.rate = 0.95;

    speechUtterance.onstart = () => {
      isSpeaking = true;
      speakBtnText.textContent = 'Pause';
    };

    speechUtterance.onend = stopSpeech;
    speechUtterance.onerror = stopSpeech;

    window.speechSynthesis.speak(speechUtterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    if (speakBtnText) speakBtnText.textContent = 'Listen';
  }

  function shareQuote() {
    if (!currentQuote) return;
    const tweetText = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer');
  }

  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        if (toastContainer.contains(toast)) toastContainer.removeChild(toast);
      }, 250);
    }, 3000);
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetView = e.currentTarget.getAttribute('data-view');
        switchView(targetView);
      });
    });

    brandLogo.addEventListener('click', () => switchView('home-view'));
    brandLogo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchView('home-view');
      }
    });

    // Mobile drawer toggle & accessibility
    function closeMobileMenu() {
      navList.classList.remove('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navList.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (navList.classList.contains('mobile-open') && !navList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    });

    // Category Select Dropdown
    categorySelect.addEventListener('change', handleCategoryChange);

    // Quote Controls
    newQuoteBtn.addEventListener('click', () => generateNewQuote(true));
    copyBtn.addEventListener('click', copyQuoteToClipboard);
    speakBtn.addEventListener('click', toggleSpeech);
    favoriteBtn.addEventListener('click', handleFavoriteToggle);
    shareBtn.addEventListener('click', shareQuote);

    // Auth Form Tabs & Switching
    authTabSignin.addEventListener('click', () => setAuthTab('signin'));
    authTabSignup.addEventListener('click', () => setAuthTab('signup'));
    switchToSignup.addEventListener('click', () => setAuthTab('signup'));
    switchToSignin.addEventListener('click', () => setAuthTab('signin'));

    signinForm.addEventListener('submit', handleSigninSubmit);
    signupForm.addEventListener('submit', handleSignupSubmit);

    forgotPasswordLink.addEventListener('click', () => forgotPasswordModal.showModal());
    closeForgotModalBtn.addEventListener('click', () => forgotPasswordModal.close());
    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      forgotPasswordModal.close();
      showToast('Password reset instructions sent to your email', '📧');
      forgotPasswordForm.reset();
    });

    // Account Page Actions
    accountViewFavsBtn.addEventListener('click', () => switchView('favorites-view'));
    accountSignoutBtn.addEventListener('click', handleSignout);

    // Auth Prompt Modal Buttons
    closeAuthPromptBtn.addEventListener('click', () => authPromptModal.close());
    promptSigninBtn.addEventListener('click', () => {
      authPromptModal.close();
      setAuthTab('signin');
      switchView('auth-view');
    });
    promptSignupBtn.addEventListener('click', () => {
      authPromptModal.close();
      setAuthTab('signup');
      switchView('auth-view');
    });

    // Global Keyboard Hotkeys
    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT' || authPromptModal.open || forgotPasswordModal.open) {
        return;
      }

      if (activeView === 'home-view') {
        if (e.code === 'Space' || e.key.toLowerCase() === 'n') {
          e.preventDefault();
          generateNewQuote(true);
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          copyQuoteToClipboard();
        } else if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          handleFavoriteToggle();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          toggleSpeech();
        }
      }
    });
  }

  // Execute initialization when DOM is ready
  document.addEventListener('DOMContentLoaded', init);

})();
