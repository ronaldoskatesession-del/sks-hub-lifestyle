(() => {
  'use strict';
  
  // === 1. COLOQUE AS SUAS CHAVES DO SUPABASE AQUI ===
  const supabaseUrl = 'https://mqwtfehpegrpapygigas.supabase.co';
  const supabaseKey = 'sb_publishable_-vqqnQCt17IX-gyxqsJJMA_YzYAi_WS';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const mockData = { user: null };
  
  // Verifica se já existe alguém logado no Supabase
  const ready = supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
      mockData.user = {
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.name || 'Aluno',
        role: data.session.user.user_metadata?.role || 'student'
      };
    }
    return { user: mockData.user, unavailable: false, setupRequired: false };
  });

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
    
    // LOGIN REAL VIA SUPABASE
    login: async (data) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) throw new Error(error.message);
      
      mockData.user = {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || data.email.split('@')[0],
        role: authData.user.user_metadata?.role || 'student'
      };
      
      return { user: mockData.user };
    },

    // CRIAÇÃO DE CONTA REAL VIA SUPABASE
    register: async (data) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { name: data.name, role: 'student' } }
      });
      if (error) throw new Error(error.message);
      
      mockData.user = { id: authData.user.id, email: data.email, name: data.name, role: 'student' };
      return { user: mockData.user };
    },

    setup: async (data) => {
      return window.SKSAccount.register(data);
    },

    logout: async () => {
      await supabase.auth.signOut();
      mockData.user = null;
      location.assign('entrar.html');
    },

    // SIMULAÇÕES (MOCKS) PARA O SITE NÃO QUEBRAR NAS OUTRAS PÁGINAS
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
})();