import { View, Text, StyleSheet } from 'react-native';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
}

export function ListaProdutos({ produtos }: Props) {
  return (
    <View>
      <Text style={styles.titulo}>Produtos</Text>
      {produtos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum produto cadastrado.</Text>
      ) : produtos.map((produto) => (
        <View key={produto.id} style={styles.item}>
          <View style={styles.linha}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.id}>ID {produto.id}</Text>
          </View>
          <Text style={styles.categoria}>Categoria: {produto.categoria.nome}</Text>
          <View style={styles.linha}>
            <Text>R$ {produto.preco.toFixed(2).replace('.', ',')}</Text>
            <Text>Estoque: {produto.quantidade} un.</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  vazio: { color: '#666', marginBottom: 12 },
  item: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 8 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  nome: { fontWeight: '600', flexShrink: 1 },
  id: { color: '#666' },
  categoria: { color: '#555', marginVertical: 8 },
});
