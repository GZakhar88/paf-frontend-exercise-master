import * as React from 'react';
import { FC, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';
const URL = '/api/games/lists.json'


const Components = () => {

  //------------------------------------TYPES-----------------------------------//
  type data = {
    title: string;
    description: string;
    lists: Array<list>;
  };
  type game = {
    id: number;
    title: string;
    provider: string;
    image: string;
  };
  type list = {
    id: string;
    title: string;
    items: Array<game>
  };
  
  //------------------------------------STATES-----------------------------------//
  const [data, setData] = useState<data>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedItem, setSearchedItem] = useState<game[]>([]);
  const [recentSearch, setRecentSearch] = useState<string[]>([]); 
 
  useEffect(() => {
    fetchData(URL);
    const localStorageData = localStorage.getItem("recent");
    if (localStorageData) {
      setRecentSearch(JSON.parse(localStorageData))
    }
  }, []);
  
  useEffect(() => {
    searchTerm.length !== 0 && searchInData(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('recent', JSON.stringify(recentSearch));
  });
  
  //------------------------------------FUNCTIONS-----------------------------------//
  async function fetchData(inputUrl: string) {
    try {
      const requestData = await fetch(inputUrl);
      const response: data = await requestData.json();
      setData(response)
    } catch (error) {
      console.log(error)
    }
  };
  
  const searchInData = (input: string) => {
    const searchedItem: game[] = [];
    data?.lists.map(list => {
      list.items.map(item => {
        item.title.toLowerCase().match(input.toLowerCase()) && searchedItem.push(item);
      })
    });
    searchedItem.length === 0 && alert("Sorry but not found any game with this name");

    // Filter the search result for uniqe values
    const filtered = [...new Map(searchedItem.map(item => [JSON.stringify(item), item])).values()];
    setSearchedItem(filtered)
  };

  
  //------------------------------------REACT COMPONENTS-----------------------------------//
  const HeaderComponent: FC<data> = (props) => {
    return (
      <div className="list-header">
        <h1>{props.title}</h1>
        <hr />
        <p>{props.description}</p>
      </div>
    );
  };

  const SingleItemComponent: FC<game> = (props) => {
    return (
      <div className="single-item">
        <div className="logo-container">
        <img className="game-logo" src={props.image} />
        <div className="game-logo-bg"></div>
        </div>
        <p>{props.title}</p>
      </div>
    );
  };

  const CategoryItemComponent: FC<list> = (props) => {
    return (
      <div className="category-container">
        <div className="category-title">
          <h2>{props.title}</h2>
        </div>
        <div className="games-container">
          {props.items.map(element => {
            return <SingleItemComponent key={element.id} {...element} />
          })}
        </div>
      </div>
    );
  };

  const SearchComponent: FC = () => {
      const searchComponentFunction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement
        const input = form.querySelector('#search-text-input') as HTMLInputElement
        setSearchTerm(input.value);

        // Save into the "history"
        if (recentSearch.length === 10) {
          const tempArray = recentSearch.pop()
          setRecentSearch(recentSearch);
        }
        setRecentSearch([input.value, ...recentSearch]);
      };

    return (
      <div id="search">
        <form className="search-form" onSubmit={event => searchComponentFunction(event)}>
          <input id="search-text-input" name="search-text-input" type="text" placeholder="Search by game name" autoComplete="off" list="recent-search" />
          <datalist id="recent-search">
            {recentSearch.map((item, index: number) =>
              <option key={index} value={item} />
            )}
          </datalist>
        </form>
      </div>
    );
  };
  

// MAIN RETURN
  return (
    <div>
      {data !== undefined && <HeaderComponent {...data} />}
      <div className="search-and-filter">
        <SearchComponent />
        <button onClick={(event: React.MouseEvent<HTMLElement>) => {
          setSearchedItem([])
        }}>Show all</button>
      </div>
      <div className="list">
      { searchedItem.length !== 0
        ? searchedItem.map(game => {
          return <SingleItemComponent key={game.id} {...game} />
          })
        : data !== undefined && data.lists.map(element => {
            return <CategoryItemComponent key={element.id} {...element} />
          })}
        </div>  
    </div>
  );
};
const componentsElement = document.getElementById("components");
render(<Components />, componentsElement);












