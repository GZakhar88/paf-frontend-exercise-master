import * as React from 'react';
import { FC } from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';

const App = () => {

//------------------------------------TYPES-----------------------------------//
  type data = {
    title: string;
    description: string;
    lists: Array<list>
  };
  type item = {
    id: number;
    title: string;
    provider: string;
    image: string;
  };
  type list = {
    id: string;
    title: string;
    items: Array<item>
  };
  
//------------------------------------STATES-----------------------------------//
  const [data, setData] = useState<data>();



//------------------------------------FUNCTIONS-----------------------------------//
  async function fetchData() {
      try {
        const requestData = await fetch('/api/games/lists.json');
        const response: data = await requestData.json();
        setData(response)
      } catch (error) {
        console.log(error)
    }
  };

  useEffect(() => {
    fetchData()
  }, []);


//------------------------------------COMPONENTS-----------------------------------//
  const Header: FC<data> = (props) => {
    return (
      <div className="list-header">
        <h1>{props.title}</h1>
        <hr />
        <p>{props.description}</p>
      </div>
    );
  };

  const SingleItem: FC<item> = (props) => {
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
          return <SingleItem  key={element.id} {...element} />
        })}
        </div>
      </div>
    )
  };

  return (
    <div className="app">
      { data !== undefined && <Header {...data}/>}
      { data !== undefined && data.lists.map(element => {
        return <CategoryItem  key={element.id} {...element}/>
      })}
    </div>
  )
  
}
  

const listElement = document.getElementById("list");
render(<App />, listElement);






