
export const backendDateToInputDate = (backendDate: string): string => {
  if (!backendDate) return '';
  try {
    const date = new Date(backendDate);
    if (isNaN(date.getTime())) {
      if (backendDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return backendDate;
      }
      return '';
    }
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error convirtiendo fecha del backend:', error);
    return '';
  }
};


export const inputDateToBackendDate = (inputDate: string): string => {
  if (!inputDate) return '';
  
  try {
    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString();
  } catch (error) {
    console.error('Error convirtiendo fecha para backend:', error);
    return '';
  }
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};