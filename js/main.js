// mkunit.sh - Main JavaScript

(function() {
  'use strict';

  // Mobile Navigation
  const initMobileNav = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when clicking a link
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileMenu.classList.remove('active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  };

  // Docs Sidebar Mobile Toggle
  const initDocsSidebar = () => {
    const sidebarToggle = document.getElementById('docs-sidebar-toggle');
    const sidebar = document.getElementById('docs-sidebar');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-active');
      });

      // Close sidebar when clicking a link on mobile
      sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 1024) {
            sidebar.classList.remove('mobile-active');
          }
        });
      });
    }
  };

  // Installation Tabs
  const initInstallTabs = () => {
    const tabs = document.querySelectorAll('.install-tab');
    const contents = document.querySelectorAll('.install-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update visible content
        contents.forEach(content => {
          content.classList.remove('active');
          if (content.getAttribute('data-content') === target) {
            content.classList.add('active');
          }
        });
      });
    });
  };

  // Copy to Clipboard
  const initCopyButtons = () => {
    document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', async () => {
        const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
        const text = codeBlock.textContent;

        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  };

  // Terminal Typing Animation
  const initTerminalAnimation = () => {
    const terminal = document.querySelector('.hero-terminal .terminal-body');
    if (!terminal || terminal.dataset.animated) return;

    terminal.dataset.animated = 'true';

    const lines = [
      { type: 'prompt', text: '$ ' },
      { type: 'command', text: 'mkunit service myapp --exec "./server" --restart on-failure --install', delay: 50 },
      { type: 'newline' },
      { type: 'output', text: 'Created myapp.service', delay: 20 },
      { type: 'newline' },
      { type: 'output', text: 'Installed to ~/.config/systemd/user/myapp.service', delay: 20 },
      { type: 'newline' },
      { type: 'output', text: 'Run: systemctl --user start myapp', delay: 20 }
    ];

    // Clear terminal and animate
    terminal.innerHTML = '';
    let lineIndex = 0;
    let charIndex = 0;
    let currentSpan = null;

    const typeNext = () => {
      if (lineIndex >= lines.length) return;

      const line = lines[lineIndex];

      if (line.type === 'newline') {
        terminal.appendChild(document.createElement('br'));
        lineIndex++;
        setTimeout(typeNext, 100);
        return;
      }

      if (!currentSpan) {
        currentSpan = document.createElement('span');
        currentSpan.className = `terminal-${line.type}`;
        terminal.appendChild(currentSpan);
      }

      if (charIndex < line.text.length) {
        currentSpan.textContent += line.text[charIndex];
        charIndex++;
        setTimeout(typeNext, line.delay || 30);
      } else {
        currentSpan = null;
        charIndex = 0;
        lineIndex++;
        setTimeout(typeNext, 200);
      }
    };

    // Start animation after a short delay
    setTimeout(typeNext, 500);
  };

  // Smooth scroll for anchor links
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // Add wrapper and copy button to code blocks
  const enhanceCodeBlocks = () => {
    document.querySelectorAll('pre[class*="language-"]').forEach(pre => {
      if (pre.closest('.code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-button';
      copyBtn.textContent = 'Copy';
      wrapper.appendChild(copyBtn);
    });

    // Re-init copy buttons
    initCopyButtons();
  };

  // Highlight current page in sidebar
  const highlightCurrentPage = () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.docs-sidebar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (currentPath.endsWith(href) || currentPath.endsWith(href.replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  };

  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initDocsSidebar();
    initInstallTabs();
    initSmoothScroll();
    highlightCurrentPage();

    // Run these after Prism has highlighted
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }

    setTimeout(() => {
      enhanceCodeBlocks();
      initTerminalAnimation();
    }, 100);
  });
})();
