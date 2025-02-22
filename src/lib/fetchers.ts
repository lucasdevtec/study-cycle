export const fetchGET = async <T>(url: string): Promise<T> => {
  const resposta = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body: T = await resposta.json();
  if (!resposta.ok) throw { message: (body as { error: string }).error || 'Erro desconhecido', status: resposta.status };
  return body;
};

export const fetchPOST = async <T, D>(url: string, dados: D): Promise<T> => {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
  const body: T = await resposta.json();

  if (!resposta.ok) throw { message: (body as { error: string }).error || 'Erro desconhecido', status: resposta.status };
  return body;
};

export const fetchPUT = async <T, D>(url: string, dados: D): Promise<T> => {
  const resposta = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
  const body: T = await resposta.json();

  if (!resposta.ok) throw { message: (body as { error: string }).error || 'Erro desconhecido', status: resposta.status };
  return body;
};

export const fetchDELETE = async <T>(url: string): Promise<T> => {
  const resposta = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body: T = await resposta.json();
  if (!resposta.ok) throw { message: (body as { error: string }).error || 'Erro desconhecido', status: resposta.status };
  return body;
};
