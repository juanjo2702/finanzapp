import { Injectable } from '@nestjs/common';
import { CategoryClassification } from '@finanzapp/shared-types';

export interface CategorizationResult {
  suggestedCategory: string;
  classification: CategoryClassification;
  confidence: number;
}

@Injectable()
export class AiCategorizerService {
  private readonly keywordMap: Array<{
    keywords: string[];
    category: string;
    classification: CategoryClassification;
  }> = [
    // Supermercado & Alimentación
    {
      keywords: [
        'hipermaxi', 'fidalga', 'ic norte', 'ketal', 'supermercado', 'tienda', 'mercado',
        'tottus', 'walmart', 'carrefour', 'jumbo', 'panaderia', 'fruver', 'minimarket',
      ],
      category: 'Supermercado & Víveres',
      classification: CategoryClassification.NEEDS,
    },
    // Restaurantes & Cafés
    {
      keywords: [
        'typica', 'starbucks', 'cafe', 'cafeteria', 'pollos kingdom', 'pollos copacabana',
        'panchita', 'burger', 'mcdonalds', 'kfc', 'pizza', 'pizzeria', 'chifa', 'restaurante',
        'subway', 'pedidosya', 'rappi', 'didi food', 'ubereats', 'snack', 'heladeria',
      ],
      category: 'Restaurantes & Cafés',
      classification: CategoryClassification.WANTS,
    },
    // Transporte & Combustible
    {
      keywords: [
        'yango', 'uber', 'didi', 'indrive', 'gasolinera', 'surtidor', 'ypfb', 'combustible',
        'gasolina', 'peaje', 'teleferico', 'estacionamiento', 'parqueo', 'linea', 'taxi',
      ],
      category: 'Transporte & Combustible',
      classification: CategoryClassification.NEEDS,
    },
    // Servicios Básicos
    {
      keywords: [
        'elfec', 'delapaz', 'cre', 'semapa', 'saguapac', 'epsas', 'entel', 'tigo', 'viva',
        'cotas', 'comteco', 'luz', 'agua', 'gas domiciliario', 'factura', 'telecomunicaciones',
      ],
      category: 'Servicios (Luz, Agua, Gas, Internet)',
      classification: CategoryClassification.NEEDS,
    },
    // Salud & Farmacia
    {
      keywords: [
        'farmacorp', 'farmacias chavez', 'farmacia', 'clinica', 'hospital', 'doctor',
        'laboratorio', 'medicamentos', 'optica', 'dentista', 'odontologia',
      ],
      category: 'Salud & Medicamentos',
      classification: CategoryClassification.NEEDS,
    },
    // Suscripciones
    {
      keywords: [
        'netflix', 'spotify', 'apple.com', 'google *', 'disney', 'star+', 'hbo', 'max',
        'amazon prime', 'youtube premium', 'chatgpt', 'openai', 'midjourney', 'playstation',
      ],
      category: 'Suscripciones Digitales',
      classification: CategoryClassification.WANTS,
    },
    // Ropa & Compras
    {
      keywords: [
        'zara', 'h&m', 'shein', 'boutique', 'multicenter', 'batt', 'fair play',
        'manaco', 'calzados', 'moda', 'tiendas', 'amazon',
      ],
      category: 'Ropa & Compras Personales',
      classification: CategoryClassification.WANTS,
    },
    // Entretenimiento
    {
      keywords: [
        'cine center', 'cinemark', 'cine', 'entradas', 'concierto', 'discoteca',
        'pub', 'bar', 'bolera', 'karting', 'steam',
      ],
      category: 'Entretenimiento & Salidas',
      classification: CategoryClassification.WANTS,
    },
    // Educación
    {
      keywords: [
        'udemy', 'coursera', 'universidad', 'colegio', 'platzi', 'matricula',
        'upb', 'ucb', 'umss', 'univalle', 'libros', 'libreria',
      ],
      category: 'Educación & Cursos',
      classification: CategoryClassification.NEEDS,
    },
  ];

  categorize(merchantName?: string, notes?: string): CategorizationResult {
    const textToAnalyze = `${merchantName || ''} ${notes || ''}`.toLowerCase().trim();

    if (!textToAnalyze) {
      return {
        suggestedCategory: 'Gastos Varios',
        classification: CategoryClassification.WANTS,
        confidence: 0.2,
      };
    }

    for (const entry of this.keywordMap) {
      for (const keyword of entry.keywords) {
        if (textToAnalyze.includes(keyword)) {
          return {
            suggestedCategory: entry.category,
            classification: entry.classification,
            confidence: 0.92,
          };
        }
      }
    }

    return {
      suggestedCategory: 'Gastos Varios',
      classification: CategoryClassification.NEEDS,
      confidence: 0.3,
    };
  }
}
