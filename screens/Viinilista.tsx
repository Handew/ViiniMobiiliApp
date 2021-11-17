import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import RNGestureHandlerButton from "react-native-gesture-handler/lib/typescript/components/GestureHandlerButton";
import styles from "../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import ViiniLisatiedot from "./ViiniLisatiedot";
import EditViini from "./EditViini";
import CreateViini from "./CreateViini";
import DeleteViini from "./DeleteViini";
import { Picker } from "@react-native-picker/picker";
import { Rating } from "react-native-ratings";

interface IViinilista {
  viiniId: number
  viiniNimi: string
  tyyppiId: number
  tyyppi: string
  rypaleId: number
  maaId: number
  hinta: number
  tahdet: number
  kommentti: string
  Kuva: string;
  // Viivakoodi: string
}

//Filtteriä
interface ITyypit {
  tyyppiId: number
  tyyppi1: string
}

export default function Viinilista() {
  const [viini, setViini] = useState<Partial<IViinilista>>({});
  const [tahdet, setTahdet] = useState(0.0)
  const [tallennetutViinit, setTallennetutViinit] = useState<any>([]);
  const [tallennetutViinitYhteensä, setTallennetutViinitYhteensä] = useState(0);
  const [viiniTietoModal, setViiniTietoModal] = useState(false);
  const [viiniEditModal, setViiniEditModal] = useState(false);
  const [viiniCreateModal, setViiniCreateModal] = useState(false);
  const [viiniDeleteModal, setViiniDeleteModal] = useState(false);
  //FILTER
  const [tyypit, setTyypit] = useState<any>([])
  const [valittuTyyppi, setValittuTyyppi] = useState<any>("All")
  //Tuotelistan päivityksen muuttujat
  const [refreshViinit, setRefreshViinit] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(false);

  useEffect(() => {
    HaeTyypit()
    HaeViinit()
    HaeViiniInfo()
  }, [refreshViinit])

  const tyyppiLista = tyypit.map((tyyp: ITyypit, index: any) => {
    return(
      <Picker.Item label={tyyp.tyyppi1} value={tyyp.tyyppiId} key={index} />
    )
  })

  const HaeViinit = () => {
    let uri = "https://viinirestapi.azurewebsites.net/api/viini/";
    fetch(uri)
      .then((response) => response.json())
      .then((json: IViinilista[]) => {
        if (valittuTyyppi === "All") {
          setTallennetutViinit(json);
          const fetchCount = Object.keys(json).length;
          setTallennetutViinitYhteensä(fetchCount);
        }
        else {
          const filtered = json.filter(x => x.tyyppiId === parseInt(valittuTyyppi))
          setTallennetutViinit(filtered)
          const fetchCount = Object.keys(filtered).length;
          setTallennetutViinitYhteensä(fetchCount);
        }
      });
    setRefreshIndicator(false);
  };

  const HaeTyypit = () => {
    let uri = "https://viinirestapi.azurewebsites.net/api/viini/gettyyppi";
    fetch(uri)
      .then((response) => response.json())
      .then((json: ITyypit) => {
        setTyypit(json);
      });
    setRefreshIndicator(false);
  }

  const HaeViiniInfo = () => {
    let uri = 'https://viinirestapi.azurewebsites.net/api/viini/lisatiedot/' + viini.viiniId
    fetch(uri)
      .then(response => response.json())
      .then((json: IViinilista) => {
        setViini(json)
      })
  }

  const refreshJsonData = () => {
    setRefreshViinit(!refreshViinit);
    setRefreshIndicator(true);
  };

  //Viinin muokkaus
  const editViiniFunc = (item: IViinilista) => {
    setViini(item); // Asettaa Viini -hooks-objektiin klikatun tuotteen koko objektin
    setViiniEditModal(true); //Edit ikkuna esiin
  };

  //Viinin lisäys
  const createViiniFunc = () => {
    setViiniCreateModal(true); //Create ikkuna esiin
  };

  //Viinin poisto
  const deleteViiniFunc = (item: IViinilista) => {
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
    setViiniCreateModal(!viiniCreateModal);
  };

  const closeDeleteModal = () => {
    setViiniDeleteModal(!viiniDeleteModal);
  };

  //Filteröintiin
  const fetchFiltered = (value: any) => {
    setValittuTyyppi(value)
    setRefreshViinit(!refreshViinit)
  }

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topSection}>
        <View>
          <FontAwesome5 name="wine-bottle" size={25} color="#07910e" />
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
            <FontAwesome5 name="sync" size={23} color="black" />
          </View>
        </Pressable>
        <ActivityIndicator
          size="small"
          color="#0000ff"
          animating={refreshIndicator}
        />
        <Pressable onPress={() => createViiniFunc()}>
          <View>
            <FontAwesome5 name="plus" size={25} color="green" />
          </View>
        </Pressable>
      </View>
      <View style={styles.pickerSection}>
        <Picker
          prompt="Valitse viinityyppi"
          selectedValue={valittuTyyppi}
          style={{ height: 50, width: 250 }}
          onValueChange={(value) => fetchFiltered(value)}
        >
          <Picker.Item label="Hae kaikki viinit" value="All" />
          {tyyppiLista}
        </Picker>
      </View>

      <ScrollView>
        {tallennetutViinit.map((item: IViinilista) => (
          <Pressable
            key={item.viiniId}
            onPress={() => {
              setViini(item);
              setViiniTietoModal(true);
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgba(49, 179, 192, 0.5)" : "white",
              },
            ]}
          >
            <View style={styles.wineContainer}>
              <Image
                source={
                  item.Kuva
                    ? { uri: item.Kuva }
                    : { uri: "https://www.tibs.org.tw/images/default.jpg" }
                }
                style={[
                  styles.centerSection,
                  {
                    height: 60,
                    width: 60,
                    backgroundColor: "#eeeeee",
                    margin: 6,
                  },
                ]}
              />
              <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: "center" }}>
                <Text style={{ fontSize: 15, alignSelf: "center" }}>{item.viiniNimi}</Text>

                <Rating
                  type="star"
                  imageSize={20}
                  fractions={1}
                  startingValue={Number(item.tahdet)}
                >

                </Rating>


                <Text style={{ color: "#333333", marginBottom: 10, alignSelf: "center" }}>
                  {
                    (item.hinta == null
                      ? "hinta puuttuu "
                      : item.hinta.toFixed(2)) +
                    "\u20AC"}
                </Text>
              </View>
              <View style={{ padding: 2, marginRight: 10 }}>
                <Pressable
                  style={[{ width: 32, height: 32 }]}
                  onPress={() => editViiniFunc(item)}
                >
                  <FontAwesome5 name="edit" size={25} color="#000" />
                </Pressable>
                <Pressable
                  style={[{ width: 32, height: 32 }]}
                  onPress={() => deleteViiniFunc(item)}
                >
                  <FontAwesome5 name="trash-alt" size={25} color="red"  />
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
