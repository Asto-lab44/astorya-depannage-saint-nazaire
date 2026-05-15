/* ============================================
   ASTORYA · Intégration Crisp Chat
   ============================================
   
   👉 INSTRUCTIONS POUR ACTIVER LE CHAT
   ------------------------------------
   1. Créez un compte gratuit sur https://crisp.chat/
   2. Créez un "Website" pour astorya.fr
   3. Récupérez votre Website ID :
      - Dashboard Crisp → Settings (engrenage)
      - Website Settings → Setup instructions
      - Copiez la valeur de "WEBSITE_ID" 
        (format type "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
   4. Remplacez ci-dessous "VOTRE_WEBSITE_ID_ICI" par votre vraie clé
   5. Pushez sur GitHub → Vercel redéploie tout seul
   ============================================ */

(function () {
  'use strict';

  // ⚠️ Website ID Crisp d'Astorya
  const CRISP_WEBSITE_ID = "8b5518da-a46b-427f-80ce-63c0cf6bdb95";

  // Si l'ID n'est pas configuré, on n'injecte pas le script (et un placeholder bouton apparaît en dev)
  if (CRISP_WEBSITE_ID === "VOTRE_WEBSITE_ID_ICI" || !CRISP_WEBSITE_ID) {
    // Mode "non configuré" : on affiche un petit bouton informatif uniquement en local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.warn('[Astorya Chat] Crisp Website ID non configuré. Modifiez chatbot.js pour activer le chat.');
    }
    return;
  }

  // Configuration Crisp
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

  // Personnalisation : couleurs Astorya
  // (Note : les couleurs principales se règlent depuis le dashboard Crisp → Settings → Chatbox)

  // Pré-remplir le contexte du visiteur si possible
  window.$crisp.push(["safe", true]);

  // Message d'accueil personnalisé selon la page
  const path = window.location.pathname.toLowerCase();
  let initialMessage = null;

  if (path.includes('depannage') || path.includes('infogerance') || path.includes('maintenance')) {
    initialMessage = "Bonjour 👋 Une panne ou un besoin de dépannage informatique ? Décrivez-nous votre situation, nous vous répondons rapidement.";
  } else if (path.includes('cybersecurite')) {
    initialMessage = "Bonjour 👋 Une question sur la sécurité informatique de votre entreprise ? Nous sommes là pour vous aider.";
  } else if (path.includes('cloud') || path.includes('sauvegarde')) {
    initialMessage = "Bonjour 👋 Vous avez des questions sur Microsoft 365 ou la sauvegarde de vos données ?";
  } else if (path.includes('telephonie') || path.includes('fibre')) {
    initialMessage = "Bonjour 👋 Une question sur la téléphonie cloud ou la fibre pro à Saint-Nazaire ?";
  } else if (path.includes('contact')) {
    initialMessage = "Bonjour 👋 Comment pouvons-nous vous aider ? Nous répondons en quelques minutes pendant les heures d'ouverture.";
  } else {
    initialMessage = "Bonjour 👋 Bienvenue chez Astorya, votre informatique à Saint-Nazaire. Comment pouvons-nous vous aider ?";
  }

  // Configurer le message d'accueil quand Crisp est prêt
  window.$crisp.push(["on", "session:loaded", function() {
    // Ne pas répéter le message à chaque visite
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
