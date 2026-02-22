import { defineAction } from "astro:actions";
import { z } from "astro/zod";

const str = (msg: string) =>
  z.preprocess((v) => v ?? '', z.string().min(2, msg));

export const contact = {
  sendEmail: defineAction({
    accept: 'form',
    input: z.object({
      name: str('El nombre debe tener al menos 2 caracteres'),
      email: z.preprocess((v) => v ?? '', z.string().email('El email no es válido')),
      subject: str('El asunto debe tener al menos 2 caracteres'),
      message: str('El mensaje debe tener al menos 20 caracteres'),
    }),
    handler: async ({ name, email, subject, message }) => {
      const url = `${import.meta.env.HOME_URL}/wp-json/contact-form-7/v1/contact-forms/277/feedback`;

      const formData = new FormData();
      formData.append('your-name', name);
      formData.append('your-email', email);
      formData.append('your-subject', subject);
      formData.append('your-message', message);
      formData.append('_wpcf7_unit_tag', 'wpcf7-f277-p1-o1'); // Tag estándar de CF7

      try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    console.log('Respuesta de WP:', json);

    // CF7 devuelve 200 OK incluso si hay errores de validación internos,
    // por lo que debemos revisar json.status
    if (json.status === 'validation_failed' || json.status === 'mail_failed') {
      return { success: false, message: json.message };
    }

    if (!response.ok) {
      return { success: false, message: 'Error en el servidor' };
    }

    return { success: true, message: json.message };

  } catch (error) {
    console.error('Error en fetch:', error);
    return { success: false, message: 'No se pudo conectar con el servidor' };
  }
    }
  })
}
