import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { movimentacaoApi } from '../api/api';
import { Produto, TipoMovimentacao } from '../types';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => void | Promise<void>;
}

export function FormularioMovimentacao({ produtos, onMovimentacaoCriada }: Props) {
  const [produtoId, setProdutoId] = useState(0);
  const [tipo, setTipo] = useState<TipoMovimentacao | ''>('');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    const valorQuantidade = Number(quantidade);
    if (produtoId === 0 || tipo === '' || !quantidade.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!Number.isInteger(valorQuantidade) || valorQuantidade <= 0) {
      setErro('Informe uma quantidade inteira maior que zero.');
      return;
    }

    setErro('');
    setSalvando(true);
    try {
      await movimentacaoApi.criar({ produtoId: Number(produtoId), tipo, quantidade: valorQuantidade });
      setProdutoId(0);
      setTipo('');
      setQuantidade('');
      await onMovimentacaoCriada();
    } catch (e) {
      setErro(obterMensagem(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Nova Movimentação</Text>
      <Text style={styles.rotulo}>Produto</Text>
      <View style={styles.seletor}>
        <Picker selectedValue={produtoId} onValueChange={(valor) => setProdutoId(Number(valor))}>
          <Picker.Item label="Selecione um produto" value={0} />
          {produtos.map((produto) => (
            <Picker.Item key={produto.id} label={`${produto.nome} — estoque: ${produto.quantidade} un.`} value={produto.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.rotulo}>Tipo</Text>
      <View style={styles.seletor}>
        <Picker selectedValue={tipo} onValueChange={(valor) => setTipo(valor as TipoMovimentacao | '')}>
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Entrada" value="ENTRADA" />
          <Picker.Item label="Saída" value="SAIDA" />
        </Picker>
      </View>
      <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={[styles.botao, salvando && styles.desabilitado]} onPress={handleSubmit} disabled={salvando}>
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function obterMensagem(erro: unknown): string {
  const resposta = erro as { response?: { data?: { message?: string } } };
  return resposta?.response?.data?.message ?? 'Não foi possível registrar a movimentação.';
}

const styles = StyleSheet.create({
  form: { marginTop: 16, marginBottom: 24 },
  titulo: { fontWeight: '600', marginBottom: 8 },
  rotulo: { marginBottom: 4 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
  erro: { color: 'red', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  desabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
