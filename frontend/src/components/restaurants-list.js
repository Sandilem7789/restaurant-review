import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

//this function is structured this way because we wanna pass in some props
const RestaurantsList = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchZip, setSearchZip ] = useState("");
  const [searchCuisine, setSearchCuisine ] = useState("");
  const [cuisines, setCuisines] = useState(["All Cuisines"]);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  //Functions for searching the restaurants: going to be used in the form
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  };

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
    
  };

  const retrieveRestaurants = () => {
    RestaurantDataService.getAll()
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(response => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  //refreshes the list of restaurants
  const refreshList = () => {
    retrieveRestaurants();
  };

  //helper function to be used by the 'findBy...' functions
  const find = (query, by) => {
    RestaurantDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //search functions: they use the helper function
  const findByName = () => {
    find(searchName, "name")
  };

  const findByZip = () => {
    find(searchZip, "zipcode")
  };

  const findByCuisine = () => {
    if (searchCuisine == "All Cuisines") {
      refreshList();
    } else {
      find(searchCuisine, "cuisine")
    }
  };

  return (
    <div>
      <div className='row pb-4'>
        {/*Search By Name*/}
        <div className='col-sm-4'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              placeholder='Search by name'
              value={searchName}
              onChange={onChangeSearchName}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={findByName}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/*Search By Zip*/}
        <div className='col-sm-4'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              placeholder='Search by zip'
              value={searchZip}
              onChange={onChangeSearchZip}
            />
            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={findByZip}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/*Search By Cuisine*/}
        <div className='col-md-4'>
          <div className='input-group'>
            <select onChange={onChangeSearchCuisine}>
              {cuisines.map((cuisine) => {
                return (
                  <option value={cuisine}> {cuisine.substr(0, 20)} </option>
                );
              })}
            </select>

            <div className='input-group-append'>
              <button
                className='btn btn-outline-secondary'
                type='button'
                onClick={findByCuisine}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*Results of restaurants found*/}
      <div className='row'>
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            <div className='col-lg-4 pb-1' key={restaurant.address.street}>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>{restaurant.name}</h5>
                  <p className='card-text'>
                    <strong>Cuisine: </strong>
                    {restaurant.cuisine}
                    <br />
                    <strong>Address: </strong>
                    {address}
                  </p>
                  <div className='row'>
                    <Link
                      to={"/restaurants/" + restaurant._id}
                      className='btn btn-primary col-lg-5 mx-1 mb-1'
                    >
                      View Reviews
                    </Link>
                    <a
                      target='_blank'
                      href={"https://www.google.com/maps/place/" + address}
                      className='btn btn-primary col-lg-5 mx-1 mb-1'
                    >
                      View Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantsList;