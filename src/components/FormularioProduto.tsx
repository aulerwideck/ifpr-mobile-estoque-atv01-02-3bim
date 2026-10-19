import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { produtoApi } from '../api/api';
import { Categoria } from '../types';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => void | Promise<void>;
}

export function FormularioProduto({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState(0);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    const valorPreco = Number(preco.replace(',', '.'));
    const valorQuantidade = Number(quantidade);
    if (!nome.trim() || !preco.trim() || !quantidade.trim() || categoriaId === 0) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (!Number.isFinite(valorPreco) || valorPreco <= 0 ||
        !Number.isInteger(valorQuantidade) || valorQuantidade < 0) {
      setErro('Informe um preço maior que zero e uma quantidade inteira não negativa.');
      return;
    }

    setErro('');
    setSalvando(true);
    try {
      await produtoApi.criar({ nome: nome.trim(), preco: valorPreco, quantidade: valorQuantidade, categoriaId: Number(categoriaId) });
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId(0);
      await onProdutoCriado();
    } catch (e) {
      setErro(obterMensagem(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.titulo}>Novo Produto</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Preço (R$)" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Quantidade inicial" value={quantidade} onChangeText={setQuantidade} keyboardType="number-pad" />
      <Text style={styles.rotulo}>Categoria</Text>
      <View style={styles.seletor}>
        <Picker selectedValue={categoriaId} onValueChange={(valor) => setCategoriaId(Number(valor))}>
          <Picker.Item label="Selecione uma categoria" value={0} />
          {categorias.map((categoria) => (
            <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
          ))}
        </Picker>
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TouchableOpacity style={[styles.botao, salvando && styles.desabilitado]} onPress={handleSubmit} disabled={salvando}>
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function obterMensagem(erro: unknown): string {
  const resposta = erro as { response?: { data?: { message?: string } } };
  return resposta?.response?.data?.message ?? 'Não foi possível cadastrar o produto.';
}

const styles = StyleSheet.create({
  form: { marginTop: 16, marginBottom: 24 },
  titulo: { fontWeight: '600', marginBottom: 8 },
  rotulo: { marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 8 },
  seletor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 8 },
  erro: { color: 'red', marginBottom: 8 },
  botao: { backgroundColor: '#2563eb', padding: 10, borderRadius: 6 },
  desabilitado: { opacity: 0.6 },
  botaoTexto: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
