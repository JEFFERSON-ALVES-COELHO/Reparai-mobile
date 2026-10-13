
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { initDatabase } from './src/database/database';
import AppNavigation from './src/navigation/navigations';
import { colors } from './src/styles/colors';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      initDatabase();
      setReady(true);
    } catch (err) {
      console.error('Erro ao inicializar o banco:', err);
      setError('Não foi possível inicializar o banco de dados.');
    }
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.text}>Carregando Reparai...</Text>
      </View>
    );
  }

  return <AppNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: {
    color: colors.text,
    marginTop: 12,
  },
  error: {
    color: colors.error,
    textAlign: 'center',
  },
});
