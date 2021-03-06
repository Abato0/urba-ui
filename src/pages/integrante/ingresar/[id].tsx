import { useRouter } from 'next/router'
import { isNil } from 'ramda'
import { useEffect, useMemo, useState, useCallback } from 'react'
import IntegranteFormIngresar from '../../../components/integrante/integrante-form-registro'
import {
    IIntegranteVariables,
    useGetIntegranteQuery,
} from '../../../components/integrante/use-intergrante'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../../utils/is-nil-empty'

const IntegranteEditar = () => {
    const router = useRouter()
    const [integranteData, setIntegranteData] = useState<IIntegranteVariables>()
    // const [id, setId] = useState<number>(0);

    const id = useMemo(() => {
        return router.query.id
    }, [router.query.id])

    //   const id = isNotNilOrEmpty(router.query.id) ? router.query.id : 0;

    const { data, loading, error } = useGetIntegranteQuery(Number(id))

    // useEffect(() => {
    //   if (!loading) {
    //     setIntegranteData(data?.GetIntegrante);
    //     console.log("getIntegrante", data?.GetIntegrante);
    //   }
    // }, [loading, error, data]);
    return (
        <LayoutTituloPagina titulo="Integrante Familiar -  Actualización">
            {!loading &&
                !isNil(data) &&
                isNotNilOrEmpty(data.GetIntegrante) && (
                    <IntegranteFormIngresar integrante={data.GetIntegrante} />
                )}
        </LayoutTituloPagina>
    )
}

export default IntegranteEditar
