(() => {
  const config = window.ZYRO_CONFIG || {};
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const inviteButton = document.getElementById('inviteButton');
  const supportButton = document.getElementById('supportButton');
  const guildButton = document.getElementById('guildButton');
  const warning = document.getElementById('linkWarning');
  const linkConfigs = [
    [inviteButton, config.inviteUrl, 'bot invite'],
    [supportButton, config.supportUrl, 'support server'],
    [guildButton, config.guildUrl, 'Discord guild']
  ];
  linkConfigs.forEach(([button, url, label]) => {
    if (url) {
      button.href = url;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    } else {
      button.addEventListener('click', event => {
        event.preventDefault();
        showToast('Add your ' + label + ' URL in config.js first.');
      });
    }
  });
  if (linkConfigs.every(([, url]) => Boolean(url))) warning.style.display = 'none';
  else warning.innerHTML = 'Setup needed: add your Discord links in <code>config.js</code>.';

  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const command = button.dataset.copy;
      try { await navigator.clipboard.writeText(command); showToast(command + ' copied'); }
      catch { showToast('Command: ' + command); }
    });
  });

  const content = document.getElementById('dashContent');
  const title = document.getElementById('dashTitle');
  const overviewHTML = content.innerHTML;
  const tabContent = {
    overview: ['Overview', overviewHTML],
    music: ['Music controls', `
      <div class="dash-box"><div class="dash-box-title">PLAYER CONTROLS <span>DEMO ONLY</span></div>
      <div class="welcome-card" style="margin-top:16px"><div><span class="welcome-kicker">NOW PLAYING</span><h4 id="demoTrack">No track playing</h4><p>Connect a real player backend to show live track data.</p></div><div class="welcome-symbol">♫</div></div>
      <div class="quick-actions" style="margin-top:14px"><button class="quick-action" data-action="Play">▶ <span>Play</span></button><button class="quick-action" data-action="Pause">Ⅱ <span>Pause</span></button><button class="quick-action" data-action="Skip">» <span>Skip</span></button><button class="quick-action" data-action="Queue">≡ <span>Queue</span></button></div>
      <p class="dash-note" id="actionMessage">Demo controls do not send commands to Discord.</p></div>`],
    settings: ['Settings', `
      <div class="dash-box"><div class="dash-box-title">SERVER PREFERENCES <span>LOCAL PREVIEW</span></div>
      <div class="setting-row"><div><strong>Autoplay</strong><p>Continue with related tracks after the queue.</p></div><button class="switch" role="switch" aria-checked="false" aria-label="Toggle autoplay"></button></div>
      <div class="setting-row"><div><strong>Announce track changes</strong><p>Show a message when a new track starts.</p></div><button class="switch on" role="switch" aria-checked="true" aria-label="Toggle track announcements"></button></div>
      <div class="setting-row"><div><strong>Allow DJ controls</strong><p>Enable extra playback controls for trusted members.</p></div><button class="switch on" role="switch" aria-checked="true" aria-label="Toggle DJ controls"></button></div>
      <p class="dash-note">These settings are only stored in this page's current view. A backend is needed to save them and apply them to your bot.</p></div>`]
  };
  function attachActions() {
    content.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
      const message = content.querySelector('#actionMessage');
      const action = button.dataset.action;
      if (message) message.textContent = action + ' selected — demo only; connect a bot API to execute this action.';
      showToast(action + ' preview selected');
    }));
    content.querySelectorAll('.switch').forEach(button => button.addEventListener('click', () => {
      button.classList.toggle('on');
      const on = button.classList.contains('on');
      button.setAttribute('aria-checked', String(on));
      showToast('Preview setting ' + (on ? 'enabled' : 'disabled'));
    }));
  }
  document.querySelectorAll('.dash-nav').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.dash-nav').forEach(b => b.classList.toggle('active', b === button));
    const [heading, html] = tabContent[button.dataset.tab];
    title.textContent = heading;
    content.innerHTML = html;
    attachActions();
  }));
  attachActions();
})();
