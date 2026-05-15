/* ============================================
   ASTORYA · Intégration Crisp Chat
   ============================================ */

(function () {
  'use strict';

  // Website ID Crisp d'Astorya
  const CRISP_WEBSITE_ID = "8b5518da-a46b-427f-80ce-63c0cf6bdb95";

  if (!CRISP_WEBSITE_ID || CRISP_WEBSITE_ID === "VOTRE_WEBSITE_ID_ICI") return;

  window.$crisp = [];
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
  window.$crisp.push(["safe", true]);

  // Message d'accueil dynamique selon la page
  const path = window.location.pathname.toLowerCase();
  let initialMessage = "Bonjour 👋 Bienvenue chez Astorya, votre informatique à Saint-Nazaire. Comment pouvons-nous vous aider ?";

  if (path.includes('depannage') || path.includes('infogerance') || path.includes('maintenance')) {
    initialMessage = "Bonjour 👋 Une panne ou un besoin de dépannage informatique ? Décrivez-nous votre situation, nous vous répondons rapidement.";
  } else if (path.includes('cybersecurite')) {
    initialMessage = "Bonjour 👋 Une question sur la sécurité informatique de votre entreprise ?";
  } else if (path.includes('cloud') || path.includes('sauvegarde')) {
    initialMessage = "Bonjour 👋 Vous avez des questions sur Microsoft 365 ou la sauvegarde de vos données ?";
  } else if (path.includes('telephonie') || path.includes('fibre')) {
    initialMessage = "Bonjour 👋 Une question sur la téléphonie cloud ou la fibre pro à Saint-Nazaire ?";
  } else if (path.includes('contact')) {
    initialMessage = "Bonjour 👋 Comment pouvons-nous vous aider ? Nous répondons en quelques minutes pendant les heures d'ouverture.";
  }

  window.$crisp.push(["on", "session:loaded", function() {
    if (!sessionStorage.getItem('astorya_chat_greeted')) {
      window.$crisp.push(["do", "message:show", ["text", initialMessage]]);
      sessionStorage.setItem('astorya_chat_greeted', '1');
    }
  }]);

  // Injection du script Crisp
  (function() {
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = 1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
})();
