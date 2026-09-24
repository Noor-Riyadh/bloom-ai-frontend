interface MarkdownContentProps {
  content: string;
}

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-6 text-lg leading-8 text-[#252525]">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const firstLine = lines[0];

        if (firstLine.startsWith("## ")) {
          return (
            <h3 className="text-4xl font-extrabold text-[#111]" key={index}>
              {renderInline(firstLine.slice(3))}
            </h3>
          );
        }

        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol className="list-decimal space-y-3 pl-7" key={index}>
              {lines.map((line) => (
                <li key={line}>{renderInline(line.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => /^[-*]\s/.test(line))) {
          return (
            <ul className="list-disc space-y-3 pl-7" key={index}>
              {lines.map((line) => (
                <li key={line}>{renderInline(line.replace(/^[-*]\s/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={`${line}-${lineIndex}`}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
