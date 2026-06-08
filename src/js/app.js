(function () {
  'use strict';

  const cfg = window.WHATSAPP_CONFIG || { phone: '2348164230088', display: '+234 816 423 0088' };
  const PHONE_NUMBER = String(cfg.phone).replace(/\D/g, '');

  function makeWaLink(text) {
    return 'https://wa.me/' + PHONE_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function applyPhoneToPage() {
    const display = cfg.display || ('+' + PHONE_NUMBER);
    const tel = 'tel:+' + PHONE_NUMBER;
    document.querySelectorAll('[data-phone-display]').forEach(function (el) {
      el.textContent = display;
    });
    document.querySelectorAll('[data-phone-tel]').forEach(function (el) {
      el.href = tel;
    });
  }

  function wireWhatsApp(el, message) {
    if (!el) return;
    el.href = makeWaLink(message);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }

  const IMG = 'assets/images/';

  const products = [
    { name: 'Chicken Shawarma', price: '₦2,500', image: IMG + 'chicken-shawarma.jpg', fallback: IMG + 'chicken-shawarma.svg', avatar: IMG + 'avatars/person1.jpg' },
    { name: 'Sneakers', price: '₦18,000', image: IMG + 'sneakers.jpg', fallback: IMG + 'sneakers.svg', avatar: IMG + 'avatars/person2.jpg' },
    { name: 'Hoodie', price: '₦15,000', image: IMG + 'hoodie.jpg', fallback: IMG + 'hoodie.svg', avatar: IMG + 'avatars/person3.jpg' },
    { name: 'Wristwatch', price: '₦7,500', image: IMG + 'wristwatch.jpg', fallback: IMG + 'wristwatch.svg', avatar: IMG + 'avatars/person4.jpg' },
    { name: 'Phone Case', price: '₦3,000', image: IMG + 'phone-case.jpg', fallback: IMG + 'phone-case.svg', avatar: IMG + 'avatars/person5.jpg' },
    { name: 'Bag', price: '₦12,000', image: IMG + 'bag.jpg', fallback: IMG + 'bag.svg', avatar: IMG + 'avatars/person6.jpg' },
    { name: 'Perfume', price: '₦10,000', image: IMG + 'perfume.jpg', fallback: IMG + 'perfume.svg', avatar: IMG + 'avatars/person7.jpg' },
    { name: 'Cap', price: '₦5,000', image: IMG + 'cap.jpg', fallback: IMG + 'cap.svg', avatar: IMG + 'avatars/person8.jpg' }
  ];

  const heroPreviewItems = [
    {
      label: 'New WhatsApp order',
      title: 'Chicken Shawarma · ₦2,500',
      status: 'Received',
      image: IMG + 'chicken-shawarma.jpg',
      fallback: IMG + 'chicken-shawarma.svg'
    },
    {
      label: 'New WhatsApp order',
      title: 'Sneakers · ₦18,000',
      status: 'Confirmed',
      image: IMG + 'sneakers.jpg',
      fallback: IMG + 'sneakers.svg'
    },
    {
      label: 'New WhatsApp order',
      title: 'Perfume · ₦10,000',
      status: 'Preparing',
      image: IMG + 'perfume.jpg',
      fallback: IMG + 'perfume.svg'
    }
  ];

  function setImageWithFallback(img, src, fallback) {
    if (!img) return;
    img.classList.remove('img-loaded');
    img.style.backgroundColor = '#0f172a';

    function showSrc(url) {
      img.src = url;
      img.classList.add('img-loaded');
    }

    const loader = new Image();
    loader.onload = function () {
      showSrc(src);
    };
    loader.onerror = function () {
      if (fallback && fallback !== src) {
        showSrc(fallback);
      } else {
        img.classList.add('img-loaded');
      }
    };
    loader.src = src;

    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('img-loaded');
    }
  }

  /* Floating message helper: shows small WhatsApp-style text bubbles under the hero preview */
  var _lastFloating = 0;
  /**
   * spawnFloatingMessages(texts, options)
   * - texts: array of string or { text, avatar, reply }
   * - options: { force: boolean, reply: string }
   */
  function spawnFloatingMessages(texts, options) {
    try {
      var now = Date.now();
      options = options || {};
      // throttle spawns to avoid clutter (900ms), unless forced
      if (!options.force && (now - _lastFloating < 900)) return;
      _lastFloating = now;

      var container = document.getElementById('hero-floating');
      if (!container || !texts || !texts.length) return;

      // clear any existing messages so new preview shows fresh content
      container.innerHTML = '';

      // limit to max 2 short bubbles for a tidy appearance
      texts.slice(0, 2).forEach(function (raw, i) {
        var item = typeof raw === 'string' ? { text: raw } : raw || {};
        var incomingText = String(item.text || '').slice(0, 120);
        var avatarSrc = item.avatar || null;
        var sellerReply = item.reply || options.reply || null;
        var initials = (incomingText.match(/\b(\w)/g) || []).slice(0,2).join('').toUpperCase();

        // auto-pick reply when not explicitly provided
        if (!sellerReply) {
          var lower = incomingText.toLowerCase();
          if (lower.indexOf('stock') !== -1 || lower.indexOf('in stock') !== -1) {
            sellerReply = item.price ? ('Yes — available now. Price is ' + item.price + '. Want to reserve?') : 'Yes — available now. Want to reserve?';
          } else if (lower.indexOf('price') !== -1 || lower.indexOf('how much') !== -1) {
            sellerReply = item.price ? ('It\'s ' + item.price + ' — ready to ship.') : 'I\'ll confirm the price and get back to you now.';
          } else {
            sellerReply = 'Thanks — we got your order request.';
          }
        }

        // incoming (customer)
        var rowIn = document.createElement('div');
        rowIn.className = 'msg-row incoming floating-message';

        var avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        if (avatarSrc) {
          var aimg = document.createElement('img');
          aimg.src = avatarSrc;
          aimg.alt = 'avatar';
          aimg.loading = 'lazy';
          aimg.style.width = '100%';
          aimg.style.height = '100%';
          aimg.style.objectFit = 'cover';
          // if image fails to load, fall back to initials
          aimg.onerror = function () {
            try {
              if (aimg && aimg.parentNode) aimg.parentNode.removeChild(aimg);
            } catch (e) {}
            avatar.textContent = initials || 'C';
          };
          avatar.appendChild(aimg);
        } else {
          avatar.textContent = initials || 'C';
        }

        var bubbleIn = document.createElement('div');
        bubbleIn.className = 'msg-bubble incoming';
        var metaIn = document.createElement('div');
        metaIn.className = 'msg-meta';
        var nowDate = new Date();
        metaIn.textContent = 'Customer · ' + nowDate.getHours() + ':' + String(nowDate.getMinutes()).padStart(2, '0');
        var textIn = document.createElement('div');
        textIn.className = 'msg-text';
        textIn.textContent = incomingText;
        bubbleIn.appendChild(metaIn);
        bubbleIn.appendChild(textIn);

        rowIn.appendChild(avatar);
        rowIn.appendChild(bubbleIn);
        // small stagger so messages don't all appear at once
        rowIn.style.animationDelay = (150 + i * 120) + 'ms';
        container.appendChild(rowIn);

        // outgoing (seller) confirm message after a short delay
        (function (delay, replyText, idx) {
          setTimeout(function () {
            var rowOut = document.createElement('div');
            rowOut.className = 'msg-row outgoing floating-message';

            var bubbleOut = document.createElement('div');
            bubbleOut.className = 'msg-bubble outgoing';
            var metaOut = document.createElement('div');
            metaOut.className = 'msg-meta outgoing';
            var now2 = new Date();
            metaOut.textContent = 'You · ' + now2.getHours() + ':' + String(now2.getMinutes()).padStart(2, '0');
            var check = document.createElement('span');
            check.className = 'msg-check';
            check.textContent = '✓';
            metaOut.appendChild(check);

            var textOut = document.createElement('div');
            textOut.className = 'msg-text';
            textOut.textContent = replyText;
            bubbleOut.appendChild(metaOut);
            bubbleOut.appendChild(textOut);

            rowOut.appendChild(bubbleOut);
            rowOut.style.animationDelay = (idx * 120 + 420) + 'ms';
            container.appendChild(rowOut);

            // remove outgoing after animation
            rowOut.addEventListener('animationend', function () {
              if (rowOut && rowOut.parentNode) rowOut.parentNode.removeChild(rowOut);
            });
          }, delay);
        })(600 + i * 260, sellerReply, i);

        // remove incoming after animation
        rowIn.addEventListener('animationend', function () {
          if (rowIn && rowIn.parentNode) rowIn.parentNode.removeChild(rowIn);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  document.getElementById('year').textContent = String(new Date().getFullYear());
  applyPhoneToPage();

  wireWhatsApp(document.getElementById('primary-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront like this demo.');
  wireWhatsApp(document.getElementById('header-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront.');
  wireWhatsApp(document.getElementById('mobile-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront.');
  wireWhatsApp(document.getElementById('final-cta'), 'Hello, I want a website like this demo for my business. Please share next steps.');
  wireWhatsApp(document.getElementById('footer-whatsapp'), 'Hello, I want a WhatsApp storefront for my business.');
  wireWhatsApp(document.getElementById('floating-wa'), 'Hello, I have a question about the WhatsApp storefront demo.');
  // wire pricing CTAs
  wireWhatsApp(document.getElementById('choose-starter'), 'I\'d like the Starter plan. Please share next steps.');
  wireWhatsApp(document.getElementById('select-business'), 'I\'d like the Business plan. Please share next steps.');
  wireWhatsApp(document.getElementById('talk-sales'), 'Hi — I want to talk to sales about a custom storefront.');

  const grid = document.getElementById('product-grid');
  const tpl = document.getElementById('product-template');

  if (grid && tpl) {
    products.forEach(function (p) {
      const node = tpl.content.cloneNode(true);
      node.querySelector('.product-name').textContent = p.name;
      node.querySelector('.product-price').textContent = p.price;
      const img = node.querySelector('.product-img');
      img.alt = p.name;
      setImageWithFallback(img, p.image, p.fallback || IMG + 'product-fallback.svg');
      const btn = node.querySelector('.order-btn');
      btn.href = makeWaLink('I want to order ' + p.name + ' (' + p.price + ')');
      btn.setAttribute('aria-label', 'Order ' + p.name + ' on WhatsApp');
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
      // spawn a single floating message on click to show demand before opening WhatsApp
      btn.addEventListener('click', function () {
        try {
          spawnFloatingMessages([
            { text: 'Interested — ' + p.name, avatar: p.avatar || p.image, reply: 'I\u2019ll confirm your order shortly.' }
          ], { force: true, reply: 'I\u2019ll confirm your order shortly.' });
        } catch (e) {}
      });
      grid.appendChild(node);
    });
  }

  const heroOrderLabel = document.getElementById('hero-order-label');
  const heroOrderTitle = document.getElementById('hero-order-title');
  const heroOrderStatus = document.getElementById('hero-order-status');
  const heroPreviewImage = document.getElementById('hero-preview-image');
  let heroPreviewIndex = 0;

  function updateHeroPreview(index) {
    const item = heroPreviewItems[index];
    if (!item) return;
    if (heroOrderLabel) heroOrderLabel.textContent = item.label;
    if (heroOrderTitle) heroOrderTitle.textContent = item.title;
    if (heroOrderStatus) heroOrderStatus.textContent = item.status;
    if (heroPreviewImage) {
      setImageWithFallback(heroPreviewImage, item.image, item.fallback || IMG + 'product-fallback.svg');
      heroPreviewImage.alt = item.title;
    }
    // show a few floating demand messages related to the current preview
    var baseName = (item.title || '').split('·')[0].trim();
    // try to find product price/avatar by matching products list
    var found = products.find(function (p) {
      return p.name && baseName && p.name.toLowerCase().indexOf(baseName.toLowerCase()) !== -1;
    }) || {};
    var msgs = [
      { text: 'Is ' + baseName + ' in stock?', avatar: found.avatar || item.avatar || item.image, price: found.price },
      { text: 'Price for ' + baseName + '?', avatar: found.avatar || item.avatar || item.image, price: found.price }
    ];
    spawnFloatingMessages(msgs, { force: true });
  }

  if (heroPreviewItems.length) {
    updateHeroPreview(heroPreviewIndex);
    setInterval(function () {
      heroPreviewIndex = (heroPreviewIndex + 1) % heroPreviewItems.length;
      updateHeroPreview(heroPreviewIndex);
    }, 4500);
  }

  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('show');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const open = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', open);
      if (mobileOverlay) mobileOverlay.classList.toggle('show', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }
  }

  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.site-header .nav-link, #mobile-menu .nav-link');
  const scrollSections = document.querySelectorAll('main section[id]');

  function updateActiveLink() {
    var activeId = '';
    scrollSections.forEach(function (section) {
      if (window.scrollY + 140 >= section.offsetTop) {
        activeId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
    });
  }

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });
  updateActiveLink();

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('show');
    });
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('open');
        const otherPanel = other.querySelector('.faq-panel');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherPanel) otherPanel.style.maxHeight = '0';
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = '0';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
