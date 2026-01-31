'use server'
import { firma, firmaRequest, asistencia, errorRes } from "@/shared/firmas"
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

const firmasArray: firma[] = [
    { id: randomUUID(), nombre: "Yael", mensaje: "hola, mundo!", fechaRegistro: new Date() },
    { id: randomUUID(), nombre: "Mishell", mensaje: "canto a pie de tu ventana. para que sepas que te quiero", fechaRegistro: new Date() },
    { id: randomUUID(), nombre: "Chema", mensaje: "LOL", fechaRegistro: new Date() },
]

async function getFirmas():Promise<firma[]> { return firmasArray; }

async function guardarFirma(entrada: firmaRequest): Promise<firma | errorRes>{

    let error: errorRes = {code:'', message:'', details: {'': ''}}

    if(!entrada.nombre && !entrada.mensaje){
        error = {code:'BAD_REQUEST', message:'Petición mal hecha', details: { 'nombre':'Este campo es obligatorio', 'mensaje':'Este campo es obligatorio' }}
        return error
    }
    if(!entrada.nombre){
        error = {code:'BAD_REQUEST', message:'Petición mal hecha', details: { 'nombre':'Este campo es obligatorio' }}
        return error
    }
    if(!entrada.mensaje){
        error = {code:'BAD_REQUEST', message:'Petición mal hecha', details: { 'mensaje':'Este campo es obligatorio' }}
        return error
    }

    const data: firma = { id: randomUUID(), nombre: entrada.nombre, mensaje: entrada.mensaje, fechaRegistro: new Date() }

    firmasArray.push(data)
    console.log(firmasArray)

    revalidatePath("/")
    revalidatePath("/asistencia")
    return data
}

async function getAsistencias():Promise<asistencia[]> {
    console.log(firmasArray)
    const asistencias = firmasArray.map((a) => {
        const asis: asistencia = {
            id: a.id,
            nombre: a.nombre,
            fechaRegistro: a.fechaRegistro
        }
        return asis
    });
    return asistencias
}

export {
    getFirmas,
    guardarFirma,
    getAsistencias
}