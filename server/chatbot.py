from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from groq import Groq

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up the Groq API key and client
os.environ["GROQ_API_KEY"] = "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"
client = Groq()

# A static doctors database for chatbot recommendations
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

def generate_medical_response(query, doctors_data):
    """
    Generate a chatbot response based on the user's query.
    The prompt instructs the Groq API chatbot to return a JSON structure with possible conditions,
    recommended doctors, general advice, and a disclaimer.
    """
    system_prompt = f"""
    You are a medical assistant chatbot designed to provide preliminary analysis of health queries.
    
    Your responsibilities are:
    1. Analyze the query provided by the user.
    2. Identify possible conditions or advice that matches the query.
    3. Provide general treatment approaches or recommendations.
    4. Recommend which type of specialist the user should consult.
    5. Recommend specific doctors from the database based on the appropriate specialization.
    
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
        "general_advice": "General advice about the query",
        "disclaimer": "Medical disclaimer"
    }}
    """
    user_message = f"{query}"
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            # Removed max_completion_tokens argument
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        return {
            "error": f"An error occurred: {str(e)}",
            "possible_conditions": [],
            "recommended_doctors": [],
            "general_advice": "Unable to analyze your query at this time.",
            "disclaimer": "This is not medical advice. Please consult a healthcare professional."
        }


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or "query" not in data:
        return jsonify({"error": "No query provided"}), 400
    user_query = data["query"]
    result = generate_medical_response(user_query, DOCTORS_DATABASE)
    return jsonify(result)

if __name__ == '__main__':
    # Run on port 5003 (or set a PORT environment variable)
    port = int(os.environ.get("PORT", 5003))
    app.run(host="0.0.0.0", port=port)
