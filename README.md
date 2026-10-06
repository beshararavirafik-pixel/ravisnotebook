# Ravi’s Notebook

A static Coptic Orthodox learning library with hymn discovery, a reading room, Ravi’s teaching notes, and multilingual hymn readers.

## Preview

Serve the repository with any static web server. For example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. There is no package installation or build step. Publish the same files with GitHub Pages or another static host.

## Content

- `assets/library-data.js` contains the dated catalogue snapshot: 892 hymns, 35 books, and the doxology text.
- `assets/notebook.js` provides multilingual search, catalogue filters, display options, browser-local bookmarks, note filtering, and an expanding navigation search.
- `assets/resource-reader.js` renders the hymn texts, word studies, and built-in PDF page reader.
- `assets/resources/` stores hymn text and analysis as JSON; `assets/books/` stores permitted PDF and EPUB files.
- `assets/notebook.css` applies shared responsive styling across public pages.
- Existing feast page URLs and Ravi’s original lessons are retained.

See [CONTENT-SOURCES.md](CONTENT-SOURCES.md) for attribution and snapshot details. Hymn and book cards open readers on Ravi’s Notebook. Hymn texts, word studies, PDFs, and EPUBs are stored in this repository. Recordings are pending files from Ravi and are not imported from the source. Hymn of the day rotates through the hymn catalogue at midnight Eastern time, including on a page left open.

Saved items and the existing admin editing interface use local browser storage. Editing there does not publish repository changes or synchronize between devices. Q&A retains the original local storage implementation; it is not a server-backed inbox.

## Verification

The site was checked in desktop and 390-pixel phone-width browsers. The expanding navigation search, local hymn readers, language switching, word studies, and book reader/downloads are checked along with catalogue filters and mobile navigation. Page links, unique IDs, JavaScript syntax, and all local resource references are validated. Retained legacy Hazzat embeds still depend on their original host.
