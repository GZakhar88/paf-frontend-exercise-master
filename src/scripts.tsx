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
  const SingleItem: FC<item> = (props) => {
    return (
      <div className="single-item">
        <img src={props.image} />
        <p>{props.title}</p>
      </div>
    );
  };

  const ListItem: FC<list> = (props) => {
    return (
      <div className="list-item">
        <h2>{props.title}</h2>
        {props.items.map(element => {
          return <SingleItem  key={element.id} {...element} />
        })}
      </div>
    )
  };

  return (
    <div className="app">
      { data !== undefined && data.lists.map(element => {
        return <ListItem  key={element.id} {...element}/>
      })}
    </div>
  )
  
}
  
  
const rootElement = document.getElementById("root");
render(<App />, rootElement);





