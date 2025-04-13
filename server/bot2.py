from flask import Flask, request, render_template, jsonify
from groq import Groq
import json
import os

app = Flask(__name__)
os.environ["GROQ_API_KEY"] = "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"
client = Groq()

DOCTORS_DATABASE = [
    {"name": "Dr. Alice Johnson", "specialization": "Cardiology", "experience": "15 years", "contact": "555-0123"},
    {"name": "Dr. Robert Smith", "specialization": "Neurology", "experience": "12 years", "contact": "555-0124"},
    {"name": "Dr. Emily Chen", "specialization": "Dermatology", "experience": "10 years", "contact": "555-0125"},
    {"name": "Dr. Michael Rodriguez", "specialization": "Orthopedics", "experience": "20 years", "contact": "555-0126"},
    {"name": "Dr. Sarah Williams", "specialization": "Gastroenterology", "experience": "8 years", "contact": "555-0127"},
    {"name": "Dr. James Wilson", "specialization": "Pulmonology", "experience": "14 years", "contact": "555-0128"},
    {"name": "Dr. Lisa Brown", "specialization": "Endocrinology", "experience": "11 years", "contact": "555-0129"},
    {"name": "Dr. Mark Davis", "specialization": "Psychiatry", "experience": "9 years", "contact": "555-0130"},
    {"name": "Dr. Nancy Lee", "specialization": "Ophthalmology", "experience": "16 years", "contact": "555-0131"},
    {"name": "Dr. Thomas Martin", "specialization": "ENT", "experience": "13 years", "contact": "555-0132"},
    {"name": "Dr. Jennifer Garcia", "specialization": "General Practice", "experience": "8 years", "contact": "555-0133"},
]

def generate_medical_response(symptoms, doctors_data):
    """Use Groq API to analyze symptoms and recommend doctors"""
    
    system_prompt = f"""
    You are a medical assistant chatbot designed to provide preliminary analysis of symptoms.
    
    Your responsibilities are:
    1. Analyze the symptoms provided by the user
    2. Identify possible conditions that match these symptoms (list 2-4 possibilities with varying levels of severity)
    3. Suggest general treatment approaches for each condition
    4. Recommend which type of specialist the user should consult
    5. Recommend specific doctors from the database based on the appropriate specialization

    Always include appropriate medical disclaimers and encourage seeking professional medical advice.
    
    Doctor database: {json.dumps(doctors_data)}
    
    IMPORTANT: Your response must be in valid JSON format with the following structure:
    {{
        "possible_conditions": [
            {{
                "condition": "Name of condition",
                "likelihood": "low/medium/high",
                "description": "Brief description",
                "general_treatment": "General treatment approaches",
                "recommended_specialist": "Type of specialist"
            }}
        ],
        "recommended_doctors": [
            {{
                "name": "Doctor name",
                "specialization": "Doctor specialization",
                "experience": "Experience",
                "contact": "Contact info"
            }}
        ],
        "general_advice": "General advice about the symptoms",
        "disclaimer": "Medical disclaimer"
    }}
    """
    user_message = f"Analyze these symptoms: {symptoms}"
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,  # Lower temperature for more reliable medical information
            max_completion_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
    
    except Exception as e:
        return {
            "error": f"An error occurred: {str(e)}",
            "possible_conditions": [],
            "recommended_doctors": [],
            "general_advice": "Unable to analyze symptoms at this time.",
            "disclaimer": "This is not medical advice. Please consult a healthcare professional."
        }
import os

if not os.path.exists('templates'):
    os.makedirs('templates')
with open('templates/index.html', 'w') as f:
    f.write('''
<!DOCTYPE html>
<html>
<head>
    <title>Medical Symptom Analyzer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        /* CSS styles here */
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        /* Add remaining CSS styles */
        .doctor {
            margin-bottom: 10px;
            padding: 8px;
            background-color: #ffffff;
            border-left: 4px solid #4CAF50;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .advice, .disclaimer {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
        }
        .advice {
            background-color: #e7f3fe;
            border-left: 4px solid #2196F3;
        }
        .disclaimer {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        h3 {
            color: #2a5885;
            margin-top: 20px;
        }
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
            display: none;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<!-- Rest of the HTML content -->
</html>
    ''')
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if request.method == 'POST':
        data = request.get_json()
        symptoms = data.get('symptoms', '')
        
        if not symptoms:
            return jsonify({"error": "No symptoms provided"})
        
        result = generate_medical_response(symptoms, DOCTORS_DATABASE)
        return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)