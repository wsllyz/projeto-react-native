import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const Localizacoes = () => {
  const [localizacoes, setLocalizacoes] = useState([]);

  useEffect(() => {
    const fetchLocalizacoes = async () => {
      try {
        const response = await fetch('http://localhost:3000/localizacao');
        const data = await response.json();
        
        // Invertendo a ordem das localizações (do último para o primeiro)
        setLocalizacoes(data.reverse());
      } catch (error) {
        console.error("Erro ao carregar localizações:", error);
      }
    };

    fetchLocalizacoes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localizações Salvas</Text>
      <ScrollView>
        {localizacoes.map((loc, index) => (
          <View key={index} style={styles.locationCard}>
            <Text>{loc.nome}</Text>
            <Text>{`Latitude: ${loc.latitude}`}</Text>
            <Text>{`Longitude: ${loc.longitude}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Localizacoes;
