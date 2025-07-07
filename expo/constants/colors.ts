export const Colors = {
    // Primary colors
    primary: '#007AFF',     // iOS blue
    primaryLight: '#4A9EFF',
    primaryDark: '#0056CC',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',

    // Gray scale
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Semantic colors
    background: '#FFFFFF',
    backgroundSecondary: '#162944',
    surface: '#F9FAFB',
    card: "#207189",
    text: '#FFFFFF',
    textSecondary: '#e5e9f3',
    textPlaceholder: '#c5ccd5',
    textTertiary: '#30aa56',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    buttonBackground: '#2d9f60',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Interactive states
    highlight: '#007AFF',
    pressed: '#0056CC',
    active: '#007AFF',
    disabled: '#D1D5DB',
    placeholder: '#9CA3AF',

    // Shadow
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowDark: 'rgba(0, 0, 0, 0.25)',
} as const;

export type ColorKey = keyof typeof Colors; 