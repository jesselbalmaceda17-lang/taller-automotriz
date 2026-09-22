const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

export async function request(path, options = {}) {
  let response;
  let data = null;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    data = await parseResponse(response);
  } catch {
    const error = new Error(
      'No se pudo conectar con el servidor. Verifica que Laravel esté ejecutándose.',
    );
    error.status = 0;
    error.errors = {};
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data?.message || getHttpErrorMessage(response.status));
    error.status = response.status;
    error.errors = data?.errors || {};
    throw error;
  }

  return data;
}

function getHttpErrorMessage(status) {
  const messages = {
    401: 'La sesión no es válida. Inicia sesión nuevamente.',
    403: 'No tienes permiso para realizar esta acción.',
    404: 'El recurso solicitado no existe.',
    422: 'Revisa los datos ingresados.',
    500: 'Ocurrió un error interno en el servidor.',
  };

  return messages[status] || 'Ocurrió un error al procesar la solicitud.';
}
