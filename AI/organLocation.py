######################################################################################################
########################## SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED ############################
######################## PREGNANCY TRACKER SOURCE CODE VERSION 2.0 (READY FOR DEPLOYMENT) #########
## CODE CLEANED LAST ON: 27-02-2025 ##
## CODE LENGTH OF FILE ORGANLOCATION.PY LINE 57 - LINE 205
## NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT: 8 CHECKS ##
## DATE OF DEVELOPMENT START OF ORGANLOCATION.PY: 10/2/2025 - 27/2/2025 ##
######################## BASIC INFORMATION ABOUT THE FILE ##########################################
# This Python file is part of the medical application responsible for analyzing ultrasound videos
# to detect fetal organ positioning and related anatomical features. Below is a detailed breakdown 
# of the file’s purpose, structure, and functionality:
#
# 1. Video Processing:
#    - Uploaded ultrasound videos are processed frame by frame.
#    - Each frame is analyzed using a YOLOv8-based object detection model.
#    - Results include detection of fetal organs (e.g., placenta, fetal skull, etc.) and confidence scores.
#
# 2. AI-Based Analysis:
#    - Detected objects are classified and annotated directly on frames.
#    - Annotated frames are saved for further reporting and visualization.
#    - Detection statistics are aggregated for summary reporting.
#
# 3. Report Generation:
#    - Final analysis reports include patient details, detected organ data, 
#      confidence levels, and annotated images.
#    - Reports can be saved as PDF for medical documentation.
#
# 4. Dynamic Processing Flow:
#    - Real-time processing with Gradio or similar front-end.
#    - Directories are dynamically cleared and recreated at runtime.
#    - Detected frames are separated into placental and non-placental categories.
#
# 5. Error Handling and Logging:
#    - Comprehensive error handling for video files, frame extraction, and AI model inference.
#    - Logging of detected classes and confidence for each frame.
#
# Key Libraries and Dependencies:
# - OpenCV: Frame extraction and image manipulation.
# - YOLO (Ultralytics): Object detection model for organ detection.
# - Supervision (sv): Wrapper for easier result parsing.
# - Gradio: Real-time interaction interface (optional for deployment mode).
# - FPDF: Report generation.
# - Base64: Frame encoding/decoding for transfer.
# - NumPy, PIL, Matplotlib: Image processing utilities.
#
# Data Flow:
# - Video is uploaded → Processed frame by frame → AI analysis → 
#   Frames categorized & annotated → Results returned → PDF report generated.
#
# ENV OF FILE: BACKEND
# LANGUAGES USED: PYTHON
# SECURITY CODE LEVEL: HIGH
######################################################################################################

#################################### CODE STARTS BELOW ##############################################
# General imports
import os
import cv2
import pdb
import base64
import shutil
import numpy as np
import supervision as sv
import gradio as gr
import matplotlib.pyplot as plt
from ultralytics import YOLO
from PIL import Image
from fpdf import FPDF
from datetime import datetime
from datetime import datetime

# classes : ['baby', 'feto', 'placenta', 'tip']

global final_frames
final_frames = []

'''Directory Configuration'''

# LOGO_PATH = "Logo.png"  # Replace with the actual logo path

# Configuration for deployment
class DeploymentConfig:
   # MODEL_PATH = 'weights/best.pt'
    MODEL_PATH = r'weights\ThirdTrimester\Organ_Location\best.pt'
    VIDEO_SAVE_DIR = "video"
    PLACENTAL_FRAME_DIR = "frames/placental_frames"
    NO_PLACENTAL_FRAME_DIR = "frames/no_placental_frames"
    FRAMES_ANALYSIS_DIR = "frames"
    SELECTED_IMAGES_REPORT = "frames/Report_images"

# Ensure the upload and frame directories exist
def clear_directory(directory):
    """Clear the directory by deleting all files and subdirectories."""
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

# Clear and create necessary directories
clear_directory(DeploymentConfig.VIDEO_SAVE_DIR)
clear_directory(DeploymentConfig.FRAMES_ANALYSIS_DIR)
clear_directory(DeploymentConfig.PLACENTAL_FRAME_DIR)
clear_directory(DeploymentConfig.NO_PLACENTAL_FRAME_DIR)
clear_directory(DeploymentConfig.SELECTED_IMAGES_REPORT)



'''Video Analysis'''


def load_model():
    model = YOLO(DeploymentConfig.MODEL_PATH)
    return model

def add_index_to_frames(frame,frame_number):
        
    frame_with_text = frame.copy()
    text = f"{frame_number}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1
    thickness = 2
    text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
    text_x = (frame.shape[1] - text_size[0]) // 2
    text_y = text_size[1] + 10
    cv2.putText(
        frame_with_text,
        text,
        (text_x, text_y),
        font,
        font_scale,
        (255, 0, 0),  # Blue color in BGR
        thickness,
        cv2.LINE_AA,
    )
    return frame_with_text

# Analyze detection results and save frames
def analyse_result(result, frame_number, frame_with_results, num_placental, confidence, class_name, boxes):
    detections = sv.Detections.from_ultralytics(result)
    classes_detected = detections.data['class_name']

    
    if classes_detected.size > 0:
        class_name = classes_detected.tolist()  # Convert NumPy array to list
        boxes = detections.xyxy
        num_placental += 1
        confidence = detections.confidence[0]
        output_path = os.path.join(DeploymentConfig.PLACENTAL_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
        cv2.imwrite(output_path, frame_with_results)
    else:
        output_path = os.path.join(DeploymentConfig.NO_PLACENTAL_FRAME_DIR, f"frame_{frame_number:04d}.jpg")
        cv2.imwrite(output_path, frame_with_results)
        
    return num_placental, class_name, confidence, boxes

def process_frames5(frames):
   
    num_placental = 0
    confidence = 0.0
    class_name = ''
    boxes = []

    # Load the AI model
    model = load_model()

    for frame_number, frame_data in enumerate(frames):
        try:
            # Decode the base64 frame data to an image
            img_data = base64.b64decode(frame_data.split(",")[1])
            np_img = np.frombuffer(img_data, dtype=np.uint8)
            frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

            # Perform AI predictions for the frame
            results_frame = model(frame)

            for result in results_frame:
                # Annotate the frame with predictions
                frame_with_results = result.plot()

                # Analyze the result and update counters
                num_placental, class_name, confidence, boxes = analyse_result(
                    result, frame_number, frame_with_results, num_placental, confidence, class_name, boxes
                )

                # Ensure all box data is converted to lists (if numpy.ndarray)
                boxes = [box.tolist() if isinstance(box, np.ndarray) else box for box in boxes]

                # Convert the annotated frame to a base64 string
                _, buffer = cv2.imencode('.jpg', frame_with_results)
                annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')

                # Yield the analysis result for this frame
                yield {
                    'frame_number': frame_number,
                    'class_name': class_name,
                    'num_placental': num_placental,
                    'confidence': float(confidence),  # Ensure confidence is a float
                    'boxes': boxes,  # Ensure boxes is a list
                    'annotated_image': annotated_image_base64  # Add the annotated image
                }
        except Exception as e:
            # Handle exceptions and provide debug information if needed
            yield {
                'frame_number': frame_number,
                'error': str(e)
            }
