import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Image } from 'react-native';
import axios from 'axios';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  description: string;
}

const App = () => {
  const [allProperties, setAllProperties] = useState<Property[]>([]); // State to keep track of all properties
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyDetails, setPropertyDetails] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://bayut.p.rapidapi.com/properties/list', {
          params: {
            locationExternalIDs: '5002,6020',
            purpose: 'for-rent',
            hitsPerPage: '25',
            page: '0',
            lang: 'en',
            sort: 'city-level-score',
            rentFrequency: 'monthly',
            categoryExternalID: '4',
          },
          headers: {
            'X-RapidAPI-Key': 'cd6b4be502msh2058e3edadf0103p106eeejsneb0c2b75f2c1',
            'X-RapidAPI-Host': 'bayut.p.rapidapi.com',
          },
        });
        setProperties(response.data.hits);
        setAllProperties(response.data.hits); // Save the full list in allProperties
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = () => {
    if (!searchQuery) {
      setProperties(allProperties); // Reset to all properties if search query is empty
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredProperties = allProperties.filter((property) => { // Use allProperties to filter
      const lowerCaseTitle = property.title?.toLowerCase() || '';
      const lowerCaseDescription = property.description?.toLowerCase() || '';

      return lowerCaseTitle.includes(lowerCaseQuery) || lowerCaseDescription.includes(lowerCaseQuery);
    });

    setProperties(filteredProperties); // Set the filtered list
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get('https://bayut.p.rapidapi.com/properties/detail', {
          params: {
            externalID: '4937770',
          },
          headers: {
            'X-RapidAPI-Key': 'cd6b4be502msh2058e3edadf0103p106eeejsneb0c2b75f2c1',
            'X-RapidAPI-Host': 'bayut.p.rapidapi.com',
          },
        });
        console.log('Property details:', response.data);
        setPropertyDetails(response.data); // Update the state with the fetched details
      } catch (error) {
        console.error(error);
      }
    };

    fetchPropertyDetails();
  }, []);

  const PropertyItem = ({ item }: { item: Property }) => {
    return (
      <View style={styles.propertyContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>Price: {item.price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          placeholder="Search properties..."
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <Text style={styles.header}>Properties</Text>
      <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propertyContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default App;
