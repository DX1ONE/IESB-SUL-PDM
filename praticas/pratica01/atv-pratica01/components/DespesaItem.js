import { View, Text, Pressable, StyleSheet } from 'react-native';

function getDataFormatada (data) {

return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();

}

function DespesaItem({item}){

    return (
    <Pressable>
        <View style={styles.itemContainer}>
            <View style={styles.itemText}>
                <Text>{getDataFormatada (item.data)}</Text>
            </View>
            <View style={styles.itemText}>
                <Text>{item.descricao}</Text>
            </View>
            <View style={styles.itemText}>
                <Text>R$ {item.valor}</Text>
            </View>
        </View>
    </Pressable>

    );

}