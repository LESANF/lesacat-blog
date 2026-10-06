import { cache } from "react";
import type { ComponentProps } from "react";
import type { ExtraProps } from "react-markdown";
import Script from "next/script";
import { ExpressiveCode, loadShikiTheme } from "expressive-code";
import { getClassNames, toHtml, toText } from "expressive-code/hast";

const engine = loadShikiTheme("gruvbox-dark-soft").then((theme) => new ExpressiveCode({
  themes: [theme],
  defaultProps: { frame: "none" },
  styleOverrides: {
    codeFontSize: "0.9375rem",
    codeLineHeight: "1.7",
    codePaddingBlock: "1.125rem",
    codePaddingInline: "1.25rem",
    borderRadius: "0.5rem",
    frames: { frameBoxShadowCssValue: "none" },
  },
}));

const getAssets = cache(async () => {
  const renderer = await engine;
  return Promise.all([
    renderer.getBaseStyles(),
    renderer.getThemeStyles(),
    renderer.getJsModules(),
  ]);
});

export async function CodeBlockAssets() {
  const [baseStyles, themeStyles, scripts] = await getAssets();
  return (
    <>
      <style>{baseStyles + themeStyles}</style>
      {scripts.length > 0 && (
        <Script id="code-block-tools" type="module">
          {scripts.join("\n")}
        </Script>
      )}
    </>
  );
}

export default async function CodeBlock({ code, language = "text" }: {
  code: string;
  language?: string;
}) {
  const renderer = await engine;
  const { renderedGroupAst, styles } = await renderer.render({
    code,
    language,
  });

  return (
    <>
      {styles.size > 0 && <style>{[...styles].join("")}</style>}
      {/* Expressive Code escapes source text while generating its trusted markup. */}
      <div className="code-block" dangerouslySetInnerHTML={{ __html: toHtml(renderedGroupAst) }} />
    </>
  );
}

export function MarkdownCodeBlock({ node, children }: ComponentProps<"pre"> & ExtraProps) {
  const codeNode = node?.children.find((child) => child.type === "element" && child.tagName === "code");
  if (!codeNode || codeNode.type !== "element") return <pre>{children}</pre>;

  const code = toText(codeNode, { whitespace: "pre" });
  const languageClass = getClassNames(codeNode).find((name) => name.startsWith("language-"));

  return <CodeBlock code={code.replace(/\n$/, "")} language={languageClass?.slice(9)} />;
}
