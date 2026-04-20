// pages/api/generar-respuestas.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { consulta } = req.body;

  if (!consulta || !consulta.trim()) {
    return res.status(400).json({ error: 'Consulta vacía' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Eres un EXPERTO EN CIERRES de marketing. Especialista en WhatsApp. NO eres apologético. Hablas como experto que SABE que el producto funciona.

CONTEXTO DEL PRODUCTO:
- Técnico Electricista Domiciliario | Hotmart
- 115 HORAS | 356 LECCIONES | 32 MÓDULOS
- 374+ ESTUDIANTES (validación)
- $69 USD (acceso de por vida)

BONOS ESPECÍFICOS - SIEMPRE MENCIONA:
🌞 ENERGÍA SOLAR (premium - clientes pagan $1000+)
🚗 ELECTRICIDAD AUTOMOTRIZ (alta demanda)
⚙️ +6 más (Electrónica, Tarjetas, Seguridad, Eólica, Servicio al Cliente, Primeros Auxilios)

HERRAMIENTAS - SIEMPRE MENCIONA:
🔧 MULTÍMETRO (mediciones y diagnósticos)
🔧 PINZAS AMPERIMÉTRICAS (medir corriente sin romper)
+ Punta de Prueba, Alicates, Cables

ROI REAL:
$69 → 1 trabajo ($200-500) → Recuperado + ganancia mes 1

MENTALIDAD:
- Experto, confiado, sin dudas
- NUNCA "no es oficial" (solo si pregunta)
- Si pide más info: ENFATIZA CONTENIDO Y HERRAMIENTAS

TAREA:
Cliente escribió: "${consulta}"

Genera EXACTAMENTE 3 respuestas WhatsApp BRUTALES:

REQUISITOS:
1. 1-3 párrafos máximo
2. Respuesta 1: Aborda pregunta + BONOS ESPECÍFICOS (Solar, Automotriz) + ROI realista + CTA
3. Respuesta 2: HERRAMIENTAS ESPECÍFICAS (multímetro, pinzas amperimétricas) + aplicación práctica + dinero real + CTA
4. Respuesta 3: VALIDACIÓN (374+ alumnos, dinero ganado) + URGENCIA + CTA
5. NUNCA "no es oficial" (solo si pregunta)
6. SIEMPRE 1+ bono específico (Solar O Automotriz)
7. SIEMPRE 1+ herramienta específica (multímetro O pinzas)
8. Tono: Expert, confiado, empoderador
9. CTA: "¿Comenzamos?", "¿Quieres el link?", "¿Empezamos?"

Responde SOLO 3 respuestas, separadas por "---".
SIN explicaciones, LISTAS PARA COPIAR/PEGAR.`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude API error:', data);
      return res.status(500).json({ 
        error: 'Error generando respuestas',
        success: false 
      });
    }

    const texto = data.content[0].text;
    const respuestasArray = texto
      .split('---')
      .map(r => r.trim())
      .filter(r => r && r.length > 20);

    if (respuestasArray.length < 3) {
      // Si no se generaron 3 respuestas correctamente, retorna un error amigable
      return res.status(500).json({ 
        error: 'No se generaron suficientes respuestas. Intenta de nuevo.',
        success: false 
      });
    }

    return res.status(200).json({
      success: true,
      respuestas: respuestasArray.slice(0, 3)
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Error generando respuestas: ' + error.message,
      success: false 
    });
  }
}
