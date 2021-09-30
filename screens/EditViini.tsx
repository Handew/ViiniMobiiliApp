import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, TouchableHighlight, TextInput, Switch  } from 'react-native';
import {Picker} from '@react-native-picker/picker';
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
    tyyppi: string
    maa: string
    rypale: string
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
    const [tyyppiId, setTyyppiId] = useState('0')
    const [rypaleId, setRypaleId] = useState('0')
    const [maaId, setMaaId] = useState('0')
    const [hinta, setHinta] = useState('0')
    const [tahdet, setTahdet] = useState('0')
    const [kommentti, setKommentti] = useState('...')
    //FILTER
    const [tyypit, setTyypit] = useState<any>([])
    const [valittuTyyppi, setValittuTyyppi] = useState<any>("All")

    const [maat, setMaat] = useState<any>([])
    const [valittuMaa, setValittuMaa] = useState<any>("All")

    const [rypaleet, setRypaleet] = useState<any>([])
    const [valittuRypale, setValittuRypale] = useState<any>("All")

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
          setTyyppiId(json.tyyppiId.toString())
          setRypaleId(json.rypaleId.toString())
          setMaaId(json.maaId.toString())
          setHinta(json.hinta.toString())
          setTahdet(json.tahdet.toString())
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
          .then((json: IMaat) => {
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

                    <Text style={styles.inputHeaderTitle}>Tuotteen muokkaus:</Text>
                    <Text style={styles.inputTitle}>ID:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        defaultValue={viiniId.toString()}
                        autoCapitalize="none"
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Nimi:</Text>
                    <TextInput style={styles.editInput} 
                        underlineColorAndroid="transparent"
                        onChangeText={val => setViiniNimi(val)}
                        value={viiniNimi.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                        
                    />
                    {/* { validateString(viiniNimi) == true ? null : ( <Text style={styles.validationError}>Anna viinin nimi!</Text> )} */}
        
                    <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setHinta(val)}
                        value={(hinta.toString() == null ? '0' : hinta.toString())}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
                    {/* { validatePrice(hinta) == true ? null : ( <Text style={styles.validationError}>Anna hinta muodossa n.zz!</Text> )} */}

                    {/* <Text style={styles.inputTitle}>Tyyppi Id:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setTyyppiId((val))}
                        value={tyyppiId.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    /> */}

                    <Text style={styles.inputTitle}>Viinin tyyppi:</Text>
                    <Picker
                        selectedValue={valittuTyyppi}
                        style={{height: 50, width: 250}}
                        onValueChange={(itemValue) => fetchFilteredTyyppi(itemValue)}
                    >
                        <Picker.Item label={"ID: " + tyyppiId + " - " + tyypit.tyyppi1} />
                        {tyyppiLista}

                    </Picker>

                    {/* { validateNumeric(tyyppiId) == true ? null : ( <Text style={styles.validationError}>Anna varastomääräksi numero</Text> )} */}

                    {/* <Text style={styles.inputTitle}>Rypäle ID:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setRypaleId(val)}
                        value={rypaleId.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    /> */}

                    <Text style={styles.inputTitle}>Rypäle:</Text>
                    <Picker
                        selectedValue={valittuRypale}
                        style={{height: 50, width: 250}}
                        onValueChange={(value) => fetchFilteredRypale(value)}
                    >
                        <Picker.Item label={"ID: " + rypaleId + " - " + rypaleet.rypale1} />
                        {rypaleLista}

                    </Picker>

                    {/* <Text style={styles.inputTitle}>Maa ID:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setMaaId(val)}
                        value={maaId.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    /> */}

                    <Text style={styles.inputTitle}>Maa:</Text>
                    <Picker
                        selectedValue={valittuMaa}
                        style={{height: 50, width: 250}}
                        onValueChange={(value) => fetchFilteredMaa(value)}
                    >
                        <Picker.Item label={"ID: " + maaId + " - " + maat.maa1} />
                        {maaLista}

                    </Picker>

                    <Text style={styles.inputTitle}>Kommentti:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setKommentti(val)}
                        value={kommentti.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                    />

                    {/* <Text style={styles.inputTitle}>Tavarantoimittaja:</Text>
                    <Picker
                        selectedValue={selectedSupp}
                        style={{height:50,width:250}}
                        onValueChange={(itemValue) => fetchFilteredSupp(itemValue)}>
                        <Picker.Item label={"ID: " + supplierId + " - " + suppliers.companyName} />
                        {suppliersList}
                    </Picker> */}

            </View>
        </ScrollView>
    </View>

    )
}
export default EditViini