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
    lists: Array<list>
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
  const [foundedItem, setFoundedItem] = useState<game[]>([]);
  const [recentSearch, setRecentSearch] = useState<string[]>([])

  
  useEffect(() => {
    fetchData(URL);
    const localStorageData = localStorage.getItem("recent");
    if (localStorageData) {
      setRecentSearch(JSON.parse(localStorageData))
    }
  }, []);
  
  useEffect(() => {
    searchTerm.length !== 0 && searchInData(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    localStorage.setItem('recent', JSON.stringify(recentSearch))
  })
  
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
        item.title == input && searchedItem.push(item);
      })
    });
    searchedItem.length === 0 && alert('Sorry but not found any game with this name');
    const filtered = [...new Map(searchedItem.map(item => [JSON.stringify(item), item])).values()];
    setFoundedItem(filtered)
  };

  

  


  //------------------------------------REACT COMPONENTS-----------------------------------//
  const Header: FC<data> = (props) => {
    return (
      <div className="list-header">
        <h1>{props.title}</h1>
        <hr />
        <p>{props.description}</p>
      </div>
    );
  };

  const SingleItem: FC<game> = (props) => {
    return (
      <div className="single-item">
          <img className="game-logo" src={props.image} />
        <p>{props.title}</p>
      </div>
    );
  };

  const CategoryItem: FC<list> = (props) => {
    return (
      <div className="category-container">
        <div className="category-title">
          <h2>{props.title}</h2>
        </div>
        <div className="games-container">
          {props.items.map(element => {
            return <SingleItem key={element.id} {...element} />
          })}
        </div>
      </div>
    )
  };

  //####################### SEARCH AND FILTER #######################
  const Nav: FC = () => {

    const Search: FC = () => {
      const searchFunction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement
        const input = form.querySelector('#search-text') as HTMLInputElement
        setSearchTerm(input.value);

        if (recentSearch.length === 10) {
          const tempArray = recentSearch.pop()
          setRecentSearch(recentSearch);
        }
        setRecentSearch([input.value, ...recentSearch]);
      };

      
     
       return (
        <div id="search">
          <form className="search-form" onSubmit={event => searchFunction(event)}>
             <input id="search-text" name="search-text" type="text" placeholder="Search..." autoComplete="off" list="recent-search" />
             <datalist id="recent-search">
               {recentSearch.map((item) =>
                 <option key={recentSearch.indexOf(item)} value={item} />
               )}
             </datalist>
             <button>Search</button>
          </form>
        </div>
      ) 
    };

    const Filter: FC = () => {
      return (
        <div>

        </div>
      )
    }


    return (
      <nav className="nav-bar-components">
        <Search />
        {/* <Filter /> */}
      </nav>
    )
  };


  // MAIN RETURN
  return (
    <div>
      <Nav />
      {data !== undefined && <Header {...data} />}
      <div className="list">
      { foundedItem.length !== 0
        ? foundedItem.map(game => {
          return <SingleItem key={game.id} {...game} />
          })
        : data !== undefined && data.lists.map(element => {
            return <CategoryItem key={element.id} {...element} />
          })}
        </div>  
    </div>
  );
};
const componentsElement = document.getElementById("components");
render(<Components />, componentsElement);












