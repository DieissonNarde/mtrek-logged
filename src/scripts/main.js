
  document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.menu__list__item__link');

    function showSection(targetId) {
      document.querySelectorAll('.route').forEach(function(section) {
        section.classList.add('hidden');
      });
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }
    }

    // Lida com hash na URL
    const hash = window.location.hash.substring(1);
    if (hash) {
      showSection(hash);
    }

    menuLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = link.getAttribute('data-target');
        showSection(targetId);
        // Atualiza a URL com hash
        window.location.hash = targetId;
      });
    });
  });
