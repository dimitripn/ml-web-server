const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const predictions = await predictClassification(model, image);
    const [cancer] = predictions;

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    if (cancer === 1) {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    } else {
      result = "Non-cancer";
      suggestion = "Tidak ada cancer";
    }

    const data = {
      id: id,
      result: result,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data: data,
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
}

module.exports = postPredictHandler;
