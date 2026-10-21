
import { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';

import {
    atualizarStatus,
    excluirOcorrencia,
} from '../database/database';

import {
    obterFoto,
    excluirFoto,
} from '../database/fotos';

const STATUS = [
    'Enviada',
    'Em análise',
    'Em execução',
    'Resolvida',
];

const CORES_STATUS = {
    'Enviada': '#1976D2',
    'Em análise': '#EF6C00',
    'Em execução': '#F9A825',
    'Resolvida': '#2E7D32',
};

export default function ReportDetailScreen({ navigation, route }) {
    const ocorrencia = route.params?.ocorrencia;
    const usuario = route.params?.user;
    const usuarioId = usuario?.id;

    const [statusAtual, setStatusAtual] = useState(
        ocorrencia?.status || 'Enviada'
    );

    const [fotoUri, setFotoUri] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(true);
    const [atualizandoStatus, setAtualizandoStatus] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [voltando, setVoltando] = useState(false);

    useEffect(() => {
        setStatusAtual(ocorrencia?.status || 'Enviada');
    }, [ocorrencia?.id, ocorrencia?.status]);

    useEffect(() => {
        let ativo = true;

        async function carregarFoto() {
            setCarregandoFoto(true);
            setFotoUri(null);

            try {
                if (!ocorrencia?.id) {
                    return;
                }

                const caminho = await obterFoto(ocorrencia.id);

                if (ativo) {
                    setFotoUri(caminho || null);
                }
            } catch (erro) {
                console.error('Erro ao carregar foto:', erro);

                if (ativo) {
                    setFotoUri(null);
                }
            } finally {
                if (ativo) {
                    setCarregandoFoto(false);
                }
            }
        }

        carregarFoto();

        return () => {
            ativo = false;
        };
    }, [ocorrencia?.id]);

    function usuarioValido() {
        return (
            usuarioId !== undefined &&
            usuarioId !== null &&
            Number.isInteger(Number(usuarioId)) &&
            Number(usuarioId) > 0
        );
    }

    function voltar() {
        if (voltando || excluindo || atualizandoStatus) {
            return;
        }

        if (navigation.canGoBack()) {
            setVoltando(true);
            navigation.goBack();
            return;
        }

        navigation.navigate('Home', { user: usuario });
    }

    function alterarStatus(novoStatus) {
        if (
            !ocorrencia?.id ||
            atualizandoStatus ||
            excluindo ||
            statusAtual === novoStatus
        ) {
            return;
        }

        if (!usuarioValido()) {
            Alert.alert(
                'Sessão não identificada',
                'Entre novamente para atualizar esta ocorrência.'
            );
            return;
        }

        setAtualizandoStatus(true);

        try {
            const alteracoes = atualizarStatus(
                ocorrencia.id,
                novoStatus,
                Number(usuarioId)
            );

            if (alteracoes === 0) {
                Alert.alert(
                    'Atenção',
                    'Não foi possível atualizar o status. Verifique se a ocorrência pertence ao usuário conectado.'
                );
                return;
            }

            setStatusAtual(novoStatus);

            Alert.alert(
                'Sucesso',
                'Status atualizado com sucesso.'
            );
        } catch (erro) {
            console.error('Erro ao atualizar status:', erro);

            Alert.alert(
                'Erro',
                erro?.message ||
                'Não foi possível atualizar o status.'
            );
        } finally {
            setAtualizandoStatus(false);
        }
    }

    function abrirEdicao() {
        if (
            !ocorrencia?.id ||
            excluindo ||
            atualizandoStatus
        ) {
            return;
        }

        if (!usuarioValido()) {
            Alert.alert(
                'Sessão não identificada',
                'Entre novamente para editar esta ocorrência.'
            );
            return;
        }

        navigation.navigate('EditReport', {
            ocorrencia: {
                ...ocorrencia,
                status: statusAtual,
            },
            user: usuario,
        });
    }

    function solicitarExclusao() {
        if (
            !ocorrencia?.id ||
            excluindo ||
            atualizandoStatus
        ) {
            return;
        }

        if (!usuarioValido()) {
            Alert.alert(
                'Sessão não identificada',
                'Entre novamente para excluir esta ocorrência.'
            );
            return;
        }

        Alert.alert(
            'Excluir ocorrência',
            'Tem certeza de que deseja excluir esta ocorrência? Essa ação não poderá ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: confirmarExclusao,
                },
            ]
        );
    }

    async function confirmarExclusao() {
        if (excluindo || atualizandoStatus) {
            return;
        }

        setExcluindo(true);

        try {
            const removidas = excluirOcorrencia(
                ocorrencia.id,
                Number(usuarioId)
            );

            if (removidas === 0) {
                Alert.alert(
                    'Atenção',
                    'A ocorrência não foi encontrada ou não pertence ao usuário conectado.'
                );
                return;
            }

            let fotoRemovida = true;

            try {
                await excluirFoto(ocorrencia.id);
            } catch (erroFoto) {
                fotoRemovida = false;

                console.error(
                    'Erro ao remover a foto:',
                    erroFoto
                );
            }

            Alert.alert(
                'Ocorrência excluída',
                fotoRemovida
                    ? 'A ocorrência foi excluída com sucesso.'
                    : 'A ocorrência foi excluída, mas não foi possível remover o arquivo da foto.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            if (navigation.canGoBack()) {
                                navigation.goBack();
                            } else {
                                navigation.navigate('Home', {
                                    user: usuario,
                                });
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (erro) {
            console.error('Erro ao excluir ocorrência:', erro);

            Alert.alert(
                'Erro',
                erro?.message ||
                'Não foi possível excluir a ocorrência. Tente novamente.'
            );
        } finally {
            setExcluindo(false);
        }
    }

    if (!ocorrencia) {
        return (
            <View style={styles.centralizado}>
                <Text style={styles.titulo}>
                    Ocorrência não encontrada.
                </Text>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    activeOpacity={0.7}
                    onPress={voltar}
                    disabled={voltando}
                >
                    <Text style={styles.textoBotaoVoltar}>
                        ← Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const dataFormatada = ocorrencia.data
        ? new Date(ocorrencia.data).toLocaleString('pt-BR')
        : 'Não informada';

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
        >
            <TouchableOpacity
                style={styles.botaoVoltar}
                activeOpacity={0.7}
                onPress={voltar}
                disabled={
                    voltando ||
                    excluindo ||
                    atualizandoStatus
                }
            >
                <Text style={styles.textoBotaoVoltar}>
                    ← Voltar para ocorrências
                </Text>
            </TouchableOpacity>

            <Text style={styles.titulo}>
                Detalhes da ocorrência
            </Text>

            <View style={styles.cartao}>
                <Text style={styles.label}>Título</Text>
                <Text style={styles.valor}>
                    {ocorrencia.titulo || 'Não informado'}
                </Text>

                <Text style={styles.label}>Categoria</Text>
                <Text style={styles.valor}>
                    {ocorrencia.categoria || 'Não informada'}
                </Text>

                <Text style={styles.label}>Descrição</Text>
                <Text style={styles.valor}>
                    {ocorrencia.descricao || 'Não informada'}
                </Text>

                <Text style={styles.label}>Endereço</Text>
                <Text style={styles.valor}>
                    {ocorrencia.endereco || 'Não informado'}
                </Text>

                <Text style={styles.label}>Data de cadastro</Text>
                <Text style={styles.valor}>
                    {dataFormatada}
                </Text>

                <Text style={styles.label}>
                    Foto da ocorrência
                </Text>

                {carregandoFoto ? (
                    <ActivityIndicator
                        size="large"
                        color="#1976D2"
                        style={styles.carregando}
                    />
                ) : fotoUri ? (
                    <Image
                        source={{ uri: fotoUri }}
                        style={styles.foto}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.semFoto}>
                        Nenhuma foto encontrada.
                    </Text>
                )}

                <Text style={styles.label}>Status atual</Text>

                <View
                    style={[
                        styles.statusAtual,
                        {
                            backgroundColor:
                                CORES_STATUS[statusAtual] || '#1976D2',
                        },
                    ]}
                >
                    <Text style={styles.textoStatusAtual}>
                        {statusAtual}
                    </Text>
                </View>

                <Text style={styles.label}>
                    Atualizar status
                </Text>

                {STATUS.map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.opcaoStatus,
                            statusAtual === status &&
                            styles.opcaoStatusSelecionada,
                            (atualizandoStatus || excluindo) &&
                            styles.botaoDesabilitado,
                        ]}
                        onPress={() => alterarStatus(status)}
                        disabled={
                            atualizandoStatus ||
                            excluindo ||
                            voltando ||
                            statusAtual === status
                        }
                    >
                        <Text
                            style={[
                                styles.textoOpcaoStatus,
                                statusAtual === status &&
                                styles.textoOpcaoSelecionada,
                            ]}
                        >
                            {statusAtual === status ? '✓ ' : ''}
                            {status}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles.botaoEditar,
                    (excluindo || atualizandoStatus || voltando) &&
                    styles.botaoDesabilitado,
                ]}
                activeOpacity={0.7}
                onPress={abrirEdicao}
                disabled={
                    excluindo ||
                    atualizandoStatus ||
                    voltando
                }
            >
                <Text style={styles.textoBotao}>
                    ✎ Editar ocorrência
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.botaoExcluir,
                    (excluindo || atualizandoStatus || voltando) &&
                    styles.botaoDesabilitado,
                ]}
                activeOpacity={0.7}
                onPress={solicitarExclusao}
                disabled={
                    excluindo ||
                    atualizandoStatus ||
                    voltando
                }
            >
                {excluindo ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.textoBotao}>
                        Excluir ocorrência
                    </Text>
                )}
            </TouchableOpacity>
        </ScrollView>
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
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    textoBotaoVoltar: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 20,
    },
    cartao: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666666',
        marginTop: 16,
        marginBottom: 6,
    },
    valor: {
        fontSize: 16,
        color: '#222222',
        lineHeight: 23,
    },
    carregando: {
        marginVertical: 20,
    },
    foto: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        backgroundColor: '#EEEEEE',
        marginTop: 8,
    },
    semFoto: {
        color: '#777777',
        fontSize: 14,
        marginTop: 8,
    },
    statusAtual: {
        alignSelf: 'flex-start',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 4,
    },
    textoStatusAtual: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    opcaoStatus: {
        borderWidth: 1,
        borderColor: '#1976D2',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        backgroundColor: '#FFFFFF',
    },
    opcaoStatusSelecionada: {
        backgroundColor: '#1976D2',
    },
    textoOpcaoStatus: {
        color: '#1976D2',
        textAlign: 'center',
        fontSize: 15,
    },
    textoOpcaoSelecionada: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    botaoEditar: {
        backgroundColor: '#2E7D32',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    botaoExcluir: {
        backgroundColor: '#C62828',
        padding: 15,
        borderRadius: 8,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    botaoDesabilitado: {
        opacity: 0.5,
    },
});
