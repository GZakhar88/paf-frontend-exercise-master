import React from 'react';
import { render } from 'react-dom';

const url: string = '/api/games/lists.json';
  
  // [X] 3. Fetch JSON-data from the following url: `/api/games/lists.json`
async function fetchData(inputUrl: string) {
    try {
      const requestData = await fetch(inputUrl);
      const data = await requestData.json();
      // setLists(data)
      console.log(data)
    } catch (error) {
      console.log(error)
  }
};
  
fetchData(url);
  






