(() => {
  'use strict';

  // 1. ENGANA O SERVIDOR (Para o painel não dar erro)
  window.fetch = async (url, options) => {
    if (url.includes('/api/session')) {
      return { ok: true, json: async () => ({ user: { id: '1', name: 'Professor', role: 'teacher' } }) };
    }
    if (url.includes('/api/student')) {
      return { ok: true, json: async () => ({ userId: '1', progress: {}, data: {} }) };
    }
    return { ok: true, json: async () => ({ success: true, data: {} }) };
  };

  // 2. TIRA A OBRIGAÇÃO DE PREENCHER OS CAMPOS
  const inputs = document.querySelectorAll('#account-form input');
  inputs.forEach(input => {
    input.removeAttribute('required'); // Tira o "Preencha este campo"
  });

  // 3. FAZ OS BOTÕES DE ALUNO/PROFESSOR FUNCIONAREM
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

  // 4. MÁGICA DO BOTÃO ENTRAR
  const form = document.getElementById('account-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Impede a página de piscar
      
      const button = document.getElementById('account-submit');
      if (button) {
        button.textContent = 'Entrando...';
        button.disabled = true;
      }
      
      // Vai direto para o painel
      setTimeout(() => {
        location.href = '191026.html#/dashboard';
      }, 500);
    });
  }
})();