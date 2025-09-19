import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);

  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  return (
    <>
      <h1>Status</h1>

      <div>
        {`Última atualização: ${isLoading ? "Carregando..." : new Date(data.updated_at).toLocaleString("pt-BR")}`}
      </div>

      <h2>Database</h2>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <div>Versão: {data.dependencies.database.version}</div>
          <div>Conexões abertas: {data.dependencies.database.opened_connections}</div>
          <div>Conexões máximas: {data.dependencies.database.max_connections}</div>
        </>
      )}
    </>
  );
}
