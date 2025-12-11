import type React from 'react'

import { styles, spacing } from '../../styles/config'

export const holidayPalette = {
  background: {
    page: '#f4f8fb',
    container: '#ffffff',
    hero: 'linear-gradient(180deg, rgba(22,101,52,0.95) 0%, rgba(185,28,28,0.9) 100%)',
    highlight: '#eef6f1',
  },
  text: {
    primary: '#0f5132',
    secondary: '#b42318',
    body: '#0f172a',
    light: '#ffffff',
  },
  accent: '#c53030',
  border: '#cde4d7',
  shadow: '0 18px 35px rgba(12,83,53,0.16)',
}

export const christmasStyles = {
  body: {
    ...styles.body,
    backgroundColor: holidayPalette.background.page,
    backgroundImage: 'linear-gradient(135deg, rgba(221,243,228,0.8), rgba(239,246,255,0.65))',
    fontFamily: '"Georgia", "Times New Roman", serif',
    color: holidayPalette.text.body,
    padding: `${spacing.xl} 0`,
  },
  container: {
    ...styles.container,
    backgroundColor: holidayPalette.background.container,
    border: `1px solid ${holidayPalette.border}`,
    boxShadow: holidayPalette.shadow,
    padding: spacing.xl,
  },
  content: {
    ...styles.content,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: '18px',
    padding: spacing.xl,
    border: `1px solid ${holidayPalette.border}`,
    position: 'relative' as React.CSSProperties['position'],
    overflow: 'hidden',
  },
  heading: {
    h1: {
      ...styles.heading.h1,
      color: holidayPalette.text.light,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.5px',
    },
    h2: {
      ...styles.heading.h2,
      color: holidayPalette.text.primary,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.25px',
    },
    h3: {
      ...styles.heading.h3,
      color: holidayPalette.text.secondary,
      fontFamily: '"Georgia", "Times New Roman", serif',
    },
  },
  text: {
    default: {
      ...styles.text.default,
      color: holidayPalette.text.body,
    },
    highlight: {
      ...styles.text.default,
      color: holidayPalette.text.primary,
      fontWeight: 'bold',
    },
    hero: {
      ...styles.text.default,
      color: holidayPalette.text.light,
      marginBottom: spacing.sm,
    },
    signature: {
      ...styles.text.default,
      color: holidayPalette.text.secondary,
      fontStyle: 'italic',
    },
  },
  hero: {
    background: holidayPalette.background.hero,
    borderRadius: '18px',
    padding: spacing.xxl,
    textAlign: 'center' as React.CSSProperties['textAlign'],
    color: holidayPalette.text.light,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.35)',
    marginBottom: spacing.xl,
  },
  ribbon: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.16)',
    color: holidayPalette.text.light,
    padding: '8px 20px',
    borderRadius: '9999px',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as React.CSSProperties['textTransform'],
    border: '1px solid rgba(255,255,255,0.5)',
    marginBottom: spacing.sm,
  },
  ornamentDivider: {
    margin: `${spacing.lg} auto`,
    height: '1px',
    width: '90%',
    background:
      'linear-gradient(90deg, rgba(12,83,53,0), rgba(12,83,53,0.45), rgba(185,28,28,0.4), rgba(12,83,53,0))',
  },
  card: {
    ...styles.section.card,
    backgroundColor: 'rgba(238, 246, 241, 0.9)',
    borderRadius: '18px',
    border: `1px solid ${holidayPalette.border}`,
    boxShadow: '0 12px 28px rgba(12,83,53,0.12)',
  },
  highlight: {
    backgroundColor: 'rgba(197, 48, 48, 0.08)',
    borderRadius: '18px',
    border: '1px solid rgba(197, 48, 48, 0.4)',
    padding: spacing.xxl,
  },
  contactCard: {
    backgroundColor: 'rgba(13,148,82,0.07)',
    border: '1px solid rgba(12,83,53,0.25)',
    borderRadius: '18px',
    padding: spacing.xxl,
    textAlign: 'center' as React.CSSProperties['textAlign'],
  },
  ctaButtonWrapper: {
    textAlign: 'center' as React.CSSProperties['textAlign'],
    margin: `${spacing.lg} 0`,
  },
}

export const ctaButtonClassName =
  'bg-[#b91c1c] text-white px-[28px] py-[14px] rounded-[9999px] font-semibold no-underline text-center box-border shadow-[0_6px_18px_rgba(185,28,28,0.25)]'
