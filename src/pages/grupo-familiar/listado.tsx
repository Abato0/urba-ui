import React, { useEffect, useState } from "react";
import {
  useListarGrupoFamiliar,
  useDeleteGrupoFamiliarMutatio,
} from "../../components/grupo-familiar/use-grupo-familia";
import AppLayout from "../../components/layout/app-layout";
//import { head, rows } from "../../components/core/input/data";
// import DataTable from "../../components/table/dataTable";
import { head } from "../../components/grupo-familiar/grupo-familiar-dataTable";
// import { Fade, LinearProgress } from "@material-ui/core";
import { isNil, isEmpty, prop, pluck, omit, map } from "ramda";
// import { Skeleton } from "@material-ui/lab";
import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";
import Fuse from "fuse.js";
import { listadoGrupoFamiliar } from "../../components/grupo-familiar/grupo-familiar-typeDefs";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useDebounce from "../../utils/useDebounce";
import CardTable from "../../components/table/card-table";
import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import XLSX from "xlsx";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";

const getRowId = prop("nombre_familiar");

const optionsFuse: Fuse.IFuseOptions<IGrupoFamiliar> = {
  keys: ["nombre_familiar"],
};

const extractData = (data: any) => {
  return !isNil(data) && !isEmpty(data)
    ? data.ListaGruposFamiliares
    : (data = []);
};

const ListadoUsuario = () => {
  const { data, loading, error } = useQuery(listadoGrupoFamiliar, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const router = useRouter();
  const debounceSearch = useDebounce(search, 300);
  const [mutate] = useDeleteGrupoFamiliarMutatio(0);

  const fuse = React.useMemo(() => {
    if (!isEmpty(data) && !isNil(data)) {
      const myIndex = Fuse.createIndex(optionsFuse.keys!, extractData(data));
      return new Fuse(extractData(data), optionsFuse, myIndex);
    }
  }, [data]);

  React.useEffect(() => {
    if (!isEmpty(debounceSearch) && !isNil(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataTable(result);
    } else {
      setDataTable(extractData(data));
    }
  }, [debounceSearch]);

  React.useEffect(() => {
    if (!loading) setDataTable(extractData(data));
  }, [loading]);

  const onEdit = ({ id }: any) => {
    // Navigate to corresponding filing wizard page to resume filing draft
    if (!isNil(id)) {
      router.push(
        { pathname: "/grupo-familiar/registrar/[id]" },
        `/grupo-familiar/registrar/${encodeURIComponent(id)}`
      );
    }
  };

  const onDelete = async ({ id }: any) => {
    try {
      await mutate({ variables: { id: Number(id) } });
      setTitleModalMsj("Grupo Familiar Eliminado");
      setMensajeModalMsj(
        "El Grupo Familiar seleccionado se ha eliminado correctamente"
      );
      setOpenModalMsj(true);
      setDataTable(extractData(data));
    } catch (error) {
      setTitleModalMsj("Grupo Familiar no Eliminado");
      setMensajeModalMsj(
        "Ha ocurrido un error. El Grupo Familiar seleccionado no se ha eliminado"
      );
      setOpenModalMsj(true);
    }

    // console.log("data onDelete:", data, error);
  };

  const ExportExcel = () => {
    if (isNotNilOrEmpty(dataTable)) {
      const workSheet = XLSX.utils.json_to_sheet(dataTable);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Grupos Familiares");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "GruposFamiliaresData.xlsx");
    }
  };

  return (
    <AppLayout>
      {!loading && (
        <>
          {openModalMsj && (
            <ModalAuth
              openModal={openModalMsj}
              setOpenModal={setOpenModalMsj}
              title={titleModalMsj}
              message={mensajeModalMsj}
            />
          )}

          <CardTable
            columns={head}
            dataTable={dataTable}
            ExportExcel={ExportExcel}
            // data={data}
       
            getRowId={getRowId}
            onEdit={onEdit}
            onDelete={onDelete}
            idTable={"listadoGrupoFamiliarTable"}
            titlePdf={"Listado Grupo Familiar"}
            columnsPdf={["Nombre Familiar", "Celular","Manzana", "Villa","Calle"]}
            search={search}
            setSearch={setSearch}
            lengthData={extractData(data).length}
          />
        </>
      )}
    </AppLayout>
  );
};

export default ListadoUsuario;
