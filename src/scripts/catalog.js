const tools = document.querySelector('[data-catalog-tools]');
const grid = document.querySelector('[data-product-grid]');

if (tools && grid) {
  const cards = Array.from(grid.querySelectorAll('[data-product-card]'));
  const search = tools.querySelector('[data-catalog-search]');
  const category = tools.querySelector('[data-catalog-category]');
  const sort = tools.querySelector('[data-catalog-sort]');
  const count = tools.querySelector('[data-catalog-count]');
  const noResults = document.querySelector('[data-catalog-empty]');
  const pageSize = 12;
  let visibleLimit = pageSize;
  let showMore = document.querySelector('[data-show-more]');

  if (!showMore && cards.length > pageSize) {
    showMore = document.createElement('button');
    showMore.type = 'button';
    showMore.className = 'button button-secondary show-more-button';
    showMore.textContent = 'Show more patterns';
    showMore.setAttribute('data-show-more', '');
    grid.after(showMore);
  }

  const update = () => {
    const query = (search.value || '').trim().toLowerCase();
    const chosenCategory = category.value;
    const matching = cards.filter((card) => {
      const matchesQuery = !query || card.dataset.name.includes(query);
      const matchesCategory = !chosenCategory || card.dataset.category === chosenCategory;
      return matchesQuery && matchesCategory;
    });

    const mode = sort.value;
    matching.sort((a, b) => {
      if (mode === 'price-low') return Number(a.dataset.price) - Number(b.dataset.price);
      if (mode === 'price-high') return Number(b.dataset.price) - Number(a.dataset.price);
      if (mode === 'newest') return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      return Number(b.dataset.featured === 'true') - Number(a.dataset.featured === 'true');
    });

    cards.forEach((card) => {
      card.hidden = true;
      grid.append(card);
    });

    matching.forEach((card, index) => {
      card.hidden = index >= visibleLimit;
      grid.append(card);
    });

    count.textContent = matching.length + (matching.length === 1 ? ' pattern' : ' patterns');
    if (noResults) noResults.hidden = matching.length > 0;
    if (showMore) {
      showMore.hidden = matching.length <= visibleLimit;
    }
  };

  [search, category, sort].forEach((control) => control.addEventListener('input', () => {
    visibleLimit = pageSize;
    update();
  }));
  if (showMore) {
    showMore.addEventListener('click', () => {
      visibleLimit += pageSize;
      update();
    });
  }
  update();
}