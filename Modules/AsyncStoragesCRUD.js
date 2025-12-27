import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY="favorites"
const addFavorite = async (location) => {
    try {
      let favorites = await AsyncStorage.getItem(KEY);
      favorites = favorites ? JSON.parse(favorites) : [];
  
      const locationExists=searchFavorite(location,favorites)
      

      if (!locationExists) {
        favorites.push(location);
        try {
          await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
          console.log("Location added successfully");
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("Location already exists in the list");
      }
    } catch (e) {
      console.log(e);
    }
  };
  

const removeFavorite = async( location )=> {

    try{
        let favorites=await AsyncStorage.getItem(KEY)
        favorites=favorites?JSON.parse(favorites) : []
        if(favorites.length===0){
            console.log("No favorites saved")
            return;
        }
        else{
            favorites=favorites.filter((fav) => (fav.lat!==location.coord.lat &&  fav.lon!==location.coord.lon))
            try{
                await AsyncStorage.setItem(KEY,JSON.stringify(favorites))
            }catch(e)
            {
                console.log(e)
            }
        }

    }
    catch(e){
        console.log(e)
    }
}

const getFavorites=async()=>{
    try{
        let favorites=await AsyncStorage.getItem(KEY)
        favorites=favorites?JSON.parse(favorites):[]
        return favorites

    }catch(e){
        console.error('Error retrieving favorites');
    }
}

const searchFavorite=(location,list)=>{
  const locationString=JSON.stringify(location)
  const locationExists=list.some(fav=>JSON.stringify(fav)===locationString)
  
  return locationExists
}

const checkFavorite = async (lat, lon) => {
  try {
    const favorites = await AsyncStorage.getItem(KEY);
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];

    const exists = parsedFavorites.some((fav) => (fav.lat === lat && fav.lon === lon));
    return exists;
  } catch (error) {
    console.error('Error checking favorites', error);
    return false;
  }
};


export  {addFavorite,removeFavorite,getFavorites,searchFavorite,checkFavorite}