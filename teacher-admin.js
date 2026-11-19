(() => {
  'use strict';
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const groups = [
    ['Principal', [['Visão geral','overview'],['Agenda','agenda'],['Pendências e atalhos','pending']]],
    ['Pessoas e acessos', [['Agentes SKS','agents'],['Professores e mentores','teachers'],['Equipe','team'],['Inscrições e matrículas','enrollments'],['Usuários e permissões','permissions']]],
    ['Acadêmico', [['Formações','index.html#disciplinas'],['Fases e módulos','index.html#agencia/formacao'],['Disciplinas','index.html#disciplinas'],['Turmas','classes'],['Calendário acadêmico','calendar']]],
    ['Conteúdos e aprendizagem', [['Gerenciar conteúdos','index.html#agencia/conteudos'],['Aulas e materiais','index.html#agencia/conteudos'],['Biblioteca','index.html#agencia/biblioteca'],['Revisar curso','index.html#agencia/validacao']]],
    ['Avaliação e evolução', [['Missões e atividades','missions'],['Entregas','deliveries'],['Testes e avaliações','assessments'],['Feedback e pareceres','feedback'],['Progresso e competências','progress'],['Níveis dos Agentes SKS','levels'],['Badges e certificados','certificates']]],
    ['Projetos e clientes', [['Hub do Cliente','clients'],['Empresas parceiras','partners'],['Projetos reais','projects'],['Tarefas e entregáveis','tasks'],['Portfólios','portfolios']]],
    ['Comunicação e comunidade', [['Avisos','announcements'],['Mensagens','messages'],['Encontros e eventos','events'],['Comunidade','community'],['E-mail e WhatsApp','channels']]],
    ['Financeiro', [['Acesso ao Financeiro existente','191026.html#/financeiro'],['Receitas e despesas','191026.html#/financeiro'],['Cobranças e pagamentos','payments'],['Bolsas e benefícios','scholarships'],['Relatórios financeiros','finance-reports']]],
    ['Operações', [['Unidades e espaços','spaces'],['Equipamentos e ativos','assets'],['Equipe operacional','operations-team'],['Operação de eventos','operations-events']]],
    ['Relatórios e IA', [['Relatórios acadêmicos','reports'],['Relatórios operacionais','operations-reports'],['Indicadores por turma','class-reports'],['Tutor e assistência de IA','ai'],['Análises assistidas','ai-reports']]],
    ['Administração e configurações', [['Perfil da organização','organization'],['Preferências e aparência','appearance'],['Campos e regras','rules'],['Segurança e permissões','security'],['Integrações','integrations'],['Automações','automations'],['Armazenamento e backups','backups'],['Histórico de alterações','history']]],
    ['Portal e suporte', [['Páginas públicas','public-pages'],['Perguntas frequentes','faq'],['Atendimento','support'],['Documentação','docs']]]
  ];
  const href = value => value.includes('.html') ? value : 'professor.html#admin/'+value;
  const entries = groups.flatMap(([category,items]) => items.map(([label,key]) => ({category,label,key})));
  const indexPage = location.pathname.endsWith('/index.html');
  const sidebar = document.getElementById('sidebar');
  const nav = sidebar?.querySelector('nav');
  if (!nav) return;
  const current = () => (location.hash.startsWith('#admin/') ? location.hash.slice(7) : location.hash.slice(1)) || 'overview';
  nav.innerHTML = '<a class="nav-item" href="191026.html#/dashboard">← Voltar ao dashboard</a>' + groups.map(([label,items],i) =>
    '<details class="admin-nav-group" data-group="'+i+'"><summary>'+e(label)+'</summary><div>'+items.map(([name,key]) =>
      '<a class="nav-item" href="'+e(href(key))+'" data-admin-key="'+e(key)+'">'+e(name)+'</a>').join('')+'</div></details>').join('')+
    '<a class="nav-item" href="aluno.html">▷ Testar como aluno</a>';
  const collapse = document.createElement('button');
  collapse.type='button';collapse.className='admin-collapse';collapse.textContent='⇤ Recolher menu';
  collapse.setAttribute('aria-expanded','true');
  collapse.addEventListener('click',()=>{
    const on=document.body.classList.toggle('admin-sidebar-collapsed');
    collapse.textContent=on?'☰ Abrir menu':'⇤ Recolher menu';
    collapse.setAttribute('aria-expanded',String(!on));
  });
  sidebar.prepend(collapse);
  document.body.classList.add('teacher-admin');
  if(indexPage)document.body.dataset.mode='teacher';
  const note = '<p class="admin-note">Gestão local · dados da conta conectada. Contas TESTE não entram nos indicadores reais.</p>';
  let detailsCache = null, detailsVersion='', summaryRun=0;
  function syncNav() {
    const hash=location.hash;
    let key=indexPage?'index.html#disciplinas':current();
    if(indexPage){
      if(hash.includes('/conteudos')||hash.startsWith('#conteudos'))key='index.html#agencia/conteudos';
      else if(hash.includes('/validacao')||hash==='#validacao')key='index.html#agencia/validacao';
      else if(hash.includes('/biblioteca')||hash==='#biblioteca')key='index.html#agencia/biblioteca';
      else if(hash.includes('/projeto')||hash==='#projeto')key='clients';
    }
    nav.querySelectorAll('[data-admin-key]').forEach(a=>{
      const active=a.dataset.adminKey===key;
      a.classList.toggle('active',active);
      if(active){a.setAttribute('aria-current','page');a.closest('details').open=true;}
      else a.removeAttribute('aria-current');
    });
  }
  if(indexPage){
    const updateCourseLinks=()=>{
      const id=window.SKSTeacherDisciplines?.route(location.hash,location.search)?.formationId||window.SKSFormations?.currentId||'agencia';
      nav.querySelectorAll('a[href^="index.html#agencia/"]').forEach(a=>{
        const suffix=a.dataset.adminKey.split('#agencia/')[1];
        if(suffix)a.href='index.html#'+id+'/'+suffix;
      });
    };
    updateCourseLinks();window.addEventListener('hashchange',updateCourseLinks);
  }
  syncNav();
  if(indexPage){window.addEventListener('hashchange',syncNav);return;}
  const main=document.getElementById('admin-main'),roster=document.getElementById('teacher-roster');
  const live = key => ['agents','enrollments','missions','deliveries','assessments','feedback','progress','reports','clients','tasks','projects'].includes(key);
  const link=(label,value)=>'<a class="outline" href="'+e(href(value))+'">'+e(label)+' →</a>';
  const panel=(title,body)=>'<section class="panel admin-panel"><h2>'+e(title)+'</h2>'+body+'</section>';
  const empty=text=>'<p class="admin-empty">'+e(text)+'</p>';
  const planned = {
    agenda:'Não há agenda institucional cadastrada. A agenda pessoal dos Agentes permanece privada e não é usada como calendário acadêmico.',
    classes:'A versão atual não possui entidade de turma. As contas continuam vinculadas às formações existentes.',
    permissions:'O servidor distingue professor e aluno. Não há cadastro de administradores separados nem permissões por turma nesta versão.',
    enrollments:'As contas de Agentes são criadas por autocadastro. A matrícula institucional separada ainda não existe.',
    ai:'Integração pendente. O acesso à IA SKS existente permanece no dashboard; não há análise acadêmica automática conectada.',
    backups:'O editor exporta conteúdos e o painel exporta relatórios. O backup completo do banco ainda depende de procedimento externo.',
    security:'As verificações atuais continuam no servidor: professor e aluno. A separação de administrador e escopo por turma está planejada.'
  };
  function route() {
    const key=current(),item=entries.find(x=>x.key===key)||entries[0];
    syncNav();
    roster.hidden=!live(key);
    const user=window.SKSTeacherUser;
    main.innerHTML='<header class="admin-page-heading"><div><p class="eyebrow">'+e(item.category)+'</p><h1>'+e(item.label)+'</h1><p>'+(user?'Olá, '+e(user.name)+'. Perfil: Professor · gestão local disponível à sua conta.':'Carregando a conta do professor…')+'</p></div></header>'+note;
    if(live(key)){
      main.innerHTML+=panel(item.label,empty(
        key==='clients'?'Consulte os campos e entregáveis do Hub de cada Agente em “Relatório e parecer”. O editor do roteiro do projeto permanece separado da operação real.':
        ['deliveries','missions','assessments','feedback'].includes(key)?'Abra “Relatório e parecer” do Agente para consultar respostas, avaliações e entregas e salvar sua devolutiva. Não existe aprovação individual de entregas implementada nesta versão.':
        'Use os filtros para separar contas reais e TESTE. “Ver aluno” é uma consulta sem trocar sua sessão.'))+
        (key==='clients'?link('Roteiro do Hub do Cliente','index.html#agencia/projeto'):'');
      return;
    }
    if(key==='overview'||key==='pending'){renderSummary(key);return;}
    if(key==='appearance'){
      main.innerHTML+=panel('Preferência de tema',empty('Use “Modo claro / Modo escuro” no cabeçalho. A preferência existente continua salva neste navegador.'));
      return;
    }
    if(key==='docs'||key==='faq'||key==='support'){
      main.innerHTML+=panel('Como usar o portal',empty('Edite aulas em Gerenciar conteúdos. Confira a preparação pedagógica em Revisar curso. Acompanhe pessoas e salve pareceres em Agentes SKS. O suporte por mensagens está planejado.'))+
        link('Documentação local','docs');
      return;
    }
    const integration=['ai','ai-reports','integrations','automations','channels','messages','payments'].includes(key);
    main.innerHTML+=panel(integration?'Integração pendente':'Planejado',empty(planned[key]||'Esta área ainda não possui cadastro ou operação implementada. Nenhuma ação ou indicador foi simulado.'))+
      panel('Acessos existentes',link('Agentes SKS','agents')+' '+link('Gerenciar conteúdos','index.html#agencia/conteudos')+' '+link('Revisar curso','index.html#agencia/validacao'));
  }
  async function renderSummary(key) {
    const serial=++summaryRun;
    const all=window.SKSTeacherSnapshot?.students;
    if(!all){main.innerHTML+=panel('Carregando',empty('Aguardando as contas e os registros do servidor.'));return;}
    const real=all.filter(s=>!s.isTest),tests=all.filter(s=>s.isTest);
    const average=real.length?Math.round(real.reduce((n,s)=>n+s.percent,0)/real.length):null;
    main.innerHTML+='<div class="admin-kpis">'+[
      ['Agentes cadastrados',real.length,'Contas reais, sem filtro de atividade recente.'],
      ['Entregáveis para revisão',real.reduce((n,s)=>n+s.hubSubmitted,0),'Marcações no Hub, ainda sem aprovação individual.'],
      ['Progresso médio',average===null?'—':average+'%','Evolução de estudo das contas reais.'],
      ['Contas TESTE',tests.length,'Fora dos indicadores reais.']
    ].map(([label,n,hint])=>'<section class="panel admin-kpi"><span>'+label+'</span><strong>'+n+'</strong><small>'+hint+'</small></section>').join('')+'</div>'+
    '<div class="admin-dashboard-grid"><div>'+panel('Entregas registradas', '<div id="admin-deliveries">'+empty('Consultando entregas reais…')+'</div>')+
    panel('Gestão do conteúdo','<div class="admin-shortcuts">'+link('Disciplinas','index.html#disciplinas')+link('Gerenciar conteúdos','index.html#agencia/conteudos')+link('Revisar curso','index.html#agencia/validacao')+'</div>')+
    panel('Formações cadastradas',empty('O acompanhamento atual é por conta e formação, sem turmas cadastradas.'))+
    '</div><aside>'+panel('Agenda institucional',empty(planned.agenda))+
    panel('Acompanhamento','<div id="admin-followup">'+empty('Consultando dúvidas abertas…')+'</div>')+
    panel('Administração',empty('A conta de professor possui os acessos globais atuais. Perfis de administrador e professor separados estão planejados.')+link('Segurança e permissões','security'))+'</aside></div>';
    const version=JSON.stringify(real.map(s=>[s.id,s.updatedAt]));
    try{
      if(detailsVersion!==version||!detailsCache){detailsCache=await Promise.all(real.map(s=>window.SKSAccount.student(s.id)));detailsVersion=version;}
      if(serial!==summaryRun||current()!==key)return;
      const topicMap=new Map(window.SKS_CURRICULUM.modules.flatMap(m=>m.lessons.map(t=>[t.id,t.title])));
      const submitted=detailsCache.flatMap(d=>Object.entries(d.state.responses||{}).filter(([,v])=>v.submitted).map(([id,v])=>({id,name:d.student.name,studentId:d.student.id,title:topicMap.get(id)||id})));
      const rows=submitted.slice(0,10).map(x=>'<tr><td>'+e(x.name)+'</td><td>'+e(x.title)+'</td><td>'+link('Consultar','deliveries')+'</td></tr>').join('');
      document.getElementById('admin-deliveries').innerHTML=rows?'<div class="table-wrap"><table class="teacher-table"><thead><tr><th>Agente</th><th>Atividade</th><th>Ação</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="admin-note">São envios registrados; a aplicação ainda não armazena aprovação por atividade.</p>':empty('Nenhuma atividade enviada pelas contas reais.');
      const questions=detailsCache.filter(d=>d.state.questions?.length);
      document.getElementById('admin-followup').innerHTML=questions.length?questions.map(d=>'<p><b>'+e(d.student.name)+'</b><br>'+d.state.questions.length+' dúvidas registradas · '+link('Acompanhar','agents')+'</p>').join(''):empty('Nenhuma dúvida aberta registrada. Alertas por inatividade e risco acadêmico estão planejados.');
    }catch(error){
      if(serial===summaryRun&&current()===key){
        document.getElementById('admin-deliveries').textContent='Não foi possível consultar as entregas: '+error.message;
        document.getElementById('admin-followup').textContent='Consulta indisponível.';
      }
    }
  }
  window.addEventListener('hashchange',route);
  window.addEventListener('sks-teacher-snapshot',()=>{if(['overview','pending'].includes(current()))route();});
  window.addEventListener('sks-teacher-user',route);
  route();
})();
