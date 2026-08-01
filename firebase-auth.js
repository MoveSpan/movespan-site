// MoveSpan System — Firebase Auth Guard
// Подключается к каждой защищённой странице

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAmf3mipVQnucfSfg2gQuhXIyoQrXgywT8",
  authDomain: "auth.movespan.app",
  projectId: "movewell-system",
  storageBucket: "movewell-system.firebasestorage.app",
  messagingSenderId: "996929311338",
  appId: "1:996929311338:web:21db1480febc5523ea7013"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Страницы которые НЕ требуют авторизации
const PUBLIC_PAGES = ['/', '/index.html', '/landing.html', '/auth'];

function requireAuth() {
  const path = window.location.pathname;
  const isPublic = PUBLIC_PAGES.some(p => path === p || path.endsWith(p));
  
  onAuthStateChanged(auth, async (user) => {
    if (!user && !isPublic) {
      sessionStorage.setItem('mw_redirect', path + window.location.search);
      window.location.href = '/auth';
      return;
    }
    if (user) {
      // Сохраняем в window для использования на странице
      window.mwUser = user;
      
      // Загружаем профиль из Firestore
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          window.mwProfile = snap.data();
        }
      } catch(e) {
        console.log('Profile load error:', e);
      }
      
      // Обновляем UI если есть элементы
      const nameEl = document.getElementById('user-name');
      const avatarEl = document.getElementById('user-avatar');
      if (nameEl) nameEl.textContent = user.displayName || user.email.split('@')[0];
      if (avatarEl) avatarEl.textContent = (user.displayName || user.email)[0].toUpperCase();
      
      // Вызываем колбэк если страница его зарегистрировала
      if (window.onMwAuthReady) window.onMwAuthReady(user, window.mwProfile);
    }
  });
}

// Выход из аккаунта
window.mwSignOut = async function() {
  await signOut(auth);
  window.location.href = '/';
}

// Запись выполненной сессии в Firestore
window.mwLogSession = async function(data) {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      sessions: increment(1),
      lastSession: new Date().toISOString(),
      [`sessions_log.${Date.now()}`]: {
        date: new Date().toISOString(),
        rating: data.rating || 0,
        stateRating: data.stateRating || 0,
        note: data.note || '',
      }
    });
    
    // Проверяем награды
    const snap = await getDoc(userRef);
    const profile = snap.data();
    const sessions = profile.sessions || 0;
    
    // 7 сессий за неделю → консультация
    if (sessions === 7) {
      await updateDoc(userRef, { reward_consultation: true });
      return { reward: 'consultation' };
    }
    if (sessions === 3) return { reward: 'new_exercise' };
    if (sessions === 14) return { reward: 'tai_chi' };
    
    return { sessions };
  } catch(e) {
    console.log('Session log error:', e);
  }
}

requireAuth();
export { auth, db };
