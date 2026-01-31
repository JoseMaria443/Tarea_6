'use client';
import { getFirmas, guardarFirma } from "@/api/server";
import { firma, firmaRequest } from "@/shared/firmas";
import { useEffect, useState } from "react";

export default function Home() {
  const [firmas, setFirmas] = useState<firma[]>([])
  const [error, setError] = useState({nombre:'', mensaje:'', hayError:false})
  const [ModalOpen, setModalOpen] = useState(false);

  const fetchFirmas = async () => {
    const data = await getFirmas();
    setFirmas(data.reverse());
  }
  
  useEffect(() => { 
    (async () => { await fetchFirmas(); })();
  }, [])

  async function submit(formData: FormData) {
    const nombre: string = (formData.get("nombre") ?? '').toString().trim();
    const mensaje: string = (formData.get("mensaje") ?? '').toString().trim();

    const error = {nombre:'', mensaje:'', hayError:false};

    if (!nombre){
      error.nombre = "El nombre es obligatorio.";
      error.hayError = true;
    } else if (nombre.length > 50) {
      error.nombre = "El nombre debe de ser de menos de 50 caracteres.";
      error.hayError = true;
    } else if (nombre.length <= 2) {
      error.nombre = 'El nombre es demasiado corto';
      error.hayError = true;
    }

    if (!mensaje){
      error.mensaje = "El mensaje es obligatorio.";
      error.hayError = true;
    } else if (mensaje.length > 255) {
      error.mensaje = "El mensaje debe de ser de menos de 255 caracteres.";
      error.hayError = true;
    } else if (mensaje.length <= 3) {
      error.mensaje = 'El mensaje es demasiado corto';
      error.hayError = true;
    }

    setError(error);

    if (error.hayError) return;

    const data: firmaRequest = {nombre, mensaje}
    setError({nombre:'', mensaje:'', hayError:false})

    const respose = await guardarFirma(data);
    if ('code' in respose){
      setError({nombre: respose.details?.nombre || '', mensaje: respose.details?.mensaje || '', hayError: true })
      return
    }

    fetchFirmas();
    setModalOpen(false);
  }

  return (
    <main className="flex flex-col gap-2 h-screen py-2 mx-5">
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-1/6"
        onClick={() => setModalOpen(true)}
      >
        Agregar Firma
      </button>

      {ModalOpen && (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center ">
          <form className="flex flex-col gap-5 items-center justify-center bg-orange-950 rounded-lg h-2/3 w-1/3" action={submit}>
            <h1 className="text-2xl my-2">Formulario de Hackathon</h1>

        <div>
        <input placeholder="Nombre" className="border-2 border-gray-300 p-2 rounded-lg" name="nombre"></input>
        {error.hayError && error.nombre && <p className="text-red-500">{error.nombre}</p>}
        </div>

        <div>
        <input placeholder="Mensaje" className="border-2 border-gray-300 p-2 rounded-lg" name="mensaje"></input>
        {error.hayError && error.mensaje && <p className="text-red-500">{error.mensaje}</p>}
        </div>

            <button className="bg-blue-500 text-white px-22 py-2 rounded-lg hover:bg-blue-600">
              Enviar
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-red-500 text-white px-20 py-2 rounded-lg hover:bg-red-600">cancelar</button>
          </form>
        </div>
      )}
      {ModalOpen && (
        <div 
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        />
      )}

      {firmas.length ? (
        <div className="grid grid-cols-3 gap-2 h-1/3">
          {firmas.map((firma) => (
            <div key={firma.id} className="flex flex-col bg-orange-600 max-h-50 rounded-lg p-2">
              <h2 className="text-xl font-bold">{firma.nombre}</h2>
              <p>{firma.mensaje}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Aún no hay firmasss</p>
      )}
    </main>
  );
}
