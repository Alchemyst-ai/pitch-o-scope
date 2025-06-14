# AlchemystAI Design System: Dark Gradient Theme

## Overview

This design theme implements a modern, dark-themed color palette with vibrant gradient accents, focusing on readability, elegance, and visual depth. The theme is built using Tailwind CSS and React components.

## Theme Components

### Core Components

- `Container`: Main container with background gradient
- `Card`: Glass-morphic card component
- `Button`: Multi-variant button component
- `GradientText`: Text with gradient effect

### Theme Utilities

- `theme`: Object containing all theme constants
- `combineClasses`: Helper function to combine class names

## Usage

### Basic Usage

```tsx
import { Container, Card, Button, GradientText } from '../app/components/ui';
import { theme } from '../app/utils/theme';

export default function MyPage() {
  return (
    <Container>
      <div className="container mx-auto p-8">
        <GradientText as="h1" className="text-4xl">Welcome to AlchemystAI</GradientText>
        
        <Card className="mt-6">
          <h2 className={theme.headingText}>Card Title</h2>
          <p className={theme.bodyText}>Card content goes here...</p>
          
          <Button className="mt-4">Click Me</Button>
        </Card>
      </div>
    </Container>
  );
}
```

### Button Variants

```tsx
<Button>Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>
```

### Gradient Text

```tsx
<GradientText as="h1">Heading 1</GradientText>
<GradientText as="h2">Heading 2</GradientText>
<GradientText as="span">Inline Text</GradientText>
```

## Theme Constants

### Background Gradient

```tsx
theme.backgroundGradient // 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950'
```

### Gradient Accents

```tsx
theme.titleGradient // 'bg-gradient-to-br from-[#ffee00] to-[#f04848] text-transparent bg-clip-text'
theme.buttonGradient // 'bg-gradient-to-br from-[#dbb13d] to-[#f04848]'
```

### Glassmorphism

```tsx
theme.glassCard // 'bg-gray-900/30 backdrop-blur-xl'
theme.glassInput // 'bg-gray-800/40 backdrop-blur-xl'
theme.glassBorder // 'border border-white/20'
```

## Demo

Visit `/theme-demo` to see all theme components in action. 