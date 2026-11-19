(() => {
  'use strict';
  
  // === 1. SUAS CREDENCIAIS DO SUPABASE ===
  const supabaseUrl = 'https://mqwtfehpegrpapygigas.supabase.co';
  const supabaseKey = 'sb_publishable_-vqqnQCt17IX-gyxqsJJMA_YzYAi_WS';
  
  let supabase = null;
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  const mockData = { user: null };
  
  const ready = supabase ? supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      mockData.user = {
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.name || 'Aluno',
        role: 'teacher' // Forçando professor para acessar o dashboard
      };
    }
    return { user: mockData.user, unavailable: false, setupRequired: false };
  }) : Promise.resolve({ user: null, unavailable: true, setupRequired: false });

  function returnPath(){ return location.pathname+location.search+location.hash; }
  
  async function requireRole(teacherOnly) {
    const result = await ready;
    if(!result.user){
      location.replace('entrar.html?next='+encodeURIComponent(returnPath()));
      return null;
    }
    return result.user;
  }

  window.SKSAccount = {
    ready,
    session: () => ready,
    ensureStudent: () => requireRole(false),
    ensureTeacher: () => requireRole(true),
    
    login: async (data) => {
      if (!supabase) throw new Error("Supabase não inicializado.");
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) throw new Error(error.message);
      
      mockData.user = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || data.email.split('@')[0],
        role: 'teacher' // Forçando professor
      };
      return { user: mockData.user };
    },

    register: async (data) => {
      if (!supabase) throw new Error("Supabase não inicializado.");
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name, role: 'student' } }
      });
      if (error) throw new Error(error.message);
      mockData.user = { id: authData.user.id, email: data.email, name: data.name, role: 'student' };
      return { user: mockData.user };
    },

    setup: async (data) => window.SKSAccount.register(data),

    logout: async () => {
      if (supabase) await supabase.auth.signOut();
      mockData.user = null;
      location.assign('entrar.html');
    },

    // SIMULAÇÕES PARA O SITE NÃO QUEBRAR
    loadStudent: async () => ({ userId: mockData.user?.id, progress: {}, data: {} }),
    loadFormationProgress: async () => ({ progress: {} }),
    loadAccount: async () => ({ user: mockData.user, data: {} }),
    saveAccount: async () => ({ user: mockData.user, success: true }),
    saveStudent: async () => ({ success: true }),
    loadCourse: async () => ({ data: {} }),
    saveCourse: async () => ({ success: true }),
    students: async () => ([]),
    student: async () => ({ data: {} }),
    studentAccount: async () => ({ data: {} }),
    createStudent: async () => ({ success: true }),
    createTestStudents: async () => ({ success: true }),
    saveFeedback: async () => ({ success: true })
  };

  // === 2. LÓGICA DO FORMULÁRIO DE LOGIN ===
  if(document.body && document.body.dataset.mode === 'login') {
    const form = document.getElementById('account-form');
    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault(); // ISSO IMPEDE A SENHA DE APARECER NA URL!
        const errorEl = document.getElementById('account-error');
        if (errorEl) errorEl.textContent = '';
        const button = document.getElementById('account-submit');
        if (button) button.disabled = true;

        try {
          const data = {
            name: form.elements.name ? form.elements.name.value : '',
            email: form.elements.email.value,
            password: form.elements.password.value
          };
          const result = await window.SKSAccount.login(data);
          location.assign('191026.html#/dashboard');
        } catch(err) {
          if (errorEl) errorEl.textContent = err.message;
          if (button) button.disabled = false;
        }
      });
    }
  }
})();