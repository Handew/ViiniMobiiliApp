import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

// import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ViiniApp *icon*</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <TouchableOpacity style={styles.button}>
        <Text>Lisää uusi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Hae kokoelmasta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text>Selaa</Text>
      </TouchableOpacity>
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
    fontSize: 40,
    marginTop: 50,
    marginBottom: 80,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    marginTop: 20,
      width: 120,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: '#ccc',
      transform: [{ scaleX: 2 }],
  },
});
