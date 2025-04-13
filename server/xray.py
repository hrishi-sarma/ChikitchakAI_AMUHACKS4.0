from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable CORS
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision import models
import torch.nn as nn

app = Flask(__name__)
CORS(app)  # Allow all origins for CORS

# Class names used during training
class_names = [
    'BIOIMPIANTI K mod', 'DJO 3D Knee', 'Exatech Opterak Logic', 'Link Gemini SL',
    'Meril life FREEDOM KNEE', 'Microport MEDIAPIVOT', 'Smith and Nephew GENESIS II',
    'Smith and Nephew Gensis PS', 'Stryker NRG', 'Stryker TRIATHLON',
    'Zimmer Oxford', 'Zimmer UKS (ZUK)', 'Zimmer Vanguard', 'Zimmer persona'
]

def load_model():
    model = models.resnet50(pretrained=False)
    num_classes = len(class_names)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model.load_state_dict(torch.load("resnet_knee_model.pth", map_location=torch.device('cpu')))
    model.eval()
    return model

model = load_model()

# Image transform: same as used during training.
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

@app.route("/api/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == "":
        return jsonify({'error': 'No file selected'}), 400

    try:
        image = Image.open(file).convert('RGB')
    except Exception:
        return jsonify({'error': 'Invalid image file'}), 400

    img_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        confidence, predicted = torch.max(probabilities, 0)
        class_idx = predicted.item()

    # Get top 3 predictions for additional context.
    topk = torch.topk(probabilities, k=3)
    top_preds = []
    for idx, conf in zip(topk.indices, topk.values):
        top_preds.append({
            'class': class_names[idx.item()],
            'confidence': conf.item() * 100  # Convert to percentage.
        })

    result = {
        'prediction': class_names[class_idx],
        'confidence': confidence.item() * 100,
        'top_predictions': top_preds
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
