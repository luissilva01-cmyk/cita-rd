// src/utils/cloudinary.js
import axios from "axios";

export async function subirImagenACloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "cita_preset");
  formData.append("folder", "citard");

  const cloudName = "dtm30runb";

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary", error);
    return null;
  }
}

