import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, Image, Text, View, ScrollView, Pressable, TextInput, AppRegistry, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';
import {Picker} from '@react-native-picker/picker';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import RNGestureHandlerButton from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

import styles from '../styles/styles'
//import CameraModule from './CameraModule'
//import CameraTesti from "./CameraTesti"

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

const CreateViini = ({ closeModal, refreshAfterEdit }:any) => {
    const [viiniNimi, setViiniNimi] = useState('...')
    const [tyyppiId, setTyyppiId] = useState('0')
    const [rypaleId, setRypaleId] = useState('0')
    const [maaId, setMaaId] = useState('0')
    const [hinta, setHinta] = useState('0')
    const [tahdet, setTahdet] = useState('0')
    const [kommentti, setKommentti] = useState('...')
    const [kuva, setKuva] = useState()
    //FILTER
    const [tyypit, setTyypit] = useState<any>([])
    const [valittuTyyppi, setValittuTyyppi] = useState<any>("All")

    const [maat, setMaat] = useState<any>([])
    const [valittuMaa, setValittuMaa] = useState<any>("All")

    const [rypaleet, setRypaleet] = useState<any>([])
    const [valittuRypale, setValittuRypale] = useState<any>("All")


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

    useEffect(() => {
        HaeTyypit()
        HaeRypaleet()
        HaeMaat()
    }, [])

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
          .then((json: IMaat) => {
            setMaat(json);
          });
    }


    let validaatio = true


    async function createViinionPress (viiniNimi: string) {
        if (Platform.OS === 'web') {
            if (validateOnSubmit() == false) {
            } else {
                await PostToDB()
                console.log('Viini ' + viiniNimi + ' lisätty onnistuneesti')
                refreshAfterEdit(true)
                closeModal()
            }
        }
        else {
            if (validateOnSubmit() == false) {
            } else {
                await PostToDB()
                alert('Viini ' + viiniNimi + ' lisätty onnistuneesti!')
                refreshAfterEdit(true)
                closeModal()
            }
        }
    }

    const PostToDB = () => {
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
    
  
    const viiniCreateJson = JSON.stringify(viini)

    const apiUrl = "https://viinirestapi.azurewebsites.net/api/viini/"
    fetch(apiUrl, {
        method:"POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json; charset=utf-8"
        },
        body: viiniCreateJson  //lähetetään html-dobyssä konvertoitu data...
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
        setValittuTyyppi(value)
        setTyyppiId(value)
    }

    const fetchFilteredRypale = (value: any) => {
        setValittuRypale(value)
        setRypaleId(value)
    }

    const fetchFilteredMaa = (value: any) => {
        setValittuMaa(value)
        setMaaId(value)
    }

    // Hinnan validaatio
    const validatePrice = (val: any) => {
        if (val === null){
        return true
        } 
        else {
            var rgx = /^[0-9]*\.?[0-9]*$/
            if (String(val).match(rgx) == null) {
                return false
            }
            else {
                return true
            }
        }
    }

    // Merkkijonon validaatio (MAX 40 merkkiä)
    const validateString = (val: any) => {
        if (val === "") {
            return false
        }
        else {
            var rgx = /^.{1,40}$/
            if (val.match(rgx) == null) {
                return false
            }
            else {
                return true
            }
        }
    }

    const validateOnSubmit = () => {
        if (!validateString(viiniNimi)) {
            return false
        } else if (!validatePrice(hinta)) {
            return false
        } else {
            return true
        }
    }


    return (
        <View style={styles.inputContainer}>
            <ScrollView>
                <View>
                    <View style={styles.topSection}>
                        <Pressable onPress={() => createViinionPress(viiniNimi)}>
                            <View><FontAwesome5 name="check" size={24} color="green" /></View> 
                        </Pressable>

                        <Pressable >
                            <View>
                                <FontAwesome5 name="camera" size={30} color="black" />
                            </View>
                        </Pressable>
                    
                        <Pressable onPress={() => closeModal()}>
                            <View><FontAwesome5 name="times" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    <View style={styles.centerSection}>
                        <Image
                            source={{ uri: "https://www.tibs.org.tw/images/default.jpg" }}
                            // source={{kuva ? { uri: kuva } : { uri: "https://www.tibs.org.tw/images/default.jpg"}}
                            style={[
                            styles.centerSection,
                            {
                                
                                height: 250,
                                width: 250,
                                backgroundColor: "#eeeeee",
                                margin: 6,
                            },
                            ]}
                        />
                    </View>


                    <Rating
                        showRating
                        type="star"
                        fractions={1}
                        startingValue={0}
                        onFinishRating={setTahdet}
                    >

                    </Rating>

                    {/* <Text style={styles.inputTitle}>Nimi:</Text> */}
                    <TextInput style={styles.editInput} 
                        underlineColorAndroid="transparent"
                        onChangeText={val => setViiniNimi(val)}
                        placeholder="Viinin nimi"
                        placeholderTextColor="#bdbbb7"
                        autoCapitalize="sentences"
                        selectTextOnFocus={true}
                        
                    />
                    { validateString(viiniNimi) == true ? null : ( <Text style={styles.validationError}>Anna viinin nimi!</Text> )}

                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setHinta(val)}
                        placeholderTextColor="#bdbbb7"
                        placeholder="Viinin hinta"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />

                    { validatePrice(hinta) == true ? null : ( <Text style={styles.validationError}>Anna hinta muodossa n.zz!</Text> )}

                    <Picker
                        selectedValue={valittuTyyppi}
                        style={{height:50,width:250}}
                        onValueChange={(value) => fetchFilteredTyyppi(value)}>
                        <Picker.Item label="Valitse viinin tyyppi" />
                        {tyyppiLista}
                    </Picker>

                    <Picker
                        selectedValue={valittuRypale}
                        style={{height:50,width:250}}
                        onValueChange={(value) => fetchFilteredRypale(value)}>
                        <Picker.Item label="Valitse rypälelajike" />
                        {rypaleLista}
                    </Picker>

                    <Picker
                        selectedValue={valittuMaa}
                        style={{height:50,width:250}}
                        onValueChange={(value) => fetchFilteredMaa(value)}>
                        <Picker.Item label="Valitse viinin tuottaja maa" />
                        {maaLista}
                    </Picker>

                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        multiline
                        numberOfLines={4}
                        onChangeText={val => setKommentti(val)}
                        placeholderTextColor="#bdbbb7"
                        placeholder="Kommentti"
                        autoCapitalize="sentences"
                        selectTextOnFocus={true}
                    />

                    <Pressable style={styles.submitButton}
                    onPress={() => createViinionPress(viiniNimi)}>
                        <Text style={styles.submitButtonText}>{' Lisää viini '}</Text>
                    </Pressable>

            </View>
        </ScrollView>
    </View>

    )
}
export default CreateViini