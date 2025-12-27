import React, { useState, useEffect } from 'react';
import { View, Text, Button ,StyleSheet, SafeAreaView,StatusBar,Image,ActivityIndicator,Dimensions,ScrollView,RefreshControl} from 'react-native';
import * as Location from 'expo-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const {displayHeight}=Dimensions.get('window')

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading,setLoading]=useState(true)
  const [refreshing,setRefreshing]=useState(false)
  const insets=useSafeAreaInsets()

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
    console.log("the status is" ,status)
    if (status !== 'granted') {
      setLoading(false)
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    fetchWeather(location.coords.latitude,location.coords.longitude)
  };

  useEffect(() => {
    getLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
    return (
      <View style={styles.mainDenyCont} >
        <Text style={{color:"#FDA403",fontSize:32,fontWeight:"bold",textAlign:"center",justifyContent:"center",elevation:5,paddingVertical:20,paddingHorizontal:10,borderWidth:0.1}}>{text}</Text>
      </View>
    )
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }

  const onRefresh=()=>{
    setRefreshing(true)
    getLocation()
    setRefreshing(false)
  }

  const fetchWeather =async (lat,lon)=>{
    try{
      const response=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=00165ea431744c358350696f4c910d43&units=metric`)
      console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=00165ea431744c358350696f4c910d43&units=metric`)
      
      console.log(response.data)
        setWeather(response.data)
      setLoading(false)
    }
    catch(error){
      console.warn(error)
    }
  }

   {
      <SafeAreaView style={styles.fetchDataCont}>
        <ScrollView 
        style={styles.scrollStyle}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          />
        } >
          <View style={styles.loadingContainer} >
        <Text style={[styles.cityName]}>Fetching Data...</Text>
        <ActivityIndicator size="50" color="#0ff" />
        </View>
        </ScrollView>
      </SafeAreaView>
    
  }
  if(weather){
  return (
    <SafeAreaView style={[styles.mainContainer,{paddingBottom:insets.bottom}]}>
      <ScrollView style={styles.scrollStyle} scrollEnabled={false} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />
      }>
      <View style={styles.blueContainer}>
        
      <Text style={styles.cityName}>{weather.name} - {weather.sys.country}</Text>
      <Text style={styles.date}>{new Date().toLocaleString(weather.sys.country, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</Text>


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
      <View style={{justifyContent:"flex-start", alignItems:"center" }}>
      <Image source={require("../assets/weather-9402028-7718747.webp")} resizeMode='contain' style={styles.image} />
      </View>
      </View>

      <View style={styles.whiteContainer}>
        <Text style={{fontSize:20,color:"#51008B",fontWeight:"700"}}>
          Weather now
        </Text>
        <View style={styles.whiteRow}>
          <View style={styles.whiteColumn} > 
          <View style={styles.circle} >
          <FontAwesome name="thermometer-quarter" size={40} color="#51008B" />
          </View>
          <View style={{justifyContent:"space-evenly" ,alignItems:"center"}}>
          <Text style={styles.temp}> Min temp</Text>
          <Text style={styles.degree}>{parseInt(weather.main.temp_min)}</Text>
          </View>
          </View>
          {/*second column */}
          <View style={styles.whiteColumn}>
          <View style={styles.circle}>
          <FontAwesome name="thermometer-full" size={40} color="#51008B" />
          </View>
          <View style={{justifyContent:"space-evenly", alignItems:"center"}}>

          <Text style={styles.temp}> Max temp</Text>
          <Text style={styles.degree}>{parseInt(weather.main.temp_max)}</Text>

          </View>
          </View>

        </View>
        {/*second line */}
        <View style={styles.whiteRow}>
          <View style={styles.whiteColumn} > 
          <View style={styles.circle} >
          <MaterialCommunityIcons name="weather-windy" size={40} color="#51008B" />
          </View>
          <View style={{justifyContent:"space-evenly" ,alignItems:"center"}}>
          <Text style={styles.temp}>Wind Speed</Text>
          <Text style={styles.degree}>{weather.wind.speed}</Text>
          </View>
          </View>
          {/*second column */}
          <View style={styles.whiteColumn}>
          <View style={styles.circle}>
          <FontAwesome name="tint" size={40} color="#51008B" />
          </View>
          <View style={{justifyContent:"space-evenly", alignItems:"center"}}>

          <Text style={styles.temp}> Humidity</Text>
          <Text style={styles.degree}>{parseInt(weather.main.humidity)}%</Text>

          </View>
          </View>

        </View>

      </View>
      </ScrollView>
    </SafeAreaView>
  )
};
};

const styles=StyleSheet.create({
  mainDenyCont:{
    flex:1,
    backgroundColor:"#51008B",
    justifyContent:'center',
    alignItems:"center",
    paddingBottom:56
    },
      fetchDataCont:{
        flex:1,
        backgroundColor:"#51008B",
    justifyContent:'center',
    alignItems:"center",
    },
    loadingContainer:{
      marginTop:100,
      flex: 1,
      elevation:3
    },
    mainContainer:{ 
      flex:1,
      backgroundColor:"#51008B",
   },
   blueContainer:{
      flex:4,
      paddingHorizontal:16,
      paddingTop:4,
  },
   cityName:{
    fontWeight:"bold",
    fontSize:28,
    color:"white",
    fontFamily:"Roboto"
   },
   date:{
    fontSize:16,
    color:"white",
   },
   mainTemp:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:18,
   },
   image:{
    height:200,
    width:250,
   },
   whiteContainer:{
    flex:2,
    backgroundColor:"white",
    paddingHorizontal:18,
    borderTopLeftRadius:38,
    borderTopRightRadius:38,
    paddingVertical:10,
    marginVertical:4,
    
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
    width: 65, // Adjust the size of the circle
    height: 65, // Adjust the size of the circle
    borderRadius: 35, // Half of the width and height to make it a circle
    backgroundColor: 'lightgrey', // Gray background color
    justifyContent: 'center', // Center the icon horizontally
    alignItems: 'center', // Center the icon vertically
  },
  temp:{
    fontSize:14,
    color:"black",
    fontWeight:"500"
  },
  degree:{
    fontSize:32,
    color:"#51008B",
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
    height:100
  },
  scrollStyle:{
    flex: 1,
    height: displayHeight,
  }

})


export default HomeScreen;
