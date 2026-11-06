(() => {
  const pages = [
    { id: 'privacy', label: 'Privacy Policy', path: 'privacy/', aliases: ['privacy', 'privacy policy', 'privacy-policy'] },
    { id: 'contributors', label: 'Contributors', path: 'contributors/', aliases: ['contributors', 'contributor'] },
    { id: 'terms', label: 'Terms of Service', path: 'terms/', aliases: ['terms', 'term', 'tos', 'terms of service', 'terms and conditions'] },
    { id: 'cookies', label: 'Cookie Policy', path: 'cookies/', aliases: ['cookie', 'cookies', 'cookie policy', 'cookie-policy'] },
    { id: 'disclaimer', label: 'Disclaimer', path: 'disclaimer/', aliases: ['disclaimer', 'disclaimers'] },
    { id: 'acceptable-use', label: 'Acceptable Use', path: 'acceptable-use/', aliases: ['acceptable use', 'acceptable-use', 'acceptable', 'use policy'] },
    { id: 'copyright', label: 'Copyright Notice', path: 'copyright/', aliases: ['copyright', 'copyright notice', 'copyright-notice'] },
    { id: 'license', label: 'MIT License', path: 'license/', aliases: ['license', 'licence', 'mit', 'mit license', 'mit-license'] },
    { id: 'security', label: 'Security Policy', path: 'security/', aliases: ['security', 'security policy', 'security-policy'] },
    { id: 'legal', label: 'Legal Index', path: 'legal/', aliases: ['legal', 'legal index', 'legal-index', 'policies'] },
    { id: 'security-txt', label: 'security.txt', path: '.well-known/security.txt', aliases: ['security.txt', 'security txt', 'securitytxt'] }
  ];

  function normalize(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function editDistance(left, right) {
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
      let diagonal = row[0];
      row[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const above = row[j];
        row[j] = Math.min(
          row[j] + 1,
          row[j - 1] + 1,
          diagonal + (left[i - 1] === right[j - 1] ? 0 : 1)
        );
        diagonal = above;
      }
    }
    return row[right.length];
  }

  function resolve(query) {
    const needle = normalize(query);
    if (!needle) return null;

    for (const page of pages) {
      if (page.aliases.some((alias) => normalize(alias) === needle)) return { ...page };
    }

    let best = null;
    let bestDistance = Infinity;
    let tied = false;
    for (const page of pages) {
      for (const alias of page.aliases) {
        const candidate = normalize(alias);
        if (candidate.length < 5) continue;
        const threshold = Math.max(1, Math.floor(candidate.length * 0.2));
        if (Math.abs(candidate.length - needle.length) > threshold) continue;
        const distance = editDistance(needle, candidate);
        if (distance > threshold) continue;
        if (distance < bestDistance) {
          best = page;
          bestDistance = distance;
          tied = false;
        } else if (distance === bestDistance && best && best.id !== page.id) {
          tied = true;
        }
      }
    }
    return best && !tied ? { ...best } : null;
  }

  function open(pageId) {
    const page = pages.find((entry) => entry.id === pageId);
    if (!page) return false;
    const base = new URL('./', document.baseURI);
    const destination = new URL(page.path, base);
    const opened = window.open(destination.href, '_blank');
    if (opened) opened.opener = null;
    return Boolean(opened);
  }

  window.PhantomPublicPages = Object.freeze({
    list: () => pages.map(({ id, label, path }) => ({ id, label, path })),
    resolve,
    open
  });
})();
