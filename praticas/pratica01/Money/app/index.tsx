import { Text, View, StyleSheet, TouchableOpacity, TextInput, Button} from "react-native";
// Importando o que você definiu no util.ts
import { titulo } from "../utils/util"; 
import textoDefault from "../utils/util"; // Importando o export default
import React, { useState } from "react";

import { rotulo_input_meta, rotulo_btn_cadastro_meta, rotulo_lista_metas } from "./mensagens";

export default function MoneyApp() {
  const [metaDigitada, setMetaDigitada] = useState('');
  const [listaMetas, setListaMetas] = useState<string[]>([]);

  const adicionarMeta = () => {
    if (metaDigitada.length > 0) {
      setListaMetas([...listaMetas, metaDigitada]);
      setMetaDigitada(''); 
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.containerInput}>
  <TextInput 
    style={styles.inputText}
    placeholder={rotulo_input_meta}
    value={metaDigitada}
    onChangeText={setMetaDigitada} 
  />
    
      <TouchableOpacity style={styles.botao} onPress={adicionarMeta}>
      <Text style={styles.textoBotao}>{rotulo_btn_cadastro_meta}</Text>
      </TouchableOpacity>
      </View>


      <Text style={styles.labelLista}>
        {rotulo_lista_metas}
      </Text>

      {/*  Bloco para mostrar os itens na tela */}
      <View style={{ marginTop: 10 }}>
        {listaMetas.map((item, index) => (
          <View key={index} style={styles.itemMeta}>
            <Text>• {item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Estilos usando StyleSheet (mais organizado)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inline:{
    color: 'blue',
    fontSize: 20,
    marginTop: 10
  },
  botao: {
    backgroundColor: '#1a9643b6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputText: {
    flex: 1, // Faz o input ocupar o máximo de espaço possível na linha
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10, // Espaço entre o input e o botão
  },
  labelLista: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  mainContainer:{
    padding: 30,
  },
  itemMeta: {
    backgroundColor: '#b7ebb3',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  containerInput: {
    flexDirection: 'row', // Alinha os filhos em linha (horizontal)
    alignItems: 'center', // Alinha o botão e o input verticalmente ao centro
    justifyContent: 'space-between', // Dá um espaço entre o input e o botão
    marginBottom: 20,
  },
});