export const EnlacesSidebar = {
    home: {
        route: '/home',
    },
    grupoFamiliar: {
        registrar: {
            route: '/grupo-familiar/registrar',
        },
        listado: {
            route: '/grupo-familiar/listado',
        },
    },
    integrante: {
        registrar: {
            route: '/integrante/ingresar',
        },
        listado: {
            route: '/integrante/listado',
        },
    },

    usuario: {
        listado: {
            route: '/usuario/ingresar',
        },
        cambioContrasena: {
            route: '/usuario/cambio-password',
        },
        envioCorreo: {
            route: '/usuario/envio-correo',
        },
    },
    pago: {
        registrar: {
            route: '/pago/ingresar',
        },
        listado: {
            route: '/pago/listado',
        },
        carteraVencida: {
            route: '/pago/cartera-vencida',
        },
        matrizOperaciones: {
            route: '/pago/matriz-operaciones',
        },
    },
    aporte: {
        registrar: {
            route: '/aporte/ingresar',
        },
        listado: {
            route: '/aporte/listado',
        },
    },
    vehiculo: {
        registrar: {
            route: '/vehiculo/ingresar',
        },
        listado: {
            route: '/vehiculo/listado',
        },
        activacion: {
            route: '/vehiculo/activacion',
        },
    },

    tag: {
        listado: {
            route: '/tag/listado',
        },
        listadoTag: {
            route: '/tag/listado-tags',
        },
        registrar: {
            route: '/tag/registrar',
        },
        asignacionTag: {
            registrar: { route: '/tag/registrar/asignacion-tag' },
            listado: { route: '/tag/asignacion-listado' },
        },
    },
    mantenimiento: {
        colores: {
            registrar: {
                route: '/mantenimiento/color/registrar',
            },
            listado: {
                route: '/mantenimiento/color/listado',
            },
        },
        calle: {
            registrar: {
                route: '/mantenimiento/calle/registrar',
            },
            listado: {
                route: '/mantenimiento/calle/listado',
            },
        },
        manzana: {
            registrar: {
                route: '/mantenimiento/manzana/registrar',
            },
            listado: {
                route: '/mantenimiento/manzana/listado',
            },
        },
        tipoEdificacion: {
            registrar: {
                route: '/mantenimiento/tipo-edificacion/registrar',
            },
            listado: {
                route: '/mantenimiento/tipo-edificacion/listado',
            },
        },

        marca: {
            registrar: {
                route: '/mantenimiento/marca/registrar',
            },
            listado: {
                route: '/mantenimiento/marca/listado',
            },
        },

        modelo: {
            registrar: {
                route: '/mantenimiento/modelo/registrar',
            },
            listado: {
                route: '/mantenimiento/modelo/listado',
            },
        },
        statusVehiculo: {
            registrar: {
                route: '/mantenimiento/status-vehiculo/registrar',
            },
            listado: {
                route: '/mantenimiento/status-vehiculo/listado',
            },
        },

        valorTag: {
            registrar: {
                route: '/mantenimiento/valor-tag/registrar',
            },
            listado: {
                route: '/mantenimiento/valor-tag/listado',
            },
        },

        statustag: {
            registrar: {
                route: '/mantenimiento/status-tag/registrar',
            },
            listado: {
                route: '/mantenimiento/status-tag/listado',
            },
        },

        parentesco: {
            registrar: {
                route: '/mantenimiento/parentesco/registrar',
            },
            listado: {
                route: '/mantenimiento/parentesco/listado',
            },
        },
        logs: {
            listado: {
                route: '/log/listado',
            },
        },
        tipoIdentificacion: {
            listado: {
                route: '/mantenimiento/tipo-identificacion/registrar',
            },
        },
        modeloMail: {
            listado: {
                route: '/mantenimiento/modelo-mail/listado',
            },
        },

        imagenesSitio: {
            listado: {
                route: '/mantenimiento/imagenes-de-bienvenida/listado',
            },
        },

        migracion: {
            ingresar: {
                route: '/mantenimiento/migracion',
            },
        },
    },
    visitante: {
        listadoMorador: {
            route: '/visitantes/listado-morador',
        },
        listadoVisitante: {
            route: '/visitantes/listado-visitante',
        },
        ingresarEntrada: {
            route: '/visitantes/ingresar-entrada',
        },
        ingresarMorador: {
            route: '/visitantes/ingresar-morador',
        },
    },
}
