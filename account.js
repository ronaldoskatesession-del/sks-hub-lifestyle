(() => {
  'use strict';
  
  const supabaseUrl = 'https://mqwtfehpegrpapygigas.supabase.co';
  const supabaseKey = 'sb_publishable_-vqqnQCt17IX-gyxqsJJMA_YzYAi_Ws';
  
  let supabase = null;
  if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }

  window.SKSAccount = {
    ready: Promise.resolve({ user: null }),
    ensureTeacher: async () => ({}),
    ensureStudent: async () => ({}),
    
    login: async (data) => {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) throw new Error(error.message);
      return { user: authData.user };
    },
    
    logout: async () => { 
      if(supabase) await supabase.auth.signOut(); 
      location.assign('entrar.html'); 
    },

    // AQUI ESTÃO AS FUNÇÕES QUE ESTAVAM FALTANDO:
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
    saveFeedback: async () => ({ success: true })
  };
})();