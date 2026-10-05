# Ravi’s Notebook

A static Coptic Orthodox learning library with hymn discovery, a reading room, Ravi’s teaching notes, and a multilingual Maundy Thursday doxology reader.

## Preview

Serve the repository with any static web server. For example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. There is no package installation or build step. Publish the same files with GitHub Pages or another static host.

## Content

- `assets/library-data.js` contains the dated catalogue snapshot: 892 hymns, 35 books, 20 recent external reading links, and the featured doxology.
- `assets/notebook.js` provides multilingual search, catalogue filters, display options, browser-local bookmarks, note filtering, and reader controls.
- `assets/notebook.css` applies shared responsive styling across public pages.
- Existing feast page URLs and Ravi’s original lessons are retained.

See [CONTENT-SOURCES.md](CONTENT-SOURCES.md) for attribution and snapshot details. Most hymn cards open the original resource website; the featured doxology has a native reader. PDFs, EPUBs, and recordings remain externally hosted. Dates on recent reading cards are source update dates, not a live feed.

Saved items and the existing admin editing interface use local browser storage. Editing there does not publish repository changes or synchronize between devices. Q&A retains the original local storage implementation; it is not a server-backed inbox.

## Verification

The redesign was checked in a desktop and 390-pixel phone-width browser. Search, saved filtering, topic/EPUB filters, display switching, mobile navigation, pronunciation mode, and recording playback were exercised. All 45 HTML pages passed local link, duplicate-ID, and inline JavaScript syntax checks. External resources remain dependent on their original hosts.
