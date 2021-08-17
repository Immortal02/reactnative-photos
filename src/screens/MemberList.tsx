import React, { useEffect, useState} from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Member } from '../types/PhotoTypes'

export default () => {
  const [userList, setUserList] = useState<Member[]>([])
  const [error, setError] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(false)


  const navigation = useNavigation()

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:3000/member")
      .then(res => res.json())
      .then(members => {
        console.log("members", members)
        setUserList(members)
      })
      .catch(err => {
        setError(true)
        setUserList([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const goToPhotos = (id: number) => {
    navigation.navigate('ProfilePhotos', {
      userId: id
    })
  }

  const renderItem = ({ item }: { item: Member }) => {
    return (
      <TouchableOpacity style={styles.memberContainer} onPress={() => goToPhotos(item.id)}>
        <Text style={styles.row}>{`First Name: ${item.firstName}`}</Text>
        <Text style={styles.row}>{`Last Name: ${item.lastName}`}</Text>
        <Text style={styles.row}>{`Email: ${item.email}`}</Text>
      </TouchableOpacity>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error fetching members</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View>
        <Text>Fetching members...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{flex:1}}>
        <FlatList
          data={userList}
          renderItem={renderItem}
          keyExtractor={(item: Member): string => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
  },
  memberContainer : {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  row: {
    margin: 10,
  }
});