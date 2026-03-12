export const SITE = {
  website: "https://fbull.de/",
  author: "Fabian Bull",
  profile: "https://fbull.de",
  desc: "Musings of a nerd.",
  title: "fbull.de",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: false,
  postPerPage: 5,
  postPerIndex: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/peri4n/blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Berlin", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

