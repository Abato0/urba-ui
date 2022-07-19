import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    IGetVehiculo,
    useGetVehiculoQuery,
} from '../../../components/vehiculo/use-vehiculo'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../../utils/is-nil-empty'

import FormIngresarVehiculos, {
    IVehiculoInputRegistro,
} from '../../../components/vehiculo/vehiculo-form'
import { isNil } from 'ramda'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
// import saveFileByUrl from 'save-file-by-url';

export interface IVehiculoNormalizeRegistro {
    idGrupoFamiliar: number
    tipo_vehiculo: string
    placa: string
    marca: string
    color: string
    modelo: string
    // matriculaPdf?: string;
}

const extractData = (
    data?: IGetVehiculo
): IVehiculoInputRegistro | undefined => {
    // if(data  && data.GetVehiculos){
    //   const mFronto
    //   console.log("matricula frontal")
    // }
    // const result=null

    if (data && data.GetVehiculos) {
        // console.log("data.GetVehiculos: ",data.GetVehiculos)
        // const mFrontal = await getFileFromUrl(
        //   data.GetVehiculos.matriculaFrontal,
        //   "matriculaFrontal.jpg"
        // );

        // const mReverso = await getFileFromUrl(
        //   data.GetVehiculos.matriculaFrontal,
        //   "matriculaFrontal.jpg"
        // );
        // const cFrontal = await getFileFromUrl(
        //   data.GetVehiculos.matriculaFrontal,
        //   "matriculaFrontal.jpg"
        // );
        // const rFrontal = await getFileFromUrl(
        //   data.GetVehiculos.matriculaFrontal,
        //   "matriculaFrontal.jpg"
        // );

        return {
            idGrupoFamiliar: data.GetVehiculos.grupoFamiliar.id!,
            // tipo_vehiculo: data.GetVehiculos.tipo_vehiculo,
            placa: data.GetVehiculos.placa,
            id_marca: Number(data.GetVehiculos.marca.id),
            id_color: Number(data.GetVehiculos.color.id),
            id_modelo: Number(data.GetVehiculos.modelo.id),
            ano: Number(data.GetVehiculos.ano),
            // id_status: Number(data.GetVehiculos.status.id),
            matriculaFrontal: undefined,
            matriculaReverso: undefined,
            cedulaFrontal: undefined,
            cedulaReverso: undefined,
            num_doc_identidad: data.GetVehiculos.num_doc_identidad ?? '',
            // matriculaPdf: String(data.GetVehiculos.cedulaFrontal),
        }
    }
}

const EditarVehiculo = () => {
    const router = useRouter()
    const [vehiculo, setVehiculo] = useState<IVehiculoInputRegistro>()

    const id: number = useMemo(() => {
        return Number(router.query.id)
    }, [router.query.id])

    const { data, loading, error } = useGetVehiculoQuery(id)

    useEffect(() => {
        if (!loading && isNilOrEmpty(error) && !isNil(data)) {
            // const w = data?.GetVehiculos.matriculaPdf;
            setVehiculo(extractData(data))
        }
    }, [data, loading, error])

    const llenarVehiculo = async () => { }

    return (
        <LayoutTituloPagina titulo="Vehiculo - Actualización">
            {!loading && vehiculo && (
                <FormIngresarVehiculos vehiculo={vehiculo} />
            )}
        </LayoutTituloPagina>
    )
}

export default EditarVehiculo
