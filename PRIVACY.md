# Privacy Policy

**Effective date: 6 November 2026**

This Privacy Policy describes the privacy considerations for the PhantomX OS project maintained by **VRuntime Labs** ("PhantomX", "we", "our" or "the project").

- Project: https://github.com/vruntime-labs/phantomx-os
- Live Browser Edition: https://vruntime-labs.github.io/phantomx-os/

## 1. Scope

This policy covers the publicly hosted PhantomX OS website and the browser application in this repository. It does not govern GitHub's own websites, services or privacy practices, third-party websites or asset providers, or future services that may be introduced under a separate notice.

## 2. What the current application does

The current Browser Edition is a static client-side web application. The source reviewed for this policy contains:

- HTML, CSS and JavaScript application resources.
- A browser-side simulated terminal and example in-memory virtual directory structure.
- A service worker that caches a defined list of application-shell resources using the browser Cache API.
- A web app manifest.
- A CSS background image loaded from the Unsplash image CDN at `images.unsplash.com`.

The reviewed application source does not show a project-operated account system, sign-in flow, analytics SDK, advertising SDK, or application backend. It does not currently provide a project-operated cloud account or synchronization service.

This description reflects the source reviewed on the effective date. It is not a guarantee that future versions or separately linked services will behave identically.

## 3. Information processed by the hosting provider

The live site is hosted through GitHub Pages. When a browser requests a website, the hosting and network providers may process technical request information such as IP address, browser and device details, requested resources, timestamps, and security or diagnostic logs.

This information is handled by the relevant provider under its own policies and terms. VRuntime Labs does not operate the GitHub Pages infrastructure and does not receive a project analytics dashboard or raw hosting logs through the application source reviewed for this policy.

For details, review GitHub's privacy statement: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

## 4. Browser storage and offline cache

The current service worker uses the browser Cache API to store a defined set of application files so the application shell can load on later visits and may remain available offline.

The terminal's example virtual filesystem is held in JavaScript memory in the current implementation; the inspected source does not establish persistent user-file storage for it.

You can manage site data, cached files and service workers through your browser's site settings. Clearing site data or unregistering the service worker may remove cached application resources and require the site to download them again.

Future releases may add local persistence, imports, exports, device pairing or synchronization. If those features materially change the information processed, this policy should be reviewed and updated before release.

## 5. Information you choose to share

If you open a GitHub issue, discussion or pull request, the information you submit is handled by GitHub and may be publicly visible. Do not post passwords, access tokens, private keys, personal documents or other sensitive information in public project channels.

The project does not currently provide a private support form through the Browser Edition.

## 6. Cookies and analytics

The application source reviewed for this policy does not include a project-installed analytics or advertising SDK and does not intentionally set an application analytics cookie.

GitHub, Unsplash or other infrastructure providers may use cookies or similar technologies on their own services. Browser behavior and provider practices may change; consult the relevant provider's policy and your browser settings.

## 7. Third-party assets and external links

The current stylesheet loads a background image from the Unsplash image CDN (`images.unsplash.com`). When the browser loads that image, it makes a request to Unsplash. Unsplash and its infrastructure providers may receive technical request information, such as IP address, browser details, requested asset and request time, under their own policies.

The project does not operate that CDN or control its data practices. Review the provider's privacy information at https://unsplash.com/privacy.

The project repository and live site also link to GitHub and may link to other external resources. When you follow an external link, that destination's privacy policy and terms apply. The project does not control external websites.

## 8. Children's privacy

The current Browser Edition is a publicly accessible general-purpose web project and does not knowingly request personal information from children. If you believe personal information about a child has been submitted through a public project channel, contact the maintainers through the repository and avoid reposting that information publicly.

## 9. Security

We aim to keep the application lightweight and minimize the information it handles. No website, browser, storage mechanism or network transmission can be guaranteed completely secure. Keep your browser updated and do not enter real credentials or sensitive information into simulated terminals or fictional mission interfaces.

## 10. Your choices

You can:

- Stop using the site at any time.
- Clear site data and cached resources through your browser.
- Disable or remove the service worker through browser site settings or developer tools.
- Avoid submitting personal or sensitive information in public GitHub issues or discussions.
- Use GitHub's account and privacy controls for information submitted to GitHub.
- Use browser privacy controls or content-blocking tools to restrict third-party asset requests, understanding that some visual elements may not load.

## 11. Changes to this policy

This policy may be updated when the application, hosting arrangement or data practices change. The effective date at the top will be revised when a material update is published. Review this page periodically.

## 12. Contact

For privacy questions or concerns, contact the maintainers through the GitHub repository:

https://github.com/vruntime-labs/phantomx-os

Please do not include sensitive personal information in a public issue. If your concern requires private handling, use GitHub's available private contact or reporting channels.

---

This policy is a project disclosure, not legal advice. It should be reviewed against the actual deployment, applicable law and any future third-party services before the project expands its data practices.
