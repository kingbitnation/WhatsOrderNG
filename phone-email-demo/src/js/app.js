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
    { name: 'Chicken Shawarma', price: '₦2,500', image: IMG + 'chicken-shawarma.jpg', fallback: IMG + 'chicken-shawarma.svg' },
    { name: 'Sneakers', price: '₦18,000', image: IMG + 'sneakers.jpg', fallback: IMG + 'sneakers.svg' },
    { name: 'Hoodie', price: '₦15,000', image: IMG + 'hoodie.jpg', fallback: IMG + 'hoodie.svg' },
    { name: 'Wristwatch', price: '₦7,500', image: IMG + 'wristwatch.jpg', fallback: IMG + 'wristwatch.svg' },
    { name: 'Phone Case', price: '₦3,000', image: IMG + 'phone-case.jpg', fallback: IMG + 'phone-case.svg' },
    { name: 'Bag', price: '₦12,000', image: IMG + 'bag.jpg', fallback: IMG + 'bag.svg' },
    { name: 'Perfume', price: '₦10,000', image: IMG + 'perfume.jpg', fallback: IMG + 'perfume.svg' },
    { name: 'Cap', price: '₦5,000', image: IMG + 'cap.jpg', fallback: IMG + 'cap.svg' }
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

  document.getElementById('year').textContent = String(new Date().getFullYear());
  applyPhoneToPage();

  wireWhatsApp(document.getElementById('primary-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront like this demo.');
  wireWhatsApp(document.getElementById('header-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront.');
  wireWhatsApp(document.getElementById('mobile-whatsapp'), 'Hi, I want to start selling with a WhatsApp storefront.');
  wireWhatsApp(document.getElementById('final-cta'), 'Hello, I want a website like this demo for my business. Please share next steps.');
  wireWhatsApp(document.getElementById('footer-whatsapp'), 'Hello, I want a WhatsApp storefront for my business.');
  wireWhatsApp(document.getElementById('floating-wa'), 'Hello, I have a question about the WhatsApp storefront demo.');

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
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
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
