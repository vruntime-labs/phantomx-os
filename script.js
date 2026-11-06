document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('command-input');
  const form = document.getElementById('terminal-form');
  const body = document.getElementById('terminal-body');
  const clock = document.getElementById('taskbar-clock');
  const kernel = window.PhantomKernel;
  const publicPages = window.PhantomPublicPages;

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  // Deliberately in-memory example filesystem; it is not host-file access or persistent storage.
  const fileSystem = new Map([
    ['/', { type: 'dir' }],
    ['/home', { type: 'dir' }],
    ['/sys', { type: 'dir' }],
    ['/logs', { type: 'dir' }],
    ['/home/user_notes.txt', { type: 'file', content: 'Welcome to PhantomX OS.\nThis is an in-memory example file.' }],
    ['/home/project_info.md', { type: 'file', content: '# PhantomX OS\nA browser-first desktop and cyberdeck simulation.' }],
    ['/sys/kernel.conf', { type: 'file', content: 'edition=browser\nmode=simulation\nversion=2.3.1' }],
    ['/sys/network.cfg', { type: 'file', content: 'network=simulated\nexternal_access=disabled' }],
    ['/logs/auth.log', { type: 'file', content: '[system] No authentication service is configured.' }],
    ['/logs/trace.log', { type: 'file', content: '[system] Simulation trace initialized.' }]
  ]);

  let currentPath = '/';

  function normalizePath(path) {
    const source = path === '~' ? '/home' : path.startsWith('~/') ? '/home/' + path.slice(2) : path;
    const parts = (source.startsWith('/') ? source : currentPath + '/' + source).split('/');
    const resolved = [];
    for (const part of parts) {
      if (!part || part === '.') continue;
      if (part === '..') resolved.pop();
      else resolved.push(part);
    }
    return '/' + resolved.join('/');
  }

  function tokenize(source) {
    const tokens = [];
    const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      tokens.push(match[1] ?? match[2] ?? match[3]);
    }
    return tokens;
  }

  function appendLine(text, className = '') {
    const line = document.createElement('p');
    if (className) line.className = className;
    line.textContent = String(text);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function appendPrompt(rawInput) {
    const line = document.createElement('p');
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'user@phantomx:' + currentPath + '$ ';
    line.append(prompt, document.createTextNode(rawInput));
    body.appendChild(line);
  }

  function childrenOf(path) {
    const prefix = path === '/' ? '/' : path + '/';
    return [...fileSystem.keys()]
      .filter((entry) => entry !== path && entry.startsWith(prefix) && !entry.slice(prefix.length).includes('/'))
      .sort((a, b) => a.localeCompare(b));
  }

  function displayName(path) {
    const node = fileSystem.get(path);
    const name = path.split('/').pop() || '/';
    return node?.type === 'dir' ? name + '/' : name;
  }

  function runCommand(rawInput) {
    const tokens = tokenize(rawInput);
    if (!tokens.length) return;
    const command = tokens.shift().toLowerCase();
    const args = tokens;

    // Public documentation commands are allowlisted and typo-tolerant.
    const pageQuery = command === 'open' ? args.join(' ') : [command, ...args].join(' ');
    const publicPage = publicPages?.resolve(pageQuery);
    if (publicPage) {
      const didOpen = publicPages.open(publicPage.id);
      appendLine(didOpen
        ? 'Opening ' + publicPage.label + ' in a new tab...'
        : 'The browser blocked the new tab. Allow pop-ups for this site and try again.',
        didOpen ? '' : 'terminal-error');
      return;
    }

    switch (command) {
      case 'help':
        appendLine([
          'Available commands:',
          '  help                 Show this help',
          '  about                Show system information',
          '  open <page>          Open a public PhantomX page',
          '  privacy / prvacy     Open the Privacy Policy (typos supported)',
          '  terms, cookies, legal, security, license, etc.',
          '  pwd                  Print the current directory',
          '  ls [path]            List directory contents',
          '  cd [path]            Change directory',
          '  cat <file>           Print a file',
          '  mkdir <directory>   Create a directory',
          '  touch <file>         Create an empty file',
          '  echo <text>          Print text',
          '  echo <text> > <file> Write text to an in-memory file',
          '  ps                   List browser-window processes',
          '  clear                Clear terminal output',
          '',
          'The virtual filesystem is temporary and resets when this page is reloaded.'
        ].join('\n'));
        break;
      case 'about':
        appendLine('PhantomX OS v2.3.1 — browser desktop and cyberdeck simulation. No host shell or native OS access.');
        break;
      case 'open':
        appendLine('Usage: open <page> (try privacy, contributors, terms, cookies, disclaimer, security, or legal)', 'terminal-error');
        break;
      case 'pwd':
        appendLine(currentPath);
        break;
      case 'ls': {
        const target = normalizePath(args[0] || '.');
        const node = fileSystem.get(target);
        if (!node) return appendLine('ls: no such path: ' + target, 'terminal-error');
        if (node.type === 'file') return appendLine(displayName(target));
        const entries = childrenOf(target).map(displayName);
        appendLine(entries.length ? entries.join('    ') : '(empty directory)');
        break;
      }
      case 'cd': {
        const target = normalizePath(args[0] || '/home');
        const node = fileSystem.get(target);
        if (!node || node.type !== 'dir') return appendLine('cd: not a directory: ' + target, 'terminal-error');
        currentPath = target;
        const prompt = document.querySelector('.terminal-input-line .prompt');
        if (prompt) prompt.textContent = 'user@phantomx:' + currentPath + '$';
        break;
      }
      case 'cat': {
        if (!args[0]) return appendLine('Usage: cat <file>', 'terminal-error');
        const target = normalizePath(args[0]);
        const node = fileSystem.get(target);
        if (!node) return appendLine('cat: no such file: ' + target, 'terminal-error');
        if (node.type !== 'file') return appendLine('cat: is a directory: ' + target, 'terminal-error');
        appendLine(node.content);
        break;
      }
      case 'mkdir':
      case 'touch': {
        if (!args[0]) return appendLine('Usage: ' + command + ' <path>', 'terminal-error');
        const target = normalizePath(args[0]);
        if (target === '/' || fileSystem.has(target)) return appendLine(command + ': path already exists: ' + target, 'terminal-error');
        const parent = target.slice(0, target.lastIndexOf('/')) || '/';
        if (fileSystem.get(parent)?.type !== 'dir') return appendLine(command + ': parent directory does not exist: ' + parent, 'terminal-error');
        fileSystem.set(target, command === 'mkdir' ? { type: 'dir' } : { type: 'file', content: '' });
        appendLine(command + ': created ' + target);
        break;
      }
      case 'echo': {
        const redirectIndex = args.findIndex((arg) => arg === '>' || arg === '>>');
        if (redirectIndex >= 0) {
          const destination = args[redirectIndex + 1];
          if (!destination) return appendLine('Usage: echo <text> > <file>', 'terminal-error');
          const target = normalizePath(destination);
          const parent = target.slice(0, target.lastIndexOf('/')) || '/';
          if (fileSystem.get(parent)?.type !== 'dir') return appendLine('echo: parent directory does not exist: ' + parent, 'terminal-error');
          const existing = fileSystem.get(target);
          if (existing && existing.type !== 'file') return appendLine('echo: target is a directory: ' + target, 'terminal-error');
          const value = args.slice(0, redirectIndex).join(' ');
          const content = args[redirectIndex] === '>>' && existing ? existing.content + value + '\n' : value;
          fileSystem.set(target, { type: 'file', content });
          appendLine('Wrote ' + target);
        } else {
          appendLine(args.join(' '));
        }
        break;
      }
      case 'ps': {
        const processes = [...kernel.activeProcesses.entries()];
        appendLine(processes.length
          ? processes.map(([id, process]) => id + ' (' + process.state + ')').join('\n')
          : 'No registered window processes.');
        break;
      }
      case 'clear':
        body.replaceChildren();
        break;
      default:
        appendLine('Command not recognized: ' + command + '. Type "help" for available commands.', 'terminal-error');
    }
  }

  if (form && input && body) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const rawInput = input.value.trim();
      if (!rawInput) return;
      if (rawInput.toLowerCase() !== 'clear') appendPrompt(rawInput);
      runCommand(rawInput);
      input.value = '';
      body.scrollTop = body.scrollHeight;
    });
  }

  document.querySelectorAll('[data-window-launch]').forEach((button) => {
    button.addEventListener('click', () => kernel.openWindow(button.dataset.windowLaunch));
  });
});
