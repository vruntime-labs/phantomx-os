# Privacy Policy

**Effective date: 6 November 2026**

This Privacy Policy describes the current privacy practices of PhantomX OS, an experimental browser-first project maintained by **VRuntime Labs**.

- Live Browser Edition: https://vruntime-labs.github.io/phantomx-os/
- Source repository: https://github.com/vruntime-labs/phantomx-os

## Scope and current application

The current Browser Edition is a static client-side web application. The source reviewed contains a simulated terminal, an example in-memory virtual directory, a service worker using the browser Cache API, a web app manifest, and a CSS background image requested from the Unsplash image CDN at images.unsplash.com.

The reviewed source does not show a project-operated account system, sign-in flow, analytics SDK, advertising SDK, application backend, cloud account, or synchronization service. The terminal does not execute arbitrary host commands and the example filesystem is not persistent user-file storage.

## Hosting and technical request data

The site is hosted through GitHub Pages. Hosting and network providers may process technical request information such as IP address, browser/device details, requested resources, timestamps, and security logs. Review GitHub's privacy statement: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

## Browser storage and offline cache

The service worker stores selected application files in the browser Cache API for repeat and offline loading. This is browser-managed cache storage, not a cookie or server-side user profile. The example virtual filesystem is held in JavaScript memory. You can clear site data and unregister the service worker through browser settings.

## Information you choose to share

GitHub issues, discussions, and pull requests are handled by GitHub and may be publicly visible. Do not post passwords, tokens, private keys, personal documents, or sensitive information in public project channels.

## Cookies and third-party assets

The reviewed application does not intentionally set first-party cookies and contains no project-installed analytics or advertising SDK. Browser Cache API storage is distinct from cookies. GitHub, Unsplash, or infrastructure providers may use cookies on their own services.

The stylesheet requests a background image from images.unsplash.com. Unsplash may receive technical information such as IP address, browser details, requested asset, and request time. See https://unsplash.com/privacy.

No optional analytics or advertising cookies are currently used by the application, so no cookie-consent banner is displayed. This must be reassessed before introducing such technologies.

## Choices, security and contact

You may clear browser data, unregister the service worker, restrict third-party asset requests, and use GitHub's account/privacy controls. Do not enter real credentials or secrets into simulated terminals.

For privacy questions, contact maintainers through https://github.com/vruntime-labs/phantomx-os. This policy is a project disclosure, not legal advice; review it against actual deployment and applicable law.
