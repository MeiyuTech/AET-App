/**
 * Email Template Shared Styles Configuration
 * All email components should use the styles in this file to maintain consistency
 */

export const colors = {
  primary: '#3b82f6',
  text: {
    default: '#333333',
    secondary: '#4b5563',
    muted: '#718096',
  },
  background: {
    page: '#f9fafb',
    card: '#ffffff',
    section: '#f3f4f6',
    highlight: '#e5e7eb',
  },
  border: '#e2e8f0',
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  indent: '16px',
}

export const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '15px',
  lg: '16px',
  xl: '18px',
  xxl: '24px',
  xxxl: '32px',
}

export const fontWeights = {
  normal: 'normal',
  medium: '500',
  bold: 'bold',
}

export const borderRadius = {
  sm: '4px',
  md: '8px',
}

export const shadows = {
  card: '0 2px 4px rgba(0,0,0,0.05)',
}

// Shared Styles Object
export const styles = {
  // Page Container
  body: {
    backgroundColor: colors.background.page,
    fontFamily: 'sans-serif',
    padding: `${spacing.xxxl} 0`,
    color: colors.text.default,
    lineHeight: '1.6',
    margin: 0,
  },

  // Main Container
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    margin: '0 auto',
    padding: spacing.xl,
    maxWidth: '600px',
    boxShadow: shadows.card,
  },

  // Content Area
  content: {
    padding: spacing.sm,
  },

  // Heading
  heading: {
    h1: {
      fontSize: fontSizes.xxxl,
      fontWeight: fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.text.default,
    },
    h2: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.text.default,
    },
    h3: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      marginBottom: spacing.md,
      color: colors.text.default,
    },
  },

  // Paragraph Text
  text: {
    default: {
      fontSize: fontSizes.lg,
      marginBottom: spacing.lg,
      color: colors.text.secondary,
    },
    small: {
      fontSize: fontSizes.xs,
      marginBottom: spacing.lg,
      color: colors.text.muted,
    },
    link: {
      fontSize: fontSizes.sm,
      marginBottom: spacing.lg,
      color: colors.primary,
    },
    monospace: {
      fontFamily: 'monospace',
      backgroundColor: colors.background.highlight,
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.sm,
      color: colors.primary,
    },
    note: {
      fontSize: fontSizes.sm,
      marginBottom: spacing.lg,
      marginLeft: spacing.indent,
      color: colors.text.secondary,
    },
  },

  // Content Block
  section: {
    default: {
      marginBottom: spacing.md,
    },
    card: {
      backgroundColor: colors.background.section,
      padding: spacing.lg,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.xl,
    },
  },

  // Service Card Styles
  serviceCard: {
    section: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      margin: `0 0 ${spacing.xs} 0`,
      color: colors.text.default,
    },
    content: {
      fontSize: fontSizes.sm,
      margin: `0 0 ${spacing.xs} ${spacing.indent}`,
      color: colors.text.secondary,
    },
    indentedContent: {
      paddingLeft: spacing.md,
    },
    divider: {
      borderTop: `1px solid ${colors.border}`,
      margin: `${spacing.lg} 0`,
    },
    totalPrice: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      margin: `${spacing.sm} 0`,
      color: colors.text.default,
    },
    disclaimer: {
      fontSize: fontSizes.xs,
      color: colors.text.muted,
      margin: `${spacing.xs} 0 0 0`,
    },
  },

  // Button
  button: {
    center: {
      textAlign: 'center',
      margin: `${spacing.xl} 0`,
    },
  },
}
