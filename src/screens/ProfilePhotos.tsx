import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  LayoutChangeEvent,
  Dimensions,
  TouchableOpacity
} from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import FastImage from "react-native-fast-image"

import { Photo } from "../types/PhotoTypes"


export default ({ route }) => {
  const [list, setList] = useState<Photo[]>([])
  const [itemHeight, setItemHeight] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)
  const [error, setError] = useState<Boolean>(false)
  const [loading, setLoading] = useState<Boolean>(false)

  const { userId } = route.params;

  useEffect(() => {
    getPhotos()
  }, [])

  const getPhotos = () => {
    setLoading(true)
    fetch(`http://localhost:3000/member/${userId}/photos`)
      .then(res => res.json())
      .then(images => {
        setList(images)
      })
      .catch(err => {
        setError(true)
        setList([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const deletePhoto = (id: string) => {
    setLoading(true)
    fetch(`http://localhost:3000/photos/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(res => {
      getPhotos()
    })
    .catch(err => {})
    .finally(() => [
      setLoading(false)
    ])
  }

  const addPhoto = () => {
    const data = {
      "url": "https://miro.medium.com/max/2000/1*KvhM-ArA5RkpYLi7L_Qtdw.jpeg",
      "position": 1,
      "width": 2000,
      "height": 1000,
      "centerX": 1000,
      "centerY": 500
    }
    
    setLoading(true)
    fetch(`http://localhost:3000/member/${userId}/photos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      getPhotos()
    })
    .catch(err => {})
    .finally(() => [
      setLoading(false)
    ])
  }

  const sortPhotos = () => {
    const newPhotos = list.sort((a: Photo, b: Photo) => a.position > b.position ? -1 : 1)
    setList([...newPhotos])
  }

  const renderItem = ({ item }: { item: Photo }): React.ReactElement => {
    if (itemWidth === 0 || itemHeight === 0) {
      return (
        <View><Text>loading...</Text></View>
      )
    }

    const widthRate = itemWidth / item.width
    const heightRate = itemHeight / item.height
    const offsetX= (item.centerX - (item.width / 2)) * widthRate
    const offsetY = (item.centerY - (item.height / 2)) * heightRate

    const scaleX = itemWidth / 2 / (item.centerX < item.width / 2 ? item.centerX : item.width - item.centerX) / widthRate
    const scaleY = itemHeight / 2 / (item.centerY < item.height / 2 ? item.centerY : item.height - item.centerY) / heightRate

    let scale = scaleX > scaleY ? scaleX : scaleY
    scale = scale < 1 ? 1 : scale

    return (
      <View style={[styles.imageContainer, {width: itemWidth}]}>
        <View style={[styles.image, {height: itemHeight, width: itemWidth}]}>
          <FastImage source={{ uri: item.url }} style={{flex: 1, transform: [{scale}, {translateX: -offsetX}, {translateY: -offsetY}]}} />
        </View>
        <TouchableOpacity style={styles.closeContainer} onPress={() => deletePhoto(item.id)} activeOpacity={0.7}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const extractKey = (item: Photo): string => item.id;

  const onLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height - 60
    const width = e.nativeEvent.layout.width - 80
    setItemHeight(height / 3)
    setItemWidth(width / 3)
  };

  const getItemLayout = (data: Photo[] | null | undefined, index: number) => {
    return { length: itemHeight, offset: itemHeight * index, index };
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={{flex:1}}>
      {error ? (
        <Text>Error fetching images</Text>
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.list}>
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={addPhoto} style={styles.button}>
              <Text>Add Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={sortPhotos} style={styles.button}>
              <Text>Sort by position</Text>
            </TouchableOpacity>
          </View>
          <FlatList<Photo>
            data={list}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={extractKey}
            getItemLayout={getItemLayout}
            onLayout={onLayout}
            style={styles.list}
            columnWrapperStyle={[styles.columnWrapper, { height: itemHeight }]}
          />
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 10
  },
  imageContainer: {
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal:10
  },
  image: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 12,
    alignItems: 'center'
  },
  list: {
    flex: 1
  },
  columnWrapper: {
    flex: 1,
    flexDirection: "row",
    margin: 10
  },
  closeContainer: {
    position: 'absolute',
    display: 'flex',
    bottom: -8,
    right: -8,
    borderRadius: 30,
    width: 30,
    height: 30,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  closeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '800'
  }
});