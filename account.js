(() => {
  'use strict';

  // 1. Finge que somos um usuário logado em todas as páginas
  const mockUser = { id: '1', name: 'Usuário Teste', role: 'teacher' };

  // 2. Engana o servidor para não dar erro de "servidor local"
  window.fetch = async (url, options) => {
    if (url.includes('/api/session')) {
      return { ok: true, json: async () => ({ user: mockUser }) };
    }
    if (url.includes('/api/student')) {
      return { ok: true, json: async () => ({ userId: '1', progress: {}, data: {} }) };
    }
    return { ok: true, json: async () => ({ success: true, data: {} }) };
  };

  // 3. Objeto SKSAccount completo para as páginas não expulsarem você
  window.SKSAccount = {
    ready: Promise.resolve({ user: mockUser }),
    session: async () => ({ user: mockUser }),
    ensureStudent: async () => mockUser,
    ensureTeacher: async () => mockUser,
    loadStudent: async () => ({ userId: '1', progress: {}, data: {} }),
    loadFormationProgress: async () => ({ progress: {} }),
    loadAccount: async () => ({ user: mockUser, data: {} }),
    saveAccount: async () => ({ user: mockUser, success: true }),
    saveStudent: async () => ({ success: true }),
    loadCourse: async () => ({ data: {} }),
    saveCourse: async () => ({ success: true }),
    students: async () => ([]),
    student: async () => ({ data: {} }),
    studentAccount: async () => ({ data: {} }),
    createStudent: async () => ({ success: true }),
    createTestStudents: async () => ({ success: true }),
    saveFeedback: async () => ({ success: true }),
    logout: async () => { location.assign('entrar.html'); }
  };

  // 4. Lógica da Tela de Login
  const form = document.getElementById('account-form');
  if (form) {
    // Tira a obrigação de preencher as caixas
    const inputs = document.querySelectorAll('#account-form input');
    inputs.forEach(input => input.removeAttribute('required'));

    // Botões de Aluno/Professor
    const btnAluno = document.querySelector('[data-login-role="student"]');
    const btnProfessor = document.querySelector('[data-login-role="teacher"]');
    const titulo = document.getElementById('account-title');

    if (btnAluno && btnProfessor && titulo) {
      btnAluno.addEventListener('click', (e) => {
        e.preventDefault();
        btnAluno.style.borderColor = '#ffa700';
        btnProfessor.style.borderColor = '#333a47';
        titulo.textContent = 'Entrar como aluno';
      });
      btnProfessor.addEventListener('click', (e) => {
        e.preventDefault();
        btnProfessor.style.borderColor = '#ffa700';
        btnAluno.style.borderColor = '#333a47';
        titulo.textContent = 'Entrar como professor';
      });
    }

    // O Botão Entrar
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Não pisca a tela
      
      const button = document.getElementById('account-submit');
      if (button) {
        button.textContent = 'Entrando...';
        button.disabled = true;
      }
      
      // Se o título for "aluno", vai pra área do aluno. Senão, vai pro dashboard.
      let destino = '191026.html#/dashboard';
      if (titulo && titulo.textContent.includes('aluno')) {
         destino = 'aluno.html'; 
      }

      setTimeout(() => {
        location.href = destino;
      }, 500);
    });
  }
})();