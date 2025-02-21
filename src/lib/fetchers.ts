export const fetchGET = async (url: string) => {
  const resposta = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body: any = await resposta.json();
  if (!resposta.ok) throw { message: body.error, status: resposta.status };
  return body;
};

export const fetchPOST = async (url: string, dados: any) => {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
  const body: any = await resposta.json();
  console.log(body);

  if (!resposta.ok) throw { message: body.error, status: resposta.status };
  return body;
};
