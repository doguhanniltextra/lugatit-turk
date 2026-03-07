# Divanü Lügati't-Türk: Digital Dictionary & Interactive Map

This project is an open-source web application that digitizes, cleans, and presents the monumental 11th-century work of Mahmud al-Kashgari, **Divanü Lügati't-Türk**, through a modern and interactive interface.

## Live Preview

[Website](https://doguhanniltextra.github.io/lugatit-turk/)

##  Technical Features

- **Dataset:** 7,200+ structured entries (based on Besim Atalay's translation).
- **Interface ("Steppe Modern"):** Pure HTML5 and Vanilla CSS3. No heavy frameworks used.
- **Interactive Map:** 11th-century Turkic tribe geography powered by Leaflet.js and CartoDB Dark Matter layers.
- **Audio Narration:** AI-powered biography of Mahmud al-Kashgari using Web Speech API (tr-TR).
- **Performance:** 100% Static (Serverless). Local instant search (JSON-indexed).

## Data Cleaning Pipeline

The most critical phase of this project was the extraction and cleaning of raw PDF data:

1.  **OCR Correction:** Context-aware conversion of misplaced `;` characters into the correct Turkic `ş`.
2.  **Noise Removal:** Stripping page references (`I. 154`, `203^`), redundant numbering, and fragmented entries.
3.  **Normalization:** Merging duplicate keys and patching semantic shifts using advanced regex.
4.  **Validation:** Integrity checks for JSON structure and search indexing.

## Local Setup

Since the project is static, no package installation is required.

1.  Clone the repository:
    ```bash
    git clone https://github.com/doguhangithub/divan.git
    cd divan
    ```
2.  Start a simple HTTP server (required to avoid CORS issues with JS modules):

    ```bash
    # Using Node.js
    node server.js
    ```

3.  Open `http://localhost:3000` in your browser.

## Running with Docker

```bash
docker build -t divan .
docker run -p 3000:3000 divan
```

## License

This project is licensed under the [MIT License](LICENSE). Knowledge grows when shared.

---

_Dedicated to the memory of Mahmud al-Kashgari._
