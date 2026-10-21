
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
    Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { salvarOcorrencia } from '../database/database';
import {
    salvarFoto,
    excluirFoto,
} from '../database/fotos';

const categorias = [
    'Buraco na via',
    'Iluminação pública',
    'Lixo irregular',
    'Sinalização',
    'Calçada',
    'Outros',
];

export default function NewReportScreen({ navigation, route }) {
    const [categoria, setCategoria] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [endereco, setEndereco] = useState('');
    const [foto, setFoto] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Recupera o usuário que está conectado.
    const usuario = route?.params?.user;
    const usuarioId = usuario?.id;

    async function tirarFoto() {
        try {
            const permissao =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permissao.granted) {
                Alert.alert(
                    'Permissão necessária',
                    'Autorize o acesso à câmera para tirar uma foto.'
                );
                return;
            }

            const resultado = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.7,
            });

            if (
                !resultado.canceled &&
                resultado.assets?.length > 0
            ) {
                setFoto(resultado.assets[0].uri);
            }
        } catch (erro) {
            console.error('Erro ao abrir câmera:', erro);

            Alert.alert(
                'Erro',
                'Não foi possível abrir a câmera. Tente novamente.'
            );
        }
    }

    async function escolherFoto() {
        try {
            const resultado =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    quality: 0.7,
                });

            if (
                !resultado.canceled &&
                resultado.assets?.length > 0
            ) {
                setFoto(resultado.assets[0].uri);
            }
        } catch (erro) {
            console.error('Erro ao escolher foto:', erro);

            Alert.alert(
                'Erro',
                'Não foi possível abrir a galeria. Tente novamente.'
            );
        }
    }

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

        if (
            usuarioId === undefined ||
            usuarioId === null ||
            !Number.isInteger(Number(usuarioId)) ||
            Number(usuarioId) <= 0
        ) {
            Alert.alert(
                'Sessão não identificada',
                'Não foi possível identificar o usuário. Volte para a tela de login e entre novamente.'
            );
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
            user_id: Number(usuarioId),
        };

        setSalvando(true);

        let fotoSalva = false;

        try {
            // 1. Salva a foto, caso tenha sido selecionada.
            if (foto) {
                await salvarFoto(foto, novaOcorrencia.id);
                fotoSalva = true;
            }

            // 2. Salva a ocorrência vinculada ao usuário.
            salvarOcorrencia(novaOcorrencia);

            Alert.alert(
                'Ocorrência registrada!',
                foto
                    ? 'Ocorrência e foto salvas com sucesso.'
                    : 'Sua ocorrência foi salva com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Home', {
                                user: usuario,
                                novaOcorrencia,
                            });
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (erro) {
            console.error(
                'Erro ao salvar ocorrência:',
                erro
            );

            // Se a ocorrência falhar, tenta remover a foto
            // que já havia sido salva.
            if (fotoSalva) {
                try {
                    await excluirFoto(novaOcorrencia.id);
                } catch (erroFoto) {
                    console.error(
                        'Erro ao excluir foto:',
                        erroFoto
                    );
                }
            }

            Alert.alert(
                'Erro ao registrar',
                erro?.message ||
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
                    disabled={salvando}
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

                <Text style={styles.label}>
                    Foto do problema
                </Text>

                <View style={styles.photoButtons}>
                    <TouchableOpacity
                        style={styles.photoButton}
                        onPress={tirarFoto}
                        disabled={salvando}
                    >
                        <Text style={styles.photoButtonText}>
                            📷 Tirar foto
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.photoButton}
                        onPress={escolherFoto}
                        disabled={salvando}
                    >
                        <Text style={styles.photoButtonText}>
                            🖼️ Galeria
                        </Text>
                    </TouchableOpacity>
                </View>

                {foto && (
                    <View style={styles.photoPreviewContainer}>
                        <Image
                            source={{ uri: foto }}
                            style={styles.photoPreview}
                            resizeMode="cover"
                        />

                        <TouchableOpacity
                            style={styles.removePhotoButton}
                            onPress={() => setFoto(null)}
                            disabled={salvando}
                        >
                            <Text style={styles.removePhotoText}>
                                Remover foto
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

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

                <Text style={styles.photoNote}>
                    A foto é opcional e será salva no dispositivo
                    junto com a identificação da ocorrência.
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
    photoButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    photoButton: {
        flex: 1,
        backgroundColor: '#E3F2FD',
        borderWidth: 1,
        borderColor: '#90CAF9',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
    },
    photoButtonText: {
        color: '#1565C0',
        fontSize: 14,
        fontWeight: '600',
    },
    photoPreviewContainer: {
        marginTop: 14,
        alignItems: 'center',
    },
    photoPreview: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        backgroundColor: '#EEEEEE',
    },
    removePhotoButton: {
        padding: 10,
    },
    removePhotoText: {
        color: '#D32F2F',
        fontWeight: '600',
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
    photoNote: {
        color: '#777777',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
});
