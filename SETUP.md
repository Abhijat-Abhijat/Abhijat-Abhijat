# Install the profile README + Terminal Quest game

1. Back up the existing `README.md` in the `Abhijat-Abhijat/Abhijat-Abhijat` profile repository.
2. Copy this bundle's `README.md`, `assets/`, `game/`, and `.github/workflows/snake.yml` into the repository root.
3. Commit and push to `main`.
4. To publish the game, open **Settings → Pages** in that repository. Choose **Deploy from a branch**, select `main`, and choose `/(root)`. Save. After Pages publishes the site, the game should be available at `https://abhijat-abhijat.github.io/game/` unless a custom domain or different Pages configuration changes the URL.
5. To publish the contribution snake, open **Settings → Actions → General** and ensure workflows are allowed to write repository contents. Then open **Actions → Generate contribution snake → Run workflow**. The workflow publishes SVGs to the `output` branch.
6. If the `output` branch doesn't appear, check the workflow run logs and repository Actions permissions.

## Before publishing

- Check that the experience details and reported impact figures in `README.md` are still accurate.
- Project links intentionally point to the repository list because exact project repository URLs were not confirmed. Replace them with specific repo links if available.
- The stats cards and activity graph use third-party services and may occasionally fail to load.
- GitHub sanitizes JavaScript in README Markdown, so the game must be served as a webpage; it cannot run as an embedded script directly inside the profile README.
