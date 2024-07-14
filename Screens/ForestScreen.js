import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, ActivityIndicator,Image, StatusBar,SafeAreaView, TouchableOpacity,ImageBackground } from 'react-native';
import axios from 'axios';
import AppLoading from 'expo-app-loading';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { addFavorite } from '../Modules/AsyncStoragesCRUD';


const API_KEY =process.env.EXPO_PUBLIC_API_KEY

function formatDateTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = weekdays[date.getDay()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedDateTime = `${dayOfWeek} ${hours}:${minutes}`;

  return formattedDateTime;
}

const ForestScreen = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleTextInput=(text)=>{
    setQuery(text)
    if(text===""){
      setWeather(null)
      setError("")
      setSuggestions([])
    }
    else{
      fetchSuggestions(text)
    }
  }



  const fetchSuggestions = async (text) => {
    setQuery(text);
    setError("")
    if (text.length > 2) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${API_KEY}`);
        setSuggestions(response.data);
      } catch (error) {
        setError('Error fetching suggestions');
        console.error(error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchWeather = async (selectedLocation) => {
    setLoading(true);
    setQuery(selectedLocation.name);
    setSuggestions([]);
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${selectedLocation.lat}&lon=${selectedLocation.lon}&appid=${API_KEY}&units=metric`)
        //console.log(response.data)
        setWeather(response.data);
    } catch (error) {
      setError('Error fetching weather data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/backgroundImages/pexels-pixelcop-3970396.jpg")} resizeMode='cover' style={styles.backgroundImage}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search country or city..."
        placeholderTextColor="gray"
        value={query}
        onChangeText={handleTextInput}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
          
            <TouchableOpacity  
            activeOpacity={0.2}
            style={styles.suggestionCont}
            onPress={() => {
              fetchWeather(item)
              ////console.log("he pressed : ",item)
             
            }}>
               <Text style={styles.sugText} >
                  {item.name},
                  <Text style={{color:"white",fontWeight:"300"}}>{item.state? " "+item.state+",":"" } {item.country}
                  </Text>
                  </Text>
            </TouchableOpacity>

          )}
        />
      )}
      {loading && <ActivityIndicator size="large" color="#00fa9a" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {weather && (
       <FlatList
       data={weather.list}
       keyExtractor={(item)=> item.dt.toString()}
        ListHeaderComponent={()=>(<Text style={styles.listHeaderStyle}>{weather.city.name}, {weather.city.country}</Text>)}
       ListFooterComponent={()=>(<View style={{height:60}}
       
       >

       </View>)}
        ItemSeparatorComponent={()=>(
        <View style={styles.seperator}>

        </View>
       )}
       renderItem={({item})=>(
        <View style={styles.forecastContainer} >
          <View>
          <Text style={styles.date}>
            {formatDateTime(item.dt)}
            </Text>
            </View>
          <View style={{flexDirection:"row"}}>
          <Text style={styles.date}>
          <Image style={styles.tinyLogo} source={{uri:`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}}  />
         
            {item.weather[0].main}</Text>
            </View>
            <View>
          <Text style={styles.temp}>
            {parseInt(item.main.temp)}°
          </Text>
          </View>

          </View>

       )}
       
       />
       
      
      )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage:{
    flex:1,
  },
  searchInput: {
    height: 50,
    borderColor: '#FFE5E5',
    borderWidth: 1.8,
    borderRadius: 25,
    paddingLeft: 10,
    marginVertical: 10,
    marginHorizontal:8,
    color:"#EEEEEE",
    fontWeight:"400",
    fontSize:20
  },
  suggestion: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize:20,
    fontWeight:"500",
    color:"green"
  },
  errorText: {
    color: 'red',
    fontSize:32,
    marginTop: 10,
  },
  forecastContainer:{
    padding:8,
    marginHorizontal:4,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    borderWidth:0.1,
    elevation:3  
  },
  date:{
    fontSize:18,
    color:"white",
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  temp:{
    color:"white",
    fontSize:60
  },
  listHeaderStyle:{
    marginTop:4,
    color:"#FFE5E5",
    fontSize:32,
    fontFamily:"Roboto",
    fontWeight:"700",
    textAlign:"center",
    
  },
  seperator:{
    height:10,
  },
  sugText:{
    fontSize:21,
    color:"#00fa9a",
    fontWeight:"400",
    fontFamily:"Roboto"
  },
  suggestionCont:{
    paddingHorizontal:10,
    paddingVertical:8,
    marginHorizontal:10,
  }
});

export default ForestScreen;
