interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
}

export function BlogPostStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  author,
  url,
  imageUrl,
  tags,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author,
      url: "https://www.lesacat.me",
    },
    publisher: {
      "@type": "Organization",
      name: "Lesalog",
      url: "https://www.lesacat.me",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lesacat.me/og-image.png",
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url: url,
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
    ...(tags && {
      keywords: tags.join(", "),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface WebsiteStructuredDataProps {
  name: string;
  url: string;
  description: string;
}

export function WebsiteStructuredData({
  name,
  url,
  description,
}: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    url: url,
    description: description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/posts/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    author: {
      "@type": "Person",
      name: "Lesa",
      url: url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
