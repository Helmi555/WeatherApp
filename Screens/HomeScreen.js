import React, { useState, useEffect } from 'react';
import { View, Text, Button ,StyleSheet, SafeAreaView,StatusBar,Image,ActivityIndicator,Dimensions,ScrollView,RefreshControl, ImageBackground,Platform} from 'react-native';
import * as Location from 'expo-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { checkFavorite } from '../Modules/AsyncStoragesCRUD';
import { useIsFocused } from '@react-navigation/native';
import LottieView from 'lottie-react-native';


//const {displayHeight}=Dimensions.get('window')
const API_KEY =process.env.EXPO_PUBLIC_API_KEY

const HomeScreen = ({navigation,route}) => {

  const {lat=null , lon=null} =route.params || {}  
  const isFocused=useIsFocused()

  const [errorMsg, setErrorMsg] = useState("");
  const [loading,setLoading]=useState(true)
  const [refreshing,setRefreshing]=useState(false)
  const insets=useSafeAreaInsets()
  const [isDay,setIsDay]=useState(true)
  const [weather,setWeather]=useState({
    coord: {},
    weather: [],
    main: {},
    wind: {},
    clouds: {},
    dt: 0,
    sys: {},
    timezone: 0,
    id: 0,
    name: "",
    cod: 0,
  })


  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    //console.log("the status is" ,status)
    //console.log(weather.weather[0],loading)
    if (status !== 'granted') {
      setLoading(false)
      setErrorMsg('Permission to access location was denied');
      return;
    }

    //console.log("ohhhh",status !== 'granted')
    let location = await Location.getCurrentPositionAsync({});
    //console.log("location",location)

      fetchWeather(location.coords.latitude,location.coords.longitude)

   
  };


useEffect(()=>{
  const localHour=getLocalTime(weather.timezone).getHours()
  //console.log("bassa",weather,localHour)

  setIsDay(localHour>=6 && localHour<18)
  //console.log("Is day ",localHour>=6 && localHour<18)
},[weather.timezone]) 

  const fetchData = async () => {
    if (lat !== null && lon !== null) {
      //console.log(lat,lon)
      try {
        const isFavorite = await checkFavorite(lat, lon);
        if (!isFavorite) {
          await getLocation();
        } else {
          await fetchWeather(lat, lon);
        }
      } catch (error) {
        console.error("Error checking favorite or fetching data:", error);
        // Handle error state
      }
    } else {
      await getLocation();
    }
  };

  const getLocalTime = (timezoneOffset) => {
    const utcDate = new Date();
    const localDate = new Date(utcDate.getTime() + (timezoneOffset * 1000));
    return localDate;
  };

  const formatLocalTime = (localDate, countryCode) => {
    return localDate.toLocaleString(countryCode, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: false 
    });
  };
  
  
  useEffect(() => {
    fetchData();
  }, [lat, lon,isFocused]);
  

  const onRefresh=()=>{
    setRefreshing(true)
    setErrorMsg("")
    fetchData()
    setRefreshing(false)
  }

  const fetchWeather =async (lat,lon)=>{
    //console.log("ciao")
    try{
      const response=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      //console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=00165ea431744c358350696f4c910d43&units=metric`)
      
      setWeather(response.data)
      setLoading(false)
    }
    catch(error){
      console.warn(error)
    }
  }

  return (
    <SafeAreaView style={[styles.mainContainer,]}>
      <ScrollView contentContainerStyle={styles.scrollStyle} scrollEnabled={false} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />
      }>


          {
            errorMsg  &&(
              
                <View style={styles.mainDenyCont} >
                  <Text style={{color:"#FDA403",fontSize:32,fontWeight:"bold",textAlign:"center",justifyContent:"center",elevation:5,paddingVertical:20,paddingHorizontal:10,borderWidth:0.1}}>{errorMsg}</Text>
                </View>
              
            )
          }

        {
          loading &&(
            
          <View style={styles.loadingContainer} >
          <Text style={[styles.cityName,{color:"white"}]}>Fetching Data...</Text>
          <ActivityIndicator size="50" color="#0ff" />
          </View>

          )}

         

          {
            weather.weather[0] && !loading && (
           
                        
              
              <ImageBackground  source={isDay?require("../assets/backgroundImages/studio-background-concept-abstract-empty-light-gradient-purple-studio-room-background-product.jpg"): require("../assets/backgroundImages/pexels-pixelcop-3970396.jpg")} resizeMode="cover" style={styles.backgroundImage}>
              <View style={styles.blueContainer}>


              <Text style={[styles.cityName, {color:isDay?"#AC87C5":"white"}]}>{weather.name} - {weather.sys.country}</Text>
              
              <Text style={styles.date}>{formatLocalTime(getLocalTime(weather.timezone), weather.sys.country)}</Text>
        
        
              <View style={styles.mainTemp}> 
                <View style={{justifyContent:"flex-start", alignItems:"flex-start"}}>
                <Image style={styles.tinyLogo} source={{uri:`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}}  />
                <Text style={{fontSize:22,color:"white",alignSelf:"center",fontWeight:"bold"}}>{weather.weather[0].main}</Text>
                <Text style={{fontSize:18,color:"white",alignSelf:"center",fontWeight:"300"}}>{weather.weather[0].description}</Text>
        
                </View>
                <View>
                <Text style={styles.mainDegree}>
                {parseInt(weather.main.temp)}°
              </Text>
                </View>
                
              </View>
              <View style={{flex:1,justifyContent:"center", alignItems:"center" }}>
              {/*<Image source={require("../assets/weather-9402028-7718747.webp")} resizeMode='contain' style={styles.image} />*/}

              <LottieView style={{width:"100%",height:"150%"}} source={require("../assets/Lottie/Animation - 1719321280454.json")}  autoPlay  loop/>
          
              </View>
              </View>
           
        
              <View style={styles.whiteContainer}>
                <Text style={{fontSize:20,color:"#720e9e",fontWeight:"700"}}>
                  Weather now
                </Text>
                <View style={styles.whiteRow}>
                  <View style={styles.whiteColumn} > 
                  <View style={styles.circle} >
                  <FontAwesome name="thermometer-quarter" size={40} color="#8A2BE2" />
                  </View>
                  <View style={{justifyContent:"space-evenly" ,alignItems:"center"}}>
                  <Text style={styles.temp}> Min temp</Text>
                  <Text style={styles.degree}>{parseInt(weather.main.temp_min)}°</Text>
                  </View>
                  </View>
                  {/*second column */}
                  <View style={styles.whiteColumn}>
                  <View style={styles.circle}>
                  <FontAwesome name="thermometer-full" size={40} color="#8A2BE2" />
                  </View>
                  <View style={{justifyContent:"space-evenly", alignItems:"center"}}>
        
                  <Text style={styles.temp}> Max temp</Text>
                  <Text style={styles.degree}>{parseInt(weather.main.temp_max)}°</Text>
        
                  </View>
                  </View>
        
                </View>
                {/*second line */}
                <View style={styles.whiteRow}>
                  <View style={styles.whiteColumn} > 
                  <View style={styles.circle} >
                  <MaterialCommunityIcons name="weather-windy" size={40} color="#8A2BE2" />
                  </View>
                  <View style={{justifyContent:"space-evenly" ,alignItems:"center"}}>
                  <Text style={[styles.temp,{alignSelf:"flex-start"}]}>Wind Speed</Text>
                  <Text style={styles.degree}>{parseFloat((weather.wind.speed).toFixed(1))}<Text style={{fontWeight:"500",fontSize:30}}>m/s</Text></Text>
                  </View>
                  </View>
                  {/*second column */}
                  <View style={styles.whiteColumn}>
                  <View style={styles.circle}>
                  <FontAwesome name="tint" size={40} color="#8A2BE2" />
                  </View>
                  <View style={{justifyContent:"space-evenly", alignItems:"center"}}>
        
                  <Text style={styles.temp}> Humidity</Text>
                  <Text style={styles.degree}>{parseInt(weather.main.humidity)}%</Text>
        
                  </View>
                  </View>
        
                </View>
        
              </View>
              </ImageBackground>



            )}
  
      </ScrollView>
    </SafeAreaView>
  )
  
};

const styles=StyleSheet.create({
  mainDenyCont:{
    flex:1,
    backgroundColor:"#8A2BE2",
    justifyContent:'center',
    alignItems:"center",
    },
      fetchDataCont:{
        flex:1,
        backgroundColor:"#8A2BE2",
    justifyContent:'center',
    alignItems:"center",
    },
    loadingContainer:{
      flex: 1,
      elevation:3,
      justifyContent:'center',
      alignItems:"center",
    },
    backgroundImage:{
    flex:1,
    width:"100%",
    height:"100%",
    },
    mainContainer:{ 
      flex:1,
      backgroundColor:"#8A2BE2",
   },
   blueContainer:{
      flex:4,
      paddingHorizontal:16,
      paddingTop:4,
  },
   cityName:{
    fontWeight:"bold",
    fontSize:28,
    fontFamily:"Roboto"
   },
   date:{
    fontSize:16,
    color:"#E6E6FA",
   },
   mainTemp:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:18,
    marginHorizontal:-6
   },
   whiteContainer:{
    flex:2,
    backgroundColor:"white",
    paddingHorizontal:18,
    borderTopLeftRadius:38,
    borderTopRightRadius:38,
    paddingTop:10,
    paddingBottom:40
   },
   whiteRow:{flex:1,
    flexDirection:"row", 
    justifyContent:"space-between",
    paddingVertical:16,
    },
    whiteColumn:{
      flexDirection:"row"
    },
   circle: {
    width: 65, 
    height: 65, 
    borderRadius: 35,
    backgroundColor: '#eee',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  temp:{
    fontSize:13,
    fontWeight:"400",
    color:"#8A2BE2"
  },
  degree:{
    fontSize:32,
    color:"#8A2BE2",
    fontWeight:"bold",
    paddingLeft:4,
  },
  mainDegree:{
    fontSize:76,
    color:"white",
    fontWeight:"bold",
    fontFamily:""
  },
  tinyLogo:{
    width:150,
    height:100,
    elevation:3
  },
  scrollStyle:{
    flex: 1,
  }

})


export default HomeScreen;
