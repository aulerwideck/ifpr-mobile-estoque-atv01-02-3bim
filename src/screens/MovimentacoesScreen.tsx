import { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Movimentacao, Produto } from '../types';
import { movimentacaoApi, produtoApi } from '../api/api';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { FormularioMovimentacao } from '../components/FormularioMovimentacao';
import { BotaoSair } from '../components/BotaoSair';

export function MovimentacoesScreen() {
  const navigation = useNavigation();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    const [historico, listaProdutos] = await Promise.all([
      movimentacaoApi.listar(),
      produtoApi.listar(),
    ]);
    setMovimentacoes(historico);
    setProdutos(listaProdutos);
  }, []);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View>
        <ListaMovimentacoes movimentacoes={movimentacoes} />
        <FormularioMovimentacao produtos={produtos} onMovimentacaoCriada={carregar} />
      </View>
    </ScrollView>
  );
}
