
import React, { useState, useEffect,useLayoutEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Text,View,SafeAreaView,StyleSheet,ImageBackground,Alert,ToastAndroid, FlatList,Modal,TouchableOpacity, Pressable, StatusBar, Platform, Dimensions,TextInput, Keyboard } from "react-native"
import {addFavorite,removeFavorite,getFavorites,searchFavorite} from "../Modules/AsyncStoragesCRUD"
import Icon from "react-native-vector-icons/FontAwesome"
import axios from 'axios'
import Config from "react-native-config"

const API_KEY =process.env.EXPO_PUBLIC_API_KEY

console.log(API_KEY)
export default function FavoritesScreen  ({navigation}){

  const [modalVisible, setModalVisible] = useState(false);
  const [favorites,setFavorites]=useState([])
  const [favoritesWeather,setFavoritesWeather]=useState([])
  const [text,setText]=useState("")
  const [suggestions,setSuggestions]=useState([])
  const[error,setError]=useState("")

  useEffect(()=>{
    getFavorites().then((favorites)=>{
      setFavorites(favorites)
      })

  },[])


useEffect(()=>{
  if(favorites.length>0){
    fetchWeather(favorites)
  }
},[favorites])

const fetchWeather = async (favorites) => {
  const list=[]

  for (let index = 0; index < favorites.length; index++) {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${favorites[index].lat}&lon=${favorites[index].lon}&appid=${API_KEY}&units=metric`)
      list.push(response.data)
  } catch (error) {
    setError('Error fetching weather data');
    console.error(error);
  } 
  }
  setFavoritesWeather(list)
};

const fetchSuggestions=async (query)=>{
  setText(query)
  if(query.length>2){
    try{
    const response= await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
    setSuggestions(response.data)
    }
    catch(e){
      console.log(e)
    }
  }
  else{
    setSuggestions([])
  }
}


const handleSugPress= async (item)=>{
  try {

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=${API_KEY}&units=metric`)
    //console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&appid=${API_KEY}&units=metric`)
    

    const newWeather=response.data

const location={
  "country":item.country,
  "lat":newWeather.coord.lat,
  "lon":newWeather.coord.lon,
  "name":item.name,
  "state":item.state
}

  if (searchFavorite(location, favorites)) {
ToastAndroid.show("This city has already been added",ToastAndroid.SHORT)
  }
  else{
    setText("")
    setModalVisible(false)
    setSuggestions([])
    
      await addFavorite(location)
      setFavorites(fav=>[...fav,location])
      setFavoritesWeather(prevWeather=>[...prevWeather,newWeather])
  
    } 
  }catch (error) {
    setError('Error fetching weather data');
    console.error(error);
  } 

}

const deleteCity=async(item)=>{

  try{
    await removeFavorite(item)
    await getFavorites()
    .then
    ((fav)=>{setFavorites(fav)})
    .catch((e)=>console.log(e))
    //.log("Dans le remove \nle fav est : ",favorites,"\nAnd le item is: ",item)
    const favoritesWeatherAlt=favoritesWeather.filter((fav)=> (fav.coord.lat!==item.coord.lat && fav.coord.lon!==item.coord.lon))
    setFavoritesWeather(favoritesWeatherAlt)
    //console.log("fav weather : ",favoritesWeather)
  }
  catch(e){
    console.log(e)
  }


}

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ color }) => (
        <TouchableOpacity style={{ paddingRight: 20 }} activeOpacity={0.2} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={32} color={color} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, setModalVisible]);
    return (

      <SafeAreaView  style={styles.mainCont}>
      {/*AsyncStorage.clear()*/}
      {/*console.log(getFavorites())*/}
        <ImageBackground  source={require("../assets/backgroundImages/studio-background-concept-abstract-empty-light-gradient-purple-studio-room-background-product.jpg")} resizeMode="cover" style={styles.backgroundImage}>
        
        <Modal
        animationType='fade'
        transparent={false}
        visible={modalVisible}
        onRequestClose={()=>{
          setModalVisible(false)
          setSuggestions([])  
          setText("")
        }}
        style={styles.modal}
        statusBarTranslucent={true}
        
        >
          <View  style={styles.modal} >

            
            <View style={styles.entete}>
            <TouchableOpacity style={{marginRight:1}} 
            onPress={()=>{
              setModalVisible(false)
              setText("")
              setSuggestions([])
            }} 
            activeOpacity={0.6}
            >
            <Icon name="arrow-left" size={25} color="#888"  />
            </TouchableOpacity>

            <View  style={styles.search}>
            
          <Pressable onPress={() => setText("")}  >
              <Icon name="search" size={22} color="#888" />
            </Pressable>
            <TextInput style={styles.input} placeholder='Search' value={text} autoFocus={true}
            placeholderTextColor="#777" onChangeText={fetchSuggestions}
           onSubmitEditing={Keyboard.dismiss}
           >
            </TextInput>
            </View>

            </View>

            <View style={{flex:1,alignContent:"flex-start"}}>
            <FlatList
            data={suggestions}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={({item})=>(
              <Pressable style={styles.suggestion}  onPressIn={()=>handleSugPress(item)} >
                <Text style={styles.sugText} >
                  {item.name},
                  <Text style={{color:"white"}}>{item.state? " "+item.state+",":"" } {item.country}
                  </Text>
                  </Text>
              </Pressable>
            )}

            />

            </View>

          </View>
        </Modal>
            
        <FlatList 
        showsVerticalScrollIndicator={false}
        data={favoritesWeather}
        keyExtractor={(item,index)=>index.toString()}
        ItemSeparatorComponent={()=>(
          <View style={{height:10}}></View>
        )}
        ListFooterComponent={()=>(<View style={{height:50}}
       
          >
   
          </View>)}
        ListHeaderComponent={()=>(
          <View style={{height:10}}>

          </View>
        )}
        renderItem={({item})=>(

          
          <TouchableOpacity style={styles.locationContainer}
          onPress={()=>{navigation.navigate("Home",{lat:item.coord.lat,lon:item.coord.lon})}}
          activeOpacity={0.75}
          active
          >

            <View style={styles.leftCont}>
            <Text style={styles.location}>{item.name}</Text>

            <Text style={{fontSize:17, color:"black",marginTop:10}}>{item.weather[0].main}</Text>
            </View>

            <View style={styles.rightCont}>

            <Text style={styles.degree}>{parseInt(item.main.temp)}°</Text>
            <Text style={{fontSize:17, color:"black",fontWeight:"600"}}>{parseInt(item.main.temp_min)}° / {parseInt(item.main.temp_max)}°</Text>
            
            </View>
            <View style={{paddingLeft:8}} >
              <TouchableOpacity onPress={()=>{deleteCity(item)}} activeOpacity={0.2} >     
             <Icon name="star" size={28} color="gold" />
             </TouchableOpacity>
            </View>

          </TouchableOpacity>
          
        )}
        />
        </ImageBackground>
      </SafeAreaView>

    )


  }

  const styles=StyleSheet.create({
    mainCont:{
      flex:1,
    },
    backgroundImage:{
      flex:1,
      paddingTop:56,
      paddingHorizontal:10,
      paddingBottom:4,
      
    }, 
    locationContainer:{
      marginVertical:4,
      marginHorizontal:4,
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
      paddingLeft:19,
      paddingRight:10,
      paddingVertical:6,
      borderColor:"#ddd",
      borderWidth:0.5,
      borderRadius:10,
      backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    },
    location:{
      fontSize:20,
      color:'black',
      fontWeight:"700",
    },
    degree:{
      fontSize:36,
      color:'black',
    },
    leftCont:{
      flex:1,
      justifyContent:"space-around",
    },
    rightCont:{
      alignItems:"flex-end"
    },
    modal:{
      flex:1,
      backgroundColor:"#111",
      paddingTop:StatusBar.currentHeight+10,
      paddingRight:10,
      paddingLeft:4
    },
    entete:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingLeft:8,
      paddingRight:10,
      paddingRight:6,
      marginBottom:18,
    },
    search:{
      flexDirection:"row",
      paddingVertical:2,
      alignItems:"center",
      backgroundColor:"#222",
      borderWidth:1,
      borderRadius:10,
      paddingLeft:6,
      paddingRight:60,
      width:310,
      marginTop:4,
      marginHorizontal:10

    },
    input:{
      height:48,
      width:270,
      borderColor:"#000",
      paddingHorizontal:8,
      paddingVertical:10,
      fontSize:18,
      backgroundColor:"#222",
      color:"white"

    },
    icon: {
      position: 'absolute',
      top: 8, // Adjust vertically as needed
      left: 12, // Adjust horizontally as needed
    },
    sugText:{
      fontSize:22,
      color:"green",
      fontWeight:"400",
      fontFamily:"Roboto"
    },
    suggestion:{
      paddingVertical:10,
      paddingHorizontal:12,
    }

  })