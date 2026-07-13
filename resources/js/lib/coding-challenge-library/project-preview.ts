export type PreviewRoute = {
    path: string;
    name: string | null;
};

export type ProjectPreviewModel = {
    appName: string;
    tagline: string;
    ctaLabel: string;
    eyebrow: string;
    routes: PreviewRoute[];
    html: string;
};

const DEFAULTS = {
    appName: 'DevForge Lab',
    tagline: 'Ship something small today.',
    ctaLabel: 'Get started',
    eyebrow: 'Sandbox',
};

function unescapePhpString(raw: string): string {
    return raw
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
}

function extractQuotedMapValue(source: string, key: string): string | null {
    const configDefault = source.match(
        new RegExp(
            `['"]${key}['"]\\s*=>\\s*config\\([^,]+,\\s*['"]([^'"]*)['"]\\s*\\)`,
            'i',
        ),
    );

    if (configDefault?.[1] !== undefined) {
        return unescapePhpString(configDefault[1]);
    }

    const literal = source.match(new RegExp(`['"]${key}['"]\\s*=>\\s*['"]([^'"]*)['"]`, 'i'));

    if (literal?.[1] !== undefined) {
        return unescapePhpString(literal[1]);
    }

    return null;
}

export function parseInertiaProps(controllerSource: string): Record<string, string> {
    const props: Record<string, string> = {};

    for (const key of ['appName', 'tagline', 'ctaLabel']) {
        const value = extractQuotedMapValue(controllerSource, key);

        if (value !== null) {
            props[key] = value;
        }
    }

    return props;
}

export function parseRoutes(webPhp: string): PreviewRoute[] {
    const routes: PreviewRoute[] = [];
    const routePattern =
        /Route::get\(\s*['"]([^'"]+)['"]\s*,[\s\S]*?\)->name\(\s*['"]([^'"]+)['"]\s*\)/g;

    let match: RegExpExecArray | null;

    while ((match = routePattern.exec(webPhp)) !== null) {
        routes.push({ path: match[1], name: match[2] });
    }

    if (routes.length === 0) {
        routes.push({ path: '/', name: 'welcome' });
    }

    return routes;
}

function extractJsxTextContent(source: string, tag: string): string | null {
    const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = source.match(pattern);

    if (!match) {
        return null;
    }

    const inner = match[1].trim();

    if (/^\{[^}]+\}$/.test(inner)) {
        return null;
    }

    return inner.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim() || null;
}

function extractButtonLabel(welcomeSource: string, props: Record<string, string>): string {
    const buttonMatch = welcomeSource.match(/<Button[^>]*>([\s\S]*?)<\/Button>/i);

    if (!buttonMatch) {
        return props.ctaLabel ?? DEFAULTS.ctaLabel;
    }

    const inner = buttonMatch[1].trim();
    const propRef = inner.match(/^\{(\w+)\}$/);

    if (propRef) {
        return props[propRef[1]] ?? DEFAULTS.ctaLabel;
    }

    const literal = inner.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();

    return literal || props.ctaLabel || DEFAULTS.ctaLabel;
}

function extractEyebrow(welcomeSource: string): string {
    const uppercase = welcomeSource.match(
        /<p[^>]*uppercase[^>]*>([\s\S]*?)<\/p>/i,
    );

    if (uppercase) {
        const text = uppercase[1].replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();

        if (text) {
            return text;
        }
    }

    return DEFAULTS.eyebrow;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderWelcomeDocument(model: Omit<ProjectPreviewModel, 'html' | 'routes'>, path: string, found: boolean): string {
    if (!found) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Not Found</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #fafafa; color: #18181b; }
    main { max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    p { color: #71717a; font-size: 0.875rem; }
    code { background: #f4f4f5; padding: 0.1rem 0.35rem; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>No route matches <code>${escapeHtml(path)}</code> in <code>routes/web.php</code>.</p>
  </main>
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(model.appName)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: #fafafa; color: #09090b; }
    header { border-bottom: 1px solid #e4e4e7; background: #fff; padding: 1rem 1.5rem; }
    header p { margin: 0; font-size: 0.875rem; font-weight: 600; letter-spacing: -0.01em; }
    main { max-width: 48rem; margin: 0 auto; padding: 2.5rem 1.5rem; }
    section { display: flex; flex-direction: column; gap: 1rem; }
    .eyebrow { margin: 0; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #71717a; }
    h1 { margin: 0; font-size: 1.875rem; font-weight: 600; letter-spacing: -0.025em; }
    .tagline { margin: 0; max-width: 36rem; font-size: 0.875rem; line-height: 1.625; color: #52525b; }
    button {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      border: 0;
      border-radius: 0.5rem;
      background: #18181b;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      cursor: default;
    }
    button:hover { background: #27272a; }
  </style>
</head>
<body>
  <header>
    <p>${escapeHtml(model.appName)}</p>
  </header>
  <main>
    <section>
      <p class="eyebrow">${escapeHtml(model.eyebrow)}</p>
      <h1>${escapeHtml(model.appName)}</h1>
      <p class="tagline">${escapeHtml(model.tagline)}</p>
      <button type="button">${escapeHtml(model.ctaLabel)}</button>
    </section>
  </main>
</body>
</html>`;
}

export function buildProjectPreviewModel(files: Record<string, string>, activePath = '/'): ProjectPreviewModel {
    const controller = files['app/Http/Controllers/WelcomeController.php'] ?? '';
    const welcome = files['resources/js/pages/welcome.tsx'] ?? '';
    const web = files['routes/web.php'] ?? '';
    const props = parseInertiaProps(controller);

    const appName = props.appName || DEFAULTS.appName;
    const tagline = props.tagline || DEFAULTS.tagline;
    const ctaLabel = extractButtonLabel(welcome, { ...props, ctaLabel: props.ctaLabel || DEFAULTS.ctaLabel });
    const eyebrow = extractEyebrow(welcome);
    const h1Override = extractJsxTextContent(welcome, 'h1');
    const routes = parseRoutes(web);
    const normalized = activePath.startsWith('/') ? activePath : `/${activePath}`;
    const found = routes.some((route) => route.path === normalized);

    const model = {
        appName: h1Override && !h1Override.includes('{') ? h1Override : appName,
        tagline,
        ctaLabel,
        eyebrow,
        routes,
    };

    return {
        ...model,
        html: renderWelcomeDocument(model, normalized, found),
    };
}
