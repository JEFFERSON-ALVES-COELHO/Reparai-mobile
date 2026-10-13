
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import { colors } from '../styles/colors';

export default function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                (disabled || loading) && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.surface} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 52,
        backgroundColor: colors.primary,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    text: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.6,
    },
});
