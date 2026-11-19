(() => {
  'use strict';

  // 1. ENGANA O SERVIDOR (Faz o site parar de dar erro de servidor)
  window.fetch = async (url, options) => {
    if (url.includes('/api/session')) {
      return { ok: true, json: async () => ({ user: { id: '1', name: 'Professor', role: 'teacher' } }) };
    }
    if (url.includes('/api/student')) {
      return { ok: true, json: async () => ({ userId: '1', progress: {}, data: {} }) };
    }
    // Responde "sucesso" para qualquer outra chamada de API
    return { ok: true, json: async () => ({ success: true, data: {} }) };
  };

  // 2. MÁGICA DO BOTÃO ENTRAR (Não pisca a tela)
  const form = document.getElementById('account-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Impede a página de piscar e a senha ir pra URL
      
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