
import { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';

import { atualizarStatus } from '../database/database';

export default function ReportDetailScreen({ navigation, route }) {
    const ocorrencia = route.params?.ocorrencia;

    const [statusAtual, setStatusAtual] = useState(
        ocorrencia?.status || 'Enviada'
    );

    function alterarStatus(novoStatus) {
        if (!ocorrencia?.id) {
            Alert.alert(
                'Erro',
                'Não foi possível identificar a ocorrência.'
            );
            return;
        }

        if (novoStatus === statusAtual) {
            return;
        }

        try {
            const alterados = atualizarStatus(
                ocorrencia.id,
                novoStatus
            );

            if (alterados > 0) {
                setStatusAtual(novoStatus);

                Alert.alert(
                    'Sucesso',
                    `Status atualizado para "${novoStatus}".`
                );
            } else {
                Alert.alert(
                    'Aviso',
                    'Nenhuma ocorrência foi atualizada. Verifique o registro no banco de dados.'
                );
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);

            Alert.alert(
                'Erro',
                'Não foi possível salvar o novo status.'
            );
        }
    }

    if (!ocorrencia) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Ocorrência não encontrada
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const dataFormatada = ocorrencia.data
        ? new Date(ocorrencia.data).toLocaleString('pt-BR')
        : 'Data não informada';

    const statusDisponiveis = [
        'Enviada',
        'Em análise',
        'Em execução',
        'Resolvida',
    ];

    function obterCorStatus(status) {
        switch (status) {
            case 'Resolvida':
                return {
                    fundo: '#E8F5E9',
                    texto: '#2E7D32',
                };

            case 'Em execução':
                return {
                    fundo: '#FFF3E0',
                    texto: '#E65100',
                };

            case 'Em análise':
                return {
                    fundo: '#FFF8E1',
                    texto: '#8D6E00',
                };

            default:
                return {
                    fundo: '#E3F2FD',
                    texto: '#1565C0',
                };
        }
    }

    const coresStatus = obterCorStatus(statusAtual);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>
                        ‹ Voltar
                    </Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Detalhes da ocorrência
                </Text>

                <Text style={styles.subtitle}>
                    Acompanhe as informações do registro
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>
                    Título
                </Text>

                <Text style={styles.reportTitle}>
                    {ocorrencia.titulo || 'Sem título'}
                </Text>

                <Text style={styles.label}>
                    Categoria
                </Text>

                <Text style={styles.value}>
                    {ocorrencia.categoria || 'Não informada'}
                </Text>

                <Text style={styles.label}>
                    Descrição do problema
                </Text>

                <Text style={styles.value}>
                    {ocorrencia.descricao || 'Sem descrição'}
                </Text>

                <Text style={styles.label}>
                    Endereço
                </Text>

                <Text style={styles.value}>
                    📍 {ocorrencia.endereco || 'Não informado'}
                </Text>

                <Text style={styles.label}>
                    Data do registro
                </Text>

                <Text style={styles.value}>
                    {dataFormatada}
                </Text>

                <Text style={styles.label}>
                    Status atual
                </Text>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: coresStatus.fundo },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: coresStatus.texto },
                        ]}
                    >
                        {statusAtual}
                    </Text>
                </View>

                <Text style={styles.notice}>
                    O status exibido corresponde ao último estado
                    salvo para esta ocorrência.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>
                    Atualizar status
                </Text>

                <Text style={styles.instruction}>
                    Selecione um status para atualizar o registro.
                </Text>

                {statusDisponiveis.map((status) => {
                    const selecionado = status === statusAtual;

                    return (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.statusOption,
                                selecionado && styles.statusOptionSelected,
                            ]}
                            onPress={() => alterarStatus(status)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.statusOptionText,
                                    selecionado &&
                                    styles.statusOptionTextSelected,
                                ]}
                            >
                                {selecionado ? '✓  ' : '○  '}
                                {status}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>
                    Voltar para minhas ocorrências
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    content: {
        paddingBottom: 60,
        flexGrow: 1,
    },

    header: {
        backgroundColor: '#1976D2',
        paddingHorizontal: 22,
        paddingTop: 45,
        paddingBottom: 28,
    },

    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        marginBottom: 12,
    },

    backText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    headerTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#E3F2FD',
        fontSize: 14,
        marginTop: 8,
    },

    card: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        elevation: 3,
    },

    label: {
        color: '#777777',
        fontSize: 13,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 7,
    },

    reportTitle: {
        color: '#222222',
        fontSize: 22,
        fontWeight: 'bold',
    },

    value: {
        color: '#333333',
        fontSize: 16,
        lineHeight: 24,
    },

    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    notice: {
        color: '#777777',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 18,
    },

    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginTop: 24,
    },

    sectionTitle: {
        color: '#222222',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 22,
    },

    instruction: {
        color: '#777777',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 12,
    },

    statusOption: {
        backgroundColor: '#F5F7FA',
        borderWidth: 1,
        borderColor: '#E0E4E8',
        borderRadius: 10,
        padding: 14,
        marginTop: 9,
    },

    statusOptionSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#1976D2',
    },

    statusOptionText: {
        color: '#444444',
        fontSize: 15,
        fontWeight: '500',
    },

    statusOptionTextSelected: {
        color: '#1565C0',
        fontWeight: 'bold',
    },

    button: {
        backgroundColor: '#1976D2',
        marginHorizontal: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    title: {
        color: '#222222',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20,
    },
});
