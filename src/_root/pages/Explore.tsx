import { GridPostList, Loader, SearchResults } from "@/components/shared";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDeboucing";
import { useTitle } from "@/hooks/useTitle";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  useTitle("Explore");

  const [searchValue, setsearchValue] = useState("");
  const { ref, inView } = useInView();

  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearchValue);

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, searchValue]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-screen">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts?.pages?.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            height={24}
            width={24}
          />
          <Input
            type="text"
            placeholder="Search for posts"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setsearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            height={20}
            width={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((page, index) => (
            <GridPostList key={index} posts={page.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
