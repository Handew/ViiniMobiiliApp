import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, Modal, TouchableHighlight } from 'react-native';
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
    const [ViiniId, setViiniId] = useState(0)
    const [viiniTietoModal, setViiniTietoModal] = useState(false)

    useEffect(() => {
        HaeViinit()
    }, [])

    const HaeViinit = () => {
        let uri = 'https://viinirestapi.azurewebsites.net/api/viini/'
        fetch(uri)
            .then(response => response.json())
            .then((json: ViinilistaInterface) => {
                setTallennetutViinit(json)
                const fetchCount = Object.keys(json).length
                setTallennetutViinitYhteensä(fetchCount)
            })
    }

    const idGenerator = () => {
      var rnds = function () {
          return (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1);
      }
      return (rnds() + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + rnds() + rnds());
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <View style={styles.topSection}>
        <View style={[styles.centerSection, {height:50}]}> 
          <Text style={{ fontSize: 18, color: '#000' }}>Viinilista</Text>
          <Text style={{ fontSize: 10, color: '#000' }}>{'Viinejä yhteensä: ' + tallennetutViinitYhteensä}</Text>
        </View>
      </View>

      <ScrollView>
        {tallennetutViinit.map((item: ViinilistaInterface) => (
          
          <Pressable onPress={() => {/*this.props.navigation.navigate('ViiniTiedot', {viiniTiedot: item*/}}
          style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white'}]}
          onLongPress={() => {
            setViiniTietoModal(true)
          }}>

            <View key={item.viiniId} style={styles.wineContainer}>
              <View key={idGenerator()} style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                <Text key={idGenerator()} style={{ fontSize: 15 }} numberOfLines={1}>{item.viiniNimi}</Text>
                <Text key={idGenerator()} style={{ color: '#8f8f8f' }} numberOfLines={1}>{'RypäleId ' + (item.rypaleId)}</Text>
                <Text key={idGenerator()} style={{ color: '#333333' }} numberOfLines={1}>{'\u00E1 ' + (item.hinta == null ? 'hinta puuttuu ' : item.hinta.toFixed(2)) + '\u20AC'}</Text>
              </View>
            </View>
          
          </Pressable>
        ))}

      </ScrollView>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });
