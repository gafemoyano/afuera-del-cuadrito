// similer products
const similerItems = (currentItem: any, allItems: any, slug: string) => {
  const tags: string[] = Array.isArray(currentItem.data.tags)
    ? currentItem.data.tags
    : [];

  const filterByTags = allItems.filter((item: { data: { tags: string[] } }) =>
    tags.some((tag) => item.data.tags?.includes(tag))
  );

  // filter by slug
  const filterBySlug = filterByTags.filter((product) => product.slug !== slug);

  return filterBySlug;
};

export default similerItems;
