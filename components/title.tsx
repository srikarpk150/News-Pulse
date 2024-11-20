import { StyleSheet, Text } from 'react-native'
import React from 'react'

const Title = () => {
  return (
    <Text style={styles.message}>NEWS PULSE</Text>
  )
}


const styles = StyleSheet.create({
    message: {
        fontSize: 26,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 16,
        fontFamily: 'TimesNewRoman',
      },
})

export default Title