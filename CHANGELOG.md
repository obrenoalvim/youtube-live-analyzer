# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed
- Replaced `innerHTML` string interpolation with safe DOM APIs (`textContent`/`createElement`) when rendering chat-derived topic labels in the widget and popup, closing an XSS vector where a malicious chat comment could inject markup into the ranking UI.
- Guarded `background.js`'s `updateBadge` handler against a missing `sender.tab`, which previously threw when a message arrived from a non-tab context.
- Removed duplicate `isCommentElement`/`extractCommentText`/`processExistingComments` method definitions in `content-script.js` that silently shadowed the earlier ones.
- Added `chrome.runtime.lastError` handling on `chrome.storage.local.set` calls instead of failing silently.

### Changed
- Replaced the whole-document `MutationObserver` used to detect SPA navigation with `yt-navigate-finish`/`popstate` listeners, avoiding an expensive full-body observer.
- Added `aria-label`/`aria-expanded` attributes and `:focus-visible` styles to the widget's toggle controls for keyboard/screen-reader accessibility.
- `eslint.config.js` now scopes browser/extension globals to the extension files and Node globals to config files, instead of applying the Vite/React config to the whole repo.
