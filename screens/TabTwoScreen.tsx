import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ViiniLisatiedot from './ViiniLisatiedot'
import EditViini from './EditViini'


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

export default function Viinilista() {
    const [viini, setViini] = useState<Partial<ViinilistaInterface>>({})
    const [tallennetutViinit, setTallennetutViinit] = useState<any>([])
    const [tallennetutViinitYhteensä, setTallennetutViinitYhteensä] = useState(0)
    const [viiniTietoModal, setViiniTietoModal] = useState(false)
    const [viiniEditModal, setViiniEditModal] = useState(false)
    //Tuotelistan päivityksen muuttujat
    const [refreshViinit, setRefreshViinit] = useState(false)
    const [refreshIndicator, setRefreshIndicator] = useState(false)

    useEffect(() => {
        HaeViinit()
    }, [refreshViinit])

    const HaeViinit = () => {
        let uri = 'https://viinirestapi.azurewebsites.net/api/viini/'
        fetch(uri)
            .then(response => response.json())
            .then((json: ViinilistaInterface) => {
                setTallennetutViinit(json)
                const fetchCount = Object.keys(json).length
                setTallennetutViinitYhteensä(fetchCount)
            })
        setRefreshIndicator(false)
    }

    const refreshJsonData = () => {
      setRefreshViinit(!refreshViinit)
      setRefreshIndicator(true)
    }

    const editViiniFunc = (item: ViinilistaInterface) => {
      setViini(item)  // Asettaa Viini -hooks-objektiin klikatun tuotteen koko objektin
      setViiniEditModal(true) //Edit ikkuna esiin
    }

    const closeLisatietoModal = () => {
      setViiniTietoModal(!viiniTietoModal)
    }

    const closeEditModal = () => {
      setViiniEditModal(!setViiniEditModal)
    }



  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topSection}>
        <View>
          <FontAwesome5 name="wine-glass" size={25} color="#000" />
        </View>  
        <Text style={{ fontSize: 18, color: '#000' }}>{'Viinejä yhteensä: ' + tallennetutViinitYhteensä}</Text>
        <Pressable onPress={() => refreshJsonData()} style={({ pressed }) => [{ backgroundColor: pressed ? 'lightgray' : 'white' }]}>
          <View>
            <Octicons name="sync" size={24} color="black" />
          </View>
        </Pressable>
        <ActivityIndicator size="small" color="#0000ff" animating={refreshIndicator} />
      </View>

      <ScrollView>
        {tallennetutViinit.map((item: ViinilistaInterface) => (
          
          <Pressable 
            key={item.viiniId} 
            onPress={() => {
              setViini(item)
              setViiniTietoModal(true)
            }}
            style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white'}]}
          >

            <View style={styles.wineContainer}>
              <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                <Text style={{ fontSize: 15 }}>{item.viiniNimi}</Text>
                <Text style={{ color: '#8f8f8f' }}>{'RypäleId ' + (item.rypaleId)}</Text>
                <Text style={{ color: '#333333', marginBottom: 10 }}>{'\u00E1 ' + (item.hinta == null ? 'hinta puuttuu ' : item.hinta.toFixed(2)) + '\u20AC'}</Text>
              </View>
              <View style={{ padding: 2, marginRight: 10, marginTop: 30 }}>
                <TouchableOpacity style={[{ width: 32, height: 32 }]} onPress={() => editViiniFunc(item)}>
                  <Octicons name="pencil" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          
          </Pressable>
        ))}
        
        {/* ViiniLisatiedot -komponentin kutsu */}
        {viiniTietoModal ? (
          <Modal
            style={[styles.modalContainer]}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <ViiniLisatiedot closeModal={closeLisatietoModal} passViiniId={viini.viiniId} />

          </Modal>
        ) : null }

        {/* editViiniFunc -komponentin kutsu */}
        {viiniEditModal ? (
          <Modal
            style={[styles.modalContainer]}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <EditViini closeModal={closeEditModal} refreshAfterEdit={refreshJsonData} passViiniId={viini.viiniId} />

          </Modal>
        ) : null }



      </ScrollView>
    </View>
  );
}