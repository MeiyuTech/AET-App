import type React from 'react'

import { styles, spacing } from '../../styles/config'

export const fallPalette = {
  background: {
    page: '#fdf6ec',
    container: '#fff8f0',
    hero: 'linear-gradient(180deg, rgba(253,230,138,0.88) 0%, rgba(249,168,37,0.88) 100%)',
    highlight: '#fbe4c9',
  },
  text: {
    primary: '#7c2d12',
    secondary: '#92400e',
    body: '#5f370e',
    light: '#fff9f0',
  },
  accent: '#d97706',
  border: '#fcd34d',
  shadow: '0 18px 35px rgba(124,45,18,0.18)',
}

export const thanksgivingStyles = {
  body: {
    ...styles.body,
    backgroundColor: fallPalette.background.page,
    backgroundImage: 'linear-gradient(135deg, rgba(255, 237, 213, 0.75), rgba(228, 155, 15, 0.2))',
    fontFamily: '"Georgia", "Times New Roman", serif',
    color: fallPalette.text.body,
    padding: `${spacing.xl} 0`,
  },
  container: {
    ...styles.container,
    backgroundColor: fallPalette.background.container,
    border: `1px solid ${fallPalette.border}`,
    boxShadow: fallPalette.shadow,
    padding: spacing.xl,
  },
  content: {
    ...styles.content,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: '18px',
    padding: spacing.xl,
    border: `1px solid ${fallPalette.border}`,
    position: 'relative' as React.CSSProperties['position'],
    overflow: 'hidden',
  },
  heading: {
    h1: {
      ...styles.heading.h1,
      color: fallPalette.text.primary,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.5px',
    },
    h2: {
      ...styles.heading.h2,
      color: fallPalette.text.primary,
      fontFamily: '"Georgia", "Times New Roman", serif',
      letterSpacing: '0.5px',
    },
    h3: {
      ...styles.heading.h3,
      color: fallPalette.text.secondary,
      fontFamily: '"Georgia", "Times New Roman", serif',
    },
  },
  text: {
    default: {
      ...styles.text.default,
      color: fallPalette.text.body,
    },
    highlight: {
      ...styles.text.default,
      color: fallPalette.text.primary,
      fontWeight: 'bold',
    },
    hero: {
      ...styles.text.default,
      color: fallPalette.text.primary,
      marginBottom: 0,
    },
    signature: {
      ...styles.text.default,
      color: fallPalette.text.secondary,
      fontStyle: 'italic',
    },
  },
  hero: {
    background: fallPalette.background.hero,
    borderRadius: '18px',
    padding: spacing.xxl,
    textAlign: 'center' as React.CSSProperties['textAlign'],
    color: fallPalette.text.primary,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
    marginBottom: spacing.xl,
  },
  ribbon: {
    display: 'inline-block',
    backgroundColor: fallPalette.accent,
    color: fallPalette.text.light,
    padding: '6px 20px',
    borderRadius: '9999px',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase' as React.CSSProperties['textTransform'],
    marginBottom: spacing.sm,
  },
  leafDivider: {
    margin: `${spacing.lg} auto`,
    height: '1px',
    width: '90%',
    background:
      'linear-gradient(90deg, rgba(124,45,18,0), rgba(124,45,18,0.45), rgba(124,45,18,0))',
  },
  card: {
    ...styles.section.card,
    backgroundColor: 'rgba(255, 247, 237, 0.95)',
    borderRadius: '18px',
    border: `1px solid ${fallPalette.border}`,
    boxShadow: '0 12px 28px rgba(124,45,18,0.12)',
  },
  highlight: {
    backgroundColor: 'rgba(252, 211, 77, 0.25)',
    borderRadius: '18px',
    border: '1px solid rgba(245, 158, 11, 0.55)',
    padding: spacing.xxl,
  },
  contactCard: {
    backgroundColor: 'rgba(254, 215, 170, 0.3)',
    border: '1px solid rgba(217, 119, 6, 0.35)',
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
  'bg-[#b45309] text-white px-[28px] py-[14px] rounded-[9999px] font-semibold no-underline text-center box-border shadow-[0_6px_18px_rgba(124,45,18,0.25)]'
