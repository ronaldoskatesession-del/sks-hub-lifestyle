(() => {
  'use strict';
  
  const supabaseUrl = 'https://mqwtfehpegrpapygigas.supabase.co';
  const supabaseKey = 'sb_publishable_-vqqnQCt17IX-gyxqsJJMA_YzYAi_Ws';
  
  let supabase = null;
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  // Configurações para o painel não quebrar
  window.SKSAccount = {
    ready: Promise.resolve({ user: null }),
    ensureTeacher: async () => ({}),
    ensureStudent: async () => ({}),
    loadCourse: async () => ({ data: {} }),
    saveCourse: async () => ({ success: true }),
    loadStudent: async () => ({ userId: '123', progress: {}, data: {} }),
    loadFormationProgress: async () => ({ progress: {} }),
    loadAccount: async () => ({ user: {name: 'Professor', role: 'teacher'}, data: {} }),
    saveAccount: async () => ({ success: true }),
    saveStudent: async () => ({ success: true }),
    students: async () => ([]),
    student: async () => ({ data: {} }),
    studentAccount: async () => ({ data: {} }),
    createStudent: async () => ({ success: true }),
    createTestStudents: async () => ({ success: true }),
    saveFeedback: async () => ({ success: true }),
    logout: async () => { 
      if(supabase) await supabase.auth.signOut(); 
      location.assign('entrar.html'); 
    }
  };

  // Lógica da Tela de Login (Impede a página de piscar)
  const form = document.getElementById('account-form');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault(); // ISSO IMPEDE A SENHA DE IR PRO LINK
      
      const errorEl = document.getElementById('account-error');
      if (errorEl) errorEl.textContent = '';
      
      const button = document.getElementById('account-submit');
      if (button) button.disabled = true;

      const email = form.elements.email ? form.elements.email.value : '';
      const password = form.elements.password ? form.elements.password.value : '';

      try {
        if (!supabase) throw new Error("Supabase não inicializado.");
        
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw new Error(error.message);
        
        // Se logar, vai para o Dashboard
        location.assign('191026.html#/dashboard');
        
      } catch (err) {
        if (errorEl) errorEl.textContent = err.message;
        if (button) button.disabled = false;
      }
    });
  }
})();