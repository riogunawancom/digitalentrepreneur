const SITE = "https://digitalentrepreneur.co.id";
const SITE_NAME = "Digital Entrepreneur Indonesia";

const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;

export function imageFor(pathname: string) {
  const slug = pathname === "/" ? "home" : pathname.replaceAll("/", "");
  return `/og/${slug}.jpg`;
}

export function structuredData(options: {
  title: string;
  description: string;
  canonical: string;
  pathname: string;
  image: string;
}) {
  const { title, description, canonical, pathname, image } = options;
  const pageId = `${canonical}#webpage`;

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Rio Gunawan",
    url: "https://riogunawan.com/",
    jobTitle: "Digital Entrepreneur",
    description:
      "Digital Entrepreneur, 2x pemasar internet terbaik dunia, dan Founder dari VUTURI. Inisiator istilah Digital Entrepreneur di Indonesia.",
    sameAs: ["https://riogunawan.com/", "https://vuturi.com/"],
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE}/`,
    name: SITE_NAME,
    description: "Filosofi dan Ideologi",
    inLanguage: "id-ID",
    publisher: { "@id": PERSON_ID },
  };

  const isHome = pathname === "/";
  const isProfile = pathname === "/siapa-itu-rio-gunawan/";
  const pageType = isHome ? "WebPage" : isProfile ? "ProfilePage" : "WebPage";

  const page: Record<string, unknown> = {
    "@type": pageType,
    "@id": pageId,
    url: canonical,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "id-ID",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: image,
      width: 1200,
      height: 630,
    },
    author: { "@id": PERSON_ID },
  };

  if (isProfile) page.mainEntity = { "@id": PERSON_ID };
  if (isHome) page.about = { "@id": PERSON_ID };

  const graph: Record<string, unknown>[] = [person, website, page];

  if (!isHome) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: `${SITE}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: canonical,
        },
      ],
    });
  }

  if (pathname === "/apa-itu-digital-gold-rush/") {
    graph.push({
      "@type": "VideoObject",
      "@id": `${canonical}#video`,
      name: "The California Gold Rush",
      description:
        "Video Simple History tentang California Gold Rush pada tahun 1849, dipakai untuk menjelaskan istilah Digital Gold Rush.",
      thumbnailUrl: image,
      uploadDate: "2018-10-26",
      duration: "PT2M16S",
      contentUrl: `${SITE}/video/california-gold-rush.mp4`,
      embedUrl: canonical,
      publisher: { "@id": WEBSITE_ID },
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
