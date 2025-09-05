import rss, { RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
<<<<<<< HEAD
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
||||||| parent of 77edfd2 (Improve RSS feed)
    items: sortedPosts.map(({ data }) => ({
      link: `posts/${slugify(data)}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.pubDatetime),
    })),
=======
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    items: sortedPosts.map(({ data, slug }) => {
      const postUrl = `${SITE.website}posts/${slugify(data)}`;

      const item: RSSFeedItem = {
        link: postUrl,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDatetime),
        author: data.author || SITE.author,
        categories: data.tags || [],
      };

      // Add enclosure for posts with OG images
      if (data.ogImage) {
        const imageUrl = data.ogImage.startsWith("http")
          ? data.ogImage
          : `${SITE.website}${data.ogImage}`;

        item.enclosure = {
          url: imageUrl,
          type: "image/jpeg", // Default to JPEG, could be made dynamic
          length: 0, // RSS spec allows 0 if unknown
        };
      }

      return item;
    }),
>>>>>>> 77edfd2 (Improve RSS feed)
  });
}
