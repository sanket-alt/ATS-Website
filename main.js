/* ============================================================
   ATS Admin Dashboard Logic
   ============================================================ */
(function(){
  "use strict";

  /* ---------- Storage Keys ---------- */
  const KEYS = {
    admin:  'ats_admin',
    session:'ats_session',
    projects:'ats_projects',
    gallery: 'ats_gallery',
    archive: 'ats_archive',
    faq:     'ats_faq',
    calendar:'ats_calendar',
    init:    'ats_initialized'
  };

  /* ---------- Default Data (mirrors hardcoded site content) ---------- */
  const DEFAULTS = {
    projects: [
      { id:'uav-nav', type:'project', status:'active', title:'Autonomous UAV Navigation Rig',
        desc:'Building a GPS-denied indoor navigation stack for a quadrotor — visual-inertial odometry feeding a live occupancy map.',
        tags:['Avionics','Drones'], deadline:'Ongoing · builds Tue/Thu' },
      { id:'nanosat', type:'project', status:'active', title:'Nano-Satellite Simulator Bench',
        desc:'A frictionless air-bearing puck for testing relative-navigation and attitude-control algorithms on the ground.',
        tags:['Astronautics','Controls'], deadline:'Ongoing · lab access weekly' },
      { id:'ppt', type:'project', status:'recruiting', title:'Pulsed Plasma Thruster Test Stand',
        desc:'Designing and instrumenting a thrust stand for a lab-scale pulsed plasma thruster — vacuum, electronics and diagnostics all needed.',
        tags:['Propulsion','Electronics'], deadline:'Recruiting through September' },
      { id:'gokart', type:'project', status:'active', title:'Campus Go-Kart Build',
        desc:'Chassis geometry, suspension tuning and drivetrain layout for a kart aimed at Kari Motor Speedway.',
        tags:['Vehicle Design','Structures'], deadline:'Ongoing · workshop Sat' },
      { id:'sae-aero', type:'competition', status:'upcoming', title:'SAE Aero Design Challenge',
        desc:'Regular-class fixed-wing competition — payload-optimised airframe, built and flight-tested as a team.',
        tags:['Fixed-Wing','Competition'], deadline:'Registration closes', deadlineDate:'2026-10-15' },
      { id:'dbf', type:'competition', status:'upcoming', title:'AIAA Design-Build-Fly',
        desc:'A full design-build-fly cycle against a fresh mission spec — structures, aero and manufacturing in one team.',
        tags:['Fixed-Wing','Competition'], deadline:'Team formation closes', deadlineDate:'2026-11-02' }
    ],
    gallery: [
      { kind:'photo', size:'xl', valign:'bottom', cap:'SAE Aero, Fabrication Bay', yr:'2025', c1:'#e2531c', c2:'#2a2620', off:0, imageUrl:'' },
      { kind:'photo', size:'sm', valign:'top',    cap:'First Static Fire',         yr:'2024', c1:'#b5502a', c2:'#20221f', off:0, imageUrl:'' },
      { kind:'note',  quote:'BUILD. FLY. BREAK. REBUILD.', by:'Build log, PPT bay' },
      { kind:'photo', size:'md', valign:'bottom', cap:'Kari Speedway Trials',      yr:'2025', c1:'#3a5f8a', c2:'#18150f', off:0, imageUrl:'' },
      { kind:'photo', size:'sm', valign:'top',    cap:'Wind Tunnel Session',       yr:'2024', c1:'#7f8a5a', c2:'#20221c', off:36, imageUrl:'' },
      { kind:'photo', size:'lg', valign:'mid',    cap:'Night Before Nationals',    yr:'2025', c1:'#d7c9a0', c2:'#18150f', off:0, imageUrl:'' },
      { kind:'note',  quote:'It doesn\u2019t fly until it flies on the bench first.', by:'Workshop rule #1' },
      { kind:'photo', size:'md', valign:'bottom', cap:'Payload Integration',       yr:'2024', c1:'#e2531c', c2:'#20221f', off:0, imageUrl:'' },
      { kind:'photo', size:'sm', valign:'top',    cap:'Team Debrief',              yr:'2025', c1:'#3a5f8a', c2:'#231f18', off:0, imageUrl:'' },
      { kind:'photo', size:'md', valign:'bottom', cap:'Workshop Floor',            yr:'2023', c1:'#b5502a', c2:'#18150f', off:0, imageUrl:'' }
    ],
    archive: [
      { title:'Mini Jet Engine Build', year:'2024', cat:'Propulsion', note:'A working small-scale turbojet, built and bench-tested end to end.', c1:'#e2531c', c2:'#2a2620', h1:'#ff9a5c', h2:'#1c1a15' },
      { title:'Autonomous Ground Rover', year:'2024', cat:'Robotics', note:'ESP32-based rover for autonomous sample collection.', c1:'#3a5f8a', c2:'#20221f', h1:'#7ea3c9', h2:'#1c1a15' },
      { title:'Campus Drone Fleet', year:'2023', cat:'UAV', note:'A self-built multirotor platform for aerial mapping runs.', c1:'#c9b98a', c2:'#232019', h1:'#e2531c', h2:'#1c1a15' },
      { title:'Kinematic Sculpture', year:'2023', cat:'Structures', note:'A wind-driven kinetic installation exploring mechanism design.', c1:'#7f8a5a', c2:'#20221c', h1:'#a7b57e', h2:'#1c1a15' },
      { title:'Shock Tube Demonstrator', year:'2023', cat:'Fluids', note:'A benchtop shock tube built to visualise compressible flow.', c1:'#b5502a', c2:'#241f19', h1:'#e2531c', h2:'#1c1a15' },
      { title:'Weather Balloon Payload', year:'2022', cat:'Astronautics', note:'Instrumented near-space payload recovered after ascent.', c1:'#d7c9a0', c2:'#211f18', h1:'#c9b98a', h2:'#1c1a15' }
    ],
    faq: [
      { q:'Who can join ATS?', a:'Any PEC undergrad, any branch, any year. Aerospace helps but isn\'t required — most builds need electronics, mechanical and software hands too.' },
      { q:'Do I need prior project experience?', a:'No. First-years join builds every semester and pick things up alongside the team. Show up to a workshop session and you\'ll be paired with something to work on.' },
      { q:'How do I propose a project or competition?', a:'Use the "Propose" section on the site — it goes straight to the core team\'s review list for the next planning cycle.' },
      { q:'Where and when does the society meet?', a:'Workshop sessions run out of the Aerospace Department — check the mission board for which builds are meeting this week.' },
      { q:'I\'m stuck on a build — who do I ask?', a:'Email the core team or drop by a workshop slot — most active projects have someone around during their listed hours.' }
    ],
    calendar: [
      { name:'SUPRA SAEINDIA 2026', org:'SAEINDIA · Formula Student', loc:'Buddh International Circuit, Greater Noida', type:'india', cat:'Formula-style race car design & build', start:'2026-09-02', end:'2026-09-05' },
      { name:'SAE Aero Design Challenge', org:'SAE International', loc:'USA', type:'intl', cat:'Fixed-wing payload aircraft — registration deadline', start:'2026-10-15', end:'2026-10-15' },
      { name:'AIAA Design-Build-Fly', org:'AIAA / Cessna / Textron', loc:'Wichita, Kansas, USA', type:'intl', cat:'Design-build-fly RC aircraft — team formation deadline', start:'2026-11-02', end:'2026-11-02' },
      { name:'Formula Bharat 2027', org:'SAEINDIA-affiliated', loc:'Kari Motor Speedway, Coimbatore', type:'india', cat:'Formula-style race car — combustion / EV / driverless', start:'2027-01-19', end:'2027-01-24' },
      { name:'Go-Kart Design Challenge (GKDC)', org:'ISNEE', loc:'Coimbatore', type:'india', cat:'Go-kart design & fabrication', start:'2027-02-17', end:'2027-02-21' }
    ]
  };

  /* ---------- Utilities ---------- */
  function load(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function save(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }
    catch(e){ toast('Could not save — storage may be full', true); }
  }
  function uid(){ return Math.random().toString(36).slice(2,10); }
  function escapeHtml(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  /* ---------- Initialization ---------- */
  function initializeData(){
    if(!localStorage.getItem(KEYS.init)){
      save(KEYS.projects, DEFAULTS.projects);
      save(KEYS.gallery,  DEFAULTS.gallery);
      save(KEYS.archive,  DEFAULTS.archive);
      save(KEYS.faq,      DEFAULTS.faq);
      save(KEYS.calendar, DEFAULTS.calendar);
      localStorage.setItem(KEYS.init, '1');
    }
  }

  function getAdmin(){
    return load(KEYS.admin, {
      id: ATS_DEFAULT_ADMIN.id,
      password: ATS_DEFAULT_ADMIN.password
    });
  }
  function saveAdmin(a){ save(KEYS.admin, a); }

  function isSessionValid(){
    const s = load(KEYS.session, null);
    if(!s || !s.loggedIn) return false;
    // Session expires after 7 days
    if(Date.now() - s.ts > 7 * 24 * 60 * 60 * 1000) return false;
    return true;
  }
  function createSession(){
    save(KEYS.session, { loggedIn:true, ts:Date.now() });
  }
  function destroySession(){
    localStorage.removeItem(KEYS.session);
  }

  /* ---------- Toast ---------- */
  function toast(msg, isErr){
    const el = document.createElement('div');
    el.className = 'toast' + (isErr ? ' err' : '');
    el.textContent = msg;
    document.getElementById('toasts').appendChild(el);
    setTimeout(function(){ el.style.opacity = '0'; el.style.transition='opacity .3s'; }, 2600);
    setTimeout(function(){ el.remove(); }, 3000);
  }

  /* ---------- Auth Flow ---------- */
  function showLogin(){
    document.getElementById('loginWrap').style.display = 'flex';
    document.getElementById('dashWrap').style.display = 'none';
  }
  function showDashboard(){
    document.getElementById('loginWrap').style.display = 'none';
    document.getElementById('dashWrap').style.display = 'grid';
    const admin = getAdmin();
    document.getElementById('sessionId').textContent = 'Signed in as: ' + admin.id;
    renderAll();
  }

  document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value;
    const admin = getAdmin();
    if(id === admin.id && pw === admin.password){
      createSession();
      document.getElementById('loginError').textContent = '';
      showDashboard();
    } else {
      document.getElementById('loginError').textContent = 'Incorrect ID or password.';
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', function(e){
    e.preventDefault();
    destroySession();
    document.getElementById('loginForm').reset();
    showLogin();
  });

  /* ---------- Tab Navigation ---------- */
  const tabTitles = {
    projects:'Projects board', gallery:'Gallery', archive:'Past projects (archive)',
    faq:'Frequently asked questions', calendar:'Competition calendar', settings:'Settings'
  };
  const navItems = document.querySelectorAll('.dash-nav-item');
  navItems.forEach(function(btn){
    btn.addEventListener('click', function(){
      const tab = btn.dataset.tab;
      navItems.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.dash-section').forEach(function(s){ s.classList.remove('active'); });
      document.getElementById('sec-' + tab).classList.add('active');
      document.getElementById('dashTitle').textContent = tabTitles[tab];
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  document.getElementById('mobileMenuBtn').addEventListener('click', function(){
    document.getElementById('sidebar').classList.toggle('open');
  });

  /* ---------- Modal System ---------- */
  const modal = document.getElementById('modal');
  const modalForm = document.getElementById('modalForm');
  let modalHandler = null;

  function openModal(title, sub, html, onSubmit){
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSub').textContent = sub || '';
    modalForm.innerHTML = html +
      '<div class="form-actions">' +
        '<button type="button" class="btn" id="modalCancel">Cancel</button>' +
        '<button type="submit" class="btn btn-solid">Save</button>' +
      '</div>' +
      '<div class="form-error" id="modalError"></div>';
    modal.classList.add('open');
    if(modalHandler) modalForm.removeEventListener('submit', modalHandler);
    modalHandler = function(e){
      e.preventDefault();
      onSubmit(modalForm, document.getElementById('modalError'));
    };
    modalForm.addEventListener('submit', modalHandler);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
  }
  function closeModal(){
    modal.classList.remove('open');
    if(modalHandler){ modalForm.removeEventListener('submit', modalHandler); modalHandler = null; }
  }
  modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });

  /* ---------- Renderers ---------- */
  function renderProjects(){
    const list = load(KEYS.projects, []);
    const el = document.getElementById('list-projects');
    if(!list.length){
      el.innerHTML = '<div class="empty-state">No projects yet. Click "+ Add new" to create one.</div>';
      return;
    }
    el.innerHTML = list.map(function(p){
      const tags = (p.tags || []).map(function(t){ return '<span class="item-tag">'+escapeHtml(t)+'</span>'; }).join('');
      return (
        '<div class="item-row" data-id="'+p.id+'">' +
          '<div class="item-meta">' +
            '<div class="item-title">'+escapeHtml(p.title)+'</div>' +
            '<div class="item-sub">'+escapeHtml(p.type)+' · '+escapeHtml(p.status)+' · '+escapeHtml(p.deadline || '')+'</div>' +
            '<div class="item-tags">'+tags+'</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="btn btn-sm" data-edit="projects" data-id="'+p.id+'">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-del="projects" data-id="'+p.id+'">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderGallery(){
    const list = load(KEYS.gallery, []);
    const el = document.getElementById('list-gallery');
    if(!list.length){
      el.innerHTML = '<div class="empty-state">Gallery is empty. Click "+ Add photo" to add one.</div>';
      return;
    }
    el.innerHTML = list.map(function(g, idx){
      if(g.kind === 'note'){
        return (
          '<div class="item-row" data-idx="'+idx+'">' +
            '<div class="item-meta">' +
              '<div class="item-title">“'+escapeHtml(g.quote)+'”</div>' +
              '<div class="item-sub">Quote · '+escapeHtml(g.by || '')+'</div>' +
            '</div>' +
            '<div class="item-actions">' +
              '<button class="btn btn-sm" data-edit="gallery" data-idx="'+idx+'">Edit</button>' +
              '<button class="btn btn-sm btn-danger" data-del="gallery" data-idx="'+idx+'">Delete</button>' +
            '</div>' +
          '</div>'
        );
      }
      const preview = g.imageUrl ? '<img src="'+escapeHtml(g.imageUrl)+'" onerror="this.style.display=\'none\'">' : 'No image';
      return (
        '<div class="item-row" data-idx="'+idx+'">' +
          '<div class="item-meta" style="display:flex;gap:12px;align-items:center;">' +
            '<div style="width:60px;height:60px;border-radius:4px;overflow:hidden;border:1px solid var(--line);background:var(--bg-panel);flex-shrink:0;display:flex;align-items:center;justify-content:center;">'+preview+'</div>' +
            '<div style="min-width:0;">' +
              '<div class="item-title">'+escapeHtml(g.cap || '(no caption)')+'</div>' +
              '<div class="item-sub">'+escapeHtml(g.yr || '')+' · '+escapeHtml(g.size || '')+' · '+escapeHtml(g.valign || '')+'</div>' +
            '</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="btn btn-sm" data-edit="gallery" data-idx="'+idx+'">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-del="gallery" data-idx="'+idx+'">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderArchive(){
    const list = load(KEYS.archive, []);
    const el = document.getElementById('list-archive');
    if(!list.length){
      el.innerHTML = '<div class="empty-state">No archive entries. Click "+ Add entry".</div>';
      return;
    }
    el.innerHTML = list.map(function(a, idx){
      return (
        '<div class="item-row" data-idx="'+idx+'">' +
          '<div class="item-meta">' +
            '<div class="item-title">'+escapeHtml(a.title)+'</div>' +
            '<div class="item-sub">'+escapeHtml(a.year || '')+' · '+escapeHtml(a.cat || '')+'</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="btn btn-sm" data-edit="archive" data-idx="'+idx+'">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-del="archive" data-idx="'+idx+'">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderFaq(){
    const list = load(KEYS.faq, []);
    const el = document.getElementById('list-faq');
    if(!list.length){
      el.innerHTML = '<div class="empty-state">No FAQs. Click "+ Add FAQ".</div>';
      return;
    }
    el.innerHTML = list.map(function(f, idx){
      return (
        '<div class="item-row" data-idx="'+idx+'">' +
          '<div class="item-meta">' +
            '<div class="item-title">'+escapeHtml(f.q)+'</div>' +
            '<div class="item-sub">'+escapeHtml(f.a).slice(0, 100)+(f.a.length > 100 ? '…' : '')+'</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="btn btn-sm" data-edit="faq" data-idx="'+idx+'">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-del="faq" data-idx="'+idx+'">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderCalendar(){
    const list = load(KEYS.calendar, []);
    const el = document.getElementById('list-calendar');
    if(!list.length){
      el.innerHTML = '<div class="empty-state">No events. Click "+ Add event".</div>';
      return;
    }
    el.innerHTML = list.map(function(c, idx){
      return (
        '<div class="item-row" data-idx="'+idx+'">' +
          '<div class="item-meta">' +
            '<div class="item-title">'+escapeHtml(c.name)+'</div>' +
            '<div class="item-sub">'+escapeHtml(c.start)+' → '+escapeHtml(c.end)+' · '+escapeHtml(c.type || '')+'</div>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="btn btn-sm" data-edit="calendar" data-idx="'+idx+'">Edit</button>' +
            '<button class="btn btn-sm btn-danger" data-del="calendar" data-idx="'+idx+'">Delete</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderAll(){
    renderProjects();
    renderGallery();
    renderArchive();
    renderFaq();
    renderCalendar();
  }

  /* ---------- Form Builders ---------- */
  function projectFormHtml(p){
    p = p || {};
    return (
      '<div class="form-row">' +
        '<div class="form-field"><label>Title</label><input name="title" required value="'+escapeHtml(p.title || '')+'"></div>' +
        '<div class="form-field"><label>Type</label>' +
          '<select name="type">' +
            '<option value="project"'+(p.type==='project'?' selected':'')+'>Project</option>' +
            '<option value="competition"'+(p.type==='competition'?' selected':'')+'>Competition</option>' +
          '</select></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label>Status</label>' +
          '<select name="status">' +
            '<option value="active"'+(p.status==='active'?' selected':'')+'>Active</option>' +
            '<option value="recruiting"'+(p.status==='recruiting'?' selected':'')+'>Recruiting</option>' +
            '<option value="upcoming"'+(p.status==='upcoming'?' selected':'')+'>Upcoming</option>' +
          '</select></div>' +
        '<div class="form-field"><label>Tags (comma-separated)</label><input name="tags" placeholder="Avionics, Drones" value="'+escapeHtml((p.tags||[]).join(', '))+'"></div>' +
      '</div>' +
      '<div class="form-field"><label>Description</label><textarea name="desc" rows="3">'+escapeHtml(p.desc || '')+'</textarea></div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label>Deadline text</label><input name="deadline" value="'+escapeHtml(p.deadline || '')+'" placeholder="e.g. Ongoing · builds Tue/Thu"></div>' +
        '<div class="form-field"><label>Deadline date (optional)</label><input name="deadlineDate" type="date" value="'+escapeHtml(p.deadlineDate || '')+'"><span class="hint">Only for competitions with a fixed date</span></div>' +
      '</div>'
    );
  }
  function projectFromForm(form){
    const f = new FormData(form);
    return {
      id: uid(),
      title: f.get('title').trim(),
      type: f.get('type'),
      status: f.get('status'),
      tags: (f.get('tags') || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean),
      desc: (f.get('desc') || '').trim(),
      deadline: (f.get('deadline') || '').trim(),
      deadlineDate: (f.get('deadlineDate') || '').trim() || null
    };
  }

  function galleryFormHtml(g){
    g = g || { kind:'photo', size:'md', valign:'bottom' };
    return (
      '<div class="form-field"><label>Type</label>' +
        '<select name="kind" id="galleryKind">' +
          '<option value="photo"'+(g.kind==='photo'?' selected':'')+'>Photo</option>' +
          '<option value="note"'+(g.kind==='note'?' selected':'')+'>Quote / Note</option>' +
        '</select></div>' +
      '<div id="photoFields" style="'+(g.kind==='note'?'display:none':'')+'">' +
        '<div class="form-field"><label>Caption</label><input name="cap" value="'+escapeHtml(g.cap || '')+'" placeholder="e.g. Workshop floor, 2025"></div>' +
        '<div class="form-row">' +
          '<div class="form-field"><label>Year</label><input name="yr" value="'+escapeHtml(g.yr || '')+'" placeholder="2025"></div>' +
          '<div class="form-field"><label>Size</label>' +
            '<select name="size">' +
              '<option value="sm"'+(g.size==='sm'?' selected':'')+'>Small</option>' +
              '<option value="md"'+(g.size==='md'?' selected':'')+'>Medium</option>' +
              '<option value="lg"'+(g.size==='lg'?' selected':'')+'>Large</option>' +
              '<option value="xl"'+(g.size==='xl'?' selected':'')+'>Extra Large</option>' +
            '</select></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="form-field"><label>Vertical alignment</label>' +
            '<select name="valign">' +
              '<option value="top"'+(g.valign==='top'?' selected':'')+'>Top</option>' +
              '<option value="mid"'+(g.valign==='mid'?' selected':'')+'>Middle</option>' +
              '<option value="bottom"'+(g.valign==='bottom'?' selected':'')+'>Bottom</option>' +
            '</select></div>' +
          '<div class="form-field"><label>Accent color (hex)</label><input name="c1" value="'+escapeHtml(g.c1 || '#e2531c')+'" placeholder="#e2531c"></div>' +
        '</div>' +
        '<div class="form-field"><label>Image</label>' +
          '<div class="img-picker">' +
            '<div class="img-preview" id="imgPreview">'+(g.imageUrl?'<img src="'+escapeHtml(g.imageUrl)+'">':'No image')+'</div>' +
            '<div class="img-picker-main">' +
              '<input name="imageUrl" id="imgUrlInput" value="'+escapeHtml(g.imageUrl || '')+'" placeholder="https://example.com/photo.jpg">' +
              '<div class="img-picker-btns">' +
                '<button type="button" class="btn btn-sm" id="chooseFileBtn">Choose file</button>' +
                '<input type="file" id="imgFile" accept="image/*" style="display:none;">' +
              '</div>' +
              '<span class="hint">Paste a direct image URL, or upload a small photo (under 500KB recommended).</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="noteFields" style="'+(g.kind==='note'?'':'display:none')+'">' +
        '<div class="form-field"><label>Quote</label><textarea name="quote" rows="2">'+escapeHtml(g.quote || '')+'</textarea></div>' +
        '<div class="form-field"><label>Attribution</label><input name="by" value="'+escapeHtml(g.by || '')+'" placeholder="e.g. Workshop rule #1"></div>' +
      '</div>'
    );
  }
  function bindGalleryForm(form){
    const kind = form.querySelector('#galleryKind');
    const photo = form.querySelector('#photoFields');
    const note = form.querySelector('#noteFields');
    kind.addEventListener('change', function(){
      if(kind.value === 'note'){ photo.style.display='none'; note.style.display=''; }
      else { photo.style.display=''; note.style.display='none'; }
    });
    const urlInput = form.querySelector('#imgUrlInput');
    const preview = form.querySelector('#imgPreview');
    urlInput.addEventListener('input', function(){
      const url = urlInput.value.trim();
      if(url){
        preview.innerHTML = '<img src="'+escapeHtml(url)+'" onerror="this.parentNode.innerHTML=\'Invalid URL\'">';
      } else {
        preview.innerHTML = 'No image';
      }
    });
    const fileBtn = form.querySelector('#chooseFileBtn');
    const fileInput = form.querySelector('#imgFile');
    fileBtn.addEventListener('click', function(){ fileInput.click(); });
    fileInput.addEventListener('change', function(){
      const file = fileInput.files[0];
      if(!file) return;
      if(file.size > 800000){
        toast('Image is large — consider hosting it elsewhere and pasting the URL.', true);
      }
      const reader = new FileReader();
      reader.onload = function(e){
        urlInput.value = e.target.result;
        preview.innerHTML = '<img src="'+e.target.result+'">';
      };
      reader.readAsDataURL(file);
    });
  }
  function galleryFromForm(form){
    const f = new FormData(form);
    const kind = f.get('kind');
    if(kind === 'note'){
      return {
        kind:'note',
        quote: (f.get('quote') || '').trim(),
        by: (f.get('by') || '').trim()
      };
    }
    return {
      kind:'photo',
      cap: (f.get('cap') || '').trim(),
      yr: (f.get('yr') || '').trim(),
      size: f.get('size'),
      valign: f.get('valign'),
      c1: f.get('c1') || '#e2531c',
      c2: '#2a2620',
      off: 0,
      imageUrl: (f.get('imageUrl') || '').trim()
    };
  }

  function archiveFormHtml(a){
    a = a || {};
    return (
      '<div class="form-row">' +
        '<div class="form-field"><label>Title</label><input name="title" required value="'+escapeHtml(a.title || '')+'"></div>' +
        '<div class="form-field"><label>Year</label><input name="year" value="'+escapeHtml(a.year || '')+'" placeholder="2024"></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label>Category</label><input name="cat" value="'+escapeHtml(a.cat || '')+'" placeholder="Propulsion, Robotics, UAV..."></div>' +
        '<div class="form-field"><label>Image URL (optional)</label><input name="imageUrl" value="'+escapeHtml(a.imageUrl || '')+'" placeholder="https://..."></div>' +
      '</div>' +
      '<div class="form-field"><label>Short description</label><textarea name="note" rows="2">'+escapeHtml(a.note || '')+'</textarea></div>'
    );
  }
  function archiveFromForm(form){
    const f = new FormData(form);
    return {
      title: f.get('title').trim(),
      year: (f.get('year') || '').trim(),
      cat: (f.get('cat') || '').trim(),
      note: (f.get('note') || '').trim(),
      imageUrl: (f.get('imageUrl') || '').trim(),
      c1: '#e2531c', c2: '#2a2620', h1: '#ff9a5c', h2: '#1c1a15'
    };
  }

  function faqFormHtml(f){
    f = f || {};
    return (
      '<div class="form-field"><label>Question</label><input name="q" required value="'+escapeHtml(f.q || '')+'" placeholder="e.g. Who can join ATS?"></div>' +
      '<div class="form-field"><label>Answer</label><textarea name="a" rows="4" required>'+escapeHtml(f.a || '')+'</textarea></div>'
    );
  }
  function faqFromForm(form){
    const f = new FormData(form);
    return {
      q: f.get('q').trim(),
      a: f.get('a').trim()
    };
  }

  function calendarFormHtml(c){
    c = c || { type:'india' };
    return (
      '<div class="form-field"><label>Event name</label><input name="name" required value="'+escapeHtml(c.name || '')+'"></div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label>Organizer</label><input name="org" value="'+escapeHtml(c.org || '')+'"></div>' +
        '<div class="form-field"><label>Type</label>' +
          '<select name="type">' +
            '<option value="india"'+(c.type==='india'?' selected':'')+'>India</option>' +
            '<option value="intl"'+(c.type==='intl'?' selected':'')+'>International</option>' +
          '</select></div>' +
      '</div>' +
      '<div class="form-field"><label>Location</label><input name="loc" value="'+escapeHtml(c.loc || '')+'"></div>' +
      '<div class="form-field"><label>Category / description</label><input name="cat" value="'+escapeHtml(c.cat || '')+'"></div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label>Start date</label><input name="start" type="date" required value="'+escapeHtml(c.start || '')+'"></div>' +
        '<div class="form-field"><label>End date</label><input name="end" type="date" required value="'+escapeHtml(c.end || '')+'"></div>' +
      '</div>'
    );
  }
  function calendarFromForm(form){
    const f = new FormData(form);
    return {
      name: f.get('name').trim(),
      org: (f.get('org') || '').trim(),
      type: f.get('type'),
      loc: (f.get('loc') || '').trim(),
      cat: (f.get('cat') || '').trim(),
      start: f.get('start'),
      end: f.get('end')
    };
  }

  /* ---------- Add / Edit / Delete handlers ---------- */
  const FORMS = {
    projects: { html: projectFormHtml, from: projectFromForm, key: KEYS.projects, useId: true },
    gallery:  { html: galleryFormHtml,  from: galleryFromForm, key: KEYS.gallery, bind: bindGalleryForm },
    archive:  { html: archiveFormHtml,  from: archiveFromForm, key: KEYS.archive },
    faq:      { html: faqFormHtml,      from: faqFromForm,     key: KEYS.faq },
    calendar: { html: calendarFormHtml, from: calendarFromForm,key: KEYS.calendar }
  };

  function openAddModal(type){
    const f = FORMS[type];
    openModal('Add ' + tabTitles[type].toLowerCase(), '', f.html({}), function(form, errEl){
      const newItem = f.from(form);
      if(!newItem.title && !newItem.q && !newItem.name && !newItem.cap && !newItem.quote){
        errEl.textContent = 'Please fill in the required fields.'; return;
      }
      const list = load(f.key, []);
      list.push(newItem);
      save(f.key, list);
      closeModal();
      toast('Added successfully');
      renderAll();
    });
    if(FORMS[type].bind) FORMS[type].bind(modalForm);
  }

  function openEditModal(type, identifier){
    const f = FORMS[type];
    const list = load(f.key, []);
    let idx, item;
    if(f.useId){
      idx = list.findIndex(function(x){ return x.id === identifier; });
    } else {
      idx = parseInt(identifier, 10);
    }
    if(idx < 0 || idx >= list.length) return;
    item = list[idx];
    openModal('Edit ' + tabTitles[type].toLowerCase(), '', f.html(item), function(form, errEl){
      const updated = f.from(form);
      if(f.useId) updated.id = item.id;
      list[idx] = updated;
      save(f.key, list);
      closeModal();
      toast('Saved');
      renderAll();
    });
    if(f.bind) f.bind(modalForm);
  }

  function deleteItem(type, identifier){
    if(!confirm('Delete this item? This cannot be undone.')) return;
    const f = FORMS[type];
    const list = load(f.key, []);
    let newList;
    if(f.useId){
      newList = list.filter(function(x){ return x.id !== identifier; });
    } else {
      const idx = parseInt(identifier, 10);
      newList = list.filter(function(_, i){ return i !== idx; });
    }
    save(f.key, newList);
    toast('Deleted');
    renderAll();
  }

  /* ---------- Delegated event listeners ---------- */
  document.body.addEventListener('click', function(e){
    const addBtn = e.target.closest('[data-add]');
    if(addBtn){ openAddModal(addBtn.dataset.add); return; }
    const editBtn = e.target.closest('[data-edit]');
    if(editBtn){
      const type = editBtn.dataset.edit;
      const id = editBtn.dataset.id || editBtn.dataset.idx;
      openEditModal(type, id);
      return;
    }
    const delBtn = e.target.closest('[data-del]');
    if(delBtn){
      const type = delBtn.dataset.del;
      const id = delBtn.dataset.id || delBtn.dataset.idx;
      deleteItem(type, id);
      return;
    }
  });

  /* ---------- Settings: Credentials ---------- */
  document.getElementById('credForm').addEventListener('submit', function(e){
    e.preventDefault();
    const id = document.getElementById('newId').value.trim();
    const pw = document.getElementById('newPw').value;
    const pw2 = document.getElementById('newPw2').value;
    if(!id || !pw){ toast('ID and password are required.', true); return; }
    if(pw !== pw2){ toast('Passwords do not match.', true); return; }
    if(pw.length < 4){ toast('Password too short.', true); return; }
    saveAdmin({ id: id, password: pw });
    document.getElementById('sessionId').textContent = 'Signed in as: ' + id;
    this.reset();
    toast('Credentials updated. Use the new ID/password next time you log in.');
  });

  /* ---------- Settings: Export / Import / Reset ---------- */
  document.getElementById('exportBtn').addEventListener('click', function(){
    const data = {
      projects: load(KEYS.projects, []),
      gallery: load(KEYS.gallery, []),
      archive: load(KEYS.archive, []),
      faq: load(KEYS.faq, []),
      calendar: load(KEYS.calendar, [])
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ats-site-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported');
  });

  document.getElementById('importBtn').addEventListener('click', function(){
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', function(e){
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try{
        const data = JSON.parse(ev.target.result);
        if(data.projects) save(KEYS.projects, data.projects);
        if(data.gallery)  save(KEYS.gallery,  data.gallery);
        if(data.archive)  save(KEYS.archive,  data.archive);
        if(data.faq)      save(KEYS.faq,      data.faq);
        if(data.calendar) save(KEYS.calendar, data.calendar);
        toast('Data imported — refresh site to see changes.');
        renderAll();
      }catch(err){
        toast('Invalid file format.', true);
      }
    };
    reader.readAsText(file);
    this.value = '';
  });

  document.getElementById('resetBtn').addEventListener('click', function(){
    if(!confirm('Reset ALL site data to the original defaults? This will erase your changes.')) return;
    save(KEYS.projects, DEFAULTS.projects);
    save(KEYS.gallery, DEFAULTS.gallery);
    save(KEYS.archive, DEFAULTS.archive);
    save(KEYS.faq, DEFAULTS.faq);
    save(KEYS.calendar, DEFAULTS.calendar);
    toast('Reset complete');
    renderAll();
  });

  /* ---------- Boot ---------- */
  initializeData();
  if(isSessionValid()){
    showDashboard();
  } else {
    showLogin();
  }

})();
