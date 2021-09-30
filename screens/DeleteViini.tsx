import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Pressable, TouchableHighlight, TextInput, Switch  } from 'react-native';
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
    // kuva: 
    // viivakoodi: string 
}

const DeleteViini = ({ passViiniId, closeModal, refreshAfterEdit }:any) => {
    let viiniId = passViiniId
    const [viiniNimi, setViiniNimi] = useState('...')
    const [tyyppiId, setTyyppiId] = useState('0')
    const [rypaleId, setRypaleId] = useState('0')
    const [maaId, setMaaId] = useState('0')
    const [hinta, setHinta] = useState('0')
    const [tahdet, setTahdet] = useState('0')
    const [kommentti, setKommentti] = useState('...')

    let validaatio = true

    useEffect(() => {
      HaeViiniData()
    }, [passViiniId])

    const HaeViiniData = () => {
      let uri = 'https://viinirestapi.azurewebsites.net/api/viini/' + passViiniId
      fetch(uri)
        .then(response => response.json())
        .then((json: ViinilistaInterface) => {
          setViiniNimi(json.viiniNimi)
          setTyyppiId(json.tyyppiId.toString())
          setRypaleId(json.rypaleId.toString())
          setMaaId(json.maaId.toString())
          setHinta(json.hinta.toString())
          setTahdet(json.tahdet.toString())
          setKommentti(json.kommentti)
        })
    }

    async function deleteViinionPress () {
        await DeleteToDB()
        refreshAfterEdit(true)
        closeModal()
    }

    const DeleteToDB = () => {  
        const apiUrl = "https://viinirestapi.azurewebsites.net/api/viini/" + viiniId
        fetch(apiUrl, {
            method:"DELETE",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json; charset=utf-8"
            },
            body: null
            })
                .then((response) => response.json())
                .then((json) => {
                    const success = json
                    if (success) {
                        alert('Viini ' + viiniNimi +  ' poistettu.')
                    } 
                    else 
                    {
                        alert('Viinin ' + viiniNimi + ' poistossa tapahtui virhe.')
                    }
                })
        }

    return (
        <View style={styles.inputContainer}>
            <ScrollView>
                <View key={viiniId}>
                    <View style={styles.topSection}>
                        <Pressable onPress={() => deleteViinionPress()}>
                            <View><Octicons name="trashcan" size={24} color="red" /></View> 
                        </Pressable>
                    
                        <Pressable onPress={() => closeModal()}>
                            <View><Octicons name="x" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    <Text style={styles.inputHeaderTitle}>Haluatko poistaa viinin?</Text>
                    <Text style={styles.inputTitle}>ID:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        defaultValue={viiniId.toString()}
                        autoCapitalize="none"
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Nimi:</Text>
                    <TextInput style={styles.inactiveField} 
                        underlineColorAndroid="transparent"
                        value={viiniNimi.toString()}
                        autoCapitalize="none"
                        editable={false}
                    />
                    {/* { validateString(viiniNimi) == true ? null : ( <Text style={styles.validationError}>Anna viinin nimi!</Text> )} */}
        
                    <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        value={(hinta.toString() == null ? '0' : hinta.toString())}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />
                    {/* { validatePrice(hinta) == true ? null : ( <Text style={styles.validationError}>Anna hinta muodossa n.zz!</Text> )} */}

                    <Text style={styles.inputTitle}>Tyyppi Id:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        value={tyyppiId.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />
                    {/* { validateNumeric(tyyppiId) == true ? null : ( <Text style={styles.validationError}>Anna varastomääräksi numero</Text> )} */}

                    <Text style={styles.inputTitle}>Rypäle ID:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setRypaleId(val)}
                        value={rypaleId.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Maa ID:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        value={maaId.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    {/* <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setHinta(val)}
                        value={hinta.toString() == null ? '0' : hinta.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                        editable={false}
                    /> */}
                    
                    {/* <Text style={styles.inputTitle}>Hinta:</Text>
                    <Picker
                        selectedValue={selectedCat}
                        style={{height:50,width:250}}
                        onValueChange={(itemValue) => fetchFiltered(itemValue)}>
                        <Picker.Item label={"ID: " + categoryId + " - " + categories.categoryName} />
                        {categoriesList}
                    </Picker> */}

                    <Text style={styles.inputTitle}>Kommentti:</Text>
                    <TextInput style={styles.inactiveField}
                        underlineColorAndroid="transparent"
                        value={kommentti.toString()}
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                        editable={false}
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
export default DeleteViini