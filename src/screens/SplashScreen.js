// SplashScreen.js
// Tela de abertura do aplicativo.
//
// Objetivo desta tela:
// 1. Mostrar a marca do app por alguns segundos.
// 2. Executar uma animacao simples de entrada.
// 3. Enviar o usuario para a tela de Login automaticamente.

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/colors';

export default function SplashScreen({ navigation }) {
    // useRef guarda valores que devem continuar existindo entre renderizacoes.
    // Animated.Value representa um numero que pode mudar ao longo do tempo.
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // useEffect roda depois que a tela aparece.
        // Aqui ele dispara a animacao e agenda a troca de tela.

        // Animated.parallel executa as duas animacoes ao mesmo tempo:
        // - opacity faz o conteudo aparecer aos poucos.
        // - scale faz o conteudo crescer ate o tamanho normal.
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 900,
                // useNativeDriver melhora a performance em animacoes suportadas.
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        // Aguarda um pequeno periodo e troca a Splash pelo Login.
        // replace remove a Splash do historico, evitando voltar para ela.
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2200);

        // Limpa o temporizador caso o componente seja desmontado antes do tempo.
        // Isso evita tentar navegar depois que a tela ja saiu da memoria.
        return () => clearTimeout(timer);
    }, [navigation, opacity, scale]);

    return (
        <View style={styles.container}>
            <Animated.View
                // O array de estilos permite combinar estilos fixos com valores animados.
                style={[
                    styles.content,
                    {
                        opacity,
                        transform: [{ scale }],
                    },
                ]}
            >
                <Text style={styles.logo}>RP</Text>
                <Text style={styles.title}>Reparai</Text>
                <Text style={styles.subtitle}>Identifique, informe e transforme.</Text>
            </Animated.View>
        </View>
    );
}

// StyleSheet.create organiza os estilos da tela.
// Em React Native, os nomes sao parecidos com CSS, mas escritos em camelCase.
const styles = StyleSheet.create({
    container: {
        // flex: 1 faz o container ocupar toda a tela disponivel.
        flex: 1,
        // alignItems centraliza os filhos no eixo horizontal.
        alignItems: 'center',
        // justifyContent centraliza os filhos no eixo vertical.
        justifyContent: 'center',
        // backgroundColor define a cor de fundo da tela inteira.
        backgroundColor: colors.primary,
        // padding cria um espaco interno para o conteudo nao encostar nas bordas.
        padding: 24,
    },
    content: {
        // Centraliza os textos dentro do bloco animado.
        alignItems: 'center',
        // gap cria espaco entre os elementos filhos.
        gap: 12,
    },
    logo: {
        // Texto grande para funcionar como marca visual do app.
        color: colors.surface,
        fontSize: 72,
        fontWeight: '800',
    },
    title: {
        // Titulo principal da Splash.
        color: colors.surface,
        fontSize: 38,
        fontWeight: '800',
    },
    subtitle: {
        // maxWidth limita a largura para o texto quebrar linha de forma agradavel.
        maxWidth: 280,
        color: colors.surface,
        fontSize: 16,
        // lineHeight controla o espaco vertical entre linhas do texto.
        lineHeight: 24,
        textAlign: 'center',
        // opacity deixa o subtitulo um pouco mais suave que o titulo.
        opacity: 0.9,
    },
});
