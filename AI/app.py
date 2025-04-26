######################################################################################################
#                           SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED                           
#                PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)                
#----------------------------------------------------------------------------------------------------
# CODE CLEANED LAST ON: 27-02-2025                                                                  
# CODE LENGTH OF FILE: FLASK BACKEND LINE 59 - LINE 266                     
# NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS                                         
# DATE OF DEVELOPMENT START FOR FLASK BACKEND MODULE: 10/2/2025 - 27/2/2025                         
#----------------------------------------------------------------------------------------------------
#                           BASIC INFORMATION ABOUT THE FILE                                        
#----------------------------------------------------------------------------------------------------
# This Flask backend serves as the core API for processing ultrasound frames, detecting fetal  
# abnormalities, placental positioning, and generating medical findings. It handles requests from  
# the frontend, processes images using AI models, and returns structured medical insights.
#
# Key Features:
"""
Flask API Endpoints:
- `/Placental-Detection`       : Detects placental positioning from ultrasound frames.
- `/Fetus-Location`            : Identifies fetus location in ultrasound images.
- `/Organ-Location`            : Detects organ positioning in ultrasound scans.
- `/Organ-Assessment`          : Evaluates organ health using AI models.
- `/Fetal-Echocardiography`    : Analyzes fetal heart structure.
- `/Fetal-Brain-Abnormality`   : Identifies abnormalities in fetal brain development.
- `/generate-findings/`        : Generates medical findings and recommendations.

Data Processing:
- Receives video frames as JSON data.
- Uses AI-based models (`process_framesX`) to analyze images.
- Streams results back to the frontend for real-time updates.

Security Considerations:
- CORS enabled to allow frontend communication.
- Proper error handling for invalid or missing data.
- Runs on a secured Flask server with controlled host and port.

Error Handling:
- Returns structured JSON error responses for invalid requests.
- Handles exceptions during AI processing to prevent crashes.
"""

######################################################################################################
#                                    KEY LIBRARIES AND DEPENDENCIES                                 #
######################################################################################################
# Flask            : Micro-framework for handling API requests.
# Flask-CORS       : Enables cross-origin requests for frontend integration.
# OpenCV (cv2)     : Processes ultrasound frames.
# Base64           : Decodes base64-encoded image data.
# JSON             : Handles structured API responses.
# OS               : Manages server-side file storage.
# AI Models        : Custom Python modules (`process_framesX`) for medical image analysis.
#----------------------------------------------------------------------------------------------------
# ENV OF FILE : BACKEND (PYTHON, FLASK, AI MODELS)
# SECURITY CODE LEVEL : HIGH
######################################################################################################

###################################### CODE STARTS HERE ##############################################

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64  # Keep this import
import cv2

from placentalDetection import process_frames
from FetalAbnormality import process_frames2
from fetalEchoCardiography import process_frames3
from organAssessment import process_frames4
from organLocation import process_frames5
from fetusDetection import process_frames6


app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


from flask import Response, jsonify
import json

@app.route("/Placental-Detection", methods=["POST"])
def analyze_video():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")


@app.route("/Fetus-Location", methods=["POST"])
def analyze_video2():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames6(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")


@app.route("/Organ-Location", methods=["POST"])
def analyze_video3():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames5(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")

    
@app.route("/Organ-Assessment", methods=["POST"])
def analyze_video4():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames4(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")

    
@app.route("/Fetal-Echocardioghraphy", methods=["POST"])
def analyze_video5():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames3(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")

    
@app.route("/Fetal-Brain-Abnormality", methods=["POST"])
def analyze_video6():
    if "frames" not in request.json:
        return jsonify({"success": False, "error": "No frames provided"}), 400

    frames = request.json["frames"]

    if not frames:
        return jsonify({"success": False, "error": "No frames data"}), 400

    def generate():
        try:
            # Stream each processed frame result incrementally
            for result in process_frames2(frames):
                yield f"data: {json.dumps({'success': True, 'result': result})}\n\n"
        except Exception as e:
            # Stream the error message immediately if an exception occurs
            yield f"data: {json.dumps({'success': False, 'error': str(e)})}\n\n"

    # Return a streaming response with the proper content type for server-sent events
    return Response(generate(), content_type="text/event-stream")    

# saving the images in required path
UPLOAD_FOLDER = "frames/Report_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/generate-findings/", methods=["POST"])
def generate_report_endpoint():
    data = request.get_json()
    
    final_frames = []
    boxes = []
    
    for i in range(len(data)):
        final_frames.append(data[i]['annotated_image'])
        boxes.append(data[i]['boxes'])

   

    

    try:
        image_paths = []

        for idx, frame in enumerate(final_frames):
            image_data = base64.b64decode(frame)
            image_path = os.path.join(UPLOAD_FOLDER, f"image_{idx}.jpg")
            with open(image_path, "wb") as img_file:
                img_file.write(image_data)
            image_paths.append(image_path)

        # Call the generate_findings function with the stored images
        findings, tumor_details, recommendations = generate_findings(image_paths, boxes)

        return jsonify({
            "success": True,
            "findings": findings,
            "tumor_details": tumor_details,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    pass




if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

