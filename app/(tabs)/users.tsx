import { StyleSheet, Image, Text, View, TouchableOpacity, ActivityIndicator, Dimensions, useColorScheme, TextInput, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import currentEnvironment from '@/constants/environment';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';

type Gender = 'female' | 'male' | '';

const { width } = Dimensions.get('window');

type User = {
  gender: Gender;
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
};

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark' ? 'dark' : 'light');

  const [users, setUsers] = useState<User[]>([]);
  const [gender, setGender] = useState<Gender>('');
  const [pageToGet, setPageToGet] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredUsers = users.filter(user =>
    user.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.last.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        <ThemedText type="title">Users</ThemedText>
      </ThemedView>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
      />
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={gender === 'female'}
            onValueChange={() => handleGenderChange('female')}
            color={gender === 'female' ? '#4630EB' : undefined}
          />
          <ThemedText>Female</ThemedText>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={gender === 'male'}
            onValueChange={() => handleGenderChange('male')}
            color={gender === 'male' ? '#4630EB' : undefined}
          />
          <ThemedText>Male</ThemedText>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={gender === ''}
            onValueChange={() => handleGenderChange('')}
            color={gender === '' ? '#4630EB' : undefined}
          />
          <ThemedText>All</ThemedText>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? "#fff" : "#000"} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.login.uuid}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Image source={{ uri: item.picture.large }} style={styles.userImage} />
              <View>
                <Text style={styles.userName}>{item.name.first} {item.name.last}</Text>
                <Text style={styles.userGender}>{item.gender}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}
      <TouchableOpacity
        style={styles.loadMore}
        onPress={() => {
          setPageToGet(v => v + 1);
        }}
      >
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    </ParallaxScrollView>
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
    justifyContent: 'center',
    padding: 16,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#444' : '#ccc',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    borderRadius: 8,
    padding: 12,
    margin: 16,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: theme === 'dark' ? '#444' : '#ddd',
    borderWidth: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  userGender: {
    fontSize: 16,
    color: theme === 'dark' ? 'white' : 'black',
  },
  noUsersText: {
    textAlign: 'center',
    color: theme === 'dark' ? 'white' : 'black',
    fontSize: 16,
    padding: 16,
  },
  loadMore: {
    backgroundColor: theme === 'dark' ? '#4CAF50' : '#22653E',
    padding: 14,
    borderRadius: 6,
    margin: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: theme === 'dark' ? 'black' : 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
