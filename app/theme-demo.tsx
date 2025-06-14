'use client';

import React from 'react';
import { Container, Card, Button, GradientText } from './components/ui';
import { theme, combineClasses } from './utils/theme';
import { ArrowRight, Check, X, AlertCircle, Info } from 'lucide-react';

export default function ThemeDemo() {
  return (
    <Container>
      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <GradientText as="h1" className="text-5xl mb-4">AlchemystAI Design System</GradientText>
          <p className={theme.bodyText + " text-xl max-w-2xl mx-auto"}>
            Dark Gradient Theme Showcase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <div className={combineClasses(
              theme.buttonGradient,
              'py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4'
            )}>
              <h3 className="text-white font-semibold">Typography</h3>
            </div>
            
            <div className="space-y-4">
              <GradientText as="h1" className="text-4xl">Heading 1</GradientText>
              <GradientText as="h2" className="text-3xl">Heading 2</GradientText>
              <GradientText as="h3" className="text-2xl">Heading 3</GradientText>
              <GradientText as="h4" className="text-xl">Heading 4</GradientText>
              
              <div className="h-px bg-gradient-to-r from-orange-400 to-orange-600 my-6"></div>
              
              <p className={theme.headingText}>Regular text in white</p>
              <p className={theme.bodyText}>Body text in gray</p>
              <p className={theme.accentText}>Accent text in orange</p>
            </div>
          </Card>

          <Card>
            <div className={combineClasses(
              theme.buttonGradient,
              'py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4'
            )}>
              <h3 className="text-white font-semibold">Buttons</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white mb-2">Primary Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-white mb-2">Secondary Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary">Default</Button>
                  <Button variant="secondary" size="sm">Small</Button>
                  <Button variant="secondary" size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-white mb-2">Outline Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">Default</Button>
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline" size="lg">Large</Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-white mb-2">With Icon</h4>
                <Button className="flex items-center gap-2">
                  Continue <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-12">
          <div className={combineClasses(
            theme.buttonGradient,
            'py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4'
          )}>
            <h3 className="text-white font-semibold">Cards & Containers</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={combineClasses(theme.glassCard, theme.glassBorder, 'p-4 rounded-lg')}>
              <h4 className="text-white font-medium mb-2">Glass Card</h4>
              <p className="text-gray-400 text-sm">With backdrop blur effect</p>
            </div>
            
            <div className={combineClasses(theme.overlayGradient, theme.glassBorder, 'p-4 rounded-lg')}>
              <h4 className="text-white font-medium mb-2">Overlay Card</h4>
              <p className="text-gray-400 text-sm">With gradient overlay</p>
            </div>
            
            <div className={combineClasses('bg-gradient-to-br from-gray-800/50 to-gray-900/50', theme.glassBorder, 'p-4 rounded-lg')}>
              <h4 className="text-white font-medium mb-2">Custom Card</h4>
              <p className="text-gray-400 text-sm">With custom gradient</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className={combineClasses(
            theme.buttonGradient,
            'py-3 px-4 rounded-t-xl -mt-6 -mx-6 mb-4'
          )}>
            <h3 className="text-white font-semibold">Status Elements</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check className="text-green-500" size={20} />
              <span className="text-green-500">Success message</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <X className="text-red-500" size={20} />
              <span className="text-red-500">Error message</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="text-yellow-500" size={20} />
              <span className="text-yellow-500">Warning message</span>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="text-blue-500" size={20} />
              <span className="text-blue-500">Info message</span>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
} 