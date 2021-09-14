import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable,TouchableHighlight } from 'react-native';


interface ViinilistaInterface {
    ViiniId: number
    ViiniNimi: string
    TyyppiId: number
    RypaleId: number
    MaaId: number
    Hinta: number
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viinilista</Text>


      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
