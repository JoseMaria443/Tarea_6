import { getAsistencias } from "@/api/server";

export const dynamic = 'force-dynamic';

export default async function Asistencias() {
    const asistencias = (await getAsistencias()).reverse()

    return(
        <main className="flex flex-col items-center my-5">
            <div className="flex items-center justify-center py-2">
                <h1 className="text-2xl font-bold">Lista de asistencia</h1>
            </div>
            {asistencias.length ? (
                <div className="w-3/10 p-5">
                    <div className="grid grid-cols-2 gap-5 items-center border-2 p-2">
                        <span>Nombre</span>
                        <span>Fecha de registro</span>
                    </div>
                    {asistencias.map((asis) => ( 
                        <div key={asis.id} className="grid grid-cols-2 gap-5 items-center border-2 p-2">
                            <span>{asis.nombre}</span>
                            <span>{String(asis.fechaRegistro)}</span>
                        </div>
                        ))}
                </div>
            ) : (
                <p>No hay asistencias registradas.</p>
            )}
        </main>
    );
}