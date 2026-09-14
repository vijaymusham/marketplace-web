type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Server-rendered JSON-LD for Google (prefer initial HTML over client injection). */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
