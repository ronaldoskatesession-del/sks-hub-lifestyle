(() => {
  'use strict';
  
  const supabaseUrl = 'https://mqwtfehpegrpapygigas.supabase.co';
  const supabaseKey = 'sb_publishable_-vqqnQCt17IX-gyxqsJJMA_YzYAi_Ws';
  
  let supabase = null;
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  // Simulação para as outras páginas não quebrarem
  window.SKSAccount = {
    ready: Promise.resolve({ user: null }),
    ensureTeacher: async () => ({}),
    ensureStudent: async () => ({}),
    logout: async () => { if(supabase) await supabase.auth.signOut(); location.assign('entrar.html'); }
  };

  // ==========================================
  // LÓGICA DA TELA DE LOGIN (BOTÕES E FORMULÁRIO)
  // ==========================================
  if (document.body.dataset.mode !== 'login') return;
  
  const form = document.getElementById('account-form');
  const error = document.getElementById('account-error');
  const nameField = document.getElementById('name-field');
  const params = new URLSearchParams(location.search);
  const requestedRole = params.get('role') === 'teacher' || params.get('next') === '/professor.html' ? 'teacher' : params.get('role') === 'student' ? 'student' : '';
  
  let mode = 'login';

  function setMode(value) {
    mode = value;
    if (nameField) nameField.hidden = value === 'login';
    if (form && form.elements.name) form.elements.name.required = value !== 'login';
    
    const titleEl = document.getElementById('account-title');
    if (titleEl) titleEl.textContent = value === 'setup' ? 'Configure o professor' : value === 'register' ? 'Crie sua conta de aluno' : requestedRole === 'teacher' ? 'Entrar como professor' : requestedRole === 'student' ? 'Entrar como aluno' : 'Entre na sua Agência Escola';
    
    const submitBtn = document.getElementById('account-submit');
    if (submitBtn) submitBtn.textContent = value === 'setup' ? 'Criar conta do professor' : value === 'register' ? 'Criar minha conta' : 'Entrar';
    
    if (form && form.elements.password) form.elements.password.autocomplete = value === 'login' ? 'current-password' : 'new-password';
    
    const switchContainer = document.getElementById('account-switch');
    if (switchContainer) switchContainer.hidden = value === 'setup';
    
    const switchModeBtn = document.getElementById('switch-mode');
    if (switchModeBtn) switchModeBtn.textContent = value === 'login' ? 'Criar conta de aluno' : 'Já tenho uma conta';
    
    const setupNote = document.getElementById('setup-note');
    if (setupNote) setupNote.hidden = value !== 'setup';
    
    if (error) error.textContent = '';
  }

  // Ativa o botão de trocar entre Login e Criar Conta
  const switchModeBtn = document.getElementById('switch-mode');
  if (switchModeBtn) {
    switchModeBtn.addEventListener('click', () => setMode(mode === 'login' ? 'register' : 'login'));
  }

  // Envio do Formulário (Login e Cadastro)
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault(); // Impede a senha de ir pra URL
      if (error) error.textContent = '';
      const button = document.getElementById('account-submit');
      if (button) button.disabled = true;

      const email = form.elements.email ? form.elements.email.value : '';
      const password = form.elements.password ? form.elements.password.value : '';
      const name = form.elements.name ? form.elements.name.value : '';

      try {
        if (!supabase) throw new Error("Supabase não inicializado.");

        if (mode === 'login') {
          // LOGIN
          const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
          if (authError) throw new Error(authError.message);
          location.assign('191026.html#/dashboard');
        } else {
          // CRIAR CONTA
          const { data, error: authError } = await supabase.auth.signUp({
            email, password,
            options: { data: { name: name, role: 'student' } }
          });
          if (authError) throw new Error(authError.message);
          location.assign('191026.html#/dashboard');
        }
      } catch (err) {
        if (error) error.textContent = err.message;
        if (button) button.disabled = false;
      }
    });
  }

  // Inicia a tela
  setMode('login');
  
  // Se já estiver logado, pula direto pro painel
  if (supabase) {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) location.replace('191026.html#/dashboard');
    });
  }
})();