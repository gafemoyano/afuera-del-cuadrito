import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"posts">;

export const SUPPORTED_LANGUAGES = ["es", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "es";

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: "Español",
  en: "English",
};

// Get posts filtered by language
export function getPostsByLanguage(posts: Post[], lang: Language): Post[] {
  return posts.filter((post) => (post.data.lang || DEFAULT_LANGUAGE) === lang);
}

// Get translation of a post (if exists)
export function getTranslation(post: Post, allPosts: Post[]): Post | null {
  const { translationKey, lang } = post.data;

  if (!translationKey) return null;

  const currentLang = lang || DEFAULT_LANGUAGE;
  const otherLang = currentLang === "es" ? "en" : "es";

  return (
    allPosts.find(
      (p) =>
        p.data.translationKey === translationKey &&
        (p.data.lang || DEFAULT_LANGUAGE) === otherLang,
    ) || null
  );
}

// Get post URL with language prefix
export function getPostUrl(post: Post): string {
  const lang = post.data.lang || DEFAULT_LANGUAGE;
  return `/${lang}/${post.id}`;
}
