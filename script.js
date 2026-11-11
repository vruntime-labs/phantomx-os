document.addEventListener("DOMContentLoaded", () => {
  const input=document.getElementById("command-input");
  const form=document.getElementById("terminal-form");
  const body=document.getElementById("terminal-body");
  const clock=document.getElementById("taskbar-clock");
  const kernel=window.PhantomKernel;
  const publicPages=window.PhantomPublicPages;
  const startSearch=document.getElementById("start-search");
  const appRegistry=window.PhantomAppRegistry;
  const fileSystem=window.PhantomVFS.forApp("phantom.term");
  let currentPath="/";

  function updateClock() {
    if(!clock) return;
    const now=new Date();
    clock.dateTime=now.toISOString();
    clock.textContent=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  }
  updateClock();
  window.setInterval(updateClock,1000);

  function renderAppMenu() {
    const target=document.getElementById("start-app-list");
    if(!target||!appRegistry) return;
    target.replaceChildren();
    const tiers=[{id:1,label:"CORE SHELL"},{id:2,label:"SIMULATION TOOLS"},{id:3,label:"STORY & PROGRESSION"}];
    tiers.forEach((tier)=>{
      const apps=appRegistry.list({tier:tier.id});
      const heading=document.createElement("div");
      heading.className="start-menu-section-label app-tier-heading";
      heading.textContent=tier.label;
      target.appendChild(heading);
      apps.forEach((app)=>{
        const available=app.status==="available";
        const button=document.createElement("button");
        button.type="button";
        button.className="start-app";
        button.dataset.appId=app.id;
        button.disabled=!available;
        button.title=app.description;
        const icon=document.createElement("span");
        icon.className="start-app-icon";
        icon.setAttribute("aria-hidden","true");
        icon.textContent=app.name==="PhantomTerm"?"›_":app.name==="VFS Explorer"?"▣":app.name==="OpenCam Viewer"?"◉":"◇";
        const name=document.createElement("span");
        name.className="start-app-name";
        name.textContent=app.name;
        const status=document.createElement("span");
        status.className="start-app-state";
        status.textContent=available?"AVAILABLE":"PLANNED";
        button.append(icon,name,status);
        target.appendChild(button);
      });
    });
  }
  renderAppMenu();

  if(startSearch) {
    startSearch.addEventListener("input",()=>{
      const query=startSearch.value.trim().toLowerCase();
      document.querySelectorAll("#start-app-list .start-app, #start-menu .start-links a").forEach((item)=>{
        item.hidden=Boolean(query)&&!item.textContent.toLowerCase().includes(query);
      });
      document.querySelectorAll("#start-app-list .app-tier-heading").forEach((heading)=>{
        let next=heading.nextElementSibling, hasVisibleApp=false;
        while(next&&!next.classList.contains("app-tier-heading")) {
          if(!next.hidden) hasVisibleApp=true;
          next=next.nextElementSibling;
        }
        heading.hidden=Boolean(query)&&!hasVisibleApp;
      });
    });
  }

  document.getElementById("start-app-list")?.addEventListener("click",(event)=>{
    const button=event.target.closest("[data-app-id]");
    if(!button||button.disabled) return;
    const result=appRegistry.launch(button.dataset.appId);
    if(result.ok) kernel.toggleStartMenu(false);
  });

  function normalizePath(path){return fileSystem.normalizePath(path,currentPath);}
  function tokenize(source) {
    const tokens=[];
    const pattern=/"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;
    while((match=pattern.exec(source))!==null) tokens.push(match[1]??match[2]??match[3]);
    return tokens;
  }
  function appendLine(value,className="") {
    const line=document.createElement("p");
    if(className) line.className=className;
    line.textContent=String(value);
    body.appendChild(line);
    body.scrollTop=body.scrollHeight;
  }
  function appendPrompt(rawInput) {
    const line=document.createElement("p");
    const prompt=document.createElement("span");
    prompt.className="prompt";
    prompt.textContent="user@phantomx:"+currentPath+"$ ";
    line.append(prompt,document.createTextNode(rawInput));
    body.appendChild(line);
  }
  function displayName(path) {
    const node=fileSystem.get(path);
    const name=path.split("/").pop()||"/";
    return node?.type==="dir"?name+"/":name;
  }
  function runCommand(rawInput) {
    const tokens=tokenize(rawInput);
    if(!tokens.length) return;
    const command=tokens.shift().toLowerCase();
    const args=tokens;
    const pageQuery=command==="open"?args.join(" "):[command,...args].join(" ");
    const publicPage=publicPages?.resolve(pageQuery);
    if(publicPage) {
      const didOpen=publicPages.open(publicPage.id);
      appendLine(didOpen?"Opening "+publicPage.label+" in a new tab...":"The browser blocked the new tab. Allow pop-ups for this site and try again.",didOpen?"":"terminal-error");
      return;
    }
    try {
      switch(command) {
        case "help":
          appendLine([
            "Available commands:",
            "  help                  Show this help",
            "  about                 Show system information",
            "  open <page>           Open a public PhantomX page",
            "  apps                  List registered applications",
            "  launch <app-id>       Launch an available PhantomX app",
            "  pwd                   Print the current directory",
            "  ls [path]             List directory contents",
            "  cd [path]             Change directory",
            "  cat <file>            Print a virtual file",
            "  mkdir <directory>     Create a virtual directory",
            "  touch <file>          Create an empty virtual file",
            "  echo <text> > <file>   Write text to a virtual file",
            "  ps                    List browser-window processes",
            "  clear                 Clear terminal output",
            "",
            "The shared virtual filesystem is in-memory and resets on reload."
          ].join("\n"));
          break;
        case "about":
          appendLine("PhantomX v2.3.1 — browser desktop and cyberdeck simulation. No host shell or native OS access.");
          break;
        case "open":
          appendLine("Usage: open <page> (try privacy, contributors, terms, cookies, disclaimer, security, or legal)","terminal-error");
          break;
        case "apps":
          appendLine(appRegistry.list().map((app)=>app.id+" — "+app.name+" ["+app.status+"]").join("\n"));
          break;
        case "launch": {
          if(!args[0]) return appendLine("Usage: launch <app-id> (try phantom.term)","terminal-error");
          const result=appRegistry.launch(args[0]);
          if(result.ok) appendLine("Launching "+result.app.name+"...");
          else if(result.reason==="not-implemented") appendLine(result.app.name+" is planned and is not available yet.","terminal-error");
          else appendLine("Unable to launch app: "+result.reason,"terminal-error");
          break;
        }
        case "pwd":
          appendLine(currentPath);
          break;
        case "ls": {
          const target=normalizePath(args[0]||".");
          const node=fileSystem.get(target);
          if(!node) return appendLine("ls: no such path: "+target,"terminal-error");
          if(node.type==="file") return appendLine(displayName(target));
          const entries=fileSystem.list(target,currentPath).map((entry)=>entry.name+(entry.type==="dir"?"/":""));
          appendLine(entries.length?entries.join("    "):"(empty directory)");
          break;
        }
        case "cd": {
          const target=normalizePath(args[0]||"/home");
          if(!fileSystem.isDirectory(target)) return appendLine("cd: not a directory: "+target,"terminal-error");
          currentPath=target;
          const prompt=document.querySelector(".terminal-input-line .prompt");
          if(prompt) prompt.textContent="user@phantomx:"+currentPath+"$";
          break;
        }
        case "cat": {
          if(!args[0]) return appendLine("Usage: cat <file>","terminal-error");
          appendLine(fileSystem.readFile(args[0],currentPath));
          break;
        }
        case "mkdir":
          if(!args[0]) return appendLine("Usage: mkdir <path>","terminal-error");
          appendLine("mkdir: created "+fileSystem.mkdir(args[0],currentPath));
          break;
        case "touch":
          if(!args[0]) return appendLine("Usage: touch <path>","terminal-error");
          appendLine("touch: created "+fileSystem.touch(args[0],currentPath));
          break;
        case "echo": {
          const redirectIndex=args.findIndex((arg)=>arg===">"||arg===">>");
          if(redirectIndex<0) { appendLine(args.join(" ")); break; }
          const destination=args[redirectIndex+1];
          if(!destination) return appendLine("Usage: echo <text> > <file>","terminal-error");
          const value=args.slice(0,redirectIndex).join(" ");
          const path=fileSystem.writeFile(destination,value,{currentPath,append:args[redirectIndex]===">>"});
          appendLine("Wrote "+path);
          break;
        }
        case "ps": {
          const processes=[...kernel.activeProcesses.entries()];
          appendLine(processes.length?processes.map(([id,process])=>id+" ("+process.state+")").join("\n"):"No registered window processes.");
          break;
        }
        case "clear":
          body.replaceChildren();
          break;
        default:
          appendLine('Command not recognized: '+command+'. Type "help" for available commands.',"terminal-error");
      }
    } catch(error) {
      appendLine(command+": "+error.message,"terminal-error");
    }
  }

  if(form&&input&&body) {
    form.addEventListener("submit",(event)=>{
      event.preventDefault();
      const rawInput=input.value.trim();
      if(!rawInput) return;
      if(rawInput.toLowerCase()!=="clear") appendPrompt(rawInput);
      runCommand(rawInput);
      input.value="";
      body.scrollTop=body.scrollHeight;
    });
  }

  document.querySelectorAll("[data-window-launch]").forEach((button)=>{
    button.addEventListener("click",()=>{
      appRegistry.launchByWindowId(button.dataset.windowLaunch);
    });
  });
});
