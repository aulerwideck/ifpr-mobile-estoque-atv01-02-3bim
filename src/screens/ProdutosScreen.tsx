import { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Categoria, Produto } from '../types';
import { categoriaApi, produtoApi } from '../api/api';
import { ListaProdutos } from '../components/ListaProdutos';
import { FormularioProduto } from '../components/FormularioProduto';
import { BotaoSair } from '../components/BotaoSair';

export function ProdutosScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: () => <BotaoSair /> });
  }, [navigation]);

  const carregar = useCallback(async () => {
    const [listaProdutos, listaCategorias] = await Promise.all([
      produtoApi.listar(),
      categoriaApi.listar(),
    ]);
    setProdutos(listaProdutos);
    setCategorias(listaCategorias);
  }, []);

  useFocusEffect(useCallback(() => { void carregar(); }, [carregar]));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View>
        <ListaProdutos produtos={produtos} />
        <FormularioProduto categorias={categorias} onProdutoCriado={carregar} />
      </View>
    </ScrollView>
  );
}
