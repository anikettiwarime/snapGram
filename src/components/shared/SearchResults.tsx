import { SearchResultsProps } from "@/types";
import { GridPostList, Loader } from ".";

const SearchResults = ({
  searchedPosts,
  isSearchFetching,
}: SearchResultsProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }

  return <p className="text-light-4">No results found</p>;
};

export default SearchResults;
