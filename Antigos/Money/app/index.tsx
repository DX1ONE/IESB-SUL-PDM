import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image 
} from "react-native";

// Importações de constantes e textos
import { 
  rotulo_input_meta, 
  rotulo_btn_cadastro_meta, 
  rotulo_lista_metas 
} from "./mensagens";

export default function MoneyApp() {
  const [metaDigitada, setMetaDigitada] = useState('');
  const [listaMetas, setListaMetas] = useState<string[]>([]);

  const adicionarMeta = () => {
    if (metaDigitada.trim().length > 0) {
      setListaMetas([...listaMetas, metaDigitada]);
      setMetaDigitada(''); 
    }
  };

  const excluirMeta = (indexParaRemover: number) => {
  // Mantém na lista apenas os itens que possuem o index DIFERENTE do que queremos remover
  setListaMetas(listaMetas.filter((_, index) => index !== indexParaRemover));
};

  return (
    <View style={styles.containerPrincipal}>
      
      {/* HEADER FIXO (Não entra no ScrollView) */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/MoneyApp.png')} 
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Money App</Text>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView contentContainerStyle={styles.mainContainer}>
        
        {/* ÁREA DE INPUT E BOTÃO EM LINHA */}
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

        <Text style={styles.labelLista}>{rotulo_lista_metas}</Text>

        {/* LISTAGEM DAS METAS */}
        {listaMetas.map((item, index) => (
  <View key={index} style={styles.itemMeta}>
    <Text style={styles.textoItem}>• {item}</Text>
    
    {/* Botão de Excluir */}
    <TouchableOpacity 
      style={styles.botaoExcluir} 
      onPress={() => excluirMeta(index)}
    >
      <Text style={styles.textoExcluir}>X</Text>
    </TouchableOpacity>
  </View>
))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Cor de fundo leve
  },
  header: {
    height: 100,
    backgroundColor: '#1a9643',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginTop: -40,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    height: 100,
  },
  mainContainer: {
    padding: 20,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  inputText: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#1a9643',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    elevation: 2,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  labelLista: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1a9643',
    alignSelf: 'flex-start',
  },
  listaContainer: {
    marginTop: 5,
  },
  itemMeta: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row', // Alinha texto e botão X em linha
    justifyContent: 'space-between', // Joga o texto pra esquerda e o X pra direita
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#1a9643',
    elevation: 2,
  },
  textoItem: {
    fontSize: 16,
    color: '#444',
  },
  botaoExcluir: {
    backgroundColor: '#ff4d4d', // Vermelho para indicar exclusão
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoExcluir: {
    color: 'white',
    fontWeight: 'bold',
  },
});