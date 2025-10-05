import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageGenerationService {
  private readonly imagesDir = path.join(process.cwd(), '..', 'UI', 'public', 'associationImages');
  private readonly halloweenColors = {
    background: '#1a1a2e',
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#ffd23f',
    text: '#ffffff',
    shadow: '#000000'
  };

  constructor() {
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist() {
    const dirs = ['hero', 'action', 'object'];
    dirs.forEach(dir => {
      const fullPath = path.join(this.imagesDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async generateAssociationImage(
    associationId: number,
    type: 'hero' | 'action' | 'object',
    text: string
  ): Promise<string> {
    const fileName = `${associationId}_${type}.svg`;
    const filePath = path.join(this.imagesDir, type, fileName);

    // Check if image already exists
    if (fs.existsSync(filePath)) {
      return `/associationImages/${type}/${fileName}`;
    }

    try {
      const imageBuffer = await this.createHalloweenImage(text, type);
      await fs.promises.writeFile(filePath, imageBuffer);
      
      return `/associationImages/${type}/${fileName}`;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  }

  private async createHalloweenImage(text: string, type: 'hero' | 'action' | 'object'): Promise<Buffer> {
    const width = 200;
    const height = 200;
    const padding = 20;

    // Create SVG content
    const svgContent = this.createHalloweenSVG(text, type, width, height, padding);
    
    // For now, just return the SVG as a buffer
    // In production, you would convert SVG to PNG using sharp or another library
    return Buffer.from(svgContent);
  }

  private createHalloweenSVG(
    text: string, 
    type: 'hero' | 'action' | 'object', 
    width: number, 
    height: number, 
    padding: number
  ): string {
    const colors = this.halloweenColors;
    const icon = this.getHalloweenIcon(type);
    
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)" rx="15"/>
        
        <!-- Border -->
        <rect x="2" y="2" width="${width-4}" height="${height-4}" 
              fill="none" stroke="${colors.primary}" stroke-width="2" rx="13"/>
        
        <!-- Icon -->
        <text x="50%" y="35%" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="48" 
              fill="url(#iconGradient)" filter="url(#glow)">
          ${icon}
        </text>
        
        <!-- Text -->
        <text x="50%" y="75%" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="12" font-weight="bold"
              fill="${colors.text}" filter="url(#glow)">
          ${this.wrapText(text, 15)}
        </text>
        
        <!-- Halloween decorations -->
        <circle cx="20" cy="20" r="3" fill="${colors.accent}" opacity="0.7"/>
        <circle cx="${width-20}" cy="20" r="2" fill="${colors.accent}" opacity="0.7"/>
        <circle cx="20" cy="${height-20}" r="2" fill="${colors.accent}" opacity="0.7"/>
        <circle cx="${width-20}" cy="${height-20}" r="3" fill="${colors.accent}" opacity="0.7"/>
      </svg>
    `;
  }

  private getHalloweenIcon(type: 'hero' | 'action' | 'object'): string {
    const icons = {
      hero: '🧙‍♂️',
      action: '⚡',
      object: '🎃'
    };
    return icons[type];
  }

  private wrapText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const words = text.split(' ');
    let result = '';
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          result += (result ? '\n' : '') + currentLine;
          currentLine = word;
        } else {
          result += (result ? '\n' : '') + word;
        }
      }
    }
    
    if (currentLine) {
      result += (result ? '\n' : '') + currentLine;
    }
    
    return result;
  }

  async generateAllAssociationImages(associations: Array<{number: number, hero: string, action: string, object: string}>): Promise<string[]> {
    const promises: Promise<string>[] = [];
    
    for (const assoc of associations) {
      // Generate hero image
      promises.push(this.generateAssociationImage(assoc.number, 'hero', assoc.hero));
      // Generate action image
      promises.push(this.generateAssociationImage(assoc.number, 'action', assoc.action));
      // Generate object image
      promises.push(this.generateAssociationImage(assoc.number, 'object', assoc.object));
    }
    
    return await Promise.all(promises);
  }

  getImagePath(associationId: number, type: 'hero' | 'action' | 'object'): string | null {
    console.log('getImagePath', associationId, type);
    const fileName = `${associationId}_${type}.svg`;
    const filePath = path.join(this.imagesDir, type, fileName);
    
    if (fs.existsSync(filePath)) {
      return `/associationImages/${type}/${fileName}`;
    }
    
    return null;
  }
}
