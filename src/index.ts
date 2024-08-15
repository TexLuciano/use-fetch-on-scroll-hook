import { useState, useCallback, useEffect, useRef, Dispatch, SetStateAction } from "react";

interface FetchOnScrollOptions<T> {
  fetchMoreData: () => Promise<any | void>;
  dependencyArray: any[];
  data: T[];
  fetchDirection?: "TOP" | "BOTTOM";
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasMore: boolean;
}

export const useFetchOnScroll = <T,>({
  setPage,
  hasMore,
  fetchMoreData,
  dependencyArray,
  data,
  fetchDirection = "BOTTOM"
}: FetchOnScrollOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    setIsLoading(true);
    try {
      if (data.length > 0 && hasMore) {
        setPage((prevPage) => prevPage + 1);
        await fetchMoreData();

        if (fetchDirection === "TOP" && containerRef.current) {
          setPrevScrollHeight(containerRef.current.scrollHeight);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMoreData, fetchDirection]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || !hasMore) return;
      const hasVerticalScrollbar = container.scrollHeight > container.clientHeight;
      const isBottomReached = container.scrollHeight - container.scrollTop === container.clientHeight;

      if (fetchDirection === "TOP" && e.currentTarget.scrollTop === 0 && hasMore && hasVerticalScrollbar) {
        fetchMore();
      } else if (fetchDirection === "BOTTOM" && isBottomReached && hasMore) {
        fetchMore();
      }
    },
    [fetchMore, hasMore, fetchDirection]
  );

  useEffect(() => {
    fetchMore();
  }, [...dependencyArray]);

  useEffect(() => {
    if (fetchDirection === "TOP" && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight - prevScrollHeight;
    }
  }, [data, prevScrollHeight, fetchDirection]);

  return { isLoading, containerRef, handleScroll };
};
