import { useState } from 'react';
import { Text, TextInput, View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, useColorScheme, ColorSchemeName } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CameraButton from '@/components/CameraButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type Card = {
  id: number;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const colorScheme: ColorSchemeName = useColorScheme() || 'light';
  const styles = createStyles(colorScheme);

  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const addOrUpdateCard = () => {
    if (title.trim() === '') {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    if (editingId !== null) {
      setCards(cards.map(card => card.id === editingId ? { id: editingId, title, description } : card));
      setEditingId(null);
    } else {
      const newCard: Card = { id: Date.now(), title, description };
      setCards([...cards, newCard]);
    }
    setTitle('');
    setDescription('');
  };

  const deleteCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleImagePicked = (uri: string) => {
    setPhotoUri(uri);
  };

  const deletePhoto = () => {
    setPhotoUri(null);
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#22653E', dark: '#4CAF50' }}
        headerImage={
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/logo.webp')}
              style={styles.logo}
            />
          </View>
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
          />
          <TouchableOpacity style={styles.button} onPress={addOrUpdateCard}>
            <Text style={styles.buttonText}>{editingId !== null ? "Update Card" : "Add Card"}</Text>
          </TouchableOpacity>
          <FlatList
            data={cards}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => {
                    setTitle(item.title);
                    setDescription(item.description);
                    setEditingId(item.id);
                  }}>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteCard(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListHeaderComponent={<View style={{ height: 20 }} />}
            ListFooterComponent={<View style={{ height: 20 }} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          {photoUri && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity onPress={deletePhoto} style={styles.deletePhotoButton}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </ParallaxScrollView>
      <CameraButton onImagePicked={handleImagePicked} colorScheme={colorScheme} />
    </>
  );
}

const createStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme === 'dark' ? '#4CAF50' : '#22653E',
  },
  logo: {
    width: width * 0.4,
    height: 100,
    marginRight: 10,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  stepContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#444' : '#ccc',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme === 'dark' ? '#4CAF50' : '#22653E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: theme === 'dark' ? 'black' : 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#444' : '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: theme === 'dark' ? '#fff' : '#000',
  },
  cardDescription: {
    fontSize: 16,
    marginBottom: 8,
    color: theme === 'dark' ? '#aaa' : '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editText: {
    backgroundColor: theme === 'dark' ? '#4CAF50' : '#22653E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: theme === 'dark' ? 'black' : 'white',
  },
  deleteText: {
    backgroundColor: theme === 'dark' ? '#F43434' : '#CB1616',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    fontSize: 16,
    color: theme === 'dark' ? 'black' : 'white',
  },
  photoContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    width: 200,
    height: 200,
    marginTop: 16,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
  },
});
