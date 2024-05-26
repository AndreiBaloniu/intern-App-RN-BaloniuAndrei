import { useState } from 'react';
import { Button, Text, TextInput, View, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width } = Dimensions.get('window');

type Card = {
  id: number;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const addOrUpdateCard = () => {
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a4c991', dark: '#a4c991' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo.webp')}
          style={styles.logo}
        />
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
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        />
        <Button title={editingId !== null ? "Update Card" : "Add Card"} onPress={addOrUpdateCard} />
        <FlatList
          data={cards}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.description}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <TouchableOpacity onPress={() => {
                  setTitle(item.title);
                  setDescription(item.description);
                  setEditingId(item.id);
                }}>
                  <Text style={{ marginRight: 16, color: 'blue' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCard(item.id)}>
                  <Text style={{ color: 'red' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    height: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    width: width * 0.4,
    resizeMode: 'contain',
  },
});
