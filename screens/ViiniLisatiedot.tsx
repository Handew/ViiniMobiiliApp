import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ViinilistaInterface {
    viiniId: number
    viiniNimi: string
    tyyppiId: number
    rypaleId: number
    maaId: number
    hinta: number
    tahdet: number
    kommentti: string
    // Kuva: 
    // Viivakoodi: string 
}

const ViiniLisatiedot = ({ passViiniId, closeModal }:any) => {
    const [viini, setViini] = useState<Partial<ViinilistaInterface>>({})
    const [viiniId, setViiniId] = useState(passViiniId)

    useEffect(() => {
      HaeViiniInfo()
    }, [passViiniId])

    const HaeViiniInfo = () => {
      let uri = 'https://viinirestapi.azurewebsites.net/api/viini/' + viiniId
      fetch(uri)
        .then(response => response.json())
        .then((json: ViinilistaInterface) => {
          setViini(json)
        })
    }

    return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Viinin tarkemmat tiedot:</Text>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Viini Id: '}</Text>
                <Text style={styles.modalText}>{viini.viiniId}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Viinin nimi: '}</Text>
                <Text style={styles.modalText}>{viini.viiniNimi}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Tyyppi Id: '}</Text>
                <Text style={styles.modalText}>{viini.tyyppiId}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Rypäle Id: '}</Text>
                <Text style={styles.modalText}>{viini.rypaleId}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Maa Id: '}</Text>
                <Text style={styles.modalText}>{viini.maaId}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Kommentti: '}</Text>
                <Text style={styles.modalText}>{viini.kommentti}</Text>
            </View>
            <View style={styles.modalInfo}>
                <Text style={styles.modalTextTitle}>{'Tähdet: '}</Text>
                <Text style={styles.modalText}>{viini.tahdet}</Text>
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
}
export default ViiniLisatiedot