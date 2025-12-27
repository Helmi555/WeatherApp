import React, { useState, useEffect } from 'react';
import { View, Text, Button,StyleSheet,SafeAreaView,ImageBackground,Image, StatusBar,TouchableOpacity} from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import ForestScreen from './Screens/ForestScreen';
import FavoritesScreen from './Screens/FavoritesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome"



const Tab=createBottomTabNavigator()

export default function App(){

  return (
    <NavigationContainer >
       <StatusBar
        hidden={false}
        
      
      />
    <Tab.Navigator 
    
    
    screenOptions={
  
      {
            
            tabBarStyle: { backgroundColor: '#7E48B7',
              borderTopWidth:1,
              borderColor: '#5A4E96',
              borderTopLeftRadius:30,
              borderTopRightRadius:30,
              borderLeftWidth:1,
              borderRightWidth:1,
              position: 'absolute',
              elevation: 0,
              height:50
             }, 
            tabBarActiveTintColor: '#FFE5E5', // Bright Purple
            tabBarInactiveTintColor: '#AC87C5', // Gray
            tabBarLabelStyle: { fontSize: 14,fontWeight:"900" },
            headerShown:false,
            tabBarHideOnKeyboard:true,
            labelStyle: { fontSize: 14, fontWeight: 'bold' },
            }}
            sceneContainerStyle={styles.root}

          
    >
      <Tab.Screen name="Home" component={HomeScreen} 
      options={{
        tabBarIcon:({size,color})=>(
                    <Icon name="home" size={size?33:size}  color={color} />
                )}} />


      <Tab.Screen  name="Forecast" component={ForestScreen} 
      options={{
        title:"4 Days Forecast",
        tabBarLabel:"Forecast",
        tabBarIcon:({size,color})=>(
          <Icon name="cloud" size={size?33:size} color={color} />
        )}}
        
      />
      <Tab.Screen 
      name="Favorites"
      component={FavoritesScreen}
      options={{
        title:"City Manager",
        tabBarLabel:"Favorites",
        headerTitleStyle:{color:"white"},
        headerBackgroundContainerStyle:styles.headerBackgroundContainerStyle,
        tabBarIcon:({size,color})=>(
          <Icon name="star" size={size?31:size} color={color} />
        ),
        headerShown:true,
        
        headerTransparent:true,
        headerRight:({color})=>(
          <TouchableOpacity  style={{paddingRight:20}} activeOpacity={0.2} onPress={()=>setModalVisible(true)}>
          <Icon name='plus' size={32} color={color}    />
          </TouchableOpacity>
        )
       
      }}
    
      />
     
     </Tab.Navigator>
     </NavigationContainer>

  
  );
};

const styles=StyleSheet.create({
  root:{
    flex:1,
  },
  textStyle:{
    fontFamily:"Roboto",
    fontSize:24,
    fontWeight:"bold",
    color:"purple"
  },
  headerBackgroundContainerStyle:{
    borderBottomWidth:2,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    borderRightWidth:1,
    borderLeftWidth:1,

  }
})

