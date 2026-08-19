import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react-native';
import { router } from 'expo-router';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    router.replace('/');
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <AlertCircle color="#EF4444" size={64} style={styles.icon} />
            <ThemedText variant="h1" style={styles.title}>Oops! Something went wrong.</ThemedText>
            <ThemedText variant="body" style={styles.message}>
              An unexpected error occurred. Don't worry, your progress is safe.
            </ThemedText>

            {this.state.error && (
              <View style={styles.errorBox}>
                <ThemedText variant="caption" style={styles.errorText}>
                  {this.state.error.message}
                </ThemedText>
              </View>
            )}

            <View style={styles.buttonRow}>
              <Button
                title="Try Again"
                onPress={this.handleReset}
                variant="outline"
                style={styles.button}
              >
                <RefreshCcw size={18} color="#6C63FF" style={{ marginRight: 8 }} />
              </Button>
              <Button
                title="Go Home"
                onPress={this.handleGoHome}
                style={styles.button}
              >
                <Home size={18} color="#FFF" style={{ marginRight: 8 }} />
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    marginBottom: Spacing.four,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.four,
  },
  errorBox: {
    padding: Spacing.three,
    borderRadius: 8,
    backgroundColor: '#151B2E',
    width: '100%',
    marginBottom: Spacing.four,
  },
  errorText: {
    fontFamily: 'monospace',
    color: '#EF4444',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
    minWidth: 120,
  },
});
