document.addEventListener('DOMContentLoaded', () => {
  const tabFiguresBtn = document.getElementById('tabFiguresBtn');
  const tabAliensBtn = document.getElementById('tabAliensBtn');
  const tabFiguresContent = document.getElementById('tabFiguresContent');
  const tabAliensContent = document.getElementById('tabAliensContent');

  if (tabFiguresBtn && tabAliensBtn) {
    const selectFiguresTab = () => {
      tabFiguresBtn.style.color = 'var(--green-primary)';
      tabFiguresBtn.style.borderBottomColor = 'var(--green-primary)';
      tabFiguresBtn.style.textShadow = '0 0 8px var(--green-glow)';
      tabFiguresBtn.style.fontWeight = 'bold';
      
      tabAliensBtn.style.color = 'var(--text-muted)';
      tabAliensBtn.style.borderBottomColor = 'transparent';
      tabAliensBtn.style.textShadow = 'none';
      tabAliensBtn.style.fontWeight = 'normal';

      tabFiguresContent.style.display = 'block';
      tabAliensContent.style.display = 'none';
    };

    const selectAliensTab = () => {
      tabAliensBtn.style.color = 'var(--green-primary)';
      tabAliensBtn.style.borderBottomColor = 'var(--green-primary)';
      tabAliensBtn.style.textShadow = '0 0 8px var(--green-glow)';
      tabAliensBtn.style.fontWeight = 'bold';

      tabFiguresBtn.style.color = 'var(--text-muted)';
      tabFiguresBtn.style.borderBottomColor = 'transparent';
      tabFiguresBtn.style.textShadow = 'none';
      tabFiguresBtn.style.fontWeight = 'normal';

      tabFiguresContent.style.display = 'none';
      tabAliensContent.style.display = 'flex';
    };

    tabFiguresBtn.addEventListener('click', selectFiguresTab);
    tabAliensBtn.addEventListener('click', selectAliensTab);

    // Sub-tabs filters logic
    const filterBtns = document.querySelectorAll('.sub-tab-filter');
    const alienRows = document.querySelectorAll('.alien-row');

    const applyFilter = (serie) => {
      alienRows.forEach(row => {
        if (row.getAttribute('data-serie') === serie) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });

      filterBtns.forEach(b => {
        const bFilter = b.getAttribute('data-filter');
        if (bFilter === serie) {
          b.classList.add('active');
          if (bFilter === 'Ben 10') {
            b.style.background = 'rgba(0, 255, 65, 0.08)';
            b.style.borderColor = 'var(--green-primary)';
            b.style.textShadow = '0 0 5px var(--green-glow)';
          } else if (bFilter === 'Ben 10 Alien Force') {
            b.style.background = 'rgba(0, 162, 255, 0.08)';
            b.style.borderColor = '#00ccff';
            b.style.textShadow = '0 0 5px #00ccff';
          } else if (bFilter === 'Ben 10 Omniverse') {
            b.style.background = 'rgba(216, 128, 255, 0.08)';
            b.style.borderColor = '#d880ff';
            b.style.textShadow = '0 0 5px #d880ff';
          } else if (bFilter === 'Villanos') {
            b.style.background = 'rgba(255, 51, 51, 0.08)';
            b.style.borderColor = '#ff3333';
            b.style.textShadow = '0 0 5px #ff3333';
          } else if (bFilter === 'Personajes') {
            b.style.background = 'rgba(255, 204, 0, 0.08)';
            b.style.borderColor = '#ffcc00';
            b.style.textShadow = '0 0 5px #ffcc00';
          }
        } else {
          b.classList.remove('active');
          b.style.background = 'none';
          b.style.textShadow = 'none';
          if (bFilter === 'Ben 10') {
            b.style.borderColor = 'rgba(0, 255, 65, 0.3)';
          } else if (bFilter === 'Ben 10 Alien Force') {
            b.style.borderColor = 'rgba(0, 162, 255, 0.3)';
          } else if (bFilter === 'Ben 10 Omniverse') {
            b.style.borderColor = 'rgba(216, 128, 255, 0.3)';
          } else if (bFilter === 'Villanos') {
            b.style.borderColor = 'rgba(255, 51, 51, 0.3)';
          } else if (bFilter === 'Personajes') {
            b.style.borderColor = 'rgba(255, 204, 0, 0.3)';
          }
        }
      });
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');
        applyFilter(filterVal);
      });
    });

    // Check query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get('tab');
    const activeSerie = urlParams.get('serie') || 'Ben 10';

    applyFilter(activeSerie);

    if (activeTab === 'aliens') {
      selectAliensTab();
    } else {
      selectFiguresTab();
    }
  }
});
