/* ============================================
   ASTORYA · Chatbot conversationnel
   ============================================ */

(function () {
  'use strict';

  const SYSTEM_PROMPT = `Tu es Lucie, l'assistante virtuelle d'Astorya, un prestataire informatique local basé à Saint-Nazaire (44600) et qui intervient dans tout le bassin nazairien (Pornichet, La Baule, Saint-Brevin-les-Pins, Trignac, Donges, Montoir-de-Bretagne, Guérande, Saint-André-des-Eaux, Saint-Joachim, Saint-Marc-sur-Mer, Le Pouliguen, Paimboeuf).

CONTEXTE ENTREPRISE :
- Fondée en 2010, 17 collaborateurs, 15+ ans d'expérience
- Services : infogérance et maintenance informatique, cybersécurité, cloud et sauvegarde (Microsoft 365, PRA), téléphonie VOIP et fibre, audit et conseil IT
- Engagement : intervention sous 4h sur tout incident critique
- Téléphone : 02 40 00 80 00
- Email : contact@astorya.fr
- Tarif indicatif infogérance : à partir de 35€ HT par poste et par mois
- Partenaires : Microsoft, Dell, HP, Stormshield, Bitdefender, Yealink, Watchguard
- Cibles : TPE, PME, ETI, collectivités, associations
- Secteurs : industrie navale et aéronautique (Chantiers, Airbus, sous-traitants), BTP, commerces, professions libérales, tourisme

TON :
- Chaleureux, proche, accessible — comme un voisin qui s'y connaît
- Tutoiement non, vouvoiement
- Phrases courtes, pas de jargon inutile
- Réponses concises (3 à 6 phrases max) sauf si la question est technique
- Si on te demande un devis ou un rendez-vous, propose le rappel sous 2h et donne le 02 40 00 80 00

RÈGLES :
- Ne réponds qu'aux questions liées à l'informatique professionnelle, aux services Astorya ou au bassin nazairien
- Si la question est hors sujet (météo, recettes, etc.), redirige gentiment vers nos services
- Ne promets jamais un prix précis sans audit ; donne des fourchettes
- Si tu ne sais pas, propose de mettre en relation avec un humain (02 40 00 80 00)`;

  // ===== Styles =====
  const css = `
    .astor-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0B2545 0%, #13335E 100%);
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 14px 30px -10px rgba(11, 37, 69, 0.55);
      z-index: 9998;
      display: grid;
      place-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      font-family: inherit;
    }
    .astor-launcher:hover { transform: scale(1.06); box-shadow: 0 18px 34px -8px rgba(11, 37, 69, 0.7); }
    .astor-launcher-icon { width: 28px; height: 28px; position: relative; }
    .astor-launcher-icon svg { width: 100%; height: 100%; }
    .astor-launcher .badge {
      position: absolute;
      top: -2px; right: -2px;
      width: 16px; height: 16px;
      background: #E68A3A;
      border: 2px solid #fff;
      border-radius: 50%;
      animation: astor-pulse 2s infinite;
    }
    @keyframes astor-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.18); opacity: 0.85; }
    }
    .astor-launcher.open .badge { display: none; }

    .astor-panel {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: min(580px, calc(100vh - 130px));
      background: #FAF7F2;
      border-radius: 18px;
      box-shadow: 0 30px 80px -20px rgba(11, 37, 69, 0.45), 0 0 0 1px rgba(11, 37, 69, 0.06);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      transform: translateY(20px) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
      font-family: "Manrope", system-ui, sans-serif;
      color: #0E1A2B;
    }
    .astor-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .astor-head {
      background: linear-gradient(135deg, #0B2545 0%, #13335E 100%);
      color: #fff;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      overflow: hidden;
    }
    .astor-head::after {
      content: "";
      position: absolute;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: #E68A3A;
      opacity: 0.18;
      right: -60px; top: -80px;
      filter: blur(20px);
    }
    .astor-avatar {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: #E68A3A;
      display: grid; place-items: center;
      font-family: "Bricolage Grotesque", sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .astor-avatar-status {
      position: absolute;
      bottom: -2px; right: -2px;
      width: 14px; height: 14px;
      background: #2F8F5C;
      border-radius: 50%;
      border: 2px solid #0B2545;
    }
    .astor-head-text { flex: 1; position: relative; z-index: 1; }
    .astor-head-text strong {
      display: block;
      font-family: "Bricolage Grotesque", sans-serif;
      font-weight: 600;
      font-size: 1.05rem;
      line-height: 1.2;
    }
    .astor-head-text span {
      font-size: 0.78rem;
      color: #B8C2D2;
      display: flex; align-items: center; gap: 6px;
    }
    .astor-head-text span::before {
      content: "";
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #2F8F5C;
    }
    .astor-close {
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: none;
      width: 32px; height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: grid; place-items: center;
      font-size: 1.4rem;
      line-height: 0.6;
      transition: background 0.15s ease;
      position: relative;
      z-index: 1;
      font-family: inherit;
    }
    .astor-close:hover { background: rgba(255,255,255,0.22); }

    .astor-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .astor-body::-webkit-scrollbar { width: 6px; }
    .astor-body::-webkit-scrollbar-thumb { background: #D8D1C2; border-radius: 3px; }

    .astor-msg {
      max-width: 85%;
      padding: 11px 15px;
      border-radius: 14px;
      font-size: 0.92rem;
      line-height: 1.45;
      word-wrap: break-word;
      animation: astor-msg-in 0.25s ease-out;
    }
    @keyframes astor-msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .astor-msg.bot {
      background: #fff;
      border: 1px solid #E7E2D7;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      color: #0E1A2B;
    }
    .astor-msg.user {
      background: #0B2545;
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .astor-msg p { margin: 0 0 6px; }
    .astor-msg p:last-child { margin-bottom: 0; }
    .astor-msg a { color: #E68A3A; font-weight: 600; }
    .astor-msg.user a { color: #FBE9D6; }

    .astor-typing {
      align-self: flex-start;
      background: #fff;
      border: 1px solid #E7E2D7;
      padding: 14px 16px;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      display: flex;
      gap: 4px;
    }
    .astor-typing span {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #5B6478;
      animation: astor-bounce 1.2s infinite;
    }
    .astor-typing span:nth-child(2) { animation-delay: 0.15s; }
    .astor-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes astor-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    .astor-quick {
      padding: 0 20px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .astor-quick-btn {
      background: #fff;
      border: 1px solid #E7E2D7;
      color: #0B2545;
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 0.8rem;
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .astor-quick-btn:hover {
      background: #0B2545;
      color: #fff;
      border-color: #0B2545;
    }

    .astor-form {
      padding: 14px 16px 16px;
      background: #fff;
      border-top: 1px solid #E7E2D7;
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .astor-input {
      flex: 1;
      border: 1px solid #E7E2D7;
      background: #FAF7F2;
      border-radius: 12px;
      padding: 11px 14px;
      font-family: inherit;
      font-size: 0.92rem;
      resize: none;
      max-height: 100px;
      min-height: 42px;
      color: #0E1A2B;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .astor-input:focus {
      outline: none;
      border-color: #E68A3A;
      background: #fff;
    }
    .astor-send {
      background: #E68A3A;
      color: #fff;
      border: none;
      width: 42px; height: 42px;
      border-radius: 12px;
      cursor: pointer;
      display: grid; place-items: center;
      flex-shrink: 0;
      transition: background 0.15s ease, transform 0.1s ease;
      font-family: inherit;
    }
    .astor-send:hover:not(:disabled) { background: #C46E22; }
    .astor-send:active { transform: scale(0.94); }
    .astor-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .astor-send svg { width: 18px; height: 18px; }

    .astor-disclaimer {
      font-size: 0.7rem;
      color: #5B6478;
      text-align: center;
      padding: 0 16px 10px;
      background: #fff;
      margin: 0;
    }

    @media (max-width: 480px) {
      .astor-panel {
        bottom: 90px;
        right: 12px;
        left: 12px;
        width: auto;
        max-width: none;
        height: calc(100vh - 110px);
      }
      .astor-launcher {
        bottom: 16px;
        right: 16px;
        width: 56px; height: 56px;
      }
    }
  `;

  // ===== Markup =====
  const html = `
    <button class="astor-launcher" id="astor-launcher" aria-label="Ouvrir l'assistante Astorya — Lucie">
      <span class="astor-launcher-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11.5C3 7.36 6.36 4 10.5 4h3C17.64 4 21 7.36 21 11.5c0 4.14-3.36 7.5-7.5 7.5h-1.27L8 22v-3.5C5.13 17.79 3 14.91 3 11.5z" fill="currentColor"/>
          <circle cx="9" cy="11.5" r="1.2" fill="#0B2545"/>
          <circle cx="12" cy="11.5" r="1.2" fill="#0B2545"/>
          <circle cx="15" cy="11.5" r="1.2" fill="#0B2545"/>
        </svg>
      </span>
      <span class="badge"></span>
    </button>

    <aside class="astor-panel" id="astor-panel" role="dialog" aria-label="Assistante Astorya — Lucie">
      <div class="astor-head">
        <div class="astor-avatar">L<span class="astor-avatar-status"></span></div>
        <div class="astor-head-text">
          <strong>Lucie</strong>
          <span>En ligne · répond généralement en quelques secondes</span>
        </div>
        <button class="astor-close" id="astor-close" aria-label="Fermer">×</button>
      </div>
      <div class="astor-body" id="astor-body"></div>
      <div class="astor-quick" id="astor-quick"></div>
      <form class="astor-form" id="astor-form">
        <textarea class="astor-input" id="astor-input" placeholder="Écrivez votre message…" rows="1" aria-label="Votre message"></textarea>
        <button class="astor-send" type="submit" id="astor-send" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11l18-8-8 18-2-8-8-2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </button>
      </form>
      <p class="astor-disclaimer">Pour une urgence&nbsp;: <a href="tel:+33240008000" style="color:#E68A3A;font-weight:600;">02 40 00 80 00</a></p>
    </aside>
  `;

  const SUGGESTIONS = [
    "Combien coûte l'infogérance ?",
    "Vous intervenez à Pornichet ?",
    "Que faire en cas de cyberattaque ?",
    "Je veux être rappelé"
  ];

  // ===== Inject =====
  function init() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    const launcher = document.getElementById('astor-launcher');
    const panel = document.getElementById('astor-panel');
    const closeBtn = document.getElementById('astor-close');
    const body = document.getElementById('astor-body');
    const form = document.getElementById('astor-form');
    const input = document.getElementById('astor-input');
    const sendBtn = document.getElementById('astor-send');
    const quickWrap = document.getElementById('astor-quick');

    const history = [];

    function addMsg(role, text) {
      const div = document.createElement('div');
      div.className = 'astor-msg ' + role;
      // basic linkify for tel + email
      const safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const linked = safe
        .replace(/(02 \d{2} \d{2} \d{2} \d{2})/g, '<a href="tel:+33240008000">$1</a>')
        .replace(/(contact@astorya\.fr)/g, '<a href="mailto:$1">$1</a>')
        .split('\n\n').map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
      div.innerHTML = linked;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'astor-typing';
      t.id = 'astor-typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
    }
    function hideTyping() {
      const t = document.getElementById('astor-typing-indicator');
      if (t) t.remove();
    }

    function renderQuick() {
      quickWrap.innerHTML = '';
      SUGGESTIONS.forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'astor-quick-btn';
        b.textContent = s;
        b.addEventListener('click', () => {
          input.value = s;
          send();
        });
        quickWrap.appendChild(b);
      });
    }

    function hideQuick() { quickWrap.style.display = 'none'; }

    // Welcome
    function welcome() {
      addMsg('bot', "Bonjour 👋 Je suis Lucie, l'assistante Astorya. Comment puis-je vous aider sur votre informatique à Saint-Nazaire&nbsp;?");
      renderQuick();
    }

    let welcomed = false;
    function open() {
      panel.classList.add('open');
      launcher.classList.add('open');
      if (!welcomed) {
        welcomed = true;
        setTimeout(welcome, 250);
      }
      setTimeout(() => input.focus(), 300);
    }
    function close() {
      panel.classList.remove('open');
      launcher.classList.remove('open');
    }

    launcher.addEventListener('click', () => {
      panel.classList.contains('open') ? close() : open();
    });
    closeBtn.addEventListener('click', close);

    // auto-grow textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    async function send() {
      const text = input.value.trim();
      if (!text) return;
      hideQuick();
      addMsg('user', text);
      history.push({ role: 'user', content: text });
      input.value = '';
      input.style.height = 'auto';
      sendBtn.disabled = true;
      showTyping();

      try {
        const messages = [
          { role: 'user', content: SYSTEM_PROMPT + "\n\n---\n\nHistorique de la conversation :\n" + history.map(m => (m.role === 'user' ? 'Client' : 'Astor') + ' : ' + m.content).join('\n') + "\n\nRéponds maintenant en tant que Lucie, de façon concise et chaleureuse." }
        ];
        const reply = await window.claude.complete({ messages });
        hideTyping();
        addMsg('bot', reply);
        history.push({ role: 'assistant', content: reply });
      } catch (err) {
        hideTyping();
        addMsg('bot', "Désolé, je rencontre un petit souci technique. Vous pouvez nous joindre directement au 02 40 00 80 00 ou par email à contact@astorya.fr — nous vous répondons sous 2 heures ouvrées.");
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      send();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
