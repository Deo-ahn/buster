# BUSTER project website

Academic project page for **BUSTER: Adaptive Sampling for VLM-guided Unsupervised Video Anomaly Detection**.

Website: https://deo-ahn.github.io/buster/

This is the project **website repository**. It contains the paper, supplementary material, poster, original demonstration videos, and a vector figure gallery.

## Edit and preview

- `index.html`: research content, author links, and page structure
- `style.css` / `dark.css`: layout and default navy theme
- `app.js`: benchmark, sampling, video, and citation controls
- `gallery-data.js` / `gallery.js`: original figure collection and zoom viewer
- `assets/gallery/`: vector SVGs and unchanged source PDFs

Serve the repository root with a local HTTP server. For example:

```sh
uv run --no-project python -m http.server 8000
```

GitHub Pages publishes the repository root from the `main` branch. `.nojekyll` keeps the site as plain HTML, CSS, and JavaScript. Asset links are relative so they work under `/buster/`.

## Source notes

All reported research results come from the supplied manuscript and supplementary material. Figure SVGs preserve vector text and linework and the original embedded image dimensions; source PDFs are provided unchanged. Thumbnail images serve navigation only. Original figure colours are retained within the dark interface.

The gallery separately identifies one source-version difference between the supplied supplementary PDF and LaTeX source. Research assets remain attributed to their original authors. Barlow Condensed is distributed with its font licence in `assets/fonts/OFL.txt`.
