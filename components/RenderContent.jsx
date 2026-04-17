export default function RenderContent({ content }) {
  // Split content into lines to check each one for Markdown-style images
  const lines = content.split("\n");

  return (
    <div className="space-y-4 font-sans text-lg leading-relaxed">
      {lines.map((line, index) => {
        // Regex to match: ![alt text](https://url.com/image.png)
        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

        if (imgMatch) {
          const [, alt, src] = imgMatch;
          return (
            <figure 
              key={index} 
              className="my-10 mx-auto w-full max-w-[500px] rounded-2xl overflow-hidden border border-[var(--border)] shadow-lg bg-[var(--input)]"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              {alt && (
                <figcaption className="text-center text-sm text-[var(--muted)] py-3 px-4 italic border-t border-[var(--border)]">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        }

        // If no image match, just return the text line (handling empty lines as breaks)
        return line.trim() === "" ? (
          <br key={index} />
        ) : (
          <p key={index} className="text-[var(--foreground)]">
            {line}
          </p>
        );
      })}
    </div>
  );
}