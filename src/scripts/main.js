
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


  /*Sidebar responsivo */
  document.addEventListener('DOMContentLoaded', function () {
  // Seleciona a imagem do menu responsivo e o botão de seta responsiva
  const menuResponsiveImg = document.querySelector('.menu_responsivo');
  const arrowHeaderResponsive = document.querySelector('.arrow_header_responsive');
  
  // Seleciona o header, o aside e a sobreposição
  const header = document.getElementById('header');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  // Função para alternar a visibilidade do header, sidebar e overlay
  function toggleVisibility() {
    header.classList.toggle('hidden');
    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('active');
  }

  // Adiciona eventos de clique para a imagem do menu responsivo
  if (menuResponsiveImg) {
    menuResponsiveImg.addEventListener('click', toggleVisibility);
  }

  // Adiciona eventos de clique para o botão de seta responsiva
  if (arrowHeaderResponsive) {
    arrowHeaderResponsive.addEventListener('click', function () {
      toggleVisibility();
      arrowHeaderResponsive.classList.toggle('active');
    });
  }

  // Adiciona um evento de clique para a sobreposição para fechar o menu quando clicado
  if (overlay) {
    overlay.addEventListener('click', function () {
      header.classList.add('hidden');
      sidebar.classList.add('hidden');
      overlay.classList.remove('active');
      arrowHeaderResponsive.classList.remove('active');
    });
  }
});

  