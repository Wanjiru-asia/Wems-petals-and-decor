
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pages = [
  "index.html",
  "custom.html"
];

const errors = [];
const whatsappNumbers = new Set();

for (const page of pages) {
  const pagePath = path.join(root, page);

  if (!fs.existsSync(pagePath)) {
    errors.push(`${page}: page file is missing`);
    continue;
  }

  const html = fs.readFileSync(pagePath, "utf8");

  if (!html.includes("Content-Security-Policy") || !html.includes("script-src 'self'")) {
    errors.push(`${page}: restrictive script CSP is missing`);
  }

  if (!html.includes('name="referrer" content="no-referrer"')) {
    errors.push(`${page}: no-referrer policy is missing`);
  }

  if (/<script\s*>/i.test(html)) {
    errors.push(`${page}: inline script remains`);
  }

  if (/\son[a-z]+\s*=/i.test(html)) {
    errors.push(`${page}: inline event handler found`);
  }

  for (const match of html.matchAll(/<script\s+src="([^"]+)"/gi)) {
    const scriptPath = path.join(root, match[1]);

    if (!fs.existsSync(scriptPath)) {
      errors.push(`${page}: referenced script is missing (${match[1]})`);
    }
  }

  for (const match of html.matchAll(/https:\/\/wa\.me\/(\d+)/g)) {
    whatsappNumbers.add(match[1]);
  }
}

for (const script of ["index.js", "custom.js"]) {
  const scriptPath = path.join(__dirname, script);

  if (fs.existsSync(scriptPath) &&
      /\beval\s*\(|document\.write\s*\(/.test(fs.readFileSync(scriptPath, "utf8"))) {
    errors.push(`${script}: eval or document.write found`);
  }
}

if (whatsappNumbers.size !== 1 || !whatsappNumbers.has("254746053722")) {
  errors.push(`WhatsApp number mismatch: ${[...whatsappNumbers].join(", ") || "no links found"}`);
}

if (errors.length) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS ${pages.length} HTML pages include script CSP and no-referrer policy.`);
  console.log("PASS No inline scripts or inline event handlers found.");
  console.log("PASS Local script references exist; no eval or document.write found.");
  console.log("PASS All WhatsApp links use +254 746 053 722.");
}

if (fs.existsSync(path.join(root, "admin.html"))) {
  console.warn("OPEN admin.html is a public static page; it has no server-side authentication.");
}
