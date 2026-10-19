import { View, Text, StyleSheet } from 'react-native';
import { Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
}

export function ListaMovimentacoes({ movimentacoes }: Props) {
  return (
    <View>
      <Text style={styles.titulo}>Movimentações</Text>
      {movimentacoes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma movimentação registrada.</Text>
      ) : movimentacoes.map((movimentacao) => (
        <View key={movimentacao.id} style={styles.item}>
          <View style={styles.linha}>
            <Text style={styles.nome}>{movimentacao.produto.nome}</Text>
            <Text style={[styles.tipo, movimentacao.tipo === 'ENTRADA' ? styles.entrada : styles.saida]}>
              {movimentacao.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
            </Text>
          </View>
          <View style={[styles.linha, styles.detalhes]}>
            <Text style={styles.data}>{new Date(movimentacao.criadoEm).toLocaleString('pt-BR')}</Text>
            <Text>{movimentacao.quantidade} un.</Text>
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
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  nome: { fontWeight: '600', flexShrink: 1 },
  tipo: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontWeight: '600', overflow: 'hidden' },
  entrada: { color: '#166534', backgroundColor: '#dcfce7' },
  saida: { color: '#991b1b', backgroundColor: '#fee2e2' },
  detalhes: { marginTop: 8 },
  data: { color: '#555' },
});
