from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from groq import Groq

app = FastAPI(
    title="Medical Symptom Analyzer API",
    description="API for analyzing medical symptoms and recommending doctors",
    version="1.0.0"
)

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

class SymptomRequest(BaseModel):
    symptoms: str

class Condition(BaseModel):
    condition: str
    likelihood: str
    description: str
    general_treatment: str
    recommended_specialist: str

class Doctor(BaseModel):
    name: str
    specialization: str
    experience: str
    contact: str

class MedicalResponse(BaseModel):
    possible_conditions: List[Condition]
    recommended_doctors: List[Doctor]
    general_advice: str
    disclaimer: str

class ErrorResponse(BaseModel):
    error: str
    possible_conditions: List = []
    recommended_doctors: List = []
    general_advice: str = "Unable to analyze symptoms at this time."
    disclaimer: str = "This is not medical advice. Please consult a healthcare professional."

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
            temperature=0.2, 
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

@app.get("/")
async def root():
    """Root endpoint that returns basic API information"""
    return {
        "message": "Welcome to the Medical Symptom Analyzer API",
        "usage": "Send a POST request to /analyze with your symptoms"
    }

@app.post("/analyze", response_model=MedicalResponse)
async def analyze_symptoms(request: SymptomRequest):
    """Analyze symptoms and provide medical recommendations"""
    try:
        if not request.symptoms.strip():
            raise HTTPException(status_code=400, detail="Symptoms cannot be empty")
            
        response = generate_medical_response(request.symptoms, DOCTORS_DATABASE)
        
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
            
        return response
        
    except Exception as e:
        error_response = ErrorResponse(error=str(e))
        return error_response

@app.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    """Return the list of available doctors"""
    return DOCTORS_DATABASE

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)