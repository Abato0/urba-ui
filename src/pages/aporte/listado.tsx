import { isEmpty, isNil, pluck, prop } from "ramda";
import { useEffect, useMemo, useState } from "react";
import {
  IAporteVariables,
  ListaAportes,
  useListarAporteQuery,
} from "../../components/aporte/use-aporte";
import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import AppLayout from "../../components/layout/app-layout";
import CardTable from "../../components/table/card-table";
import useDebounce from "../../utils/useDebounce";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import Fuse from "fuse.js";
import { headAporteTable } from "../../components/aporte/aporte-datatable";
import XLSX from "xlsx";

const extractData = (data: ListaAportes) => {
  return isNotNilOrEmpty(data) ? data?.ListaAportes : [];
};

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["nombre_familiar"],
};

const getRowId = prop("id");

const ListadoAporte = () => {
  const { data, loading, error } = useListarAporteQuery();
  const [dataTable, setDataTable] = useState<IAporteVariables[]>([]);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search, 300);
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");

  useEffect(() => {
    if (!loading && isNilOrEmpty(error)) setDataTable(extractData(data!));
  }, [loading, error]);

  const fuse = useMemo(() => {
    if (isNotNilOrEmpty(data)) {
      const myIndex = Fuse.createIndex(optionsFuse.keys!, extractData(data!));
      return new Fuse(extractData(data!), optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataTable(result);
    } else {
      setDataTable(extractData(data!));
    }
  }, [debounceSearch]);

  const onEdit = ({ id }: any) => {
    // // Navigate to corresponding filing wizard page to resume filing draft
    // if (!isNil(id)) {
    //   router.push(
    //     { pathname: "/grupo-familiar/registrar/[id]" },
    //     `/grupo-familiar/registrar/${encodeURIComponent(id)}`
    //   );
    // }

    console.log("funcion");
  };

  const onDelete = async ({ id }: any) => {
    // try {
    //   await mutate({ variables: { id: Number(id) } });
    //   setTitleModalMsj("Grupo Familiar Eliminado");
    //   setMensajeModalMsj(
    //     "El Grupo Familiar seleccionado se ha eliminado correctamente"
    //   );
    //   setOpenModalMsj(true);
    //   setDataTable(extractData(data));
    // } catch (error) {
    //   setTitleModalMsj("Grupo Familiar no Eliminado");
    //   setMensajeModalMsj(
    //     "Ha ocurrido un error. El Grupo Familiar seleccionado no se ha eliminado"
    //   );
    //   setOpenModalMsj(true);
    // }
    // console.log("data onDelete:", data, error);
  };

  const ExportExcel = () => {
    if (isNotNilOrEmpty(dataTable)) {
      const workSheet = XLSX.utils.json_to_sheet(dataTable);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Aportes");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "Listado de Aportes Generados.xlsx");
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
            columns={headAporteTable}
            dataTable={dataTable}
            ExportExcel={ExportExcel}
            // data={data}

            getRowId={getRowId}
            onEdit={onEdit}
            onDelete={onDelete}
            idTable={"aporteTable"}
            titlePdf={"Listado de Aportes Generados"}
            columnsPdf={[
              "Nombre Aporte",
              "Tipo del Aporte",
              "Cuotas",
              "Valor mensual",
              "Fecha inicio",
              "Fecha Fin",
            ]}
            search={search}
            setSearch={setSearch}
            lengthData={extractData(data!).length}
          />
        </>
      )}
    </AppLayout>
  );
};

export default ListadoAporte;
