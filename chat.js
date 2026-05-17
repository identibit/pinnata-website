/* ═══════════════════════════════════════════════════
   A' PINNATA — Chat AI widget (self-contained)
   Floating FAB + slide-up panel · intent-matching bot
   that guides users to booking or WhatsApp.
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ───── CONFIG ───── */
  const PHONE = '+390909811697';
  const PHONE_DISPLAY = '090 9811697';
  const EMAIL = 'hotel@pinnata.it';
  const WA_NUMBER = '390909811697';
  const wa = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ───── INTENTS ─────
     Each intent matches keywords (regex) and returns a rich response
     with optional action chips. Ordered by priority — first match wins. */
  const INTENTS = [
    {
      id: 'greet',
      match: /^(ciao|salve|buon ?giorno|buona ?sera|hey|hi|hello)[\s!.?]*$/i,
      response: 'Ciao! Sono qui per aiutarti. Vuoi info su camere, prezzi, posizione, eventi o prenotazione?',
      actions: []
    },
    {
      id: 'booking',
      match: /prenot|disponibil|liber[oai]|quando posso|posso venire|posto/i,
      response: 'Per la prenotazione compila il form qui sul sito (rispondiamo entro 2 ore con la conferma) o scrivici direttamente su WhatsApp.',
      actions: [
        { label: 'Verifica disponibilità', href: '#prenota', primary: true },
        { label: 'WhatsApp', href: wa("Ciao, vorrei verificare la disponibilità per..."), wa: true }
      ]
    },
    {
      id: 'prices',
      match: /prezz|cost|tariff|quanto cost|listino|economic/i,
      response: 'Le camere partono da € 120 a notte. Nel prezzo sono inclusi colazione, aperitivo di benvenuto e transfer aeroporto a/r. La Junior Suite è quotata su richiesta. Garanzia miglior prezzo se prenoti direttamente.',
      actions: [
        { label: 'Vedi le camere', href: '#camere' },
        { label: 'Verifica disponibilità', href: '#prenota', primary: true }
      ]
    },
    {
      id: 'rooms',
      match: /camera|camere|suite|stanza|stanze|matrimonial|singol|doppia|junior|letto/i,
      response: 'Abbiamo 4 tipologie di camera: Singola, Doppia, Matrimoniale (tutte da € 120/notte) e Junior Suite (su richiesta). Ogni camera ha terrazza privata, vista panoramica sulla baia di Lipari, aria condizionata indipendente, minibar, cassaforte, bagno con doccia idromassaggio.',
      actions: [
        { label: 'Sfoglia le camere', href: '#camere' }
      ]
    },
    {
      id: 'breakfast',
      match: /colazion|breakfast|brunch|caff[eè]|cornett|brioche/i,
      response: 'Colazione servita 7:30 — 10:00 ogni giorno, in sala, in camera o al solarium. Buffet dolce e salato: dolci preparati dai nostri pasticceri, formaggi freschi, uova, salumi, opzioni american-style. Per intolleranze scrivici prima dell\'arrivo a hotel@pinnata.it.',
      actions: [
        { label: 'Vedi la colazione', href: '#colazione' }
      ]
    },
    {
      id: 'location',
      match: /dove|posizion|arrivare|raggiung|aeroport|aliscaf|porto|milazzo|catania|napoli|lipari|spiaggia/i,
      response: 'Siamo in Località Pignataro, Lipari — affacciati sulla storica Rocca di Lipari e sull\'isola di Vulcano. 10 minuti a piedi dal porto Marina Lunga, 80 m dalla spiaggia. Da Milazzo aliscafo 40 min. Transfer aeroporto incluso.',
      actions: [
        { label: 'Mappa e indicazioni', href: '#dove-siamo' }
      ]
    },
    {
      id: 'events',
      match: /event|aperitiv|cena|degust|musica|jazz|terrazza|brunch domenica|chef/i,
      response: 'La nostra terrazza ha una programmazione stagionale aperta anche al pubblico esterno: aperitivi al tramonto (€ 35), cene con chef ospiti (€ 120), degustazioni di Malvasia (€ 55), brunch d\'autore (€ 45), serate jazz. Tutto su prenotazione.',
      actions: [
        { label: 'Calendario eventi', href: '#eventi' },
        { label: 'Prenota un tavolo', href: wa("Ciao, vorrei prenotare un tavolo per un evento in terrazza"), wa: true }
      ]
    },
    {
      id: 'services',
      match: /servizi|incluso|inclus[ie]|amenit|escursion|barca|scooter|nolegg|canneto|concierge|spa|wellness/i,
      response: 'Incluso nel soggiorno: aperitivo di benvenuto, transfer aeroporto a/r, spiaggia attrezzata Canneto, Wi-Fi, parcheggio privato, bar 24h, reception 24h. Su richiesta: escursioni in barca, noleggio scooter/auto, mezza pensione al ristorante affiliato E Pulera.',
      actions: [
        { label: 'Tutti i servizi', href: '#esperienze' }
      ]
    },
    {
      id: 'contact',
      match: /contatt|telefon|chiamar|chiama|email|mail|scriver|numero/i,
      response: `Telefono: ${PHONE_DISPLAY} — Email: ${EMAIL} — Aperti dal 1 aprile al 31 ottobre.`,
      actions: [
        { label: 'Chiama', href: `tel:${PHONE}` },
        { label: 'Email', href: `mailto:${EMAIL}` },
        { label: 'WhatsApp', href: wa("Ciao, vorrei info su A' Pinnata"), wa: true }
      ]
    },
    {
      id: 'languages',
      match: /lingu|english|inglese|french|francese|deutsch|tedesco|espagnol|spagnolo/i,
      response: 'Parliamo italiano, inglese e francese. Per altre lingue scrivici prima — troviamo sempre una soluzione.',
      actions: []
    },
    {
      id: 'season',
      match: /apert|stagione|chiuso|chius[ai]|quando aprite|periodo|inverno|estate/i,
      response: 'Apertura stagionale: 1 aprile — 31 ottobre. Fuori stagione rispondiamo via email o WhatsApp per prenotazioni anticipate.',
      actions: [
        { label: 'Verifica disponibilità', href: '#prenota' }
      ]
    },
    {
      id: 'pets',
      match: /cani|cane|gatti|gatto|animal|pet|cucciol/i,
      response: 'Per gli animali valutiamo caso per caso in base a taglia e periodo. Scrivici i dettagli e ti rispondiamo subito.',
      actions: [
        { label: 'WhatsApp', href: wa("Ciao, vorrei portare il mio animale, è possibile?"), wa: true }
      ]
    },
    {
      id: 'parking',
      match: /parch|auto|macchina|posteg|garage/i,
      response: 'Parcheggio privato gratuito per i nostri ospiti. Sull\'isola consigliamo lo scooter — possiamo organizzare il noleggio direttamente dall\'hotel.',
      actions: [
        { label: 'Servizi e noleggi', href: '#esperienze' }
      ]
    },
    {
      id: 'wifi',
      match: /wi[\-\s]?fi|internet|connession|web|rete/i,
      response: 'Wi-Fi gratuito in tutte le camere e nelle aree comuni.',
      actions: []
    },
    {
      id: 'whatsapp',
      match: /whatsapp|wa|chat dirett|parlare con|persona|umano|operatore/i,
      response: 'Certo! Scrivi direttamente alla nostra reception su WhatsApp — rispondiamo nei nostri orari di apertura.',
      actions: [
        { label: 'Apri WhatsApp', href: wa("Ciao, vorrei info su A' Pinnata"), wa: true, primary: true }
      ]
    },
    {
      id: 'thanks',
      match: /grazi|thanks|thank you|merci/i,
      response: 'Grazie a te! Se hai altre domande sono qui. Buona giornata 🌅',
      actions: []
    }
  ];

  const FALLBACK = {
    response: 'Non ho trovato una risposta precisa. Vuoi parlare direttamente con noi su WhatsApp?',
    actions: [
      { label: 'WhatsApp', href: wa("Ciao, ho una domanda su A' Pinnata"), wa: true, primary: true },
      { label: `Chiama ${PHONE_DISPLAY}`, href: `tel:${PHONE}` }
    ]
  };

  const WELCOME = {
    response: 'Ciao 👋 Sono l\'assistente virtuale di A\' Pinnata. Posso aiutarti con info su camere, prezzi, eventi, posizione e prenotazione. Cosa vorresti sapere?',
    actions: []
  };

  const QUICK_REPLIES = [
    { label: 'Disponibilità & prezzi', say: 'Vorrei verificare disponibilità e prezzi' },
    { label: 'Le camere', say: 'Che camere avete?' },
    { label: 'Colazione', say: 'Com\'è la colazione?' },
    { label: 'Eventi in terrazza', say: 'Quali eventi avete in terrazza?' },
    { label: 'Come arrivare', say: 'Come arrivo da Milazzo?' },
    { label: 'Parla su WhatsApp', say: 'Voglio parlare su WhatsApp' }
  ];

  /* ───── STYLES ───── */
  const css = `
.chat-fab {
  position: fixed;
  bottom: 24px; right: 24px;
  width: 60px; height: 60px;
  border-radius: 50%;
  background: var(--champagne, #c9a87a);
  color: var(--night, #0a0d12);
  border: none;
  cursor: pointer;
  box-shadow: 0 12px 32px -8px rgba(10,13,18,.4), 0 0 0 0 rgba(201,168,122,.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
  transition: transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease, background .3s ease;
  animation: chatPulse 2.6s ease-in-out infinite;
}
.chat-fab:hover { transform: scale(1.08); }
.chat-fab svg { width: 26px; height: 26px; }
.chat-fab.is-open { animation: none; background: var(--night, #0a0d12); color: var(--ivory, #f5f1e8); }
.chat-fab.is-open svg { display: none; }
.chat-fab.is-open::before { content: "×"; font-size: 2.2rem; font-family: var(--serif, Georgia, serif); font-weight: 300; line-height: 0; padding-bottom: 4px; }
@keyframes chatPulse {
  0%, 100% { box-shadow: 0 12px 32px -8px rgba(10,13,18,.4), 0 0 0 0 rgba(201,168,122,.5); }
  50%      { box-shadow: 0 12px 32px -8px rgba(10,13,18,.4), 0 0 0 14px rgba(201,168,122,0); }
}

.chat-panel {
  position: fixed;
  bottom: 100px; right: 24px;
  width: 380px;
  max-height: 70vh;
  background: var(--night, #0a0d12);
  color: var(--ivory, #f5f1e8);
  border-radius: 20px;
  box-shadow: 0 30px 80px -20px rgba(10,13,18,.5);
  border: 1px solid rgba(245,241,232,.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 199;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(.96);
  transition: opacity .35s cubic-bezier(.2,.7,.2,1), transform .35s cubic-bezier(.2,.7,.2,1), visibility .35s;
  font-family: var(--sans, "Inter", system-ui, sans-serif);
}
.chat-panel.is-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

.chat-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(245,241,232,.08);
  background: linear-gradient(180deg, rgba(201,168,122,.08), transparent);
}
.chat-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--champagne, #c9a87a);
  color: var(--night, #0a0d12);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif, Georgia, serif);
  font-weight: 300;
  font-size: 1.4rem;
  font-style: italic;
}
.chat-head-name {
  font-family: var(--serif, Georgia, serif);
  font-weight: 400;
  font-size: 1.05rem;
  letter-spacing: -0.01em;
  line-height: 1.1;
}
.chat-head-status {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: rgba(245,241,232,.55);
  display: flex; align-items: center; gap: 6px;
  margin-top: 2px;
}
.chat-head-status::before {
  content: "";
  width: 6px; height: 6px;
  background: #6fcf73;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(111,207,115,.6);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(245,241,232,.15); border-radius: 3px; }

.chat-msg {
  max-width: 86%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.92rem;
  line-height: 1.5;
  animation: chatMsgIn .35s cubic-bezier(.2,.7,.2,1) both;
}
@keyframes chatMsgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.chat-msg.bot {
  background: rgba(201,168,122,.12);
  color: var(--ivory, #f5f1e8);
  border: 1px solid rgba(201,168,122,.2);
  border-bottom-left-radius: 6px;
  align-self: flex-start;
}
.chat-msg.user {
  background: var(--ivory, #f5f1e8);
  color: var(--night, #0a0d12);
  border-bottom-right-radius: 6px;
  align-self: flex-end;
}
.chat-msg p { margin: 0; }
.chat-msg p + p { margin-top: 6px; }

.chat-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.chat-action {
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  padding: 8px 14px;
  border-radius: 999px;
  background: transparent;
  color: var(--ivory, #f5f1e8);
  border: 1px solid rgba(201,168,122,.4);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all .25s ease;
  font-family: inherit;
}
.chat-action:hover { background: rgba(201,168,122,.12); border-color: var(--champagne, #c9a87a); }
.chat-action.primary {
  background: var(--champagne, #c9a87a);
  color: var(--night, #0a0d12);
  border-color: var(--champagne, #c9a87a);
}
.chat-action.primary:hover { background: var(--ivory, #f5f1e8); border-color: var(--ivory, #f5f1e8); }
.chat-action.wa::before {
  content: "";
  width: 14px; height: 14px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'/></svg>") center/contain no-repeat;
          mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'/></svg>") center/contain no-repeat;
}

.chat-typing {
  display: inline-flex;
  gap: 4px;
  padding: 14px 18px;
  background: rgba(201,168,122,.12);
  border: 1px solid rgba(201,168,122,.2);
  border-radius: 18px;
  border-bottom-left-radius: 6px;
  align-self: flex-start;
}
.chat-typing span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--champagne, #c9a87a);
  animation: chatType 1.2s ease-in-out infinite;
}
.chat-typing span:nth-child(2) { animation-delay: .15s; }
.chat-typing span:nth-child(3) { animation-delay: .3s; }
@keyframes chatType {
  0%, 60%, 100% { transform: translateY(0); opacity: .5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

.chat-quick {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  border-top: 1px solid rgba(245,241,232,.08);
  overflow-x: auto;
  scrollbar-width: none;
}
.chat-quick::-webkit-scrollbar { display: none; }
.chat-quick-btn {
  flex-shrink: 0;
  font-size: 0.78rem;
  padding: 8px 14px;
  border-radius: 999px;
  background: transparent;
  color: rgba(245,241,232,.85);
  border: 1px solid rgba(245,241,232,.18);
  cursor: pointer;
  white-space: nowrap;
  transition: all .2s ease;
  font-family: inherit;
}
.chat-quick-btn:hover { border-color: var(--champagne, #c9a87a); color: var(--champagne, #c9a87a); }

.chat-input {
  display: flex;
  gap: 8px;
  padding: 14px 16px 16px;
  border-top: 1px solid rgba(245,241,232,.08);
  background: rgba(10,13,18,.5);
}
.chat-input input {
  flex: 1;
  background: rgba(245,241,232,.06);
  border: 1px solid rgba(245,241,232,.12);
  color: var(--ivory, #f5f1e8);
  border-radius: 999px;
  padding: 11px 18px;
  font-size: 0.92rem;
  outline: none;
  font-family: inherit;
  transition: border-color .2s ease;
}
.chat-input input:focus { border-color: var(--champagne, #c9a87a); }
.chat-input input::placeholder { color: rgba(245,241,232,.4); }
.chat-input button {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--champagne, #c9a87a);
  color: var(--night, #0a0d12);
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  transition: background .2s ease;
  flex-shrink: 0;
}
.chat-input button:hover { background: var(--ivory, #f5f1e8); }

@media (max-width: 600px) {
  .chat-fab { width: 54px; height: 54px; bottom: 16px; right: 16px; }
  .chat-panel {
    bottom: 0; right: 0; left: 0;
    width: 100%;
    max-height: 85vh;
    height: 85vh;
    border-radius: 20px 20px 0 0;
  }
  .chat-fab.is-open { bottom: calc(85vh - 30px); }
}`;

  /* ───── DOM BUILD ───── */
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.setAttribute('aria-label', 'Apri chat di assistenza');
  fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>`;

  const panel = document.createElement('aside');
  panel.className = 'chat-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('aria-label', 'Chat assistenza A\' Pinnata');
  panel.innerHTML = `
    <header class="chat-head">
      <div class="chat-avatar"><em>A'</em></div>
      <div>
        <div class="chat-head-name">Assistente A' Pinnata</div>
        <div class="chat-head-status">Online · risponde subito</div>
      </div>
    </header>
    <div class="chat-messages" id="chat-msgs"></div>
    <div class="chat-quick" id="chat-quick"></div>
    <form class="chat-input" id="chat-form">
      <input type="text" placeholder="Scrivi un messaggio..." autocomplete="off" maxlength="200" aria-label="Messaggio" />
      <button type="submit" aria-label="Invia">→</button>
    </form>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const msgsEl = panel.querySelector('#chat-msgs');
  const quickEl = panel.querySelector('#chat-quick');
  const formEl  = panel.querySelector('#chat-form');
  const inputEl = formEl.querySelector('input');

  /* ───── RENDER ───── */
  const escapeHtml = (s) => s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'})[c]);

  const renderActions = (actions) => {
    if (!actions || !actions.length) return '';
    const inner = actions.map(a => {
      const cls = ['chat-action'];
      if (a.primary) cls.push('primary');
      if (a.wa) cls.push('wa');
      const isExternal = a.wa || (a.href || '').startsWith('http') || (a.href || '').startsWith('tel:') || (a.href || '').startsWith('mailto:');
      const target = a.wa || (a.href || '').startsWith('http') ? ' target="_blank" rel="noopener"' : '';
      return `<a class="${cls.join(' ')}" href="${a.href}"${target} data-anchor="${(a.href||'').startsWith('#') ? '1' : '0'}">${escapeHtml(a.label)}</a>`;
    }).join('');
    return `<div class="chat-actions">${inner}</div>`;
  };

  const addBotMessage = ({ response, actions }) => {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<p>${escapeHtml(response)}</p>${renderActions(actions)}`;
    msgsEl.appendChild(div);
    // anchor links should close the panel after click
    div.querySelectorAll('a[data-anchor="1"]').forEach(a => {
      a.addEventListener('click', () => setOpen(false));
    });
    scrollToBottom();
  };

  const addUserMessage = (text) => {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.innerHTML = `<p>${escapeHtml(text)}</p>`;
    msgsEl.appendChild(div);
    scrollToBottom();
  };

  const addTyping = () => {
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.innerHTML = `<span></span><span></span><span></span>`;
    div.dataset.typing = '1';
    msgsEl.appendChild(div);
    scrollToBottom();
    return div;
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => { msgsEl.scrollTop = msgsEl.scrollHeight; });
  };

  const renderQuick = () => {
    quickEl.innerHTML = QUICK_REPLIES.map(q =>
      `<button class="chat-quick-btn" data-say="${escapeHtml(q.say)}">${escapeHtml(q.label)}</button>`
    ).join('');
    quickEl.querySelectorAll('.chat-quick-btn').forEach(b => {
      b.addEventListener('click', () => handleUserInput(b.dataset.say));
    });
  };

  /* ───── INTENT MATCH ───── */
  const findIntent = (text) => {
    const norm = text.trim().toLowerCase();
    for (const i of INTENTS) {
      if (i.match.test(norm)) return i;
    }
    return null;
  };

  const handleUserInput = (text) => {
    if (!text || !text.trim()) return;
    addUserMessage(text);
    const intent = findIntent(text);
    const reply = intent || FALLBACK;
    // typing indicator with realistic delay
    const typingEl = addTyping();
    const delay = 600 + Math.min(reply.response.length * 8, 900);
    setTimeout(() => {
      typingEl.remove();
      addBotMessage(reply);
    }, delay);
  };

  /* ───── OPEN / CLOSE ───── */
  let isOpen = false;
  let initialized = false;
  const setOpen = (open) => {
    isOpen = open;
    fab.classList.toggle('is-open', open);
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    fab.setAttribute('aria-label', open ? 'Chiudi chat' : 'Apri chat di assistenza');
    if (open && !initialized) {
      initialized = true;
      renderQuick();
      setTimeout(() => addBotMessage(WELCOME), 200);
    }
    if (open) setTimeout(() => inputEl.focus({preventScroll: true}), 350);
  };

  fab.addEventListener('click', () => setOpen(!isOpen));

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputEl.value;
    inputEl.value = '';
    handleUserInput(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });

  /* ───── First-visit nudge (delayed greeting) ───── */
  if (!sessionStorage.getItem('pinnata-chat-seen')) {
    setTimeout(() => {
      if (!isOpen) {
        // subtle bounce to draw attention
        fab.style.animation = 'none';
        fab.offsetHeight;
        fab.style.animation = '';
      }
      sessionStorage.setItem('pinnata-chat-seen', '1');
    }, 6000);
  }
})();
