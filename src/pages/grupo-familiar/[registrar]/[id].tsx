import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { isNil, isEmpty, prop } from 'ramda'
import { useMemo, useEffect, useState } from 'react'
import GrupoFamiliarFormRegistro from '../../../components/grupo-familiar/grupo-familiar-form-registro'
import {
    saveGrupoFamiliar,
    GetGrupoFamiliar,
    updateGrupoFamiliarMutation,
} from '../../../components/grupo-familiar/grupo-familiar-typeDefs'
import { useGetGrupoFamiliar } from '../../../components/grupo-familiar/use-grupo-familia'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import {
    IGrupoFamiliar,
    IGrupoFamiliarInput,
} from '../../../interface/grupo-familiar.interface'
import { codeBase64 } from '../../../utils/file-base64'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../../utils/is-nil-empty'

const UpdateGrupoFamiliar = () => {
    const router = useRouter()
    const [grupoFamiliarData, setGrupoFamiliarData] =
        useState<IGrupoFamiliarInput>()
    // console.log("router: ", router.query);
    const id = useMemo(() => {
        return router.query.id
    }, [router.query.id])

    const { data, loading, error } = useGetGrupoFamiliar(String(id))

    useEffect(() => {
        if (!loading && !isNil(data)) {
            setGrupoFamiliarData(extractData(data.GetGrupoFamiliar))
            console.log('data: ', data, id)
        }
    }, [loading, id, data])

    return !isNil(grupoFamiliarData) && isNotNilOrEmpty(id) ? (
        <LayoutTituloPagina titulo="Grupo Familiar - Actualización">
            {!loading && !isNilOrEmpty(Number(id)) && (
                <GrupoFamiliarFormRegistro
                    mutation={updateGrupoFamiliarMutation}
                    grupoFam={{
                        ...grupoFamiliarData,
                    }}
                    idGrupoFamiliar={Number(id)}
                />
            )}
        </LayoutTituloPagina>
    ) : null
}

const extractData = (data: IGrupoFamiliar): IGrupoFamiliarInput | undefined => {
    console.log('extractData: ', data)
    return !isNil(data) && !isEmpty(data)
        ? {
              calle_interseccion: data.calle_interseccion,
              id_calle_principal: data.calle_principal.id,
              // id_color_fachada: data.color_fachada.id,
              id_manzana: data.manzana.id,
              // id_tipo_edificacion: data.tipo_edificacion.id,
              nombre_familiar: data.nombre_familiar,
              villa: data.villa,
              id_usuario: data.usuario.id,
              // id_calle_interseccion: calle_interseccion
          }
        : undefined
}

export default UpdateGrupoFamiliar
