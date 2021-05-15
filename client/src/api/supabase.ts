export async function readRowsFromTable(
  tableName: string,
  tableColumns?: string
) {
  const baseUrl = process.env.SUPABASE_API_URL
    ? process.env.SUPABASE_API_URL
    : 'https://ofqelntiqtgttpzowcxt.supabase.co';

  const apikey = process.env.SUPABASE_API_KEY
    ? process.env.SUPABASE_API_KEY
    : '';

  const apiPath = `${baseUrl}/rest/v1/${tableName}?select=${
    tableColumns ? tableColumns : '*'
  }`;

  const headers = new Headers();
  headers.append('apikey', apikey);

  const res = await fetch(apiPath, {
    method: 'GET',
    mode: 'cors',
    headers,
  });

  return res.json();
}
