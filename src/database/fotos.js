
import * as FileSystem from 'expo-file-system/legacy';

const pastaFotos = `${FileSystem.documentDirectory}fotos/`;

export async function salvarFoto(uri, ocorrenciaId) {
    if (!uri || !ocorrenciaId) {
        throw new Error('Foto ou ID da ocorrência inválido.');
    }

    await FileSystem.makeDirectoryAsync(pastaFotos, {
        intermediates: true,
    });

    const destino = `${pastaFotos}${ocorrenciaId}.jpg`;

    await FileSystem.copyAsync({
        from: uri,
        to: destino,
    });

    return destino;
}

export async function obterFoto(ocorrenciaId) {
    if (!ocorrenciaId) {
        return null;
    }

    const caminho = `${pastaFotos}${ocorrenciaId}.jpg`;

    const informacoes = await FileSystem.getInfoAsync(caminho);

    return informacoes.exists ? caminho : null;
}

export async function excluirFoto(ocorrenciaId) {
    if (!ocorrenciaId) {
        return;
    }

    const caminho = `${pastaFotos}${ocorrenciaId}.jpg`;

    await FileSystem.deleteAsync(caminho, {
        idempotent: true,
    });
}
