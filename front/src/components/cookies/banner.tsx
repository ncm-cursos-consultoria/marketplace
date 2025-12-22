"use client";

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('ncm_cookie_consent');
    if (!consent) setShowBanner(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ncm_cookie_consent', 'true');
    setShowBanner(false);
    // Dispara um evento customizado para avisar a página de login
    window.dispatchEvent(new Event("cookieConsentChanged"));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full border-2 border-blue-600">
        <h2 className="text-lg font-bold mb-2">🍪 Uso de Cookies Necessários</h2>
        <p className="text-sm text-gray-600 mb-4">
          Para acessar sua conta com segurança no <strong>NCM Marketplace</strong>, precisamos utilizar cookies de sessão. Sem eles, o login não funcionará no seu navegador.
        </p>
        <button 
          onClick={acceptCookies}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Aceitar e Continuar para o Login
        </button>
      </div>
    </div>
  );
}