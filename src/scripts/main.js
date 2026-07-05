src/scripts/main.js// =====================================================
// NAV SCROLL EFFECT & ACTIVE LINK
// =====================================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// =====================================================
// MOBILE MENU
// =====================================================
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;

// =====================================================
// SCROLL REVEAL
// =====================================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// =====================================================
// CART
// =====================================================
let cart = [];

function getProduct(btn) {
  const card = btn.closest('.product-card');
  return JSON.parse(card.dataset.product);
}
function addToCart(btn) {
  const p = getProduct(btn);
  const idx = cart.findIndex(i => i.id === p.id);
  if (idx >= 0) { cart[idx].qty++; } else { cart.push({ ...p, qty: 1 }); }
  renderCart();
  showToast(`${p.icon} "${p.name}" ajouté au panier !`);
  btn.textContent = '✓ Ajouté !';
  setTimeout(() => { btn.innerHTML = '+ Panier'; }, 1500);
}
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}
function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}
function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = '€' + total.toFixed(2).replace('.', ',');
  document.getElementById('cart-footer').style.display = cart.length ? 'block' : 'none';
  document.getElementById('cart-empty').style.display = cart.length ? 'none' : 'flex';
  const itemsEl = document.getElementById('cart-items');
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-icon">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">€${(item.price * item.qty).toFixed(2).replace('.',',')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Supprimer">🗑</button>
    `;
    itemsEl.insertBefore(el, document.getElementById('cart-empty'));
  });
}
function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}
function checkout() {
  if (!cart.length) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = cart.map(i => `${i.qty}x ${i.name} = €${(i.price*i.qty).toFixed(2)}`).join('\n');
  const subject = encodeURIComponent('Commande Petites Étoiles');
  const body = encodeURIComponent(`Bonjour,\n\nJe souhaite passer la commande suivante :\n\n${lines}\n\nTotal : €${total.toFixed(2)}\n\nMerci !`);
  window.open(`mailto:petitesetoiles.officiel@gmail.com?subject=${subject}&body=${body}`);
  showToast('📧 Votre commande a été préparée — vérifiez votre messagerie !');
}
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
window.toggleCart = toggleCart;
window.checkout = checkout;

// =====================================================
// TOAST
// =====================================================
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3200);
}

// =====================================================
// CONTACT FORM
// =====================================================
function submitForm() {
  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();
  if (!name || !email || !message) { showToast('⚠️ Veuillez remplir tous les champs obligatoires.'); return; }
  const subject  = document.getElementById('f-subject').value || 'Contact site';
  const lastname = document.getElementById('f-lastname').value.trim();
  const mailSubject = encodeURIComponent(`[${subject}] Message de ${name} ${lastname}`);
  const mailBody    = encodeURIComponent(`Nom : ${name} ${lastname}\nEmail : ${email}\nSujet : ${subject}\n\n${message}`);
  window.location.href = `mailto:petitesetoiles.officiel@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  document.getElementById('contact-form-content').style.display = 'none';
  document.getElementById('form-success').classList.add('visible');
}
window.submitForm = submitForm;

// =====================================================
// i18n
// =====================================================
const i18n = {
  fr: {
    'nav.music':'Musique','nav.shop':'Boutique','nav.about':'À propos','nav.contact':'Contact','nav.cart':'Panier',
    'hero.badge':'Musique pour enfants',
    'hero.sub':"Des comptines sur les Prophètes de l'Islam, chantées dans les langues du monde entier — pour que chaque enfant grandisse avec leur histoire dans le cœur.",
    'hero.cta1':'🎵 Écouter maintenant','hero.cta2':'🛍️ Voir la boutique',
    'hero.stat1':'Singles publiés','hero.stat2':'Langues','hero.stat3':'Pays','hero.stat4':'Cœurs touchés',
    'hero.scroll':'Découvrir',
    'music.tag':'Nos singles','music.title':'La saga du <em>Prophète Adam</em>',
    'music.desc':"Le premier single de Petites Étoiles raconte l'histoire d'Adam ﷺ en 4 langues.",
    'upcoming.tag':'Prochainement','upcoming.title':'La saga des Prophètes continue…',
    'shop.tag':'Boutique','shop.title':"L'univers <em>Petites Étoiles</em>",
    'shop.desc':"Musique, livres illustrés et goodies pour accompagner vos enfants dans la découverte des Prophètes.",
    'shop.new':'Nouveau','shop.soon':'Pré-commande','shop.sale':'-25%','shop.add':'+ Panier','shop.preorder':'Pré-commander',
    'about.tag':'Notre histoire','about.title':'De petites étoiles <em>pour guider</em> les enfants',
    'about.text':"Petites Étoiles est né d'un rêve simple : offrir aux enfants musulmans du monde entier des comptines qui célèbrent les histoires des Prophètes de l'Islam — dans leur propre langue, avec leur propre mélodie.",
    'contact.tag':'Contact','contact.title':'Vous avez un projet ? <em>Parlons-en</em>',
    'contact.desc':'Collaboration, partenariat médias, diffusion scolaire — nous sommes ouverts à toute belle aventure.',
    'contact.reach':'Nous retrouver','contact.reachDesc':'Que vous soyez parent, éducateur, journaliste ou partenaire potentiel, nous serions ravis de vous lire.',
    'form.name':'Prénom','form.lastname':'Nom','form.email':'Email','form.subject':'Sujet','form.message':'Message','form.send':'Envoyer le message ✉️',
    'form.success.title':'Message envoyé !','form.success.desc':'Nous vous répondrons dans les 48h. بارك الله فيكم',
    'cart.title':'Mon panier','cart.empty':'Votre panier est vide','cart.emptyDesc':'Ajoutez des produits pour commencer',
    'cart.total':'Total','cart.checkout':'Passer la commande →','cart.secure':'Paiement sécurisé via',
    'footer.desc':"Des comptines pour les enfants du monde entier. Chaque histoire, chaque mélodie, une graine de lumière.",
    'footer.nav':'Navigation','footer.legal':'Légal','footer.rights':'Tous droits réservés',
    'footer.privacy':'Politique de confidentialité','footer.terms':'Conditions générales',
    'footer.cookies':'Gestion des cookies','footer.mentions':'Mentions légales',
    'pillar1.title':'Multilingue','pillar1.desc':'Chaque prophète chanté en 4+ langues pour toucher chaque enfant',
    'pillar2.title':'Éducatif','pillar2.desc':'Des histoires authentiques tirées du Coran et de la Sunnah',
    'pillar3.title':'Musical','pillar3.desc':'Des mélodies modernes et entraînantes que les enfants adorent',
    'pillar4.title':'Avec amour','pillar4.desc':'Créé par des parents pour les parents, avec le cœur',
    'prod1.name':'Pack Digital — Adam ✕ 4 langues','prod1.desc':'Téléchargez les 4 singles haute qualité (MP3 320kbps) : arabe, anglais, ourdou, indonésien.',
    'prod2.name':'Livre illustré — Adam, le Premier Homme','prod2.desc':'Un album jeunesse magnifiquement illustré. Bilingue français-arabe. Pour les 3–8 ans.',
    'prod4.name':'Poster illustré — Les Prophètes','prod4.desc':'Poster A3 premium illustrant la timeline des 25 Prophètes de l\'Islam.',
    'prod5.name':'Pack Famille — Tout-en-un','prod5.desc':'Pack complet : 4 singles digitaux + livre illustré + poster.',
    'prod6.name':"Cahier d'activités — Les Prophètes",'prod6.desc':'50 activités éducatives autour des histoires des Prophètes. Format A4 imprimable.',
  },
  en: {
    'nav.music':'Music','nav.shop':'Shop','nav.about':'About','nav.contact':'Contact','nav.cart':'Cart',
    'hero.badge':'Music for children',
    'hero.sub':"Nursery rhymes about the Prophets of Islam, sung in the languages of the world — so every child grows up with their stories in their heart.",
    'hero.cta1':'🎵 Listen Now','hero.cta2':'🛍️ Visit Shop',
    'hero.stat1':'Singles released','hero.stat2':'Languages','hero.stat3':'Countries','hero.stat4':'Hearts touched',
    'hero.scroll':'Discover',
    'music.tag':'Our singles','music.title':'The saga of <em>Prophet Adam</em>',
    'music.desc':"The first Petites Étoiles single tells the story of Adam ﷺ in 4 languages.",
    'upcoming.tag':'Coming soon','upcoming.title':'The Prophets saga continues…',
    'shop.tag':'Shop','shop.title':"The <em>Petites Étoiles</em> universe",
    'shop.desc':"Music, illustrated books, and goodies to guide your children in discovering the Prophets.",
    'shop.new':'New','shop.soon':'Pre-order','shop.sale':'-25%','shop.add':'+ Add to cart','shop.preorder':'Pre-order',
    'about.tag':'Our story','about.title':'Little stars <em>to guide</em> children',
    'about.text':"Petites Étoiles was born from a simple dream: to give Muslim children around the world nursery rhymes that celebrate the stories of the Prophets of Islam — in their own language, with their own melody.",
    'contact.tag':'Contact','contact.title':"Have a project? <em>Let's talk</em>",
    'contact.desc':'Collaboration, media partnerships, school licensing — we are open to all great adventures.',
    'contact.reach':'Find us','contact.reachDesc':"Whether you're a parent, educator, journalist, or potential partner, we'd love to hear from you.",
    'form.name':'First name','form.lastname':'Last name','form.email':'Email','form.subject':'Subject','form.message':'Message','form.send':'Send message ✉️',
    'form.success.title':'Message sent!','form.success.desc':'We will reply within 48h. بارك الله فيكم',
    'cart.title':'My cart','cart.empty':'Your cart is empty','cart.emptyDesc':'Add products to get started',
    'cart.total':'Total','cart.checkout':'Checkout →','cart.secure':'Secure payment via',
    'footer.desc':"Nursery rhymes for children around the world. Every story, every melody, a seed of light.",
    'footer.nav':'Navigation','footer.legal':'Legal','footer.rights':'All rights reserved',
    'footer.privacy':'Privacy policy','footer.terms':'Terms & conditions',
    'footer.cookies':'Cookie settings','footer.mentions':'Legal notice',
    'pillar1.title':'Multilingual','pillar1.desc':'Each prophet sung in 4+ languages to reach every child',
    'pillar2.title':'Educational','pillar2.desc':'Authentic stories from the Quran and Sunnah',
    'pillar3.title':'Musical','pillar3.desc':'Modern, catchy melodies that children love',
    'pillar4.title':'Made with love','pillar4.desc':'Created by parents for parents, with heart',
    'prod1.name':'Digital Pack — Adam x 4 languages','prod1.desc':'Download all 4 singles in high quality MP3 (320kbps).',
    'prod2.name':'Illustrated Book — Adam, the First Man','prod2.desc':'A beautifully illustrated children\'s book. Bilingual French-Arabic. Ages 3-8.',
    'prod4.name':'Illustrated Poster — The Prophets','prod4.desc':'Premium A3 poster illustrating the timeline of the 25 Prophets of Islam.',
    'prod5.name':'Family Pack — All-in-one','prod5.desc':'Complete pack: 4 digital singles + illustrated book + poster.',
    'prod6.name':'Activity Book — The Prophets','prod6.desc':'50 educational activities around the Prophets\' stories. Printable A4 format.',
  },
  ar: {
    'nav.music':'الموسيقى','nav.shop':'المتجر','nav.about':'عنّا','nav.contact':'تواصل','nav.cart':'السلة',
    'hero.badge':'موسيقى للأطفال',
    'hero.sub':'أناشيد عن أنبياء الإسلام، تُغنّى بلغات العالم — لينشأ كل طفل وقصصهم في قلبه.',
    'hero.cta1':'🎵 استمع الآن','hero.cta2':'🛍️ زر المتجر',
    'hero.stat1':'أغانٍ منشورة','hero.stat2':'لغات','hero.stat3':'دولة','hero.stat4':'قلوب مست',
    'hero.scroll':'اكتشف',
    'music.tag':'أغانينا','music.title':'ملحمة <em>النبي آدم</em>',
    'music.desc':'أولى أغاني نجوم صغيرة تحكي قصة آدم بـ4 لغات.',
    'upcoming.tag':'قريبًا','upcoming.title':'ملحمة الأنبياء تتواصل…',
    'shop.tag':'المتجر','shop.title':'عالم <em>نجوم صغيرة</em>',
    'shop.desc':'موسيقى وكتب مصوّرة وهدايا لمرافقة أطفالك في اكتشاف قصص الأنبياء.',
    'shop.new':'جديد','shop.soon':'طلب مسبق','shop.sale':'25%-','shop.add':'+ أضف للسلة','shop.preorder':'اطلب مسبقًا',
    'about.tag':'قصتنا','about.title':'نجوم صغيرة <em>لتنير</em> درب الأطفال',
    'about.text':'وُلدت نجوم صغيرة من حلم بسيط: أن نمنح أطفال المسلمين في كل العالم أناشيد تحتفي بقصص أنبياء الإسلام — بلغتهم الخاصة وبلحنهم الخاص.',
    'contact.tag':'تواصل','contact.title':'لديك مشروع؟ <em>لنتحدث</em>',
    'contact.desc':'تعاون، شراكة إعلامية، ترخيص مدرسي — نحن منفتحون على كل مغامرة جميلة.',
    'contact.reach':'تجدنا هنا','contact.reachDesc':'سواء كنت والدًا أو معلمًا أو صحفيًا أو شريكًا محتملًا، يسعدنا سماعك.',
    'form.name':'الاسم الأول','form.lastname':'اللقب','form.email':'البريد الإلكتروني','form.subject':'الموضوع','form.message':'رسالتك','form.send':'أرسل الرسالة ✉️',
    'form.success.title':'تم الإرسال!','form.success.desc':'سنرد خلال 48 ساعة. بارك الله فيكم',
    'cart.title':'سلتي','cart.empty':'سلتك فارغة','cart.emptyDesc':'أضف منتجات للبدء',
    'cart.total':'المجموع','cart.checkout':'إتمام الطلب →','cart.secure':'دفع آمن عبر',
    'footer.desc':'أناشيد لأطفال العالم. كل قصة، كل لحن، بذرة من النور.',
    'footer.nav':'التنقل','footer.legal':'قانوني','footer.rights':'جميع الحقوق محفوظة',
    'footer.privacy':'سياسة الخصوصية','footer.terms':'الشروط والأحكام',
    'footer.cookies':'إعدادات الكوكيز','footer.mentions':'إشعار قانوني',
    'pillar1.title':'متعدد اللغات','pillar1.desc':'كل نبي يُغنّى بـ4 لغات+ للوصول لكل طفل',
    'pillar2.title':'تعليمي','pillar2.desc':'قصص أصيلة من القرآن الكريم والسنة النبوية',
    'pillar3.title':'موسيقي','pillar3.desc':'ألحان عصرية وجذابة يحبها الأطفال',
    'pillar4.title':'بحب','pillar4.desc':'صُنع من آباء لآباء، من القلب',
    'prod1.name':'باقة رقمية — آدم x 4 لغات','prod1.desc':'حمّل الأغاني الأربع بجودة عالية.',
    'prod2.name':'كتاب مصوّر — آدم، أول إنسان','prod2.desc':'كتاب أطفال مصوّر باللغتين العربية والفرنسية.',
    'prod4.name':'ملصق مصوّر — الأنبياء','prod4.desc':'ملصق A3 يصوّر الجدول الزمني لـ25 نبيًا.',
    'prod5.name':'باقة العائلة — الكل في واحد','prod5.desc':'الباقة الكاملة: أغاني + كتاب + ملصق.',
    'prod6.name':'كراسة أنشطة — الأنبياء','prod6.desc':'50 نشاطًا تعليميًا حول قصص الأنبياء.',
  }
};

function setLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  const tr = i18n[lang] || i18n.fr;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) el.innerHTML = tr[key];
  });
}
window.setLang = setLang;
