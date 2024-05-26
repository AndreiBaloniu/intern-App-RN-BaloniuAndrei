import { StyleSheet, Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import currentEnvironment from '@/constants/environment';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';

type Gender = 'female' | 'male' | '';

type User = {
  gender: Gender;
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
};

export default function TabTwoScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [gender, setGender] = useState<Gender>('');
  const [pageToGet, setPageToGet] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = async (page: number, gender: Gender) => {
    setLoading(true);
    const genderQuery = gender ? `&gender=${gender}` : '';
    const result = await fetch(
      `${currentEnvironment.api.baseUrl}?results=5&page=${page}${genderQuery}`
    );
    const data = await result.json();
    const usersResults = data.results as User[];

    setUsers(oldUsers => (page === 1 ? usersResults : [...oldUsers, ...usersResults]));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getUsers(pageToGet, gender);
    })();
  }, [pageToGet, gender]);

  const handleGenderChange = (newGender: Gender) => {
    setUsers([]);
    setPageToGet(1);
    setGender(newGender);
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
        <ThemedText type="title">Users</ThemedText>
      </ThemedView>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'female'}
          onValueChange={() => handleGenderChange('female')}
          color={gender === 'female' ? '#4630EB' : undefined}
        />
        <ThemedText>Female</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === 'male'}
          onValueChange={() => handleGenderChange('male')}
          color={gender === 'male' ? '#4630EB' : undefined}
        />
        <ThemedText>Male</ThemedText>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Checkbox
          value={gender === ''}
          onValueChange={() => handleGenderChange('')}
          color={gender === '' ? '#4630EB' : undefined}
        />
        <ThemedText>All</ThemedText>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : users.length > 0 ? (
        users.map((user: User) => (
          <Text key={user.login.uuid} style={{ color: 'black' }}>
            {user.name.first} {user.name.last} {user.gender}
          </Text>
        ))
      ) : (
        <Text style={{ color: 'white' }}>No users found</Text>
      )}
      <TouchableOpacity
        style={styles.loadMore}
        onPress={() => {
          setPageToGet(v => v + 1);
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Load More</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadMore: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 6,
    margin: 10,
  },
});
