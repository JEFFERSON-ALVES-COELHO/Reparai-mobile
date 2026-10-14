
import { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { salvarOcorrencia } from '../database/database';

const categorias = [
    'Buraco na via',
    'Iluminação pública',
    'Lixo irregular',
    'Sinalização',
    'Calçada',
    'Outros',
];

export default function NewReportScreen({ navigation }) {
    const [categoria, setCategoria] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [endereco, setEndereco] = useState('');
    const [salvando, setSalvando] = useState(false);

    async function registrarOcorrencia() {
        if (
            !categoria ||
            !titulo.trim() ||
            !descricao.trim() ||
            !endereco.trim()
        ) {
            Alert.alert(
                'Campos obrigatórios',
                'Preencha todos os campos antes de continuar.'
            );
            return;
        }

        if (salvando) {
            return;
        }

        const novaOcorrencia = {
            id: Date.now().toString(),
            categoria,
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            endereco: endereco.trim(),
            status: 'Enviada',
            data: new Date().toISOString(),
        };

        try {
            setSalvando(true);

            // Salva a ocorrência no banco SQLite.
            salvarOcorrencia(novaOcorrencia);

            // Só volta para a Home depois de salvar.
            navigation.navigate('Home', {
                novaOcorrencia,
            });
        } catch (erro) {
            console.error(
                'Erro ao salvar ocorrência:',
                erro
            );

            Alert.alert(
                'Erro ao registrar',
                'Não foi possível salvar a ocorrência. Tente novamente.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        ‹ Voltar
                    </Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    Nova ocorrência
                </Text>

                <Text style={styles.subtitle}>
                    Ajude a melhorar sua cidade
                </Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.sectionTitle}>
                    Detalhes do problema
                </Text>

                <Text style={styles.label}>
                    Categoria *
                </Text>

                <View style={styles.categories}>
                    {categorias.map((item) => (
                        <TouchableOpacity
                            key={item}
                            disabled={salvando}
                            style={[
                                styles.categoryButton,
                                categoria === item &&
                                styles.categorySelected,
                            ]}
                            onPress={() => setCategoria(item)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    categoria === item &&
                                    styles.categoryTextSelected,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>
                    Título *
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex.: Buraco na rua"
                    value={titulo}
                    onChangeText={setTitulo}
                    maxLength={100}
                    editable={!salvando}
                />

                <Text style={styles.label}>
                    Descrição *
                </Text>

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Descreva o problema identificado..."
                    value={descricao}
                    onChangeText={setDescricao}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    maxLength={1000}
                    editable={!salvando}
                />

                <Text style={styles.label}>
                    Endereço do problema *
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Rua, número, bairro e cidade"
                    value={endereco}
                    onChangeText={setEndereco}
                    maxLength={200}
                    editable={!salvando}
                />

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        salvando && styles.submitButtonDisabled,
                    ]}
                    onPress={registrarOcorrencia}
                    disabled={salvando}
                >
                    {salvando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitText}>
                            Registrar ocorrência
                        </Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.note}>
                    * Preencha todos os campos obrigatórios.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    content: {
        flexGrow: 1,
        paddingBottom: 30,
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

    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#E3F2FD',
        fontSize: 15,
        marginTop: 6,
    },

    form: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 18,
        borderRadius: 16,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 20,
    },

    label: {
        color: '#333333',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 9,
        marginTop: 16,
    },

    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    categoryButton: {
        borderWidth: 1,
        borderColor: '#D5DCE5',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },

    categorySelected: {
        backgroundColor: '#1976D2',
        borderColor: '#1976D2',
    },

    categoryText: {
        color: '#444444',
        fontSize: 13,
    },

    categoryTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D5DCE5',
        borderRadius: 10,
        padding: 13,
        fontSize: 15,
        color: '#222222',
    },

    textArea: {
        minHeight: 120,
    },

    submitButton: {
        backgroundColor: '#1976D2',
        padding: 17,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 28,
    },

    submitButtonDisabled: {
        opacity: 0.7,
    },

    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    note: {
        color: '#777777',
        fontSize: 12,
        marginTop: 12,
        textAlign: 'center',
    },
});