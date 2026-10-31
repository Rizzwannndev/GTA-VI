// Characters as introduced on rockstargames.com/VI/only-in-leonida.
// Quotes marked `quote` are Rockstar's own lines; `bio` is our paraphrase.
import { art } from "../assets/images/art";
import calArt from "../assets/placeholders/cast-cal-hampton.svg";
import dreArt from "../assets/placeholders/cast-dre-quan-priest.svg";
import dimezArt from "../assets/placeholders/cast-real-dimez.svg";
import raulArt from "../assets/placeholders/cast-raul-bautista.svg";
import brianArt from "../assets/placeholders/cast-brian-heder.svg";

export const leads = [
  {
    id: "lucia",
    name: "Lucia Caminos",
    first: "Lucia",
    image: art.lucia,
    quote: "Lucia's father taught her to fight as soon as she could walk.",
    bio: "Fresh out of Leonida Penitentiary and done with second chances, Lucia wants a better life than the one she was handed. Jason looks like her way out.",
    tint: "var(--color-pink)",
  },
  {
    id: "jason",
    name: "Jason Duval",
    first: "Jason",
    image: art.jason,
    quote: "Jason wants an easy life, but things just keep getting harder.",
    bio: "An Army veteran raised around grifters, Jason now runs jobs for drug runners down in the Keys. Then he meets Lucia.",
    tint: "var(--color-teal)",
  },
];

export const cast = [
  {
    id: "boobie-ike",
    name: "Boobie Ike",
    role: "Vice City entrepreneur",
    quote: "It's all about heart. The Jack of Hearts.",
    bio: "Built a legitimate empire out of Vice City nightlife, and is still all business when it counts. Partner in Only Raw Records.",
    image: art.boobie,
    placeholder: false,
  },
  {
    id: "dre-quan-priest",
    name: "Dre'Quan Priest",
    role: "Runs Only Raw Records",
    bio: "A former dealer who always wanted to be in music. Now he runs the label, and he signed the Real Dimez.",
    src: dreArt,
    placeholder: true,
  },
  {
    id: "real-dimez",
    name: "Real Dimez",
    role: "Bae-Luxe and Roxy",
    bio: "Childhood friends turned rap duo, built on viral videos and viral hooks. Signed to Only Raw Records.",
    src: dimezArt,
    placeholder: true,
  },
  {
    id: "raul-bautista",
    name: "Raul Bautista",
    role: "Bank robber, recruiter",
    quote: "Experience counts.",
    bio: "A seasoned bank robber who recruits talent for risky jobs. His recklessness keeps raising the stakes.",
    src: raulArt,
    placeholder: true,
  },
  {
    id: "cal-hampton",
    name: "Cal Hampton",
    role: "Jason's friend",
    quote: "What if everything on the internet was true?",
    bio: "A homebody who keeps one ear on Coast Guard radio traffic and the other on every theory going.",
    src: calArt,
    placeholder: true,
  },
  {
    id: "brian-heder",
    name: "Brian Heder",
    role: "Old-school drug runner",
    quote: "Nothing better than a Mudslide at sunset.",
    bio: "Runs a boat yard with his third wife, Lori, and lets Jason stay rent-free in exchange for help with shakedowns.",
    src: brianArt,
    placeholder: true,
  },
];
