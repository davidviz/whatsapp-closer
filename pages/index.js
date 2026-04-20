import React, { useState, useEffect } from 'react';
import { Copy, Send, Zap, MessageCircle, Trash2, History } from 'lucide-react';

const PLANTILLAS_TIPICAS = [
  { nombre: "¿Cuánto cuesta?", prompt: "¿Cuánto cuesta el curso de electricista?" },
  { nombre: "¿Es online?", prompt: "¿El curso es online o presencial?" },
  { nombre: "¿Puedo aprender trabajando?", prompt: "Trabajo todo el día, ¿puedo aprender?" },
  { nombre: "¿Cuándo empiezo a ganar?", prompt: "¿Cuándo puedo hacer trabajos y ganar?" },
  { nombre: "¿Cuándo tengo acceso?", prompt: "¿Cuándo puedo acceder al curso?" }
];

export default function GeneradorWhatsApp() {
  const [consultaCliente, setConsultaCliente] = useState('');
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [vistaHistorial, setVistaHistorial] = useState(false);

  useEffect(() => {
    const historialGuardado = localStorage.getItem('historialRespuestas');
    if (historialGuardado) setHistorial(JSON.parse(historialGuardado));
  }, []);

  const guardarEnHistorial = (pregunta, respuestasGeneradas) => {
    const nuevoItem = { id: Date.now(), pregunta, respuestas: respuestasGeneradas, fecha: new Date().toLocaleString() };
    const nuevoHistorial = [nuevoItem, ...historial].slice(0, 20);
    setHistorial(nuevoHistorial);
    localStorage.setItem('historialRespuestas', JSON.stringify(nuevoHistorial));
  };

  const generarRespuestas = async () => {
    if (!consultaCliente.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/generar-respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta: consultaCliente })
      });
      const data = await response.json();
      if (data.success) {
        setRespuestas(data.respuestas);
        guardarEnHistorial(consultaCliente, data.respuestas);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarAlPortapapeles = (texto, index) => {
    navigator.clipboard.writeText(texto);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (vistaHistorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Historial</h1>
            <button onClick={() => setVistaHistorial(false)} className="text-slate-400">← Volver</button>
          </div>
          {historial.length === 0 ? (
            <p className="text-slate-400">Sin historial</p>
          ) : (
            <div className="space-y-3">
              {historial.map((item) => (
                <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-white font-semibold text-sm">{item.pregunta}</p>
                  <button onClick={() => { setConsultaCliente(item.pregunta); setRespuestas(item.respuestas); setVistaHistorial(false); }} className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded">Usar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl font-bold text-white">WhatsApp Closer</h1>
            </div>
            <button onClick={() => setVistaHistorial(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              <History className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-400">Genera respuestas inteligentes para cerrar ventas</p>
        </div>

        <div className="mb-6">
          <p className="text-xs uppercase text-slate-500 font-semibold mb-3">Preguntas típicas:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PLANTILLAS_TIPICAS.map((plantilla, idx) => (
              <button key={idx} onClick={() => setConsultaCliente(plantilla.prompt)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 hover:border-emerald-400">
                {plantilla.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <label className="block text-sm font-semibold text-slate-300 mb-3">¿Qué preguntó el cliente?</label>
          <textarea value={consultaCliente} onChange={(e) => setConsultaCliente(e.target.value)} placeholder="Ej: ¿Cuánto cuesta?" className="w-full bg-slate-900 border border-slate-600 rounded text-white p-4 focus:outline-none focus:border-emerald-400 resize-none" rows="3" />
          <button onClick={generarRespuestas} disabled={!consultaCliente.trim() || loading} className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg">
            <Zap className="w-5 h-5 inline mr-2" />
            {loading ? 'Generando...' : 'Generar Respuestas'}
          </button>
        </div>

        {respuestas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">3 Opciones:</h2>
            {respuestas.map((respuesta, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                <div className="flex justify-between mb-3">
                  <span className="text-emerald-400 font-bold text-sm">Opción {index + 1}</span>
                  <button onClick={() => copiarAlPortapapeles(respuesta, index)} className="p-2">
                    {copiedIndex === index ? <Send className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-slate-300 text-sm">{respuesta}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
