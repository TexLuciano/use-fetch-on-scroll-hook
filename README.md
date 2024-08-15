use-fetch-on-scroll-hook

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-BADGE:END -->

A simple yet powerful hook to handle infinite scrolling in React. use-fetch-on-scroll-hook makes it easy to load more data as the user scrolls, either upwards or downwards. This hook simplifies the implementation and improves performance.

🚀 Install
bash
Copiar código
npm install --save use-fetch-on-scroll-hook

or

yarn add use-fetch-on-scroll-hook

// In code ES6
import useFetchOnScroll from 'use-fetch-on-scroll-hook';
// Or CommonJS
const useFetchOnScroll = require('use-fetch-on-scroll-hook').default;
📚 Usage

```jsx
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useFetchOnScroll } from 'use-fetch-on-scroll-hook';


export const Test = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const fetchData = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res: AxiosResponse<any> = await axios.get(
        'https://pokeapi.co/api/v2/pokemon',
        {
          params: {
            page: page,
          },
        },
      );

      if (page > 1) {
        setItems((prevItems) => [...prevItems, ...res.data.results]);
      } else {
        setItems(res.data.results);
        setPage(2)
      }

      if (items.length + res.data.results.length >= res.data.count) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //? you can be passing the "data" type if you want
  const { containerRef, handleScroll } = useFetchOnScroll<any>({
    page,
    setPage,
    hasMore,
    fetchMoreData: () => fetchData(),
    dependencyArray: [],
    data: items,
    fetchDirection: 'BOTTOM',
  });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: '300px',
        overflow: 'auto',
      }}
    >
      <div>
        {items &&
          items.map((i, index) => {
            return (
              <div key={i.external_id}>
                <div>{i.name}</div>
              </div>
            );
          })}
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

```

The useFetchOnScroll hook can be utilized in several ways:

Specify a fetchDirection to determine whether to load more content as the user scrolls up or down.
Use scrollableTarget to attach the scroll behavior to a specific DOM element.
Handle complex scroll scenarios like reverse scrolling for chat applications.
📜 Props
Name Type Description
fetchMoreData function Function to fetch more data when the user reaches the end of the scrollable area. It should trigger a state update to append new data.
dependencyArray array Array of dependencies for triggering the scroll action (only use if necessary). Changes in these dependencies will refetch data.
data array The data being scrolled through. Used to control scroll behavior and to append new items.
fetchDirection string Scroll direction to fetch more data. Can be "TOP" or "BOTTOM".
page number The current page number for pagination.
setPage function Function to update the current page number.
hasMore boolean Boolean indicating if more data is available to load.
Contributors ✨
Thanks to these wonderful people (emoji key):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/TexLuciano">Created by</a></td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
This project follows the all-contributors specification. Contributions of any kind are welcome!

LICENSE
MIT
