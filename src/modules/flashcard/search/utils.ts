export function formatSearchParams(
  params: {
    search?: string;
    sort?: string;
    tagName?: string;
    offset?: number;
    limit?: number;
  },
  shouldSearchByTag: boolean
) {
  const clonedParams = structuredClone(params);
  if (shouldSearchByTag) {
    clonedParams.tagName = clonedParams.search?.slice(1);
    delete clonedParams.search;
  } else {
    delete clonedParams.tagName;
  }

  return clonedParams;
}
