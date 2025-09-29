const API = 'http://localhost:4000/personal';

export async function getPersonal() {
  const r = await fetch(API);
  if (!r.ok) throw new Error('Error cargando personal');
  return r.json();
}

export async function createPersonal(data) {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Error creando personal');
  return r.json();
}

export async function updatePersonal(id, data) {
  const r = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error('Error actualizando personal');
  return r.json();
}

export async function deletePersonal(id) {
  const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('Error eliminando personal');
  return true;
}
