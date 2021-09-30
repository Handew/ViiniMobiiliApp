import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5, Octicons } from "@expo/vector-icons";
import RNGestureHandlerButton from "react-native-gesture-handler/lib/typescript/components/GestureHandlerButton";
import styles from "../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import ViiniLisatiedot from "./ViiniLisatiedot";
import EditViini from "./EditViini";
import CreateViini from "./CreateViini";
import DeleteViini from "./DeleteViini";
import { Picker } from "@react-native-picker/picker";

interface ViinilistaInterface {
  viiniId: number;
  viiniNimi: string;
  tyyppiId: number;
  rypaleId: number;
  maaId: number;
  hinta: number;
  tahdet: number;
  kommentti: string;
  Kuva: string;
  // Viivakoodi: string
}

export default function Viinilista() {
  const [viini, setViini] = useState<Partial<ViinilistaInterface>>({});
  const [tallennetutViinit, setTallennetutViinit] = useState<any>([]);
  const [tallennetutViinitYhteensä, setTallennetutViinitYhteensä] = useState(0);
  const [viiniTietoModal, setViiniTietoModal] = useState(false);
  const [viiniEditModal, setViiniEditModal] = useState(false);
  const [viiniCreateModal, setViiniCreateModal] = useState(false)
  const [viiniDeleteModal, setViiniDeleteModal] = useState(false)
  //Tuotelistan päivityksen muuttujat
  const [refreshViinit, setRefreshViinit] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(false);
  //Picker
  const [dropdownTyyppi, setDropdownTyyppi] = useState('All')

  useEffect(() => {
    HaeViinit();
  }, [refreshViinit]);

  const HaeViinit = () => {
    let uri = "https://viinirestapi.azurewebsites.net/api/viini/";
    fetch(uri)
      .then((response) => response.json())
      .then((json: ViinilistaInterface) => {
        setTallennetutViinit(json);
        const fetchCount = Object.keys(json).length;
        setTallennetutViinitYhteensä(fetchCount);
      });
    setRefreshIndicator(false);
  };

  const refreshJsonData = () => {
    setRefreshViinit(!refreshViinit);
    setRefreshIndicator(true);
  };

  //Viinin muokkaus
  const editViiniFunc = (item: ViinilistaInterface) => {
    setViini(item); // Asettaa Viini -hooks-objektiin klikatun tuotteen koko objektin
    setViiniEditModal(true); //Edit ikkuna esiin
  };

  //Viinin lisäys
  const createViiniFunc = () => {
    setViiniCreateModal(true); //Create ikkuna esiin
  };

  //Viinin poisto
  const deleteViiniFunc = (item: ViinilistaInterface) => {
    setViini(item); // Asettaa Viini -hooks-objektiin klikatun tuotteen koko objektin
    setViiniDeleteModal(true); //Delete ikkuna esiin
  };

  //Modaalien sulkemiset
  const closeLisatietoModal = () => {
    setViiniTietoModal(!viiniTietoModal);
  };

  const closeEditModal = () => {
    setViiniEditModal(!viiniEditModal);
  };

  const closeCreateModal = () => {
    setViiniCreateModal(!viiniCreateModal)
  }

  const closeDeleteModal = () => {
    setViiniDeleteModal(!viiniDeleteModal);
  };

  const filterItems = (tyyppi: string)  => {
    if (tyyppi === 'All') {
      setDropdownTyyppi('All')
      setRefreshViinit(!refreshViinit)
    }
    else if (tyyppi === 'cat1') {
      setDropdownTyyppi('cat1')
      setRefreshViinit(!refreshViinit)
    }
  }

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topSection}>
        <View>
          <FontAwesome5 name="wine-glass" size={25} color="#000" />
        </View>
        <Text style={{ fontSize: 18, color: "#000" }}>
          {"Viinejä yhteensä: " + tallennetutViinitYhteensä}
        </Text>
        <Pressable
          onPress={() => refreshJsonData()}
          style={({ pressed }) => [
            { backgroundColor: pressed ? "lightgray" : "white" },
          ]}
        >
          <View>
            <Octicons name="sync" size={24} color="black" />
          </View>
        </Pressable>
        <ActivityIndicator
          size="small"
          color="#0000ff"
          animating={refreshIndicator}
        />
        <Pressable onPress={() => createViiniFunc()}>
          <View>
            <Octicons name="plus" size={24} color="green" />
          </View>
        </Pressable>
      </View>
      <View style={styles.pickerSection}>
          <Picker selectedValue={dropdownTyyppi} 
            style={{ height: 50, width: 250 }} 
            prompt='Valitse viinityyppi'
            onValueChange={(itemValue, itemIndex) =>
            filterItems(itemValue.toString())
            }>
              <Picker.Item label='Hae kaikki viinit' value='All' />
              <Picker.Item label='Punaviinit' value='cat1' />
          </Picker>
        </View>

      <ScrollView>
        {tallennetutViinit.map((item: ViinilistaInterface) => (
          <Pressable
            key={item.viiniId}
            onPress={() => {
              setViini(item);
              setViiniTietoModal(true);
            }}
            style={({ pressed }) => [{ backgroundColor: pressed ? "rgba(49, 179, 192, 0.5)" : "white" }]}
          >
            <View style={styles.wineContainer}>
              <Image source={item.Kuva ? { uri: item.Kuva } : { uri: 'https://www.tibs.org.tw/images/default.jpg' }} 
                style={[styles.centerSection, { height: 60, width: 60, backgroundColor: '#eeeeee', margin: 6, }]} />
              <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                <Text style={{ fontSize: 15 }}>{item.viiniNimi}</Text>
                <Text style={{ color: '#8f8f8f' }}>
                  {"RypäleId " + item.rypaleId}
                </Text>
                <Text style={{ color: "#333333", marginBottom: 10 }}>
                  {"\u00E1 " +
                    (item.hinta == null
                      ? "hinta puuttuu "
                      : item.hinta.toFixed(2)) +
                    "\u20AC"}
                </Text>
              </View>
              <View style={{ padding: 2, marginRight: 10, marginTop: 30 }}>
                <Pressable
                  style={[{ width: 32, height: 32 }]}
                  onPress={() => editViiniFunc(item)}
                >
                  <Octicons name="pencil" size={24} color="black" />
                </Pressable>
                <Pressable 
                  style={[{ width: 32, height: 32}]} 
                  onPress={() => deleteViiniFunc(item)}
                >
                  <Octicons name="trashcan" size={24} color="black" />
                </Pressable>
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
            <ViiniLisatiedot
              closeModal={closeLisatietoModal}
              passViiniId={viini.viiniId}
            />
          </Modal>
        ) : null}

        {/* editViiniFunc -komponentin kutsu */}
        {viiniEditModal ? (
          <Modal
            style={[styles.modalContainer]}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <EditViini
              closeModal={closeEditModal}
              refreshAfterEdit={refreshJsonData}
              passViiniId={viini.viiniId}
            />
          </Modal>
        ) : null}

        {/* createViiniFunc -komponentin kutsu */}
        {viiniCreateModal ? (
          <Modal
            style={[styles.modalContainer]}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <CreateViini
              closeModal={closeCreateModal}
              refreshAfterEdit={refreshJsonData}
            />
          </Modal>
        ) : null}

        {/* deleteViiniFunc -komponentin kutsu */}
        {viiniDeleteModal ? (
          <Modal
            style={[styles.modalContainer]}
            animationType="slide"
            transparent={true}
            visible={true}
          >
            <DeleteViini
              closeModal={closeDeleteModal}
              refreshAfterEdit={refreshJsonData}
              passViiniId={viini.viiniId}
            />
          </Modal>
        ) : null}

      </ScrollView>
    </View>
  );
}
