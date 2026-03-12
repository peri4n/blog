import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconMastodon from "@/assets/icons/IconMastodon.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "Github",
    href: "https://github.com/peri4n/",
    linkTitle: `Me on Github`,
    icon: IconGitHub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/fabian-bull/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:spam+blog@fbull.de",
    linkTitle: `Send me an email`,
    icon: IconMail,
  },
  {
    name: "Mastodon",
    href: "https://fosstodon.org/@peri4n",
    linkTitle: `Mastodon`,
    icon: IconMastodon,
  },
];

export const SHARE_LINKS: Social[] = [];
