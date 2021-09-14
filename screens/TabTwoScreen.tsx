import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableHighlight } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import styles from '../styles/styles'

interface ViinilistaInterface {
    viiniId: number
    viiniNimi: string
    tyyppiId: number
    rypaleId: number
    maaId: number
    hinta: number
    // Kuva: 
    // Viivakoodi: string 
}

export default function Viinilista() {
    const [tallennetutViinit, setTallennetutViinit] = useState<any>([])
    const [tallennetutViinitYhteensä, setTallennetutViinitYhteensä] = useState(0)
    //Modaalin kentät alkaa
    const [ViiniId, setViiniId] = useState(0)
    const [ViiniNimi, setViiniNimi] = useState('')
    const [TyyppiId, setTyyppiId] = useState(0)
    const [RypaleId, setRypaleId] = useState(0)
    const [MaaId, setMaaId] = useState(0)
    const [Hinta, setHinta] = useState(0)
    // const [Kuva, setKuva] = useState() 
    // const [Viivakoodi, setViivakoodi] = useState()
    //Modaalin kentät loppuu
    const [viiniTietoModal, setViiniTietoModal] = useState(false)
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

    const idGenerator = () => {
      var rnds = function () {
          return (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1);
      }
      return (rnds() + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + rnds() + rnds());
    }

    const naytaTiedot = (id: number, name: string, tyyppi: number, rypale: number, maa: number, hinta: number ) => {
      setViiniTietoModal(true),
      setViiniId(id),
      setViiniNimi(name),
      setTyyppiId(tyyppi),
      setRypaleId(rypale),
      setMaaId(maa),
      setHinta(hinta)
    }

    const closeModal = () => {
      setViiniTietoModal(!viiniTietoModal)
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
      </View>

      <ScrollView>
        {tallennetutViinit.map((item: ViinilistaInterface) => (
          
          <Pressable 
            key={idGenerator()} 
            onPress={() => {
              naytaTiedot(
                item.viiniId,
                item.viiniNimi,
                item.rypaleId,
                item.tyyppiId,
                item.maaId,
                item.hinta
              )
            }}
            style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white'}]}
          >

            <View key={item.viiniId} style={styles.wineContainer}>
              <View key={idGenerator()} style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                <Text key={idGenerator()} style={{ fontSize: 15 }} numberOfLines={1}>{item.viiniNimi}</Text>
                <Text key={idGenerator()} style={{ color: '#8f8f8f' }} numberOfLines={1}>{'RypäleId ' + (item.rypaleId)}</Text>
                <Text key={idGenerator()} style={{ color: '#333333' }} numberOfLines={1}>{'\u00E1 ' + (item.hinta == null ? 'hinta puuttuu ' : item.hinta.toFixed(2)) + '\u20AC'}</Text>
              </View>
            </View>
          
          </Pressable>
        ))}
        {/* Modaali alkaa tästä */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={viiniTietoModal}
          onRequestClose={() => {

          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Viinin tarkemmat tiedot:</Text>
                <View style={styles.modalInfo}>
                    <Text style={styles.modalTextTitle}>{'Viini Id: '}</Text>
                    <Text style={styles.modalText}>{ViiniId}</Text>
                </View>
                <View style={styles.modalInfo}>
                    <Text style={styles.modalTextTitle}>{'Viinin nimi: '}</Text>
                    <Text style={styles.modalText}>{ViiniNimi}</Text>
                </View>
                <View style={styles.modalInfo}>
                    <Text style={styles.modalTextTitle}>{'Tyyppi Id: '}</Text>
                    <Text style={styles.modalText}>{TyyppiId}</Text>
                </View>
                <View style={styles.modalInfo}>
                    <Text style={styles.modalTextTitle}>{'Rypäle Id: '}</Text>
                    <Text style={styles.modalText}>{RypaleId}</Text>
                </View>
                <View style={styles.modalInfo}>
                    <Text style={styles.modalTextTitle}>{'Maa Id: '}</Text>
                    <Text style={styles.modalText}>{MaaId}</Text>
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
        </Modal>
        {/* Modaali loppuu tähän */}

      </ScrollView>
    </View>
  );
}