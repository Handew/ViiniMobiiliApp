import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IViinilista {
    viiniId: number
    viiniNimi: string
    tyyppi: string
    rypale: string
    maa: string
    hinta: number
    tahdet: number
    kommentti: string
    // Kuva: 
    // Viivakoodi: string 
}

const ViiniLisatiedot = ({ passViiniId, closeModal }:any) => {
    const [viini, setViini] = useState<Partial<IViinilista>>({})
    const [star, setStar] = useState(0)

    useEffect(() => {
      HaeViiniInfo()
    }, [passViiniId])

    const HaeViiniInfo = () => {
      let uri = 'https://viinirestapi.azurewebsites.net/api/viini/lisatiedot/' + passViiniId
      fetch(uri)
        .then(response => response.json())
        .then((json: IViinilista) => {
          setViini(json)
        })
    }
    
    if (viini){
      return (

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
              <View style={styles.modalInfo}>
              </View>
  
              {/* <View style={styles.modalInfo}>
                <Rating
                            showRating
                            type="star"
                            fractions={1}
                            startingValue={Number(viini.tahdet)}
                        >
                </Rating>
              </View> */}
  
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Viinin nimi: '}</Text>
                  <Text style={styles.modalText}>{viini.viiniNimi}</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Tähdet: '}</Text>
                  <Text style={styles.modalText}>{viini.tahdet}</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Hinta: '}</Text>
                  <Text style={styles.modalText}>{viini.hinta} €</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Tyyppi: '}</Text>
                  <Text style={styles.modalText}>{viini.tyyppi}</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Rypäle: '}</Text>
                  <Text style={styles.modalText}>{viini.rypale}</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Maa: '}</Text>
                  <Text style={styles.modalText}>{viini.maa}</Text>
              </View>
              <View style={styles.modalInfo}>
                  <Text style={styles.modalTextTitle}>{'Kommentti: '}</Text>
                  <Text style={styles.modalText}>{viini.kommentti}</Text>
              </View>
  
  
  
            <TouchableHighlight 
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                closeModal()
              }}
              >
                <Text style={styles.textStyle}>Sulje</Text>
              </TouchableHighlight>
          </View>
        </View>
      )
    } else {
      return (
        <Text>Loading</Text>
      )
    }
    
}
export default ViiniLisatiedot