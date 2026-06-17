/* ===================================================================
   Pawsopedia — Main JavaScript
   Handles: hamburger menu, scroll-to-top, search/filter, comparison,
            loading animations, and smooth scrolling.
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------
     1. Mobile Hamburger Menu
     ----------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* -----------------------------------------------------------------
     2. Navbar Shadow on Scroll
     ----------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* -----------------------------------------------------------------
     3. Scroll-to-Top Button
     ----------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------------------------
     4. Breed Card Search (Dogs / Cats pages)
     ----------------------------------------------------------------- */
  const searchInput = document.getElementById('searchInput');
  const breedGrid   = document.getElementById('breedGrid');
  const noResults   = document.getElementById('noResults');

  if (searchInput && breedGrid) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const cards = breedGrid.querySelectorAll('.breed-card');
      let visible = 0;

      cards.forEach(card => {
        const name = (card.dataset.name || card.querySelector('h3').textContent).toLowerCase();
        const match = name.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      if (noResults) {
        noResults.classList.toggle('show', visible === 0);
      }
    });
  }

  /* -----------------------------------------------------------------
     5. Comparison Page — Table Filter (search + category buttons)
     ----------------------------------------------------------------- */
  const comparisonSearch = document.getElementById('comparisonSearch');
  const comparisonTable  = document.getElementById('comparisonTable');
  const filterBtns       = document.querySelectorAll('.filter-btn[data-filter]');

  let activeFilter = 'all';

  function filterTable() {
    if (!comparisonTable) return;
    const query = (comparisonSearch ? comparisonSearch.value : '').toLowerCase().trim();
    const rows  = comparisonTable.querySelectorAll('tbody tr');
    let visible = 0;

    rows.forEach(row => {
      const name = (row.dataset.name || '').toLowerCase();
      const type = (row.dataset.type || '').toLowerCase();

      const matchName = name.includes(query);
      const matchType = activeFilter === 'all' || type === activeFilter;

      const show = matchName && matchType;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const noRes = document.getElementById('noResults');
    if (noRes) {
      noRes.classList.toggle('show', visible === 0);
    }
  }

  if (comparisonSearch) {
    comparisonSearch.addEventListener('input', filterTable);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      filterTable();
    });
  });

  /* -----------------------------------------------------------------
     6. Comparison Page — Side-by-Side Breed Comparison
     ----------------------------------------------------------------- */
  const breedA = document.getElementById('breedA');
  const breedB = document.getElementById('breedB');
  const comparisonResult = document.getElementById('comparisonResult');

  // Breed data used by the comparison dropdowns
  const breedData = {
    // Dogs
    'labrador':        { name: 'Labrador Retriever',   type: 'Dog', size: 'Large',  energy: 'High',      friendliness: 'Very High', grooming: 'Moderate',  lifespan: '10-12 yrs' },
    'golden':          { name: 'Golden Retriever',     type: 'Dog', size: 'Large',  energy: 'High',      friendliness: 'Very High', grooming: 'High',      lifespan: '10-12 yrs' },
    'german-shepherd': { name: 'German Shepherd',      type: 'Dog', size: 'Large',  energy: 'High',      friendliness: 'High',      grooming: 'Moderate',  lifespan: '9-13 yrs'  },
    'beagle':          { name: 'Beagle',               type: 'Dog', size: 'Medium', energy: 'High',      friendliness: 'Very High', grooming: 'Low',       lifespan: '10-15 yrs' },
    'husky':           { name: 'Siberian Husky',       type: 'Dog', size: 'Medium', energy: 'Very High', friendliness: 'High',      grooming: 'High',      lifespan: '12-14 yrs' },
    'poodle':          { name: 'Poodle',               type: 'Dog', size: 'Varies', energy: 'High',      friendliness: 'High',      grooming: 'High',      lifespan: '12-15 yrs' },
    'rottweiler':      { name: 'Rottweiler',           type: 'Dog', size: 'Large',  energy: 'Moderate',  friendliness: 'Moderate',  grooming: 'Low',       lifespan: '8-10 yrs'  },
    'doberman':        { name: 'Doberman',             type: 'Dog', size: 'Large',  energy: 'High',      friendliness: 'Moderate',  grooming: 'Low',       lifespan: '10-12 yrs' },
    'shih-tzu':        { name: 'Shih Tzu',             type: 'Dog', size: 'Small',  energy: 'Low',       friendliness: 'Very High', grooming: 'High',      lifespan: '10-16 yrs' },
    'border-collie':   { name: 'Border Collie',        type: 'Dog', size: 'Medium', energy: 'Very High', friendliness: 'High',      grooming: 'Moderate',  lifespan: '12-15 yrs' },
    'dalmatian':       { name: 'Dalmatian',            type: 'Dog', size: 'Large',  energy: 'Very High', friendliness: 'High',      grooming: 'Low',       lifespan: '11-13 yrs' },
    'corgi':           { name: 'Corgi',                type: 'Dog', size: 'Small',  energy: 'High',      friendliness: 'Very High', grooming: 'Moderate',  lifespan: '12-13 yrs' },
    // Cats
    'persian':          { name: 'Persian',              type: 'Cat', size: 'Medium', energy: 'Low',       friendliness: 'High',      grooming: 'Very High', lifespan: '12-17 yrs' },
    'maine-coon':       { name: 'Maine Coon',           type: 'Cat', size: 'Large',  energy: 'Moderate',  friendliness: 'Very High', grooming: 'High',      lifespan: '12-15 yrs' },
    'siamese':          { name: 'Siamese',              type: 'Cat', size: 'Medium', energy: 'High',      friendliness: 'Very High', grooming: 'Low',       lifespan: '15-20 yrs' },
    'bengal':           { name: 'Bengal',               type: 'Cat', size: 'Medium', energy: 'Very High', friendliness: 'High',      grooming: 'Low',       lifespan: '12-16 yrs' },
    'ragdoll':          { name: 'Ragdoll',              type: 'Cat', size: 'Large',  energy: 'Low',       friendliness: 'Very High', grooming: 'Moderate',  lifespan: '12-15 yrs' },
    'british-shorthair':{ name: 'British Shorthair',    type: 'Cat', size: 'Medium', energy: 'Low',       friendliness: 'High',      grooming: 'Moderate',  lifespan: '12-20 yrs' },
    'sphynx':           { name: 'Sphynx',              type: 'Cat', size: 'Medium', energy: 'High',      friendliness: 'Very High', grooming: 'Moderate',  lifespan: '8-14 yrs'  },
    'russian-blue':     { name: 'Russian Blue',         type: 'Cat', size: 'Medium', energy: 'Moderate',  friendliness: 'Moderate',  grooming: 'Low',       lifespan: '15-20 yrs' },
    'scottish-fold':    { name: 'Scottish Fold',        type: 'Cat', size: 'Medium', energy: 'Moderate',  friendliness: 'High',      grooming: 'Moderate',  lifespan: '11-14 yrs' },
    'birman':           { name: 'Birman',               type: 'Cat', size: 'Medium', energy: 'Moderate',  friendliness: 'Very High', grooming: 'Moderate',  lifespan: '12-16 yrs' },
    'abyssinian':       { name: 'Abyssinian',           type: 'Cat', size: 'Medium', energy: 'Very High', friendliness: 'High',      grooming: 'Low',       lifespan: '9-15 yrs'  },
    'norwegian':        { name: 'Norwegian Forest Cat', type: 'Cat', size: 'Large',  energy: 'Moderate',  friendliness: 'High',      grooming: 'High',      lifespan: '12-16 yrs' }
  };

  function renderComparison() {
    if (!breedA || !breedB || !comparisonResult) return;

    const keyA = breedA.value;
    const keyB = breedB.value;

    if (!keyA || !keyB) {
      comparisonResult.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">Select two breeds above to compare them side by side.</p>';
      return;
    }

    if (keyA === keyB) {
      comparisonResult.innerHTML = '<p style="text-align:center; color: var(--color-text-muted);">Please select two different breeds to compare.</p>';
      return;
    }

    const a = breedData[keyA];
    const b = breedData[keyB];
    if (!a || !b) return;

    const attrs = ['size', 'energy', 'friendliness', 'grooming', 'lifespan'];
    const labels = { size: 'Size', energy: 'Energy Level', friendliness: 'Friendliness', grooming: 'Grooming Needs', lifespan: 'Lifespan' };

    let rows = attrs.map(attr => `
      <tr>
        <td style="font-weight:600;">${labels[attr]}</td>
        <td>${a[attr]}</td>
        <td>${b[attr]}</td>
      </tr>
    `).join('');

    comparisonResult.innerHTML = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>${a.name} <span style="font-weight:400; opacity:.7;">(${a.type})</span></th>
            <th>${b.name} <span style="font-weight:400; opacity:.7;">(${b.type})</span></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  if (breedA) breedA.addEventListener('change', renderComparison);
  if (breedB) breedB.addEventListener('change', renderComparison);

  /* -----------------------------------------------------------------
     7. Loading Animation — reveal cards with IntersectionObserver
     ----------------------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.breed-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });

});
