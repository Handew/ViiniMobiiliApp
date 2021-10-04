import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, TouchableHighlight, TextInput, Switch  } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Rating } from 'react-native-ratings';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import styles from '../styles/styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IViinilista {
    viiniId: number
    viiniNimi: string
    tyyppiId: number
    rypaleId: number
    maaId: number
    hinta: number
    tahdet: number
    kommentti: string
    // kuva: 
    // viivakoodi: string

}

//Filtteriä
interface ITyypit {
    tyyppiId: number
    tyyppi1: string
}

interface IMaat {
    maaId: number
    maa1: string
}

interface IRypaleet {
    rypaleId: number
    rypale1: string
}


const EditViini = ({ passViiniId, closeModal, refreshAfterEdit }:any) => {
    let viiniId = passViiniId
    const [viiniNimi, setViiniNimi] = useState('...')
    const [tyyppiId, setTyyppiId] = useState(0)
    const [rypaleId, setRypaleId] = useState(0)
    const [maaId, setMaaId] = useState(0)
    const [hinta, setHinta] = useState(0.00)
    const [tahdet, setTahdet] = useState(0.0)
    const [kommentti, setKommentti] = useState('...')
    //FILTER
    const [tyypit, setTyypit] = useState<any>([])
    const [maat, setMaat] = useState<any>([])
    const [rypaleet, setRypaleet] = useState<any>([])


    let validaatio = true

    useEffect(() => {
        HaeTyypit()
        HaeRypaleet()
        HaeMaat()
        HaeViiniData()
    }, [passViiniId])

    const tyyppiLista = tyypit.map((tyyp: ITyypit, index: any) => {
        return(
          <Picker.Item label={tyyp.tyyppi1} value={tyyp.tyyppiId} key={index} />
        )
    })

    const maaLista = maat.map((maa: IMaat, index: any) => {
        return(
          <Picker.Item label={maa.maa1} value={maa.maaId} key={index} />
        )
    })
    
    const rypaleLista = rypaleet.map((ryp: IRypaleet, index: any) => {
        return(
          <Picker.Item label={ryp.rypale1} value={ryp.rypaleId} key={index} />
        )
    })

    const HaeViiniData = () => {
      let uri = 'https://viinirestapi.azurewebsites.net/api/viini/' + passViiniId
      fetch(uri)
        .then(response => response.json())
        .then((json: IViinilista) => {
          setViiniNimi(json.viiniNimi)
          setTyyppiId(json.tyyppiId)
          setRypaleId(json.rypaleId)
          setMaaId(json.maaId)
          setHinta(json.hinta)
          setTahdet(json.tahdet)
          setKommentti(json.kommentti)
        })
    }

    const HaeTyypit = () => {
        let uri = "https://viinirestapi.azurewebsites.net/api/viini/gettyyppi";
        fetch(uri)
          .then((response) => response.json())
          .then((json: ITyypit) => {
            setTyypit(json);
          });
    }

    const HaeRypaleet = () => {
        let uri = "https://viinirestapi.azurewebsites.net/api/viini/getrypaleet";
        fetch(uri)
          .then((response) => response.json())
          .then((json: IRypaleet) => {
            setRypaleet(json);
          });
    }

    const HaeMaat = () => {
        let uri = "https://viinirestapi.azurewebsites.net/api/viini/getmaat";
        fetch(uri)
          .then((response) => response.json())
          .then((json) => {
            setMaat(json);
          });
    }


    async function editViinionPress (viiniNimi: string) {
        if (Platform.OS === 'web') {
            if (validaatio == false) {
                alert('Viiniä ' + viiniNimi + ' c')
            } else {
                await PutToDB()
                console.log('Viiniä ' + viiniNimi + ' muokattu onnistuneesti')
                refreshAfterEdit(true)
                closeModal()
            }
        }
        else {
            if (validaatio == false) {
                alert('Viiniä ' + viiniNimi + ' ei voi tallentaa tietojen puutteellisuuden vuoksi!')
            } else {
                await PutToDB()
                alert('Viiniä ' + viiniNimi + ' muokattu onnistuneesti!')
                refreshAfterEdit(true)
                closeModal()
            }
        }
    }

    const PutToDB = () => {
        const viini = 
        {
          ViiniNimi: viiniNimi,
          TyyppiId: Number(tyyppiId),
          RypaleId: Number(rypaleId),
          MaaId: Number(maaId),
          Hinta: parseFloat(Number(hinta).toFixed(2)),
          Tahdet: Number(tahdet),
          Kommentti: kommentti,
        //   Kuva: kuva,
        //   Viivakoodi: viivakoodi
        }
    
  
    const viiniEditJson = JSON.stringify(viini)

    const apiUrl = "https://viinirestapi.azurewebsites.net/api/viini/" + viiniId
    fetch(apiUrl, {
        method:"PUT",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json; charset=utf-8"
        },
        body: viiniEditJson  //lähetetään html-dobyssä konvertoitu data...
        })
            .then((response) => response.json())
            .then((json) => {
                const success = json
                if (success) {
                    console.log(success)
                } 
                else 
                {
                    console.log('Ongelmia päivityksessä ' + viiniNimi)
                }
            })
    }

    //Filteröintiin
    const fetchFilteredTyyppi = (value: any) => {
        setTyyppiId(value)
    }

    const fetchFilteredRypale = (value: any) => {
        setRypaleId(value)
    }



    const fetchFilteredMaa = (value: any) => {
        setMaaId(value)
    }

    return (
        <View style={styles.inputContainer}>
            <ScrollView>
                <View key={viiniId}>
                    <View style={styles.topSection}>
                        <Pressable onPress={() => editViinionPress(viiniNimi)}>
                            <View><Octicons name="check" size={24} color="green" /></View> 
                        </Pressable>
                    
                        <Pressable onPress={() => closeModal()}>
                            <View><Octicons name="x" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    {/* <Text style={styles.inputHeaderTitle}>Viinin muokkaus:</Text> */}

                    
                    <Rating
                        showRating
                        type="star"
                        fractions={1}
                        startingValue={Number(tahdet)}
                        onFinishRating={setTahdet}
                    >

                    </Rating>

                    <Text style={styles.inputTitle}>Viinin nimi:</Text>
                    <TextInput style={styles.editInput} 
                        underlineColorAndroid="transparent"
                        onChangeText={val => setViiniNimi(val)}
                        value={viiniNimi.toString()}
                        placeholderTextColor="#bdbbb7"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                    />
                    {/* { validateString(viiniNimi) == true ? null : ( <Text style={styles.validationError}>Anna viinin nimi!</Text> )} */}
        
                    <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setHinta(val)}
                        value={(hinta.toString() == null ? '0' : hinta.toString())}
                        placeholderTextColor="#bdbbb7"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
                    {/* { validatePrice(hinta) == true ? null : ( <Text style={styles.validationError}>Anna hinta muodossa n.zz!</Text> )} */}

                    <Text style={styles.inputTitle}>Viinin tyyppi:</Text>
                    <Picker
                        selectedValue={tyyppiId}
                        style={{height: 50, width: 250}}
                        onValueChange={itemValue => {fetchFilteredTyyppi(itemValue)}}
                    >
                        {tyyppiLista}

                    </Picker>

                    {/* { validateNumeric(tyyppiId) == true ? null : ( <Text style={styles.validationError}>Anna varastomääräksi numero</Text> )} */}

                    <Text style={styles.inputTitle}>Rypäle:</Text>
                    <Picker
                        selectedValue={rypaleId}
                        style={{height: 50, width: 250}}
                        onValueChange={value => {fetchFilteredRypale(value)}}
                    >
                        {rypaleLista}

                    </Picker>

                    <Text style={styles.inputTitle}>Maa:</Text>
                    <Picker
                        selectedValue={maaId}
                        style={{height: 50, width: 250}}
                        onValueChange={value => {fetchFilteredMaa(value)}}
                    >
                        {maaLista}

                    </Picker>

                    <Text style={styles.inputTitle}>Kommentti:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setKommentti(val)}
                        value={kommentti.toString()}
                        placeholderTextColor="#bdbbb7"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                    />

            </View>
        </ScrollView>
    </View>

    )
}
export default EditViini