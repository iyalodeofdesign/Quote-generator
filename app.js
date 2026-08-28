/* ==========================================================================
   QUOTE GENERATOR - APPLICATION LOGIC (app.js)
   High-Contrast WCAG AAA Accessible Edition
   ========================================================================== */

(function () {
  'use strict';

  // --- App State ---
  let currentCategory = 'all';
  let currentQuote = null;
  let recentQuoteIds = [];
  let favorites = [];
  let isSpeaking = false;
  let speechUtterance = null;

  // --- DOM Elements ---
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

  const favoritesToggleBtn = document.getElementById('favorites-toggle-btn');
  const favCountBadge = document.getElementById('fav-count-badge');
  const favoritesModal = document.getElementById('favorites-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalFavoritesList = document.getElementById('modal-favorites-list');
  const toastContainer = document.getElementById('toast-container');
  const categoryTabBtns = document.querySelectorAll('.tab-btn');

  // Accent Colors Mapping per Category (High Contrast WCAG AAA Compliant)
  const ACCENT_COLORS = {
    all: { hex: '#6b21a8', rgb: '107, 33, 168' },
    life: { hex: '#047857', rgb: '4, 120, 87' },
    love: { hex: '#be123c', rgb: '190, 18, 60' },
    courage: { hex: '#b45309', rgb: '180, 83, 9' },
    strength: { hex: '#4338ca', rgb: '67, 56, 202' }
  };

  // --- Initialization ---
  function init() {
    loadFavoritesFromStorage();
    setupEventListeners();
    generateNewQuote(false);
  }

  // --- Quotes Logic ---
  function getFilteredQuotes(category) {
    const data = window.QUOTES_DATA || (typeof QUOTES_DATA !== 'undefined' ? QUOTES_DATA : []);
    if (!category || category === 'all') {
      return data;
    }
    return data.filter(q => q.category === category);
  }

  function getRandomQuote(category) {
    const availableQuotes = getFilteredQuotes(category);
    if (!availableQuotes.length) return null;

    if (availableQuotes.length === 1) return availableQuotes[0];

    // Filter out recently shown quotes to prevent immediate repetition
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

    // Calculate word count
    const wordCount = quote.text.trim().split(/\s+/).length;
    quoteLengthBadge.textContent = `${wordCount} words`;

    // Apply category theme color
    const accent = ACCENT_COLORS[quote.category] || ACCENT_COLORS.all;
    document.documentElement.style.setProperty('--current-accent', accent.hex);
    document.documentElement.style.setProperty('--current-accent-rgb', accent.rgb);

    // Update favorite button state
    updateFavoriteButtonState();
  }

  // --- Copy to Clipboard ---
  function copyQuoteToClipboard() {
    if (!currentQuote) return;

    const formattedText = `"${currentQuote.text}" — ${currentQuote.author}`;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(formattedText)
        .then(() => handleCopySuccess())
        .catch(() => fallbackCopyText(formattedText));
    } else {
      fallbackCopyText(formattedText);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess();
    } catch (err) {
      showToast('Failed to copy quote', '❌');
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess() {
    copyIcon.style.display = 'none';
    checkIcon.style.display = 'inline-block';
    copyBtnText.textContent = 'Copied!';
    copyBtn.style.borderColor = 'var(--accent-life)';

    showToast('Quote copied to clipboard!', '📋');

    setTimeout(() => {
      copyIcon.style.display = 'inline-block';
      checkIcon.style.display = 'none';
      copyBtnText.textContent = 'Copy Quote';
      copyBtn.style.borderColor = '';
    }, 2000);
  }

  // --- Speech Synthesis ---
  function toggleSpeech() {
    if (!currentQuote) return;

    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech not supported in this browser', '⚠️');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
    } else {
      speakCurrentQuote();
    }
  }

  function speakCurrentQuote() {
    window.speechSynthesis.cancel();

    const textToRead = `${currentQuote.text} by ${currentQuote.author}`;
    speechUtterance = new SpeechSynthesisUtterance(textToRead);
    speechUtterance.rate = 0.95;
    speechUtterance.pitch = 1.0;

    speechUtterance.onstart = () => {
      isSpeaking = true;
      speakBtn.style.borderColor = 'var(--current-accent)';
      if (speakBtnText) speakBtnText.textContent = 'Pause';
    };

    speechUtterance.onend = () => {
      stopSpeech();
    };

    speechUtterance.onerror = () => {
      stopSpeech();
    };

    window.speechSynthesis.speak(speechUtterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    if (speakBtn) {
      speakBtn.style.borderColor = '';
      if (speakBtnText) speakBtnText.textContent = 'Listen';
    }
  }

  // --- Favorites Management ---
  function loadFavoritesFromStorage() {
    try {
      const stored = localStorage.getItem('quoteverse_favorites');
      if (stored) {
        favorites = JSON.parse(stored);
      }
    } catch (e) {
      favorites = [];
    }
    updateFavoritesBadge();
  }

  function saveFavoritesToStorage() {
    try {
      localStorage.setItem('quoteverse_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
    updateFavoritesBadge();
  }

  function toggleFavorite() {
    if (!currentQuote) return;

    const existingIndex = favorites.findIndex(f => f.id === currentQuote.id);

    if (existingIndex > -1) {
      favorites.splice(existingIndex, 1);
      showToast('Removed from favorites', '💔');
    } else {
      favorites.unshift(currentQuote);
      showToast('Saved to favorites!', '❤️');
    }

    saveFavoritesToStorage();
    updateFavoriteButtonState();
    if (favoritesModal.open) {
      renderFavoritesModalList();
    }
  }

  function updateFavoriteButtonState() {
    if (!currentQuote) return;
    const isFav = favorites.some(f => f.id === currentQuote.id);

    if (isFav) {
      favoriteBtn.classList.add('is-favorite');
      favBtnText.textContent = 'Saved';
    } else {
      favoriteBtn.classList.remove('is-favorite');
      favBtnText.textContent = 'Save';
    }
  }

  function updateFavoritesBadge() {
    favCountBadge.textContent = favorites.length;
  }

  function renderFavoritesModalList() {
    if (!favorites.length) {
      modalFavoritesList.innerHTML = `
        <div class="empty-favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <p style="font-size: 1.1rem; font-weight: 700;">No saved quotes yet.</p>
          <small style="font-size: 0.95rem;">Click the Save button on any quote to add it to your list!</small>
        </div>
      `;
      return;
    }

    modalFavoritesList.innerHTML = favorites.map(q => `
      <div class="fav-item" data-id="${q.id}">
        <p class="fav-text">"${q.text}"</p>
        <div class="fav-meta">
          <span class="fav-author">— ${q.author}</span>
          <div class="fav-actions">
            <button class="fav-action-btn copy-fav-btn" data-id="${q.id}" aria-label="Copy Quote">📋 Copy</button>
            <button class="fav-action-btn delete delete-fav-btn" data-id="${q.id}" aria-label="Remove Favorite">🗑️ Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach event listeners to modal buttons
    modalFavoritesList.querySelectorAll('.copy-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const q = favorites.find(item => item.id === id);
        if (q) {
          navigator.clipboard.writeText(`"${q.text}" — ${q.author}`);
          showToast('Quote copied to clipboard!', '📋');
        }
      });
    });

    modalFavoritesList.querySelectorAll('.delete-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        favorites = favorites.filter(item => item.id !== id);
        saveFavoritesToStorage();
        renderFavoritesModalList();
        updateFavoriteButtonState();
        showToast('Quote removed from favorites', '💔');
      });
    });
  }

  // --- Share Quote ---
  function shareQuote() {
    if (!currentQuote) return;
    const tweetText = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  }

  // --- Toast Notifications ---
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 250);
    }, 3000);
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // New quote button
    newQuoteBtn.addEventListener('click', () => generateNewQuote(true));

    // Toolbar buttons
    copyBtn.addEventListener('click', copyQuoteToClipboard);
    speakBtn.addEventListener('click', toggleSpeech);
    favoriteBtn.addEventListener('click', toggleFavorite);
    shareBtn.addEventListener('click', shareQuote);

    // Favorites modal
    favoritesToggleBtn.addEventListener('click', () => {
      renderFavoritesModalList();
      favoritesModal.showModal();
    });

    closeModalBtn.addEventListener('click', () => {
      favoritesModal.close();
    });

    favoritesModal.addEventListener('click', (e) => {
      const rect = favoritesModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        favoritesModal.close();
      }
    });

    // Category tabs navigation
    categoryTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selected = e.currentTarget.getAttribute('data-category');
        if (selected === currentCategory) return;

        categoryTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-selected', 'true');

        currentCategory = selected;
        generateNewQuote(true);
      });
    });

    // Keyboard Hotkeys
    document.addEventListener('keydown', (e) => {
      // Ignore hotkeys when typing in modal or input fields
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || favoritesModal.open) {
        return;
      }

      if (e.code === 'Space' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        generateNewQuote(true);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyQuoteToClipboard();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFavorite();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSpeech();
      }
    });
  }

  // Run initial setup on DOM ready
  document.addEventListener('DOMContentLoaded', init);

})();
