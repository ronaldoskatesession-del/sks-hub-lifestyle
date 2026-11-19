(() => {
  'use strict';
  
  // MÁGICA: Simula o sistema para o painel não quebrar e o botão funcionar
  window.SKSAccount = {
    ready: Promise.resolve({ user: { name: 'Professor', role: 'teacher' } }),
    ensureTeacher: async () => ({ name: 'Professor', role: 'teacher' }),
    ensureStudent: async () => ({ name: 'Aluno', role: 'student' }),
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
    logout: async () => { location.assign('entrar.html'); }
  };

  // A MÁGICA DO BOTÃO ENTRAR
  const form = document.getElementById('account-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // ISSO FAZ A PÁGINA PARAR DE PISCAR!
      
      const button = document.getElementById('account-submit');
      if (button) {
        button.textContent = 'Entrando...';
        button.disabled = true;
      }
      
      // Espera meio segundo e te joga direto para o Dashboard
      setTimeout(() => {
        location.href = '191026.html#/dashboard';
      }, 500);
    });
  }
})();