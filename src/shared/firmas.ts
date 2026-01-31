import { UUID } from "crypto"

export interface firma {
    id: UUID;
    nombre: string,
    mensaje: string,
    fechaRegistro: Date
};

export interface firmaRequest {
    nombre: string,
    mensaje: string
}

export interface asistencia {
    id: UUID,
    nombre: string,
    fechaRegistro: Date
}

export interface errorRes {
    code: string,
    message: string,
    details: Record<string, any>
}
