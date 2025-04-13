from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all origins

# SNP Database (from gene.py)
SNP_DATABASE = {
    "rs9939609": {
        "gene": "FTO",
        "risk_allele": "A",
        "normal_allele": "T",
        "homozygous_risk": {
            "condition": "Higher obesity risk",
            "lifestyle_advice": "Consider a lower-calorie diet, regular exercise routine, and monitoring weight carefully.",
            "nutrition_advice": "Focus on high protein, low glycemic index foods. Limit processed foods and sugars.",
            "risk_factor": 1.67,
            "predictive_health": "Increased likelihood of obesity-related diseases like type 2 diabetes, heart disease, etc.",
        },
        "heterozygous": {
            "condition": "Moderate obesity risk",
            "lifestyle_advice": "Regular physical activity and mindful eating habits recommended.",
            "nutrition_advice": "Balanced diet with portion control. Moderate carbohydrate intake.",
            "risk_factor": 1.3,
            "predictive_health": "Moderate risk of developing obesity-related conditions over time.",
        },
        "normal": {
            "condition": "Typical obesity risk",
            "lifestyle_advice": "Maintain standard healthy lifestyle choices.",
            "nutrition_advice": "Follow general nutritional guidelines.",
            "risk_factor": 1.0,
            "predictive_health": "Low likelihood of obesity-related health issues in the near future.",
        }
    },
    # Include other SNPs from your file (rs1234567, rs7891011)...
}

def simulate_health_condition(report):
    condition_outcome = {}
    if report['condition'] == "Higher obesity risk":
        health_risk = report['risk_factor'] * 100
        if health_risk > 150:
            condition_outcome['obesity'] = "High likelihood of developing obesity and related diseases."
        elif health_risk > 100:
            condition_outcome['obesity'] = "Moderate risk over time. Regular health checks advised."
        else:
            condition_outcome['obesity'] = "Low risk, but maintain a healthy lifestyle."
    return condition_outcome

def interpret_snp(rsid, genotype):
    snp_info = SNP_DATABASE.get(rsid)
    if not snp_info:
        return None

    risk_allele = snp_info["risk_allele"]
    normal_allele = snp_info["normal_allele"]
    alleles = sorted(genotype)

    if alleles[0] == risk_allele and alleles[1] == risk_allele:
        category = "homozygous_risk"
    elif risk_allele in alleles and normal_allele in alleles:
        category = "heterozygous"
    else:
        category = "normal"

    report = {
        "rsid": rsid,
        "gene": snp_info["gene"],
        "genotype": genotype,
        "category": category,
        "condition": snp_info[category]["condition"],
        "lifestyle_advice": snp_info[category]["lifestyle_advice"],
        "nutrition_advice": snp_info[category]["nutrition_advice"],
        "predictive_health": snp_info[category]["predictive_health"],
        "risk_factor": snp_info[category]["risk_factor"],
    }

    report["health_report"] = simulate_health_condition(report)
    return report

@app.route("/api/analyze-genome", methods=["POST"])
def analyze_genome():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    text = file.read().decode("utf-8")

    reports = []
    for line in text.splitlines():
        parts = line.strip().split()
        if len(parts) == 2:
            rsid, genotype = parts
            result = interpret_snp(rsid, genotype)
            if result:
                reports.append(result)

    return jsonify({"results": reports})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
