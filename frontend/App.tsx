import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Localizacoes from './Localizacoes';


const Stack = createStackNavigator();
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const requestLocationPerm = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão de localização negada');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const openModal = () => {
    setIsModalVisible(true);
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const saveLocation = async () => {
    if (!inputText || !location) {
      alert("Por favor, preencha o nome e obtenha a localização!");
      return;
    }
  
    const data = {
      nome: inputText,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  
    try {
      const response = await fetch("http://localhost:3000/localizacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("localização salva com sucesso!")
        closeModal();
      } else {
        alert("Erro ao salvar localização.");
      }
    } catch (error) {
      console.error("Erro ao salvar a localização:", error);
      alert("Ocorreu um erro ao salvar a localização.");
    }
  };
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home">
        {({ navigation }) => (
    <View style={styles.container}>
      <Text style={styles.title}>Salvador de localização!</Text>

      <ScrollView contentContainerStyle={styles.scrollView}>

        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <Text style={styles.text}>Defina um nome para a localização</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite um nome"
                value={inputText}
                onChangeText={setInputText}
              />

              <TouchableOpacity style={styles.button} onPress={saveLocation}>
                <Text style={styles.buttonText}>Salvar localização</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>Localização:</Text>
            <Text style={styles.locationText}>Latitude: {location.coords.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {location.coords.longitude}</Text>
          </View>
        )}

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={requestLocationPerm}>
          <Text style={styles.buttonText}>Calcular localização</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondButton}>
          <Text style={styles.secondButtonText} onPress={openModal}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondButton}>
          <Text style={styles.secondButtonText} onPress={() => navigation.navigate('Localizacoes')}>Consultar localizações salvas</Text>
        </TouchableOpacity>
      </ScrollView>

      <StatusBar style="auto" />
    </View>
        )}
    </Stack.Screen>


    <Stack.Screen name="Localizacoes" component={Localizacoes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 50,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    minWidth: 200,
    minHeight: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  secondButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    minWidth: 200,
    minHeight: 50,
    borderColor: 'blue',
    borderWidth: 3,
  },
  secondButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  locationContainer: {
    marginTop: 20,
    marginBottom: 8,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
