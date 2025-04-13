import os
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load your Keras model
MODEL_PATH = "fixed_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define the class names according to your skin classification model.
# Update the list as needed with your actual class labels.
class_names = ['Acne', 'Eczema', 'Psoriasis', 'Vitiligo']

def preprocess_image(image, target_size=(180, 180)):
    """Preprocess the image to be suitable for the model input."""
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0  # Normalize pixel values
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.route("/api/predict", methods=["POST"])
def predict():
    # Check if a file part is present in the request
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]
    
    # Validate file name existence
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read the image from the request file stream
        image = Image.open(file.stream)
        processed_image = preprocess_image(image)

        # Get prediction from the model
        predictions = model.predict(processed_image)[0]
        
        # Compute the top three predictions and corresponding confidences (converted to percentages)
        top_indices = predictions.argsort()[-3:][::-1]
        top_preds = []
        for i in top_indices:
            label = class_names[i] if i < len(class_names) else f"Class {i}"
            confidence = float(predictions[i] * 100)
            top_preds.append({"class": label, "confidence": confidence})
        
        # Prepare response: highest prediction is assumed to be the primary result.
        result = {
            "prediction": top_preds[0]["class"],
            "confidence": top_preds[0]["confidence"],
            "top_predictions": top_preds
        }
        
        return jsonify(result)
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # The server will run on port 5002 or a PORT environment variable if set.
    port = int(os.environ.get("PORT", 5002))
    app.run(host="0.0.0.0", port=port)
