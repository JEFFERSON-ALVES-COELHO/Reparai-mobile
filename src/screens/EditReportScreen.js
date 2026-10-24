import { useEffect, useState } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { atualizarOcorrencia } from '../database/database';

const CATEGORIAS = [
    'Buraco na via',
    'Iluminação pública',
    'Lixo irregular',
    'Sinalização',
    'Calçada',
    'Outros',
];

export default function EditReportScreen({ navigation, route }) {
    const ocorrencia = route.params?.ocorrencia;
    const usuario = route.params?.user;
    const usuarioId = usuario?.id;

    const [categoria, setCategoria] = useState(
        ocorrencia?.categoria ?? ''
    );
    const [titulo, setTitulo] = useState(
        ocorrencia?.titulo ?? ''
    );
    const [descricao, setDescricao] = useState(
        ocorrencia?.descricao ?? ''
    );
    const [endereco, setEndereco] = useState(
        ocorrencia?.endereco ?? ''
    );
    const [salvando, setSalvando] = useState(false);
    const [voltando, setVoltando] = useState(false);

    useEffect(() => {
        setCategoria(ocorrencia?.categoria ?? '');
        setTitulo(ocorrencia?.titulo ?? '');
        setDescricao(ocorrencia?.descricao ?? '');
        setEndereco(ocorrencia?.endereco ?? '');
    }, [ocorrencia]);

    // Retorna à Home preservando o usuário conectado.
    function voltar() {
        if (voltando || salvando) {
            return;
        }

        setVoltando(true);

        navigation.navigate('Home', {
            user: usuario,
        });
    }

    function salvarAlteracoes() {
        if (salvando || voltando) {
            return;
        }

        if (!ocorrencia?.id) {
            Alert.alert(
                'Erro',
                'Não foi possível identificar a ocorrência.'
            );
            return;
        }

        if (
            usuarioId === undefined ||
            usuarioId === null ||
            !Number.isInteger(Number(usuarioId)) ||
            Number(usuarioId) <= 0
        ) {
            Alert.alert(
                'Sessão não identificada',
                'Não foi possível identificar o usuário. Volte para o login e entre novamente.'
            );
            return;
        }

        if (
            !categoria ||
            !titulo.trim() ||
            !descricao.trim() ||
            !endereco.trim()
        ) {
            Alert.alert(
                'Campos obrigatórios',
                'Preencha a categoria, o título, a descrição e o endereço.'
            );
            return;
        }

        const tituloLimpo = titulo.trim();
        const descricaoLimpa = descricao.trim();

        if (tituloLimpo.length < 10) {
            Alert.alert(
                'Título muito curto',
                'O título deve ter no mínimo 10 caracteres.'
            );
            return;
        }

        if (tituloLimpo.length > 50) {
            Alert.alert(
                'Título muito longo',
                'O título deve ter no máximo 50 caracteres.'
            );
            return;
        }

        if (descricaoLimpa.length < 10) {
            Alert.alert(
                'Descrição muito curta',
                'A descrição deve ter no mínimo 10 caracteres.'
            );
            return;
        }

        if (descricaoLimpa.length > 1000) {
            Alert.alert(
                'Descrição muito longa',
                'A descrição deve ter no máximo 1.000 caracteres.'
            );
            return;
        }

        setSalvando(true);

        try {
            const ocorrenciaAtualizada = {
                ...ocorrencia,
                categoria,
                titulo: tituloLimpo,
                descricao: descricaoLimpa,
                endereco: endereco.trim(),
                user_id: Number(usuarioId),
            };

            // O ID do usuário garante que a atualização
            // seja limitada às ocorrências desse usuário.
            const alteracoes = atualizarOcorrencia(
                ocorrenciaAtualizada,
                Number(usuarioId)
            );

            if (alteracoes === 0) {
                Alert.alert(
                    'Atenção',
                    'Nenhuma alteração foi salva. Verifique se a ocorrência pertence ao usuário conectado e ainda existe.'
                );
                return;
            }

            Alert.alert(
                'Sucesso',
                'Ocorrência atualizada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('ReportDetail', {
                                ocorrencia: ocorrenciaAtualizada,
                                user: usuario,
                            });
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (erro) {
            console.error(
                'Erro ao atualizar ocorrência:',
                erro
            );

            Alert.alert(
                'Erro',
                erro?.message ||
                'Não foi possível salvar as alterações. Tente novamente.'
            );
        } finally {
            setSalvando(false);
        }
    }

    if (!ocorrencia) {
        return (
            <View style={styles.centralizado}>
                <Text style={styles.tituloTela}>
                    Ocorrência não encontrada.
                </Text>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    activeOpacity={0.7}
                    onPress={voltar}
                    disabled={voltando}
                >
                    <Text style={styles.textoBotaoVoltar}>
                        ← Voltar para ocorrências
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={
                Platform.OS === 'ios' ? 'padding' : undefined
            }
        >
            <ScrollView
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.botaoVoltar}
                    activeOpacity={0.7}
                    onPress={voltar}
                    disabled={voltando || salvando}
                >
                    <Text style={styles.textoBotaoVoltar}>
                        {voltando
                            ? 'Voltando...'
                            : '← Voltar para ocorrências'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.tituloTela}>
                    Editar ocorrência
                </Text>

                <Text style={styles.subtitulo}>
                    Altere os dados e salve as modificações.
                </Text>

                <Text style={styles.label}>Categoria</Text>

                <View style={styles.listaCategorias}>
                    {CATEGORIAS.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.categoria,
                                categoria === item &&
                                styles.categoriaSelecionada,
                                (salvando || voltando) &&
                                styles.botaoDesabilitado,
                            ]}
                            onPress={() => setCategoria(item)}
                            disabled={salvando || voltando}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.textoCategoria,
                                    categoria === item &&
                                    styles.textoCategoriaSelecionada,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Título</Text>

                <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Digite o título"
                    placeholderTextColor="#888888"
                    maxLength={50}
                    editable={!salvando && !voltando}
                    returnKeyType="next"
                />
                <Text style={[
                    styles.counter,
                    titulo.trim().length < 10 && styles.counterWarning
                ]}>
                    {titulo.trim().length}/50 caracteres (mínimo 10)
                </Text>

                <Text style={styles.label}>Descrição</Text>

                <TextInput
                    style={[
                        styles.input,
                        styles.inputDescricao,
                    ]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descreva o problema"
                    placeholderTextColor="#888888"
                    multiline
                    textAlignVertical="top"
                    maxLength={1000}
                    editable={!salvando && !voltando}
                />
                <Text style={[
                    styles.counter,
                    descricao.trim().length < 10 && styles.counterWarning
                ]}>
                    {descricao.trim().length}/1.000 caracteres (mínimo 10)
                </Text>

                <Text style={styles.label}>Endereço</Text>

                <TextInput
                    style={styles.input}
                    value={endereco}
                    onChangeText={setEndereco}
                    placeholder="Informe o endereço"
                    placeholderTextColor="#888888"
                    maxLength={200}
                    editable={!salvando && !voltando}
                    returnKeyType="done"
                />

                <TouchableOpacity
                    style={[
                        styles.botaoSalvar,
                        (salvando || voltando) &&
                        styles.botaoDesabilitado,
                    ]}
                    onPress={salvarAlteracoes}
                    activeOpacity={0.7}
                    disabled={salvando || voltando}
                >
                    {salvando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.textoBotao}>
                            Salvar alterações
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    centralizado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F4F6F8',
    },
    botaoVoltar: {
        width: '100%',
        minHeight: 56,
        backgroundColor: '#1976D2',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    textoBotaoVoltar: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tituloTela: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 15,
        color: '#666666',
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        marginTop: 12,
    },
    listaCategorias: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoria: {
        borderWidth: 1,
        borderColor: '#1976D2',
        borderRadius: 20,
        paddingVertical: 11,
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
    },
    categoriaSelecionada: {
        backgroundColor: '#1976D2',
    },
    textoCategoria: {
        color: '#1976D2',
        fontSize: 13,
    },
    textoCategoriaSelecionada: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 8,
        padding: 14,
        minHeight: 50,
        fontSize: 16,
        color: '#222222',
    },
    inputDescricao: {
        minHeight: 120,
    },
    counter: {
        color: '#777777',
        fontSize: 12,
        textAlign: 'right',
        marginTop: 5,
    },
    counterWarning: {
        color: '#D32F2F',
    },
    botaoSalvar: {
        backgroundColor: '#2E7D32',
        minHeight: 54,
        padding: 15,
        borderRadius: 10,
        marginTop: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
});